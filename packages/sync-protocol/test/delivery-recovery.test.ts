/**
 * MM-010 TEST-ONLY, DATABASE-DEPENDENT. Needs PostgreSQL. Store-to-Cloud push with fictional
 * BusinessDayStateChanged messages. For this experiment only, APPLIED and DUPLICATE results count as
 * the delivery acknowledgement. The push/ack direction and the 409-versus-QUARANTINED questions are
 * left open. Crash and restart cases are modelled with abandoned leases, new dispatcher instances and
 * terminated database backends; they are NOT operating-system process restarts.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Pool } from "pg";

import { TestOnlyCloudIngest } from "./harness/cloud-ingest.js";
import { CHECKPOINT_STREAM, readCheckpointRows } from "./harness/checkpoint.js";
import { createDatabasePair, type DatabasePair } from "./harness/database-pair.js";
import { readBacklog, TestOnlyDispatcher } from "./harness/dispatcher.js";
import {
  businessDayFixture,
  createdAtFor,
  OTHER_PEER_ID,
  OTHER_TENANT_ID,
  TEST_CLOUD_PEER_ID,
  TEST_STORE_PEER_ID,
  TEST_TENANT_ID,
} from "./harness/fixtures.js";
import { loadFrozenContract } from "./harness/frozen-contract.js";
import { stopManagedPostgres } from "./harness/postgres.js";
import { postFixtureFact } from "./harness/store-seed.js";
import {
  FaultInjectingTransport,
  GatedTransport,
  RecordingTransport,
  SimulatedCrash,
} from "./harness/transport.js";
import {
  countRows,
  directTransport,
  drain,
  envelopeFromFixture,
  makeCloudIngest,
  makeDispatcher,
  ManualClock,
  resetCloud,
  resetStore,
} from "./harness/wiring.js";

const contract = loadFrozenContract();
let databases: DatabasePair | undefined;
const dbs = (): DatabasePair => {
  if (databases === undefined) throw new Error("database pair was not created");
  return databases;
};
let clock: ManualClock;
let ingest: TestOnlyCloudIngest;

beforeAll(async () => {
  databases = await createDatabasePair();
}, 240_000);
afterAll(async () => {
  await databases?.drop();
  await stopManagedPostgres();
});
beforeEach(async () => {
  await resetStore(dbs().store.pool);
  await resetCloud(dbs().cloud.pool);
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

const effects = (): Promise<number> => countRows(dbs().cloud.pool, "spike_mm010.cloud_effects");
const receipts = (): Promise<number> => countRows(dbs().cloud.pool, "integration.inbox_receipts");

describe("round trip", () => {
  it("delivers fictional messages Store to Cloud, applies each once and records delivery", async () => {
    await seed(3);
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
    });
    const summary = await dispatcher.runOnce();
    expect(summary).toMatchObject({
      claimed: 3,
      applied: 3,
      duplicates: 0,
      terminal: 0,
      retried: 0,
    });

    const backlog = await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID);
    expect(backlog).toMatchObject({ published: 3, pending: 0, terminal: 0 });

    const stored = await dbs().cloud.pool.query<{
      message_id: string;
      peer_id: string;
      status: string;
      business_date: string;
      source_version: number;
    }>(
      `SELECT message_id, peer_id, status, business_date::text AS business_date, source_version
         FROM spike_mm010.cloud_effects ORDER BY source_version`,
    );
    expect(stored.rows.map((row) => row.message_id)).toEqual(
      [1, 2, 3].map((n) => businessDayFixture(n).eventId),
    );
    expect(stored.rows.every((row) => row.peer_id === TEST_STORE_PEER_ID)).toBe(true);
    expect(stored.rows.every((row) => row.business_date === "2026-03-14")).toBe(true);

    const receiptRows = await dbs().cloud.pool.query<{ status: string }>(
      "SELECT status FROM integration.inbox_receipts",
    );
    expect(receiptRows.rows.map((row) => row.status)).toEqual(["APPLIED", "APPLIED", "APPLIED"]);

    const published = await dbs().store.pool.query<{
      published_at: Date | null;
      claim_owner: string | null;
    }>("SELECT published_at, claim_owner FROM integration.outbox_messages");
    expect(
      published.rows.every((row) => row.published_at !== null && row.claim_owner === null),
    ).toBe(true);
  });

  it("writes a checkpoint as an optimization only", async () => {
    await seed(2);
    await makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
    }).runOnce();
    const rows = await readCheckpointRows(
      dbs().store.pool,
      TEST_TENANT_ID,
      TEST_CLOUD_PEER_ID,
      CHECKPOINT_STREAM,
    );
    expect(rows.count).toBe(1);
    expect(rows.latestValue).toBe(
      `${createdAtFor(2).toISOString()}|${businessDayFixture(2).outboxMessageId}`,
    );
  });
});

describe("duplicate delivery", () => {
  it("answers DUPLICATE for the same message and keeps one receipt and one effect", async () => {
    const message = envelopeFromFixture(contract, businessDayFixture(1));
    const first = await ingest.push(
      { peerId: TEST_STORE_PEER_ID, messages: [message] },
      TEST_STORE_PEER_ID,
    );
    const second = await ingest.push(
      { peerId: TEST_STORE_PEER_ID, messages: [message] },
      TEST_STORE_PEER_ID,
    );
    expect(first.results[0]?.outcome).toBe("APPLIED");
    expect(second.results[0]?.outcome).toBe("DUPLICATE");
    expect(await effects()).toBe(1);
    expect(await receipts()).toBe(1);
  });

  it("applies one message once when two deliveries race", async () => {
    const message = envelopeFromFixture(contract, businessDayFixture(1));
    const request = { peerId: TEST_STORE_PEER_ID, messages: [message] };
    const outcomes = await Promise.all([
      ingest.push(request, TEST_STORE_PEER_ID),
      ingest.push(request, TEST_STORE_PEER_ID),
    ]);
    expect(outcomes.map((result) => result.results[0]?.outcome).sort()).toEqual([
      "APPLIED",
      "DUPLICATE",
    ]);
    expect(await effects()).toBe(1);
    expect(await receipts()).toBe(1);
  });

  it("scopes deduplication by tenant and peer, not by message id alone", async () => {
    const sameId = envelopeFromFixture(contract, businessDayFixture(1));
    const otherTenant = envelopeFromFixture(
      contract,
      businessDayFixture(1, { tenantId: OTHER_TENANT_ID }),
    );
    const outcome = async (message: typeof sameId, peer: string): Promise<string | undefined> =>
      (await ingest.push({ peerId: peer, messages: [message] }, peer)).results[0]?.outcome;

    expect(await outcome(sameId, TEST_STORE_PEER_ID)).toBe("APPLIED");
    expect(await outcome(sameId, TEST_STORE_PEER_ID)).toBe("DUPLICATE");
    // Same message id and tenant from a different peer is a separate receipt and a separate effect.
    expect(await outcome(sameId, OTHER_PEER_ID)).toBe("APPLIED");
    // Same message id from the same peer under a different tenant is also separate.
    expect(await outcome(otherTenant, TEST_STORE_PEER_ID)).toBe("APPLIED");
    expect(await effects()).toBe(3);
    expect(await receipts()).toBe(3);
  });
});

describe("retries keep one stable identity", () => {
  it("repeats the same messageId, payload and occurredAt on every attempt", async () => {
    await seed(1);
    const faults = new FaultInjectingTransport(directTransport(ingest), ["LOSE_RESPONSE"]);
    const recording = new RecordingTransport(faults);
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: recording,
      contract,
      clock,
    });
    await dispatcher.runOnce();
    clock.advance(60_000);
    await dispatcher.runOnce();
    expect(recording.requests).toHaveLength(2);
    expect(recording.requests[1]?.messages).toEqual(recording.requests[0]?.messages);
    expect(recording.requests[0]?.messages[0]?.messageId).toBe(businessDayFixture(1).eventId);
  });
});

describe("lost request and lost ACK", () => {
  it("retries a lost request and applies the message once", async () => {
    await seed(1);
    const transport = new FaultInjectingTransport(directTransport(ingest), ["LOSE_REQUEST"]);
    const dispatcher = makeDispatcher({ pool: dbs().store.pool, transport, contract, clock });

    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 1, retried: 1, applied: 0 });
    expect(await effects()).toBe(0);
    const pending = await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID);
    expect(pending).toMatchObject({ pending: 1, published: 0, maxPendingAttempts: 1 });
    expect(pending.recentErrors[0]?.lastError).toContain("request lost");

    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 0 });
    clock.advance(10_000);
    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 1, applied: 1 });
    expect(await effects()).toBe(1);
  });

  it("retries after a lost response and the Cloud answers DUPLICATE, with one effect", async () => {
    await seed(1);
    const transport = new FaultInjectingTransport(directTransport(ingest), ["LOSE_RESPONSE"]);
    const dispatcher = makeDispatcher({ pool: dbs().store.pool, transport, contract, clock });

    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 1, retried: 1, applied: 0 });
    // The Cloud already committed; the Store has no acknowledgement and is still pending.
    expect(await effects()).toBe(1);
    expect(await receipts()).toBe(1);
    expect(
      await countRows(dbs().cloud.pool, "integration.inbox_receipts", "status = 'APPLIED'"),
    ).toBe(1);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 1,
      published: 0,
    });
    // Durable Store state after the lost response: released, backed off by one base delay, error kept.
    const afterLoss = await dbs().store.pool.query<{
      published_at: Date | null;
      claim_owner: string | null;
      claim_expires_at: Date | null;
      attempt_count: number;
      last_error: string | null;
      available_at: Date;
    }>(
      `SELECT published_at, claim_owner, claim_expires_at, attempt_count, last_error, available_at
         FROM integration.outbox_messages`,
    );
    expect(afterLoss.rows[0]).toMatchObject({
      published_at: null,
      claim_owner: null,
      claim_expires_at: null,
      attempt_count: 1,
    });
    expect(afterLoss.rows[0]?.last_error).toContain("response lost");
    expect(afterLoss.rows[0]?.available_at.getTime()).toBe(clock.now().getTime() + 1_000);
    expect(await countRows(dbs().store.pool, "spike_mm010.store_terminal")).toBe(0);

    clock.advance(10_000);
    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 1, applied: 0, duplicates: 1 });
    expect(await effects()).toBe(1);
    expect(await receipts()).toBe(1);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      published: 1,
    });
  });
});

describe("crashes modelled as abandoned leases and new dispatcher instances", () => {
  it("recovers after a crash between the send and recording the result", async () => {
    await seed(1);
    const crashing = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      workerId: "worker-a",
      leaseMs: 30_000,
      hooks: {
        afterSend: () => {
          throw new SimulatedCrash();
        },
      },
    });
    await expect(crashing.runOnce()).rejects.toBeInstanceOf(SimulatedCrash);

    // The Cloud committed; the outbox row is still claimed by the abandoned worker.
    expect(await effects()).toBe(1);
    expect(
      await countRows(dbs().cloud.pool, "integration.inbox_receipts", "status = 'APPLIED'"),
    ).toBe(1);
    const claimed = await dbs().store.pool.query<{
      claim_owner: string | null;
      published_at: Date | null;
    }>("SELECT claim_owner, published_at FROM integration.outbox_messages");
    expect(claimed.rows[0]).toMatchObject({ claim_owner: "worker-a", published_at: null });

    const replacement = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      workerId: "worker-b",
    });
    // Before the lease expires a new instance must not take the row.
    expect(await replacement.runOnce()).toMatchObject({ claimed: 0 });
    clock.advance(31_000);
    expect(await replacement.runOnce()).toMatchObject({ claimed: 1, duplicates: 1, applied: 0 });
    expect(await effects()).toBe(1);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      published: 1,
    });
  });

  it("recovers after a crash between the claim and the send", async () => {
    await seed(1);
    const crashing = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      workerId: "worker-a",
      hooks: {
        afterClaim: () => {
          throw new SimulatedCrash();
        },
      },
    });
    await expect(crashing.runOnce()).rejects.toBeInstanceOf(SimulatedCrash);
    expect(await effects()).toBe(0);
    expect(await receipts()).toBe(0);
    const abandoned = await dbs().store.pool.query<{
      claim_owner: string | null;
      published_at: Date | null;
      attempt_count: number;
    }>("SELECT claim_owner, published_at, attempt_count FROM integration.outbox_messages");
    expect(abandoned.rows[0]).toMatchObject({
      claim_owner: "worker-a",
      published_at: null,
      attempt_count: 1,
    });

    clock.advance(31_000);
    const replacement = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      workerId: "worker-b",
    });
    expect(await replacement.runOnce()).toMatchObject({ claimed: 1, applied: 1 });
    const row = await dbs().store.pool.query<{ attempt_count: number }>(
      "SELECT attempt_count FROM integration.outbox_messages",
    );
    expect(row.rows[0]?.attempt_count).toBe(2);
    expect(await effects()).toBe(1);
  });

  it("ends with one effect and a published row after the worker's database backends are terminated mid-run", async () => {
    await seed(2);
    const workerUrl = new URL(dbs().store.connectionString);
    workerUrl.searchParams.set("application_name", "mm010_worker_a");
    const workerPool = new Pool({ connectionString: workerUrl.toString(), max: 3 });
    // Terminating a backend also errors clients that are checked out; the pool handler covers only
    // idle ones, so each worker client needs its own listener. Every error is recorded, and the test
    // fails unless each one is the expected termination, so other failures are not hidden.
    const workerErrors: unknown[] = [];
    const isTermination = (error: unknown): boolean =>
      error instanceof Error &&
      (/terminat/i.test(error.message) || (error as { code?: string }).code === "57P01");
    workerPool.on("error", (error) => workerErrors.push(error));
    workerPool.on("connect", (client) => client.on("error", (error) => workerErrors.push(error)));
    let terminated = 0;
    const doomed = new TestOnlyDispatcher({
      pool: workerPool,
      transport: directTransport(ingest),
      contract,
      workerId: "worker-a",
      remotePeerId: TEST_CLOUD_PEER_ID,
      now: clock.now,
      leaseMs: 30_000,
      batchSize: 10,
      retry: { maxAttempts: 4, baseDelayMs: 1_000, maxDelayMs: 8_000 },
      checkpoint: { enabled: true, useLock: true },
      hooks: {
        afterSend: async () => {
          const result = await dbs().store.pool.query(
            `SELECT pg_terminate_backend(pid) FROM pg_stat_activity
              WHERE application_name = 'mm010_worker_a' AND pid <> pg_backend_pid()`,
          );
          terminated += result.rowCount ?? 0;
        },
      },
    });
    // The worker may or may not record its result before the backends are noticed as dead; either way
    // the end state must be correct once a new dispatcher instance takes over.
    let doomedFailure: unknown;
    await doomed.runOnce().catch((error: unknown) => {
      doomedFailure = error;
    });
    await workerPool.end().catch((error: unknown) => workerErrors.push(error));
    expect(terminated).toBeGreaterThan(0);
    // Only the expected termination may have surfaced; anything else is a real failure.
    expect(workerErrors.filter((error) => !isTermination(error))).toEqual([]);
    if (doomedFailure !== undefined) expect(isTermination(doomedFailure)).toBe(true);
    // The Cloud had already applied both messages when the backends were killed, and nothing is
    // terminal: the outcome is only "not yet recorded as delivered" or "recorded".
    expect(await effects()).toBe(2);
    expect(await countRows(dbs().store.pool, "spike_mm010.store_terminal")).toBe(0);

    clock.advance(31_000);
    const replacement = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      workerId: "worker-b",
    });
    await drain(replacement, dbs().store.pool, clock);
    expect(await effects()).toBe(2);
    expect(await receipts()).toBe(2);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      published: 2,
    });
  });

  it("never lets two concurrent dispatchers claim the same row", async () => {
    await seed(10);
    const gated = new GatedTransport(directTransport(ingest));
    const recordingA = new RecordingTransport(gated);
    const recordingB = new RecordingTransport(directTransport(ingest));
    const workerA = makeDispatcher({
      pool: dbs().store.pool,
      transport: recordingA,
      contract,
      clock,
      workerId: "worker-a",
      batchSize: 5,
    });
    const workerB = makeDispatcher({
      pool: dbs().store.pool,
      transport: recordingB,
      contract,
      clock,
      workerId: "worker-b",
      batchSize: 5,
    });

    const pendingA = workerA.runOnce();
    await gated.started; // worker A has claimed its batch and is held in the send
    const summaryB = await workerB.runOnce();
    gated.open();
    const summaryA = await pendingA;

    const idsA = recordingA.requests.flatMap((request) => request.messages.map((m) => m.messageId));
    const idsB = recordingB.requests.flatMap((request) => request.messages.map((m) => m.messageId));
    expect(summaryA.claimed).toBe(5);
    expect(summaryB.claimed).toBe(5);
    expect(idsA.filter((id) => idsB.includes(id))).toEqual([]);
    expect(new Set([...idsA, ...idsB]).size).toBe(10);
    expect(await effects()).toBe(10);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      published: 10,
    });
  });
});

describe("Cloud-side atomicity", () => {
  it("leaves no receipt and no effect when the apply fails before the receipt is marked applied", async () => {
    await seed(1);
    let failOnce = true;
    const failingIngest = makeCloudIngest(dbs().cloud.pool, contract, clock, {
      beforeMarkApplied: () => {
        if (failOnce) {
          failOnce = false;
          throw new Error("forced failure inside the apply transaction");
        }
      },
    });
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(failingIngest),
      contract,
      clock,
    });
    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 1, retried: 1 });
    expect(await effects()).toBe(0);
    expect(await receipts()).toBe(0);

    clock.advance(10_000);
    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 1, applied: 1 });
    expect(await effects()).toBe(1);
    expect(await receipts()).toBe(1);
  });
});
