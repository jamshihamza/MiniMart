import type { Pool } from "pg";

import { checkDatabaseHealth, type DatabaseHealth } from "./health.js";
import { discoverMigrations } from "./migrations/discovery.js";
import { MIGRATION_LEDGER_EXCLUSION } from "./migrations/schema-introspection.js";
import type { MigrationLedgerRow } from "./migrations/types.js";
import { isApplicationBuildCompatible } from "./schema-version.js";

export interface DatabaseReadinessOptions {
  readonly applicationBuild: string;
  readonly migrationsDirectory?: string;
}

export interface DatabaseReadiness {
  readonly readyForWrites: boolean;
  readonly health: DatabaseHealth;
  readonly schemaVersion: string | null;
  readonly reasons: readonly string[];
}

interface RawLedgerRow {
  migration_id: string;
  module: string;
  schema_version: string;
  checksum_sha256: string;
  started_at: Date;
  completed_at: Date | null;
  minimum_application_build: string;
  maximum_application_build: string;
  outcome: "STARTED" | "COMPLETED" | "FAILED";
  resumable: boolean;
  failure_message: string | null;
}

function mapLedger(row: RawLedgerRow): MigrationLedgerRow {
  return {
    migrationId: row.migration_id,
    module: row.module,
    schemaVersion: row.schema_version,
    checksumSha256: row.checksum_sha256,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    minimumApplicationBuild: row.minimum_application_build,
    maximumApplicationBuild: row.maximum_application_build,
    outcome: row.outcome,
    resumable: row.resumable,
    failureMessage: row.failure_message,
  };
}

function expectedLogicalTables(sql: string): readonly string[] {
  return [...sql.matchAll(/\bCREATE\s+TABLE\s+([a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*)/giu)]
    .map((match) => match[1]?.toLowerCase())
    .filter((value): value is string => value !== undefined)
    .sort();
}

export async function assessDatabaseReadiness(
  pool: Pool,
  options: DatabaseReadinessOptions,
): Promise<DatabaseReadiness> {
  const health = await checkDatabaseHealth(pool);
  if (!health.healthy) {
    return { readyForWrites: false, health, schemaVersion: null, reasons: ["DATABASE_UNHEALTHY"] };
  }

  const migrations = await discoverMigrations(options.migrationsDirectory);
  const reasons: string[] = [];
  const ledgerExists = await pool.query<{ exists: boolean }>(
    "SELECT to_regclass('integration.schema_migrations') IS NOT NULL AS exists",
  );
  if (ledgerExists.rows[0]?.exists !== true) {
    return { readyForWrites: false, health, schemaVersion: null, reasons: ["LEDGER_MISSING"] };
  }

  const ledgerResult = await pool.query<RawLedgerRow>(`
    SELECT migration_id, module, schema_version, checksum_sha256, started_at, completed_at,
           minimum_application_build, maximum_application_build, outcome, resumable,
           failure_message
      FROM integration.schema_migrations
     ORDER BY migration_id
  `);
  const ledger = ledgerResult.rows.map(mapLedger);
  const byId = new Map(ledger.map((row) => [row.migrationId, row]));
  const knownIds = new Set(migrations.map((migration) => migration.id));

  for (const migration of migrations) {
    const row = byId.get(migration.id);
    if (row === undefined) {
      reasons.push(`MIGRATION_MISSING:${migration.id}`);
    } else if (row.outcome !== "COMPLETED") {
      reasons.push(`MIGRATION_${row.outcome}:${migration.id}`);
    } else {
      if (row.checksumSha256 !== migration.checksumSha256) {
        reasons.push(`CHECKSUM_MISMATCH:${migration.id}`);
      }
      if (
        !isApplicationBuildCompatible(
          options.applicationBuild,
          row.minimumApplicationBuild,
          row.maximumApplicationBuild,
        )
      ) {
        reasons.push(`APPLICATION_BUILD_INCOMPATIBLE:${migration.id}`);
      }
    }
  }
  for (const row of ledger) {
    if (!knownIds.has(row.migrationId)) reasons.push(`UNKNOWN_MIGRATION:${row.migrationId}`);
  }

  const expectedTables = migrations
    .flatMap((migration) => expectedLogicalTables(migration.sql))
    .sort();
  const tableResult = await pool.query<{ table_identity: string }>(
    `
    SELECT n.nspname || '.' || c.relname AS table_identity
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE c.relkind IN ('r', 'p')
       AND n.nspname NOT IN ('pg_catalog', 'information_schema')
       AND n.nspname NOT LIKE 'pg_toast%'
       AND n.nspname NOT LIKE 'pg_temp_%'
       AND (n.nspname || '.' || c.relname) <> $1
     ORDER BY table_identity
  `,
    [MIGRATION_LEDGER_EXCLUSION],
  );
  const actualTables = tableResult.rows.map((row) => row.table_identity);
  if (JSON.stringify(actualTables) !== JSON.stringify(expectedTables)) {
    reasons.push("LOGICAL_TABLE_SET_DRIFT");
  }

  const completed = ledger.filter((row) => row.outcome === "COMPLETED");
  return {
    readyForWrites: reasons.length === 0,
    health,
    schemaVersion: completed.at(-1)?.schemaVersion ?? null,
    reasons,
  };
}
