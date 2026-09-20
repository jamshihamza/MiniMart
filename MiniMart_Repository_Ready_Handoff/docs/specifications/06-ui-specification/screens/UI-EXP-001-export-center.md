# UI-EXP-001 --- Export Center

**Surface:** Back Office\
**Area:** Tools\
**Primary roles/personas:** Admin, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Create/download authorized export artifacts.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `import.read`,
`import.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Export Center.
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

-   `API-IMP-001` POST `/api/v1/imports` --- Create validated import job
    from source token
-   `API-IMP-002` GET `/api/v1/imports/{importJobId}` --- Get import
    validation/commit status
-   `API-IMP-003` POST `/api/v1/imports/{importJobId}:validate` ---
    Validate import without bypassing domain rules
-   `API-IMP-004` POST `/api/v1/imports/{importJobId}:commit` --- Commit
    approved import through normal domain commands
-   `API-IMP-005` GET `/api/v1/exports/{exportJobId}` --- Get export
    job/status
-   `API-IMP-006` GET `/api/v1/imports/templates` --- List supported
    import templates/formats and required columns

## Mutation behavior

-   `API-IMP-001`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IMP-003`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IMP-004`: disable duplicate submit; preserve idempotency
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
