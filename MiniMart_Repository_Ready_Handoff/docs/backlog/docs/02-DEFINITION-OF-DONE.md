# Definition of Done

A backlog item is not Done until: - implementation traces to frozen
UI/API/domain requirements; - module ownership is respected; - no direct
cross-module private table/repository access is introduced; - exact
money uses decimal-safe handling; - mutations implement
idempotency/concurrency contract; - tests cover happy path plus required
validation/permission/conflict/recovery behavior; - migrations, if any,
are explicit and human-reviewed; - formatter, typecheck,
unit/integration/contract tests pass; - no architecture decision is
silently changed; - UI critical workflows meet
keyboard/accessibility/offline acceptance where applicable; -
documentation/ADR is updated when a controlled decision changes.
