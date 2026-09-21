import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { readMigrationLedger } from "../src/migrations/ledger.js";
import { runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createMigrationFixture } from "./support/migration-fixtures.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("forward-fix harness", () => {
  it("preserves a completed migration and applies a later append-only migration", async () => {
    const database = await createTestDatabase("forward_fix");
    const migrationsDirectory = await createMigrationFixture([
      { id: "initial", sql: "CREATE TABLE public.forward_fix (id integer);" },
    ]);
    try {
      await runMigrations(database.pool, { applicationBuild: "0.0.0", migrationsDirectory });
      const manifestPath = join(migrationsDirectory, "manifest.json");
      const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
        formatVersion: number;
        migrations: Record<string, unknown>[];
      };
      await writeFile(
        join(migrationsDirectory, "0002_add_name.sql"),
        "ALTER TABLE public.forward_fix ADD COLUMN name text;",
        "utf8",
      );
      manifest.migrations.push({
        id: "add_name",
        module: "test",
        schemaVersion: "0.0.2",
        minimumApplicationBuild: "0.0.0",
        maximumApplicationBuild: "0.99.99",
        resumable: false,
        transactionSafe: true,
        file: "0002_add_name.sql",
      });
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

      const result = await runMigrations(database.pool, {
        applicationBuild: "0.0.0",
        migrationsDirectory,
      });
      expect(result).toMatchObject({ applied: ["add_name"], alreadyCurrent: ["initial"] });
      expect((await readMigrationLedger(database.pool)).map((row) => row.outcome)).toEqual([
        "COMPLETED",
        "COMPLETED",
      ]);
    } finally {
      await database.drop();
    }
  });
});
