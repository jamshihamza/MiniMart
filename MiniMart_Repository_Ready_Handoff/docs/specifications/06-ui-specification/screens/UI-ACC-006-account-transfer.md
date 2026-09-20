# UI-ACC-006 --- Account Transfer

**Surface:** Back Office\
**Area:** Accounting\
**Primary roles/personas:** Accounts, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Transfer between financial accounts atomically.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`accounting.post`, `accounting.read`, `accounting.transfer.reverse`,
`accounting.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Account Transfer.
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

-   `API-ACC-001` GET `/api/v1/accounting/supplier-payables` --- Search
    supplier payables
-   `API-ACC-002` GET
    `/api/v1/accounting/supplier-payables/{supplierPayableId}` --- Get
    supplier payable and allocation state
-   `API-ACC-003` GET `/api/v1/accounting/supplier-payments` --- Search
    supplier payments
-   `API-ACC-004` POST `/api/v1/accounting/supplier-payments` --- Create
    supplier payment draft
-   `API-ACC-005` GET
    `/api/v1/accounting/supplier-payments/{supplierPaymentId}` --- Get
    supplier payment
-   `API-ACC-006` POST
    `/api/v1/accounting/supplier-payments/{supplierPaymentId}:post` ---
    Post supplier payment + allocations + financial movement
-   `API-ACC-013` POST `/api/v1/accounting/transfers` --- Create account
    transfer draft
-   `API-ACC-014` POST
    `/api/v1/accounting/transfers/{accountTransferId}:post` --- Post
    balanced account transfer
-   `API-ACC-027` POST
    `/api/v1/accounting/transfers/{accountTransferId}:reverse` --- Post
    compensating account-transfer reversal
-   `API-ACC-031` GET `/api/v1/accounting/transfers` --- Search account
    transfers
-   `API-ACC-032` GET `/api/v1/accounting/transfers/{accountTransferId}`
    --- Get account transfer and source linkage

## Mutation behavior

-   `API-ACC-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-013`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-014`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-027`: disable duplicate submit; preserve idempotency
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
