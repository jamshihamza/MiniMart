import { describe, expect, it, vi } from "vitest";

import { registerShutdownSignals } from "../src/index.js";

describe("registerShutdownSignals", () => {
  it("maps Windows and console termination signals to runtime stop", async () => {
    const stop = vi.fn(async () => undefined);
    const before = process.listeners("SIGBREAK");
    const dispose = registerShutdownSignals({ stop });
    const added = process.listeners("SIGBREAK").find((listener) => !before.includes(listener));
    expect(added).toBeDefined();
    added?.("SIGBREAK");
    await vi.waitFor(() => expect(stop).toHaveBeenCalledOnce());
    dispose();
    expect(process.listeners("SIGBREAK")).toEqual(before);
  });
});
