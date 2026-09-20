# Domain Events --- v0.2

Domain events describe committed facts and have exactly one owning
producer. They do not grant permission to mutate another module's
internal state.

## Organization / IAM

`StoreActivated`, `StoreCountryAssigned`, `CounterActivated`,
`UserDeactivated`, `PermissionChanged`, `OverrideAuthorized`,
`SupportSessionAuthorized`, `SupportSessionExpired`

## Catalog / Pricing

`ItemCreated`, `ItemActivated`, `ItemDeactivated`,
`ItemTrackingPolicyChanged`, `ItemPriceScheduled`,
`ItemPriceBecameEffective`

## Procurement

`PurchaseOrderCreated`, `PurchaseOrderApproved`,
`PurchaseOrderReceiptAllocated`, `GoodsReceiptPosted`,
`GoodsReceiptReversed`, `PurchaseReturnPosted`

## Inventory

`StockReceived`, `StockIssued`, `StockDispositionChanged`,
`StockAdjusted`, `InventoryPositionChanged`,
`WeightedAverageCostChanged`, `StockCountCompleted`

## Sales

`SaleStarted`, `SaleHeld`, `SaleRetrieved`, `SalePaymentStarted`,
`SalePaymentRecoveryRequired`, `SalePosted`, `SaleVoidedBeforePosting`

## Payments

`PaymentAttemptStarted`, `PaymentAttemptFailed`,
`PaymentOutcomeUncertain`, `PaymentCommitted`,
`PaymentCommitmentReversed`, `TenderPosted`, `RefundExecutionStarted`,
`RefundExecutionFailed`, `RefundExecutionUncertain`,
`RefundExecutionConfirmed`

## Returns

`SalesReturnPosted`, `RefundObligationCreated`,
`RefundObligationSettled`

## Customer & Credit

`CustomerCreated`, `CreditTermsChanged`, `CreditChargePosted`,
`CreditApplied`, `CustomerCollectionPosted`,
`CustomerCollectionReversed`

## Cash & Business Day

`CashierShiftOpened`, `CashMovementPosted`, `CashierShiftClosed`,
`CashVarianceRecorded`, `BusinessDayOpened`, `BusinessDayClosed`

## Accounting-Lite

`SupplierPayableCreated`, `SupplierCreditApplied`,
`SupplierPaymentPosted`, `SupplierPaymentReversed`,
`FinancialMovementPosted`, `FinancialTransactionPosted`,
`AccountTransferPosted`, `ExpensePosted`, `ExpenseReversed`,
`ReconciliationCompleted`

## Country Policy

`CountryRuleSetActivated`, `CountryRuleSetSuperseded`

## Event envelope

Every publishable event includes: - EventId and event type/version; -
producer context + aggregate identity/type; - Company/Store context
where applicable; - occurred-at timestamp; - BusinessDate where
applicable; - CorrelationId; - CausationId; - PostingEnvelopeId where
committed with a coordinated local envelope; - actor/system identity; -
CountryRuleSetRef where material.

Outbox rows are written in the same local transaction as their producing
business facts.

See `12-EVENT-CAUSALITY-AND-ORCHESTRATION.md`.
