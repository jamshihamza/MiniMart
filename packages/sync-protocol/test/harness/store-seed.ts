/**
 * MM-010 TEST-ONLY stand-in for a Store posting. In one local transaction it writes a synthetic fact,
 * a production `integration.outbox_messages` row and the harness side row. It is NOT a Posting
 * Envelope, runs no module code, and implements no Business Day behavior. It exists only to show
 * the same-transaction outbox property with a synthetic fact.
 */
import type { Pool } from "pg";

import type { StoreFixture } from "./fixtures.js";
import { TEST_ONLY_SCHEMA } from "./test-only-schema.js";

export interface SeedOptions {
  /** Outbox `created_at`. Deliberately a different instant from the fixture's `occurredAt`. */
  readonly createdAt: Date;
  readonly availableAt?: Date | undefined;
  /** Throw after the outbox insert so the whole transaction must roll back. */
  readonly failAfterOutbox?: boolean | undefined;
}

export async function postFixtureFact(
  pool: Pool,
  fixture: StoreFixture,
  options: SeedOptions,
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO ${TEST_ONLY_SCHEMA}.store_facts (fact_id, tenant_id, business_day_id, payload)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [fixture.factId, fixture.tenantId, fixture.aggregateId, JSON.stringify(fixture.payload)],
    );
    await client.query(
      `INSERT INTO integration.outbox_messages
         (outbox_message_id, tenant_id, event_id, producer_context, aggregate_type, aggregate_id,
          event_type, event_version, posting_envelope_id, correlation_id, causation_id, payload,
          created_at, available_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14)`,
      [
        fixture.outboxMessageId,
        fixture.tenantId,
        fixture.eventId,
        "mm010-harness",
        "FixtureAggregate",
        fixture.aggregateId,
        fixture.eventType,
        fixture.eventVersion,
        fixture.postingEnvelopeId,
        fixture.correlationId,
        fixture.causationId,
        JSON.stringify(fixture.payload),
        options.createdAt,
        options.availableAt ?? options.createdAt,
      ],
    );
    if (options.failAfterOutbox === true) throw new Error("forced failure after the outbox insert");
    await client.query(
      `INSERT INTO ${TEST_ONLY_SCHEMA}.envelope_side
         (tenant_id, outbox_message_id, store_id, source_identity, occurred_at, contract_version)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        fixture.tenantId,
        fixture.outboxMessageId,
        fixture.side.storeId,
        fixture.side.sourceIdentity,
        fixture.side.occurredAt,
        fixture.side.contractVersion,
      ],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined); // keep the original error
    throw error;
  } finally {
    client.release();
  }
}
