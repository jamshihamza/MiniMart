/**
 * MM-010 TEST-ONLY contract checks against the actual frozen files.
 *
 * Reads `docs/specifications/05-api-contracts/openapi/minimart-sync-v1.yaml` and
 * `registry/sync-message-registry-v1.0.json` at run time and validates messages against the real
 * `SyncMessage_*` components with ajv. It is NOT the contract's generated validator, it does not run
 * the frozen conformance suite, and nothing here may be claimed as contract conformance. ajv format
 * checking is off, so uuid, date and date-time formats are asserted separately in
 * {@link wireFormatProblems}.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { Ajv2020 } from "ajv/dist/2020.js";
import { parse as parseYaml } from "yaml";

const REPOSITORY_ROOT = new URL("../../../../", import.meta.url);
const OPENAPI_PATH = "docs/specifications/05-api-contracts/openapi/minimart-sync-v1.yaml";
const REGISTRY_PATH =
  "docs/specifications/05-api-contracts/registry/sync-message-registry-v1.0.json";
const OPENAPI_ID = "https://minimart.invalid/frozen-sync-v1-openapi";

export interface RegistryEntry {
  readonly messageType: string;
  readonly contractVersion: string;
  readonly producerMode: string;
  readonly consumerMode: string;
  readonly ownerClass: string;
  readonly targetModule: string;
  readonly applyMode: string;
}

export interface SchemaValidation {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export type ProblemCodeUsed =
  | "SYNC_MESSAGE_INCOMPATIBLE"
  | "SYNC_OWNERSHIP_VIOLATION"
  | "VALIDATION_FAILED"
  | "UNSUPPORTED_POLICY";

export type Compatibility =
  | { readonly kind: "COMPATIBLE"; readonly entry: RegistryEntry }
  | {
      readonly kind: "QUARANTINE";
      readonly code: ProblemCodeUsed;
      readonly reason: string;
    }
  | { readonly kind: "REJECT"; readonly code: ProblemCodeUsed; readonly reason: string };

export interface FrozenContract {
  registryEntry(messageType: string): RegistryEntry | undefined;
  hasMessageComponent(messageType: string): boolean;
  validateMessage(message: unknown): SchemaValidation;
  readonly registryTypes: readonly string[];
}

function readRepositoryFile(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, REPOSITORY_ROOT)), "utf8");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Loads the frozen registry and OpenAPI. Throws loudly if either file is missing or malformed. */
export function loadFrozenContract(): FrozenContract {
  const registry = JSON.parse(readRepositoryFile(REGISTRY_PATH)) as unknown;
  if (!Array.isArray(registry) || registry.length === 0) {
    throw new Error("Frozen sync message registry is missing or empty");
  }
  const entries = new Map<string, RegistryEntry>();
  for (const raw of registry as unknown[]) {
    if (!isRecord(raw) || typeof raw["messageType"] !== "string") {
      throw new Error("Frozen sync message registry has a malformed entry");
    }
    entries.set(raw["messageType"], raw as unknown as RegistryEntry);
  }

  const document = parseYaml(readRepositoryFile(OPENAPI_PATH)) as unknown;
  if (!isRecord(document) || !isRecord(document["components"])) {
    throw new Error("Frozen sync OpenAPI is missing components");
  }
  const schemas = (document["components"] as Record<string, unknown>)["schemas"];
  if (!isRecord(schemas)) throw new Error("Frozen sync OpenAPI has no components.schemas");

  const ajv = new Ajv2020({ strict: false, validateFormats: false, allErrors: true });
  ajv.addSchema({ ...document, $id: OPENAPI_ID });

  return {
    registryTypes: [...entries.keys()],
    registryEntry: (messageType) => entries.get(messageType),
    hasMessageComponent: (messageType) => isRecord(schemas[`SyncMessage_${messageType}`]),
    validateMessage(message) {
      const type = isRecord(message) ? message["messageType"] : undefined;
      if (typeof type !== "string" || !isRecord(schemas[`SyncMessage_${type}`])) {
        return { valid: false, errors: ["no frozen SyncMessage component for this messageType"] };
      }
      const validate = ajv.getSchema(`${OPENAPI_ID}#/components/schemas/SyncMessage_${type}`);
      if (validate === undefined) {
        throw new Error(`ajv could not resolve SyncMessage_${type} in the frozen OpenAPI`);
      }
      const valid = validate(message) as boolean;
      return {
        valid,
        errors: (validate.errors ?? []).map(
          (error) => `${error.instancePath} ${error.message ?? ""}`,
        ),
      };
    },
  };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function isRealDate(value: string): boolean {
  return DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isRealDateTime(value: string): boolean {
  return DATE_TIME_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

/**
 * Format assertions the ajv pass does not make (formats are off). Covers the envelope identity and
 * time fields and the `BusinessDayStateChanged` payload fields only.
 */
export function wireFormatProblems(message: Record<string, unknown>): string[] {
  const problems: string[] = [];
  for (const key of ["messageId", "tenantId"]) {
    if (!isUuid(message[key])) problems.push(`${key} is not a uuid`);
  }
  for (const key of ["storeId", "postingEnvelopeId"]) {
    const value = message[key];
    if (value !== undefined && value !== null && !isUuid(value))
      problems.push(`${key} is not a uuid`);
  }
  const occurredAt = message["occurredAt"];
  if (typeof occurredAt !== "string" || !isRealDateTime(occurredAt)) {
    problems.push("occurredAt is not a date-time");
  }
  const payload = message["payload"];
  if (message["messageType"] === "BusinessDayStateChanged" && isRecord(payload)) {
    if (!isUuid(payload["businessDayId"])) problems.push("payload.businessDayId is not a uuid");
    const date = payload["businessDate"];
    if (typeof date !== "string" || !isRealDate(date))
      problems.push("payload.businessDate is not a date");
  }
  return problems;
}

/**
 * Harness reading of the frozen rules, in the order the apply contract gives: registered type,
 * declared version, ownership, then structure. "Declared compatible versions" is read as exactly the
 * registry's `contractVersion`; that reading is a harness choice, not a frozen definition.
 */
export function evaluateCompatibility(contract: FrozenContract, message: unknown): Compatibility {
  if (!isRecord(message)) {
    return { kind: "REJECT", code: "VALIDATION_FAILED", reason: "message is not an object" };
  }
  const type = message["messageType"];
  if (typeof type !== "string") {
    return { kind: "REJECT", code: "VALIDATION_FAILED", reason: "messageType is missing" };
  }
  const entry = contract.registryEntry(type);
  if (entry === undefined) {
    return {
      kind: "QUARANTINE",
      code: "SYNC_MESSAGE_INCOMPATIBLE",
      reason: `messageType ${type} is not in the frozen registry`,
    };
  }
  if (message["contractVersion"] !== entry.contractVersion) {
    return {
      kind: "QUARANTINE",
      code: "SYNC_MESSAGE_INCOMPATIBLE",
      reason: `contractVersion is not the declared ${entry.contractVersion}`,
    };
  }
  if (message["ownerClass"] !== entry.ownerClass || message["sourceMode"] !== entry.producerMode) {
    return {
      kind: "QUARANTINE",
      code: "SYNC_OWNERSHIP_VIOLATION",
      reason: "ownerClass or sourceMode does not match the registry",
    };
  }
  if (!contract.hasMessageComponent(type)) {
    return {
      kind: "REJECT",
      code: "UNSUPPORTED_POLICY",
      reason: "the frozen OpenAPI has no SyncMessage component for this type",
    };
  }
  const structure = contract.validateMessage(message);
  const formats = wireFormatProblems(message);
  if (!structure.valid || formats.length > 0) {
    return {
      kind: "REJECT",
      code: "VALIDATION_FAILED",
      reason: [...structure.errors, ...formats].join("; "),
    };
  }
  return { kind: "COMPATIBLE", entry };
}
