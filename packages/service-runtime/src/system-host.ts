import type { StoreServiceRuntime } from "./runtime.js";

export interface SystemHostResource {
  start(): Promise<void>;
  close(): Promise<void>;
}

export class StoreSystemHost {
  readonly #runtime: Pick<StoreServiceRuntime, "start" | "stop">;
  readonly #http: SystemHostResource;
  #stopPromise: Promise<void> | undefined;

  constructor(runtime: Pick<StoreServiceRuntime, "start" | "stop">, http: SystemHostResource) {
    this.#runtime = runtime;
    this.#http = http;
  }

  async start(): Promise<void> {
    try {
      await this.#runtime.start();
      await this.#http.start();
    } catch (error) {
      await Promise.allSettled([this.#http.close(), this.#runtime.stop()]);
      throw error;
    }
  }

  stop(): Promise<void> {
    this.#stopPromise ??= this.#stop();
    return this.#stopPromise;
  }

  async #stop(): Promise<void> {
    try {
      await this.#http.close();
    } finally {
      await this.#runtime.stop();
    }
  }
}
