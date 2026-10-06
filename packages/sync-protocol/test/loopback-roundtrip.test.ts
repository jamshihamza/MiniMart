/**
 * MM-010 TEST-ONLY, DATABASE-DEPENDENT. Needs PostgreSQL. One end-to-end pass over the loopback HTTP
 * experiment: Store dispatcher, HTTP push, the test-only server on 127.0.0.1, the Cloud ingest and
 * the Cloud database. It makes no authentication, enrollment, mTLS or authorization claim, and an
 * "outage" here is a stopped test server, not an operating-system process restart.
 */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createDatabasePair, type DatabasePair } from "./harness/database-pair.js";
import { readBacklog } from "./harness/dispatcher.js";
import {
  businessDayFixture,
  createdAtFor,
  TEST_CLOUD_PEER_ID,
  TEST_STORE_PEER_ID,
} from "./harness/fixtures.js";
import { loadFrozenContract } from "./harness/frozen-contract.js";
import { HttpPushTransport, TestOnlyLoopbackIngestServer } from "./harness/loopback-server.js";
import { stopManagedPostgres } from "./harness/postgres.js";
import { postFixtureFact } from "./harness/store-seed.js";
import {
  countRows,
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
const servers: TestOnlyLoopbackIngestServer[] = [];

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
});
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.stop()));
});

async function seed(count: number): Promise<void> {
  for (let sequence = 1; sequence <= count; sequence += 1) {
    await postFixtureFact(dbs().store.pool, businessDayFixture(sequence), {
      createdAt: createdAtFor(sequence),
    });
  }
}

async function startServer(): Promise<string> {
  const server = new TestOnlyLoopbackIngestServer(
    makeCloudIngest(dbs().cloud.pool, contract, clock),
  );
  servers.push(server);
  return (await server.start()).url;
}

describe("loopback HTTP experiment", () => {
  it("delivers Store messages to the Cloud database over 127.0.0.1", async () => {
    await seed(5);
    const url = await startServer();
    expect(new URL(url).hostname).toBe("127.0.0.1");
    const dispatcher = makeDispatcher({
      pool: dbs().store.pool,
      transport: new HttpPushTransport(url),
      contract,
      clock,
    });
    await drain(dispatcher, dbs().store.pool, clock);
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(5);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(5);
    // The Cloud-side peer is the server's fixed test identity, not the dispatcher's remote peer id.
    // That choice is the harness's; the frozen meaning of peerId stays open.
    for (const table of ["spike_mm010.cloud_effects", "integration.inbox_receipts"]) {
      expect(await countRows(dbs().cloud.pool, table, `peer_id = '${TEST_STORE_PEER_ID}'`)).toBe(5);
    }
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      pending: 0,
      published: 5,
    });
  });

  it("backs off while the test server is stopped and delivers once it is running again", async () => {
    await seed(3);
    const down = new TestOnlyLoopbackIngestServer(
      makeCloudIngest(dbs().cloud.pool, contract, clock),
    );
    const downUrl = (await down.start()).url;
    await down.stop();

    const failing = makeDispatcher({
      pool: dbs().store.pool,
      transport: new HttpPushTransport(downUrl),
      contract,
      clock,
      workerId: "worker-a",
    });
    expect(await failing.runOnce()).toMatchObject({ claimed: 3, retried: 3, applied: 0 });
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(0);
    expect((await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).pending).toBe(3);

    // A new dispatcher instance with a new transport, as a stand-in for a restart (not an OS restart).
    const url = await startServer();
    clock.advance(10_000);
    const recovered = makeDispatcher({
      pool: dbs().store.pool,
      transport: new HttpPushTransport(url),
      contract,
      clock,
      workerId: "worker-b",
    });
    await drain(recovered, dbs().store.pool, clock);
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(3);
  });
});
