# UI-ACC-008 --- Expense Entry

**Surface:** Back Office\
**Area:** Accounting\
**Primary roles/personas:** Accounts, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Post operational expense.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`accounting.expense.reverse`, `accounting.post`, `accounting.read`,
`accounting.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Expense Entry.
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
-   `API-ACC-018` GET `/api/v1/accounting/expenses` --- Search expenses
-   `API-ACC-019` POST `/api/v1/accounting/expenses` --- Create expense
    draft
-   `API-ACC-020` POST `/api/v1/accounting/expenses/{expenseId}:post`
    --- Post expense + financial/drawer effect
-   `API-ACC-028` POST `/api/v1/accounting/expenses/{expenseId}:reverse`
    --- Post compensating expense reversal
-   `API-ACC-033` GET `/api/v1/accounting/expenses/{expenseId}` --- Get
    expense and source linkage

## Mutation behavior

-   `API-ACC-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-019`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-020`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-ACC-028`: disable duplicate submit; preserve idempotency
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
