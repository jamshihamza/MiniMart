import { describe, expect, it } from "vitest";

import { loadServiceConfiguration } from "../src/index.js";

describe("loadServiceConfiguration", () => {
  it("loads the typed Store Node settings and database settings", () => {
    const configuration = loadServiceConfiguration("edge", {
      DATABASE_URL: "postgresql://user:secret@localhost/minimart",
      MINIMART_SERVICE_NAME: "store-001",
      MINIMART_APPLICATION_BUILD: "1.2.3",
      MINIMART_SHUTDOWN_TIMEOUT_MS: "2500",
    });
    expect(configuration).toMatchObject({
      runtimeMode: "edge",
      serviceName: "store-001",
      applicationBuild: "1.2.3",
      shutdownTimeoutMilliseconds: 2500,
    });
    expect(configuration.database.connectionString).toContain("secret");
  });

  it("fails fast when required database configuration is absent", () => {
    expect(() => loadServiceConfiguration("edge", {})).toThrow("DATABASE_URL is required");
  });

  it.each([
    [
      { DATABASE_URL: "postgresql://localhost/db", MINIMART_SERVICE_NAME: "bad name" },
      "MINIMART_SERVICE_NAME",
    ],
    [
      { DATABASE_URL: "postgresql://localhost/db", MINIMART_SHUTDOWN_TIMEOUT_MS: "0" },
      "MINIMART_SHUTDOWN_TIMEOUT_MS",
    ],
  ])("rejects invalid service configuration", (environment, expected) => {
    expect(() => loadServiceConfiguration("edge", environment)).toThrow(expected);
  });
});
