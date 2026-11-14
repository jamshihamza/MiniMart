import {
  DomainError,
  divDec,
  formatDec,
  mulDec,
  parseDec,
  uuidv7,
  type Dec,
  type Sql,
  type StoreContext,
} from "@minimart/shared-kernel";

type Scope = Pick<StoreContext, "tenantId" | "storeId">;

export interface StockMovementInput {
  readonly itemId: string;
  /** Signed quantity in the item's base unit. Positive is inbound. */
  readonly quantityDelta: Dec;
  /** Unit cost for inbound stock. Outbound stock always leaves at the current moving WAC. */
  readonly inboundUnitCost?: Dec;
  readonly movementType: string;
  readonly sourceContext: string;
  readonly sourceType: string;
  readonly sourceId: string;
  readonly sourceLineId?: string;
  readonly sourceEffectKey: string;
  readonly postingEnvelopeId: string;
  readonly businessDate: string;
}

export interface StockMovementResult {
  readonly stockMovementId: string;
  readonly unitCost: Dec;
  readonly onHandAfter: Dec;
}

export interface PositionRecord {
  readonly itemId: string;
  readonly onHandQty: string;
  readonly movingWac: string;
  readonly updatedAt: string;
}

export interface MovementRecord {
  readonly stockMovementId: string;
  readonly itemId: string;
  readonly quantityDelta: string;
  readonly unitCost: string;
  readonly movementType: string;
  readonly sourceType: string;
  readonly sourceId: string;
  readonly businessDate: string;
  readonly occurredAt: string;
}

/**
 * Appends one immutable stock-ledger movement and updates the item's position and moving WAC.
 * Stock may not go below zero: the movement is rejected with NEGATIVE_STOCK_BLOCKED.
 * Must run inside the posting transaction.
 */
export async function postStockMovement(
  sql: Sql,
  context: Scope & Pick<StoreContext, "currencyCode" | "now">,
  input: StockMovementInput,
): Promise<StockMovementResult> {
  if (input.quantityDelta === 0n) {
    throw new DomainError("QUANTITY_ZERO", "Stock movement quantity cannot be zero", "VALIDATION");
  }
  await sql.query(
    `INSERT INTO inventory.inventory_positions (inventory_position_id, tenant_id, store_id, item_id,
       currency_code, updated_at) VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (tenant_id, store_id, item_id) DO NOTHING`,
    [
      uuidv7(context.now),
      context.tenantId,
      context.storeId,
      input.itemId,
      context.currencyCode,
      context.now,
    ],
  );
  const { rows } = await sql.query<{
    inventory_position_id: string;
    on_hand_qty: string;
    moving_wac: string;
  }>(
    `SELECT inventory_position_id, on_hand_qty, moving_wac FROM inventory.inventory_positions
     WHERE tenant_id = $1 AND store_id = $2 AND item_id = $3 FOR UPDATE`,
    [context.tenantId, context.storeId, input.itemId],
  );
  const position = rows[0];
  if (position === undefined) throw new Error("Inventory position could not be locked");

  const onHand = parseDec(position.on_hand_qty);
  const wac = parseDec(position.moving_wac);
  const onHandAfter = onHand + input.quantityDelta;
  if (onHandAfter < 0n) {
    throw new DomainError(
      "NEGATIVE_STOCK_BLOCKED",
      "This movement would take stock below zero",
      "BUSINESS_RULE",
      {
        itemId: input.itemId,
        onHand: formatDec(onHand, 3),
        requested: formatDec(-input.quantityDelta, 3),
      },
    );
  }

  const inbound = input.quantityDelta > 0n;
  const unitCost = inbound ? (input.inboundUnitCost ?? wac) : wac;
  if (unitCost < 0n) {
    throw new DomainError("COST_NEGATIVE", "Unit cost cannot be negative", "VALIDATION");
  }
  const wacAfter =
    inbound && onHandAfter > 0n
      ? divDec(mulDec(onHand, wac) + mulDec(input.quantityDelta, unitCost), onHandAfter)
      : wac;

  const stockMovementId = uuidv7(context.now);
  await sql.query(
    `INSERT INTO inventory.stock_movements (stock_movement_id, tenant_id, store_id, item_id,
       inventory_position_id, quantity_delta, from_bucket_code, to_bucket_code, unit_cost, value_delta,
       currency_code, movement_type, source_context, source_type, source_id, source_line_id,
       source_effect_key, posting_envelope_id, business_date, occurred_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
    [
      stockMovementId,
      context.tenantId,
      context.storeId,
      input.itemId,
      position.inventory_position_id,
      formatDec(input.quantityDelta, 8),
      inbound ? null : "SELLABLE",
      inbound ? "SELLABLE" : null,
      formatDec(unitCost, 8),
      formatDec(mulDec(input.quantityDelta, unitCost), 8),
      context.currencyCode,
      input.movementType,
      input.sourceContext,
      input.sourceType,
      input.sourceId,
      input.sourceLineId ?? null,
      input.sourceEffectKey,
      input.postingEnvelopeId,
      input.businessDate,
      context.now,
    ],
  );
  await sql.query(
    `UPDATE inventory.inventory_positions SET on_hand_qty = $3, moving_wac = $4, updated_at = $5,
       version = version + 1 WHERE tenant_id = $1 AND inventory_position_id = $2`,
    [
      context.tenantId,
      position.inventory_position_id,
      formatDec(onHandAfter, 8),
      formatDec(wacAfter, 8),
      context.now,
    ],
  );
  return { stockMovementId, unitCost, onHandAfter };
}

export async function listPositions(sql: Sql, scope: Scope): Promise<PositionRecord[]> {
  const { rows } = await sql.query<{
    item_id: string;
    on_hand_qty: string;
    moving_wac: string;
    updated_at: Date;
  }>(
    `SELECT item_id, on_hand_qty, moving_wac, updated_at FROM inventory.inventory_positions
     WHERE tenant_id = $1 AND store_id = $2`,
    [scope.tenantId, scope.storeId],
  );
  return rows.map((row) => ({
    itemId: row.item_id,
    onHandQty: row.on_hand_qty,
    movingWac: row.moving_wac,
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function listMovements(
  sql: Sql,
  scope: Scope,
  options: { readonly itemId?: string; readonly limit?: number } = {},
): Promise<MovementRecord[]> {
  const { rows } = await sql.query<{
    stock_movement_id: string;
    item_id: string;
    quantity_delta: string;
    unit_cost: string;
    movement_type: string;
    source_type: string;
    source_id: string;
    business_date: string;
    occurred_at: Date;
  }>(
    `SELECT stock_movement_id, item_id, quantity_delta, unit_cost, movement_type, source_type,
       source_id, business_date::text AS business_date, occurred_at
     FROM inventory.stock_movements
     WHERE tenant_id = $1 AND store_id = $2 AND ($3::uuid IS NULL OR item_id = $3)
     ORDER BY occurred_at DESC, stock_movement_id DESC LIMIT $4`,
    [
      scope.tenantId,
      scope.storeId,
      options.itemId ?? null,
      Math.min(Math.max(options.limit ?? 100, 1), 500),
    ],
  );
  return rows.map((row) => ({
    stockMovementId: row.stock_movement_id,
    itemId: row.item_id,
    quantityDelta: row.quantity_delta,
    unitCost: row.unit_cost,
    movementType: row.movement_type,
    sourceType: row.source_type,
    sourceId: row.source_id,
    businessDate: row.business_date,
    occurredAt: row.occurred_at.toISOString(),
  }));
}
