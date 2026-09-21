import { afterAll, describe, expect, it } from "vitest";

import { assessDatabaseReadiness } from "../src/readiness.js";
import { runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("database readiness", () => {
  it("becomes write-ready only after a compatible complete baseline", async () => {
    const database = await createTestDatabase("readiness");
    try {
      expect(
        (await assessDatabaseReadiness(database.pool, { applicationBuild: "0.0.0" }))
          .readyForWrites,
      ).toBe(false);
      await runMigrations(database.pool, { applicationBuild: "0.0.0" });
      const ready = await assessDatabaseReadiness(database.pool, { applicationBuild: "0.0.0" });
      expect(ready).toMatchObject({ readyForWrites: true, schemaVersion: "1.2.0", reasons: [] });
    } finally {
      await database.drop();
    }
  });
});
