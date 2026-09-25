export interface StoppableRuntime {
  stop(): Promise<void>;
}

export type ShutdownSignal = "SIGINT" | "SIGTERM" | "SIGBREAK";

export function registerShutdownSignals(
  runtime: StoppableRuntime,
  onFailure: (error: unknown, signal: ShutdownSignal) => void = () => {
    process.exitCode = 1;
  },
): () => void {
  const signals: readonly ShutdownSignal[] = ["SIGINT", "SIGTERM", "SIGBREAK"];
  const handlers = new Map<ShutdownSignal, () => void>();
  for (const signal of signals) {
    const handler = (): void => {
      void runtime.stop().catch((error: unknown) => onFailure(error, signal));
    };
    handlers.set(signal, handler);
    process.on(signal, handler);
  }
  return (): void => {
    for (const [signal, handler] of handlers) process.off(signal, handler);
  };
}
