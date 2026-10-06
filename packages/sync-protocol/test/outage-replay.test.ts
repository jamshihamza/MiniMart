/**
 * MM-010 TEST-ONLY, DATABASE-DEPENDENT. Needs PostgreSQL. Cloud outage, bounded retry, replay after
 * reconnect, a Cloud failure in the middle of a replay, and delivery-order independence. Retry and
 * backoff values are labelled test-fixture values, not production defaults.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { TestOnlyCloudIngest } from "./harness/cloud-ingest.js";
import {
  createCloudDatabase,
  createDatabasePair,
  type DatabasePair,
} from "./harness/database-pair.js";
import { readBacklog, TEST_FIXTURE_RETRY_POLICY } from "./harness/dispatcher.js";
import { businessDayFixture, createdAtFor, TEST_CLOUD_PEER_ID } from "./harness/fixtures.js";
import { loadFrozenContract } from "./harness/frozen-contract.js";
import { stopManagedPostgres, type IsolatedDatabase } from "./harness/postgres.js";
import { postFixtureFact } from "./harness/store-seed.js";
import {
  FaultInjectingTransport,
  RecordingTransport,
  ReversingTransport,
  type Fault,
} from "./harness/transport.js";
import {
  countRows,
  directTransport,
  drain,
  makeCloudIngest,
  makeDispatcher,
  ManualClock,
  requeueExhausted,
  resetCloud,
  resetStore,
} from "./harness/wiring.js";

const contract = loadFrozenContract();
let databases: DatabasePair | undefined;
let secondCloud: IsolatedDatabase | undefined;
const dbs = (): DatabasePair => {
  if (databases === undefined) throw new Error("database pair was not created");
  return databases;
};
let clock: ManualClock;
let ingest: TestOnlyCloudIngest;

beforeAll(async () => {
  databases = await createDatabasePair();
  secondCloud = await createCloudDatabase();
}, 300_000);
afterAll(async () => {
  await secondCloud?.drop();
  await databases?.drop();
  await stopManagedPostgres();
});
beforeEach(async () => {
  await resetStore(dbs().store.pool);
  await resetCloud(dbs().cloud.pool);
  if (secondCloud !== undefined) await resetCloud(secondCloud.pool);
  clock = new ManualClock();
  ingest = makeCloudIngest(dbs().cloud.pool, contract, clock);
});

async function seed(count: number, firstSequence = 1): Promise<void> {
  for (let sequence = firstSequence; sequence < firstSequence + count; sequence += 1) {
    await postFixtureFact(dbs().store.pool, businessDayFixture(sequence), {
      createdAt: createdAtFor(sequence),
    });
  }
}
const effects = (pool = dbs().cloud.pool): Promise<number> =>
  countRows(pool, "spike_mm010.cloud_effects");

describe("Cloud outage", () => {
  it("lets Store postings continue and makes retries and backlog observable", async () => {
    await seed(3);
    const down = new FaultInjectingTransport(directTransport(ingest), [], "CLOUD_DOWN");
    const dispatcher = makeDispatcher({ pool: dbs().store.pool, transport: down, contract, clock });

    await dispatcher.runOnce();
    clock.advance(10_000);
    await dispatcher.runOnce();
    // The Store keeps posting while the Cloud is unreachable: no posting depends on the Cloud.
    await seed(1, 4);

    const backlog = await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID);
    expect(backlog.pending).toBe(4);
    expect(backlog.published).toBe(0);
    expect(backlog.maxPendingAttempts).toBe(2);
    expect(backlog.oldestPendingCreatedAt?.getTime()).toBe(createdAtFor(1).getTime());
    expect(backlog.recentErrors.length).toBeGreaterThan(0);
    expect(backlog.recentErrors[0]?.lastError).toContain("connection refused");
    expect(await effects()).toBe(0);
  });

  it("stops retrying after the bounded attempts and keeps the business fact", async () => {
    await seed(1);
    const down = new FaultInjectingTransport(directTransport(ingest), [], "CLOUD_DOWN");
    const dispatcher = makeDispatcher({ pool: dbs().store.pool, transport: down, contract, clock });

    for (let attempt = 0; attempt < TEST_FIXTURE_RETRY_POLICY.maxAttempts; attempt += 1) {
      await dispatcher.runOnce();
      clock.advance(TEST_FIXTURE_RETRY_POLICY.maxDelayMs + 1_000);
    }
    const terminal = await dbs().store.pool.query<{ state: string }>(
      "SELECT state FROM spike_mm010.store_terminal",
    );
    expect(terminal.rows.map((row) => row.state)).toEqual(["RETRIES_EXHAUSTED"]);
    const deadLetters = await dbs().store.pool.query<{
      failure_class: string;
      status: string;
      retry_count: number;
    }>("SELECT failure_class, status, retry_count FROM integration.dead_letters");
    expect(deadLetters.rows).toEqual([
      {
        failure_class: "RETRIES_EXHAUSTED",
        status: "RETRIES_EXHAUSTED",
        retry_count: TEST_FIXTURE_RETRY_POLICY.maxAttempts,
      },
    ]);
    // Terminal state is separate from delivery: nothing was delivered, and nothing is deleted.
    expect(
      await countRows(dbs().store.pool, "integration.outbox_messages", "published_at IS NULL"),
    ).toBe(1);
    expect(await countRows(dbs().store.pool, "spike_mm010.store_facts")).toBe(1);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      terminal: 1,
      published: 0,
    });
    expect(down.calls).toBe(TEST_FIXTURE_RETRY_POLICY.maxAttempts);
    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 0 });
  });
});

describe("recovery after bounded retries are exhausted", () => {
  async function exhaust(transport: FaultInjectingTransport): Promise<void> {
    const dispatcher = makeDispatcher({ pool: dbs().store.pool, transport, contract, clock });
    for (let attempt = 0; attempt < TEST_FIXTURE_RETRY_POLICY.maxAttempts; attempt += 1) {
      await dispatcher.runOnce();
      clock.advance(TEST_FIXTURE_RETRY_POLICY.maxDelayMs + 1_000);
    }
  }

  it("replays messages left terminal by an outage once the Cloud is back, applying each once", async () => {
    await seed(3);
    await exhaust(new FaultInjectingTransport(directTransport(ingest), [], "CLOUD_DOWN"));
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      terminal: 3,
      published: 0,
    });
    expect(await effects()).toBe(0);

    // A healthy dispatcher alone never picks terminal rows up again.
    const healthy = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
    });
    expect(await healthy.runOnce()).toMatchObject({ claimed: 0 });

    // Test-only replay (a harness choice, not a frozen procedure) returns them to the queue.
    expect(await requeueExhausted(dbs().store.pool, TEST_CLOUD_PEER_ID, clock.now())).toBe(3);
    await drain(healthy, dbs().store.pool, clock);

    expect(await effects()).toBe(3);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(3);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      terminal: 0,
      published: 3,
    });
    expect(await countRows(dbs().store.pool, "spike_mm010.store_terminal")).toBe(0);
    // The dead-letter rows stay as history: the harness neither updates nor deletes them.
    expect(await countRows(dbs().store.pool, "integration.dead_letters")).toBe(3);
    const row = await dbs().store.pool.query<{ attempt_count: number; last_error: string | null }>(
      "SELECT attempt_count, last_error FROM integration.outbox_messages ORDER BY created_at LIMIT 1",
    );
    expect(row.rows[0]).toEqual({ attempt_count: 1, last_error: null });
  });

  it("answers DUPLICATE on replay when every earlier response was lost, with one effect", async () => {
    await seed(1);
    const lostResponses = new FaultInjectingTransport(
      directTransport(ingest),
      Array.from({ length: TEST_FIXTURE_RETRY_POLICY.maxAttempts }, () => "LOSE_RESPONSE" as const),
    );
    await exhaust(lostResponses);

    // The Cloud applied the message on the first attempt; the Store never learned that.
    expect(await effects()).toBe(1);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(1);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      terminal: 1,
      published: 0,
    });

    expect(await requeueExhausted(dbs().store.pool, TEST_CLOUD_PEER_ID, clock.now())).toBe(1);
    const replay = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
    });
    expect(await replay.runOnce()).toMatchObject({ claimed: 1, applied: 0, duplicates: 1 });
    expect(await effects()).toBe(1);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(1);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      terminal: 0,
      published: 1,
    });
  });

  it("does not requeue a quarantined message", async () => {
    await postFixtureFact(dbs().store.pool, businessDayFixture(1, { contractVersion: "2.0" }), {
      createdAt: createdAtFor(1),
    });
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
    });
    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 1, terminal: 1 });
    expect(await requeueExhausted(dbs().store.pool, TEST_CLOUD_PEER_ID, clock.now())).toBe(0);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      terminal: 1,
      pending: 0,
    });
  });
});

describe("replay after reconnect", () => {
  it("drains a backlog exactly once after an outage and a lost response", async () => {
    await seed(50);
    const plan: Fault[] = ["CLOUD_DOWN", "CLOUD_DOWN", "NONE", "LOSE_RESPONSE", "NONE", "NONE"];
    const transport = new FaultInjectingTransport(directTransport(ingest), plan, "NONE");
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport,
      contract,
      clock,
      batchSize: 20,
    });
    const rounds = await drain(dispatcher, dbs().store.pool, clock);
    expect(rounds.length).toBeGreaterThan(3);
    expect(await effects()).toBe(50);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(50);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      terminal: 0,
      published: 50,
    });
    expect(rounds.some((round) => round.duplicates > 0)).toBe(true);
  });

  it("converges after the Cloud fails part-way through a batch", async () => {
    await seed(20);
    let applied = 0;
    const flaky = makeCloudIngest(dbs().cloud.pool, contract, clock, {
      beforeMarkApplied: () => {
        applied += 1;
        if (applied === 7) throw new Error("forced Cloud failure on the seventh apply");
      },
    });
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(flaky),
      contract,
      clock,
      batchSize: 10,
    });
    const first = await dispatcher.runOnce();
    // Six messages were committed before the failure; the whole batch is retried by the Store.
    expect(first).toMatchObject({ claimed: 10, retried: 10, applied: 0 });
    expect(await effects()).toBe(6);
    // The failed seventh apply rolled back as a unit: no receipt without its effect, and no outbox
    // row of the batch is marked delivered, claimed or terminal.
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(6);
    expect(
      await countRows(dbs().cloud.pool, "integration.inbox_receipts", "status = 'APPLIED'"),
    ).toBe(6);
    expect(
      await countRows(
        dbs().store.pool,
        "integration.outbox_messages",
        "published_at IS NULL AND claim_owner IS NULL AND attempt_count = 1 AND last_error LIKE '%seventh apply%'",
      ),
    ).toBe(10);
    expect(
      await countRows(dbs().store.pool, "integration.outbox_messages", "published_at IS NOT NULL"),
    ).toBe(0);
    expect(await countRows(dbs().store.pool, "spike_mm010.store_terminal")).toBe(0);

    await drain(dispatcher, dbs().store.pool, clock);
    expect(await effects()).toBe(20);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(20);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      published: 20,
    });
  });
});

describe("delivery order does not change the result", () => {
  it("produces the same effects when a backlog is delivered forward or in reverse", async () => {
    const cloudB = secondCloud;
    if (cloudB === undefined) throw new Error("second cloud database was not created");
    await seed(12);

    const forward = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      batchSize: 12,
    });
    await drain(forward, dbs().store.pool, clock);

    // Replay the same backlog to a second Cloud, reversing the order inside the request.
    await dbs().store.pool.query(
      "UPDATE integration.outbox_messages SET published_at = NULL, claim_owner = NULL, claim_expires_at = NULL, attempt_count = 0",
    );
    const ingestB = makeCloudIngest(cloudB.pool, contract, clock);
    const recording = new RecordingTransport(directTransport(ingestB));
    const reversed = makeDispatcher({
      pool: dbs().store.pool,
      transport: new ReversingTransport(recording),
      contract,
      clock,
      batchSize: 12,
    });
    await drain(reversed, dbs().store.pool, clock);

    const sentIds = recording.requests[0]?.messages.map((message) => message.messageId) ?? [];
    expect(sentIds).toEqual([...sentIds].sort().reverse());

    const snapshot = async (pool: DatabasePair["cloud"]["pool"]): Promise<unknown[]> =>
      (
        await pool.query(
          `SELECT message_id, business_day_id, status, business_date::text AS business_date, source_version
             FROM spike_mm010.cloud_effects ORDER BY message_id`,
        )
      ).rows;
    expect(await snapshot(cloudB.pool)).toEqual(await snapshot(dbs().cloud.pool));
    expect(await effects(cloudB.pool)).toBe(12);
  });
});
