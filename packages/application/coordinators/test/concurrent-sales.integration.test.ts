import { listPositions } from "@minimart/module-inventory";
import { findActiveStore, listCounters } from "@minimart/module-organization";
import { findUser } from "@minimart/module-iam";
import type { StoreContext } from "@minimart/shared-kernel";
import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEMO_CASHIER, openCashierShift, postSale, seedDemoStore } from "../src/index.js";

let database: StoreTestDatabase;
let context: StoreContext;
let counters: string[];
let cola: string;
let plus: string;

beforeAll(async () => {
  database = await createStoreTestDatabase("mm_conc");
  await database.pool.query("DELETE FROM iam.user_accounts");
  await database.pool.query("DELETE FROM org.counters");
  await database.pool.query("DELETE FROM org.stores");
  await database.pool.query("DELETE FROM org.companies");
  await database.pool.query("DELETE FROM org.tenants");
  const now = new Date("2026-09-26T02:00:00Z");
  await seedDemoStore(database.transactions, now);
  const store = await findActiveStore(database.sql);
  const cashier = await findUser(database.sql, store!.tenantId, DEMO_CASHIER);
  context = {
    tenantId: store!.tenantId,
    companyId: store!.companyId,
    storeId: store!.storeId,
    currencyCode: store!.currencyCode,
    timezoneName: store!.timezoneName,
    actorId: cashier!.userId,
    now,
  };
  counters = (await listCounters(database.sql, context)).map((counter) => counter.counterId);
  const items = await database.pool.query<{ item_id: string; item_code: string }>(
    "SELECT item_id, item_code FROM catalog.items WHERE item_code IN ('MM-00101', 'MM-00102')",
  );
  cola = items.rows.find((row) => row.item_code === "MM-00101")!.item_id;
  plus = items.rows.find((row) => row.item_code === "MM-00102")!.item_id;
  for (const [index, counterId] of counters.entries()) {
    await openCashierShift(database.transactions, context, {
      idempotencyKey: `open-shift-${index}-0001`,
      counterId,
      openingCash: "100.00",
    });
  }
}, 120_000);

afterAll(async () => {
  await database.drop();
});

describe("concurrent sales on two counters", () => {
  it("does not deadlock when the same items are sold in opposite order", async () => {
    expect(counters).toHaveLength(2);
    const rounds = 20;
    const work: Promise<unknown>[] = [];
    for (let round = 0; round < rounds; round += 1) {
      for (const [index, counterId] of counters.entries()) {
        const order = index === 0 ? [cola, plus] : [plus, cola];
        work.push(
          postSale(database.transactions, context, {
            idempotencyKey: `concurrent-${round}-${index}`,
            counterId,
            lines: order.map((itemId) => ({ itemId, quantity: "1" })),
            tenders: [{ methodCode: "CASH", amount: "5.00" }],
          }),
        );
      }
    }
    const outcomes = await Promise.allSettled(work);
    const failures = outcomes.filter((outcome) => outcome.status === "rejected");
    expect(failures.map((failure) => String((failure as PromiseRejectedResult).reason))).toEqual(
      [],
    );
    const positions = await listPositions(database.sql, context);
    const onHand = (itemId: string) =>
      positions.find((position) => position.itemId === itemId)?.onHandQty;
    // Seeded with 48 of each; every one of the 40 sales took one of each.
    expect(onHand(cola)).toBe("8.00000000");
    expect(onHand(plus)).toBe("8.00000000");
    const sales = await database.pool.query<{ n: string; documents: string }>(
      "SELECT count(*)::text AS n, count(DISTINCT document_no)::text AS documents FROM sales.sales",
    );
    expect(sales.rows[0]).toEqual({ n: "40", documents: "40" });
  }, 120_000);
});
