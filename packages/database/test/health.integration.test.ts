import { Pool } from "pg";
import { afterAll, describe, expect, it } from "vitest";

import { checkDatabaseHealth } from "../src/health.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("database health", () => {
  it("reports a reachable PostgreSQL database", async () => {
    const database = await createTestDatabase("health");
    try {
      expect((await checkDatabaseHealth(database.pool)).healthy).toBe(true);
    } finally {
      await database.drop();
    }
  });

  it("recovers through a fresh pool after a connection failure", async () => {
    const unavailable = new Pool({
      connectionString: "postgresql://postgres:postgres@127.0.0.1:1/postgres",
      connectionTimeoutMillis: 100,
    });
    expect((await checkDatabaseHealth(unavailable)).healthy).toBe(false);
    await unavailable.end();

    const database = await createTestDatabase("recovery");
    try {
      expect((await checkDatabaseHealth(database.pool)).healthy).toBe(true);
    } finally {
      await database.drop();
    }
  });
});
