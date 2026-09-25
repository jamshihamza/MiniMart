import { databaseConfigFromEnvironment, type DatabaseConfig } from "@minimart/database";

export type ServiceRuntimeMode = "edge" | "cloud";

export interface ServiceConfiguration {
  readonly runtimeMode: ServiceRuntimeMode;
  readonly serviceName: string;
  readonly applicationBuild: string;
  readonly shutdownTimeoutMilliseconds: number;
  readonly database: DatabaseConfig;
}

function requiredIdentifier(value: string | undefined, fallback: string, name: string): string {
  const resolved = value?.trim() || fallback;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(resolved)) {
    throw new Error(`${name} must contain only letters, numbers, dots, underscores, or hyphens`);
  }
  return resolved;
}

function positiveInteger(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

export function loadServiceConfiguration(
  runtimeMode: ServiceRuntimeMode,
  environment: NodeJS.ProcessEnv = process.env,
): ServiceConfiguration {
  return {
    runtimeMode,
    serviceName: requiredIdentifier(
      environment["MINIMART_SERVICE_NAME"],
      "minimart-store-node",
      "MINIMART_SERVICE_NAME",
    ),
    applicationBuild: requiredIdentifier(
      environment["MINIMART_APPLICATION_BUILD"],
      "0.0.0",
      "MINIMART_APPLICATION_BUILD",
    ),
    shutdownTimeoutMilliseconds: positiveInteger(
      environment["MINIMART_SHUTDOWN_TIMEOUT_MS"],
      10_000,
      "MINIMART_SHUTDOWN_TIMEOUT_MS",
    ),
    database: databaseConfigFromEnvironment(environment),
  };
}
