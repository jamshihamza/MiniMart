import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { uuidv7 } from "@minimart/shared-kernel";

import {
  getSale,
  insertCompletedSale,
  listSales,
  nextSaleDocumentNo,
  salesTotals,
} from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("sales", () => {
  const counter = () => ({ counterId: database.counterId, counterCode: database.counterCode });

  async function insert(total: string): Promise<string> {
    const saleId = uuidv7();
    await database.transactions.run(async (sql) => {
      const documentNo = await nextSaleDocumentNo(sql, database.context, counter());
      await insertCompletedSale(sql, database.context, {
        saleId,
        counterId: database.counterId,
        documentNo,
        businessDate: "2026-09-26",
        postingEnvelopeId: uuidv7(),
        subtotal: total,
        discountTotal: "0",
        taxTotal: "0",
        roundingTotal: "0",
        grandTotal: total,
        companySnapshot: { displayName: "Test" },
        storeSnapshot: { storeCode: "S01" },
        lines: [
          {
            saleLineId: uuidv7(),
            lineNo: 1,
            itemId: uuidv7(),
            itemCode: "A-1",
            itemName: "Cola",
            uomCode: "EACH",
            quantity: "2",
            unitPrice: "2.50",
            discountAmount: "0",
            taxAmount: "0",
            lineTotal: total,
            unitCost: "1.60",
          },
        ],
      });
    });
    return saleId;
  }

  it("numbers receipts per counter and reads sales back with their lines", async () => {
    const first = await insert("5.00");
    const second = await insert("7.50");
    const sales = await listSales(database.sql, database.context);
    expect(sales.map((sale) => sale.documentNo)).toEqual(["POS01-000002", "POS01-000001"]);
    const detail = await getSale(database.sql, database.context, first);
    expect(detail).toMatchObject({
      status: "COMPLETED",
      grandTotal: "5.00000000",
      storeSnapshot: { storeCode: "S01" },
    });
    expect(detail?.lines).toEqual([
      expect.objectContaining({ itemName: "Cola", quantity: "2.00000000" }),
    ]);
    expect(await getSale(database.sql, database.context, uuidv7())).toBeNull();
    expect(second).not.toBe(first);
    expect(await salesTotals(database.sql, database.context, "2026-09-26")).toEqual({
      saleCount: 2,
      grandTotal: "12.50000000",
    });
    expect(await listSales(database.sql, database.context, { businessDate: "2026-09-27" })).toEqual(
      [],
    );
  });

  it("rejects a sale with no lines", async () => {
    await expect(
      database.transactions.run((sql) =>
        insertCompletedSale(sql, database.context, {
          saleId: uuidv7(),
          counterId: database.counterId,
          documentNo: "X",
          businessDate: "2026-09-26",
          postingEnvelopeId: uuidv7(),
          subtotal: "0",
          discountTotal: "0",
          taxTotal: "0",
          roundingTotal: "0",
          grandTotal: "0",
          companySnapshot: {},
          storeSnapshot: {},
          lines: [],
        }),
      ),
    ).rejects.toMatchObject({ code: "SALE_EMPTY" });
  });
});
