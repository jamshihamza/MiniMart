# UI-SUP-002 --- Supplier Editor

**Surface:** Back Office\
**Area:** Suppliers\
**Primary roles/personas:** Back Office, Manager, Accounts\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Maintain identity, contacts and commercial terms.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`procurement.read`, `procurement.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Supplier Editor.
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

-   `API-PUR-001` GET `/api/v1/procurement/purchase-orders` ---
    Search/list purchase orders
-   `API-PUR-002` POST `/api/v1/procurement/purchase-orders` --- Create
    purchase-order draft
-   `API-PUR-003` GET
    `/api/v1/procurement/purchase-orders/{purchaseOrderId}` --- Get
    purchase order
-   `API-PUR-004` PATCH
    `/api/v1/procurement/purchase-orders/{purchaseOrderId}` --- Update
    mutable purchase-order draft
-   `API-PUR-005` POST
    `/api/v1/procurement/purchase-orders/{purchaseOrderId}:transition`
    --- Request server-advertised allowed PO transition
-   `API-PUR-006` GET `/api/v1/procurement/goods-receipts` ---
    Search/list goods receipts
-   `API-SUP-001` GET `/api/v1/suppliers` --- Search/list suppliers
-   `API-SUP-002` POST `/api/v1/suppliers` --- Create supplier
-   `API-SUP-003` GET `/api/v1/suppliers/{supplierId}` --- Get supplier
-   `API-SUP-004` PATCH `/api/v1/suppliers/{supplierId}` --- Update
    supplier
-   `API-SUP-005` POST `/api/v1/suppliers/{supplierId}:activate` ---
    Activate supplier
-   `API-SUP-006` POST `/api/v1/suppliers/{supplierId}:deactivate` ---
    Deactivate supplier without deleting history
-   `API-SUP-007` GET `/api/v1/suppliers/{supplierId}/items` --- List
    supplier-item associations
-   `API-SUP-008` PUT `/api/v1/suppliers/{supplierId}/items/{itemId}`
    --- Create/update supplier-item association
-   `API-SUP-009` DELETE `/api/v1/suppliers/{supplierId}/items/{itemId}`
    --- Remove supplier-item association where allowed

## Mutation behavior

-   `API-PUR-002`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-PUR-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, PRECONDITION_FAILED`.
-   `API-PUR-005`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-SUP-002`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-SUP-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, PRECONDITION_FAILED`.
-   `API-SUP-005`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-SUP-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-SUP-008`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-SUP-009`: disable duplicate submit; preserve idempotency
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
