import {
  createConsoleRuntimeLogger,
  loadDevelopmentSystemHttpOptions,
  loadServiceConfiguration,
  registerShutdownSignals,
  StoreServiceRuntime,
  StoreSystemHost,
  StoreSystemHttpServer,
} from "@minimart/service-runtime";

const logger = createConsoleRuntimeLogger();

try {
  const configuration = loadServiceConfiguration("edge");
  const runtime = new StoreServiceRuntime({ configuration, logger });
  const httpOptions = loadDevelopmentSystemHttpOptions();
  const host =
    httpOptions === undefined
      ? runtime
      : new StoreSystemHost(
          runtime,
          new StoreSystemHttpServer(
            { liveness: () => runtime.liveness(), readiness: () => runtime.refreshReadiness() },
            httpOptions,
          ),
        );
  registerShutdownSignals(host, (error, signal) => {
    logger.write({
      timestamp: new Date().toISOString(),
      level: "error",
      event: "service.signal_shutdown_failed",
      service: configuration.serviceName,
      state: runtime.state,
      signal,
      message: error instanceof Error ? error.message : "Unknown shutdown failure",
    });
    process.exitCode = 1;
  });
  await host.start();
} catch (error) {
  logger.write({
    timestamp: new Date().toISOString(),
    level: "error",
    event: "service.fatal",
    service: "minimart-store-node",
    message: error instanceof Error ? error.message : "Unknown fatal failure",
  });
  process.exitCode = 1;
}
