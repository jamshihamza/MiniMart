import {
  addTenderToShift,
  findOpenShift,
  postCashMovement,
} from "@minimart/module-cash-business-day";
import { getItems, type ItemRecord } from "@minimart/module-catalog";
import { postStockMovement } from "@minimart/module-inventory";
import { findActiveStore, requireCounter } from "@minimart/module-organization";
import {
  isTenderMethod,
  recordSettledCheckout,
  type TenderMethod,
} from "@minimart/module-payments";
import { currentPrices } from "@minimart/module-pricing";
import { getSale, insertCompletedSale, nextSaleDocumentNo } from "@minimart/module-sales";
import {
  DomainError,
  formatDec,
  isUuid,
  mulDec,
  parseDec,
  roundDec,
  uuidv7,
  type Dec,
  type Sql,
  type StoreContext,
  type TransactionRunner,
} from "@minimart/shared-kernel";

import { claimIdempotency, recordPosting } from "./envelope.js";

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

interface AppliedTender {
  readonly methodCode: TenderMethod;
  readonly applied: Dec;
  readonly reference: string | undefined;
}

interface Priced {
  readonly lines: readonly PricedLine[];
  readonly total: Dec;
  readonly tenders: readonly AppliedTender[];
  readonly tendered: Dec;
  readonly applied: Dec;
  readonly change: Dec;
}

const MONEY_PLACES = 2;

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
    const lineTotal = roundDec(mulDec(quantity, unitPrice), MONEY_PLACES);
    total += lineTotal;
    lines.push({ item, quantity, unitPrice, lineTotal });
  }

  // Non-cash tenders are applied first and may not exceed what is due; cash covers the rest and
  // any cash handed over beyond that is change.
  const tenders: AppliedTender[] = [];
  let tendered = 0n;
  let remaining = total;
  let cashTendered = 0n;
  for (const request of tenderRequests) {
    if (!isTenderMethod(request.methodCode)) {
      throw new DomainError(
        "TENDER_METHOD_UNSUPPORTED",
        "Tender method is not supported",
        "VALIDATION",
      );
    }
    const amount = roundDec(
      parseAmount(request.amount, "TENDER_AMOUNT_INVALID", "Tender amount"),
      MONEY_PLACES,
    );
    if (amount <= 0n) {
      throw new DomainError(
        "TENDER_AMOUNT_INVALID",
        "Tender amount must be positive",
        "VALIDATION",
      );
    }
    tendered += amount;
    if (request.methodCode === "CASH") {
      cashTendered += amount;
      continue;
    }
    if (amount > remaining) {
      throw new DomainError(
        "NON_CASH_TENDER_EXCEEDS_DUE",
        "A card or DuitNow amount cannot be more than the amount due",
        "VALIDATION",
      );
    }
    remaining -= amount;
    tenders.push({ methodCode: request.methodCode, applied: amount, reference: request.reference });
  }
  const cashApplied = cashTendered < remaining ? cashTendered : remaining;
  if (cashApplied > 0n) {
    tenders.push({ methodCode: "CASH", applied: cashApplied, reference: undefined });
  }
  const applied = total - (remaining - cashApplied);
  return { lines, total, tenders, tendered, applied, change: cashTendered - cashApplied };
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
    const saleLines = [];
    let lineNo = 0;
    for (const line of priced.lines) {
      lineNo += 1;
      const saleLineId = uuidv7(context.now);
      let unitCost = 0n;
      if (line.item.stockManaged) {
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
        unitCost = movement.unitCost;
      }
      saleLines.push({
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
        unitCost: formatDec(unitCost, 8),
      });
    }

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
    await recordSettledCheckout(sql, context, {
      saleId,
      payableAmount: total,
      postingEnvelopeId,
      tenders: priced.tenders.map((tender) => ({
        methodCode: tender.methodCode,
        amount: formatDec(tender.applied, 8),
        ...(tender.reference === undefined ? {} : { externalReference: tender.reference }),
      })),
    });
    for (const tender of priced.tenders) {
      await addTenderToShift(sql, context, shift.shiftId, tender.methodCode, tender.applied);
      if (tender.methodCode === "CASH") {
        await postCashMovement(sql, context, {
          shiftId: shift.shiftId,
          movementType: "CASH_SALE",
          amount: tender.applied,
          sourceContext: "SALES",
          sourceType: "SALE",
          sourceId: saleId,
          sourceEffectKey: `sale:${saleId}:cash`,
          postingEnvelopeId,
        });
      }
    }
    const quote = toQuote(context, priced);
    await recordPosting(sql, context, {
      actionCode: "SALE_COMPLETED",
      targetContext: "SALES",
      targetType: "SALE",
      targetId: saleId,
      eventType: "SaleCompleted",
      postingEnvelopeId,
      payload: {
        documentNo,
        businessDate: shift.businessDate,
        grandTotal: quote.grandTotal,
        shiftId: shift.shiftId,
        tenders: priced.tenders.map((tender) => ({
          methodCode: tender.methodCode,
          amount: formatDec(tender.applied),
        })),
      },
    });
    await claim.complete("SALE", saleId);
    return { saleId, documentNo, businessDate: shift.businessDate, replayed: false, quote };
  });
}
