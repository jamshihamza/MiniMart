# ADR 0002: Schema migration ledger technical exclusion

- Status: Accepted
- Decision: CR-DB-001
- Scope: MM-004 database foundation

## Context

The frozen Migration & Recovery Contract explicitly names
`integration.schema_migrations`, while the frozen Database Model v1.2 defines
15 schemas and 79 logical MiniMart tables without listing a migration ledger.

## Decision

The migration harness owns `integration.schema_migrations` as an additional
technical physical table. The runner may create the `integration` schema and
ledger before applying the baseline. The baseline migration must not define
the ledger. No alternative migration-ledger schema or table is permitted.

Schema-equivalence testing compares the untouched frozen reference DDL with a
database built by the migration runner. The exact and only table-level
exclusion is `integration.schema_migrations`; the `integration` schema and all
six frozen logical tables in that schema remain in scope.

Migration SQL checksums are SHA-256 digests of the exact committed file bytes.
The runner holds a dedicated PostgreSQL connection and acquires a session-level
advisory lock for the whole migration run. The signed 64-bit lock identifier is
the first eight bytes, interpreted as a big-endian signed integer, of
`SHA-256("minimart:global-schema-migration-lock:v1")`:
`0xa54a342c5de072c9`, or `-6536354544016657719`.

Transaction-safe DDL runs in a PostgreSQL transaction. If it fails, that
transaction is rolled back before failure is recorded separately. An
incomplete `STARTED` record blocks write readiness and automatic migration;
automatic resume is allowed only when the manifest explicitly marks the
migration resumable.

## Consequences

The frozen 15-schema, 79-table model and its reference DDL remain unchanged.
The ledger is visible as an additional physical implementation object and is
excluded by exact identity only during equivalence comparison.
