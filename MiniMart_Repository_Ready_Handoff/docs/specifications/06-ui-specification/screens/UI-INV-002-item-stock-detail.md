# UI-INV-002 --- Item Stock Detail

**Surface:** Back Office\
**Area:** Inventory\
**Primary roles/personas:** Storekeeper, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Balances, buckets/batches and immutable movement history.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `inventory.read`,
`inventory.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Item Stock Detail.
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

## Mutation behavior

-   `API-INV-006`: disable duplicate submit; preserve idempotency
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
