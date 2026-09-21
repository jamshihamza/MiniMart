import { afterAll, describe, expect, it } from "vitest";

import { runMigrations } from "../src/migrations/runner.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("already-current migration", () => {
  it("does not reapply a completed migration", async () => {
    const database = await createTestDatabase("current");
    try {
      await runMigrations(database.pool, { applicationBuild: "0.0.0" });
      const second = await runMigrations(database.pool, { applicationBuild: "0.0.0" });
      expect(second.applied).toEqual([]);
      expect(second.alreadyCurrent).toEqual(["0001_v1_2_frozen_baseline"]);
    } finally {
      await database.drop();
    }
  });
});
