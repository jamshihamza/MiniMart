# MiniMart Specification Index

Use this order when deciding what document answers a question:

  --------------------------------------------------------------------------------
  Question                            Authority
  ----------------------------------- --------------------------------------------
  Business intent/context             `docs/specifications/01-brd/` (reference
                                      source; see status note)

  Functional behavior / NFR           `docs/specifications/02-frs-nfrs/` ---
                                      **FROZEN**

  Domain invariants / aggregates /    `docs/specifications/03-domain-model/` ---
  orchestration                       **FROZEN**

  Persistence/schema/concurrency      `docs/specifications/04-database-model/` ---
                                      **v1.2 FROZEN / active persistence
                                      authority**

  System/module/deployment            `docs/specifications/05-architecture/` ---
  architecture                        **v1.0 FROZEN**

  HTTP/sync/cloud contracts           `docs/specifications/06-api-contracts/` ---
                                      **v1.0 FROZEN**

  Screen/UX behavior                  `docs/specifications/07-ui-specification/`
                                      --- **v1.0 FROZEN**

  Implementation order                `docs/backlog/` --- **v0.1 backlog
                                      baseline**
  --------------------------------------------------------------------------------

## Conflict rule

Do not silently reconcile conflicts. Stop, identify the conflicting
IDs/files, and request controlled resolution.
