/**
 * MM-010 TEST-ONLY, DATABASE-DEPENDENT. Needs PostgreSQL. The advisory-lock checkpoint experiment is a
 * HARNESS CHOICE, not a production solution. The frozen sync_checkpoints table has no unique key on
 * (tenant_id, peer_id, stream_code), so concurrent first inserts can duplicate rows unless something
 * serializes them. Delivery correctness never depends on a checkpoint: these tests also run deliveries
 * with checkpoints missing, stale, duplicated and failing.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { TestOnlyCloudIngest } from "./harness/cloud-ingest.js";
import { CHECKPOINT_STREAM, readCheckpointRows, recordCheckpoint } from "./harness/checkpoint.js";
import { createDatabasePair, type DatabasePair } from "./harness/database-pair.js";
import { readBacklog } from "./harness/dispatcher.js";
import {
  businessDayFixture,
  createdAtFor,
  newUuidV7,
  TEST_CLOUD_PEER_ID,
  TEST_TENANT_ID,
} from "./harness/fixtures.js";
import { loadFrozenContract } from "./harness/frozen-contract.js";
import { stopManagedPostgres } from "./harness/postgres.js";
import { postFixtureFact } from "./harness/store-seed.js";
import {
  countRows,
  directTransport,
  drain,
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

const write = (value: string, useLock: boolean) => ({
  tenantId: TEST_TENANT_ID,
  peerId: TEST_CLOUD_PEER_ID,
  streamCode: CHECKPOINT_STREAM,
  value,
  useLock,
  now: clock.now(),
});
const rows = () =>
  readCheckpointRows(dbs().store.pool, TEST_TENANT_ID, TEST_CLOUD_PEER_ID, CHECKPOINT_STREAM);

async function seed(count: number): Promise<void> {
  for (let sequence = 1; sequence <= count; sequence += 1) {
    await postFixtureFact(dbs().store.pool, businessDayFixture(sequence), {
      createdAt: createdAtFor(sequence),
    });
  }
}

/** Polls PostgreSQL until a session in this database waits on an advisory lock. Fails after 3 s. */
async function waitForBlockedAdvisoryLock(): Promise<void> {
  const deadline = Date.now() + 3_000;
  for (;;) {
    const result = await dbs().store.pool.query<{ waiting: string }>(
      `SELECT count(*) AS waiting FROM pg_locks
        WHERE locktype = 'advisory' AND NOT granted
          AND database = (SELECT oid FROM pg_database WHERE datname = current_database())`,
    );
    if (Number(result.rows[0]?.waiting ?? "0") > 0) return;
    if (Date.now() > deadline) throw new Error("writer B never blocked on the advisory lock");
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

/**
 * Resolves when `parties` callers have all arrived. Used by the negative control: both writers read
 * "no row" before either inserts, so the duplicate is guaranteed by construction, not by scheduling.
 */
function barrier(parties: number): () => Promise<void> {
  let arrived = 0;
  let release!: () => void;
  const open = new Promise<void>((resolve) => {
    release = resolve;
  });
  return async () => {
    arrived += 1;
    if (arrived === parties) release();
    await open;
  };
}

describe("concurrent first insertion", () => {
  it("negative control: without the lock, two first writers both insert and leave duplicate rows", async () => {
    const wait = barrier(2);
    await Promise.all([
      recordCheckpoint(dbs().store.pool, write("A", false), { afterRead: wait }),
      recordCheckpoint(dbs().store.pool, write("B", false), { afterRead: wait }),
    ]);
    // Both transactions read "no row" before either inserted. FOR UPDATE on a missing row locks nothing.
    expect((await rows()).count).toBe(2);
  });

  it("with the advisory lock, concurrent first writers leave one row", async () => {
    // Writer A takes the lock, reads "no row" and is held before inserting. Writer B is started only
    // then, and the test waits until PostgreSQL itself shows B blocked on an advisory lock. Only
    // after that is A released. Nothing here depends on timing luck: every step waits on an observed
    // condition.
    let enteredHold!: () => void;
    const aIsHolding = new Promise<void>((resolve) => {
      enteredHold = resolve;
    });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const writerA = recordCheckpoint(dbs().store.pool, write("A", true), {
      afterRead: async () => {
        enteredHold();
        await gate;
      },
    });
    await Promise.race([aIsHolding, writerA]);
    const writerB = recordCheckpoint(dbs().store.pool, write("B", true));
    try {
      await waitForBlockedAdvisoryLock();
      expect((await rows()).count).toBe(0);
    } finally {
      release();
    }
    await Promise.all([writerA, writerB]);

    const result = await rows();
    expect(result.count).toBe(1);
    // B read A's committed row after the lock was released, so it updated instead of inserting.
    expect(result.latestValue).toBe("B");
    expect(result.latestVersion).toBe(1);
  });

  it("updates the single row on later writes", async () => {
    await recordCheckpoint(dbs().store.pool, write("one", true));
    await recordCheckpoint(dbs().store.pool, write("two", true));
    expect(await rows()).toEqual({ count: 1, latestValue: "two", latestVersion: 1 });
  });
});

describe("delivery is independent of checkpoints", () => {
  it("delivers everything when checkpoints are disabled", async () => {
    await seed(4);
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      checkpoint: { enabled: false, useLock: false },
    });
    await drain(dispatcher, dbs().store.pool, clock);
    expect((await rows()).count).toBe(0);
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(4);
  });

  it("delivers everything when the checkpoint is deleted or stale between batches", async () => {
    await seed(6);
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
      batchSize: 2,
    });
    await dispatcher.runOnce();
    expect((await rows()).count).toBe(1);
    await dbs().store.pool.query("DELETE FROM integration.sync_checkpoints");
    await dispatcher.runOnce();
    await dbs().store.pool.query(
      "UPDATE integration.sync_checkpoints SET checkpoint_value = 'stale'",
    );
    await dispatcher.runOnce();
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(6);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      published: 6,
    });
  });

  it("delivers everything when duplicate checkpoint rows already exist", async () => {
    await seed(3);
    for (const value of ["dup-1", "dup-2"]) {
      await dbs().store.pool.query(
        `INSERT INTO integration.sync_checkpoints
           (sync_checkpoint_id, tenant_id, peer_id, stream_code, checkpoint_value, updated_at, created_at, version)
         VALUES ($1, $2, $3, $4, $5, now(), now(), 0)`,
        [newUuidV7(), TEST_TENANT_ID, TEST_CLOUD_PEER_ID, CHECKPOINT_STREAM, value],
      );
    }
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: directTransport(ingest),
      contract,
      clock,
    });
    await drain(dispatcher, dbs().store.pool, clock);
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(3);
    expect((await rows()).count).toBe(2);
  });

  it("delivers everything, and reports the problem, when the checkpoint write itself fails", async () => {
    await seed(3);
    await dbs().store.pool.query(`
      CREATE FUNCTION spike_mm010.fail_checkpoint_write() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'forced checkpoint failure'; END $$;
      CREATE TRIGGER trg_fail_checkpoint_write BEFORE INSERT OR UPDATE ON integration.sync_checkpoints
        FOR EACH ROW EXECUTE FUNCTION spike_mm010.fail_checkpoint_write();`);
    try {
      const dispatcher = makeDispatcher({
        pool: dbs().store.pool,
        transport: directTransport(ingest),
        contract,
        clock,
      });
      const summary = await dispatcher.runOnce();
      expect(summary.checkpointError).toContain("forced checkpoint failure");
      expect(summary).toMatchObject({ applied: 3, terminal: 0, retried: 0 });
      expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
        pending: 0,
        published: 3,
      });
      expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(3);
    } finally {
      await dbs().store.pool.query(`
        DROP TRIGGER trg_fail_checkpoint_write ON integration.sync_checkpoints;
        DROP FUNCTION spike_mm010.fail_checkpoint_write();`);
    }
  });
});
