import { createHash } from "node:crypto";

import type { PoolClient } from "pg";

export const MIGRATION_LOCK_NAMESPACE = "minimart:global-schema-migration-lock:v1";

export function deriveMigrationLockIdentifier(namespace = MIGRATION_LOCK_NAMESPACE): bigint {
  const digest = createHash("sha256").update(namespace, "utf8").digest();
  return digest.readBigInt64BE(0);
}

export const MIGRATION_LOCK_IDENTIFIER = deriveMigrationLockIdentifier();

export async function acquireMigrationLock(client: PoolClient): Promise<void> {
  await client.query("SELECT pg_advisory_lock($1::bigint)", [MIGRATION_LOCK_IDENTIFIER.toString()]);
}

export async function releaseMigrationLock(client: PoolClient): Promise<void> {
  await client.query("SELECT pg_advisory_unlock($1::bigint)", [
    MIGRATION_LOCK_IDENTIFIER.toString(),
  ]);
}
