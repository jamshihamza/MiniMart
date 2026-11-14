import { randomUUID } from "node:crypto";

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { createTransactionRunner, poolSql, runMigrations } from "@minimart/database";
import {
  uuidv7,
  type Sql,
  type StoreContext,
  type TransactionRunner,
} from "@minimart/shared-kernel";
import { Pool } from "pg";

let managedContainer: StartedPostgreSqlContainer | undefined;

async function administrativeConnectionString(): Promise<string> {
  const configured = process.env["MINIMART_TEST_POSTGRES_URL"];
  if (configured !== undefined && configured !== "") return configured;
  managedContainer ??= await new PostgreSqlContainer("postgres:17-alpine").start();
  return managedContainer.getConnectionUri();
}

export interface StoreTestDatabase {
  readonly pool: Pool;
  readonly sql: Sql;
  readonly transactions: TransactionRunner;
  readonly context: StoreContext;
  readonly counterId: string;
  readonly counterCode: string;
  drop(): Promise<void>;
}

/**
 * Creates an isolated, migrated database with one tenant, company, store, counter and user.
 * The fixture is written with plain SQL so it does not depend on any module under test.
 */
export async function createStoreTestDatabase(prefix = "mm_mod"): Promise<StoreTestDatabase> {
  const admin = await administrativeConnectionString();
  const name = `${prefix}_${randomUUID().replaceAll("-", "")}`;
  const adminPool = new Pool({ connectionString: admin, max: 2 });
  await adminPool.query(`CREATE DATABASE "${name}"`);
  const url = new URL(admin);
  url.pathname = `/${name}`;
  const pool = new Pool({ connectionString: url.toString(), max: 10 });
  await runMigrations(pool, { applicationBuild: "0.0.0" });

  const now = new Date("2026-09-26T02:00:00Z");
  const tenantId = uuidv7(now);
  const companyId = uuidv7(now);
  const storeId = uuidv7(now);
  const counterId = uuidv7(now);
  const actorId = uuidv7(now);
  await pool.query(
    "INSERT INTO org.tenants (tenant_id, name, status, created_at) VALUES ($1, 'Test tenant', 'ACTIVE', $2)",
    [tenantId, now],
  );
  await pool.query(
    "INSERT INTO org.companies (company_id, tenant_id, legal_name, display_name, status, created_at) VALUES ($1, $2, 'Test Sdn Bhd', 'Test', 'ACTIVE', $3)",
    [companyId, tenantId, now],
  );
  await pool.query(
    `INSERT INTO org.stores (store_id, tenant_id, company_id, store_code, display_name, timezone_name,
       currency_code, active_country_code, default_language_code, status, created_at)
     VALUES ($1, $2, $3, 'S01', 'Test Store', 'Asia/Kuala_Lumpur', 'MYR', 'MY', 'en', 'ACTIVE', $4)`,
    [storeId, tenantId, companyId, now],
  );
  await pool.query(
    "INSERT INTO org.counters (counter_id, tenant_id, store_id, counter_code, display_name, status, created_at) VALUES ($1, $2, $3, 'POS01', 'Counter 01', 'ACTIVE', $4)",
    [counterId, tenantId, storeId, now],
  );
  await pool.query(
    "INSERT INTO iam.user_accounts (user_account_id, tenant_id, username, status, created_at) VALUES ($1, $2, 'tester', 'ACTIVE', $3)",
    [actorId, tenantId, now],
  );

  let dropped = false;
  return {
    pool,
    sql: poolSql(pool),
    transactions: createTransactionRunner(pool),
    context: {
      tenantId,
      companyId,
      storeId,
      currencyCode: "MYR",
      timezoneName: "Asia/Kuala_Lumpur",
      actorId,
      now,
    },
    counterId,
    counterCode: "POS01",
    async drop(): Promise<void> {
      if (dropped) return;
      dropped = true;
      await pool.end();
      // The pool is closed; its backends may take a moment to exit. Wait for them instead of
      // terminating them, which races with the closing sockets and surfaces as an unhandled error.
      for (let attempt = 0; ; attempt += 1) {
        try {
          await adminPool.query(`DROP DATABASE "${name}"`);
          break;
        } catch (error) {
          if (attempt >= 50 || (error as { code?: string }).code !== "55006") throw error;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      await adminPool.end();
      if (managedContainer !== undefined) {
        await managedContainer.stop();
        managedContainer = undefined;
      }
    },
  };
}
