import {
  addTenderToShift,
  findOpenShift,
  postCashMovement,
} from "@minimart/module-cash-business-day";
import { getItems, type ItemRecord } from "@minimart/module-catalog";
import { postStockMovement } from "@minimart/module-inventory";
import { findActiveStore, requireCounter } from "@minimart/module-organization";
import {
  allocateTenders,
  recordSettledCheckout,
  type TenderAllocation,
} from "@minimart/module-payments";
import { currentPrices, extendSaleLine, MONEY_PLACES } from "@minimart/module-pricing";
import { getSale, insertCompletedSale, nextSaleDocumentNo } from "@minimart/module-sales";
import {
  DomainError,
  formatDec,
  isUuid,
  parseDec,
  roundDec,
  uuidv7,
  type Dec,
  type Sql,
  type StoreContext,
  type TransactionRunner,
} from "@minimart/shared-kernel";

import { claimIdempotency, recordEvent, recordPosting } from "./envelope.js";

export interface SaleLineRequest {
  readonly itemId: string;
  /** Quantity in the item's sales unit, as an exact decimal string. */
  readonly quantity: string;
}

export interface TenderRequest {
  readonly methodCode: string;
  /** Amount handed over (cash) or confirmed (card, DuitNow), as an exact decimal string. */
  readonly amount: string;
  readonly reference?: string;
}

export interface QuoteLine {
  readonly itemId: string;
  readonly itemCode: string | null;
  readonly itemName: string;
  readonly uomCode: string;
  readonly quantity: string;
  readonly unitPrice: string;
  readonly lineTotal: string;
}

export interface PaymentQuote {
  readonly tenderedTotal: string;
  /** Cash handed over before change, or null when no cash was offered. */
  readonly cashTendered: string | null;
  readonly appliedTotal: string;
  readonly remaining: string;
  readonly changeDue: string;
  readonly settled: boolean;
}

export interface SaleQuote {
  readonly currencyCode: string;
  readonly lines: readonly QuoteLine[];
  readonly itemCount: string;
  readonly subtotal: string;
  readonly discountTotal: string;
  readonly taxTotal: string;
  readonly grandTotal: string;
  readonly payment: PaymentQuote;
}

interface PricedLine {
  readonly item: ItemRecord;
  readonly quantity: Dec;
  readonly unitPrice: Dec;
  readonly lineTotal: Dec;
}

interface Priced extends TenderAllocation {
  readonly lines: readonly PricedLine[];
  readonly total: Dec;
}

function parseAmount(value: unknown, code: string, label: string): Dec {
  if (typeof value !== "string") {
    throw new DomainError(code, `${label} must be a decimal string`, "VALIDATION");
  }
  try {
    return parseDec(value);
  } catch {
    throw new DomainError(code, `${label} is not a valid decimal`, "VALIDATION");
  }
}

async function price(
  sql: Sql,
  context: StoreContext,
  lineRequests: readonly SaleLineRequest[],
  tenderRequests: readonly TenderRequest[],
): Promise<Priced> {
  const quantities = new Map<string, Dec>();
  for (const request of lineRequests) {
    if (!isUuid(request.itemId)) {
      throw new DomainError("ITEM_ID_INVALID", "Item id is not valid", "VALIDATION");
    }
    const quantity = parseAmount(request.quantity, "QUANTITY_INVALID", "Quantity");
    if (quantity <= 0n) {
      throw new DomainError("QUANTITY_INVALID", "Quantity must be greater than zero", "VALIDATION");
    }
    quantities.set(request.itemId, (quantities.get(request.itemId) ?? 0n) + quantity);
  }
  const itemIds = [...quantities.keys()];
  const items = new Map((await getItems(sql, context, itemIds)).map((item) => [item.itemId, item]));
  const prices = await currentPrices(sql, context, itemIds);

  const lines: PricedLine[] = [];
  let total = 0n;
  for (const [itemId, quantity] of quantities) {
    const item = items.get(itemId);
    if (item === undefined || !item.sellable) {
      throw new DomainError("ITEM_NOT_SELLABLE", "Item is not available for sale", "NOT_FOUND", {
        itemId,
      });
    }
    if (roundDec(quantity, item.quantityPrecision) !== quantity) {
      throw new DomainError(
        "QUANTITY_PRECISION",
        `${item.name} cannot be sold in that fraction`,
        "VALIDATION",
        { itemId },
      );
    }
    const priceText = prices.get(itemId);
    if (priceText === undefined) {
      throw new DomainError("PRICE_MISSING", `${item.name} has no selling price`, "BUSINESS_RULE", {
        itemId,
      });
    }
    const unitPrice = parseDec(priceText);
    const lineTotal = extendSaleLine(quantity, unitPrice);
    total += lineTotal;
    lines.push({ item, quantity, unitPrice, lineTotal });
  }

  const offers = tenderRequests.map((request) => ({
    methodCode: request.methodCode,
    amount: roundDec(
      parseAmount(request.amount, "TENDER_AMOUNT_INVALID", "Tender amount"),
      MONEY_PLACES,
    ),
    ...(request.reference === undefined ? {} : { reference: request.reference }),
  }));
  return { lines, total, ...allocateTenders(total, offers) };
}

function toQuote(context: StoreContext, priced: Priced): SaleQuote {
  let itemCount = 0n;
  for (const line of priced.lines) itemCount += line.quantity;
  const remaining = priced.total - priced.applied;
  return {
    currencyCode: context.currencyCode,
    lines: priced.lines.map((line) => ({
      itemId: line.item.itemId,
      itemCode: line.item.itemCode,
      itemName: line.item.name,
      uomCode: line.item.uomCode,
      quantity: formatDec(line.quantity, line.item.quantityPrecision),
      unitPrice: formatDec(line.unitPrice),
      lineTotal: formatDec(line.lineTotal),
    })),
    itemCount: formatDec(itemCount, 3).replace(/\.?0+$/, ""),
    subtotal: formatDec(priced.total),
    discountTotal: formatDec(0n),
    taxTotal: formatDec(0n),
    grandTotal: formatDec(priced.total),
    payment: {
      tenderedTotal: formatDec(priced.tendered),
      cashTendered: priced.cashTendered > 0n ? formatDec(priced.cashTendered) : null,
      appliedTotal: formatDec(priced.applied),
      remaining: formatDec(remaining),
      changeDue: formatDec(priced.change),
      settled: priced.lines.length > 0 && remaining === 0n,
    },
  };
}

/** Prices a cart on the Store Node. The client never computes money. */
export async function quoteSale(
  sql: Sql,
  context: StoreContext,
  request: {
    readonly lines: readonly SaleLineRequest[];
    readonly tenders?: readonly TenderRequest[];
  },
): Promise<SaleQuote> {
  return toQuote(context, await price(sql, context, request.lines, request.tenders ?? []));
}

export interface PostSaleCommand {
  readonly idempotencyKey: string;
  readonly counterId: string;
  readonly lines: readonly SaleLineRequest[];
  readonly tenders: readonly TenderRequest[];
}

export interface PostedSale {
  readonly saleId: string;
  readonly documentNo: string;
  readonly businessDate: string;
  readonly replayed: boolean;
  readonly quote: SaleQuote | null;
}

/**
 * Posts a completed sale in one transaction: the sale and its lines, the settled tenders, the stock
 * ledger movements, the drawer cash movement, the audit event and the outbox message.
 */
export async function postSale(
  transactions: TransactionRunner,
  context: StoreContext,
  command: PostSaleCommand,
): Promise<PostedSale> {
  return transactions.run(async (sql) => {
    const claim = await claimIdempotency(sql, context, "SALE_POST", command.idempotencyKey, {
      counterId: command.counterId,
      lines: command.lines,
      tenders: command.tenders,
    });
    if (claim.replayOf !== null) {
      const sale = await getSale(sql, context, claim.replayOf);
      if (sale === null) throw new Error("Replayed sale could not be found");
      return {
        saleId: sale.saleId,
        documentNo: sale.documentNo,
        businessDate: sale.businessDate,
        replayed: true,
        quote: null,
      };
    }

    const counter = await requireCounter(sql, context, command.counterId);
    const shift = await findOpenShift(sql, context, counter.counterId);
    if (shift === null) {
      throw new DomainError(
        "SHIFT_REQUIRED",
        "Open a shift on this counter before taking a sale",
        "BUSINESS_RULE",
      );
    }
    const priced = await price(sql, context, command.lines, command.tenders);
    if (priced.lines.length === 0) {
      throw new DomainError("SALE_EMPTY", "A sale needs at least one line", "VALIDATION");
    }
    if (priced.applied !== priced.total) {
      throw new DomainError(
        "PAYMENT_INCOMPLETE",
        "The amount received does not cover the total due",
        "BUSINESS_RULE",
        { remaining: formatDec(priced.total - priced.applied) },
      );
    }
    const store = await findActiveStore(sql);
    if (store === null || store.storeId !== context.storeId) {
      throw new Error("Store context is not provisioned");
    }

    const saleId = uuidv7(context.now);
    const postingEnvelopeId = uuidv7(context.now);
    // Line numbers follow the cart, but stock positions are locked in item-id order so that two
    // counters selling the same items in a different order cannot deadlock each other.
    const numbered = priced.lines.map((line, index) => ({
      line,
      lineNo: index + 1,
      saleLineId: uuidv7(context.now),
    }));
    const unitCosts = new Map<string, Dec>();
    const stockIssues: { stockMovementId: string; itemId: string; quantity: string }[] = [];
    const lockOrder = numbered
      .filter((entry) => entry.line.item.stockManaged)
      .sort((left, right) =>
        left.line.item.itemId < right.line.item.itemId
          ? -1
          : left.line.item.itemId > right.line.item.itemId
            ? 1
            : 0,
      );
    for (const { line, lineNo, saleLineId } of lockOrder) {
      const movement = await postStockMovement(sql, context, {
        itemId: line.item.itemId,
        quantityDelta: -line.quantity,
        movementType: "SALE",
        sourceContext: "SALES",
        sourceType: "SALE",
        sourceId: saleId,
        sourceLineId: saleLineId,
        sourceEffectKey: `sale:${saleId}:line:${lineNo}:stock`,
        postingEnvelopeId,
        businessDate: shift.businessDate,
      });
      unitCosts.set(saleLineId, movement.unitCost);
      stockIssues.push({
        stockMovementId: movement.stockMovementId,
        itemId: line.item.itemId,
        quantity: formatDec(line.quantity, line.item.quantityPrecision),
      });
    }
    const saleLines = numbered.map(({ line, lineNo, saleLineId }) => ({
      saleLineId,
      lineNo,
      itemId: line.item.itemId,
      itemCode: line.item.itemCode,
      itemName: line.item.name,
      uomCode: line.item.uomCode,
      quantity: formatDec(line.quantity, 8),
      unitPrice: formatDec(line.unitPrice, 8),
      discountAmount: "0",
      taxAmount: "0",
      lineTotal: formatDec(line.lineTotal, 8),
      unitCost: formatDec(unitCosts.get(saleLineId) ?? 0n, 8),
    }));

    const documentNo = await nextSaleDocumentNo(sql, context, counter);
    const total = formatDec(priced.total, 8);
    await insertCompletedSale(sql, context, {
      saleId,
      counterId: counter.counterId,
      documentNo,
      businessDate: shift.businessDate,
      postingEnvelopeId,
      subtotal: total,
      discountTotal: "0",
      taxTotal: "0",
      roundingTotal: "0",
      grandTotal: total,
      companySnapshot: {
        legalName: store.companyLegalName,
        displayName: store.companyDisplayName,
      },
      storeSnapshot: {
        storeCode: store.storeCode,
        displayName: store.displayName,
        counterCode: counter.counterCode,
        timezoneName: store.timezoneName,
      },
      lines: saleLines,
    });
    const checkout = await recordSettledCheckout(sql, context, {
      saleId,
      payableAmount: total,
      postingEnvelopeId,
      tenders: priced.tenders.map((tender) => ({
        methodCode: tender.methodCode,
        amount: formatDec(tender.applied, 8),
        ...(tender.reference === undefined ? {} : { externalReference: tender.reference }),
      })),
    });
    const cashMovementIds: string[] = [];
    for (const tender of priced.tenders) {
      await addTenderToShift(sql, context, shift.shiftId, tender.methodCode, tender.applied);
      if (tender.methodCode === "CASH") {
        cashMovementIds.push(
          await postCashMovement(sql, context, {
            shiftId: shift.shiftId,
            movementType: "CASH_SALE",
            amount: tender.applied,
            sourceContext: "SALES",
            sourceType: "SALE",
            sourceId: saleId,
            sourceEffectKey: `sale:${saleId}:cash`,
            postingEnvelopeId,
          }),
        );
      }
    }
    const quote = toQuote(context, priced);
    // One audit event for the posting, and one outbox event per fact from the context that owns it.
    await recordPosting(sql, context, {
      actionCode: "SALE_POSTED",
      targetContext: "SALES",
      targetType: "SALE",
      targetId: saleId,
      eventType: "SalePosted",
      postingEnvelopeId,
      payload: {
        documentNo,
        businessDate: shift.businessDate,
        grandTotal: quote.grandTotal,
        shiftId: shift.shiftId,
        cashTendered: quote.payment.cashTendered,
        changeDue: quote.payment.changeDue,
      },
    });
    for (const [index, tender] of priced.tenders.entries()) {
      const postedTenderId = checkout.postedTenderIds[index];
      if (postedTenderId === undefined) throw new Error("Posted tender id is missing");
      await recordEvent(sql, context, {
        producerContext: "PAYMENTS",
        aggregateType: "POSTED_TENDER",
        aggregateId: postedTenderId,
        eventType: "TenderPosted",
        postingEnvelopeId,
        payload: {
          saleId,
          checkoutPaymentId: checkout.checkoutPaymentId,
          methodCode: tender.methodCode,
          amount: formatDec(tender.applied),
          businessDate: shift.businessDate,
        },
      });
    }
    for (const issue of stockIssues) {
      await recordEvent(sql, context, {
        producerContext: "INVENTORY",
        aggregateType: "STOCK_MOVEMENT",
        aggregateId: issue.stockMovementId,
        eventType: "StockIssued",
        postingEnvelopeId,
        payload: {
          saleId,
          itemId: issue.itemId,
          quantity: issue.quantity,
          businessDate: shift.businessDate,
        },
      });
    }
    for (const cashMovementId of cashMovementIds) {
      await recordEvent(sql, context, {
        producerContext: "CASH",
        aggregateType: "CASH_MOVEMENT",
        aggregateId: cashMovementId,
        eventType: "CashMovementPosted",
        postingEnvelopeId,
        payload: {
          saleId,
          shiftId: shift.shiftId,
          movementType: "CASH_SALE",
          businessDate: shift.businessDate,
        },
      });
    }
    await claim.complete("SALE", saleId);
    return { saleId, documentNo, businessDate: shift.businessDate, replayed: false, quote };
  });
}
