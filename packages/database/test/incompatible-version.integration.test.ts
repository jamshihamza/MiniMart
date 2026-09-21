import { afterAll, describe, expect, it } from "vitest";

import { IncompatibleApplicationBuildError, runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createMigrationFixture } from "./support/migration-fixtures.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("application/schema compatibility", () => {
  it("refuses migration when the application build is outside the declared range", async () => {
    const database = await createTestDatabase("incompatible");
    const migrationsDirectory = await createMigrationFixture([
      {
        id: "future",
        sql: "CREATE TABLE public.future_schema (id integer);",
        minimumApplicationBuild: "2.0.0",
        maximumApplicationBuild: "2.9.9",
      },
    ]);
    try {
      await expect(
        runMigrations(database.pool, { applicationBuild: "1.0.0", migrationsDirectory }),
      ).rejects.toBeInstanceOf(IncompatibleApplicationBuildError);
      const table = await database.pool.query("SELECT to_regclass('public.future_schema') AS name");
      expect(table.rows[0]?.name).toBeNull();
    } finally {
      await database.drop();
    }
  });
});
