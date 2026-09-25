export const SERVICE_STATES = [
  "STARTING",
  "RUNNING",
  "DEGRADED",
  "STOPPING",
  "STOPPED",
  "FAILED",
] as const;

export type ServiceState = (typeof SERVICE_STATES)[number];

const allowedTransitions: Readonly<Record<ServiceState, readonly ServiceState[]>> = {
  STOPPED: ["STARTING"],
  STARTING: ["RUNNING", "FAILED", "STOPPING"],
  RUNNING: ["DEGRADED", "STOPPING", "FAILED"],
  DEGRADED: ["RUNNING", "STOPPING", "FAILED"],
  STOPPING: ["STOPPED", "FAILED"],
  FAILED: ["STOPPING", "STOPPED", "STARTING"],
};

export class InvalidLifecycleTransitionError extends Error {
  constructor(
    readonly from: ServiceState,
    readonly to: ServiceState,
  ) {
    super(`Invalid service lifecycle transition: ${from} -> ${to}`);
    this.name = "InvalidLifecycleTransitionError";
  }
}

export class ServiceLifecycle {
  #state: ServiceState = "STOPPED";

  get state(): ServiceState {
    return this.#state;
  }

  transition(to: ServiceState): void {
    if (!allowedTransitions[this.#state].includes(to)) {
      throw new InvalidLifecycleTransitionError(this.#state, to);
    }
    this.#state = to;
  }
}
