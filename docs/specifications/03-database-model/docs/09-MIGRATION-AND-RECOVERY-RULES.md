# Migration Compatibility and Recovery Contract --- v1.2 Amendment Candidate

## Migration ledger

`integration.schema_migrations` records migration ID, module, checksum,
started/completed timestamps, application build compatibility and
outcome.

## Global migration lock

Store Node obtains one PostgreSQL advisory migration lock before schema
change. Only one migrator may run.

## Dependency order

`org → iam/catalog/country → pricing/procurement/inventory/customer/cash/accounting → sales/payments/returns → audit/integration`

A module migration may create references only to already-compatible
stable structures.

## Transactional rule

Use one transaction for DDL that PostgreSQL safely supports
transactionally. Operations requiring non-transactional execution (for
example selected concurrent index operations) are explicit staged
migrations with resumable checkpoints.

## Expand/contract

1.  expand compatible structure;
2.  deploy code supporting old/new representation if required;
3.  backfill in bounded/resumable batches;
4.  reconcile;
5.  switch reads/writes;
6.  contract only in later release.

## Startup compatibility

Each Store Node build declares minimum/maximum compatible schema
version. If schema is outside the safe range, write mode does not start.

## Interrupted migration

On restart: - inspect migration ledger/checksum; - rollback if
transaction never committed; - resume only explicitly resumable staged
steps; - otherwise restore/recover using documented procedure.

## Risky migration gate

Before destructive/high-volume transformation: - verified backup/restore
point; - rehearsal on representative data; - estimated lock/rewrite
duration; - rollback/recovery procedure; - post-migration ledger/balance
reconciliation.

Historical tax/cost/rounding is never recalculated from current policy
during migration.
