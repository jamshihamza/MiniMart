# Dependency Boundary Enforcement --- v0.3

## Package metadata

Every TypeScript package exposes architecture metadata in workspace
configuration:

``` json
{
  "minimart": {
    "layer": "domain",
    "module": "inventory",
    "capabilities": ["inventory-public"]
  }
}
```

## CI graph rules

CI rejects: - `domain` depending on
adapter/infrastructure/UI/transport; - module `X` importing
`modules/Y/internal/*`; - a module importing another module's
repository, SQL, ORM/table definition or migration; - `query` importing
module-private persistence; - direct SQL outside the
repository/projection adapter that owns the target persistence; -
application code bypassing a public module port; - `apps/*` being
imported by packages; - dependency cycles.

Only `application/coordinators` may compose multiple module public
command ports for Posting Envelopes.

`query` may compose multiple public query ports. If a later reporting
projection is approved, only its own projection repository may issue SQL
against its own projection tables.

## Database privilege defense-in-depth

Where practical, runtime database roles/search paths should reinforce
ownership so an accidental direct cross-module query fails early.
Database privileges do not replace static architecture checks or
public-port discipline.

The exact lint engine may change; metadata and allowed-edge semantics
are architecture requirements.
