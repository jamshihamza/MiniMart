# UI-SUP-001 --- Supplier List

**Surface:** Back Office\
**Area:** Suppliers\
**Primary roles/personas:** Back Office, Manager, Accounts\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Search supplier by name/code/identifier.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`procurement.goods-receipt.correct`, `procurement.post`,
`procurement.purchase-return.reverse`, `procurement.read`,
`procurement.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Supplier List.
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
-   `API-PUR-007` POST `/api/v1/procurement/goods-receipts` --- Create
    GRN draft with optional PO source
-   `API-PUR-008` GET
    `/api/v1/procurement/goods-receipts/{goodsReceiptId}` --- Get GRN
-   `API-PUR-009` PATCH
    `/api/v1/procurement/goods-receipts/{goodsReceiptId}` --- Update
    mutable GRN draft
-   `API-PUR-010` POST
    `/api/v1/procurement/goods-receipts/{goodsReceiptId}:post` --- Post
    PO-linked or direct GRN through policy-selected envelope
-   `API-PUR-012` POST `/api/v1/procurement/purchase-returns` --- Create
    purchase-return draft
-   `API-PUR-014` PATCH
    `/api/v1/procurement/purchase-returns/{purchaseReturnId}` --- Update
    mutable purchase-return draft
-   `API-PUR-016` POST
    `/api/v1/procurement/goods-receipts/{goodsReceiptId}:correct` ---
    Post compensating GRN correction/reversal
-   `API-PUR-017` POST
    `/api/v1/procurement/purchase-returns/{purchaseReturnId}:reverse`
    --- Post compensating purchase-return reversal

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
-   `API-PUR-007`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-PUR-009`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, PRECONDITION_FAILED`.
-   `API-PUR-010`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-PUR-012`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-PUR-014`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, PRECONDITION_FAILED`.
-   `API-PUR-016`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, PERMISSION_DENIED, RESOURCE_NOT_FOUND, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT`.
-   `API-PUR-017`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, PERMISSION_DENIED, RESOURCE_NOT_FOUND, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT`.

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
