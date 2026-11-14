import { randomBytes } from "node:crypto";

export * from "./decimal.js";

/** Minimal SQL port. Modules own their SQL and run it through this port. */
export interface Sql {
  query<Row = Record<string, unknown>>(
    text: string,
    parameters?: readonly unknown[],
  ): Promise<{ readonly rows: Row[] }>;
}

/** Runs a unit of work in one database transaction. */
export interface TransactionRunner {
  run<Result>(work: (sql: Sql) => Promise<Result>): Promise<Result>;
}

/** Trusted store context for one request. */
export interface StoreContext {
  readonly tenantId: string;
  readonly companyId: string;
  readonly storeId: string;
  readonly currencyCode: string;
  readonly timezoneName: string;
  readonly actorId: string;
  readonly now: Date;
}

export type ErrorCategory = "VALIDATION" | "NOT_FOUND" | "CONFLICT" | "BUSINESS_RULE";

export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly category: ErrorCategory = "BUSINESS_RULE",
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

let lastMilliseconds = -1n;
let sequence = 0;

/**
 * UUIDv7: 48-bit Unix milliseconds, a 12-bit sequence, then random bits. Values generated in this
 * process are strictly increasing, including several generated for the same instant.
 */
export function uuidv7(now: Date = new Date()): string {
  const bytes = randomBytes(16);
  let milliseconds = BigInt(now.getTime());
  if (milliseconds <= lastMilliseconds) {
    milliseconds = lastMilliseconds;
    sequence += 1;
    if (sequence > 0xfff) {
      milliseconds += 1n;
      sequence = 0;
    }
  } else {
    sequence = 0;
  }
  lastMilliseconds = milliseconds;
  for (let index = 0; index < 6; index += 1) {
    bytes[index] = Number((milliseconds >> BigInt(8 * (5 - index))) & 0xffn);
  }
  bytes[6] = 0x70 | (sequence >> 8);
  bytes[7] = sequence & 0xff;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/** Calendar date (YYYY-MM-DD) of an instant in an IANA time zone. */
export function localDate(instant: Date, timezoneName: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezoneName,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}
