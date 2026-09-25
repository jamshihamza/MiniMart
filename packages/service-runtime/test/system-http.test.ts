import { describe, expect, it, vi } from "vitest";

import {
  isEnrolledDevice,
  systemResponse,
  StoreSystemHost,
  type SystemStatusSource,
} from "../src/index.js";

const source: SystemStatusSource = {
  liveness: () => ({ status: "UP", time: "2026-09-25T00:00:00.000Z" }),
  readiness: () => ({
    status: "RUNNING",
    transactionalReady: true,
    databaseReady: true,
    schemaCompatible: true,
    reasons: [],
  }),
};

describe("system HTTP projection", () => {
  it("returns exact frozen health and readiness fields", async () => {
    await expect(systemResponse("/api/v1/system/health", source)).resolves.toEqual({
      status: "UP",
      time: "2026-09-25T00:00:00.000Z",
    });
    await expect(systemResponse("/api/v1/system/readiness", source)).resolves.toEqual({
      transactionalReady: true,
      databaseReady: true,
      schemaCompatible: true,
      reasons: [],
    });
    await expect(systemResponse("/api/v1/system/readiness", source)).resolves.not.toHaveProperty(
      "status",
    );
    await expect(systemResponse("/api/v1/sales", source)).resolves.toBeNull();
  });

  it("requires a validated and enrolled non-revoked certificate", () => {
    const registry = new Map([
      ["AABB", { counterId: "01999f27-0000-7000-8000-000000000001", revoked: false }],
    ]);
    expect(isEnrolledDevice(true, "AA:BB", registry)).toBe(true);
    expect(isEnrolledDevice(false, "AA:BB", registry)).toBe(false);
    expect(isEnrolledDevice(true, "CC:DD", registry)).toBe(false);
    registry.set("AABB", { counterId: "01999f27-0000-7000-8000-000000000001", revoked: true });
    expect(isEnrolledDevice(true, "AA:BB", registry)).toBe(false);
  });
});

describe("StoreSystemHost lifecycle", () => {
  it("closes HTTPS before database runtime on repeated shutdown", async () => {
    const order: string[] = [];
    const runtime = {
      start: vi.fn(async () => {
        order.push("database.start");
        return source.readiness();
      }),
      stop: vi.fn(async () => {
        order.push("database.stop");
      }),
    };
    const http = {
      start: vi.fn(async () => {
        order.push("http.start");
      }),
      close: vi.fn(async () => {
        order.push("http.close");
      }),
    };
    const host = new StoreSystemHost(runtime, http);
    await host.start();
    await Promise.all([host.stop(), host.stop()]);
    expect(order).toEqual(["database.start", "http.start", "http.close", "database.stop"]);
    expect(http.close).toHaveBeenCalledOnce();
    expect(runtime.stop).toHaveBeenCalledOnce();
  });

  it("cleans up the database after HTTPS startup failure", async () => {
    const runtime = { start: vi.fn(async () => source.readiness()), stop: vi.fn(async () => {}) };
    const http = {
      start: vi.fn(async () => {
        throw new Error("bind failed");
      }),
      close: vi.fn(async () => {}),
    };
    await expect(new StoreSystemHost(runtime, http).start()).rejects.toThrow("bind failed");
    expect(http.close).toHaveBeenCalledOnce();
    expect(runtime.stop).toHaveBeenCalledOnce();
  });
});
