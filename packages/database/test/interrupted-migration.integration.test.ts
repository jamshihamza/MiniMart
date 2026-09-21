import { afterAll, describe, expect, it } from "vitest";

import { assessDatabaseReadiness } from "../src/readiness.js";
import { discoverMigrations } from "../src/migrations/discovery.js";
import { bootstrapMigrationLedger } from "../src/migrations/ledger.js";
import { InterruptedMigrationError, runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createMigrationFixture } from "./support/migration-fixtures.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("interrupted migration", () => {
  it("blocks automatic execution and write readiness for non-resumable STARTED state", async () => {
    const database = await createTestDatabase("interrupted");
    const migrationsDirectory = await createMigrationFixture([
      { id: "interrupted", sql: "CREATE TABLE public.never_automatic (id integer);" },
    ]);
    try {
      const [migration] = await discoverMigrations(migrationsDirectory);
      if (migration === undefined) throw new Error("fixture migration missing");
      const client = await database.pool.connect();
      try {
        await bootstrapMigrationLedger(client);
        await client.query(
          `INSERT INTO integration.schema_migrations (
             migration_id, module, schema_version, checksum_sha256, started_at,
             minimum_application_build, maximum_application_build, outcome, resumable
           ) VALUES ($1, $2, $3, $4, clock_timestamp(), $5, $6, 'STARTED', false)`,
          [
            migration.id,
            migration.module,
            migration.schemaVersion,
            migration.checksumSha256,
            migration.minimumApplicationBuild,
            migration.maximumApplicationBuild,
          ],
        );
      } finally {
        client.release();
      }

      await expect(
        runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory }),
      ).rejects.toBeInstanceOf(InterruptedMigrationError);
      const readiness = await assessDatabaseReadiness(database.pool, {
        applicationBuild: "0.0.0",
        migrationsDirectory,
      });
      expect(readiness.readyForWrites).toBe(false);
      expect(readiness.reasons).toContain("MIGRATION_STARTED:interrupted");
    } finally {
      await database.drop();
    }
  });
});
