import type { Pool, PoolClient } from "pg";

import { isApplicationBuildCompatible } from "../schema-version.js";
import { discoverMigrations } from "./discovery.js";
import {
  bootstrapMigrationLedger,
  readMigrationLedgerWithClient,
  recordMigrationCompleted,
  recordMigrationFailed,
  recordMigrationStarted,
} from "./ledger.js";
import { acquireMigrationLock, releaseMigrationLock } from "./lock.js";
import type { MigrationDefinition, MigrationLedgerRow, MigrationRunResult } from "./types.js";

export class MigrationError extends Error {}
export class MigrationChecksumMismatchError extends MigrationError {}
export class InterruptedMigrationError extends MigrationError {}
export class IncompatibleApplicationBuildError extends MigrationError {}

export interface RunMigrationsOptions {
  readonly applicationBuild: string;
  readonly migrationsDirectory?: string;
}

function validateExistingMigration(
  migration: MigrationDefinition,
  existing: MigrationLedgerRow,
  applicationBuild: string,
): void {
  if (existing.checksumSha256 !== migration.checksumSha256) {
    throw new MigrationChecksumMismatchError(
      `Checksum mismatch for applied migration ${migration.id}`,
    );
  }
  if (existing.outcome === "STARTED") {
    throw new InterruptedMigrationError(
      `Migration ${migration.id} is incomplete and requires classification or recovery`,
    );
  }
  if (existing.outcome === "FAILED") {
    throw new MigrationError(`Migration ${migration.id} previously failed and requires recovery`);
  }
  if (
    !isApplicationBuildCompatible(
      applicationBuild,
      existing.minimumApplicationBuild,
      existing.maximumApplicationBuild,
    )
  ) {
    throw new IncompatibleApplicationBuildError(
      `Application build ${applicationBuild} is incompatible with schema ${existing.schemaVersion}`,
    );
  }
}

async function executeMigration(client: PoolClient, migration: MigrationDefinition): Promise<void> {
  if (!migration.transactionSafe) {
    throw new MigrationError(
      `Migration ${migration.id} is not transaction-safe; staged migrations are not implemented`,
    );
  }
  await recordMigrationStarted(client, migration);
  try {
    await client.query("BEGIN");
    await client.query(migration.sql);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    const message = error instanceof Error ? error.message : "Unknown migration failure";
    await recordMigrationFailed(client, migration.id, message);
    throw new MigrationError(`Migration ${migration.id} failed: ${message}`, { cause: error });
  }
  await recordMigrationCompleted(client, migration.id);
}

export async function runMigrations(
  pool: Pool,
  options: RunMigrationsOptions,
): Promise<MigrationRunResult> {
  const migrations = await discoverMigrations(options.migrationsDirectory);
  const client = await pool.connect();
  const applied: string[] = [];
  const alreadyCurrent: string[] = [];
  let lockAcquired = false;
  try {
    await acquireMigrationLock(client);
    lockAcquired = true;
    await bootstrapMigrationLedger(client);

    const existingRows = await readMigrationLedgerWithClient(client);
    const existingById = new Map(existingRows.map((row) => [row.migrationId, row]));
    for (const migration of migrations) {
      const existing = existingById.get(migration.id);
      if (existing !== undefined) {
        validateExistingMigration(migration, existing, options.applicationBuild);
        alreadyCurrent.push(migration.id);
        continue;
      }
      if (
        !isApplicationBuildCompatible(
          options.applicationBuild,
          migration.minimumApplicationBuild,
          migration.maximumApplicationBuild,
        )
      ) {
        throw new IncompatibleApplicationBuildError(
          `Application build ${options.applicationBuild} cannot apply schema ${migration.schemaVersion}`,
        );
      }
      await executeMigration(client, migration);
      applied.push(migration.id);
    }

    const finalRows = await readMigrationLedgerWithClient(client);
    const completed = finalRows.filter((row) => row.outcome === "COMPLETED");
    return {
      applied,
      alreadyCurrent,
      schemaVersion: completed.at(-1)?.schemaVersion ?? null,
    };
  } finally {
    if (lockAcquired) {
      try {
        await releaseMigrationLock(client);
      } finally {
        client.release();
      }
    } else {
      client.release();
    }
  }
}
