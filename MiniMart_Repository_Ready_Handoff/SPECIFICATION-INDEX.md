# MiniMart Specification Index

  ---------------------------------------------------------------------------------------
  Question                            Authority
  ----------------------------------- ---------------------------------------------------
  Business + functional + NFR         `docs/specifications/01-business-and-functional/`
  requirements                        --- v1.0 FROZEN

  Domain invariants / aggregates /    `docs/specifications/02-domain-model/` --- v1.0
  posting orchestration               FROZEN

  Persistence / DDL / concurrency     `docs/specifications/03-database-model/` --- v1.2
                                      FROZEN, active persistence authority

  Deployment / modules / monorepo /   `docs/specifications/04-architecture/` --- v1.0
  dependencies                        FROZEN

  Store / Sync / Cloud HTTP contracts `docs/specifications/05-api-contracts/` --- v1.0
                                      FROZEN

  UI / UX / screen behavior           `docs/specifications/06-ui-specification/` --- v1.0
                                      FROZEN

  Implementation order                `docs/backlog/` --- v0.1 backlog baseline
  ---------------------------------------------------------------------------------------

## Important Phase 0 contract detail

The backlog phrase `GET /health` is shorthand. The frozen API contract
defines process liveness as:

`GET /api/v1/system/health` (`API-SYS-001`)

and database/transactional readiness separately as:

`GET /api/v1/system/readiness`.

Use the frozen OpenAPI contract, not the backlog shorthand, for
implementation.

## Conflict rule

Do not silently reconcile conflicting documents. Report the exact
IDs/files and request controlled resolution.
