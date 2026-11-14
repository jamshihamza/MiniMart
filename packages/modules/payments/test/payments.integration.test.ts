import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { uuidv7 } from "@minimart/shared-kernel";

import { isTenderMethod, listTenders, recordSettledCheckout } from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("payments", () => {
  it("posts immutable tenders that add up to the payable amount", async () => {
    const saleId = uuidv7();
    await database.transactions.run((sql) =>
      recordSettledCheckout(sql, database.context, {
        saleId,
        payableAmount: "22.90",
        postingEnvelopeId: uuidv7(),
        tenders: [
          { methodCode: "CARD", amount: "10.00", externalReference: "TXN-1" },
          { methodCode: "CASH", amount: "12.90" },
        ],
      }),
    );
    expect(await listTenders(database.sql, database.context, [saleId])).toEqual([
      { saleId, methodCode: "CARD", amount: "10.00000000", externalReference: "TXN-1" },
      { saleId, methodCode: "CASH", amount: "12.90000000", externalReference: null },
    ]);
    expect(await listTenders(database.sql, database.context, [])).toEqual([]);
    await expect(
      database.pool.query("UPDATE payments.posted_tenders SET amount = 1"),
    ).rejects.toThrow(/immutable/);
  });

  it("rejects a mismatched total and a non-positive component, leaving nothing behind", async () => {
    const attempt = (tenders: { methodCode: "CASH"; amount: string }[]) =>
      database.transactions.run((sql) =>
        recordSettledCheckout(sql, database.context, {
          saleId: uuidv7(),
          payableAmount: "5.00",
          postingEnvelopeId: uuidv7(),
          tenders,
        }),
      );
    await expect(attempt([{ methodCode: "CASH", amount: "4.99" }])).rejects.toMatchObject({
      code: "TENDER_TOTAL_MISMATCH",
    });
    await expect(attempt([{ methodCode: "CASH", amount: "0" }])).rejects.toMatchObject({
      code: "TENDER_AMOUNT_INVALID",
    });
    const payments = await database.pool.query("SELECT 1 FROM payments.checkout_payments");
    expect(payments.rows).toHaveLength(1);
    expect(isTenderMethod("DUITNOW")).toBe(true);
    expect(isTenderMethod("CHEQUE")).toBe(false);
  });
});
