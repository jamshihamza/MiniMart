# ADR 0003: `org.tenants` duplicate UNIQUE DDL erratum

- Status: Accepted
- Decision: CR-DB-002
- Scope: MM-004 executable Database Model v1.2 authority

## Context

The frozen v1.2 reference DDL contains this invalid constraint in
`org.tenants`:

```sql
UNIQUE (tenant_id, tenant_id)
```

PostgreSQL rejects a column appearing twice in a unique constraint. The same
table already declares `tenant_id uuid PRIMARY KEY`.

## Decision

For executable MM-004 migrations and schema-equivalence validation, the
effective authority is `REFERENCE-DDL-v1.2-FROZEN.sql + CR-DB-002`.

The exact duplicate-column UNIQUE statement is removed from `org.tenants`,
including the now-unneeded delimiter on the preceding column definition.
`tenant_id` remains the primary key. No replacement `UNIQUE (tenant_id)` or
other UNIQUE constraint is added.

The authority test fixture applies this correction as a deterministic,
fail-loud overlay. It requires exactly one occurrence of the invalid statement
and the expected surrounding `org.tenants` definition. It is not a general SQL
repair facility.

## Consequences

The logical table count remains unchanged. This erratum authorizes no
business, domain, or persistence semantic change: primary-key semantics already
provide uniqueness and NOT NULL for `tenant_id`. The frozen source artifact
itself remains byte-for-byte unchanged.
