# External Payment and Refund Provider Choreography

## Principle

Provider calls are outside PostgreSQL transactions, but provider-side
money must never become an untracked side effect. Every integrated call
uses a stable MiniMart execution/attempt identity and a provider
request/idempotency identity.

## Card / QR checkout

### A. Prepare locally

Short local transaction: 1. lock CheckoutPayment as needed; 2.
create/update PaymentAttempt as started/pending; 3. persist
provider-neutral request identity and MiniMart idempotency/correlation
identity; 4. Audit/Outbox if required by the frozen model; 5. commit.

### B. Call provider

Outside DB transaction: - send the stable provider request identity; -
do not hold PostgreSQL locks; - treat transport timeout/lost response as
**UNCERTAIN**, not FAILED.

### C. Record outcome

Short local transaction: - SUCCESS/confirmed → record attempt
confirmed/committed-compatible outcome and create durable
PaymentCommitment exactly once using settlement-source uniqueness; -
explicit failure → record FAILED; - uncertain → record UNCERTAIN and
schedule/query reconciliation; - commit.

### D. Complete Sale

`SalePostingCoordinator` consumes durable confirmed commitments plus
cash/manual components and atomically posts Sale + Stock +
PostedTender + applicable credit/cash/financial effects + Audit +
Outbox.

A successful earlier component survives failure/uncertainty of a later
component.

## Crash after provider success but before local confirmation

Do **not** blindly create a new provider charge. Reconcile using the
original provider request identity. If provider confirms success,
materialize the same PaymentCommitment once. If provider proves failure,
mark failed. If still unknown, remain uncertain.

## Manual confirmation mode

Where an upstream decision permits manual/external confirmation, no
provider adapter call is required. Authorized application action records
the confirmation evidence through the same provider-neutral
attempt/commitment model. Architecture does not decide whether card/QR
is manual or integrated.

## Refund

1.  create RefundExecution/RefundAttempt with stable execution/request
    identity in a local transaction;
2.  call provider outside DB transaction;
3.  confirmed result is persisted/reconciled;
4.  `RefundSettlementCoordinator` atomically applies the confirmed
    execution to RefundObligation and cash/financial movement exactly
    once;
5.  stock is never reposted during refund settlement.

A provider success followed by local crash is recovered by reconciling
the same RefundExecution/request identity.

## Adapter contract

Provider adapters expose provider-neutral operations such as `initiate`,
`query/reconcile`, and where approved `cancel/reverse`. Core code does
not depend on provider SDK DTOs. DEC-PAY-001/002/006 remain
unresolved/deferred as upstream specifies.
