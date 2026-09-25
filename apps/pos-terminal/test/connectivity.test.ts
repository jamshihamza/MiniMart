import { describe, expect, it } from "vitest";

import { interpretStoreNodeStatus, type SystemStatusProbe } from "../src/connectivity.js";

const health = { statusCode: 200, body: '{"status":"UP","time":"2026-09-25T00:00:00Z"}' };
const ready = {
  statusCode: 200,
  body: '{"transactionalReady":true,"databaseReady":true,"schemaCompatible":true,"reasons":[]}',
};

function probe(healthReply = health, readinessReply = ready): SystemStatusProbe {
  return { health: healthReply, readiness: readinessReply };
}

describe("Store Node status interpretation", () => {
  it("requires both contract-valid liveness and all transactional gates", () => {
    expect(interpretStoreNodeStatus(probe())).toBe("online");
    expect(interpretStoreNodeStatus(probe(health, { statusCode: null, body: null }))).toBe(
      "not-ready",
    );
    expect(interpretStoreNodeStatus(probe({ statusCode: null, body: null }))).toBe("unavailable");
  });

  it("distinguishes database, schema, and transactional failure", () => {
    expect(
      interpretStoreNodeStatus(
        probe(health, {
          statusCode: 200,
          body: '{"transactionalReady":false,"databaseReady":false,"schemaCompatible":false,"reasons":["DATABASE_UNHEALTHY"]}',
        }),
      ),
    ).toBe("database-unavailable");
    expect(
      interpretStoreNodeStatus(
        probe(health, {
          statusCode: 200,
          body: '{"transactionalReady":false,"databaseReady":true,"schemaCompatible":false,"reasons":["SCHEMA_INCOMPATIBLE"]}',
        }),
      ),
    ).toBe("schema-incompatible");
    expect(
      interpretStoreNodeStatus(
        probe(health, {
          statusCode: 200,
          body: '{"transactionalReady":false,"databaseReady":true,"schemaCompatible":true,"reasons":["SERVICE_STARTING"]}',
        }),
      ),
    ).toBe("not-ready");
  });

  it("fails closed on malformed or contract-incompatible responses", () => {
    expect(interpretStoreNodeStatus(probe({ statusCode: 200, body: '{"status":"UP"}' }))).toBe(
      "unavailable",
    );
    expect(
      interpretStoreNodeStatus(
        probe(health, {
          statusCode: 200,
          body: '{"status":"RUNNING","transactionalReady":true,"databaseReady":true,"schemaCompatible":true,"reasons":[]}',
        }),
      ),
    ).toBe("not-ready");
    expect(interpretStoreNodeStatus(probe(health, { statusCode: 200, body: "not-json" }))).toBe(
      "not-ready",
    );
    expect(interpretStoreNodeStatus(probe(health, { statusCode: 503, body: ready.body }))).toBe(
      "not-ready",
    );
  });
});
