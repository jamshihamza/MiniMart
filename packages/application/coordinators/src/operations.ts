import {
  closeBusinessDay,
  closeShift,
  ensureOpenBusinessDay,
  findOpenBusinessDay,
  getShift,
  openShift,
  postCashMovement,
  type BusinessDayRecord,
  type ShiftRecord,
} from "@minimart/module-cash-business-day";
import {
  createItem,
  getItems,
  type CreateItemInput,
  type ItemRecord,
} from "@minimart/module-catalog";
import { postStockMovement } from "@minimart/module-inventory";
import { requireCounter } from "@minimart/module-organization";
import { setItemPrice } from "@minimart/module-pricing";
import {
  DomainError,
  formatDec,
  localDate,
  parseDec,
  roundDec,
  uuidv7,
  type Dec,
  type Sql,
  type StoreContext,
  type TransactionRunner,
} from "@minimart/shared-kernel";

import { claimIdempotency, recordPosting } from "./envelope.js";

function decimal(value: unknown, code: string, label: string): Dec {
  if (typeof value !== "string") {
    throw new DomainError(code, `${label} must be a decimal string`, "VALIDATION");
  }
  try {
    return parseDec(value);
  } catch {
    throw new DomainError(code, `${label} is not a valid decimal`, "VALIDATION");
  }
}

/** Business date for a new posting: the open Business Day, otherwise today in the store's zone. */
async function postingDate(sql: Sql, context: StoreContext): Promise<string> {
  const open = await findOpenBusinessDay(sql, context);
  return open?.businessDate ?? localDate(context.now, context.timezoneName);
}

export interface OpenShiftCommand {
  readonly idempotencyKey: string;
  readonly counterId: string;
  readonly openingCash: string;
}

/** Opens a cashier shift, opening the store's Business Day first when none is open. */
export async function openCashierShift(
  transactions: TransactionRunner,
  context: StoreContext,
  command: OpenShiftCommand,
): Promise<ShiftRecord> {
  return transactions.run(async (sql) => {
    const claim = await claimIdempotency(sql, context, "SHIFT_OPEN", command.idempotencyKey, {
      counterId: command.counterId,
      openingCash: command.openingCash,
    });
    if (claim.replayOf !== null) {
      const shift = await getShift(sql, context, claim.replayOf);
      if (shift === null) throw new Error("Replayed shift could not be found");
      return shift;
    }
    const counter = await requireCounter(sql, context, command.counterId);
    const openingFloat = roundDec(
      decimal(command.openingCash, "OPENING_CASH_INVALID", "Opening cash"),
      2,
    );
    const day = await ensureOpenBusinessDay(
      sql,
      context,
      localDate(context.now, context.timezoneName),
    );
    const postingEnvelopeId = uuidv7(context.now);
    const shift = await openShift(sql, context, {
      counterId: counter.counterId,
      userId: context.actorId,
      businessDayId: day.businessDayId,
      openingFloat,
      postingEnvelopeId,
    });
    await recordPosting(sql, context, {
      actionCode: "SHIFT_OPENED",
      targetContext: "CASH",
      targetType: "CASHIER_SHIFT",
      targetId: shift.shiftId,
      eventType: "CashierShiftOpened",
      postingEnvelopeId,
      payload: {
        counterCode: counter.counterCode,
        businessDate: day.businessDate,
        openingCash: formatDec(openingFloat),
      },
    });
    await claim.complete("CASHIER_SHIFT", shift.shiftId);
    return shift;
  });
}

export interface CashMovementCommand {
  readonly idempotencyKey: string;
  readonly shiftId: string;
  readonly direction: "IN" | "OUT";
  readonly amount: string;
  readonly reason: string;
}

/** Posts an explicit Cash In or Cash Out on an open shift. A reason is required. */
export async function postShiftCashMovement(
  transactions: TransactionRunner,
  context: StoreContext,
  command: CashMovementCommand,
): Promise<ShiftRecord> {
  return transactions.run(async (sql) => {
    const claim = await claimIdempotency(sql, context, "CASH_MOVEMENT", command.idempotencyKey, {
      shiftId: command.shiftId,
      direction: command.direction,
      amount: command.amount,
      reason: command.reason,
    });
    if (claim.replayOf === null) {
      const amount = roundDec(decimal(command.amount, "CASH_AMOUNT_INVALID", "Amount"), 2);
      const reason = command.reason.trim();
      if (amount <= 0n) {
        throw new DomainError(
          "CASH_AMOUNT_INVALID",
          "Amount must be greater than zero",
          "VALIDATION",
        );
      }
      if (reason === "") {
        throw new DomainError("CASH_REASON_REQUIRED", "A reason is required", "VALIDATION");
      }
      const postingEnvelopeId = uuidv7(context.now);
      const movementId = uuidv7(context.now);
      await postCashMovement(sql, context, {
        shiftId: command.shiftId,
        movementType: command.direction === "IN" ? "CASH_IN" : "CASH_OUT",
        amount: command.direction === "IN" ? amount : -amount,
        sourceContext: "CASH",
        sourceType: "CASH_MOVEMENT",
        sourceId: movementId,
        sourceEffectKey: `cash-movement:${movementId}`,
        reasonCode: reason,
        postingEnvelopeId,
      });
      await recordPosting(sql, context, {
        actionCode: command.direction === "IN" ? "CASH_IN_POSTED" : "CASH_OUT_POSTED",
        targetContext: "CASH",
        targetType: "CASHIER_SHIFT",
        targetId: command.shiftId,
        eventType: "CashMovementPosted",
        postingEnvelopeId,
        reasonCode: reason,
        payload: { direction: command.direction, amount: formatDec(amount), reason },
      });
      await claim.complete("CASHIER_SHIFT", command.shiftId);
    }
    const shift = await getShift(sql, context, command.shiftId);
    if (shift === null)
      throw new DomainError("SHIFT_NOT_FOUND", "Shift was not found", "NOT_FOUND");
    return shift;
  });
}

export interface CloseShiftCommand {
  readonly idempotencyKey: string;
  readonly shiftId: string;
  readonly countedCash: string;
}

/** Closes a shift with the counted cash. Closing the same shift again replays the first close. */
export async function closeCashierShift(
  transactions: TransactionRunner,
  context: StoreContext,
  command: CloseShiftCommand,
): Promise<ShiftRecord> {
  return transactions.run(async (sql) => {
    const claim = await claimIdempotency(sql, context, "SHIFT_CLOSE", command.idempotencyKey, {
      shiftId: command.shiftId,
      countedCash: command.countedCash,
    });
    if (claim.replayOf !== null) {
      const replayed = await getShift(sql, context, claim.replayOf);
      if (replayed === null) throw new Error("Replayed shift could not be found");
      return replayed;
    }
    const countedCash = roundDec(
      decimal(command.countedCash, "COUNTED_CASH_INVALID", "Counted cash"),
      2,
    );
    const shift = await closeShift(sql, context, { shiftId: command.shiftId, countedCash });
    await recordPosting(sql, context, {
      actionCode: "SHIFT_CLOSED",
      targetContext: "CASH",
      targetType: "CASHIER_SHIFT",
      targetId: shift.shiftId,
      eventType: "CashierShiftClosed",
      postingEnvelopeId: uuidv7(context.now),
      payload: {
        expectedCash: formatDec(parseDec(shift.expectedCash)),
        countedCash: formatDec(countedCash),
        variance: formatDec(parseDec(shift.varianceAmount ?? "0")),
      },
    });
    await claim.complete("CASHIER_SHIFT", shift.shiftId);
    return shift;
  });
}

/** Closes the Business Day. Refused while a shift is open. */
export async function closeStoreBusinessDay(
  transactions: TransactionRunner,
  context: StoreContext,
  businessDayId: string,
): Promise<BusinessDayRecord> {
  return transactions.run(async (sql) => {
    const day = await closeBusinessDay(sql, context, businessDayId);
    await recordPosting(sql, context, {
      actionCode: "BUSINESS_DAY_CLOSED",
      targetContext: "CASH",
      targetType: "BUSINESS_DAY",
      targetId: day.businessDayId,
      eventType: "BusinessDayClosed",
      postingEnvelopeId: uuidv7(context.now),
      payload: { businessDate: day.businessDate },
    });
    return day;
  });
}

export interface StockAdjustmentCommand {
  readonly idempotencyKey: string;
  readonly itemId: string;
  /** Signed quantity in the base unit. */
  readonly quantityDelta: string;
  readonly reason: string;
  /** Unit cost for an increase. When omitted the current moving WAC is used. */
  readonly unitCost?: string;
  readonly kind?: "ADJUSTMENT" | "OPENING_STOCK";
}

export interface PostedStockAdjustment {
  readonly adjustmentId: string;
  readonly itemId: string;
  readonly onHandAfter: string;
}

async function adjustStock(
  sql: Sql,
  context: StoreContext,
  command: Omit<StockAdjustmentCommand, "idempotencyKey">,
): Promise<PostedStockAdjustment> {
  const [item] = await getItems(sql, context, [command.itemId]);
  if (item === undefined)
    throw new DomainError("ITEM_NOT_FOUND", "Item was not found", "NOT_FOUND");
  if (!item.stockManaged) {
    throw new DomainError(
      "ITEM_NOT_STOCK_MANAGED",
      `${item.name} is not stock-managed`,
      "BUSINESS_RULE",
    );
  }
  const quantityDelta = decimal(command.quantityDelta, "QUANTITY_INVALID", "Quantity");
  if (quantityDelta === 0n || roundDec(quantityDelta, item.quantityPrecision) !== quantityDelta) {
    throw new DomainError("QUANTITY_INVALID", "Quantity is not valid for this item", "VALIDATION");
  }
  const reason = command.reason.trim();
  if (reason === "") {
    throw new DomainError("ADJUSTMENT_REASON_REQUIRED", "A reason is required", "VALIDATION");
  }
  const kind = command.kind ?? "ADJUSTMENT";
  if (kind === "OPENING_STOCK" && quantityDelta < 0n) {
    throw new DomainError("QUANTITY_INVALID", "Opening stock must be an increase", "VALIDATION");
  }
  const adjustmentId = uuidv7(context.now);
  const postingEnvelopeId = uuidv7(context.now);
  const movement = await postStockMovement(sql, context, {
    itemId: item.itemId,
    quantityDelta,
    ...(command.unitCost === undefined || quantityDelta < 0n
      ? {}
      : { inboundUnitCost: decimal(command.unitCost, "COST_INVALID", "Unit cost") }),
    movementType: kind,
    sourceContext: "INVENTORY",
    sourceType: kind === "OPENING_STOCK" ? "OPENING_STOCK" : "STOCK_ADJUSTMENT",
    sourceId: adjustmentId,
    sourceEffectKey: `stock-adjustment:${adjustmentId}`,
    postingEnvelopeId,
    businessDate: await postingDate(sql, context),
  });
  const onHandAfter = formatDec(movement.onHandAfter, item.quantityPrecision);
  await recordPosting(sql, context, {
    actionCode: kind === "OPENING_STOCK" ? "OPENING_STOCK_POSTED" : "STOCK_ADJUSTMENT_POSTED",
    targetContext: "INVENTORY",
    targetType: "ITEM",
    targetId: item.itemId,
    eventType: "StockAdjusted",
    postingEnvelopeId,
    reasonCode: reason,
    payload: {
      adjustmentId,
      itemCode: item.itemCode,
      quantityDelta: formatDec(quantityDelta, item.quantityPrecision),
      onHandAfter,
      reason,
    },
  });
  return { adjustmentId, itemId: item.itemId, onHandAfter };
}

/** Posts a stock adjustment or opening stock as an immutable ledger movement. */
export async function postStockAdjustment(
  transactions: TransactionRunner,
  context: StoreContext,
  command: StockAdjustmentCommand,
): Promise<PostedStockAdjustment | { readonly replayedAdjustmentId: string }> {
  return transactions.run(async (sql) => {
    const { idempotencyKey, ...request } = command;
    const claim = await claimIdempotency(sql, context, "STOCK_ADJUSTMENT", idempotencyKey, request);
    if (claim.replayOf !== null) return { replayedAdjustmentId: claim.replayOf };
    const posted = await adjustStock(sql, context, request);
    await claim.complete("STOCK_ADJUSTMENT", posted.adjustmentId);
    return posted;
  });
}

export interface CreateProductCommand extends CreateItemInput {
  readonly sellingPrice: string;
  readonly openingQuantity?: string;
  readonly openingUnitCost?: string;
}

/** Creates a sellable item with its store price and, optionally, its opening stock. */
export async function createProduct(
  transactions: TransactionRunner,
  context: StoreContext,
  command: CreateProductCommand,
): Promise<ItemRecord> {
  return transactions.run((sql) => createProductIn(sql, context, command));
}

export async function createProductIn(
  sql: Sql,
  context: StoreContext,
  command: CreateProductCommand,
): Promise<ItemRecord> {
  const price = decimal(command.sellingPrice, "PRICE_INVALID", "Selling price");
  const item = await createItem(sql, context, command);
  await setItemPrice(sql, context, item.itemId, formatDec(price, 8), "Initial price");
  await recordPosting(sql, context, {
    actionCode: "ITEM_CREATED",
    targetContext: "CATALOG",
    targetType: "ITEM",
    targetId: item.itemId,
    eventType: "ItemCreated",
    postingEnvelopeId: uuidv7(context.now),
    payload: { itemCode: item.itemCode, name: item.name, sellingPrice: formatDec(price) },
  });
  const opening = command.openingQuantity?.trim() ?? "";
  if (opening !== "" && parseDec(opening) !== 0n) {
    await adjustStock(sql, context, {
      itemId: item.itemId,
      quantityDelta: opening,
      reason: "Opening stock",
      kind: "OPENING_STOCK",
      ...(command.openingUnitCost === undefined ? {} : { unitCost: command.openingUnitCost }),
    });
  }
  return item;
}
