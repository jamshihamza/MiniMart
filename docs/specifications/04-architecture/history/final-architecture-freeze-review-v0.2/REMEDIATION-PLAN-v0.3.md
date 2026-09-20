# Architecture v0.3 Freeze-Candidate Remediation Plan

## 1. Restore strict module read ownership

Delete the direct cross-schema query exception.

Use: - module public query ports for authoritative operational reads; -
reporting/read-model projections owned by the reporting/query subsystem
and populated from public events/contracts; - no reporting/query code
treats a business module's private schema as its API.

## 2. Add an authoritative Technology Baseline

Carry forward: - PostgreSQL Store Node; - managed PostgreSQL cloud; -
Node.js + TypeScript modular monolith; - SQL-first Kysely or Drizzle; -
pg-boss; - Tauri + React + Vite + Tailwind; - TanStack Query +
Zustand; - AG Grid Community for back-office grids; - TanStack Table for
POS cart; - client-generated UUIDv7; - OpenAPI + Zod; - custom
outbox/change-feed protocol.

Any later replacement requires an ADR.

## 3. Normalize edge/cloud runtime

Use one shared Node service runtime/composition framework with `edge`
and `cloud` modes. Deployment launchers may differ. Cloud mode
physically omits Store Posting coordinators/handlers.

## 4. Restore security baseline

Explicitly require: - Argon2 for password/PIN hashing with upgradeable
parameters/version; - BitLocker/full-disk encryption baseline on
supported Store Node/counter Windows deployments; - OS secret store; -
parameterized SQL; - dependency scanning; - signed installers and signed
updates; - no PAN storage.

Do not activate survival-mode SQLite early.

## 5. Restore Phase-0 architecture validation spikes

Before feature-heavy coding: - Windows installer: Node + PostgreSQL +
Tauri, service registration, upgrade and rollback; - target receipt
printer including non-Latin raster receipt; - scanner/core hardware
adapter smoke test; - minimal real sync proof: Store Node → Outbox →
Cloud → Inbox/Dedup → ACK.

## 6. Correct dependency diagram

Separate runtime invocation arrows from code-dependency arrows so
external-provider direction is unambiguous.

## Freeze condition

After v0.3 is built, rerun exact Decision seam, Posting Envelope, frozen
DB, Reference Architecture technology, module-boundary, security,
runtime-mode and Phase-0 risk-gate checks.
