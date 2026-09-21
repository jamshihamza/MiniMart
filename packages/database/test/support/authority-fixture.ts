import { readFile } from "node:fs/promises";

export const CR_DB_002_INVALID_STATEMENT = "UNIQUE (tenant_id, tenant_id)";
export const CR_DB_003_INLINE_FOREIGN_KEY =
  "FOREIGN KEY (tenant_id, refund_obligation_id) REFERENCES returns.refund_obligations(tenant_id, refund_obligation_id),";

const EXPECTED_ORG_TENANTS_DEFINITION = `CREATE TABLE org.tenants (
tenant_id uuid PRIMARY KEY,
name text NOT NULL,
status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, tenant_id)
);`;

const CORRECTED_ORG_TENANTS_DEFINITION = `CREATE TABLE org.tenants (
tenant_id uuid PRIMARY KEY,
name text NOT NULL,
status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
version bigint NOT NULL DEFAULT 0
);`;

const EXPECTED_REFUND_EXECUTIONS_DEFINITION = `CREATE TABLE payments.refund_executions (
refund_execution_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
refund_obligation_id uuid NOT NULL, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL, amount numeric(24,8) NOT NULL, settlement_source_key text NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, refund_obligation_id) REFERENCES returns.refund_obligations(tenant_id, refund_obligation_id),
UNIQUE (tenant_id, refund_execution_id),
UNIQUE (tenant_id, settlement_source_key)
);`;

const CORRECTED_REFUND_EXECUTIONS_DEFINITION = `CREATE TABLE payments.refund_executions (
refund_execution_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
refund_obligation_id uuid NOT NULL, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL, amount numeric(24,8) NOT NULL, settlement_source_key text NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, refund_execution_id),
UNIQUE (tenant_id, settlement_source_key)
);`;

const EXPECTED_REFUND_OBLIGATIONS_DEFINITION = `CREATE TABLE returns.refund_obligations (
refund_obligation_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, sales_return_id uuid NOT NULL,
status varchar(40) NOT NULL, obligation_amount numeric(24,8) NOT NULL CHECK(obligation_amount>=0),
settled_amount numeric(24,8) NOT NULL DEFAULT 0 CHECK(settled_amount>=0),
currency_code varchar(3) NOT NULL, requested_method_code varchar(40), created_at timestamptz NOT NULL,
settled_at timestamptz, version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, sales_return_id) REFERENCES returns.sales_returns(tenant_id, sales_return_id),
UNIQUE (tenant_id, refund_obligation_id), CHECK(settled_amount<=obligation_amount)
);`;

const DEFERRED_REFUND_OBLIGATION_FOREIGN_KEY = `ALTER TABLE payments.refund_executions
ADD FOREIGN KEY (tenant_id, refund_obligation_id)
REFERENCES returns.refund_obligations(tenant_id, refund_obligation_id);`;

export function applyCrDb002(frozenDdl: string): string {
  const occurrenceCount = frozenDdl.split(CR_DB_002_INVALID_STATEMENT).length - 1;
  if (occurrenceCount !== 1) {
    throw new Error(
      `CR-DB-002 expected exactly one invalid org.tenants UNIQUE statement; found ${occurrenceCount}`,
    );
  }
  if (!frozenDdl.includes(EXPECTED_ORG_TENANTS_DEFINITION)) {
    throw new Error("CR-DB-002 org.tenants structure does not match the approved correction");
  }
  const effectiveDdl = frozenDdl.replace(
    EXPECTED_ORG_TENANTS_DEFINITION,
    CORRECTED_ORG_TENANTS_DEFINITION,
  );
  if (effectiveDdl.includes(CR_DB_002_INVALID_STATEMENT)) {
    throw new Error("CR-DB-002 failed to remove the approved invalid statement");
  }
  return effectiveDdl;
}

export function applyCrDb003(crDb002Ddl: string): string {
  const foreignKeyCount = crDb002Ddl.split(CR_DB_003_INLINE_FOREIGN_KEY).length - 1;
  if (foreignKeyCount !== 1) {
    throw new Error(
      `CR-DB-003 expected exactly one inline refund-obligation foreign key; found ${foreignKeyCount}`,
    );
  }
  const sourceCount = crDb002Ddl.split(EXPECTED_REFUND_EXECUTIONS_DEFINITION).length - 1;
  if (sourceCount !== 1) {
    throw new Error(
      `CR-DB-003 expected exactly one approved payments.refund_executions definition; found ${sourceCount}`,
    );
  }
  const targetCount = crDb002Ddl.split(EXPECTED_REFUND_OBLIGATIONS_DEFINITION).length - 1;
  if (targetCount !== 1) {
    throw new Error(
      `CR-DB-003 expected exactly one approved returns.refund_obligations definition; found ${targetCount}`,
    );
  }
  const withoutInlineForeignKey = crDb002Ddl.replace(
    EXPECTED_REFUND_EXECUTIONS_DEFINITION,
    CORRECTED_REFUND_EXECUTIONS_DEFINITION,
  );
  return withoutInlineForeignKey.replace(
    EXPECTED_REFUND_OBLIGATIONS_DEFINITION,
    `${EXPECTED_REFUND_OBLIGATIONS_DEFINITION}\n\n${DEFERRED_REFUND_OBLIGATION_FOREIGN_KEY}`,
  );
}

export async function effectiveAuthorityDdl(): Promise<string> {
  const frozenDdl = await readFile(
    new URL(
      "../../../../docs/specifications/03-database-model/schema/REFERENCE-DDL-v1.2-FROZEN.sql",
      import.meta.url,
    ),
    "utf8",
  );
  return applyCrDb003(applyCrDb002(frozenDdl));
}
