import { performance } from "node:perf_hooks";

import type { Pool } from "pg";

export type DatabaseHealth =
  | { readonly healthy: true; readonly latencyMilliseconds: number }
  | { readonly healthy: false; readonly latencyMilliseconds: number; readonly reason: string };

export async function checkDatabaseHealth(pool: Pool): Promise<DatabaseHealth> {
  const started = performance.now();
  try {
    await pool.query("SELECT 1 AS healthy");
    return { healthy: true, latencyMilliseconds: performance.now() - started };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownDatabaseError";
    return { healthy: false, latencyMilliseconds: performance.now() - started, reason };
  }
}
