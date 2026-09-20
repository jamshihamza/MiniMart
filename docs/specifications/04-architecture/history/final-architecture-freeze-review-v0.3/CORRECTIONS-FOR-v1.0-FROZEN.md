# Corrections to Apply When Producing Architecture v1.0 FROZEN

These corrections are documentation carry-forward only. The reviewed
v0.3 candidate remains unchanged.

## C-001 --- Deployment placement

Add to the deployment/topology section:

> One-counter deployment may colocate POS, Store Node and PostgreSQL on
> the same Windows PC. Multi-counter deployment uses one designated
> Store Node/database host with counters connecting over LAN. This
> changes placement, not domain behavior.

## C-002 --- AI/release-quality governance

Add an implementation-governance section requiring: - a short
specification and acceptance criteria before AI-agent implementation of
a module/feature; - AI coding agents must not delete, weaken or bypass
protected tests merely to make code pass; - production database
migrations are human-reviewed and automatically verified; - material
architecture changes require ADR review; - CI blocks failures in
protected domain/ledger tests, API/module contract tests and
sync-simulation tests.

## C-003 --- Phase-0 exact traceability

Extend the Phase-0 spike document so: - the sync spike records
sync-engine evaluation evidence and confirms/changes the custom
outbox/change-feed choice only through ADR if needed; - the
target-printer raster receipt test explicitly includes Malayalam and
Malay when those scripts are in the pilot deployment scope.

No current legal/tax value is introduced by these corrections.
