import { afterAll, describe, expect, it } from "vitest";

import { assessDatabaseReadiness } from "../src/readiness.js";
import { runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("schema drift", () => {
  it("blocks write readiness when the frozen logical table set changes", async () => {
    const database = await createTestDatabase("drift");
    try {
      await runMigrations(database.pool, { applicationBuild: "0.0.0" });
      await database.pool.query("DROP TABLE catalog.categories CASCADE");
      const readiness = await assessDatabaseReadiness(database.pool, { applicationBuild: "0.0.0" });
      expect(readiness.readyForWrites).toBe(false);
      expect(readiness.reasons).toContain("LOGICAL_TABLE_SET_DRIFT");
    } finally {
      await database.drop();
    }
  });
});
