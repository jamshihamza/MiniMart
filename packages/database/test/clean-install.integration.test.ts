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

      const syncCheckpointColumns = await database.pool.query<{
        column_name: string;
        data_type: string;
        is_nullable: string;
      }>(`
        SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
         WHERE table_schema = 'integration' AND table_name = 'sync_checkpoints'
         ORDER BY ordinal_position
      `);
      expect(syncCheckpointColumns.rows).toEqual([
        { column_name: "sync_checkpoint_id", data_type: "uuid", is_nullable: "NO" },
        { column_name: "tenant_id", data_type: "uuid", is_nullable: "NO" },
        { column_name: "peer_id", data_type: "uuid", is_nullable: "NO" },
        { column_name: "stream_code", data_type: "text", is_nullable: "NO" },
        { column_name: "checkpoint_value", data_type: "text", is_nullable: "YES" },
        {
          column_name: "updated_at",
          data_type: "timestamp with time zone",
          is_nullable: "NO",
        },
        { column_name: "created_at", data_type: "timestamp with time zone", is_nullable: "NO" },
        { column_name: "version", data_type: "bigint", is_nullable: "NO" },
      ]);
    } finally {
      await database.drop();
    }
  });
});
