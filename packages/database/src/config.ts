export interface DatabaseConfig {
  readonly connectionString: string;
  readonly maximumPoolSize: number;
  readonly connectionTimeoutMilliseconds: number;
  readonly idleTimeoutMilliseconds: number;
  readonly statementTimeoutMilliseconds: number;
}

function positiveInteger(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

export function databaseConfigFromEnvironment(
  environment: NodeJS.ProcessEnv = process.env,
): DatabaseConfig {
  const connectionString = environment["DATABASE_URL"];
  if (connectionString === undefined || connectionString.trim() === "") {
    throw new Error("DATABASE_URL is required");
  }

  return {
    connectionString,
    maximumPoolSize: positiveInteger(environment["DATABASE_POOL_MAX"], 10, "DATABASE_POOL_MAX"),
    connectionTimeoutMilliseconds: positiveInteger(
      environment["DATABASE_CONNECTION_TIMEOUT_MS"],
      5_000,
      "DATABASE_CONNECTION_TIMEOUT_MS",
    ),
    idleTimeoutMilliseconds: positiveInteger(
      environment["DATABASE_IDLE_TIMEOUT_MS"],
      30_000,
      "DATABASE_IDLE_TIMEOUT_MS",
    ),
    statementTimeoutMilliseconds: positiveInteger(
      environment["DATABASE_STATEMENT_TIMEOUT_MS"],
      30_000,
      "DATABASE_STATEMENT_TIMEOUT_MS",
    ),
  };
}
