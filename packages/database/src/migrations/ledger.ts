import type { Pool, PoolClient } from "pg";

import type { MigrationDefinition, MigrationLedgerRow } from "./types.js";

export const MIGRATION_LEDGER_TABLE = "integration.schema_migrations";

export const MIGRATION_LEDGER_DDL = `
CREATE SCHEMA IF NOT EXISTS integration;
CREATE TABLE IF NOT EXISTS integration.schema_migrations (
  migration_id text PRIMARY KEY,
  module text NOT NULL,
  schema_version text NOT NULL,
  checksum_sha256 character(64) NOT NULL
    CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$'),
  started_at timestamp with time zone NOT NULL,
  completed_at timestamp with time zone,
  minimum_application_build text NOT NULL,
  maximum_application_build text NOT NULL,
  outcome text NOT NULL
    CHECK (outcome IN ('STARTED', 'COMPLETED', 'FAILED')),
  resumable boolean NOT NULL DEFAULT false,
  failure_message text,
  CHECK (
    (outcome = 'STARTED' AND completed_at IS NULL AND failure_message IS NULL)
    OR (outcome = 'COMPLETED' AND completed_at IS NOT NULL AND failure_message IS NULL)
    OR (outcome = 'FAILED' AND completed_at IS NOT NULL AND failure_message IS NOT NULL)
  )
);
`;

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

function mapRow(row: RawLedgerRow): MigrationLedgerRow {
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

export async function bootstrapMigrationLedger(client: PoolClient): Promise<void> {
  await client.query(MIGRATION_LEDGER_DDL);
}

export async function readMigrationLedger(pool: Pool): Promise<readonly MigrationLedgerRow[]> {
  const result = await pool.query<RawLedgerRow>(`
    SELECT migration_id, module, schema_version, checksum_sha256, started_at, completed_at,
           minimum_application_build, maximum_application_build, outcome, resumable,
           failure_message
      FROM integration.schema_migrations
     ORDER BY migration_id
  `);
  return result.rows.map(mapRow);
}

export async function readMigrationLedgerWithClient(
  client: PoolClient,
): Promise<readonly MigrationLedgerRow[]> {
  const result = await client.query<RawLedgerRow>(`
    SELECT migration_id, module, schema_version, checksum_sha256, started_at, completed_at,
           minimum_application_build, maximum_application_build, outcome, resumable,
           failure_message
      FROM integration.schema_migrations
     ORDER BY migration_id
  `);
  return result.rows.map(mapRow);
}

export async function recordMigrationStarted(
  client: PoolClient,
  migration: MigrationDefinition,
): Promise<void> {
  await client.query(
    `INSERT INTO integration.schema_migrations (
       migration_id, module, schema_version, checksum_sha256, started_at, completed_at,
       minimum_application_build, maximum_application_build, outcome, resumable, failure_message
     ) VALUES ($1, $2, $3, $4, clock_timestamp(), NULL, $5, $6, 'STARTED', $7, NULL)`,
    [
      migration.id,
      migration.module,
      migration.schemaVersion,
      migration.checksumSha256,
      migration.minimumApplicationBuild,
      migration.maximumApplicationBuild,
      migration.resumable,
    ],
  );
}

export async function recordMigrationCompleted(
  client: PoolClient,
  migrationId: string,
): Promise<void> {
  await client.query(
    `UPDATE integration.schema_migrations
        SET outcome = 'COMPLETED', completed_at = clock_timestamp(), failure_message = NULL
      WHERE migration_id = $1 AND outcome = 'STARTED'`,
    [migrationId],
  );
}

export async function recordMigrationFailed(
  client: PoolClient,
  migrationId: string,
  failureMessage: string,
): Promise<void> {
  await client.query(
    `UPDATE integration.schema_migrations
        SET outcome = 'FAILED', completed_at = clock_timestamp(), failure_message = $2
      WHERE migration_id = $1 AND outcome = 'STARTED'`,
    [migrationId, failureMessage.slice(0, 2_000)],
  );
}
