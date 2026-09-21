import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";

let managedContainer: StartedPostgreSqlContainer | undefined;

export async function getAdministrativeConnectionString(): Promise<string> {
  const configured = process.env["MINIMART_TEST_POSTGRES_URL"];
  if (configured !== undefined && configured !== "") return configured;
  managedContainer ??= await new PostgreSqlContainer("postgres:17-alpine").start();
  return managedContainer.getConnectionUri();
}

export async function stopManagedPostgres(): Promise<void> {
  if (managedContainer === undefined) return;
  await managedContainer.stop();
  managedContainer = undefined;
}
