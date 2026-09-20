# UI-POS-011 --- Return / Refund Workspace

**Surface:** POS\
**Area:** Returns\
**Primary roles/personas:** Cashier, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Build return against original sale and track refund obligation.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `returns.post`,
`returns.read`, `returns.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Return / Refund Workspace.
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

-   `API-RET-001` GET `/api/v1/returns` --- Search/list sales returns
-   `API-RET-002` POST `/api/v1/returns` --- Create return draft
-   `API-RET-003` GET `/api/v1/returns/{salesReturnId}` --- Get return
    and refund-obligation state
-   `API-RET-004` PATCH `/api/v1/returns/{salesReturnId}` --- Update
    mutable return draft
-   `API-RET-005` POST `/api/v1/returns/{salesReturnId}:preview` ---
    Recalculate eligibility/value/disposition/refund plan
-   `API-RET-006` POST `/api/v1/returns/{salesReturnId}:post` --- Post
    Return + stock disposition + Refund Obligation/immediate settlement
-   `API-RET-008` GET `/api/v1/sales/{saleId}/return-eligibility` ---
    Get current remaining return eligibility snapshot

## Mutation behavior

-   `API-RET-002`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, REFUND_OBLIGATION_OUTSTANDING`.
-   `API-RET-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, PRECONDITION_FAILED`.
-   `API-RET-005`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, REFUND_OBLIGATION_OUTSTANDING, RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED`.
-   `API-RET-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, REFUND_OBLIGATION_OUTSTANDING`.

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
