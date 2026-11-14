import {
  DomainError,
  formatDec,
  parseDec,
  uuidv7,
  type Dec,
  type Sql,
  type StoreContext,
} from "@minimart/shared-kernel";

type Scope = Pick<StoreContext, "tenantId" | "storeId">;

export interface BusinessDayRecord {
  readonly businessDayId: string;
  readonly businessDate: string;
  readonly status: string;
  readonly openedAt: string | null;
  readonly closedAt: string | null;
}

export interface ShiftRecord {
  readonly shiftId: string;
  readonly counterId: string | null;
  readonly userId: string;
  readonly businessDayId: string;
  readonly businessDate: string;
  readonly status: string;
  readonly openingFloat: string;
  readonly expectedCash: string;
  readonly actualCash: string | null;
  readonly varianceAmount: string | null;
  readonly openedAt: string;
  readonly closedAt: string | null;
}

export interface CashMovementRecord {
  readonly cashMovementId: string;
  readonly movementType: string;
  readonly amount: string;
  readonly reasonCode: string | null;
  readonly sourceType: string;
  readonly sourceId: string;
  readonly occurredAt: string;
}

export interface CashMovementInput {
  readonly shiftId: string;
  readonly movementType: "OPENING_FLOAT" | "CASH_SALE" | "CASH_IN" | "CASH_OUT";
  /** Signed drawer effect. Cash out is negative. */
  readonly amount: Dec;
  readonly sourceContext: string;
  readonly sourceType: string;
  readonly sourceId: string;
  readonly sourceEffectKey: string;
  readonly reasonCode?: string;
  readonly postingEnvelopeId: string;
}

interface DayRow {
  business_day_id: string;
  business_date: string;
  status: string;
  opened_at: Date | null;
  closed_at: Date | null;
}

const DAY_SELECT = `SELECT business_day_id, business_date::text AS business_date, status, opened_at,
  closed_at FROM cash.business_days WHERE tenant_id = $1 AND store_id = $2`;

const toDay = (row: DayRow): BusinessDayRecord => ({
  businessDayId: row.business_day_id,
  businessDate: row.business_date,
  status: row.status,
  openedAt: row.opened_at?.toISOString() ?? null,
  closedAt: row.closed_at?.toISOString() ?? null,
});

/** The store's open Business Day, if there is one. */
export async function findOpenBusinessDay(
  sql: Sql,
  scope: Scope,
): Promise<BusinessDayRecord | null> {
  const { rows } = await sql.query<DayRow>(
    `${DAY_SELECT} AND status = 'OPEN' ORDER BY business_date DESC LIMIT 1`,
    [scope.tenantId, scope.storeId],
  );
  const row = rows[0];
  return row === undefined ? null : toDay(row);
}

export async function listBusinessDays(sql: Sql, scope: Scope): Promise<BusinessDayRecord[]> {
  const { rows } = await sql.query<DayRow>(`${DAY_SELECT} ORDER BY business_date DESC LIMIT 60`, [
    scope.tenantId,
    scope.storeId,
  ]);
  return rows.map(toDay);
}

/**
 * Returns the open Business Day, opening one for the given date when the store has none open.
 * A date that has already been closed cannot be opened again.
 */
export async function ensureOpenBusinessDay(
  sql: Sql,
  context: Scope & Pick<StoreContext, "now">,
  businessDate: string,
): Promise<BusinessDayRecord> {
  await sql.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
    `business-day:${context.tenantId}:${context.storeId}`,
  ]);
  const open = await findOpenBusinessDay(sql, context);
  if (open !== null) return open;
  const existing = await sql.query<DayRow>(`${DAY_SELECT} AND business_date = $3`, [
    context.tenantId,
    context.storeId,
    businessDate,
  ]);
  if (existing.rows.length > 0) {
    throw new DomainError(
      "BUSINESS_DAY_CLOSED",
      `Business Day ${businessDate} is already closed and cannot be reopened`,
      "CONFLICT",
    );
  }
  const businessDayId = uuidv7(context.now);
  await sql.query(
    `INSERT INTO cash.business_days (business_day_id, tenant_id, store_id, business_date, status,
       opened_at) VALUES ($1, $2, $3, $4, 'OPEN', $5)`,
    [businessDayId, context.tenantId, context.storeId, businessDate, context.now],
  );
  return {
    businessDayId,
    businessDate,
    status: "OPEN",
    openedAt: context.now.toISOString(),
    closedAt: null,
  };
}

/** Closes the Business Day. Refused while any shift on it is still open. */
export async function closeBusinessDay(
  sql: Sql,
  context: Scope & Pick<StoreContext, "now">,
  businessDayId: string,
): Promise<BusinessDayRecord> {
  const { rows } = await sql.query<DayRow>(`${DAY_SELECT} AND business_day_id = $3 FOR UPDATE`, [
    context.tenantId,
    context.storeId,
    businessDayId,
  ]);
  const day = rows[0];
  if (day === undefined) {
    throw new DomainError("BUSINESS_DAY_NOT_FOUND", "Business Day was not found", "NOT_FOUND");
  }
  if (day.status !== "OPEN") {
    throw new DomainError("BUSINESS_DAY_NOT_OPEN", "Business Day is already closed", "CONFLICT");
  }
  const open = await sql.query<{ count: string }>(
    `SELECT count(*)::text AS count FROM cash.cashier_shifts
     WHERE tenant_id = $1 AND business_day_id = $2 AND status = 'OPEN'`,
    [context.tenantId, businessDayId],
  );
  const openShifts = Number(open.rows[0]?.count ?? "0");
  if (openShifts > 0) {
    throw new DomainError(
      "OPEN_SHIFTS_BLOCK_DAY_CLOSE",
      `${openShifts} shift(s) are still open on this Business Day`,
      "BUSINESS_RULE",
      { openShifts },
    );
  }
  await sql.query(
    `UPDATE cash.business_days SET status = 'CLOSED', closed_at = $3, version = version + 1
     WHERE tenant_id = $1 AND business_day_id = $2`,
    [context.tenantId, businessDayId, context.now],
  );
  return toDay({ ...day, status: "CLOSED", closed_at: context.now });
}

interface ShiftRow {
  cashier_shift_id: string;
  counter_id: string | null;
  user_id: string;
  business_day_id: string;
  business_date: string;
  status: string;
  opening_float: string;
  expected_cash: string;
  actual_cash: string | null;
  variance_amount: string | null;
  opened_at: Date;
  closed_at: Date | null;
}

const SHIFT_SELECT = `SELECT s.cashier_shift_id, s.counter_id, s.user_id, s.business_day_id,
    d.business_date::text AS business_date, s.status, s.opening_float, s.expected_cash, s.actual_cash,
    s.variance_amount, s.opened_at, s.closed_at
  FROM cash.cashier_shifts s
  JOIN cash.business_days d ON d.tenant_id = s.tenant_id AND d.business_day_id = s.business_day_id
  WHERE s.tenant_id = $1 AND s.store_id = $2`;

const toShift = (row: ShiftRow): ShiftRecord => ({
  shiftId: row.cashier_shift_id,
  counterId: row.counter_id,
  userId: row.user_id,
  businessDayId: row.business_day_id,
  businessDate: row.business_date,
  status: row.status,
  openingFloat: row.opening_float,
  expectedCash: row.expected_cash,
  actualCash: row.actual_cash,
  varianceAmount: row.variance_amount,
  openedAt: row.opened_at.toISOString(),
  closedAt: row.closed_at?.toISOString() ?? null,
});

export async function findOpenShift(
  sql: Sql,
  scope: Scope,
  counterId: string,
): Promise<ShiftRecord | null> {
  const { rows } = await sql.query<ShiftRow>(
    `${SHIFT_SELECT} AND s.counter_id = $3 AND s.status = 'OPEN' LIMIT 1`,
    [scope.tenantId, scope.storeId, counterId],
  );
  const row = rows[0];
  return row === undefined ? null : toShift(row);
}

export async function getShift(
  sql: Sql,
  scope: Scope,
  shiftId: string,
): Promise<ShiftRecord | null> {
  const { rows } = await sql.query<ShiftRow>(`${SHIFT_SELECT} AND s.cashier_shift_id = $3`, [
    scope.tenantId,
    scope.storeId,
    shiftId,
  ]);
  const row = rows[0];
  return row === undefined ? null : toShift(row);
}

export async function listShifts(sql: Sql, scope: Scope, limit = 50): Promise<ShiftRecord[]> {
  const { rows } = await sql.query<ShiftRow>(`${SHIFT_SELECT} ORDER BY s.opened_at DESC LIMIT $3`, [
    scope.tenantId,
    scope.storeId,
    Math.min(Math.max(limit, 1), 200),
  ]);
  return rows.map(toShift);
}

/** Opens a shift on a counter. A counter can have only one open shift at a time. */
export async function openShift(
  sql: Sql,
  context: Scope & Pick<StoreContext, "currencyCode" | "now">,
  input: {
    readonly counterId: string;
    readonly userId: string;
    readonly businessDayId: string;
    readonly openingFloat: Dec;
    readonly postingEnvelopeId: string;
  },
): Promise<ShiftRecord> {
  if (input.openingFloat < 0n) {
    throw new DomainError("OPENING_CASH_NEGATIVE", "Opening cash cannot be negative", "VALIDATION");
  }
  await sql.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
    `shift-open:${context.tenantId}:${input.counterId}`,
  ]);
  const existing = await findOpenShift(sql, context, input.counterId);
  if (existing !== null) {
    throw new DomainError(
      "SHIFT_ALREADY_OPEN",
      "This counter already has an open shift",
      "CONFLICT",
      { shiftId: existing.shiftId },
    );
  }
  const shiftId = uuidv7(context.now);
  await sql.query(
    `INSERT INTO cash.cashier_shifts (cashier_shift_id, tenant_id, store_id, counter_id, user_id,
       business_day_id, status, currency_code, opening_float, expected_cash, opened_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', $7, $8, 0, $9)`,
    [
      shiftId,
      context.tenantId,
      context.storeId,
      input.counterId,
      input.userId,
      input.businessDayId,
      context.currencyCode,
      formatDec(input.openingFloat, 8),
      context.now,
    ],
  );
  if (input.openingFloat > 0n) {
    await postCashMovement(sql, context, {
      shiftId,
      movementType: "OPENING_FLOAT",
      amount: input.openingFloat,
      sourceContext: "CASH",
      sourceType: "CASHIER_SHIFT",
      sourceId: shiftId,
      sourceEffectKey: `shift:${shiftId}:opening-float`,
      postingEnvelopeId: input.postingEnvelopeId,
    });
  }
  const shift = await getShift(sql, context, shiftId);
  if (shift === null) throw new Error("Opened shift could not be read back");
  return shift;
}

/**
 * Appends one immutable cash movement to an open shift and moves its expected cash.
 * Expected cash is only ever derived from these movements.
 */
export async function postCashMovement(
  sql: Sql,
  context: Scope & Pick<StoreContext, "currencyCode" | "now">,
  input: CashMovementInput,
): Promise<string> {
  if (input.amount === 0n) {
    throw new DomainError("CASH_AMOUNT_ZERO", "Cash movement amount cannot be zero", "VALIDATION");
  }
  const { rows } = await sql.query<ShiftRow>(
    `${SHIFT_SELECT} AND s.cashier_shift_id = $3 FOR UPDATE OF s`,
    [context.tenantId, context.storeId, input.shiftId],
  );
  const shift = rows[0];
  if (shift === undefined) {
    throw new DomainError("SHIFT_NOT_FOUND", "Shift was not found", "NOT_FOUND");
  }
  if (shift.status !== "OPEN") {
    throw new DomainError("SHIFT_NOT_OPEN", "Shift is closed", "CONFLICT");
  }
  const expectedAfter = parseDec(shift.expected_cash) + input.amount;
  if (expectedAfter < 0n) {
    throw new DomainError(
      "CASH_OUT_EXCEEDS_EXPECTED",
      "Cash out is larger than the cash expected in the drawer",
      "BUSINESS_RULE",
      { expectedCash: formatDec(parseDec(shift.expected_cash)) },
    );
  }
  const cashMovementId = uuidv7(context.now);
  await sql.query(
    `INSERT INTO cash.cash_movements (cash_movement_id, tenant_id, cashier_shift_id, movement_type,
       amount, currency_code, source_context, source_type, source_id, source_effect_key, reason_code,
       posting_envelope_id, business_date, occurred_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      cashMovementId,
      context.tenantId,
      input.shiftId,
      input.movementType,
      formatDec(input.amount, 8),
      context.currencyCode,
      input.sourceContext,
      input.sourceType,
      input.sourceId,
      input.sourceEffectKey,
      input.reasonCode ?? null,
      input.postingEnvelopeId,
      shift.business_date,
      context.now,
    ],
  );
  await sql.query(
    `UPDATE cash.cashier_shifts SET expected_cash = $3, version = version + 1
     WHERE tenant_id = $1 AND cashier_shift_id = $2`,
    [context.tenantId, input.shiftId, formatDec(expectedAfter, 8)],
  );
  return cashMovementId;
}

/** Adds a tender amount to the shift's per-method summary. */
export async function addTenderToShift(
  sql: Sql,
  context: Pick<StoreContext, "tenantId" | "now">,
  shiftId: string,
  methodCode: string,
  amount: Dec,
): Promise<void> {
  const updated = await sql.query<{ shift_tender_summary_id: string }>(
    `UPDATE cash.shift_tender_summaries SET amount = amount + $4, updated_at = $5
     WHERE tenant_id = $1 AND cashier_shift_id = $2 AND method_code = $3
     RETURNING shift_tender_summary_id`,
    [context.tenantId, shiftId, methodCode, formatDec(amount, 8), context.now],
  );
  if (updated.rows.length > 0) return;
  await sql.query(
    `INSERT INTO cash.shift_tender_summaries (shift_tender_summary_id, tenant_id, cashier_shift_id,
       method_code, amount, updated_at) VALUES ($1, $2, $3, $4, $5, $6)`,
    [uuidv7(context.now), context.tenantId, shiftId, methodCode, formatDec(amount, 8), context.now],
  );
}

export async function listTenderSummaries(
  sql: Sql,
  context: Pick<StoreContext, "tenantId">,
  shiftId: string,
): Promise<{ readonly methodCode: string; readonly amount: string }[]> {
  const { rows } = await sql.query<{ method_code: string; amount: string }>(
    `SELECT method_code, amount FROM cash.shift_tender_summaries
     WHERE tenant_id = $1 AND cashier_shift_id = $2 ORDER BY method_code`,
    [context.tenantId, shiftId],
  );
  return rows.map((row) => ({ methodCode: row.method_code, amount: row.amount }));
}

export async function listCashMovements(
  sql: Sql,
  context: Pick<StoreContext, "tenantId">,
  shiftId: string,
): Promise<CashMovementRecord[]> {
  const { rows } = await sql.query<{
    cash_movement_id: string;
    movement_type: string;
    amount: string;
    reason_code: string | null;
    source_type: string;
    source_id: string;
    occurred_at: Date;
  }>(
    `SELECT cash_movement_id, movement_type, amount, reason_code, source_type, source_id, occurred_at
     FROM cash.cash_movements WHERE tenant_id = $1 AND cashier_shift_id = $2
     ORDER BY occurred_at, cash_movement_id`,
    [context.tenantId, shiftId],
  );
  return rows.map((row) => ({
    cashMovementId: row.cash_movement_id,
    movementType: row.movement_type,
    amount: row.amount,
    reasonCode: row.reason_code,
    sourceType: row.source_type,
    sourceId: row.source_id,
    occurredAt: row.occurred_at.toISOString(),
  }));
}

/**
 * Closes a shift with the counted cash. Variance is counted minus expected; expected cash is not
 * changed by the count.
 */
export async function closeShift(
  sql: Sql,
  context: Scope & Pick<StoreContext, "now">,
  input: { readonly shiftId: string; readonly countedCash: Dec },
): Promise<ShiftRecord> {
  if (input.countedCash < 0n) {
    throw new DomainError("COUNTED_CASH_NEGATIVE", "Counted cash cannot be negative", "VALIDATION");
  }
  const { rows } = await sql.query<ShiftRow>(
    `${SHIFT_SELECT} AND s.cashier_shift_id = $3 FOR UPDATE OF s`,
    [context.tenantId, context.storeId, input.shiftId],
  );
  const shift = rows[0];
  if (shift === undefined) {
    throw new DomainError("SHIFT_NOT_FOUND", "Shift was not found", "NOT_FOUND");
  }
  if (shift.status !== "OPEN") {
    throw new DomainError("SHIFT_NOT_OPEN", "Shift is already closed", "CONFLICT");
  }
  const variance = input.countedCash - parseDec(shift.expected_cash);
  await sql.query(
    `UPDATE cash.cashier_shifts SET status = 'CLOSED', actual_cash = $3, variance_amount = $4,
       closed_at = $5, version = version + 1 WHERE tenant_id = $1 AND cashier_shift_id = $2`,
    [
      context.tenantId,
      input.shiftId,
      formatDec(input.countedCash, 8),
      formatDec(variance, 8),
      context.now,
    ],
  );
  const closed = await getShift(sql, context, input.shiftId);
  if (closed === null) throw new Error("Closed shift could not be read back");
  return closed;
}
