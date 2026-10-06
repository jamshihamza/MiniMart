/**
 * MM-010 TEST-ONLY storage. These tables exist only in isolated test databases, created by the
 * harness after the frozen baseline migration has run. They are not part of `database/migrations`,
 * not part of the frozen v1.2 baseline, and not a proposal for production schema. Deduplication keys
 * include the tenant and the remote peer; they do not assume message ids are globally unique.
 */
import type { Pool } from "pg";

export const TEST_ONLY_SCHEMA = "spike_mm010";

/** Store side: a synthetic fact, envelope fields the production outbox lacks, and terminal state. */
export const STORE_TEST_ONLY_DDL = `
CREATE SCHEMA ${TEST_ONLY_SCHEMA};

CREATE TABLE ${TEST_ONLY_SCHEMA}.store_facts (
  fact_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  business_day_id uuid NOT NULL,
  payload jsonb NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ${TEST_ONLY_SCHEMA}.envelope_side (
  tenant_id uuid NOT NULL,
  outbox_message_id uuid NOT NULL,
  store_id uuid,
  source_identity text NOT NULL,
  occurred_at timestamptz NOT NULL,
  contract_version text NOT NULL,
  PRIMARY KEY (tenant_id, outbox_message_id)
);

CREATE TABLE ${TEST_ONLY_SCHEMA}.store_terminal (
  tenant_id uuid NOT NULL,
  peer_id uuid NOT NULL,
  outbox_message_id uuid NOT NULL,
  state text NOT NULL,
  reason text NOT NULL,
  recorded_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, peer_id, outbox_message_id)
);
`;

/** Cloud side: the synthetic business effect and the quarantine record. */
export const CLOUD_TEST_ONLY_DDL = `
CREATE SCHEMA ${TEST_ONLY_SCHEMA};

CREATE TABLE ${TEST_ONLY_SCHEMA}.cloud_effects (
  tenant_id uuid NOT NULL,
  peer_id uuid NOT NULL,
  message_id uuid NOT NULL,
  business_day_id uuid NOT NULL,
  status text NOT NULL,
  business_date date NOT NULL,
  source_version integer NOT NULL,
  applied_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, peer_id, message_id)
);

CREATE TABLE ${TEST_ONLY_SCHEMA}.cloud_quarantine (
  tenant_id uuid NOT NULL,
  peer_id uuid NOT NULL,
  message_id uuid NOT NULL,
  problem_code text NOT NULL,
  reason text NOT NULL,
  payload_hash text NOT NULL,
  recorded_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, peer_id, message_id)
);
`;

export async function applyStoreTestOnlySchema(pool: Pool): Promise<void> {
  await pool.query(STORE_TEST_ONLY_DDL);
}

export async function applyCloudTestOnlySchema(pool: Pool): Promise<void> {
  await pool.query(CLOUD_TEST_ONLY_DDL);
}
