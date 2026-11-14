import {
  getShift,
  listCashMovements,
  listTenderSummaries,
} from "@minimart/module-cash-business-day";
import { searchItems } from "@minimart/module-catalog";
import { listMovements, listPositions } from "@minimart/module-inventory";
import { findActiveStore, listCounters } from "@minimart/module-organization";
import { findUser } from "@minimart/module-iam";
import { getSale } from "@minimart/module-sales";
import { DomainError, type StoreContext } from "@minimart/shared-kernel";
import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  closeCashierShift,
  closeStoreBusinessDay,
  createProduct,
  DEMO_CASHIER,
  openCashierShift,
  postSale,
  postShiftCashMovement,
  postStockAdjustment,
  quoteSale,
  seedDemoStore,
} from "../src/index.js";

let database: StoreTestDatabase;
let context: StoreContext;
let counterId: string;
let itemIds: Map<string, string>;

async function expectDomainError(work: Promise<unknown>, code: string): Promise<void> {
  const error = await work.then(
    () => undefined,
    (reason: unknown) => reason,
  );
  expect(error).toBeInstanceOf(DomainError);
  expect((error as DomainError).code).toBe(code);
}

async function onHand(itemId: string): Promise<string> {
  const positions = await listPositions(database.sql, context);
  return positions.find((position) => position.itemId === itemId)?.onHandQty ?? "missing";
}

beforeAll(async () => {
  database = await createStoreTestDatabase("mm_demo");
  // The fixture store is ignored: remove it so the demo seed provisions its own.
  await database.pool.query("DELETE FROM iam.user_accounts");
  await database.pool.query("DELETE FROM org.counters");
  await database.pool.query("DELETE FROM org.stores");
  await database.pool.query("DELETE FROM org.companies");
  await database.pool.query("DELETE FROM org.tenants");
  const now = new Date("2026-09-26T02:00:00Z");
  const seeded = await seedDemoStore(database.transactions, now);
  expect(seeded.seeded).toBe(true);
  expect((await seedDemoStore(database.transactions, now)).seeded).toBe(false);
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
  counterId = (await listCounters(database.sql, context))[0]!.counterId;
  itemIds = new Map(
    (await searchItems(database.sql, context)).map((item) => [item.itemCode ?? "", item.itemId]),
  );
}, 120_000);

afterAll(async () => {
  await database.drop();
});

describe("demo store flow", () => {
  it("seeds ten priced, stocked items", async () => {
    expect(itemIds.size).toBe(10);
    expect(await onHand(itemIds.get("MM-00101")!)).toBe("48.00000000");
    const byBarcode = await searchItems(database.sql, context, { query: "9556001000042" });
    expect(byBarcode.map((item) => item.name)).toEqual(["Maggie Mee"]);
  });

  it("prices a cart on the server with exact decimals", async () => {
    const quote = await quoteSale(database.sql, context, {
      lines: [
        { itemId: itemIds.get("MM-00101")!, quantity: "3" },
        { itemId: itemIds.get("MM-00110")!, quantity: "1" },
        { itemId: itemIds.get("MM-00101")!, quantity: "1" },
      ],
      tenders: [{ methodCode: "CASH", amount: "50" }],
    });
    expect(quote.lines).toHaveLength(2);
    expect(quote.grandTotal).toBe("22.90");
    expect(quote.itemCount).toBe("5");
    expect(quote.payment).toEqual({
      tenderedTotal: "50.00",
      cashTendered: "50.00",
      appliedTotal: "22.90",
      remaining: "0.00",
      changeDue: "27.10",
      settled: true,
    });
  });

  it("refuses a sale without an open shift", async () => {
    await expectDomainError(
      postSale(database.transactions, context, {
        idempotencyKey: "sale-without-shift",
        counterId,
        lines: [{ itemId: itemIds.get("MM-00101")!, quantity: "1" }],
        tenders: [{ methodCode: "CASH", amount: "2.50" }],
      }),
      "SHIFT_REQUIRED",
    );
  });

  let shiftId: string;

  it("opens one shift per counter and replays the same request", async () => {
    const command = { idempotencyKey: "open-shift-0001", counterId, openingCash: "200.00" };
    const shift = await openCashierShift(database.transactions, context, command);
    shiftId = shift.shiftId;
    expect(shift.status).toBe("OPEN");
    expect(shift.businessDate).toBe("2026-09-26");
    expect(shift.expectedCash).toBe("200.00000000");
    expect((await openCashierShift(database.transactions, context, command)).shiftId).toBe(shiftId);
    await expectDomainError(
      openCashierShift(database.transactions, context, {
        ...command,
        idempotencyKey: "open-shift-0002",
      }),
      "SHIFT_ALREADY_OPEN",
    );
  });

  it("posts a split-tender sale atomically and only once", async () => {
    const command = {
      idempotencyKey: "sale-key-0001",
      counterId,
      lines: [
        { itemId: itemIds.get("MM-00101")!, quantity: "4" },
        { itemId: itemIds.get("MM-00110")!, quantity: "1" },
      ],
      tenders: [
        { methodCode: "CARD", amount: "10.00", reference: "TXN-1" },
        { methodCode: "CASH", amount: "20.00" },
      ],
    };
    const posted = await postSale(database.transactions, context, command);
    expect(posted.documentNo).toBe("POS01-000001");
    expect(posted.quote?.payment.changeDue).toBe("7.10");
    const replay = await postSale(database.transactions, context, command);
    expect(replay).toMatchObject({ saleId: posted.saleId, replayed: true });
    await expectDomainError(
      postSale(database.transactions, context, {
        ...command,
        tenders: [{ methodCode: "CASH", amount: "30" }],
      }),
      "IDEMPOTENCY_KEY_REUSED",
    );

    const sale = await getSale(database.sql, context, posted.saleId);
    expect(sale?.grandTotal).toBe("22.90000000");
    expect(sale?.lines).toHaveLength(2);
    expect(await onHand(itemIds.get("MM-00101")!)).toBe("44.00000000");
    expect(await onHand(itemIds.get("MM-00110")!)).toBe("9.00000000");

    const shift = await getShift(database.sql, context, shiftId);
    expect(shift?.expectedCash).toBe("212.90000000");
    expect(await listTenderSummaries(database.sql, context, shiftId)).toEqual([
      { methodCode: "CARD", amount: "10.00000000" },
      { methodCode: "CASH", amount: "12.90000000" },
    ]);
    const counts = await database.pool.query<{ sales: string; audits: string }>(
      `SELECT (SELECT count(*) FROM sales.sales)::text AS sales,
         (SELECT count(*) FROM audit.audit_events WHERE action_code = 'SALE_POSTED')::text AS audits`,
    );
    expect(counts.rows[0]).toEqual({ sales: "1", audits: "1" });
    // One outbox event per fact, each from the context that owns it, all in the sale's envelope.
    const events = await database.pool.query<{ producer: string; type: string; n: string }>(
      `SELECT o.producer_context AS producer, o.event_type AS type, count(*)::text AS n
       FROM integration.outbox_messages o
       JOIN sales.sales s ON s.posting_envelope_id = o.posting_envelope_id
       WHERE s.sale_id = $1 GROUP BY 1, 2 ORDER BY 1, 2`,
      [posted.saleId],
    );
    expect(events.rows).toEqual([
      { producer: "CASH", type: "CashMovementPosted", n: "1" },
      { producer: "INVENTORY", type: "StockIssued", n: "2" },
      { producer: "PAYMENTS", type: "TenderPosted", n: "2" },
      { producer: "SALES", type: "SalePosted", n: "1" },
    ]);
    expect(posted.quote?.payment.cashTendered).toBe("20.00");
  });

  it("rolls the whole sale back when stock would go negative", async () => {
    const before = await onHand(itemIds.get("MM-00101")!);
    await expectDomainError(
      postSale(database.transactions, context, {
        idempotencyKey: "sale-key-oversell",
        counterId,
        lines: [
          { itemId: itemIds.get("MM-00101")!, quantity: "1" },
          { itemId: itemIds.get("MM-00110")!, quantity: "10" },
        ],
        tenders: [{ methodCode: "CASH", amount: "200" }],
      }),
      "NEGATIVE_STOCK_BLOCKED",
    );
    expect(await onHand(itemIds.get("MM-00101")!)).toBe(before);
    expect((await getShift(database.sql, context, shiftId))?.expectedCash).toBe("212.90000000");
    const records = await database.pool.query(
      "SELECT 1 FROM integration.idempotency_records WHERE idempotency_key = 'sale-key-oversell'",
    );
    expect(records.rows).toHaveLength(0);
  });

  it("rejects underpayment and unknown tender methods", async () => {
    const lines = [{ itemId: itemIds.get("MM-00104")!, quantity: "1" }];
    await expectDomainError(
      postSale(database.transactions, context, {
        idempotencyKey: "sale-key-underpaid",
        counterId,
        lines,
        tenders: [{ methodCode: "CASH", amount: "4.00" }],
      }),
      "PAYMENT_INCOMPLETE",
    );
    await expectDomainError(
      quoteSale(database.sql, context, {
        lines,
        tenders: [{ methodCode: "CHEQUE", amount: "4.50" }],
      }),
      "TENDER_METHOD_UNSUPPORTED",
    );
    await expectDomainError(
      quoteSale(database.sql, context, {
        lines: [{ itemId: itemIds.get("MM-00104")!, quantity: "0.5" }],
      }),
      "QUANTITY_PRECISION",
    );
  });

  it("adjusts stock through the ledger, updates WAC and blocks negative stock", async () => {
    const itemId = itemIds.get("MM-00105")!;
    const increase = await postStockAdjustment(database.transactions, context, {
      idempotencyKey: "adjust-0001",
      itemId,
      quantityDelta: "12",
      reason: "Delivery found",
      unitCost: "2.50",
    });
    expect(increase).toMatchObject({ onHandAfter: "24" });
    const position = (await listPositions(database.sql, context)).find(
      (entry) => entry.itemId === itemId,
    );
    expect(position?.movingWac).toBe("2.30000000");
    await expectDomainError(
      postStockAdjustment(database.transactions, context, {
        idempotencyKey: "adjust-0002",
        itemId,
        quantityDelta: "-25",
        reason: "Damage",
      }),
      "NEGATIVE_STOCK_BLOCKED",
    );
    const movements = await listMovements(database.sql, context, { itemId });
    expect(movements.map((movement) => movement.movementType)).toEqual([
      "ADJUSTMENT",
      "OPENING_STOCK",
    ]);
    await expect(
      database.pool.query("UPDATE inventory.stock_movements SET quantity_delta = 1"),
    ).rejects.toThrow(/immutable/);
  });

  it("creates a product that is immediately sellable", async () => {
    const product = {
      idempotencyKey: "create-item-0001",
      itemCode: "MM-00200",
      name: "Teh Tarik Mix",
      barcode: "9556001000202",
      categoryName: "Beverages",
      sellingPrice: "8.00",
      openingQuantity: "5",
      openingUnitCost: "5.50",
    };
    const item = await createProduct(database.transactions, context, product);
    // A retry with the same key returns the same item and adds no second opening stock.
    const again = await createProduct(database.transactions, context, product);
    expect(again.itemId).toBe(item.itemId);
    expect(await onHand(item.itemId)).toBe("5.00000000");
    await expectDomainError(
      createProduct(database.transactions, context, {
        idempotencyKey: "create-item-0002",
        itemCode: "mm-00200",
        name: "Duplicate",
        sellingPrice: "1.00",
      }),
      "ITEM_CODE_TAKEN",
    );
    const posted = await postSale(database.transactions, context, {
      idempotencyKey: "sale-key-0002",
      counterId,
      lines: [{ itemId: item.itemId, quantity: "2" }],
      tenders: [{ methodCode: "DUITNOW", amount: "16.00", reference: "DN-77" }],
    });
    expect(posted.documentNo).toBe("POS01-000002");
    expect(await onHand(item.itemId)).toBe("3.00000000");
  });

  it("posts cash in and out, then closes the shift with a variance", async () => {
    await postShiftCashMovement(database.transactions, context, {
      idempotencyKey: "cash-out-0001",
      shiftId,
      direction: "OUT",
      amount: "50.00",
      reason: "Ice delivery",
    });
    await postShiftCashMovement(database.transactions, context, {
      idempotencyKey: "cash-out-0001",
      shiftId,
      direction: "OUT",
      amount: "50.00",
      reason: "Ice delivery",
    });
    await expectDomainError(
      postShiftCashMovement(database.transactions, context, {
        idempotencyKey: "cash-out-0002",
        shiftId,
        direction: "OUT",
        amount: "5000",
        reason: "Too much",
      }),
      "CASH_OUT_EXCEEDS_EXPECTED",
    );
    expect(
      (await listCashMovements(database.sql, context, shiftId)).map((entry) => entry.movementType),
    ).toEqual(["OPENING_FLOAT", "CASH_SALE", "CASH_OUT"]);
    const businessDayId = (await getShift(database.sql, context, shiftId))!.businessDayId;
    await expectDomainError(
      closeStoreBusinessDay(database.transactions, context, {
        idempotencyKey: "close-day-early",
        businessDayId,
      }),
      "OPEN_SHIFTS_BLOCK_DAY_CLOSE",
    );

    const close = { idempotencyKey: "close-shift-0001", shiftId, countedCash: "160.90" };
    const closed = await closeCashierShift(database.transactions, context, close);
    expect(closed).toMatchObject({
      status: "CLOSED",
      expectedCash: "162.90000000",
      actualCash: "160.90000000",
      varianceAmount: "-2.00000000",
    });
    expect((await closeCashierShift(database.transactions, context, close)).status).toBe("CLOSED");
    await expectDomainError(
      postSale(database.transactions, context, {
        idempotencyKey: "sale-after-close",
        counterId,
        lines: [{ itemId: itemIds.get("MM-00101")!, quantity: "1" }],
        tenders: [{ methodCode: "CASH", amount: "2.50" }],
      }),
      "SHIFT_REQUIRED",
    );
    const closeDay = { idempotencyKey: "close-day-0001", businessDayId };
    const day = await closeStoreBusinessDay(database.transactions, context, closeDay);
    expect(day.status).toBe("CLOSED");
    expect((await closeStoreBusinessDay(database.transactions, context, closeDay)).status).toBe(
      "CLOSED",
    );
    await expectDomainError(
      openCashierShift(database.transactions, context, {
        idempotencyKey: "open-shift-after-day-close",
        counterId,
        openingCash: "100",
      }),
      "BUSINESS_DAY_CLOSED",
    );
  });
});
