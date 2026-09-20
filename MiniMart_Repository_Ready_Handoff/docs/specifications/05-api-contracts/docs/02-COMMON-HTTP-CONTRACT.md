# Common HTTP Contract v0.3

Protected business calls use enrolled-device trust plus Store Node
session authorization. `X-MiniMart-Client-Version` is required for
business API calls and optional for health/readiness/version probes.

List endpoints use opaque seek cursors. Each operation declares
`x-minimart-ordering` with a deterministic primary ordering and
immutable UUID tie-breaker. A cursor means "continue strictly after the
last emitted ordering tuple." It is not a page number and must not be
decoded by clients.

Concurrent inserts/updates may appear on a later refresh, but a single
forward traversal must not duplicate an already emitted ordering tuple.
If a cursor cannot be honored after a breaking query-contract change,
the server returns a stable validation/incompatibility problem rather
than silently restarting from page 1.

Problem responses use `application/problem+json`, stable `ProblemCode`,
correlation identity and recovery hints. Localized UI text is separate
from machine codes.
