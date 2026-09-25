export interface EndpointReply {
  readonly statusCode: number | null;
  readonly body: string | null;
}

export interface SystemStatusProbe {
  readonly health: EndpointReply;
  readonly readiness: EndpointReply;
}

export type StoreNodeStatus =
  | "checking"
  | "unavailable"
  | "database-unavailable"
  | "schema-incompatible"
  | "not-ready"
  | "online";

function object(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function exactKeys(
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
): boolean {
  const keys = Object.keys(value);
  return (
    required.every((key) => keys.includes(key)) &&
    keys.every((key) => required.includes(key) || optional.includes(key))
  );
}

function parsed(reply: EndpointReply): Record<string, unknown> | null {
  if (reply.statusCode !== 200 || typeof reply.body !== "string" || reply.body.length > 16_384)
    return null;
  try {
    return object(JSON.parse(reply.body) as unknown);
  } catch {
    return null;
  }
}

export function interpretStoreNodeStatus(probe: SystemStatusProbe): StoreNodeStatus {
  const health = parsed(probe.health);
  if (
    health === null ||
    !exactKeys(health, ["status", "time"]) ||
    health["status"] !== "UP" ||
    typeof health["time"] !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(health["time"]) ||
    Number.isNaN(Date.parse(health["time"]))
  )
    return "unavailable";

  const readiness = parsed(probe.readiness);
  if (
    readiness === null ||
    !exactKeys(
      readiness,
      ["transactionalReady", "databaseReady", "schemaCompatible", "reasons"],
      ["syncHealthy"],
    ) ||
    typeof readiness["transactionalReady"] !== "boolean" ||
    typeof readiness["databaseReady"] !== "boolean" ||
    typeof readiness["schemaCompatible"] !== "boolean" ||
    !Array.isArray(readiness["reasons"]) ||
    !readiness["reasons"].every((reason: unknown) => typeof reason === "string") ||
    ("syncHealthy" in readiness && typeof readiness["syncHealthy"] !== "boolean")
  )
    return "not-ready";

  if (!readiness["databaseReady"]) return "database-unavailable";
  if (!readiness["schemaCompatible"]) return "schema-incompatible";
  if (!readiness["transactionalReady"]) return "not-ready";
  return "online";
}

export const STORE_NODE_STATUS_LABEL: Record<StoreNodeStatus, string> = {
  checking: "Store Node · Checking",
  unavailable: "Store Node · Unavailable",
  "database-unavailable": "Store Node · Database unavailable",
  "schema-incompatible": "Store Node · Schema incompatible",
  "not-ready": "Store Node · Not ready",
  online: "Store Node · Online",
};
