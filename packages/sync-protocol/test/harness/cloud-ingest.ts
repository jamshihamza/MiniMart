/**
 * MM-010 TEST-ONLY Cloud ingest. It follows the frozen inbox pattern (validate the message, then in
 * ONE transaction claim an `integration.inbox_receipts` row, apply the effect and mark the receipt
 * applied) but it is a harness, not a production Cloud handler. The "business effect" is a row in the
 * test-only `cloud_effects` table; no Business Day behavior exists.
 *
 * Deduplication is scoped by (tenant, peer, message id), matching the frozen unique index. The
 * harness does not assume that message ids are globally unique.
 */
import type { Pool } from "pg";

import { newUuidV7 } from "./fixtures.js";
import { canonicalJson, payloadHash } from "./envelope.js";
import {
  evaluateCompatibility,
  isUuid,
  type Compatibility,
  type FrozenContract,
  type ProblemCodeUsed,
} from "./frozen-contract.js";
import { TEST_ONLY_SCHEMA } from "./test-only-schema.js";
import type { PushResult, PushResultItem } from "./transport.js";

/** Harness choice: the effect side only understands this one registered type. */
export const HARNESS_SUPPORTED_TYPE = "BusinessDayStateChanged";

export interface CloudIngestHooks {
  /** Runs inside the apply transaction after the effect insert. Throw to prove the rollback. */
  readonly beforeMarkApplied?: (() => void | Promise<void>) | undefined;
}

export interface CloudIngestConfig {
  readonly pool: Pool;
  readonly contract: FrozenContract;
  readonly now: () => Date;
  readonly hooks?: CloudIngestHooks | undefined;
}

export interface IngestPort {
  push(request: unknown, peerId: string): Promise<PushResult>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rejected(messageId: string, code: ProblemCodeUsed, detail: string): PushResultItem {
  return { messageId, outcome: "REJECTED", problem: { code, detail } };
}

export class TestOnlyCloudIngest implements IngestPort {
  constructor(private readonly config: CloudIngestConfig) {}

  async push(request: unknown, peerId: string): Promise<PushResult> {
    if (!isRecord(request) || !Array.isArray(request["messages"])) {
      throw new TypeError("push request must carry a messages array");
    }
    const results: PushResultItem[] = [];
    for (const message of request["messages"] as unknown[]) {
      results.push(await this.ingestOne(peerId, message));
    }
    return { results };
  }

  private async ingestOne(peerId: string, message: unknown): Promise<PushResultItem> {
    const messageId =
      isRecord(message) && typeof message["messageId"] === "string" ? message["messageId"] : "";
    if (!isRecord(message) || !isUuid(message["messageId"]) || !isUuid(message["tenantId"])) {
      return rejected(
        messageId,
        "VALIDATION_FAILED",
        "messageId or tenantId is missing or not a uuid",
      );
    }
    const compatibility: Compatibility = evaluateCompatibility(this.config.contract, message);
    if (compatibility.kind === "REJECT") {
      return rejected(messageId, compatibility.code, compatibility.reason);
    }
    if (compatibility.kind === "QUARANTINE") {
      await this.quarantine(peerId, message, compatibility.code, compatibility.reason);
      return {
        messageId,
        outcome: "QUARANTINED",
        problem: { code: compatibility.code, detail: compatibility.reason },
      };
    }
    if (message["messageType"] !== HARNESS_SUPPORTED_TYPE) {
      return rejected(
        messageId,
        "UNSUPPORTED_POLICY",
        "the harness applies only BusinessDayStateChanged",
      );
    }
    return this.apply(peerId, message);
  }

  /** Records a quarantine once per (tenant, peer, message) and writes one dead-letter row for the winner. */
  private async quarantine(
    peerId: string,
    message: Record<string, unknown>,
    code: ProblemCodeUsed,
    reason: string,
  ): Promise<void> {
    const now = this.config.now();
    const client = await this.config.pool.connect();
    try {
      await client.query("BEGIN");
      const hash = payloadHash(message["payload"] ?? null);
      const inserted = await client.query(
        `INSERT INTO ${TEST_ONLY_SCHEMA}.cloud_quarantine
           (tenant_id, peer_id, message_id, problem_code, reason, payload_hash, recorded_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (tenant_id, peer_id, message_id) DO NOTHING
         RETURNING message_id`,
        [message["tenantId"], peerId, message["messageId"], code, reason, hash, now],
      );
      if (inserted.rowCount === 1) {
        await client.query(
          `INSERT INTO integration.dead_letters
             (dead_letter_id, tenant_id, source_message_id, failure_class, payload_hash, retry_count,
              first_failed_at, last_failed_at, status, created_at)
           VALUES ($1, $2, $3, $4, $5, 0, $6, $6, 'QUARANTINED', $6)`,
          [newUuidV7(now), message["tenantId"], message["messageId"], code, hash, now],
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

  /** Inbox receipt, effect and applied mark commit once. A duplicate commits nothing new. */
  private async apply(peerId: string, message: Record<string, unknown>): Promise<PushResultItem> {
    const messageId = message["messageId"] as string;
    const payload = message["payload"] as Record<string, unknown>;
    const now = this.config.now();
    const client = await this.config.pool.connect();
    try {
      await client.query("BEGIN");
      const claimed = await client.query(
        `INSERT INTO integration.inbox_receipts
           (inbox_receipt_id, tenant_id, peer_id, message_id, status, received_at)
         VALUES ($1, $2, $3, $4, 'CLAIMED', $5)
         ON CONFLICT (tenant_id, peer_id, message_id) DO NOTHING
         RETURNING inbox_receipt_id`,
        [newUuidV7(now), message["tenantId"], peerId, messageId, now],
      );
      if (claimed.rowCount === 0) {
        await client.query("COMMIT");
        return { messageId, outcome: "DUPLICATE", problem: null };
      }
      await client.query(
        `INSERT INTO ${TEST_ONLY_SCHEMA}.cloud_effects
           (tenant_id, peer_id, message_id, business_day_id, status, business_date, source_version,
            applied_at)
         VALUES ($1, $2, $3, $4, $5, $6::date, $7, $8)`,
        [
          message["tenantId"],
          peerId,
          messageId,
          payload["businessDayId"],
          payload["status"],
          payload["businessDate"],
          payload["sourceVersion"],
          now,
        ],
      );
      await this.config.hooks?.beforeMarkApplied?.();
      await client.query(
        `UPDATE integration.inbox_receipts
            SET status = 'APPLIED', applied_at = $4, result_ref = $5::jsonb
          WHERE tenant_id = $1 AND peer_id = $2 AND message_id = $3`,
        [
          message["tenantId"],
          peerId,
          messageId,
          now,
          canonicalJson({ effectTable: `${TEST_ONLY_SCHEMA}.cloud_effects` }),
        ],
      );
      await client.query("COMMIT");
      return { messageId, outcome: "APPLIED", problem: null };
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined); // keep the original error
      throw error;
    } finally {
      client.release();
    }
  }
}
