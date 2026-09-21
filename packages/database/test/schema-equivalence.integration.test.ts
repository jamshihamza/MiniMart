import { afterAll, describe, expect, it } from "vitest";

import { comparePostgresCatalogs } from "../src/migrations/schema-equivalence.js";
import {
  introspectPostgresCatalog,
  MIGRATION_LEDGER_EXCLUSION,
} from "../src/migrations/schema-introspection.js";
import { runMigrations } from "../src/migrations/runner.js";
import { effectiveAuthorityDdl } from "./support/authority-fixture.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("frozen schema equivalence", () => {
  it("matches the untouched authority with exactly the ledger table excluded", async () => {
    expect(MIGRATION_LEDGER_EXCLUSION).toBe("integration.schema_migrations");
    const authority = await createTestDatabase("authority");
    const candidate = await createTestDatabase("candidate");
    try {
      await authority.pool.query(await effectiveAuthorityDdl());
      await runMigrations(candidate.pool, { applicationBuild: "0.0.0" });
      const authorityCatalog = await introspectPostgresCatalog(authority.pool);
      const candidateCatalog = await introspectPostgresCatalog(candidate.pool);
      const result = comparePostgresCatalogs(authorityCatalog, candidateCatalog);
      expect(result).toEqual({ equivalent: true, differingSections: [] });
      expect(authorityCatalog.tables).toHaveLength(79);
      expect(candidateCatalog.tables).toHaveLength(79);
      expect(candidateCatalog.schemas).toContain("integration");

      const tenantConstraints = await candidate.pool.query<{
        constraint_type: string;
        definition: string;
      }>(`
          SELECT con.contype AS constraint_type, pg_get_constraintdef(con.oid, true) AS definition
            FROM pg_constraint con
            JOIN pg_class c ON c.oid = con.conrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
           WHERE n.nspname = 'org' AND c.relname = 'tenants'
           ORDER BY con.contype, con.conname
        `);
      expect(tenantConstraints.rows).toEqual([
        { constraint_type: "p", definition: "PRIMARY KEY (tenant_id)" },
      ]);
      const tenantId = await candidate.pool.query<{
        not_null: boolean;
        primary_index_unique: boolean;
      }>(`
          SELECT a.attnotnull AS not_null, i.indisunique AS primary_index_unique
            FROM pg_attribute a
            JOIN pg_class c ON c.oid = a.attrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            JOIN pg_index i ON i.indrelid = c.oid AND i.indisprimary
           WHERE n.nspname = 'org' AND c.relname = 'tenants' AND a.attname = 'tenant_id'
        `);
      expect(tenantId.rows).toEqual([{ not_null: true, primary_index_unique: true }]);

      const refundForeignKey = await candidate.pool.query<{
        source_columns: string[];
        referenced_schema: string;
        referenced_table: string;
        referenced_columns: string[];
        update_action: string;
        delete_action: string;
        match_type: string;
        deferrable: boolean;
        initially_deferred: boolean;
      }>(`
          SELECT
            ARRAY(
              SELECT a.attname
                FROM unnest(con.conkey) WITH ORDINALITY AS key(attnum, position)
                JOIN pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = key.attnum
               ORDER BY key.position
            ) AS source_columns,
            rn.nspname AS referenced_schema, rc.relname AS referenced_table,
            ARRAY(
              SELECT a.attname
                FROM unnest(con.confkey) WITH ORDINALITY AS key(attnum, position)
                JOIN pg_attribute a ON a.attrelid = con.confrelid AND a.attnum = key.attnum
               ORDER BY key.position
            ) AS referenced_columns,
            con.confupdtype AS update_action, con.confdeltype AS delete_action,
            con.confmatchtype AS match_type, con.condeferrable AS deferrable,
            con.condeferred AS initially_deferred
          FROM pg_constraint con
          JOIN pg_class c ON c.oid = con.conrelid
          JOIN pg_namespace n ON n.oid = c.relnamespace
          JOIN pg_class rc ON rc.oid = con.confrelid
          JOIN pg_namespace rn ON rn.oid = rc.relnamespace
          WHERE con.contype = 'f'
            AND n.nspname = 'payments' AND c.relname = 'refund_executions'
            AND rn.nspname = 'returns' AND rc.relname = 'refund_obligations'
        `);
      expect(refundForeignKey.rows).toEqual([
        {
          source_columns: ["tenant_id", "refund_obligation_id"],
          referenced_schema: "returns",
          referenced_table: "refund_obligations",
          referenced_columns: ["tenant_id", "refund_obligation_id"],
          update_action: "a",
          delete_action: "a",
          match_type: "s",
          deferrable: false,
          initially_deferred: false,
        },
      ]);
      await expect(
        candidate.pool.query(
          `INSERT INTO payments.refund_executions (
               refund_execution_id, tenant_id, refund_obligation_id, status, currency_code,
               amount, settlement_source_key, created_at
             ) VALUES ($1, $2, $3, 'PENDING', 'USD', 1, 'invalid-reference', clock_timestamp())`,
          [
            "0199a5e8-0000-7000-8000-000000000001",
            "0199a5e8-0000-7000-8000-000000000002",
            "0199a5e8-0000-7000-8000-000000000003",
          ],
        ),
      ).rejects.toMatchObject({ code: "23503" });
    } finally {
      await candidate.drop();
      await authority.drop();
    }
  }, 30_000);
});
