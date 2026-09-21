# MM-004 database foundation

MM-004 establishes the PostgreSQL connection runtime and migration harness. It
does not add business repositories, HTTP endpoints, job queues, or business
persistence behavior.

## Runtime

`@minimart/database` owns the `pg` pool and exposes a Kysely runtime over that
pool. Configuration is environment-derived and validates pool, connection,
idle, and statement timeout values. Health is a bounded database query;
readiness additionally requires a complete, checksum-valid, build-compatible
migration history and the expected frozen logical table set.

## Migration lifecycle

The runner discovers migrations from `database/migrations/manifest.json` and
checksums the exact SQL bytes with SHA-256. A dedicated pool connection holds
the global session advisory lock identified in ADR 0002. The harness creates
`integration.schema_migrations`, records `STARTED`, executes transaction-safe
DDL inside `BEGIN`/`COMMIT`, then records `COMPLETED`. On DDL failure it first
rolls back, then records `FAILED` outside the failed transaction.

An existing checksum mismatch, failed migration, or non-resumable incomplete
`STARTED` migration stops the run. MM-004 defines no resumable migration and no
non-transactional/staged execution path. Recovery must classify the state and
use a forward fix; applied migration bytes are immutable.

## Baseline and equivalence

`0001_v1_2_frozen_baseline.sql` is the effective executable authority: the
frozen reference DDL with the narrowly validated CR-DB-002 and CR-DB-003
errata applied and the outer transaction statements omitted because the runner
owns the transaction. The equivalence integration test creates two isolated
databases: one applies the frozen reference file through the exact controlled
overlays and the other runs the migration harness. It compares normalized
schemas, tables, columns, constraint semantics, indexes, functions, and
triggers.

The exact and only table-level exclusion is
`integration.schema_migrations`. The `integration` schema and all six frozen
logical integration tables remain compared. A successful baseline yields 15
frozen schemas and 79 logical MiniMart tables, plus the technical ledger.

## Test database

Tests use `MINIMART_TEST_POSTGRES_URL` as an administrative PostgreSQL URL when
provided. Otherwise they start an isolated PostgreSQL 17 Testcontainers
instance. Every test creates uniquely named databases and drops them after
use. The CI job supplies PostgreSQL 17 as a service.
