import type { DatabaseReadiness } from "@minimart/database";
import { describe, expect, it, vi } from "vitest";

import {
  ServiceStartupError,
  StoreServiceRuntime,
  type RuntimeDatabase,
  type RuntimeLogEntry,
  type ServiceConfiguration,
} from "../src/index.js";

const configuration: ServiceConfiguration = {
  runtimeMode: "edge",
  serviceName: "minimart-store-node",
  applicationBuild: "0.0.0",
  shutdownTimeoutMilliseconds: 100,
  database: {
    connectionString: "postgresql://ignored",
    maximumPoolSize: 1,
    connectionTimeoutMilliseconds: 100,
    idleTimeoutMilliseconds: 100,
    statementTimeoutMilliseconds: 100,
  },
};

const ready: DatabaseReadiness = {
  readyForWrites: true,
  health: { healthy: true, latencyMilliseconds: 1 },
  schemaVersion: "1.0.0",
  reasons: [],
};

function createHarness(result: DatabaseReadiness | Error = ready) {
  const close = vi.fn(async () => undefined);
  const database: RuntimeDatabase = {
    assessReadiness: vi.fn(async () => {
      if (result instanceof Error) throw result;
      return result;
    }),
    close,
  };
  const entries: RuntimeLogEntry[] = [];
  const runtime = new StoreServiceRuntime({
    configuration,
    logger: { write: (entry) => entries.push(entry) },
    databaseFactory: () => database,
    now: () => new Date("2026-01-02T03:04:05.000Z"),
  });
  return { runtime, close, entries };
}

describe("StoreServiceRuntime", () => {
  it("starts, reports separate liveness/readiness, and shuts down gracefully", async () => {
    const { runtime, close, entries } = createHarness();
    await expect(runtime.start()).resolves.toEqual({
      status: "RUNNING",
      transactionalReady: true,
      databaseReady: true,
      schemaCompatible: true,
      reasons: [],
    });
    expect(runtime.liveness()).toEqual({ status: "UP", time: "2026-01-02T03:04:05.000Z" });
    await runtime.stop();
    expect(runtime.state).toBe("STOPPED");
    expect(close).toHaveBeenCalledOnce();
    expect(entries.map(({ event }) => event)).toEqual([
      "service.starting",
      "database.readiness",
      "service.running",
      "service.stopping",
      "service.stopped",
    ]);
    expect(entries.find(({ event }) => event === "service.running")).toMatchObject({
      transactionalReady: true,
      databaseReady: true,
      schemaCompatible: true,
    });
    expect(JSON.stringify(entries)).not.toContain(configuration.database.connectionString);
  });

  it("rejects database-unavailable startup and cleans up", async () => {
    const unavailable: DatabaseReadiness = {
      readyForWrites: false,
      health: { healthy: false, latencyMilliseconds: 2, reason: "ConnectionError" },
      schemaVersion: null,
      reasons: ["DATABASE_UNHEALTHY"],
    };
    const { runtime, close } = createHarness(unavailable);
    const failure = await runtime.start().catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(ServiceStartupError);
    expect((failure as ServiceStartupError).readiness).toEqual({
      status: "FAILED",
      transactionalReady: false,
      databaseReady: false,
      schemaCompatible: false,
      reasons: ["DATABASE_UNHEALTHY"],
    });
    expect(close).toHaveBeenCalledOnce();
  });

  it("rejects schema-incompatible startup", async () => {
    const incompatible: DatabaseReadiness = {
      readyForWrites: false,
      health: { healthy: true, latencyMilliseconds: 1 },
      schemaVersion: "2.0.0",
      reasons: ["APPLICATION_BUILD_INCOMPATIBLE:0001_foundation"],
    };
    const { runtime } = createHarness(incompatible);
    const failure = await runtime.start().catch((error: unknown) => error);
    expect((failure as ServiceStartupError).readiness).toMatchObject({
      transactionalReady: false,
      databaseReady: true,
      schemaCompatible: false,
    });
  });

  it("cleans up after an unexpected partial startup failure", async () => {
    const { runtime, close } = createHarness(new Error("readiness exploded"));
    await expect(runtime.start()).rejects.toBeInstanceOf(ServiceStartupError);
    expect(runtime.state).toBe("FAILED");
    expect(close).toHaveBeenCalledOnce();
  });

  it("coalesces repeated shutdown calls", async () => {
    const { runtime, close } = createHarness();
    await runtime.start();
    await Promise.all([runtime.stop(), runtime.stop(), runtime.stop()]);
    await runtime.stop();
    expect(close).toHaveBeenCalledOnce();
    expect(runtime.state).toBe("STOPPED");
  });

  it("refreshes authoritative database readiness after startup", async () => {
    let current: DatabaseReadiness | Error = ready;
    const runtime = new StoreServiceRuntime({
      configuration,
      logger: { write: () => {} },
      databaseFactory: () => ({
        assessReadiness: async () => {
          if (current instanceof Error) throw current;
          return current;
        },
        close: async () => {},
      }),
    });
    await runtime.start();
    current = {
      readyForWrites: false,
      health: { healthy: false, latencyMilliseconds: 1, reason: "ConnectionError" },
      schemaVersion: null,
      reasons: ["DATABASE_UNHEALTHY"],
    };
    await expect(runtime.refreshReadiness()).resolves.toMatchObject({
      status: "DEGRADED",
      transactionalReady: false,
      databaseReady: false,
    });
    current = {
      readyForWrites: false,
      health: { healthy: true, latencyMilliseconds: 1 },
      schemaVersion: "2.0.0",
      reasons: ["APPLICATION_BUILD_INCOMPATIBLE:0001_foundation"],
    };
    await expect(runtime.refreshReadiness()).resolves.toMatchObject({
      transactionalReady: false,
      databaseReady: true,
      schemaCompatible: false,
    });
    current = ready;
    await expect(runtime.refreshReadiness()).resolves.toMatchObject({
      status: "RUNNING",
      transactionalReady: true,
    });
    current = new Error("connection details must not leak");
    await expect(runtime.refreshReadiness()).resolves.toMatchObject({
      transactionalReady: false,
      reasons: ["DATABASE_UNHEALTHY"],
    });
    await runtime.stop();
  });

  it("degrades on a stalled assessment without accumulating database queries", async () => {
    let finishAssessment!: (value: DatabaseReadiness) => void;
    const stalled = new Promise<DatabaseReadiness>((resolve) => {
      finishAssessment = resolve;
    });
    const assessReadiness = vi
      .fn()
      .mockResolvedValueOnce(ready)
      .mockReturnValueOnce(stalled)
      .mockResolvedValue(ready);
    const runtime = new StoreServiceRuntime({
      configuration: {
        ...configuration,
        database: { ...configuration.database, connectionTimeoutMilliseconds: 20 },
      },
      logger: { write: () => {} },
      databaseFactory: () => ({ assessReadiness, close: async () => {} }),
    });
    await runtime.start();
    await expect(runtime.refreshReadiness()).resolves.toMatchObject({
      status: "DEGRADED",
      databaseReady: false,
      transactionalReady: false,
    });
    await expect(runtime.refreshReadiness()).resolves.toMatchObject({
      databaseReady: false,
    });
    expect(assessReadiness).toHaveBeenCalledTimes(2);
    finishAssessment(ready);
    await stalled;
    await expect(runtime.refreshReadiness()).resolves.toMatchObject({
      status: "RUNNING",
      transactionalReady: true,
    });
    await runtime.stop();
  });
});
