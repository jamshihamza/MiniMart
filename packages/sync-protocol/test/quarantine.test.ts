/**
 * MM-010 TEST-ONLY, DATABASE-DEPENDENT. Needs PostgreSQL. Incompatible and unregistered messages are
 * quarantined before any inbox claim and never partially applied. Quarantine and terminal state live
 * in test-only tables; `published_at` is set only for delivered messages. Outcome and status choices
 * here (200 with a per-message QUARANTINED, the table vocabularies) are harness choices; the frozen
 * 409-versus-QUARANTINED question stays open.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { TestOnlyCloudIngest } from "./harness/cloud-ingest.js";
import { createDatabasePair, type DatabasePair } from "./harness/database-pair.js";
import { readBacklog } from "./harness/dispatcher.js";
import {
  businessDayFixture,
  createdAtFor,
  OTHER_PEER_ID,
  syntheticUuid,
  TEST_CLOUD_PEER_ID,
  TEST_STORE_PEER_ID,
} from "./harness/fixtures.js";
import { loadFrozenContract } from "./harness/frozen-contract.js";
import { stopManagedPostgres } from "./harness/postgres.js";
import { postFixtureFact } from "./harness/store-seed.js";
import { FaultInjectingTransport } from "./harness/transport.js";
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

const push = async (message: unknown, peer = TEST_STORE_PEER_ID) =>
  (await ingest.push({ peerId: peer, messages: [message] }, peer)).results[0];

describe("an incompatible contract version, end to end", () => {
  it("quarantines it, applies nothing from it, and does not block compatible messages", async () => {
    await postFixtureFact(dbs().store.pool, businessDayFixture(1), { createdAt: createdAtFor(1) });
    await postFixtureFact(dbs().store.pool, businessDayFixture(2, { contractVersion: "2.0" }), {
      createdAt: createdAtFor(2),
    });
    await postFixtureFact(dbs().store.pool, businessDayFixture(3), { createdAt: createdAtFor(3) });

    const transport = new FaultInjectingTransport(directTransport(ingest));
    const dispatcher = makeDispatcher({ pool: dbs().store.pool, transport, contract, clock });
    await drain(dispatcher, dbs().store.pool, clock);

    // Cloud: two effects and two receipts for the compatible messages, none for the quarantined one.
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(2);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(2);
    const quarantined = await dbs().cloud.pool.query<{ message_id: string; problem_code: string }>(
      "SELECT message_id, problem_code FROM spike_mm010.cloud_quarantine",
    );
    expect(quarantined.rows).toEqual([
      { message_id: businessDayFixture(2).eventId, problem_code: "SYNC_MESSAGE_INCOMPATIBLE" },
    ]);
    expect(
      await countRows(dbs().cloud.pool, "integration.dead_letters", "status = 'QUARANTINED'"),
    ).toBe(1);
    expect(
      await countRows(
        dbs().cloud.pool,
        "spike_mm010.cloud_effects",
        `message_id = '${businessDayFixture(2).eventId}'`,
      ),
    ).toBe(0);

    // Store: the quarantined message is terminal, separately from delivery, and is not retried.
    const published = await dbs().store.pool.query<{ event_id: string; published_at: Date | null }>(
      "SELECT event_id, published_at FROM integration.outbox_messages ORDER BY created_at",
    );
    expect(published.rows.map((row) => row.published_at !== null)).toEqual([true, false, true]);
    const terminal = await dbs().store.pool.query<{ outbox_message_id: string; state: string }>(
      "SELECT outbox_message_id, state FROM spike_mm010.store_terminal",
    );
    expect(terminal.rows).toEqual([
      { outbox_message_id: businessDayFixture(2).outboxMessageId, state: "QUARANTINED" },
    ]);
    expect(
      await countRows(dbs().store.pool, "integration.dead_letters", "status = 'QUARANTINED'"),
    ).toBe(1);
    expect(await readBacklog(dbs().store.pool, TEST_CLOUD_PEER_ID)).toMatchObject({
      published: 2,
      pending: 0,
      terminal: 1,
    });

    const callsBefore = transport.calls;
    clock.advance(60_000);
    expect(await dispatcher.runOnce()).toMatchObject({ claimed: 0 });
    expect(transport.calls).toBe(callsBefore);
  });
});

describe("redelivery of a quarantined message", () => {
  it("answers QUARANTINED again and keeps one quarantine row and one dead letter per peer", async () => {
    const bad = envelopeFromFixture(contract, businessDayFixture(2, { contractVersion: "2.0" }));
    expect((await push(bad))?.outcome).toBe("QUARANTINED");
    expect((await push(bad))?.outcome).toBe("QUARANTINED");
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_quarantine")).toBe(1);
    expect(await countRows(dbs().cloud.pool, "integration.dead_letters")).toBe(1);

    // A different peer sending the same message id is a separate quarantine record.
    expect((await push(bad, OTHER_PEER_ID))?.outcome).toBe("QUARANTINED");
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_quarantine")).toBe(2);
    expect(await countRows(dbs().cloud.pool, "integration.dead_letters")).toBe(2);
    expect(await countRows(dbs().cloud.pool, "integration.inbox_receipts")).toBe(0);
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(0);
  });
});

describe("other rejections happen before any storage", () => {
  it("quarantines an unregistered message type", async () => {
    const message = {
      ...envelopeFromFixture(contract, businessDayFixture(1)),
      messageType: "NotARegisteredType",
    };
    const result = await push(message);
    expect(result).toMatchObject({
      outcome: "QUARANTINED",
      problem: { code: "SYNC_MESSAGE_INCOMPATIBLE" },
    });
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_quarantine")).toBe(1);
  });

  it("rejects a structurally invalid message without quarantining or applying it", async () => {
    const message = { ...envelopeFromFixture(contract, businessDayFixture(1)), surprise: true };
    expect(await push(message)).toMatchObject({
      outcome: "REJECTED",
      problem: { code: "VALIDATION_FAILED" },
    });
    for (const table of [
      "spike_mm010.cloud_quarantine",
      "spike_mm010.cloud_effects",
      "integration.inbox_receipts",
      "integration.dead_letters",
    ]) {
      expect(await countRows(dbs().cloud.pool, table)).toBe(0);
    }
  });

  it("rejects a message with no usable identity", async () => {
    expect(await push({ messageType: "BusinessDayStateChanged" })).toMatchObject({
      outcome: "REJECTED",
    });
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_quarantine")).toBe(0);
  });

  it("rejects a valid registered type the harness does not apply", async () => {
    const message = {
      ...envelopeFromFixture(contract, businessDayFixture(1)),
      messageType: "ShiftStateChanged",
      payload: {
        shiftId: syntheticUuid(8, 1),
        status: "FIXTURE_STATUS",
        businessDate: "2026-03-14",
        sourceVersion: 1,
      },
    };
    expect(await push(message)).toMatchObject({
      outcome: "REJECTED",
      problem: { code: "UNSUPPORTED_POLICY" },
    });
    expect(await countRows(dbs().cloud.pool, "spike_mm010.cloud_effects")).toBe(0);
  });
});
