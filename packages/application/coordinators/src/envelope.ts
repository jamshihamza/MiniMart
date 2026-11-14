import { createHash } from "node:crypto";

import { DomainError, uuidv7, type Sql, type StoreContext } from "@minimart/shared-kernel";

type Scope = Pick<StoreContext, "tenantId" | "companyId" | "storeId" | "actorId" | "now">;

export interface PostingEvent {
  readonly actionCode: string;
  readonly targetContext: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly eventType: string;
  readonly postingEnvelopeId: string;
  readonly reasonCode?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

/** Writes the audit event and the outbox message that belong to one posting envelope. */
export async function recordPosting(sql: Sql, context: Scope, event: PostingEvent): Promise<void> {
  await sql.query(
    `INSERT INTO audit.audit_events (audit_event_id, tenant_id, company_id, store_id, actor_id,
       action_code, target_context, target_type, target_id, reason_code, posting_envelope_id,
       correlation_id, occurred_at, evidence, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $12, $13, $12)`,
    [
      uuidv7(context.now),
      context.tenantId,
      context.companyId,
      context.storeId,
      context.actorId,
      event.actionCode,
      event.targetContext,
      event.targetType,
      event.targetId,
      event.reasonCode ?? null,
      event.postingEnvelopeId,
      context.now,
      JSON.stringify(event.payload),
    ],
  );
  await sql.query(
    `INSERT INTO integration.outbox_messages (outbox_message_id, tenant_id, event_id, producer_context,
       aggregate_type, aggregate_id, event_type, event_version, posting_envelope_id, correlation_id,
       payload, created_at, available_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $8, $9, $10, $10)`,
    [
      uuidv7(context.now),
      context.tenantId,
      uuidv7(context.now),
      event.targetContext,
      event.targetType,
      event.targetId,
      event.eventType,
      event.postingEnvelopeId,
      JSON.stringify(event.payload),
      context.now,
    ],
  );
}

export function requestFingerprint(request: unknown): string {
  return createHash("sha256").update(JSON.stringify(request)).digest("hex");
}

export interface IdempotencyClaim {
  /** Result id of the earlier completed request with the same key, if this is a replay. */
  readonly replayOf: string | null;
  complete(resultType: string, resultId: string): Promise<void>;
}

/**
 * Claims an idempotency key inside the posting transaction. A repeated key with the same request
 * replays the earlier result; the same key with a different request is rejected.
 */
export async function claimIdempotency(
  sql: Sql,
  context: Pick<StoreContext, "tenantId" | "now">,
  operationScope: string,
  idempotencyKey: string,
  request: unknown,
): Promise<IdempotencyClaim> {
  const key = idempotencyKey.trim();
  if (key.length < 8 || key.length > 200) {
    throw new DomainError(
      "IDEMPOTENCY_KEY_INVALID",
      "An idempotency key of 8 to 200 characters is required",
      "VALIDATION",
    );
  }
  const fingerprint = requestFingerprint(request);
  const recordId = uuidv7(context.now);
  const inserted = await sql.query(
    `INSERT INTO integration.idempotency_records (idempotency_record_id, tenant_id, operation_scope,
       idempotency_key, request_fingerprint, status, created_at)
     VALUES ($1, $2, $3, $4, $5, 'IN_PROGRESS', $6)
     ON CONFLICT (tenant_id, operation_scope, idempotency_key) DO NOTHING
     RETURNING idempotency_record_id`,
    [recordId, context.tenantId, operationScope, key, fingerprint, context.now],
  );
  if (inserted.rows.length === 0) {
    const existing = await sql.query<{
      request_fingerprint: string;
      status: string;
      result_id: string | null;
    }>(
      `SELECT request_fingerprint, status, result_id FROM integration.idempotency_records
       WHERE tenant_id = $1 AND operation_scope = $2 AND idempotency_key = $3`,
      [context.tenantId, operationScope, key],
    );
    const record = existing.rows[0];
    if (record === undefined || record.status !== "COMPLETED" || record.result_id === null) {
      throw new DomainError(
        "IDEMPOTENCY_IN_PROGRESS",
        "A request with this idempotency key has not completed",
        "CONFLICT",
      );
    }
    if (record.request_fingerprint !== fingerprint) {
      throw new DomainError(
        "IDEMPOTENCY_KEY_REUSED",
        "This idempotency key was already used for a different request",
        "CONFLICT",
      );
    }
    return { replayOf: record.result_id, complete: () => Promise.resolve() };
  }
  return {
    replayOf: null,
    async complete(resultType: string, resultId: string): Promise<void> {
      await sql.query(
        `UPDATE integration.idempotency_records SET status = 'COMPLETED', result_type = $3,
           result_id = $4, completed_at = $5 WHERE tenant_id = $1 AND idempotency_record_id = $2`,
        [context.tenantId, recordId, resultType, resultId, context.now],
      );
    },
  };
}
