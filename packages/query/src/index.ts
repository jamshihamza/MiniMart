import {
  findOpenBusinessDay,
  findOpenShift,
  getShift,
  listBusinessDays,
  listCashMovements,
  listShifts,
  listTenderSummaries,
  type ShiftRecord,
} from "@minimart/module-cash-business-day";
import { getItems, searchItems, type ItemRecord } from "@minimart/module-catalog";
import { listUsers } from "@minimart/module-iam";
import { listMovements, listPositions } from "@minimart/module-inventory";
import { findActiveStore, listCounters } from "@minimart/module-organization";
import { listTenders } from "@minimart/module-payments";
import { currentPrices } from "@minimart/module-pricing";
import { getSale, listSales, salesTotals } from "@minimart/module-sales";
import {
  formatDec,
  localDate,
  mulDec,
  parseDec,
  type Sql,
  type StoreContext,
} from "@minimart/shared-kernel";

const money = (value: string | null): string | null =>
  value === null ? null : formatDec(parseDec(value));
const quantity = (value: string, precision: number): string =>
  formatDec(parseDec(value), precision);

export interface CatalogEntry extends ItemRecord {
  readonly sellingPrice: string | null;
  readonly onHand: string | null;
  readonly movingWac: string | null;
  readonly stockValue: string | null;
}

/** Items with their current store price and stock position. */
export async function catalogWithStock(
  sql: Sql,
  context: StoreContext,
  options: { readonly query?: string; readonly limit?: number } = {},
): Promise<CatalogEntry[]> {
  const items = await searchItems(sql, context, options);
  const prices = await currentPrices(
    sql,
    context,
    items.map((item) => item.itemId),
  );
  const positions = new Map(
    (await listPositions(sql, context)).map((position) => [position.itemId, position]),
  );
  return items.map((item) => {
    const position = positions.get(item.itemId);
    const price = prices.get(item.itemId);
    const tracked = item.stockManaged;
    const onHand = position?.onHandQty ?? "0";
    const wac = position?.movingWac ?? "0";
    return {
      ...item,
      sellingPrice: price === undefined ? null : formatDec(parseDec(price)),
      onHand: tracked ? quantity(onHand, item.quantityPrecision) : null,
      movingWac: tracked ? formatDec(parseDec(wac), 4) : null,
      stockValue: tracked ? formatDec(mulDec(parseDec(onHand), parseDec(wac))) : null,
    };
  });
}

/** Stock ledger movements with item names, newest first. */
export async function stockLedger(
  sql: Sql,
  context: StoreContext,
  options: { readonly itemId?: string; readonly limit?: number } = {},
) {
  const movements = await listMovements(sql, context, options);
  const items = new Map(
    (await getItems(sql, context, [...new Set(movements.map((movement) => movement.itemId))])).map(
      (item) => [item.itemId, item],
    ),
  );
  return movements.map((movement) => {
    const item = items.get(movement.itemId);
    return {
      stockMovementId: movement.stockMovementId,
      itemId: movement.itemId,
      itemCode: item?.itemCode ?? null,
      itemName: item?.name ?? "Unknown item",
      quantityDelta: quantity(movement.quantityDelta, item?.quantityPrecision ?? 3),
      unitCost: formatDec(parseDec(movement.unitCost), 4),
      movementType: movement.movementType,
      sourceType: movement.sourceType,
      sourceId: movement.sourceId,
      businessDate: movement.businessDate,
      occurredAt: movement.occurredAt,
    };
  });
}

function presentShift(
  shift: ShiftRecord,
  counters: ReadonlyMap<string, string>,
  users: ReadonlyMap<string, string>,
) {
  return {
    shiftId: shift.shiftId,
    counterId: shift.counterId,
    counterCode: shift.counterId === null ? null : (counters.get(shift.counterId) ?? null),
    cashier: users.get(shift.userId) ?? "Unknown user",
    businessDate: shift.businessDate,
    status: shift.status,
    openingCash: money(shift.openingFloat),
    expectedCash: money(shift.expectedCash),
    countedCash: money(shift.actualCash),
    variance: money(shift.varianceAmount),
    openedAt: shift.openedAt,
    closedAt: shift.closedAt,
  };
}

async function lookups(sql: Sql, context: StoreContext) {
  const counters = await listCounters(sql, context);
  const users = await listUsers(sql, context.tenantId);
  return {
    counters,
    users,
    counterCodes: new Map(counters.map((counter) => [counter.counterId, counter.counterCode])),
    usernames: new Map(users.map((user) => [user.userId, user.username])),
  };
}

export async function shiftList(sql: Sql, context: StoreContext) {
  const { counterCodes, usernames } = await lookups(sql, context);
  return (await listShifts(sql, context)).map((shift) =>
    presentShift(shift, counterCodes, usernames),
  );
}

/** One shift with its cash movements and per-method tender summary. */
export async function shiftDetail(sql: Sql, context: StoreContext, shiftId: string) {
  const shift = await getShift(sql, context, shiftId);
  if (shift === null) return null;
  const { counterCodes, usernames } = await lookups(sql, context);
  return {
    ...presentShift(shift, counterCodes, usernames),
    cashMovements: (await listCashMovements(sql, context, shiftId)).map((movement) => ({
      ...movement,
      amount: formatDec(parseDec(movement.amount)),
    })),
    tenders: (await listTenderSummaries(sql, context, shiftId)).map((tender) => ({
      methodCode: tender.methodCode,
      amount: formatDec(parseDec(tender.amount)),
    })),
  };
}

/** What a client needs to start: store, counters, users, business day and the counter's shift. */
export async function storeOverview(sql: Sql, context: StoreContext, counterId?: string) {
  const store = await findActiveStore(sql);
  const { counters, users, counterCodes, usernames } = await lookups(sql, context);
  const day = await findOpenBusinessDay(sql, context);
  const counter = counters.find((entry) => entry.counterId === counterId) ?? counters[0] ?? null;
  const shift = counter === null ? null : await findOpenShift(sql, context, counter.counterId);
  return {
    store:
      store === null
        ? null
        : {
            storeCode: store.storeCode,
            displayName: store.displayName,
            companyDisplayName: store.companyDisplayName,
            currencyCode: store.currencyCode,
            countryCode: store.countryCode,
            timezoneName: store.timezoneName,
          },
    counters,
    users,
    operator: usernames.get(context.actorId) ?? null,
    counter,
    businessDay: day,
    calendarDate: localDate(context.now, context.timezoneName),
    shift: shift === null ? null : presentShift(shift, counterCodes, usernames),
  };
}

export async function salesList(
  sql: Sql,
  context: StoreContext,
  options: { readonly limit?: number; readonly businessDate?: string } = {},
) {
  const sales = await listSales(sql, context, options);
  const { counterCodes } = await lookups(sql, context);
  const tenders = await listTenders(
    sql,
    context,
    sales.map((sale) => sale.saleId),
  );
  return sales.map((sale) => ({
    saleId: sale.saleId,
    documentNo: sale.documentNo,
    counterCode: sale.counterId === null ? null : (counterCodes.get(sale.counterId) ?? null),
    businessDate: sale.businessDate,
    postedAt: sale.postedAt,
    grandTotal: formatDec(parseDec(sale.grandTotal)),
    currencyCode: sale.currencyCode,
    tenders: tenders
      .filter((tender) => tender.saleId === sale.saleId)
      .map((tender) => tender.methodCode),
  }));
}

/** A completed sale as a receipt: snapshot header, lines and tenders. */
export async function saleReceipt(sql: Sql, context: StoreContext, saleId: string) {
  const sale = await getSale(sql, context, saleId);
  if (sale === null) return null;
  const tenders = await listTenders(sql, context, [saleId]);
  return {
    saleId: sale.saleId,
    documentNo: sale.documentNo,
    businessDate: sale.businessDate,
    postedAt: sale.postedAt,
    currencyCode: sale.currencyCode,
    store: sale.storeSnapshot,
    company: sale.companySnapshot,
    lines: sale.lines.map((line) => ({
      lineNo: line.lineNo,
      itemCode: line.itemCode,
      itemName: line.itemName,
      uomCode: line.uomCode,
      quantity: formatDec(parseDec(line.quantity), 3).replace(/\.?0+$/, ""),
      unitPrice: formatDec(parseDec(line.unitPrice)),
      lineTotal: formatDec(parseDec(line.lineTotal)),
    })),
    subtotal: formatDec(parseDec(sale.subtotal)),
    discountTotal: formatDec(parseDec(sale.discountTotal)),
    taxTotal: formatDec(parseDec(sale.taxTotal)),
    grandTotal: formatDec(parseDec(sale.grandTotal)),
    tenders: tenders.map((tender) => ({
      methodCode: tender.methodCode,
      amount: formatDec(parseDec(tender.amount)),
      reference: tender.externalReference,
    })),
  };
}

/** Operational summary for the Back Office home page. Not a financial statement. */
export async function dashboard(sql: Sql, context: StoreContext) {
  const day = await findOpenBusinessDay(sql, context);
  const businessDate = day?.businessDate ?? localDate(context.now, context.timezoneName);
  const totals = await salesTotals(sql, context, businessDate);
  const catalog = await catalogWithStock(sql, context, { limit: 200 });
  const tracked = catalog.filter((entry) => entry.onHand !== null);
  let stockValue = 0n;
  for (const entry of tracked) stockValue += parseDec(entry.stockValue ?? "0");
  const shifts = await shiftList(sql, context);
  return {
    businessDate,
    businessDayOpen: day !== null,
    saleCount: totals.saleCount,
    salesTotal: formatDec(parseDec(totals.grandTotal)),
    itemCount: catalog.length,
    zeroStockCount: tracked.filter((entry) => parseDec(entry.onHand ?? "0") === 0n).length,
    stockValue: formatDec(stockValue),
    openShifts: shifts.filter((shift) => shift.status === "OPEN"),
    recentSales: await salesList(sql, context, { limit: 8 }),
    businessDays: await listBusinessDays(sql, context),
  };
}
