import { afterAll, describe, expect, it } from "vitest";

import { MIGRATION_LOCK_IDENTIFIER } from "../src/migrations/lock.js";
import { runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createMigrationFixture } from "./support/migration-fixtures.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("migration lock release", () => {
  it("releases the session lock when a migration fails", async () => {
    const database = await createTestDatabase("lock_release");
    const migrationsDirectory = await createMigrationFixture([
      { id: "failure", sql: "SELECT no_such_function();" },
    ]);
    try {
      await expect(
        runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory }),
      ).rejects.toThrow();
      const result = await database.pool.query<{ acquired: boolean }>(
        "SELECT pg_try_advisory_lock($1::bigint) AS acquired",
        [MIGRATION_LOCK_IDENTIFIER.toString()],
      );
      expect(result.rows[0]?.acquired).toBe(true);
      await database.pool.query("SELECT pg_advisory_unlock($1::bigint)", [
        MIGRATION_LOCK_IDENTIFIER.toString(),
      ]);
    } finally {
      await database.drop();
    }
  });
});
