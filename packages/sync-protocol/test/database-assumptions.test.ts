/**
 * MM-010 TEST-ONLY, DATABASE-DEPENDENT. Needs PostgreSQL (see docs/phase-0/mm-010-sync-proof-spike.md).
 * Without a reachable PostgreSQL this file FAILS in setup with PostgresUnavailableError; it is never
 * skipped. These checks read the real catalog of a migrated test database to confirm what the
 * harness assumes about the frozen sync tables, including the gaps the harness works around.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createDatabasePair, type DatabasePair } from "./harness/database-pair.js";
import { stopManagedPostgres } from "./harness/postgres.js";
import { TEST_ONLY_SCHEMA } from "./harness/test-only-schema.js";

let databases: DatabasePair | undefined;
const pair = (): DatabasePair => {
  if (databases === undefined) throw new Error("database pair was not created");
  return databases;
};

beforeAll(async () => {
  databases = await createDatabasePair();
}, 240_000);

afterAll(async () => {
  await databases?.drop();
  await stopManagedPostgres();
});

const SYNC_TABLES = [
  "integration.outbox_messages",
  "integration.inbox_receipts",
  "integration.idempotency_records",
  "integration.sync_checkpoints",
  "integration.dead_letters",
];

async function indexDefinitions(table: string): Promise<string[]> {
  const [schema, name] = table.split(".");
  const result = await pair().store.pool.query<{ indexdef: string }>(
    "SELECT indexdef FROM pg_indexes WHERE schemaname = $1 AND tablename = $2",
    [schema, name],
  );
  return result.rows.map((row) => row.indexdef);
}

describe("foreign keys: no seed rows are needed for the sync tables", () => {
  it("has no foreign key from or to any frozen sync table, in the Store and the Cloud databases", async () => {
    for (const { pool } of [pair().store, pair().cloud]) {
      const result = await pool.query(
        `SELECT conrelid::regclass::text AS from_table, confrelid::regclass::text AS to_table
           FROM pg_constraint
          WHERE contype = 'f'
            AND (conrelid::regclass::text = ANY($1) OR confrelid::regclass::text = ANY($1))`,
        [SYNC_TABLES],
      );
      expect(result.rows).toEqual([]);
    }
  });

  it("keeps the foreign key on store_service_instances, which this harness does not use", async () => {
    const result = await pair().store.pool.query(
      `SELECT confrelid::regclass::text AS to_table FROM pg_constraint
        WHERE contype = 'f' AND conrelid = 'integration.store_service_instances'::regclass`,
    );
    expect(result.rows.length).toBeGreaterThan(0);
  });
});

describe("the frozen constraints the harness relies on, and the gaps it works around", () => {
  it("makes inbox receipts unique on (tenant_id, peer_id, message_id)", async () => {
    const defs = await indexDefinitions("integration.inbox_receipts");
    expect(
      defs.some(
        (def) => def.includes("UNIQUE") && def.includes("(tenant_id, peer_id, message_id)"),
      ),
    ).toBe(true);
  });

  it("makes outbox events unique on (tenant_id, event_id)", async () => {
    const defs = await indexDefinitions("integration.outbox_messages");
    expect(
      defs.some((def) => def.includes("UNIQUE") && def.includes("(tenant_id, event_id)")),
    ).toBe(true);
  });

  it("has NO unique key on sync checkpoints over tenant, peer and stream (the checkpoint gap)", async () => {
    const defs = await indexDefinitions("integration.sync_checkpoints");
    expect(defs.some((def) => def.includes("stream_code"))).toBe(false);
  });

  it("has NO unique key on dead letters over the source message (the dead-letter gap)", async () => {
    const defs = await indexDefinitions("integration.dead_letters");
    expect(defs.some((def) => def.includes("UNIQUE") && def.includes("source_message_id"))).toBe(
      false,
    );
  });

  it("has exactly one updated_at column on sync checkpoints (the baseline carries the CR-DB-004 fix)", async () => {
    const result = await pair().store.pool.query<{ n: string }>(
      `SELECT count(*) AS n FROM information_schema.columns
        WHERE table_schema = 'integration' AND table_name = 'sync_checkpoints' AND column_name = 'updated_at'`,
    );
    expect(Number(result.rows[0]?.n)).toBe(1);
  });

  it("has no outbox column that could carry a terminal or dead-letter state", async () => {
    const result = await pair().store.pool.query<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'integration' AND table_name = 'outbox_messages' ORDER BY ordinal_position`,
    );
    expect(result.rows.map((row) => row.column_name)).toEqual([
      "outbox_message_id",
      "tenant_id",
      "event_id",
      "producer_context",
      "aggregate_type",
      "aggregate_id",
      "event_type",
      "event_version",
      "posting_envelope_id",
      "correlation_id",
      "causation_id",
      "payload",
      "created_at",
      "available_at",
      "claim_owner",
      "claim_expires_at",
      "published_at",
      "attempt_count",
      "last_error",
    ]);
  });
});

describe("the experiment stays out of production schema", () => {
  it("creates the test-only schema only in the isolated test databases", async () => {
    for (const { pool } of [pair().store, pair().cloud]) {
      const result = await pool.query(
        `SELECT 1 FROM information_schema.schemata WHERE schema_name = $1`,
        [TEST_ONLY_SCHEMA],
      );
      expect(result.rowCount).toBe(1);
    }
  });

  it("records only the frozen baseline in the migration ledger", async () => {
    for (const { pool } of [pair().store, pair().cloud]) {
      const result = await pool.query<{ migration_id: string }>(
        "SELECT migration_id FROM integration.schema_migrations ORDER BY migration_id",
      );
      expect(result.rows.map((row) => row.migration_id)).toEqual(["0001_v1_2_frozen_baseline"]);
    }
  });

  it("keeps the Store-only and Cloud-only test tables apart", async () => {
    const store = await pair().store.pool.query<{ table_name: string }>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name",
      [TEST_ONLY_SCHEMA],
    );
    const cloud = await pair().cloud.pool.query<{ table_name: string }>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name",
      [TEST_ONLY_SCHEMA],
    );
    expect(store.rows.map((row) => row.table_name)).toEqual([
      "envelope_side",
      "store_facts",
      "store_terminal",
    ]);
    expect(cloud.rows.map((row) => row.table_name)).toEqual(["cloud_effects", "cloud_quarantine"]);
  });
});
