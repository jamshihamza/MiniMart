import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DatabaseConfig } from "./config.js";

export type MiniMartDatabase = Record<string, never>;

export interface DatabaseRuntime {
  readonly pool: Pool;
  readonly database: Kysely<MiniMartDatabase>;
  close(): Promise<void>;
}

export function createDatabasePool(config: DatabaseConfig): Pool {
  return new Pool({
    connectionString: config.connectionString,
    max: config.maximumPoolSize,
    connectionTimeoutMillis: config.connectionTimeoutMilliseconds,
    idleTimeoutMillis: config.idleTimeoutMilliseconds,
    statement_timeout: config.statementTimeoutMilliseconds,
  });
}

export function createDatabaseRuntime(config: DatabaseConfig): DatabaseRuntime {
  const pool = createDatabasePool(config);
  const database = new Kysely<MiniMartDatabase>({
    dialect: new PostgresDialect({ pool }),
  });
  let closed = false;

  return {
    pool,
    database,
    async close(): Promise<void> {
      if (closed) return;
      closed = true;
      await database.destroy();
    },
  };
}
