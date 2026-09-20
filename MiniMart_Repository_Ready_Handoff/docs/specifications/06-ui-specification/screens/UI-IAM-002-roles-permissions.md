# UI-IAM-002 --- Roles & Permissions

**Surface:** Back Office\
**Area:** Administration\
**Primary roles/personas:** Admin\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Role/permission assignment.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `system.read`,
`system.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Roles & Permissions.
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

-   `API-IAM-001` POST `/api/v1/auth/login` --- Authenticate user on
    enrolled device
-   `API-IAM-002` POST `/api/v1/auth/pin-login` --- Authenticate by PIN
    where configured
-   `API-IAM-003` POST `/api/v1/auth/logout` --- End current user
    session
-   `API-IAM-004` GET `/api/v1/auth/session` --- Get current session and
    authorization summary
-   `API-IAM-005` POST `/api/v1/auth/reauthenticate` --- Reauthenticate
    for protected action
-   `API-IAM-006` GET `/api/v1/iam/users` --- Search/list users
-   `API-IAM-012` GET `/api/v1/iam/roles` --- List roles and permission
    summaries
-   `API-IAM-013` POST `/api/v1/iam/roles` --- Create role
-   `API-IAM-014` PATCH `/api/v1/iam/roles/{roleId}` --- Update role
    permissions

## Mutation behavior

-   `API-IAM-001`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IAM-002`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IAM-003`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IAM-005`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IAM-013`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-IAM-014`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, PRECONDITION_FAILED`.

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

## Critical-flow acceptance

-   The primary workflow is keyboard completable.
-   Lost-response retry preserves the same logical command identity.
-   Posted success is shown only after authoritative response/recovery.
-   Store Node loss cannot be mistaken for ordinary cloud-offline.
-   Permission/override and conflict states have an explicit recovery
    path.
