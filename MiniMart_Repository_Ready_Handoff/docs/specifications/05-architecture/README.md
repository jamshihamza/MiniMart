# MiniMart Architecture v1.0 --- FROZEN

**Document set:** MM-ARCH-001\
**Status:** **FROZEN**\
**Freeze basis:** Architecture Refinement v0.3 Freeze Candidate +
Independent Final Architecture Freeze Review MM-ARCH-FRZ-REV-002\
**Upstream:** BRD/FRS/NFRS v1.0 FROZEN; Domain Model v1.0 FROZEN;
Database Model v1.0 FROZEN; approved Reference Architecture v2 technical
baseline where not superseded

## Freeze result

-   Independent final review: PASS
-   Freeze blockers: 0
-   Major findings: 0
-   Final documentation corrections applied: 3 / 3
-   Decision seams: 60 / 60
-   Posting Envelope coordinators: 13 / 13
-   Architecture decisions: 37
-   Frozen Database Model respected: 74 tables
-   Cross-module internal-table reads: FORBIDDEN
-   Store transactional authority: Store Node + local PostgreSQL
-   Synchronous cloud dependency for Store posting: NONE

## Technology baseline

PostgreSQL; managed PostgreSQL; Node.js + TypeScript modular monolith;
Kysely or Drizzle; pg-boss; Tauri + React + Vite + Tailwind; TanStack
Query + Zustand; AG Grid Community; TanStack Table;
application-generated UUIDv7; OpenAPI + Zod; custom Outbox/Inbox
change-feed synchronization.

## Next stage

**API Contracts**. API work must consume this frozen architecture and
must not silently reopen frozen business, domain, database or
architecture decisions.
