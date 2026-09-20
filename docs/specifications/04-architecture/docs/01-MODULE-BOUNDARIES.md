# Module Boundaries and Dependency Rules --- v0.3

## Business modules

The 13 frozen contexts remain first-class modules:

Organization; Identity & Access; Catalog; Pricing; Procurement;
Inventory; Sales; Payments; Returns; **Customer & Credit**; Cash &
Business Day; Accounting-Lite; Country Policy.

The filesystem package name for Customer & Credit is
`customer-and-credit`.

## Universal ownership rule

**No MiniMart module or cross-module query/reporting component may read
or write another business module's internal tables, repositories,
ORM/table objects, migrations or private SQL.**

A module exposes business data only through: - its typed public
command/query ports; - published immutable event/contract payloads; -
explicitly versioned public DTOs/contracts.

This rule applies to both command and read paths.

## Command-side rule

Business command code may depend only on: - its own domain/application
layer; - explicitly published public ports of other modules when invoked
by an approved application coordinator; - shared-kernel primitives; -
transaction-scoped infrastructure capabilities.

Cross-context posting is composed by the approved application
coordinator; it is not implemented by one module reading another
module's persistence.

## Query/reporting rule

`packages/query` is a composition layer, **not a schema-access
exception**.

It may: - call public module query ports; - compose results from
multiple public query ports; - read projection/read-model storage that
the query/reporting subsystem itself owns, after that storage has been
approved through Database Model change control; - consume published
events/contracts to build such projections.

It may not: - issue SQL or ORM reads against another business module's
internal schema; - use another module's repository adapter; - enforce a
command invariant; - update transactional module tables; - create an
alternate stock, tender, credit or financial truth; - bypass
tenant/company/store scope.

Until a dedicated reporting projection is added to the frozen Database
Model, cross-module reporting is composed from public query contracts.

## Static enforcement metadata

Each package declares: - `minimart.layer`:
`ui | transport | application | domain | query | adapter | infrastructure | test`; -
`minimart.module`: module name or `platform`; - `minimart.capabilities`:
allowed public capability tags.

CI builds an import graph and rejects forbidden edges and cycles.
SQL/ORM access is allowed only inside the repository/projection adapter
that owns the target persistence. The exact lint implementation may be
ESLint, dependency-cruiser or custom workspace tooling; the rule
semantics are frozen.
