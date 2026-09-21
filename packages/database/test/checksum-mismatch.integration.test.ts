import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { MigrationChecksumMismatchError, runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createMigrationFixture } from "./support/migration-fixtures.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("migration checksum", () => {
  it("rejects changed bytes for an applied migration", async () => {
    const database = await createTestDatabase("checksum");
    const migrationsDirectory = await createMigrationFixture([
      { id: "immutable", sql: "CREATE TABLE public.immutable_migration (id integer);" },
    ]);
    try {
      await runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory });
      await writeFile(
        join(migrationsDirectory, "0001_immutable.sql"),
        "CREATE TABLE public.immutable_migration (id bigint);",
        "utf8",
      );
      await expect(
        runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory }),
      ).rejects.toBeInstanceOf(MigrationChecksumMismatchError);
    } finally {
      await database.drop();
    }
  });
});
