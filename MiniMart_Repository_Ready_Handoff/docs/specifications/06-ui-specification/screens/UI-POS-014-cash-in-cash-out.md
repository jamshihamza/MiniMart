# UI-POS-014 --- Cash In / Cash Out

**Surface:** POS\
**Area:** Cash\
**Primary roles/personas:** Cashier, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Authorized manual drawer movement.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `cash.post`,
`cash.read`, `cash.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Cash In / Cash Out.
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

-   `API-CSH-001` GET `/api/v1/cash/shifts/current` --- Get current
    eligible shift
-   `API-CSH-002` GET `/api/v1/cash/shifts` --- Search shifts
-   `API-CSH-003` POST `/api/v1/cash/shifts` --- Open cashier shift
-   `API-CSH-004` POST `/api/v1/cash/shifts/{shiftId}:close` --- Close
    shift with declared cash/tender summary
-   `API-CSH-005` GET `/api/v1/cash/shifts/{shiftId}/movements` ---
    Search immutable cash movements
-   `API-CSH-006` POST `/api/v1/cash/shifts/{shiftId}/cash-in` --- Post
    manual cash-in
-   `API-CSH-008` GET `/api/v1/business-days/current` --- Get current
    BusinessDate and BusinessDay state
-   `API-CSH-010` POST
    `/api/v1/business-days/{businessDayId}:transition` --- Request
    server-advertised business-day transition

## Mutation behavior

-   `API-CSH-003`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_DAY_STATE_CHANGED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED`.
-   `API-CSH-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_DAY_STATE_CHANGED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED`.
-   `API-CSH-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_DAY_STATE_CHANGED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED`.
-   `API-CSH-010`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_DAY_STATE_CHANGED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED`.

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
