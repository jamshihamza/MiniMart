import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { uuidv7 } from "@minimart/shared-kernel";

import { currentPrices, setItemPrice } from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("pricing", () => {
  it("keeps price history and returns the price effective now", async () => {
    const itemId = uuidv7();
    const at = (iso: string) => ({ ...database.context, now: new Date(iso) });
    await database.transactions.run((sql) =>
      setItemPrice(sql, at("2026-09-26T02:00:00Z"), itemId, "2.5"),
    );
    await database.transactions.run((sql) =>
      setItemPrice(sql, at("2026-09-27T02:00:00Z"), itemId, "2.80"),
    );
    const priceAt = async (iso: string) =>
      (await currentPrices(database.sql, at(iso), [itemId, uuidv7()])).get(itemId);
    expect(await priceAt("2026-09-25T00:00:00Z")).toBeUndefined();
    expect(await priceAt("2026-09-26T12:00:00Z")).toBe("2.50000000");
    expect(await priceAt("2026-09-28T00:00:00Z")).toBe("2.80000000");
    expect((await currentPrices(database.sql, database.context, [])).size).toBe(0);
    const entries = await database.pool.query("SELECT 1 FROM pricing.item_price_entries");
    expect(entries.rows).toHaveLength(2);
  });

  it("rejects a negative or malformed price", async () => {
    await expect(
      database.transactions.run((sql) => setItemPrice(sql, database.context, uuidv7(), "-1")),
    ).rejects.toMatchObject({ code: "PRICE_NEGATIVE" });
    await expect(
      database.transactions.run((sql) => setItemPrice(sql, database.context, uuidv7(), "1,50")),
    ).rejects.toThrow(/Invalid decimal/);
  });
});
