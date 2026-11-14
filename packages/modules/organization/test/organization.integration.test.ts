import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { findActiveStore, listCounters, provisionStore, requireCounter } from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("organization", () => {
  it("reads the active store and its counters", async () => {
    const store = await findActiveStore(database.sql);
    expect(store).toMatchObject({ storeCode: "S01", currencyCode: "MYR", countryCode: "MY" });
    const counters = await listCounters(database.sql, database.context);
    expect(counters.map((counter) => counter.counterCode)).toEqual(["POS01"]);
    await expect(
      requireCounter(database.sql, database.context, database.context.tenantId),
    ).rejects.toMatchObject({ code: "COUNTER_NOT_FOUND" });
  });

  it("provisions a second store with counters and requires at least one counter", async () => {
    const input = {
      companyLegalName: "Other Sdn Bhd",
      companyDisplayName: "Other",
      storeCode: "S02",
      storeName: "Other Store",
      timezoneName: "Asia/Kuala_Lumpur",
      currencyCode: "MYR",
      countryCode: "MY",
      counters: [{ code: "POS01", name: "Counter 01" }],
      now: new Date("2026-09-26T03:00:00Z"),
    };
    const store = await provisionStore(database.sql, input);
    expect(await findActiveStore(database.sql, "S02")).toEqual(store);
    expect(await listCounters(database.sql, store)).toHaveLength(1);
    await expect(provisionStore(database.sql, { ...input, counters: [] })).rejects.toMatchObject({
      code: "COUNTER_REQUIRED",
    });
  });
});
