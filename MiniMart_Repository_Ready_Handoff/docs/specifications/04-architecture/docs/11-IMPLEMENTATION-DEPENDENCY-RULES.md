# Implementation Dependency Rules --- v0.3

## Build-time rules

1.  UI → generated/API client contracts only.
2.  Transport controllers → application commands/queries.
3.  Coordinators → module public ports + UnitOfWork.
4.  Module application layer → own domain + own repository ports.
5.  Repository adapters → own PostgreSQL schema only.
6.  Query/reporting composition → public module query ports; no private
    business-schema SQL.
7.  Domain → no web framework, SQL, provider SDK or UI dependency.
8.  Provider/hardware/sync adapters depend inward on MiniMart-owned
    ports.
9.  SQL execution uses parameterized queries through the approved
    SQL-first data-access layer.

## CI architecture/security tests

CI rejects: - cross-module repository/internal-schema imports; -
query/reporting imports of module-private persistence; - direct SQL from
UI/transport/application/domain; - module imports from `apps/*`; -
circular module dependencies; - money typed as JS `number` in domain
monetary contracts; - unreviewed migration changes; - weakened protected
domain/concurrency tests.

CI/release pipelines also run dependency/security scanning.

## ADR trigger

An ADR and human review are required before changing: - Store Node
topology; - PostgreSQL as local truth; - Node.js + TypeScript
modular-monolith runtime; - the approved technology baseline in
`docs/32-TECHNOLOGY-BASELINE.md`; - module table
ownership/no-cross-module-read rule; - Posting Envelope atomicity; -
money representation; - WAC; - immutable ledgers; - sync
ownership/conflict model; - country-pack isolation; - security trust
boundaries.
