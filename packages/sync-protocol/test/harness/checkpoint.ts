/**
 * MM-010 TEST-ONLY checkpoint experiment. This is a HARNESS CHOICE, not a production solution.
 *
 * The frozen `integration.sync_checkpoints` table has no unique key on (tenant_id, peer_id,
 * stream_code). `INSERT ... ON CONFLICT` therefore cannot work, and `SELECT ... FOR UPDATE` on a
 * missing row locks nothing, so two concurrent first writers can both insert and leave duplicate
 * rows. With `useLock` the writer first takes a transaction-scoped advisory lock keyed on that
 * triple, which serializes first insertion. Without it the race is left open on purpose so a test can
 * show the duplicates.
 *
 * Delivery correctness never depends on a checkpoint: the frozen text calls it a progress
 * optimization only.
 */
import type { Pool } from "pg";

import { newUuidV7 } from "./fixtures.js";

export const CHECKPOINT_STREAM = "spike.mm010.push";

export interface CheckpointWrite {
  readonly tenantId: string;
  readonly peerId: string;
  readonly streamCode: string;
  readonly value: string;
  readonly useLock: boolean;
  readonly now: Date;
}

export interface CheckpointHooks {
  /** Runs after the existing-row read and before the insert or update. Used as a test barrier. */
  readonly afterRead?: (() => Promise<void>) | undefined;
}

export async function recordCheckpoint(
  pool: Pool,
  write: CheckpointWrite,
  hooks: CheckpointHooks = {},
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (write.useLock) {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
        `${write.tenantId}|${write.peerId}|${write.streamCode}`,
      ]);
    }
    const existing = await client.query<{ sync_checkpoint_id: string }>(
      `SELECT sync_checkpoint_id FROM integration.sync_checkpoints
        WHERE tenant_id = $1 AND peer_id = $2 AND stream_code = $3
        ORDER BY version DESC, created_at ASC
        LIMIT 1
        FOR UPDATE`,
      [write.tenantId, write.peerId, write.streamCode],
    );
    await hooks.afterRead?.();
    const row = existing.rows[0];
    if (row === undefined) {
      await client.query(
        `INSERT INTO integration.sync_checkpoints
           (sync_checkpoint_id, tenant_id, peer_id, stream_code, checkpoint_value, updated_at,
            created_at, version)
         VALUES ($1, $2, $3, $4, $5, $6, $6, 0)`,
        [
          newUuidV7(write.now),
          write.tenantId,
          write.peerId,
          write.streamCode,
          write.value,
          write.now,
        ],
      );
    } else {
      await client.query(
        `UPDATE integration.sync_checkpoints
            SET checkpoint_value = $1, updated_at = $2, version = version + 1
          WHERE tenant_id = $3 AND sync_checkpoint_id = $4`,
        [write.value, write.now, write.tenantId, row.sync_checkpoint_id],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined); // keep the original error
    throw error;
  } finally {
    client.release();
  }
}

export interface CheckpointRows {
  readonly count: number;
  readonly latestValue: string | null;
  readonly latestVersion: number | null;
}

export async function readCheckpointRows(
  pool: Pool,
  tenantId: string,
  peerId: string,
  streamCode: string,
): Promise<CheckpointRows> {
  const result = await pool.query<{ checkpoint_value: string | null; version: string }>(
    `SELECT checkpoint_value, version FROM integration.sync_checkpoints
      WHERE tenant_id = $1 AND peer_id = $2 AND stream_code = $3
      ORDER BY version DESC, created_at ASC`,
    [tenantId, peerId, streamCode],
  );
  const latest = result.rows[0];
  return {
    count: result.rows.length,
    latestValue: latest?.checkpoint_value ?? null,
    latestVersion: latest === undefined ? null : Number(latest.version),
  };
}
