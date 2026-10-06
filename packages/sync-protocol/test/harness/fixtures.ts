/**
 * MM-010 TEST-ONLY fixtures. Everything here is synthetic. It is not production code and it does
 * not define any production mapping, identity rule or Business Day behavior.
 */
import { randomBytes } from "node:crypto";

/** Tenant used by the harness. A synthetic UUIDv7-shaped value. */
export const TEST_TENANT_ID = syntheticUuid(1, 1);
/** A second tenant, used only to show that deduplication scopes include the tenant. */
export const OTHER_TENANT_ID = syntheticUuid(1, 2);
/** Store identity carried in fixture envelopes. */
export const TEST_STORE_ID = syntheticUuid(2, 1);
/**
 * The peer the Cloud sees: the sending Store. A fixed test value. It is not an enrolled device and
 * nothing in the harness authenticates it.
 */
export const TEST_STORE_PEER_ID = syntheticUuid(3, 1);
/** A second sending peer, used only to show that deduplication scopes include the peer. */
export const OTHER_PEER_ID = syntheticUuid(3, 2);
/** The peer the Store sees: the receiving Cloud. A fixed test value. */
export const TEST_CLOUD_PEER_ID = syntheticUuid(4, 1);

/** Deterministic UUIDv7-shaped identifier. `kind` and `n` only keep fixtures distinct. */
export function syntheticUuid(kind: number, n: number): string {
  const kindHex = kind.toString(16).padStart(4, "0");
  const tail = n.toString(16).padStart(12, "0");
  return `018f0000-${kindHex}-7000-8000-${tail}`;
}

/** Random UUIDv7-shaped identifier for harness-internal rows (millisecond time plus random bits). */
export function newUuidV7(now: Date = new Date()): string {
  const timeHex = now.getTime().toString(16).padStart(12, "0");
  const random = randomBytes(10);
  const rand = random.toString("hex");
  const variant = (0x8 | (random[8]! & 0x3)).toString(16);
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-7${rand.slice(0, 3)}-${variant}${rand.slice(
    3,
    6,
  )}-${rand.slice(6, 18)}`;
}

/** A fictional wire payload for the registered `BusinessDayStateChanged` message type. */
export interface BusinessDayPayload {
  readonly businessDayId: string;
  readonly status: string;
  readonly businessDate: string;
  readonly sourceVersion: number;
}

/** Envelope fields the production outbox row has no column for. Supplied explicitly by fixtures. */
export interface EnvelopeSideValues {
  readonly storeId: string | null;
  readonly sourceIdentity: string;
  readonly occurredAt: Date;
  readonly contractVersion: string;
}

/** Everything the harness "posting" writes in one local transaction. */
export interface StoreFixture {
  readonly sequence: number;
  readonly factId: string;
  readonly outboxMessageId: string;
  readonly eventId: string;
  readonly tenantId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly aggregateId: string;
  readonly correlationId: string | null;
  readonly causationId: string | null;
  readonly postingEnvelopeId: string | null;
  readonly payload: BusinessDayPayload;
  readonly side: EnvelopeSideValues;
}

export interface FixtureOptions {
  readonly tenantId?: string;
  readonly eventType?: string;
  readonly contractVersion?: string;
  readonly sourceIdentity?: string;
  readonly status?: string;
  readonly sourceVersion?: number;
}

const BASE_OCCURRED_AT_MS = Date.UTC(2026, 2, 14, 8, 30, 0);

/**
 * Builds one fictional `BusinessDayStateChanged` fixture. `status` is an opaque string: no
 * Business Day state semantics are implemented or implied. The occurrence time is an explicit
 * fixture value and is deliberately unrelated to the outbox `created_at` the seeding code uses.
 */
export function businessDayFixture(sequence: number, options: FixtureOptions = {}): StoreFixture {
  return {
    sequence,
    factId: syntheticUuid(5, sequence),
    outboxMessageId: syntheticUuid(6, sequence),
    eventId: syntheticUuid(7, sequence),
    tenantId: options.tenantId ?? TEST_TENANT_ID,
    eventType: options.eventType ?? "BusinessDayStateChanged",
    eventVersion: 1,
    aggregateId: syntheticUuid(8, sequence),
    correlationId: syntheticUuid(9, sequence),
    causationId: null,
    postingEnvelopeId: null,
    payload: {
      businessDayId: syntheticUuid(8, sequence),
      status: options.status ?? "FIXTURE_STATUS",
      businessDate: "2026-03-14",
      sourceVersion: options.sourceVersion ?? sequence,
    },
    side: {
      storeId: TEST_STORE_ID,
      sourceIdentity: options.sourceIdentity ?? "fixture-source-identity",
      occurredAt: new Date(BASE_OCCURRED_AT_MS + sequence * 1000),
      contractVersion: options.contractVersion ?? "1.0",
    },
  };
}

const BASE_CREATED_AT_MS = Date.UTC(2026, 9, 6, 9, 0, 0);

/**
 * Outbox `created_at` used by the seeding code. It is intentionally a different instant from every
 * fixture `occurredAt`, so no test can pass by treating the two as the same thing.
 */
export function createdAtFor(sequence: number): Date {
  return new Date(BASE_CREATED_AT_MS + sequence * 1000);
}
