/**
 * MM-010 TEST-ONLY PostgreSQL helper. Creates isolated, uniquely named databases and drops them.
 *
 * It follows the MM-004 database test helper (which is not exported). It uses
 * `MINIMART_TEST_POSTGRES_URL` (an administrative PostgreSQL URL) when set; otherwise it asks
 * Testcontainers for `postgres:17-alpine`, which needs a running Docker daemon.
 *
 * When PostgreSQL is not reachable this helper THROWS {@link PostgresUnavailableError} with setup
 * instructions. Tests that need a database call it directly, so they FAIL loudly; they are never
 * silently skipped and a failure here must never be read as a passed integration test.
 */
import { randomUUID } from "node:crypto";

import { Pool } from "pg";

export class PostgresUnavailableError extends Error {
  constructor(cause: unknown) {
    super(
      [
        "PostgreSQL is not available for the MM-010 integration tests.",
        "Set MINIMART_TEST_POSTGRES_URL to an administrative PostgreSQL 17 URL, for example",
        "postgresql://postgres:postgres@localhost:5432/postgres, or start Docker Desktop so",
        "Testcontainers can run postgres:17-alpine. See docs/phase-0/mm-010-sync-proof-spike.md.",
        `Cause: ${cause instanceof Error ? cause.message : String(cause)}`,
      ].join(" "),
    );
    this.name = "PostgresUnavailableError";
  }
}

export interface IsolatedDatabase {
  readonly name: string;
  readonly connectionString: string;
  readonly pool: Pool;
  drop(): Promise<void>;
}

interface ManagedContainer {
  getConnectionUri(): string;
  stop(): Promise<unknown>;
}

let managedContainer: ManagedContainer | undefined;

async function administrativeConnectionString(): Promise<string> {
  const configured = process.env["MINIMART_TEST_POSTGRES_URL"];
  if (configured !== undefined && configured !== "") return configured;
  try {
    const { PostgreSqlContainer } = await import("@testcontainers/postgresql");
    managedContainer ??= await new PostgreSqlContainer("postgres:17-alpine").start();
    return managedContainer.getConnectionUri();
  } catch (error) {
    throw new PostgresUnavailableError(error);
  }
}

export async function stopManagedPostgres(): Promise<void> {
  if (managedContainer === undefined) return;
  await managedContainer.stop();
  managedContainer = undefined;
}

export async function createIsolatedDatabase(prefix: string): Promise<IsolatedDatabase> {
  const adminUrl = await administrativeConnectionString();
  const name = `${prefix}_${randomUUID().replaceAll("-", "")}`;
  const adminPool = new Pool({ connectionString: adminUrl, max: 2 });
  try {
    await adminPool.query(`CREATE DATABASE "${name}"`);
  } catch (error) {
    await adminPool.end().catch(() => undefined);
    throw new PostgresUnavailableError(error);
  }
  const url = new URL(adminUrl);
  url.pathname = `/${name}`;
  const pool = new Pool({ connectionString: url.toString(), max: 10 });
  let dropped = false;
  return {
    name,
    connectionString: url.toString(),
    pool,
    async drop(): Promise<void> {
      if (dropped) return;
      dropped = true;
      await pool.end();
      await adminPool.query(
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()",
        [name],
      );
      await adminPool.query(`DROP DATABASE "${name}"`);
      await adminPool.end();
    },
  };
}
