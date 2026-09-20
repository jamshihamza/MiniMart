# Architecture Decisions v1.0 --- FROZEN

  -------------------------------------------------------------------------
  ID                               Decision
  -------------------------------- ----------------------------------------
  ARCH-001                         Store Node is local transactional
                                   authority and Windows Service.

  ARCH-002                         Node.js + TypeScript modular monolith is
                                   the shared Store/Cloud service runtime.

  ARCH-003                         Tauri + React + TypeScript is used for
                                   POS/Back Office; Vite + Tailwind are the
                                   approved client build/UI baseline.

  ARCH-004                         PostgreSQL is Store Node transactional
                                   database; Cloud uses managed PostgreSQL.

  ARCH-005                         Application coordinators compose
                                   cross-context Posting Envelopes.

  ARCH-006                         One opaque UnitOfWorkSession owns one
                                   local Posting Envelope commit.

  ARCH-007                         Module persistence is private; **no
                                   module or query/reporting layer reads or
                                   writes another business module's
                                   internal tables**.

  ARCH-008                         Outbox/inbox is the asynchronous
                                   Store/Cloud integration boundary.

  ARCH-009                         Country packs implement versioned policy
                                   ports without source forks.

  ARCH-010                         Hardware/provider systems use
                                   anti-corruption adapters.

  ARCH-011                         Counter hardware is isolated through
                                   Tauri/Rust ports where practical.

  ARCH-012                         Correlation/causation/posting-envelope
                                   identity propagates through
                                   observability.

  ARCH-013                         API routes remain for API Contracts;
                                   architecture freezes behavior
                                   boundaries.

  ARCH-014                         SQLite survival mode remains a later
                                   explicit extension.

  ARCH-015                         Initial MiniMart remains a modular
                                   monolith, not microservices.

  ARCH-016                         Integrated provider calls use durable
                                   attempt/execution identity and occur
                                   outside DB transactions.

  ARCH-017                         Provider timeout/lost response is
                                   UNCERTAIN until reconciled; it is not
                                   assumed failed.

  ARCH-018                         Module repository sessions are
                                   transaction-bound capabilities with no
                                   independent commit.

  ARCH-019                         Store/Counter identity is derived from
                                   enrolled device trust, not request-body
                                   identity.

  ARCH-020                         BusinessContext is resolved server-side
                                   by owning modules and is immutable per
                                   command.

  ARCH-021                         Sync message types declare
                                   ownership/apply mode; generic
                                   last-write-wins is forbidden.

  ARCH-022                         Store transactional facts are not
                                   remotely rewritten by cloud sync.

  ARCH-023                         Component compatibility ranges gate
                                   write readiness and rolling upgrades.

  ARCH-024                         Cross-module reporting/search composes
                                   public module query ports or approved
                                   reporting-owned projections; private
                                   module-schema reads are forbidden.

  ARCH-025                         Background workers are lease/idempotency
                                   safe and assume at-least-once execution.

  ARCH-026                         Posting DB transactions use bounded
                                   deadlines/timeouts and classified
                                   retries.

  ARCH-027                         Audit evidence and operational telemetry
                                   are separate architectural channels.

  ARCH-028                         Hardware commands expose explicit
                                   outcome/error/capability lifecycle.

  ARCH-029                         Configuration keys have declared
                                   owner/scope; no unrestricted
                                   last-value-wins merge.

  ARCH-030                         Support uses an allow-listed
                                   SupportGateway; no arbitrary shell/SQL
                                   by default.

  ARCH-031                         Cloud mode does not register Store
                                   Posting coordinators.

  ARCH-032                         Reconciliation is module-owned; repair
                                   rebuilds maintained state from immutable
                                   evidence under maintenance
                                   authorization.

  ARCH-033                         Package metadata and CI dependency graph
                                   enforce module/layer boundaries.

  ARCH-034                         The approved technology baseline is
                                   PostgreSQL, managed PostgreSQL,
                                   Node.js+TypeScript, Kysely-or-Drizzle,
                                   pg-boss, Tauri+React+Vite+Tailwind,
                                   TanStack Query+Zustand, AG Grid
                                   Community, TanStack Table,
                                   client-generated UUIDv7, OpenAPI+Zod and
                                   custom outbox/change-feed sync.

  ARCH-035                         Edge and Cloud use one shared service
                                   runtime/composition framework;
                                   deployment launchers select
                                   mode/capabilities and do not fork
                                   business/runtime implementations.

  ARCH-036                         Security implementation baseline
                                   includes Argon2 credential hashing,
                                   BitLocker store-machine encryption, OS
                                   secret storage, parameterized SQL,
                                   dependency scanning and signed
                                   installers/updates.

  ARCH-037                         Phase-0 architecture validation spikes
                                   gate feature-heavy implementation for
                                   Windows packaging/rollback,
                                   hardware/non-Latin receipts and minimal
                                   real sync.
  -------------------------------------------------------------------------
