import { afterAll, describe, expect, it } from "vitest";

import { introspectPostgresCatalog } from "../src/migrations/schema-introspection.js";
import { stopManagedPostgres } from "./support/postgres-container.js";
import { createTestDatabase } from "./support/test-database.js";

afterAll(stopManagedPostgres);

describe("schema introspection foreign-key columns", () => {
  it("returns ordered JavaScript arrays for single and composite foreign keys", async () => {
    const database = await createTestDatabase("introspection_arrays");
    try {
      await database.pool.query(`
        CREATE SCHEMA introspection_probe;
        CREATE TABLE introspection_probe.parents (
          parent_id uuid PRIMARY KEY,
          tenant_id uuid NOT NULL,
          UNIQUE (tenant_id, parent_id)
        );
        CREATE TABLE introspection_probe.children (
          child_id uuid PRIMARY KEY,
          parent_id uuid NOT NULL REFERENCES introspection_probe.parents(parent_id),
          tenant_id uuid NOT NULL,
          FOREIGN KEY (tenant_id, parent_id)
            REFERENCES introspection_probe.parents(tenant_id, parent_id)
        );
      `);

      const catalog = await introspectPostgresCatalog(database.pool);
      const foreignKeys = catalog.constraints.filter(
        (constraint) =>
          constraint["schema_name"] === "introspection_probe" &&
          constraint["table_name"] === "children" &&
          constraint["constraint_type"] === "f",
      );

      expect(foreignKeys).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            source_columns: ["parent_id"],
            referenced_columns: ["parent_id"],
          }),
          expect.objectContaining({
            source_columns: ["tenant_id", "parent_id"],
            referenced_columns: ["tenant_id", "parent_id"],
          }),
        ]),
      );
      for (const foreignKey of foreignKeys) {
        expect(Array.isArray(foreignKey["source_columns"])).toBe(true);
        expect(Array.isArray(foreignKey["referenced_columns"])).toBe(true);
      }
    } finally {
      await database.drop();
    }
  });
});
