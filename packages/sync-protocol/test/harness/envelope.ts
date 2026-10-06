/**
 * MM-010 TEST-ONLY envelope assembly. Combines a production outbox row with the harness side row.
 * It asserts no production mapping: the side values are explicit fixture values, and the two
 * registry-derived fields (`ownerClass`, `sourceMode`) come from the frozen registry only.
 */
import { createHash } from "node:crypto";

import type { FrozenContract } from "./frozen-contract.js";
import type { WireMessage } from "./transport.js";

/** Marker for a type the frozen registry does not know. The Cloud quarantines it. */
export const UNREGISTERED_MARKER = "UNREGISTERED_BY_HARNESS";

export interface OutboxEnvelopeRow {
  readonly event_id: string;
  readonly event_type: string;
  readonly tenant_id: string;
  readonly posting_envelope_id: string | null;
  readonly correlation_id: string | null;
  readonly causation_id: string | null;
  readonly payload: unknown;
  readonly store_id: string | null;
  readonly source_identity: string;
  readonly occurred_at: Date;
  readonly contract_version: string;
}

export function buildEnvelope(contract: FrozenContract, row: OutboxEnvelopeRow): WireMessage {
  const entry = contract.registryEntry(row.event_type);
  return {
    messageId: row.event_id,
    messageType: row.event_type,
    contractVersion: row.contract_version,
    ownerClass: entry?.ownerClass ?? UNREGISTERED_MARKER,
    tenantId: row.tenant_id,
    storeId: row.store_id,
    sourceMode: entry?.producerMode ?? UNREGISTERED_MARKER,
    sourceIdentity: row.source_identity,
    postingEnvelopeId: row.posting_envelope_id,
    correlationId: row.correlation_id,
    causationId: row.causation_id,
    occurredAt: row.occurred_at.toISOString(),
    payload: row.payload,
  };
}

/** JSON with object keys sorted, so a hash does not depend on key order. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function payloadHash(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}
