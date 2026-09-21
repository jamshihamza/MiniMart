import { afterAll, describe, expect, it } from "vitest";

import { effectiveAuthorityDdl } from "./support/authority-fixture.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("effective frozen v1.2 authority", () => {
  it("executes completely after the exact CR-DB-002 overlay", async () => {
    const database = await createTestDatabase("effective_authority");
    try {
      await database.pool.query(await effectiveAuthorityDdl());
      const result = await database.pool.query<{ count: string }>(`
        SELECT count(*)::text AS count
          FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE c.relkind IN ('r', 'p')
           AND n.nspname NOT IN ('pg_catalog', 'information_schema')
           AND n.nspname NOT LIKE 'pg_toast%'
           AND n.nspname NOT LIKE 'pg_temp_%'
      `);
      expect(result.rows[0]?.count).toBe("79");
    } finally {
      await database.drop();
    }
  }, 30_000);
});
