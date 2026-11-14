import { createUser } from "@minimart/module-iam";
import { findActiveStore, provisionStore, type StoreRecord } from "@minimart/module-organization";
import type { StoreContext, TransactionRunner } from "@minimart/shared-kernel";

import { createProductIn } from "./operations.js";

const DEMO_ITEMS: readonly (readonly [string, string, string, string, string, string, string])[] = [
  // code, name, category, barcode, price, cost, opening quantity
  ["MM-00101", "Cola 320ml", "Beverages", "9556001000011", "2.50", "1.60", "48"],
  ["MM-00102", "100 Plus 325ml", "Beverages", "9556001000028", "2.50", "1.65", "48"],
  ["MM-00103", "Milo 200ml", "Beverages", "9556001000035", "2.20", "1.45", "36"],
  ["MM-00104", "Maggie Mee", "Grocery", "9556001000042", "4.50", "3.10", "30"],
  ["MM-00105", "Gardenia Bread", "Bakery", "9556001000059", "2.80", "2.10", "12"],
  ["MM-00106", "Nestle Water 600ml", "Beverages", "9556001000066", "1.20", "0.70", "60"],
  ["MM-00107", "Dutch Lady Milk 1L", "Dairy", "9556001000073", "6.50", "4.90", "18"],
  ["MM-00108", "Lay's Classic 52g", "Snacks", "9556001000080", "4.20", "2.95", "24"],
  ["MM-00109", "KitKat 4F", "Snacks", "9556001000097", "3.50", "2.40", "30"],
  ["MM-00110", "Dettol 250ml", "Personal Care", "9556001000103", "12.90", "9.20", "10"],
];

export const DEMO_CASHIER = "demo.cashier";

/**
 * First-run demonstration data: one company and store, two counters, two users and ten stocked
 * items. Does nothing when a store already exists.
 */
export async function seedDemoStore(
  transactions: TransactionRunner,
  now: Date,
): Promise<{ readonly store: StoreRecord; readonly seeded: boolean }> {
  return transactions.run(async (sql) => {
    const existing = await findActiveStore(sql);
    if (existing !== null) return { store: existing, seeded: false };
    const store = await provisionStore(sql, {
      companyLegalName: "MiniMart Sdn Bhd",
      companyDisplayName: "MiniMart",
      storeCode: "S01",
      storeName: "MiniMart Central",
      timezoneName: "Asia/Kuala_Lumpur",
      currencyCode: "MYR",
      countryCode: "MY",
      counters: [
        { code: "POS01", name: "Counter 01" },
        { code: "POS02", name: "Counter 02" },
      ],
      now,
    });
    const cashier = await createUser(sql, store.tenantId, DEMO_CASHIER, now);
    await createUser(sql, store.tenantId, "store.manager", now);
    const context: StoreContext = {
      tenantId: store.tenantId,
      companyId: store.companyId,
      storeId: store.storeId,
      currencyCode: store.currencyCode,
      timezoneName: store.timezoneName,
      actorId: cashier.userId,
      now,
    };
    for (const [itemCode, name, categoryName, barcode, price, cost, quantity] of DEMO_ITEMS) {
      await createProductIn(sql, context, {
        itemCode,
        name,
        categoryName,
        barcode,
        sellingPrice: price,
        openingQuantity: quantity,
        openingUnitCost: cost,
      });
    }
    return { store, seeded: true };
  });
}
