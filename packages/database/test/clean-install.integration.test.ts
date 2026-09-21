import { afterAll, describe, expect, it } from "vitest";

import { readMigrationLedger } from "../src/migrations/ledger.js";
import { runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("clean installation", () => {
  it("applies the frozen baseline and records one completed ledger row", async () => {
    const database = await createTestDatabase("clean");
    try {
      const result = await runMigrations(database.pool, { applicationBuild: "0.0.0" });
      expect(result).toMatchObject({
        applied: ["0001_v1_2_frozen_baseline"],
        schemaVersion: "1.2.0",
      });
      const ledger = await readMigrationLedger(database.pool);
      expect(ledger).toHaveLength(1);
      expect(ledger[0]).toMatchObject({
        migrationId: "0001_v1_2_frozen_baseline",
        module: "platform",
        outcome: "COMPLETED",
        minimumApplicationBuild: "0.0.0",
        maximumApplicationBuild: "0.99.99",
      });
      expect(ledger[0]?.checksumSha256).toMatch(/^[0-9a-f]{64}$/u);
      expect(ledger[0]?.completedAt).toBeInstanceOf(Date);

      const count = await database.pool.query<{ count: string }>(`
        SELECT count(*)::text AS count
          FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE c.relkind IN ('r', 'p')
           AND n.nspname NOT IN ('pg_catalog', 'information_schema')
           AND n.nspname NOT LIKE 'pg_toast%'
           AND n.nspname NOT LIKE 'pg_temp_%'
           AND (n.nspname || '.' || c.relname) <> 'integration.schema_migrations'
      `);
      expect(count.rows[0]?.count).toBe("79");
    } finally {
      await database.drop();
    }
  });
});
