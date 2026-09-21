# ADR 0004: Refund-obligation FK DDL-order erratum

- Status: Accepted
- Decision: CR-DB-003
- Scope: MM-004 executable Database Model v1.2 authority

## Context

The frozen DDL creates `payments.refund_executions` before it creates the
referenced `returns.refund_obligations` table. PostgreSQL therefore cannot
execute the valid inline foreign-key declaration in its frozen physical order.

## Decision

For the effective executable authority, remove only the exact inline foreign
key from `payments.refund_executions` and emit that same relationship with an
`ALTER TABLE` immediately after `returns.refund_obligations` is created.

The source table remains `payments.refund_executions`; the source columns
remain `(tenant_id, refund_obligation_id)`. The referenced table remains
`returns.refund_obligations`; the referenced columns remain
`(tenant_id, refund_obligation_id)`. No `DEFERRABLE` behavior or other semantic
change is introduced.

The authority fixture applies CR-DB-003 through an exact, fail-loud transform
after CR-DB-002. It verifies the complete expected source and target fragments
and refuses absent, duplicated, or structurally changed input. It is not a
general dependency sorter or SQL repair mechanism.

## Consequences

Tenant-safe cross-schema referential integrity is preserved. Only physical DDL
creation order changes. The frozen logical table count remains unchanged, and
no domain or persistence semantic change is authorized. The frozen source
artifact remains unchanged.
