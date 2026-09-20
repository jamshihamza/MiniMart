# MiniMart Architecture v1.0 --- FROZEN

## 1. Objective

This refinement converts the frozen MiniMart business/domain/database
model into an implementation-ready architecture while preserving all
upstream ownership, lifecycle, atomicity, costing, history and
Decision-seam invariants.

v0.3 additionally closes all six findings from the independent Final
Architecture Freeze Review of v0.2.

## 2. Deployment topology

``` mermaid
flowchart TB
  subgraph STORE["Store"]
    POS1["POS Terminal 1
Tauri + React"]
    POSN["POS Terminal N
Tauri + React"]
    BO["Back Office
Tauri + React"]
    SN["Store Node
Windows Service
Node.js + TypeScript"]
    PG[("Store PostgreSQL")]
    HW["Tauri/Rust Hardware Adapters"]
    POS1 -->|"Authenticated Store API
secured transport"| SN
    POSN -->|"Authenticated Store API
secured transport"| SN
    BO -->|"Authenticated Store API
secured transport"| SN
    SN --> PG
    POS1 --> HW
    POSN --> HW
  end
  CLOUD["MiniMart Cloud Mode
same Node.js + TypeScript service runtime"]
  CPG[("Managed PostgreSQL")]
  SN <-->|"Versioned async sync"| CLOUD
  CLOUD --> CPG
```

The exact LAN certificate/discovery profile belongs to the
API/deployment contract. Architecture requires authenticated encrypted
transport and enrolled counter identity.

## 3. Runtime composition

One shared Node.js + TypeScript service runtime/composition framework
starts in `edge` or `cloud` mode. Thin launchers select capabilities.

`Transport → Trust/BusinessContext Resolution → Application → Coordinators → Module Public Ports → Module-private Repositories → PostgreSQL`

Cloud mode does not register Store Posting coordinators.

## 4. Module persistence boundary

Each module owns its persistence. **No module, query layer or reporting
component reads another business module's internal tables.**

Cross-module commands use approved application coordinators and public
ports. Cross-module reads compose public query ports or later use
dedicated reporting projections that own their own approved persistence.

## 5. Transaction composition

A Posting Envelope receives one opaque transaction-scoped
`UnitOfWorkSession`. Module application services obtain only their own
transaction-bound repository capability. No repository exposes
independent commit/rollback, pool access or arbitrary cross-module SQL.

Audit, Outbox and idempotency completion join the same local transaction
where required by the frozen Database Model.

## 6. External providers

Provider calls never run inside the Posting Envelope transaction.
Integrated money flows use durable attempt/execution identity before the
call, provider request/idempotency identity, explicit
SUCCESS/FAILED/UNCERTAIN outcomes, reconciliation after lost responses
and a later local settlement/posting transaction.

## 7. Store trust and security

Tenant/Store/Counter are derived from authenticated enrolled-device
context. User identity/permissions come from the Store Node session.
BusinessDate and CountryRuleSetVersion are resolved server-side through
owning modules.

The approved implementation baseline includes Argon2 credential hashing,
BitLocker store-machine disk encryption, OS-protected secret storage,
parameterized SQL, dependency scanning, signed installers/updates and no
PAN storage.

## 8. Sync

Store-origin transactional facts are append/project-only in cloud.
Cloud/configuration messages apply only through declared ownership and
module application handlers. No generic last-write-wins is permitted.
Inbox dedup and incoming effect commit atomically.

The protocol is the custom Outbox + Inbox/change-feed design.

## 9. Technology baseline

The implementation baseline is frozen in
`docs/32-TECHNOLOGY-BASELINE.md`: PostgreSQL, managed PostgreSQL,
Node.js + TypeScript modular monolith, Kysely or Drizzle, pg-boss,
Tauri + React + Vite + Tailwind, TanStack Query + Zustand, AG Grid
Community, TanStack Table, client-generated UUIDv7, OpenAPI + Zod and
custom outbox/change-feed sync.

## 10. Query model

Command/invariant paths use module public ports. Cross-module
reporting/search composes public query ports.

A persistent reporting projection may be introduced only through
Database Model change control and must own its own tables, be
rebuildable/idempotent and consume public events/contracts. Direct reads
of another business module's internal schema are forbidden.

## 11. Compatibility and Store versus Cloud

Desktop client, Store Node API, database schema, sync protocol,
country-pack contract and hardware-port contract expose compatible
version ranges. Write readiness is denied when required compatibility is
absent.

Cloud mode omits Store checkout/posting handlers and Store Posting
coordinators.

## 12. Phase-0 architecture risk gate

Before feature-heavy Phase 1 coding, the project must complete: -
Windows installer/Store Node service/PostgreSQL upgrade+rollback
spike; - scanner/printer hardware spike; - non-Latin raster receipt test
on the target printer; - minimal Store Node → Outbox → Cloud →
Inbox/Dedup → ACK sync proof.

## 13. Decision seams

The exact 60 frozen Decision IDs are mapped in
`traceability/DECISION-SEAM-ARCHITECTURE-MATRIX.md`. Architecture
provides extension points but does not convert
OPEN/VERIFY/PROPOSED/DEFERRED decisions into hidden defaults.

## 14. Freeze-candidate conclusion

v0.3 remediates the complete deep architecture review and the six
findings from the v0.2 Final Architecture Freeze Review. It is eligible
for a new independent Final Architecture Freeze Review. It is not
Architecture v1.0 FROZEN until that review passes.

## Supported Store placement --- frozen carry-forward

One-counter deployment may colocate POS, Store Node and PostgreSQL on
the same Windows PC. Multi-counter deployment uses one designated Store
Node/database host with counters connecting over LAN. This placement
choice does not change domain behavior or Store Node authority.

## Implementation governance --- frozen carry-forward

`docs/34-IMPLEMENTATION-GOVERNANCE-AND-AI-GUARDRAILS.md` governs later
implementation. Specification and acceptance criteria precede agent
coding; protected tests may not be weakened; production migrations are
human-reviewed; material architecture changes require ADR review; CI
gates protected domain/ledger, API/module-contract and sync-simulation
tests.

`docs/35-PHASE-0-EXACT-TRACEABILITY.md` preserves the approved
sync-engine evaluation and Malayalam/Malay receipt validation wording.
