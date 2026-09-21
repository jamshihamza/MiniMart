import { afterAll, describe, expect, it } from "vitest";

import { readMigrationLedger } from "../src/migrations/ledger.js";
import { MigrationError, runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createMigrationFixture } from "./support/migration-fixtures.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("failed migration", () => {
  it("rolls back DDL before recording failure separately", async () => {
    const database = await createTestDatabase("failed");
    const migrationsDirectory = await createMigrationFixture([
      {
        id: "fails",
        sql: "CREATE TABLE public.must_roll_back (id integer); SELECT missing_function();",
      },
    ]);
    try {
      await expect(
        runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory }),
      ).rejects.toBeInstanceOf(MigrationError);
      expect(
        await database.pool.query("SELECT to_regclass('public.must_roll_back') AS table_name"),
      ).toMatchObject({ rows: [{ table_name: null }] });
      expect(await readMigrationLedger(database.pool)).toMatchObject([
        { migrationId: "fails", outcome: "FAILED" },
      ]);
    } finally {
      await database.drop();
    }
  });
});
