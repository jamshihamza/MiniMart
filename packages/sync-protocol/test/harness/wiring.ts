/**
 * MM-010 TEST-ONLY wiring helpers shared by the tests: a manual clock, builders and a drain loop.
 */
import type { Pool } from "pg";

import { TestOnlyCloudIngest, type CloudIngestHooks } from "./cloud-ingest.js";
import {
  TestOnlyDispatcher,
  TEST_FIXTURE_RETRY_POLICY,
  readBacklog,
  type DispatcherConfig,
  type RunSummary,
} from "./dispatcher.js";
import { buildEnvelope } from "./envelope.js";
import { TEST_CLOUD_PEER_ID, TEST_STORE_PEER_ID, type StoreFixture } from "./fixtures.js";
import type { FrozenContract } from "./frozen-contract.js";
import { DirectIngestTransport } from "./direct-transport.js";
import type { PushTransport, WireMessage } from "./transport.js";

export class ManualClock {
  private current: number;

  constructor(start: Date = new Date(Date.UTC(2026, 9, 6, 12, 0, 0))) {
    this.current = start.getTime();
  }

  readonly now = (): Date => new Date(this.current);

  advance(ms: number): void {
    this.current += ms;
  }

  set(date: Date): void {
    this.current = date.getTime();
  }
}

/** The wire envelope a fixture produces, built the way the dispatcher builds it. */
export function envelopeFromFixture(contract: FrozenContract, fixture: StoreFixture): WireMessage {
  return buildEnvelope(contract, {
    event_id: fixture.eventId,
    event_type: fixture.eventType,
    tenant_id: fixture.tenantId,
    posting_envelope_id: fixture.postingEnvelopeId,
    correlation_id: fixture.correlationId,
    causation_id: fixture.causationId,
    payload: fixture.payload,
    store_id: fixture.side.storeId,
    source_identity: fixture.side.sourceIdentity,
    occurred_at: fixture.side.occurredAt,
    contract_version: fixture.side.contractVersion,
  });
}

export function makeCloudIngest(
  pool: Pool,
  contract: FrozenContract,
  clock: ManualClock,
  hooks?: CloudIngestHooks,
): TestOnlyCloudIngest {
  return new TestOnlyCloudIngest({ pool, contract, now: clock.now, hooks });
}

/** A direct (in-process) transport from a Store dispatcher to a Cloud ingest, as the fixed test peer. */
export function directTransport(ingest: TestOnlyCloudIngest): PushTransport {
  return new DirectIngestTransport(ingest, TEST_STORE_PEER_ID);
}

export interface DispatcherOverrides {
  readonly pool: Pool;
  readonly transport: PushTransport;
  readonly contract: FrozenContract;
  readonly clock: ManualClock;
  readonly workerId?: string;
  readonly leaseMs?: number;
  readonly batchSize?: number;
  readonly checkpoint?: DispatcherConfig["checkpoint"];
  readonly hooks?: DispatcherConfig["hooks"];
  readonly retry?: DispatcherConfig["retry"];
}

export function makeDispatcher(overrides: DispatcherOverrides): TestOnlyDispatcher {
  return new TestOnlyDispatcher({
    pool: overrides.pool,
    transport: overrides.transport,
    contract: overrides.contract,
    workerId: overrides.workerId ?? "test-worker-1",
    remotePeerId: TEST_CLOUD_PEER_ID,
    now: overrides.clock.now,
    leaseMs: overrides.leaseMs ?? 30_000,
    batchSize: overrides.batchSize ?? 10,
    retry: overrides.retry ?? TEST_FIXTURE_RETRY_POLICY,
    checkpoint: overrides.checkpoint ?? { enabled: true, useLock: true },
    hooks: overrides.hooks,
  });
}

/**
 * Runs the dispatcher until nothing is pending, advancing the manual clock past backoff between
 * rounds. Returns every round's summary. Fails the run if it does not drain within `maxRounds`.
 */
export async function drain(
  dispatcher: TestOnlyDispatcher,
  pool: Pool,
  clock: ManualClock,
  options: { readonly maxRounds?: number; readonly stepMs?: number } = {},
): Promise<RunSummary[]> {
  const maxRounds = options.maxRounds ?? 50;
  const stepMs = options.stepMs ?? 10_000;
  const rounds: RunSummary[] = [];
  for (let round = 0; round < maxRounds; round += 1) {
    const summary = await dispatcher.runOnce();
    rounds.push(summary);
    const backlog = await readBacklog(pool, TEST_CLOUD_PEER_ID);
    if (backlog.pending === 0) return rounds;
    clock.advance(stepMs);
  }
  throw new Error(`outbox did not drain within ${maxRounds} rounds`);
}

/**
 * TEST-ONLY replay of messages that ended as RETRIES_EXHAUSTED. This is a HARNESS CHOICE: the frozen
 * text defines no operator procedure for dead letters. It removes the test-only terminal row and
 * resets the retry state of the still-undelivered outbox row, so the same message id is sent again.
 * The `integration.dead_letters` row is left as history; its status vocabulary is not frozen and the
 * table has no unique key, so the harness neither updates nor deletes it. QUARANTINED and REJECTED
 * rows are never requeued here. Returns how many rows were requeued.
 */
export async function requeueExhausted(
  pool: Pool,
  remotePeerId: string,
  now: Date,
): Promise<number> {
  const result = await pool.query(
    `WITH gone AS (
       DELETE FROM spike_mm010.store_terminal
        WHERE peer_id = $1 AND state = 'RETRIES_EXHAUSTED'
       RETURNING tenant_id, outbox_message_id)
     UPDATE integration.outbox_messages AS o
        SET attempt_count = 0, available_at = $2, last_error = NULL,
            claim_owner = NULL, claim_expires_at = NULL
       FROM gone
      WHERE o.tenant_id = gone.tenant_id AND o.outbox_message_id = gone.outbox_message_id
        AND o.published_at IS NULL`,
    [remotePeerId, now],
  );
  return result.rowCount ?? 0;
}

/** Empties the Store-side tables the experiment writes. Test databases only. */
export async function resetStore(pool: Pool): Promise<void> {
  await pool.query(
    `TRUNCATE integration.outbox_messages, integration.sync_checkpoints, integration.dead_letters,
              spike_mm010.store_facts, spike_mm010.envelope_side, spike_mm010.store_terminal`,
  );
}

/** Empties the Cloud-side tables the experiment writes. Test databases only. */
export async function resetCloud(pool: Pool): Promise<void> {
  await pool.query(
    `TRUNCATE integration.inbox_receipts, integration.sync_checkpoints, integration.dead_letters,
              spike_mm010.cloud_effects, spike_mm010.cloud_quarantine`,
  );
}

export async function countRows(pool: Pool, table: string, where = "true"): Promise<number> {
  const result = await pool.query<{ n: string }>(
    `SELECT count(*) AS n FROM ${table} WHERE ${where}`,
  );
  return Number(result.rows[0]?.n ?? "0");
}
