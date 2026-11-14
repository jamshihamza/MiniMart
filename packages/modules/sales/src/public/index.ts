import { DomainError, type Sql, type StoreContext } from "@minimart/shared-kernel";

type Scope = Pick<StoreContext, "tenantId" | "storeId">;

export interface CompletedSaleLineInput {
  readonly saleLineId: string;
  readonly lineNo: number;
  readonly itemId: string;
  readonly itemCode: string | null;
  readonly itemName: string;
  readonly uomCode: string;
  readonly quantity: string;
  readonly unitPrice: string;
  readonly discountAmount: string;
  readonly taxAmount: string;
  readonly lineTotal: string;
  readonly unitCost: string;
}

export interface CompletedSaleInput {
  readonly saleId: string;
  readonly counterId: string;
  readonly documentNo: string;
  readonly businessDate: string;
  readonly postingEnvelopeId: string;
  readonly subtotal: string;
  readonly discountTotal: string;
  readonly taxTotal: string;
  readonly roundingTotal: string;
  readonly grandTotal: string;
  readonly companySnapshot: Readonly<Record<string, unknown>>;
  readonly storeSnapshot: Readonly<Record<string, unknown>>;
  readonly lines: readonly CompletedSaleLineInput[];
}

export interface SaleSummary {
  readonly saleId: string;
  readonly documentNo: string;
  readonly counterId: string | null;
  readonly status: string;
  readonly businessDate: string;
  readonly postedAt: string;
  readonly subtotal: string;
  readonly discountTotal: string;
  readonly taxTotal: string;
  readonly grandTotal: string;
  readonly currencyCode: string;
}

export interface SaleLineRecord {
  readonly saleLineId: string;
  readonly lineNo: number;
  readonly itemId: string;
  readonly itemCode: string | null;
  readonly itemName: string;
  readonly uomCode: string;
  readonly quantity: string;
  readonly unitPrice: string;
  readonly lineTotal: string;
}

export interface SaleDetail extends SaleSummary {
  readonly storeSnapshot: Readonly<Record<string, unknown>> | null;
  readonly companySnapshot: Readonly<Record<string, unknown>> | null;
  readonly lines: readonly SaleLineRecord[];
}

/**
 * Next receipt number for a counter, for example POS01-000042. Serialised per counter with a
 * transaction-scoped advisory lock, so it must run inside the posting transaction.
 */
export async function nextSaleDocumentNo(
  sql: Sql,
  scope: Scope,
  counter: { readonly counterId: string; readonly counterCode: string },
): Promise<string> {
  await sql.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
    `sale-document-no:${scope.tenantId}:${counter.counterId}`,
  ]);
  const { rows } = await sql.query<{ count: string }>(
    `SELECT count(*)::text AS count FROM sales.sales
     WHERE tenant_id = $1 AND store_id = $2 AND counter_id = $3 AND document_no IS NOT NULL`,
    [scope.tenantId, scope.storeId, counter.counterId],
  );
  const next = Number(rows[0]?.count ?? "0") + 1;
  return `${counter.counterCode}-${String(next).padStart(6, "0")}`;
}

/** Inserts a sale that is already COMPLETED, with its lines and state history. */
export async function insertCompletedSale(
  sql: Sql,
  context: Scope & Pick<StoreContext, "companyId" | "currencyCode" | "actorId" | "now">,
  input: CompletedSaleInput,
): Promise<void> {
  if (input.lines.length === 0) {
    throw new DomainError("SALE_EMPTY", "A sale needs at least one line", "VALIDATION");
  }
  await sql.query(
    `INSERT INTO sales.sales (sale_id, tenant_id, company_id, store_id, counter_id, document_no, status,
       currency_code, company_snapshot_json, store_snapshot_json, snapshot_schema_version, subtotal,
       discount_total, tax_total, rounding_total, grand_total, business_date, posting_envelope_id,
       created_at, posted_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'COMPLETED', $7, $8, $9, '1', $10, $11, $12, $13, $14, $15, $16,
       $17, $17)`,
    [
      input.saleId,
      context.tenantId,
      context.companyId,
      context.storeId,
      input.counterId,
      input.documentNo,
      context.currencyCode,
      JSON.stringify(input.companySnapshot),
      JSON.stringify(input.storeSnapshot),
      input.subtotal,
      input.discountTotal,
      input.taxTotal,
      input.roundingTotal,
      input.grandTotal,
      input.businessDate,
      input.postingEnvelopeId,
      context.now,
    ],
  );
  for (const line of input.lines) {
    await sql.query(
      `INSERT INTO sales.sale_lines (sale_line_id, tenant_id, sale_id, line_no, item_id,
         item_code_snapshot, item_name_snapshot, uom_code_snapshot, quantity, unit_price,
         discount_amount, tax_amount, line_total, unit_cost_snapshot)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        line.saleLineId,
        context.tenantId,
        input.saleId,
        line.lineNo,
        line.itemId,
        line.itemCode,
        line.itemName,
        line.uomCode,
        line.quantity,
        line.unitPrice,
        line.discountAmount,
        line.taxAmount,
        line.lineTotal,
        line.unitCost,
      ],
    );
  }
  await sql.query(
    `INSERT INTO sales.sale_state_history (sale_state_history_id, tenant_id, sale_id, from_status,
       to_status, changed_at, actor_id) VALUES (gen_random_uuid(), $1, $2, NULL, 'COMPLETED', $3, $4)`,
    [context.tenantId, input.saleId, context.now, context.actorId],
  );
}

interface SaleRow {
  sale_id: string;
  document_no: string;
  counter_id: string | null;
  status: string;
  business_date: string;
  posted_at: Date;
  subtotal: string;
  discount_total: string;
  tax_total: string;
  grand_total: string;
  currency_code: string;
  store_snapshot_json: Record<string, unknown> | null;
  company_snapshot_json: Record<string, unknown> | null;
}

const SALE_SELECT = `SELECT sale_id, document_no, counter_id, status, business_date::text AS business_date,
    posted_at, subtotal, discount_total, tax_total, grand_total, currency_code, store_snapshot_json,
    company_snapshot_json
  FROM sales.sales WHERE tenant_id = $1 AND store_id = $2 AND status = 'COMPLETED'`;

function toSummary(row: SaleRow): SaleSummary {
  return {
    saleId: row.sale_id,
    documentNo: row.document_no,
    counterId: row.counter_id,
    status: row.status,
    businessDate: row.business_date,
    postedAt: row.posted_at.toISOString(),
    subtotal: row.subtotal,
    discountTotal: row.discount_total,
    taxTotal: row.tax_total,
    grandTotal: row.grand_total,
    currencyCode: row.currency_code,
  };
}

export async function listSales(
  sql: Sql,
  scope: Scope,
  options: { readonly limit?: number; readonly businessDate?: string } = {},
): Promise<SaleSummary[]> {
  const { rows } = await sql.query<SaleRow>(
    `${SALE_SELECT} AND ($3::date IS NULL OR business_date = $3)
     ORDER BY posted_at DESC, sale_id DESC LIMIT $4`,
    [
      scope.tenantId,
      scope.storeId,
      options.businessDate ?? null,
      Math.min(Math.max(options.limit ?? 50, 1), 500),
    ],
  );
  return rows.map(toSummary);
}

export async function getSale(sql: Sql, scope: Scope, saleId: string): Promise<SaleDetail | null> {
  const { rows } = await sql.query<SaleRow>(`${SALE_SELECT} AND sale_id = $3`, [
    scope.tenantId,
    scope.storeId,
    saleId,
  ]);
  const row = rows[0];
  if (row === undefined) return null;
  const lines = await sql.query<{
    sale_line_id: string;
    line_no: number;
    item_id: string;
    item_code_snapshot: string | null;
    item_name_snapshot: string;
    uom_code_snapshot: string;
    quantity: string;
    unit_price: string;
    line_total: string;
  }>(
    `SELECT sale_line_id, line_no, item_id, item_code_snapshot, item_name_snapshot, uom_code_snapshot,
       quantity, unit_price, line_total
     FROM sales.sale_lines WHERE tenant_id = $1 AND sale_id = $2 ORDER BY line_no`,
    [scope.tenantId, saleId],
  );
  return {
    ...toSummary(row),
    storeSnapshot: row.store_snapshot_json,
    companySnapshot: row.company_snapshot_json,
    lines: lines.rows.map((line) => ({
      saleLineId: line.sale_line_id,
      lineNo: line.line_no,
      itemId: line.item_id,
      itemCode: line.item_code_snapshot,
      itemName: line.item_name_snapshot,
      uomCode: line.uom_code_snapshot,
      quantity: line.quantity,
      unitPrice: line.unit_price,
      lineTotal: line.line_total,
    })),
  };
}

/** Totals of completed sales for one business date. */
export async function salesTotals(
  sql: Sql,
  scope: Scope,
  businessDate: string,
): Promise<{ readonly saleCount: number; readonly grandTotal: string }> {
  const { rows } = await sql.query<{ sale_count: string; grand_total: string }>(
    `SELECT count(*)::text AS sale_count, coalesce(sum(grand_total), 0)::text AS grand_total
     FROM sales.sales
     WHERE tenant_id = $1 AND store_id = $2 AND status = 'COMPLETED' AND business_date = $3`,
    [scope.tenantId, scope.storeId, businessDate],
  );
  return {
    saleCount: Number(rows[0]?.sale_count ?? "0"),
    grandTotal: rows[0]?.grand_total ?? "0",
  };
}
