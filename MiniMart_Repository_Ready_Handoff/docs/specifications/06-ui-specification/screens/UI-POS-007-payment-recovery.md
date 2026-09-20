# UI-POS-007 --- Payment Recovery

**Surface:** POS\
**Area:** Payments\
**Primary roles/personas:** Cashier, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Recover durable committed/uncertain payment without duplicate charge.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `payment.read`,
`payment.write`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Payment Recovery.
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

-   `API-PAY-001` GET `/api/v1/checkout-payments/{checkoutPaymentId}`
    --- Get checkout payment and remaining due
-   `API-PAY-002` POST
    `/api/v1/checkout-payments/{checkoutPaymentId}/cash-components` ---
    Add/confirm local cash component
-   `API-PAY-003` POST
    `/api/v1/checkout-payments/{checkoutPaymentId}/manual-confirmations`
    --- Record authorized provider-neutral manual/external success
-   `API-PAY-004` POST
    `/api/v1/checkout-payments/{checkoutPaymentId}/attempts` --- Start
    provider-neutral integrated payment attempt
-   `API-PAY-005` GET `/api/v1/payment-attempts/{paymentAttemptId}` ---
    Get payment attempt state
-   `API-PAY-006` POST
    `/api/v1/payment-attempts/{paymentAttemptId}:reconcile` ---
    Reconcile original provider request identity

## Mutation behavior

-   `API-PAY-002`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.
-   `API-PAY-003`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.
-   `API-PAY-004`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.
-   `API-PAY-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.

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
