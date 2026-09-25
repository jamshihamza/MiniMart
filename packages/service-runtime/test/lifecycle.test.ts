import { describe, expect, it } from "vitest";

import { InvalidLifecycleTransitionError, ServiceLifecycle } from "../src/index.js";

describe("ServiceLifecycle", () => {
  it("supports running and degraded lifecycle transitions", () => {
    const lifecycle = new ServiceLifecycle();
    lifecycle.transition("STARTING");
    lifecycle.transition("RUNNING");
    lifecycle.transition("DEGRADED");
    lifecycle.transition("RUNNING");
    lifecycle.transition("STOPPING");
    lifecycle.transition("STOPPED");
    expect(lifecycle.state).toBe("STOPPED");
  });

  it("fails clearly on invalid transitions", () => {
    const lifecycle = new ServiceLifecycle();
    expect(() => lifecycle.transition("RUNNING")).toThrow(InvalidLifecycleTransitionError);
    expect(lifecycle.state).toBe("STOPPED");
  });
});
