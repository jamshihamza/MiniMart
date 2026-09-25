# ADR 0005: Sync-checkpoints duplicate `updated_at` DDL erratum

- Status: Accepted
- Decision: CR-DB-004
- Scope: MM-004 executable Database Model v1.2 authority

## Context

The frozen v1.2 reference DDL declares `updated_at` twice in
`integration.sync_checkpoints`: first as `updated_at timestamptz NOT NULL` and
later as `updated_at timestamptz`. PostgreSQL rejects the table with SQLSTATE
`42701`, `column "updated_at" specified more than once`.

## Decision

Effective executable authority combines `REFERENCE-DDL-v1.2-FROZEN.sql`,
CR-DB-002, CR-DB-003, and CR-DB-004. CR-DB-004 preserves the first, non-null
declaration and removes only the second nullable duplicate. The overlay targets
the exact `integration.sync_checkpoints` definition, requires exactly one
occurrence, and fails loudly if its expected structure has drifted.

The frozen v1.2 source file remains byte-for-byte unchanged. This ADR does not
amend that source file.

## Consequences

The logical table count is unchanged. No domain or persistence semantics,
column ordering, key, constraint, default, or other nullability rule changes.
Regression coverage must verify the resulting PostgreSQL table has all eight
expected columns and exactly one `updated_at` column of type `timestamptz` with
`NOT NULL` enforced. Overlay tests must also cover absent and duplicated source
patterns. The first-new-defect rule remains in force.
