# MiniMart database migrations

Migrations are applied in manifest order by `@minimart/database`. The runner
holds the global session advisory lock for the complete run, records immutable
SHA-256 checksums over the exact committed SQL bytes, and executes every
transaction-safe migration in a PostgreSQL transaction.

`integration.schema_migrations` is bootstrapped by the runner. It is not
defined by a migration and is not one of the 79 frozen logical MiniMart tables.

The baseline is the effective Database Model v1.2 executable authority: the
frozen reference DDL with CR-DB-002 and CR-DB-003 applied and its outer `BEGIN`
and `COMMIT` removed because the runner owns that transaction. Do not edit an
applied migration; add a forward migration instead.
