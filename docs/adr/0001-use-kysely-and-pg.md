# ADR-0001: Use Kysely and pg for PostgreSQL access

- Status: Accepted
- Date: 2026-09-21
- Scope: Data-access implementation selection within Architecture v1.0

## Context

Architecture v1.0 permits exactly Kysely or Drizzle for SQL-first repository implementations and
requires the project to record the selection before production repository work begins. PostgreSQL
is the frozen Store database and managed PostgreSQL is the frozen Cloud database.

## Decision

MiniMart will use Kysely with the pg PostgreSQL driver. Kysely will provide typed SQL and
transaction-scoped repository access while preserving the frozen SQL-first model, private module
persistence, and explicit Unit of Work boundaries.

## Consequences

- Repository implementations must remain inside their owning module or approved projection
  adapter.
- Kysely types are implementation aids; the frozen Database Model v1.2 and reference DDL remain
  authoritative.
- Migrations remain explicit, versioned, human-reviewed artifacts. Kysely migration facilities do
  not authorize schema changes or execution of the v1.2 design blueprint as a production migration.
- Kysely and pg are intentionally not installed by MM-001/MM-002. They enter the dependency graph
  when MM-004 implements the approved PostgreSQL repository and migration foundation.
