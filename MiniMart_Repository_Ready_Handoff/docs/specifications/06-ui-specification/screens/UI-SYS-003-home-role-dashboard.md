# UI-SYS-003 --- Home / Role Dashboard

**Surface:** Back Office\
**Area:** System\
**Primary roles/personas:** Manager, Admin, Management\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Role-aware operational landing page with alerts, shortcuts and
local/cloud status.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`operation.cancel`, `operation.read`, `system.read`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Home / Role Dashboard.
3.  Command region: only actions valid for current server
    state/capability.
4.  Status/audit/recovery region when applicable.
5.  Secondary detail is a drawer or routed detail; it must not hide the
    primary posting/recovery state.

## Screen states

LOADING → READY/EMPTY, with explicit VALIDATION_ERROR,
PERMISSION_DENIED, CONFLICT, LOCAL_CLOUD_OFFLINE, STORE_NODE_UNREACHABLE
and INCOMPATIBLE_CLIENT handling where applicable. Critical commands may
enter RECOVERY_REQUIRED.

## API contract

-   `API-SYS-001` GET `/api/v1/system/health` --- Process liveness
-   `API-SYS-002` GET `/api/v1/system/readiness` --- Transactional
    readiness and dependency gates
-   `API-SYS-003` GET `/api/v1/system/version` --- Build/API/schema/sync
    compatibility versions
-   `API-SYS-004` POST `/api/v1/system/compatibility:check` --- Check
    client/API compatibility before writes
-   `API-SYS-005` GET `/api/v1/system/context` --- Get trusted resolved
    operational context
-   `API-SYS-006` GET `/api/v1/system/capabilities` --- Get enabled edge
    capabilities and policy-neutral feature flags
-   `API-SYS-007` POST `/api/v1/operations/{operationJobId}:cancel` ---
    Request safe cancellation where job type supports it
-   `API-SYS-008` GET `/api/v1/operations/{operationJobId}` --- Get
    long-running operation job status/result

## Mutation behavior

-   `API-SYS-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE, VALIDATION_FAILED`.
-   `API-SYS-007`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.

## Data presentation

-   Money uses exact decimal-string UI boundary.
-   Quantity respects Item-UoM precision.
-   Dates show localized presentation while preserving
    BusinessDate/RFC3339 meaning.
-   Posted document identity/snapshots are read-only.
-   Country-specific fields appear only through verified
    capabilities/rule metadata.

## Accessibility / keyboard

Visible focus, logical order, text-plus-icon status, scalable layout and
keyboard access to primary commands. Function-key shortcuts, where
shown, are accelerators rather than the only control.
