# MiniMart --- Agent Operating Rules

Read `SPECIFICATION-INDEX.md` before implementation.

## Frozen authority

The frozen specifications in `docs/specifications/` are authoritative.
Do not silently redesign or weaken them.

## Architecture guardrails

-   Offline-first: local store work does not wait for cloud.
-   `apps/store-node` and `apps/cloud` are thin launchers over shared
    service runtime.
-   Frozen monorepo names/structure in Architecture v1.0 take precedence
    over convenience renaming.
-   POS terminal: Tauri + React + TypeScript.
-   Store Node: Node.js + TypeScript modular monolith, Windows service.
-   Store DB: PostgreSQL.
-   Hardware integration: Tauri/Rust ports.
-   No microservices initially.
-   Country packs; no country forks.
-   Module owns internal tables/repositories/private SQL; no
    cross-module private access.

## Domain/data guardrails

-   Posted financial documents are immutable.
-   Inventory effects use the immutable stock ledger.
-   Posting envelopes commit local effects + audit + outbox atomically.
-   External provider money is outside the local PostgreSQL transaction.
-   No JavaScript binary float for money.
-   Preserve exact decimal-string API boundaries.
-   UUIDv7-compatible stable identifiers.
-   Retry/recovery preserves idempotency identity.
-   PENDING/UNCERTAIN payment/refund states must remain explicit.

## Agent behavior

Before coding: 1. identify the exact frozen contracts involved; 2. state
files/modules to change; 3. implement only the approved issue; 4. add
tests without weakening existing tests; 5. run
formatter/typecheck/tests; 6. summarize changes and unresolved
questions.

If specifications conflict, stop and identify the exact files/IDs. Do
not invent a resolution.
