import { randomUUID } from "node:crypto";

import { Pool } from "pg";

import { getAdministrativeConnectionString } from "./postgres-container.js";

export interface TestDatabase {
  readonly name: string;
  readonly connectionString: string;
  readonly pool: Pool;
  drop(): Promise<void>;
}

export async function createTestDatabase(prefix = "mm_test"): Promise<TestDatabase> {
  const adminConnectionString = await getAdministrativeConnectionString();
  const name = `${prefix}_${randomUUID().replaceAll("-", "")}`;
  const adminPool = new Pool({ connectionString: adminConnectionString, max: 2 });
  await adminPool.query(`CREATE DATABASE "${name}"`);
  const url = new URL(adminConnectionString);
  url.pathname = `/${name}`;
  const connectionString = url.toString();
  const pool = new Pool({ connectionString, max: 10 });
  let dropped = false;

  return {
    name,
    connectionString,
    pool,
    async drop(): Promise<void> {
      if (dropped) return;
      dropped = true;
      await pool.end();
      await adminPool.query(
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()",
        [name],
      );
      await adminPool.query(`DROP DATABASE "${name}"`);
      await adminPool.end();
    },
  };
}
