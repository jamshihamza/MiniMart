import { describe, expect, it } from "vitest";

import { databaseConfigFromEnvironment } from "../src/config.js";
import {
  deriveMigrationLockIdentifier,
  MIGRATION_LOCK_IDENTIFIER,
} from "../src/migrations/lock.js";
import { compareSemanticVersions, isApplicationBuildCompatible } from "../src/schema-version.js";

describe("database configuration", () => {
  it("parses validated defaults without exposing the URL in errors", () => {
    expect(databaseConfigFromEnvironment({ DATABASE_URL: "postgresql://secret" })).toMatchObject({
      maximumPoolSize: 10,
      statementTimeoutMilliseconds: 30_000,
    });
    expect(() =>
      databaseConfigFromEnvironment({
        DATABASE_URL: "postgresql://secret",
        DATABASE_POOL_MAX: "zero",
      }),
    ).toThrow("DATABASE_POOL_MAX");
  });

  it("uses the documented deterministic signed advisory-lock identifier", () => {
    expect(MIGRATION_LOCK_IDENTIFIER).toBe(-6536354544016657719n);
    expect(deriveMigrationLockIdentifier()).toBe(MIGRATION_LOCK_IDENTIFIER);
  });

  it("enforces inclusive semantic build compatibility", () => {
    expect(compareSemanticVersions("1.2.0", "1.1.9")).toBeGreaterThan(0);
    expect(isApplicationBuildCompatible("1.2.0", "1.2.0", "1.2.0")).toBe(true);
    expect(isApplicationBuildCompatible("2.0.0", "1.0.0", "1.9.9")).toBe(false);
  });
});
