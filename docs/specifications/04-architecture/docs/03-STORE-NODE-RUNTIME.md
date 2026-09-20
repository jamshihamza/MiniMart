# Shared Service Runtime and Store Node Runtime --- v0.3

MiniMart uses **one shared Node.js + TypeScript service
runtime/composition framework** for edge and cloud modes.

`apps/store-node` and `apps/cloud` are thin deployment launchers. They
select mode-specific capabilities; they do not fork or duplicate
business/runtime implementations.

## Runtime modes

### `edge`

Registers: - Store API transport; - Store trust/session and
BusinessContext resolution; - all Store business modules; - all 13 Store
Posting coordinators; - local PostgreSQL repositories; - Outbox/Inbox
and store workers; - Store diagnostics/health.

### `cloud`

Registers: - cloud API/management transport; - sync ingest and
cloud-owned handlers; - projections/aggregation; - cloud-owned
configuration/distribution capabilities; - managed PostgreSQL
repositories; - cloud workers.

It **does not register** Store checkout/posting handlers or the 13 Store
Posting coordinators as Store transaction authority.

## Store Node startup

1.  Load machine technical configuration.
2.  Load secrets/credential material from OS-protected storage.
3.  Validate enrolled Store Node identity.
4.  Connect to PostgreSQL.
5.  Compare build ↔ schema compatibility range.
6.  Run only an approved compatible migration path under the global
    migration lock.
7.  Initialize the shared service runtime in `edge` mode.
8.  Register edge capability set and module composition.
9.  Initialize trust/session services.
10. Start Store API in non-write mode.
11. Start background workers only after dependency gates pass.
12. Mark transactional readiness only after DB/schema/module
    compatibility is valid.

## Readiness dimensions

-   process liveness;
-   transactional readiness;
-   sync readiness/health;
-   optional hardware/client capability health.

Cloud failure never makes local transactional readiness false.

## Anti-fork rule

Edge/cloud differences are expressed through capability registration,
configuration and adapters. Duplicating a business service into separate
edge and cloud implementations requires an ADR and must preserve the
frozen authority model.
