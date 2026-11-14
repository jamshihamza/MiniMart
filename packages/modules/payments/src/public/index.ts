import {
  DomainError,
  formatDec,
  parseDec,
  uuidv7,
  type Dec,
  type Sql,
  type StoreContext,
} from "@minimart/shared-kernel";

/** Tender methods the Store Node can post without a payment provider integration. */
export const MANUAL_TENDER_METHODS = ["CASH", "CARD", "DUITNOW"] as const;
export type TenderMethod = (typeof MANUAL_TENDER_METHODS)[number];

export function isTenderMethod(value: unknown): value is TenderMethod {
  return typeof value === "string" && (MANUAL_TENDER_METHODS as readonly string[]).includes(value);
}

export interface TenderOffer {
  readonly methodCode: string;
  /** Amount handed over (cash) or confirmed (card, DuitNow), at money precision. */
  readonly amount: Dec;
  readonly reference?: string;
}

export interface AppliedTender {
  readonly methodCode: TenderMethod;
  readonly applied: Dec;
  readonly reference: string | undefined;
}

export interface TenderAllocation {
  readonly tenders: readonly AppliedTender[];
  /** Everything offered, cash and non-cash. */
  readonly tendered: Dec;
  /** Cash handed over, before change. */
  readonly cashTendered: Dec;
  /** Amount applied to the payable. Equal to the payable when the sale is settled. */
  readonly applied: Dec;
  /** Cash to give back. */
  readonly change: Dec;
}

/**
 * Applies offered tenders to a payable amount. Non-cash tenders are applied first and may not
 * exceed what is due; cash covers the rest, and cash beyond that is change. Pure: writes nothing.
 */
export function allocateTenders(payable: Dec, offers: readonly TenderOffer[]): TenderAllocation {
  const tenders: AppliedTender[] = [];
  let tendered = 0n;
  let remaining = payable;
  let cashTendered = 0n;
  for (const offer of offers) {
    if (!isTenderMethod(offer.methodCode)) {
      throw new DomainError(
        "TENDER_METHOD_UNSUPPORTED",
        "Tender method is not supported",
        "VALIDATION",
      );
    }
    if (offer.amount <= 0n) {
      throw new DomainError(
        "TENDER_AMOUNT_INVALID",
        "Tender amount must be positive",
        "VALIDATION",
      );
    }
    tendered += offer.amount;
    if (offer.methodCode === "CASH") {
      cashTendered += offer.amount;
      continue;
    }
    if (offer.amount > remaining) {
      throw new DomainError(
        "NON_CASH_TENDER_EXCEEDS_DUE",
        "A card or DuitNow amount cannot be more than the amount due",
        "VALIDATION",
      );
    }
    remaining -= offer.amount;
    tenders.push({
      methodCode: offer.methodCode,
      applied: offer.amount,
      reference: offer.reference,
    });
  }
  const cashApplied = cashTendered < remaining ? cashTendered : remaining;
  if (cashApplied > 0n) {
    tenders.push({ methodCode: "CASH", applied: cashApplied, reference: undefined });
  }
  return {
    tenders,
    tendered,
    cashTendered,
    applied: payable - (remaining - cashApplied),
    change: cashTendered - cashApplied,
  };
}

export interface SettledTenderInput {
  readonly methodCode: TenderMethod;
  /** Amount applied to the sale, as an exact decimal string. */
  readonly amount: string;
  readonly externalReference?: string;
}

export interface TenderRecord {
  readonly saleId: string;
  readonly methodCode: string;
  readonly amount: string;
  readonly externalReference: string | null;
}

export interface SettledCheckout {
  readonly checkoutPaymentId: string;
  /** One id per tender, in input order. */
  readonly postedTenderIds: readonly string[];
}

/**
 * Records a fully settled checkout: one checkout payment, and a commitment plus an immutable posted
 * tender for each component. The components must add up to the payable amount exactly.
 */
export async function recordSettledCheckout(
  sql: Sql,
  context: Pick<StoreContext, "tenantId" | "currencyCode" | "now">,
  input: {
    readonly saleId: string;
    readonly payableAmount: string;
    readonly postingEnvelopeId: string;
    readonly tenders: readonly SettledTenderInput[];
  },
): Promise<SettledCheckout> {
  const payable = parseDec(input.payableAmount);
  let applied = 0n;
  for (const tender of input.tenders) {
    const amount = parseDec(tender.amount);
    if (amount <= 0n) {
      throw new DomainError(
        "TENDER_AMOUNT_INVALID",
        "Tender amount must be positive",
        "VALIDATION",
      );
    }
    applied += amount;
  }
  if (applied !== payable) {
    throw new DomainError(
      "TENDER_TOTAL_MISMATCH",
      "Tender components must equal the amount payable",
      "VALIDATION",
      { payable: formatDec(payable), applied: formatDec(applied) },
    );
  }

  const checkoutPaymentId = uuidv7(context.now);
  await sql.query(
    `INSERT INTO payments.checkout_payments (checkout_payment_id, tenant_id, sale_id, status,
       currency_code, payable_amount, committed_amount, remaining_amount, created_at)
     VALUES ($1, $2, $3, 'COMPLETED', $4, $5, $5, 0, $6)`,
    [
      checkoutPaymentId,
      context.tenantId,
      input.saleId,
      context.currencyCode,
      formatDec(payable, 8),
      context.now,
    ],
  );
  const postedTenderIds: string[] = [];
  let index = 0;
  for (const tender of input.tenders) {
    index += 1;
    const postedTenderId = uuidv7(context.now);
    postedTenderIds.push(postedTenderId);
    const commitmentId = uuidv7(context.now);
    const sourceKey = `sale:${input.saleId}:tender:${index}`;
    const amount = formatDec(parseDec(tender.amount), 8);
    await sql.query(
      `INSERT INTO payments.payment_commitments (payment_commitment_id, tenant_id, checkout_payment_id,
         method_code, amount, currency_code, external_reference, status, committed_at,
         settlement_source_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'COMMITTED', $8, $9)`,
      [
        commitmentId,
        context.tenantId,
        checkoutPaymentId,
        tender.methodCode,
        amount,
        context.currencyCode,
        tender.externalReference ?? null,
        context.now,
        sourceKey,
      ],
    );
    await sql.query(
      `INSERT INTO payments.posted_tenders (posted_tender_id, tenant_id, sale_id, checkout_payment_id,
         payment_commitment_id, method_code, amount, currency_code, external_reference,
         settlement_source_key, posting_envelope_id, posted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        postedTenderId,
        context.tenantId,
        input.saleId,
        checkoutPaymentId,
        commitmentId,
        tender.methodCode,
        amount,
        context.currencyCode,
        tender.externalReference ?? null,
        sourceKey,
        input.postingEnvelopeId,
        context.now,
      ],
    );
  }
  return { checkoutPaymentId, postedTenderIds };
}

export async function listTenders(
  sql: Sql,
  context: Pick<StoreContext, "tenantId">,
  saleIds: readonly string[],
): Promise<TenderRecord[]> {
  if (saleIds.length === 0) return [];
  const { rows } = await sql.query<{
    sale_id: string;
    method_code: string;
    amount: string;
    external_reference: string | null;
  }>(
    `SELECT sale_id, method_code, amount, external_reference FROM payments.posted_tenders
     WHERE tenant_id = $1 AND sale_id = ANY($2::uuid[]) ORDER BY posted_at, posted_tender_id`,
    [context.tenantId, saleIds],
  );
  return rows.map((row) => ({
    saleId: row.sale_id,
    methodCode: row.method_code,
    amount: row.amount,
    externalReference: row.external_reference,
  }));
}
