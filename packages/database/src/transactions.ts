import type { Sql, TransactionRunner } from "@minimart/shared-kernel";
import type { Pool } from "pg";

/** Runs single statements on the pool, outside any explicit transaction. */
export function poolSql(pool: Pool): Sql {
  return {
    query: async (text, parameters) => pool.query(text, parameters as unknown[] | undefined),
  } as Sql;
}

/** Runs each unit of work in its own transaction on a dedicated connection. */
export function createTransactionRunner(pool: Pool): TransactionRunner {
  return {
    async run<Result>(work: (sql: Sql) => Promise<Result>): Promise<Result> {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await work({
          query: async (text, parameters) => client.query(text, parameters as unknown[] | undefined),
        } as Sql);
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
