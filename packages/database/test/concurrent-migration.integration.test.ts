import { afterAll, describe, expect, it } from "vitest";

import { readMigrationLedger } from "../src/migrations/ledger.js";
import { runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createMigrationFixture } from "./support/migration-fixtures.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("concurrent migration", () => {
  it("serializes runners with the global advisory lock", async () => {
    const database = await createTestDatabase("concurrent");
    const migrationsDirectory = await createMigrationFixture([
      { id: "slow", sql: "SELECT pg_sleep(0.25); CREATE TABLE public.lock_result (id integer);" },
    ]);
    try {
      const [first, second] = await Promise.all([
        runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory }),
        runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory }),
      ]);
      expect([...first.applied, ...second.applied]).toEqual(["slow"]);
      expect([...first.alreadyCurrent, ...second.alreadyCurrent]).toEqual(["slow"]);
      expect(await readMigrationLedger(database.pool)).toHaveLength(1);
    } finally {
      await database.drop();
    }
  });
});
