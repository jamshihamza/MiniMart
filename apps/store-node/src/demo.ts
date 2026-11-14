// MiniMart demonstration launcher.
//
// Starts a private PostgreSQL instance (or uses DATABASE_URL), applies migrations, seeds the demo
// store on first run and serves the demonstration Store API with the built POS and Back Office on
// one loopback port. Demonstration only: no authentication, never for production use.
import { existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { seedDemoStore } from "@minimart/application-coordinators";
import {
  createDatabasePool,
  createTransactionRunner,
  databaseConfigFromEnvironment,
  poolSql,
  runMigrations,
} from "@minimart/database";
import { loadDemoApiPort, StoreDemoApiServer } from "@minimart/service-runtime";
import EmbeddedPostgres from "embedded-postgres";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const DATABASE_NAME = "minimart_demo";
const DATABASE_PORT = 54329;

function log(message: string): void {
  process.stdout.write(`[minimart-demo] ${message}\n`);
}

async function startEmbeddedPostgres(dataDirectory: string): Promise<{
  readonly connectionString: string;
  stop(): Promise<void>;
}> {
  const databaseDirectory = join(dataDirectory, "postgres");
  const firstRun = !existsSync(join(databaseDirectory, "PG_VERSION"));
  const postgres = new EmbeddedPostgres({
    databaseDir: databaseDirectory,
    user: "minimart",
    password: "minimart-demo",
    port: DATABASE_PORT,
    persistent: true,
    onLog: () => undefined,
  });
  if (firstRun) {
    log("First run: creating the demo database (this takes a few seconds)");
    await postgres.initialise();
  }
  await postgres.start();
  if (firstRun) await postgres.createDatabase(DATABASE_NAME);
  return {
    connectionString: `postgres://minimart:minimart-demo@127.0.0.1:${DATABASE_PORT}/${DATABASE_NAME}`,
    stop: () => postgres.stop(),
  };
}

async function main(): Promise<void> {
  if (process.env["NODE_ENV"] === "production") {
    throw new Error("The MiniMart demo cannot run with NODE_ENV=production");
  }
  const dataDirectory = resolve(
    process.env["MINIMART_DEMO_DATA_DIR"] ?? join(repositoryRoot, ".demo-data"),
  );
  if (process.argv.includes("--reset") && existsSync(dataDirectory)) {
    rmSync(dataDirectory, { recursive: true, force: true });
    log("Demo data was reset");
  }

  const external = process.env["DATABASE_URL"];
  const embedded =
    external === undefined || external === "" ? await startEmbeddedPostgres(dataDirectory) : null;
  const pool = createDatabasePool(
    databaseConfigFromEnvironment({
      ...process.env,
      DATABASE_URL: embedded?.connectionString ?? external,
    }),
  );

  // Stopping PostgreSQL ends idle connections; that must not crash the shutdown.
  pool.on("error", () => undefined);

  let server: StoreDemoApiServer | undefined;
  let stopping = false;
  const stop = async (): Promise<void> => {
    if (stopping) return;
    stopping = true;
    await server?.close().catch(() => undefined);
    await pool.end().catch(() => undefined);
    await embedded?.stop().catch(() => undefined);
  };

  try {
    await runMigrations(pool, { applicationBuild: "0.0.0" });
    const transactions = createTransactionRunner(pool);
    const { store, seeded } = await seedDemoStore(transactions, new Date());
    log(`${seeded ? "Seeded" : "Using"} store ${store.displayName} (${store.storeCode})`);

    const port = loadDemoApiPort({ ...process.env, MINIMART_DEMO_API: "1" }) ?? 4780;
    const staticRoots: Record<string, string> = {};
    for (const [prefix, directory] of [
      ["/pos", "apps/pos-terminal/dist"],
      ["/backoffice", "apps/backoffice/dist"],
    ] as const) {
      const absolute = join(repositoryRoot, directory);
      if (existsSync(join(absolute, "index.html"))) staticRoots[prefix] = absolute;
      else log(`Warning: ${directory} is not built; ${prefix} will not be served`);
    }
    server = new StoreDemoApiServer({ sql: poolSql(pool), transactions, port, staticRoots });
    await server.start();
    log(`Ready.  POS:         http://127.0.0.1:${port}/pos/`);
    log(`        Back Office: http://127.0.0.1:${port}/backoffice/`);
    log("Press Ctrl+C to stop.");
  } catch (error) {
    await stop();
    throw error;
  }

  for (const signal of ["SIGINT", "SIGTERM", "SIGBREAK"] as const) {
    process.on(signal, () => {
      void stop().finally(() => process.exit(0));
    });
  }
}

main().catch((error: unknown) => {
  process.stderr.write(
    `[minimart-demo] Failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
