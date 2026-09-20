# MiniMart --- Agent Operating Rules

## Authority order

Read `SPECIFICATION-INDEX.md` before implementation. Frozen
specifications are authoritative.

## Architecture guardrails

-   MiniMart is offline-first. Store operation must not wait for cloud.
-   POS: Tauri + React + TypeScript.
-   Store Node: Node.js + TypeScript modular monolith running as a
    Windows service.
-   Store database: PostgreSQL.
-   Cloud uses the same modular-monolith service code in cloud mode with
    managed PostgreSQL.
-   Hardware integration belongs behind Tauri/Rust ports.
-   No microservices initially.
-   Country packs; never create country forks.
-   Each business module owns its internal tables, repositories and
    private SQL.
-   No cross-module private table/repository access.
-   Cross-module behavior uses public ports/contracts/coordinators.

## Transaction/domain guardrails

-   Posted financial documents are immutable; correct by domain-approved
    reversal/return/refund/adjustment.
-   Inventory changes flow through the immutable stock ledger.
-   Important posting envelopes commit all local effects atomically,
    including audit and outbox.
-   External provider money is not part of the local PostgreSQL
    transaction.
-   Never use JavaScript binary floating point for money.
-   Preserve exact decimal-string API boundaries.
-   Use UUIDv7-compatible stable identifiers.
-   Outbox records are written in the same transaction as business
    effects.
-   Retry/recovery must preserve idempotency identity.
-   Payment/refund UNCERTAIN is a real state; never guess
    success/failure.

## Security

-   Server/session resolves trusted BusinessContext.
-   UI role labels are personas, not authorization grants.
-   Server permission checks remain authoritative.
-   Manager overrides are explicit and audited.
-   Never store secrets in source control.
-   Do not store PAN/card data.

## AI behavior

Before coding: 1. read the relevant frozen specification; 2. identify
exact UI/API/domain/DB contracts; 3. state the files/modules to change;
4. implement only the requested issue; 5. add tests without weakening
existing tests; 6. run formatter, typecheck and tests; 7. summarize
changes and unresolved questions.

If accounting, inventory, tax, compliance, payments, sync, money
representation, transaction boundaries or security is ambiguous, stop
and raise the ambiguity. Do not invent a rule.

Do not change a frozen architecture/API/UI/domain/database semantic
decision without controlled change review/ADR.
