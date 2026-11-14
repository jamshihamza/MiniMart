import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { parseDec, uuidv7 } from "@minimart/shared-kernel";

import { listMovements, listPositions, postStockMovement } from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("inventory ledger", () => {
  const itemId = uuidv7();
  let effect = 0;
  const move = (quantity: string, cost?: string, key?: string) =>
    database.transactions.run((sql) =>
      postStockMovement(sql, database.context, {
        itemId,
        quantityDelta: parseDec(quantity),
        ...(cost === undefined ? {} : { inboundUnitCost: parseDec(cost) }),
        movementType: "TEST",
        sourceContext: "INVENTORY",
        sourceType: "TEST",
        sourceId: uuidv7(),
        sourceEffectKey: key ?? `test:${(effect += 1)}`,
        postingEnvelopeId: uuidv7(),
        businessDate: "2026-09-26",
      }),
    );
  const position = async () =>
    (await listPositions(database.sql, database.context)).find((entry) => entry.itemId === itemId);

  it("maintains on-hand and moving WAC across inbound and outbound movements", async () => {
    await move("10", "2.00");
    await move("10", "3.00");
    expect(await position()).toMatchObject({ onHandQty: "20.00000000", movingWac: "2.50000000" });
    const out = await move("-5");
    expect(out.unitCost).toBe(parseDec("2.5"));
    expect(await position()).toMatchObject({ onHandQty: "15.00000000", movingWac: "2.50000000" });
    const movements = await listMovements(database.sql, database.context, { itemId });
    expect(movements.map((movement) => movement.quantityDelta)).toEqual([
      "-5.00000000",
      "10.00000000",
      "10.00000000",
    ]);
  });

  it("blocks negative stock, zero quantity and repeated effect keys", async () => {
    await expect(move("-16")).rejects.toMatchObject({ code: "NEGATIVE_STOCK_BLOCKED" });
    await expect(move("0")).rejects.toMatchObject({ code: "QUANTITY_ZERO" });
    await expect(move("1", "2.00", "test:1")).rejects.toThrow(/duplicate key/);
    expect(await position()).toMatchObject({ onHandQty: "15.00000000" });
  });

  it("never lets a ledger row be changed or removed", async () => {
    await expect(database.pool.query("DELETE FROM inventory.stock_movements")).rejects.toThrow(
      /immutable/,
    );
  });
});
