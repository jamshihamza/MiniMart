# UI-INV-005 --- Stock Count Workspace

**Surface:** Back Office\
**Area:** Inventory\
**Primary roles/personas:** Storekeeper, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Enter/reconcile physical count and post adjustments.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `inventory.post`,
`inventory.read`, `inventory.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Stock Count Workspace.
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
-   `API-INV-007` GET `/api/v1/inventory/stock-counts/{stockCountId}`
    --- Get stock count
-   `API-INV-008` PATCH `/api/v1/inventory/stock-counts/{stockCountId}`
    --- Update count observations while mutable
-   `API-INV-009` POST
    `/api/v1/inventory/stock-counts/{stockCountId}:post` --- Complete
    stock count through explicit adjustment movements

## Mutation behavior

-   `API-INV-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK, PERMISSION_DENIED`.
-   `API-INV-008`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK, PERMISSION_DENIED`.
-   `API-INV-009`: disable duplicate submit; preserve idempotency
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

## Critical-flow acceptance

-   The primary workflow is keyboard completable.
-   Lost-response retry preserves the same logical command identity.
-   Posted success is shown only after authoritative response/recovery.
-   Store Node loss cannot be mistaken for ordinary cloud-offline.
-   Permission/override and conflict states have an explicit recovery
    path.
