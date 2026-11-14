import {
  DomainError,
  formatDec,
  mulDec,
  parseDec,
  roundDec,
  uuidv7,
  type Dec,
  type Sql,
  type StoreContext,
} from "@minimart/shared-kernel";

type Scope = Pick<StoreContext, "tenantId" | "companyId" | "storeId" | "currencyCode" | "now">;

/** Decimal places of a money amount on a sale. */
export const MONEY_PLACES = 2;

/**
 * Extended amount of one sale line: quantity × unit price, rounded half away from zero to money
 * precision. No discount or tax is applied; those rules are not implemented.
 */
export function extendSaleLine(quantity: Dec, unitPrice: Dec): Dec {
  return roundDec(mulDec(quantity, unitPrice), MONEY_PLACES);
}

/** Sets the item's store selling price from now on. The previous price entry is end-dated. */
export async function setItemPrice(
  sql: Sql,
  context: Scope,
  itemId: string,
  price: string,
  changeReason?: string,
): Promise<string> {
  const amount = parseDec(price);
  if (amount < 0n) {
    throw new DomainError("PRICE_NEGATIVE", "Price cannot be negative", "VALIDATION");
  }
  const existing = await sql.query<{ item_price_schedule_id: string }>(
    `SELECT item_price_schedule_id FROM pricing.item_price_schedules
     WHERE tenant_id = $1 AND store_id = $2 AND item_id = $3 AND status = 'ACTIVE'
     ORDER BY created_at LIMIT 1 FOR UPDATE`,
    [context.tenantId, context.storeId, itemId],
  );
  let scheduleId = existing.rows[0]?.item_price_schedule_id;
  if (scheduleId === undefined) {
    scheduleId = uuidv7(context.now);
    await sql.query(
      `INSERT INTO pricing.item_price_schedules (item_price_schedule_id, tenant_id, company_id, store_id,
         item_id, status, effective_from, created_at) VALUES ($1, $2, $3, $4, $5, 'ACTIVE', $6, $6)`,
      [scheduleId, context.tenantId, context.companyId, context.storeId, itemId, context.now],
    );
  } else {
    await sql.query(
      `UPDATE pricing.item_price_entries SET effective_to = $3
       WHERE tenant_id = $1 AND item_price_schedule_id = $2 AND effective_to IS NULL`,
      [context.tenantId, scheduleId, context.now],
    );
  }
  const normalized = formatDec(amount, 8);
  await sql.query(
    `INSERT INTO pricing.item_price_entries (item_price_entry_id, tenant_id, item_price_schedule_id, price,
       currency_code, change_reason, effective_from) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      uuidv7(context.now),
      context.tenantId,
      scheduleId,
      normalized,
      context.currencyCode,
      changeReason ?? null,
      context.now,
    ],
  );
  return normalized;
}

/** Current store selling prices as exact decimal strings, keyed by item id. */
export async function currentPrices(
  sql: Sql,
  context: Pick<StoreContext, "tenantId" | "storeId" | "now">,
  itemIds: readonly string[],
): Promise<Map<string, string>> {
  const prices = new Map<string, string>();
  if (itemIds.length === 0) return prices;
  const { rows } = await sql.query<{ item_id: string; price: string }>(
    `SELECT DISTINCT ON (s.item_id) s.item_id, e.price
     FROM pricing.item_price_schedules s
     JOIN pricing.item_price_entries e
       ON e.tenant_id = s.tenant_id AND e.item_price_schedule_id = s.item_price_schedule_id
     WHERE s.tenant_id = $1 AND s.store_id = $2 AND s.status = 'ACTIVE' AND s.item_id = ANY($3::uuid[])
       AND e.effective_from <= $4 AND (e.effective_to IS NULL OR e.effective_to > $4)
     ORDER BY s.item_id, e.effective_from DESC`,
    [context.tenantId, context.storeId, itemIds, context.now],
  );
  for (const row of rows) prices.set(row.item_id, row.price);
  return prices;
}
