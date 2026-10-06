/**
 * MM-010 TEST-ONLY outbox dispatcher. It follows the frozen pattern (a short claim transaction using
 * `FOR UPDATE SKIP LOCKED`, network publication outside any transaction, `published_at` recorded on
 * success, bounded retry) but it is a harness. It is not a production dispatcher, is never started
 * by a launcher, and its retry values are labelled test-fixture values.
 *
 * Terminal outcomes (quarantined, rejected, retries exhausted) are recorded in the test-only
 * `store_terminal` table and in `integration.dead_letters`. They are kept separate from successful
 * delivery: `published_at` is set only for APPLIED or DUPLICATE. No production outbox column is
 * used to encode a terminal state.
 */
import type { Pool } from "pg";

import { CHECKPOINT_STREAM, recordCheckpoint } from "./checkpoint.js";
import { buildEnvelope, payloadHash, type OutboxEnvelopeRow } from "./envelope.js";
import { newUuidV7 } from "./fixtures.js";
import type { FrozenContract } from "./frozen-contract.js";
import { TEST_ONLY_SCHEMA } from "./test-only-schema.js";
import {
  SimulatedCrash,
  type PushResultItem,
  type PushTransport,
  type WireMessage,
} from "./transport.js";

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
}

/**
 * TEST-FIXTURE retry values. They are not production defaults: the frozen text leaves retry counts
 * and intervals to operational configuration. No jitter is applied so tests stay deterministic.
 */
export const TEST_FIXTURE_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 4,
  baseDelayMs: 1_000,
  maxDelayMs: 8_000,
};

export function backoffDelayMs(policy: RetryPolicy, attemptCount: number): number {
  const exponent = Math.max(0, attemptCount - 1);
  return Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** exponent);
}

export interface DispatcherHooks {
  /** Runs after the claim commits and before the send. Throw {@link SimulatedCrash} to abandon the claim. */
  readonly afterClaim?: (() => void | Promise<void>) | undefined;
  /** Runs after the send returns and before any result is recorded. Throw {@link SimulatedCrash} to abandon. */
  readonly afterSend?: (() => void | Promise<void>) | undefined;
}

export interface DispatcherConfig {
  readonly pool: Pool;
  readonly transport: PushTransport;
  readonly contract: FrozenContract;
  readonly workerId: string;
  /** The remote peer as the Store sees it (the Cloud). A fixed test value. */
  readonly remotePeerId: string;
  readonly now: () => Date;
  readonly leaseMs: number;
  readonly batchSize: number;
  readonly retry: RetryPolicy;
  readonly checkpoint: { readonly enabled: boolean; readonly useLock: boolean };
  readonly hooks?: DispatcherHooks | undefined;
}

export interface RunSummary {
  readonly claimed: number;
  readonly applied: number;
  readonly duplicates: number;
  readonly terminal: number;
  readonly retried: number;
  readonly checkpointError: string | null;
}

type ClaimedRow = {
  readonly outbox_message_id: string;
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly posting_envelope_id: string | null;
  readonly correlation_id: string | null;
  readonly causation_id: string | null;
  readonly payload: unknown;
  readonly created_at: Date;
  readonly available_at: Date;
  readonly attempt_count: number;
};

type TerminalState = "QUARANTINED" | "REJECTED" | "RETRIES_EXHAUSTED";

export class TestOnlyDispatcher {
  constructor(private readonly config: DispatcherConfig) {}

  /** One claim, send and record cycle. A {@link SimulatedCrash} from a hook propagates untouched. */
  async runOnce(): Promise<RunSummary> {
    const { hooks } = this.config;
    const claimedAt = this.config.now();
    const rows = await this.claim(claimedAt);
    if (rows.length === 0) {
      return {
        claimed: 0,
        applied: 0,
        duplicates: 0,
        terminal: 0,
        retried: 0,
        checkpointError: null,
      };
    }
    await hooks?.afterClaim?.();

    const sides = await this.loadEnvelopeSides(rows);
    const messages: WireMessage[] = [];
    const sendable: ClaimedRow[] = [];
    let retried = 0;
    let terminal = 0;
    for (const row of rows) {
      const side = sides.get(`${row.tenant_id}|${row.outbox_message_id}`);
      if (side === undefined) {
        const outcome = await this.recordFailure(
          row,
          "envelope side row missing",
          this.config.now(),
        );
        if (outcome === "TERMINAL") terminal += 1;
        else retried += 1;
        continue;
      }
      const envelopeRow: OutboxEnvelopeRow = {
        event_id: row.event_id,
        event_type: row.event_type,
        tenant_id: row.tenant_id,
        posting_envelope_id: row.posting_envelope_id,
        correlation_id: row.correlation_id,
        causation_id: row.causation_id,
        payload: row.payload,
        store_id: side.store_id,
        source_identity: side.source_identity,
        occurred_at: side.occurred_at,
        contract_version: side.contract_version,
      };
      messages.push(buildEnvelope(this.config.contract, envelopeRow));
      sendable.push(row);
    }
    if (sendable.length === 0) {
      return {
        claimed: rows.length,
        applied: 0,
        duplicates: 0,
        terminal,
        retried,
        checkpointError: null,
      };
    }

    let results: readonly PushResultItem[];
    try {
      const response = await this.config.transport.push({
        peerId: this.config.remotePeerId,
        messages,
      });
      results = response.results;
    } catch (error) {
      if (error instanceof SimulatedCrash) throw error;
      const text = error instanceof Error ? error.message : String(error);
      for (const row of sendable) {
        const outcome = await this.recordFailure(row, `transport: ${text}`, this.config.now());
        if (outcome === "TERMINAL") terminal += 1;
        else retried += 1;
      }
      return {
        claimed: rows.length,
        applied: 0,
        duplicates: 0,
        terminal,
        retried,
        checkpointError: null,
      };
    }
    await hooks?.afterSend?.();

    const delivered: ClaimedRow[] = [];
    let applied = 0;
    let duplicates = 0;
    for (const row of sendable) {
      const item = results.find((candidate) => candidate.messageId === row.event_id);
      if (item === undefined) {
        const outcome = await this.recordFailure(row, "no result for message", this.config.now());
        if (outcome === "TERMINAL") terminal += 1;
        else retried += 1;
      } else if (item.outcome === "APPLIED" || item.outcome === "DUPLICATE") {
        delivered.push(row);
        if (item.outcome === "APPLIED") applied += 1;
        else duplicates += 1;
      } else {
        const state: TerminalState = item.outcome === "QUARANTINED" ? "QUARANTINED" : "REJECTED";
        await this.recordTerminal(
          row,
          state,
          item.problem?.detail ?? item.outcome,
          item.problem?.code ?? item.outcome,
          this.config.now(),
        );
        terminal += 1;
      }
    }

    await this.markDelivered(delivered, this.config.now());
    const checkpointError = await this.writeCheckpoints(delivered);
    return { claimed: rows.length, applied, duplicates, terminal, retried, checkpointError };
  }

  private async claim(now: Date): Promise<ClaimedRow[]> {
    const result = await this.config.pool.query<ClaimedRow>(
      `WITH picked AS (
         SELECT o.outbox_message_id
           FROM integration.outbox_messages o
          WHERE o.published_at IS NULL
            AND o.available_at <= $1
            AND (o.claim_expires_at IS NULL OR o.claim_expires_at <= $1)
            AND NOT EXISTS (
              SELECT 1 FROM ${TEST_ONLY_SCHEMA}.store_terminal t
               WHERE t.tenant_id = o.tenant_id
                 AND t.peer_id = $2
                 AND t.outbox_message_id = o.outbox_message_id)
          ORDER BY o.available_at, o.created_at
          LIMIT $3
            FOR UPDATE OF o SKIP LOCKED
       )
       UPDATE integration.outbox_messages AS o
          SET claim_owner = $4,
              claim_expires_at = $5,
              attempt_count = o.attempt_count + 1
         FROM picked
        WHERE o.outbox_message_id = picked.outbox_message_id
       RETURNING o.outbox_message_id, o.tenant_id, o.event_id, o.event_type, o.posting_envelope_id,
                 o.correlation_id, o.causation_id, o.payload, o.created_at, o.available_at,
                 o.attempt_count`,
      [
        now,
        this.config.remotePeerId,
        this.config.batchSize,
        this.config.workerId,
        new Date(now.getTime() + this.config.leaseMs),
      ],
    );
    return [...result.rows].sort(
      (left, right) =>
        left.available_at.getTime() - right.available_at.getTime() ||
        left.created_at.getTime() - right.created_at.getTime(),
    );
  }

  private async loadEnvelopeSides(rows: readonly ClaimedRow[]): Promise<
    Map<
      string,
      {
        store_id: string | null;
        source_identity: string;
        occurred_at: Date;
        contract_version: string;
      }
    >
  > {
    const result = await this.config.pool.query<{
      tenant_id: string;
      outbox_message_id: string;
      store_id: string | null;
      source_identity: string;
      occurred_at: Date;
      contract_version: string;
    }>(
      `SELECT tenant_id, outbox_message_id, store_id, source_identity, occurred_at, contract_version
         FROM ${TEST_ONLY_SCHEMA}.envelope_side
        WHERE outbox_message_id = ANY($1::uuid[])`,
      [rows.map((row) => row.outbox_message_id)],
    );
    return new Map(result.rows.map((row) => [`${row.tenant_id}|${row.outbox_message_id}`, row]));
  }

  /** Sets `published_at` for delivered rows in one transaction. A row re-claimed by another worker is left alone. */
  private async markDelivered(rows: readonly ClaimedRow[], now: Date): Promise<void> {
    if (rows.length === 0) return;
    const client = await this.config.pool.connect();
    try {
      await client.query("BEGIN");
      for (const row of rows) {
        await client.query(
          `UPDATE integration.outbox_messages
              SET published_at = $3, claim_owner = NULL, claim_expires_at = NULL, last_error = NULL
            WHERE tenant_id = $1 AND outbox_message_id = $2
              AND published_at IS NULL AND claim_owner = $4`,
          [row.tenant_id, row.outbox_message_id, now, this.config.workerId],
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

  /** Checkpoint writes happen after delivery is already durable and never change delivery results. */
  private async writeCheckpoints(delivered: readonly ClaimedRow[]): Promise<string | null> {
    if (!this.config.checkpoint.enabled || delivered.length === 0) return null;
    const latestByTenant = new Map<string, ClaimedRow>();
    for (const row of delivered) {
      const current = latestByTenant.get(row.tenant_id);
      if (current === undefined || row.created_at.getTime() >= current.created_at.getTime()) {
        latestByTenant.set(row.tenant_id, row);
      }
    }
    try {
      for (const [tenantId, row] of latestByTenant) {
        await recordCheckpoint(this.config.pool, {
          tenantId,
          peerId: this.config.remotePeerId,
          streamCode: CHECKPOINT_STREAM,
          value: `${row.created_at.toISOString()}|${row.outbox_message_id}`,
          useLock: this.config.checkpoint.useLock,
          now: this.config.now(),
        });
      }
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  }

  /** Releases the claim with backoff, or makes the row terminal when attempts are exhausted. */
  private async recordFailure(
    row: ClaimedRow,
    reason: string,
    now: Date,
  ): Promise<"RETRY" | "TERMINAL"> {
    if (row.attempt_count >= this.config.retry.maxAttempts) {
      await this.recordTerminal(row, "RETRIES_EXHAUSTED", reason, "RETRIES_EXHAUSTED", now);
      return "TERMINAL";
    }
    await this.config.pool.query(
      `UPDATE integration.outbox_messages
          SET claim_owner = NULL, claim_expires_at = NULL, last_error = $3, available_at = $4
        WHERE tenant_id = $1 AND outbox_message_id = $2
          AND published_at IS NULL AND claim_owner = $5`,
      [
        row.tenant_id,
        row.outbox_message_id,
        reason,
        new Date(now.getTime() + backoffDelayMs(this.config.retry, row.attempt_count)),
        this.config.workerId,
      ],
    );
    return "RETRY";
  }

  /**
   * Records a terminal outcome once. The test-only table's primary key (tenant, peer, message) makes
   * the insert the guard: only the writer that wins it writes the `dead_letters` row, because the
   * frozen `dead_letters` table has no unique key of its own.
   */
  private async recordTerminal(
    row: ClaimedRow,
    state: TerminalState,
    reason: string,
    failureClass: string,
    now: Date,
  ): Promise<void> {
    const client = await this.config.pool.connect();
    try {
      await client.query("BEGIN");
      const inserted = await client.query(
        `INSERT INTO ${TEST_ONLY_SCHEMA}.store_terminal
           (tenant_id, peer_id, outbox_message_id, state, reason, recorded_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (tenant_id, peer_id, outbox_message_id) DO NOTHING
         RETURNING outbox_message_id`,
        [row.tenant_id, this.config.remotePeerId, row.outbox_message_id, state, reason, now],
      );
      if (inserted.rowCount === 1) {
        await client.query(
          `INSERT INTO integration.dead_letters
             (dead_letter_id, tenant_id, source_message_id, failure_class, payload_hash, retry_count,
              first_failed_at, last_failed_at, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $7)`,
          [
            newUuidV7(now),
            row.tenant_id,
            row.event_id,
            failureClass,
            payloadHash(row.payload),
            row.attempt_count,
            now,
            state,
          ],
        );
      }
      await client.query(
        `UPDATE integration.outbox_messages
            SET claim_owner = NULL, claim_expires_at = NULL, last_error = $3
          WHERE tenant_id = $1 AND outbox_message_id = $2 AND published_at IS NULL`,
        [row.tenant_id, row.outbox_message_id, reason],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined); // keep the original error
      throw error;
    } finally {
      client.release();
    }
  }
}

export interface Backlog {
  readonly published: number;
  readonly pending: number;
  readonly terminal: number;
  readonly maxPendingAttempts: number;
  readonly oldestPendingCreatedAt: Date | null;
  readonly recentErrors: readonly {
    readonly eventId: string;
    readonly attemptCount: number;
    readonly lastError: string;
  }[];
}

/** Observable retry and backlog state, read straight from the production outbox plus the terminal table. */
export async function readBacklog(pool: Pool, remotePeerId: string): Promise<Backlog> {
  const counts = await pool.query<{
    published: string;
    pending: string;
    terminal: string;
    max_pending_attempts: number;
    oldest_pending_created_at: Date | null;
  }>(
    `SELECT count(*) FILTER (WHERE o.published_at IS NOT NULL) AS published,
            count(*) FILTER (WHERE o.published_at IS NULL AND t.outbox_message_id IS NULL) AS pending,
            count(*) FILTER (WHERE o.published_at IS NULL AND t.outbox_message_id IS NOT NULL) AS terminal,
            coalesce(max(o.attempt_count) FILTER (
              WHERE o.published_at IS NULL AND t.outbox_message_id IS NULL), 0) AS max_pending_attempts,
            min(o.created_at) FILTER (
              WHERE o.published_at IS NULL AND t.outbox_message_id IS NULL) AS oldest_pending_created_at
       FROM integration.outbox_messages o
       LEFT JOIN ${TEST_ONLY_SCHEMA}.store_terminal t
         ON t.tenant_id = o.tenant_id AND t.peer_id = $1 AND t.outbox_message_id = o.outbox_message_id`,
    [remotePeerId],
  );
  const errors = await pool.query<{ event_id: string; attempt_count: number; last_error: string }>(
    `SELECT event_id, attempt_count, last_error
       FROM integration.outbox_messages
      WHERE published_at IS NULL AND last_error IS NOT NULL
      ORDER BY created_at, event_id
      LIMIT 5`,
  );
  const row = counts.rows[0];
  if (row === undefined) throw new Error("backlog query returned no row");
  return {
    published: Number(row.published),
    pending: Number(row.pending),
    terminal: Number(row.terminal),
    maxPendingAttempts: Number(row.max_pending_attempts),
    oldestPendingCreatedAt: row.oldest_pending_created_at,
    recentErrors: errors.rows.map((error) => ({
      eventId: error.event_id,
      attemptCount: error.attempt_count,
      lastError: error.last_error,
    })),
  };
}
