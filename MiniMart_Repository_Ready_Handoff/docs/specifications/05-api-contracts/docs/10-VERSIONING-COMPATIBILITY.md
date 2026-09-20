# Versioning and Compatibility v0.2

`/api/v1` is the Store API major path, `/sync/v1` the Sync major path
and `/cloud/v1` the Cloud-management/reporting major path.

Additive compatible changes remain within a major contract. Breaking
semantic changes require a staged/new major contract and the frozen
Architecture compatibility overlap rules.

No compatible write path returns `426 Upgrade Required` and performs no
mutation.

OpenAPI 3.1 is the canonical HTTP source. Zod validators/types are
generated from it and check-diffed in CI. JSON Schema Draft 2020-12 is
canonical for hardware/provider/enrollment port contracts.
