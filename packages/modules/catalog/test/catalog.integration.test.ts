import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createItem, findItemByBarcode, getItems, searchItems } from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("catalog", () => {
  it("creates a complete item and finds it by name, code and barcode", async () => {
    const item = await database.transactions.run((sql) =>
      createItem(sql, database.context, {
        itemCode: "A-1",
        name: "Jasmine Rice 5 kg",
        barcode: " 955 600 1 ",
        categoryName: "Grocery",
      }),
    );
    expect(item).toMatchObject({
      itemCode: "A-1",
      uomCode: "EACH",
      quantityPrecision: 0,
      barcode: "9556001",
      categoryName: "Grocery",
      sellable: true,
      stockManaged: true,
    });
    expect(await getItems(database.sql, database.context, [item.itemId])).toEqual([item]);
    expect(await findItemByBarcode(database.sql, database.context, "9556001")).toEqual(item);
    expect(await findItemByBarcode(database.sql, database.context, "0000")).toBeNull();
    for (const query of ["jasmine", "a-1", "9556001"]) {
      expect(await searchItems(database.sql, database.context, { query })).toEqual([item]);
    }
    expect(await searchItems(database.sql, database.context, { query: "100%" })).toEqual([]);
  });

  it("rejects duplicate codes, duplicate barcodes and missing fields", async () => {
    const create = (input: Parameters<typeof createItem>[2]) =>
      database.transactions.run((sql) => createItem(sql, database.context, input));
    await expect(create({ itemCode: "a-1", name: "Other" })).rejects.toMatchObject({
      code: "ITEM_CODE_TAKEN",
    });
    await expect(
      create({ itemCode: "A-2", name: "Other", barcode: "9556001" }),
    ).rejects.toMatchObject({
      code: "BARCODE_TAKEN",
    });
    await expect(create({ itemCode: "A-3", name: " " })).rejects.toMatchObject({
      code: "ITEM_FIELDS_REQUIRED",
    });
    const weighed = await create({
      itemCode: "A-4",
      name: "Loose Sugar",
      uomCode: "kg",
      fractionalQuantityAllowed: true,
    });
    expect(weighed).toMatchObject({
      uomCode: "KG",
      quantityPrecision: 3,
      categoryName: null,
      barcode: null,
    });
  });
});
