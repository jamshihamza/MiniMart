# UI-PRI-003 --- Price Lookup

**Surface:** Back Office\
**Area:** Pricing\
**Primary roles/personas:** Back Office, Manager\
**Offline behavior:** READ_ONLY

## Purpose

Explain current price/effective source for an item/store.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `pricing.read`,
`pricing.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Price Lookup.
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

-   `API-PRI-001` POST `/api/v1/pricing:quote` --- Quote applicable
    selling price
-   `API-PRI-002` GET `/api/v1/pricing/schedules` --- List/search item
    price schedules
-   `API-PRI-003` POST `/api/v1/pricing/schedules` --- Create price
    schedule/draft
-   `API-PRI-004` GET `/api/v1/pricing/schedules/{priceScheduleId}` ---
    Get price schedule
-   `API-PRI-005` PATCH `/api/v1/pricing/schedules/{priceScheduleId}`
    --- Update mutable price schedule
-   `API-PRI-006` POST
    `/api/v1/pricing/schedules/{priceScheduleId}:activate` ---
    Activate/publish schedule when policy permits

## Mutation behavior

-   `API-PRI-001`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE, VALIDATION_FAILED`.
-   `API-PRI-003`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-PRI-005`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, PRECONDITION_FAILED`.
-   `API-PRI-006`: disable duplicate submit; preserve idempotency
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
