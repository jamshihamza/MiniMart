# UI-POS-012 --- Refund Recovery

**Surface:** POS\
**Area:** Returns\
**Primary roles/personas:** Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Resolve pending/failed/uncertain refund execution.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes:
`payment.commitment.recover`, `payment.post`, `payment.read`,
`payment.write`, `returns.post`, `returns.read`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Refund Recovery.
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
-   `API-PAY-010` GET `/api/v1/refund-executions/{refundExecutionId}`
    --- Get refund execution/recovery state
-   `API-PAY-011` POST
    `/api/v1/refund-obligations/{refundObligationId}/executions` ---
    Start provider-neutral refund execution
-   `API-PAY-012` POST
    `/api/v1/refund-executions/{refundExecutionId}:reconcile` ---
    Reconcile uncertain/pending refund outcome
-   `API-PAY-013` POST
    `/api/v1/refund-executions/{refundExecutionId}:settle` --- Apply
    confirmed/manual refund execution to obligation once
-   `API-PAY-015` POST
    `/api/v1/payment-commitments/{paymentCommitmentId}:reverse` ---
    Start approved reversal/refund/recovery of a pre-sale payment
    commitment
-   `API-RET-003` GET `/api/v1/returns/{salesReturnId}` --- Get return
    and refund-obligation state
-   `API-RET-005` POST `/api/v1/returns/{salesReturnId}:preview` ---
    Recalculate eligibility/value/disposition/refund plan
-   `API-RET-006` POST `/api/v1/returns/{salesReturnId}:post` --- Post
    Return + stock disposition + Refund Obligation/immediate settlement
-   `API-RET-007` GET `/api/v1/refund-obligations/{refundObligationId}`
    --- Get outstanding refund obligation

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
-   `API-PAY-011`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.
-   `API-PAY-012`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.
-   `API-PAY-013`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.
-   `API-PAY-015`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED, PAYMENT_RECOVERY_REQUIRED`.
-   `API-RET-005`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, REFUND_OBLIGATION_OUTSTANDING, RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED`.
-   `API-RET-006`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED, IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, REFUND_OBLIGATION_OUTSTANDING`.

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
