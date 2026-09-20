# UI-CUS-001 --- Customer List

**Surface:** Back Office\
**Area:** Customers\
**Primary roles/personas:** Cashier, Back Office, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Search customer identity and status.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `credit.read`,
`credit.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Customer List.
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

-   `API-CRD-001` GET `/api/v1/credit/accounts/{customerId}` --- Get
    authoritative local credit account/exposure
-   `API-CRD-002` POST `/api/v1/credit/accounts/{customerId}:evaluate`
    --- Evaluate requested credit use
-   `API-CRD-003` PATCH `/api/v1/credit/accounts/{customerId}` ---
    Update credit terms/status subject to policy
-   `API-CRD-004` GET `/api/v1/credit/accounts/{customerId}/ledger` ---
    Search immutable credit ledger entries
-   `API-CRD-005` GET `/api/v1/customer-collections` --- Search customer
    collections
-   `API-CRD-006` POST `/api/v1/customer-collections` --- Create
    customer collection draft

## Mutation behavior

-   `API-CRD-002`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, CREDIT_CHANGED, CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND`.
-   `API-CRD-003`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, CREDIT_CHANGED, CREDIT_POLICY_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT`.
-   `API-CRD-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, CREDIT_CHANGED, CREDIT_POLICY_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT`.

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
