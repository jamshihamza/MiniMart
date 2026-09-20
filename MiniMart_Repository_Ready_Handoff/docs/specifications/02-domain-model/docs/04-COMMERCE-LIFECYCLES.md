# Commerce Lifecycles --- v0.2

## 1. Sale lifecycle

``` mermaid
stateDiagram-v2
  [*] --> ACTIVE
  ACTIVE --> HELD: ordinary hold
  HELD --> ACTIVE: retrieve + revalidate
  ACTIVE --> VOIDED: void before commitment/posting
  ACTIVE --> PAYMENT: start payment
  PAYMENT --> ACTIVE: cancel only if no durable commitment remains
  PAYMENT --> PAYMENT_RECOVERY: commitment exists but checkout incomplete
  PAYMENT_RECOVERY --> PAYMENT: continue remaining tender
  PAYMENT --> POSTING: payable reconciled
  PAYMENT_RECOVERY --> POSTING: payable reconciled
  POSTING --> COMPLETED: atomic local posting
  POSTING --> POSTING: safe retry/recovery
```

Rules: - ordinary Held Sale cannot strand confirmed money; - only one
counter/user may successfully complete the same Sale; - commercial
values freeze/revalidate according to approved price policy; -
printer/cloud failure after local posting cannot unpost the Sale.

## 2. CheckoutPayment lifecycle

``` mermaid
stateDiagram-v2
  [*] --> OPEN
  OPEN --> PARTIALLY_COMMITTED
  PARTIALLY_COMMITTED --> PARTIALLY_COMMITTED
  OPEN --> READY_TO_POST
  PARTIALLY_COMMITTED --> READY_TO_POST
  OPEN --> CANCELLED: no durable commitment
  PARTIALLY_COMMITTED --> RECOVERY_REQUIRED: checkout cannot continue
  RECOVERY_REQUIRED --> PARTIALLY_COMMITTED: resume
  RECOVERY_REQUIRED --> REVERSED: all commitments explicitly reversed/refunded
  READY_TO_POST --> SETTLED_TO_SALE: Sale Posting Envelope
```

Each component may have PaymentAttempt states
`STARTED/PENDING/FAILED/UNCERTAIN/COMMITTED`. A committed component
survives restart.

## 3. Return lifecycle --- commercial status

``` mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> CANCELLED
  DRAFT --> POSTING
  POSTING --> POSTED
  POSTING --> POSTING: safe retry/recovery
```

A posted SalesReturn is immutable. Its inventory effect occurs exactly
once.

## 4. RefundObligation lifecycle --- settlement status

This status is **orthogonal** to SalesReturnStatus.

``` mermaid
stateDiagram-v2
  [*] --> OUTSTANDING
  OUTSTANDING --> PENDING
  OUTSTANDING --> SETTLED: immediate cash/manual confirmed settlement
  PENDING --> SETTLED
  PENDING --> FAILED
  PENDING --> UNCERTAIN
  FAILED --> PENDING: approved safe retry
  UNCERTAIN --> SETTLED: reconciled success
  UNCERTAIN --> FAILED: reconciled failure
```

A Return may therefore be `POSTED` while its obligation is
`OUTSTANDING`, `PENDING`, `UNCERTAIN`, `FAILED` or `SETTLED`.

## 5. RefundExecution lifecycle

`CREATED → ATTEMPTING → CONFIRMED / FAILED / UNCERTAIN → RECONCILED`

Confirmed settlement updates the Return-owned RefundObligation exactly
once through the RefundSettlementCoordinator. It never re-posts stock.

## 6. Goods Receipt

`DRAFT → VALIDATED → POSTING → POSTED`

For PO-linked receipt, POSTING revalidates and updates PO
remaining-receivable state in the same envelope.

## 7. Purchase Return

`DRAFT → VALIDATED → POSTING → POSTED`

Posting coordinates source-return eligibility, Inventory issue/WAC
effect and supplier liability/credit effect where enabled.

## 8. Stock Count

`DRAFT/COUNTING → REVIEW → APPROVED → POSTING → POSTED`

Posting creates explicit CountAdjustment movement(s). Exact
count-concurrency strategy remains `DEC-INV-003`.

## 9. Customer Collection

`DRAFT → VALIDATED → POSTING → POSTED → REVERSED/CORRECTED by explicit compensating process`

Posting coordinates CreditAccount effect and money/cash effect.

## 10. Cashier Shift

`NONE/CLOSED → OPEN → COUNTING/REVIEW → CLOSED`

Opening/closing races obey configured Counter/Drawer consistency scope.
Expected and actual cash remain independent facts.

## 11. Business Day

`OPEN → CLOSE_REVIEW → CLOSED`

Rollover, open-shift exception, late transaction and exceptional reopen
remain explicit decision seams.

## 12. CreditAccount

Long-lived status: `ACTIVE / SUSPENDED / CLOSED`.

Exposure changes only through immutable CreditLedgerEntry effects.
Posting-time revalidation serializes concurrent local credit exposure
decisions.
