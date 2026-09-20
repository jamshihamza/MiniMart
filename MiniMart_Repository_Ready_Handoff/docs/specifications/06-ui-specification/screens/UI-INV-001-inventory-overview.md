# UI-INV-001 --- Inventory Overview

**Surface:** Back Office\
**Area:** Inventory\
**Primary roles/personas:** Storekeeper, Manager, Management\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Store stock position, low stock and exceptions.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`inventory.adjustment.edit`, `inventory.adjustment.read`,
`inventory.read`, `inventory.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Inventory Overview.
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

-   `API-INV-001` GET `/api/v1/inventory/positions` --- Search current
    Item×Store inventory positions
-   `API-INV-002` GET `/api/v1/inventory/positions/{itemId}` --- Get
    current inventory position for current Store
-   `API-INV-003` GET `/api/v1/inventory/movements` --- Search immutable
    stock movements
-   `API-INV-004` GET `/api/v1/inventory/availability/{itemId}` --- Get
    policy-neutral sale availability snapshot
-   `API-INV-005` GET `/api/v1/inventory/stock-counts` --- Search/list
    stock counts
-   `API-INV-006` POST `/api/v1/inventory/stock-counts` --- Create
    stock-count session
-   `API-INV-010` POST `/api/v1/inventory/adjustments` --- Create
    controlled manual inventory-adjustment draft
-   `API-INV-011` GET `/api/v1/inventory/adjustments` --- Search manual
    inventory-adjustment command history
-   `API-INV-012` GET `/api/v1/inventory/adjustments/{adjustmentId}` ---
    Get manual inventory-adjustment command
-   `API-INV-013` PATCH `/api/v1/inventory/adjustments/{adjustmentId}`
    --- Update mutable inventory-adjustment command

## Mutation behavior

-   `API-INV-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK, PERMISSION_DENIED`.
-   `API-INV-010`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK, PERMISSION_DENIED`.
-   `API-INV-013`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK, PERMISSION_DENIED`.

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
