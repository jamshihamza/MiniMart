/**
 * MM-010 TEST-ONLY, DATABASE-DEPENDENT. Needs PostgreSQL. A synthetic fact, the production outbox row
 * and the harness envelope side row commit together or not at all. This is NOT a Posting Envelope
 * and proves nothing about the real posting coordinators.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createDatabasePair, type DatabasePair } from "./harness/database-pair.js";
import { businessDayFixture, createdAtFor } from "./harness/fixtures.js";
import { stopManagedPostgres } from "./harness/postgres.js";
import { postFixtureFact } from "./harness/store-seed.js";
import { countRows, resetStore } from "./harness/wiring.js";

let databases: DatabasePair | undefined;
const store = (): DatabasePair["store"] => {
  if (databases === undefined) throw new Error("database pair was not created");
  return databases.store;
};

beforeAll(async () => {
  databases = await createDatabasePair();
}, 240_000);
afterAll(async () => {
  await databases?.drop();
  await stopManagedPostgres();
});
beforeEach(async () => {
  await resetStore(store().pool);
});

const tables = {
  facts: "spike_mm010.store_facts",
  outbox: "integration.outbox_messages",
  side: "spike_mm010.envelope_side",
};

describe("same-transaction outbox with a synthetic fact", () => {
  it("commits the fact, the outbox row and the side row together", async () => {
    const fixture = businessDayFixture(1);
    await postFixtureFact(store().pool, fixture, { createdAt: createdAtFor(1) });
    expect(await countRows(store().pool, tables.facts)).toBe(1);
    expect(await countRows(store().pool, tables.outbox)).toBe(1);
    expect(await countRows(store().pool, tables.side)).toBe(1);

    const row = await store().pool.query<{
      event_id: string;
      event_type: string;
      event_version: number;
      created_at: Date;
      occurred_at: Date;
      contract_version: string;
      published_at: Date | null;
      attempt_count: number;
    }>(
      `SELECT o.event_id, o.event_type, o.event_version, o.created_at, s.occurred_at,
              s.contract_version, o.published_at, o.attempt_count
         FROM integration.outbox_messages o
         JOIN spike_mm010.envelope_side s
           ON s.tenant_id = o.tenant_id AND s.outbox_message_id = o.outbox_message_id`,
    );
    const only = row.rows[0];
    expect(only?.event_id).toBe(fixture.eventId);
    expect(only?.event_type).toBe("BusinessDayStateChanged");
    expect(only?.event_version).toBe(1);
    expect(only?.contract_version).toBe("1.0");
    expect(only?.published_at).toBeNull();
    expect(only?.attempt_count).toBe(0);
    // The explicit occurrence time is preserved and is not the outbox created_at.
    expect(only?.occurred_at.getTime()).toBe(fixture.side.occurredAt.getTime());
    expect(only?.created_at.getTime()).toBe(createdAtFor(1).getTime());
    expect(only?.occurred_at.getTime()).not.toBe(only?.created_at.getTime());
  });

  it("rolls back every row when the transaction fails after the outbox insert", async () => {
    await expect(
      postFixtureFact(store().pool, businessDayFixture(2), {
        createdAt: createdAtFor(2),
        failAfterOutbox: true,
      }),
    ).rejects.toThrow("forced failure after the outbox insert");
    expect(await countRows(store().pool, tables.facts)).toBe(0);
    expect(await countRows(store().pool, tables.outbox)).toBe(0);
    expect(await countRows(store().pool, tables.side)).toBe(0);
  });

  it("leaves earlier committed postings untouched when a later one fails", async () => {
    await postFixtureFact(store().pool, businessDayFixture(1), { createdAt: createdAtFor(1) });
    await expect(
      postFixtureFact(store().pool, businessDayFixture(2), {
        createdAt: createdAtFor(2),
        failAfterOutbox: true,
      }),
    ).rejects.toThrow();
    expect(await countRows(store().pool, tables.outbox)).toBe(1);
  });

  it("rejects a second outbox row with the same tenant and event id", async () => {
    await postFixtureFact(store().pool, businessDayFixture(1), { createdAt: createdAtFor(1) });
    const clash = { ...businessDayFixture(3), eventId: businessDayFixture(1).eventId };
    await expect(
      postFixtureFact(store().pool, clash, { createdAt: createdAtFor(3) }),
    ).rejects.toThrow();
    expect(await countRows(store().pool, tables.facts)).toBe(1);
  });
});
