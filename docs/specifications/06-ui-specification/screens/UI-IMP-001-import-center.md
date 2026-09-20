# UI-IMP-001 --- Import Center

**Surface:** Back Office\
**Area:** Tools\
**Primary roles/personas:** Admin, Back Office\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Upload, validate, preview and run supported imports.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`export.artifact.read`, `export.read`, `import.cancel`, `import.create`,
`import.read`, `import.source.upload`, `import.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Import Center.
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
-   `API-IMP-007` POST `/api/v1/imports/sources` --- Register local
    import source artifact and checksum
-   `API-IMP-008` POST `/api/v1/imports/{importJobId}:cancel` --- Safely
    cancel import at an allowed boundary
-   `API-IMP-009` GET `/api/v1/imports/{importJobId}/errors` --- Get
    bounded validation/error artifact
-   `API-IMP-010` GET `/api/v1/exports/{exportJobId}/artifact` --- Get
    export artifact descriptor/download handle
-   `API-IMP-011` POST `/api/v1/artifacts/imports` --- Upload import
    artifact to Store Node with checksum and bounded size
-   `API-IMP-012` GET `/api/v1/artifacts/{artifactId}/content` ---
    Download authorized export/error artifact bytes
-   `API-IMP-013` DELETE `/api/v1/artifacts/{artifactId}` ---
    Abort/remove an unconsumed import artifact

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
-   `API-IMP-007`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IMP-008`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IMP-011`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, PERMISSION_DENIED, RESOURCE_NOT_FOUND, VALIDATION_FAILED, INCOMPATIBLE_CLIENT, SERVICE_UNAVAILABLE`.
-   `API-IMP-013`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE`.

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
