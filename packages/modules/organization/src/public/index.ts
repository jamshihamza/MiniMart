import { DomainError, uuidv7, type Sql, type StoreContext } from "@minimart/shared-kernel";

export interface CounterRecord {
  readonly counterId: string;
  readonly counterCode: string;
  readonly displayName: string;
}

export interface StoreRecord {
  readonly tenantId: string;
  readonly companyId: string;
  readonly storeId: string;
  readonly storeCode: string;
  readonly displayName: string;
  readonly companyDisplayName: string;
  readonly companyLegalName: string;
  readonly timezoneName: string;
  readonly currencyCode: string;
  readonly countryCode: string;
}

export interface ProvisionStoreInput {
  readonly companyLegalName: string;
  readonly companyDisplayName: string;
  readonly storeCode: string;
  readonly storeName: string;
  readonly timezoneName: string;
  readonly currencyCode: string;
  readonly countryCode: string;
  readonly counters: readonly { readonly code: string; readonly name: string }[];
  readonly now: Date;
}

interface StoreRow {
  tenant_id: string;
  company_id: string;
  store_id: string;
  store_code: string;
  display_name: string;
  company_display_name: string;
  company_legal_name: string;
  timezone_name: string;
  currency_code: string;
  active_country_code: string;
}

function toStore(row: StoreRow): StoreRecord {
  return {
    tenantId: row.tenant_id,
    companyId: row.company_id,
    storeId: row.store_id,
    storeCode: row.store_code,
    displayName: row.display_name,
    companyDisplayName: row.company_display_name,
    companyLegalName: row.company_legal_name,
    timezoneName: row.timezone_name,
    currencyCode: row.currency_code,
    countryCode: row.active_country_code,
  };
}

const STORE_SELECT = `SELECT s.tenant_id, s.company_id, s.store_id, s.store_code, s.display_name,
    c.display_name AS company_display_name, c.legal_name AS company_legal_name,
    s.timezone_name, s.currency_code, s.active_country_code
  FROM org.stores s JOIN org.companies c ON c.tenant_id = s.tenant_id AND c.company_id = s.company_id`;

/** Creates a tenant, company, store and its counters. Intended for first-run provisioning. */
export async function provisionStore(sql: Sql, input: ProvisionStoreInput): Promise<StoreRecord> {
  if (input.counters.length === 0) {
    throw new DomainError("COUNTER_REQUIRED", "A store needs at least one counter", "VALIDATION");
  }
  const tenantId = uuidv7(input.now);
  const companyId = uuidv7(input.now);
  const storeId = uuidv7(input.now);
  await sql.query(
    "INSERT INTO org.tenants (tenant_id, name, status, created_at) VALUES ($1, $2, 'ACTIVE', $3)",
    [tenantId, input.companyDisplayName, input.now],
  );
  await sql.query(
    `INSERT INTO org.companies (company_id, tenant_id, legal_name, display_name, status, created_at)
     VALUES ($1, $2, $3, $4, 'ACTIVE', $5)`,
    [companyId, tenantId, input.companyLegalName, input.companyDisplayName, input.now],
  );
  await sql.query(
    `INSERT INTO org.stores (store_id, tenant_id, company_id, store_code, display_name, timezone_name,
       currency_code, active_country_code, default_language_code, receipt_display_name, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'en', $5, 'ACTIVE', $9)`,
    [
      storeId,
      tenantId,
      companyId,
      input.storeCode,
      input.storeName,
      input.timezoneName,
      input.currencyCode,
      input.countryCode,
      input.now,
    ],
  );
  for (const counter of input.counters) {
    await sql.query(
      `INSERT INTO org.counters (counter_id, tenant_id, store_id, counter_code, display_name, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE', $6)`,
      [uuidv7(input.now), tenantId, storeId, counter.code, counter.name, input.now],
    );
  }
  const store = await findActiveStore(sql, input.storeCode);
  if (store === null) throw new Error("Provisioned store could not be read back");
  return store;
}

/** The active store this Store Node serves. With no code, the earliest active store. */
export async function findActiveStore(sql: Sql, storeCode?: string): Promise<StoreRecord | null> {
  const { rows } = await sql.query<StoreRow>(
    `${STORE_SELECT} WHERE s.status = 'ACTIVE' AND ($1::text IS NULL OR s.store_code = $1)
     ORDER BY s.created_at, s.store_id LIMIT 1`,
    [storeCode ?? null],
  );
  const row = rows[0];
  return row === undefined ? null : toStore(row);
}

export async function listCounters(
  sql: Sql,
  context: Pick<StoreContext, "tenantId" | "storeId">,
): Promise<CounterRecord[]> {
  const { rows } = await sql.query<{
    counter_id: string;
    counter_code: string;
    display_name: string;
  }>(
    `SELECT counter_id, counter_code, display_name FROM org.counters
     WHERE tenant_id = $1 AND store_id = $2 AND status = 'ACTIVE' ORDER BY counter_code`,
    [context.tenantId, context.storeId],
  );
  return rows.map((row) => ({
    counterId: row.counter_id,
    counterCode: row.counter_code,
    displayName: row.display_name,
  }));
}

export async function requireCounter(
  sql: Sql,
  context: Pick<StoreContext, "tenantId" | "storeId">,
  counterId: string,
): Promise<CounterRecord> {
  const counter = (await listCounters(sql, context)).find((entry) => entry.counterId === counterId);
  if (counter === undefined) {
    throw new DomainError("COUNTER_NOT_FOUND", "Counter is not active in this store", "NOT_FOUND");
  }
  return counter;
}
