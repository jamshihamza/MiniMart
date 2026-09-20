# Cross-Context Domain Contracts --- v0.2

These are conceptual ports, not API DTOs.

## Catalog

-   `ResolveItem`
-   `GetItemSnapshot`

## Pricing

-   `QuoteSellingPrice(StoreId, ItemId, effectiveContext, quantity, customerContext?) → PriceSnapshot`

## Inventory

-   `CheckSaleAvailability`
-   `ApplyStockEffect(sourceIdentity, idempotencyKey, effects[])`
-   `RevalidateInventoryPositions(consistencyKeys[])`

## Procurement

-   `RevalidatePOReceipt(PurchaseOrderId, lineEffects[])`
-   `ApplyPOReceiptAllocation(...)`
-   `CheckPurchaseReturnEligibility(sourceGRN/line, quantity)`

## Payments

-   `StartPaymentAttempt`
-   `ConfirmPaymentCommitment`
-   `ReconcilePaymentOutcome`
-   `MaterializePostedTenders`
-   `StartRefundExecution(RefundObligationRef, idempotencyKey)`
-   `RecordRefundOutcome`
-   `ReconcileRefundOutcome`

## Returns

-   `CheckReturnEligibility(originalSaleLineKey, quantity/value)`
-   `CreateRefundObligation`
-   `ApplyRefundSettlement(refundExecutionResult)`

## Customer & Credit

-   `EvaluateCredit`
-   `ApplyCreditEffect`
-   `PostCustomerCollectionEffect`

## Cash & Business Day

-   `ResolveBusinessDate`
-   `ValidateEligibleShift`
-   `ApplyShiftCashEffect`
-   `ValidateBusinessDayOpen`

## Accounting-Lite

-   `RecognizeSupplierLiability`
-   `ApplySupplierCredit`
-   `PostSupplierPaymentAllocation`
-   `PostFinancialMovement`
-   `PostAccountTransfer`
-   `PostExpenseFinancialEffect`

## Country Policy

-   `ResolveCountryRuleSet`
-   `CalculateTax`
-   `ApplyCashRounding`
-   `ValidateDocumentCompliance`
-   `DetermineAllowedPaymentMethods`

## IAM

-   `Authorize(actor, action, scope, override?)`

## Audit

-   `RecordAuditEvidence(AuditContext, businessFactRef)`

## Contract rules

1.  Public contracts expose business concepts, not internal tables.
2.  Coordinators may compose contracts inside one Unit of Work.
3.  A context never writes another context's persistence directly.
4.  Local correctness is not delegated to eventual outbox consumption.
5.  External adapters return provider-independent result types.
