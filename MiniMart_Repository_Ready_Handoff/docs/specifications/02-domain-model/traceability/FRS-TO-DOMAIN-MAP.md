# FRS → Domain Model Traceability --- v0.2

  ----------------------------------------------------------------------------
  FRS namespace                       Domain mapping
  ----------------------------------- ----------------------------------------
  FR-COM-001--030                     Posting envelopes, BusinessContext,
                                      immutability, retry,
                                      authorization/failure semantics

  FR-ORG-001--030                     Company, Store, Counter

  FR-IAM-001--040                     UserAccount, Role,
                                      OverrideAuthorization, SupportSession

  FR-CAT-001--060                     Item, Category, Brand,
                                      Barcode/UoM/tracking policies

  FR-PRI-001--036                     ItemPriceSchedule, PriceSnapshot,
                                      repricing/override policy seams

  FR-SUP-001--036                     Supplier aggregate

  FR-PUR-001--110                     PurchaseOrder, GoodsReceipt,
                                      PurchaseReturn, receipt/return
                                      consistency guards

  FR-INV-001--110                     InventoryPosition, StockBucket,
                                      BatchPosition, StockMovement,
                                      StockCount, WAC

  FR-POS-001--090                     Sale, SaleLine,
                                      Sale/held/payment-recovery lifecycle

  FR-PAY-001--075                     CheckoutPayment, PaymentAttempt,
                                      PaymentCommitment, PostedTender

  FR-RET-001--060                     SalesReturn, ReturnLine,
                                      RefundObligation, RefundExecution
                                      collaboration

  FR-CUS-001--045                     Customer, historical
                                      snapshot/privacy/concurrency

  FR-CRD-001--065                     CreditAccount, CreditLedgerEntry,
                                      CustomerCollection

  FR-CSH-001--075                     CashierShift, CashMovement,
                                      BusinessDay/BusinessDate

  FR-RPT-001--065                     Read models/projections; reporting
                                      policy seams

  FR-IMP-001--045                     Application import policy using normal
                                      domain commands/envelopes

  FR-AUD-001--045                     AuditContext/evidence + audit decision
                                      seams

  FR-HW-001--050                      Adapter ports; hardware decision seams

  FR-BR-001--045                      Operational recovery
                                      constraints/decision seams

  FR-SUPT-001--045                    SupportSession + diagnostics/retention
                                      seams

  FR-CTRY-001--050                    CountryRuleSet/Ref +
                                      verification/migration seams

  FR-ACC-001--050                     SupplierPayable/Payment,
                                      FinancialAccount/Movement/Transaction,
                                      Transfer, ExpenseCategory/Expense,
                                      Reconciliation
  ----------------------------------------------------------------------------

## Critical requirement-level mappings

-   `FR-POS-043` → SaleId held-sale concurrency key.
-   `FR-POS-052–054`, `FR-PAY-062/064/073` → Sale Posting Envelope +
    PaymentCommitment/PostedTender separation.
-   `FR-POS-057/058` → idempotent Sale completion + Item/Store stock
    revalidation.
-   `FR-PUR-042` → PO line remaining-receivable consistency key.
-   `FR-PUR-084` → GoodsReceipt logical idempotency/duplicate guard.
-   `FR-PUR-101–107` → Purchase Return envelope/idempotency.
-   `FR-INV-053` → ItemId + StoreId stock/WAC concurrency key.
-   `FR-RET-026/051` → separate Return posting and RefundObligation
    settlement status.
-   `FR-RET-034` → original SaleId + SaleLineId return-eligibility
    consistency key.
-   `FR-CRD-013/049` → CreditAccount posting-time concurrency
    revalidation.
-   `FR-CUS-036` → Customer edit conflict boundary.
-   `FR-CSH-003/021–025` → active-shift policy, cash movement
    idempotency and tender/uncertain-state visibility.
-   `FR-ACC-007` → Accounting-Lite source effect in same local envelope
    where required.
-   `FR-ACC-022` → Customer Collection + credit + cash/bank coordinated
    effect.
-   `FR-ACC-027–030` → FinancialTransaction/AccountTransfer + immutable
    FinancialMovement.
-   `FR-ACC-034–040` → Expense/ExpenseCategory + financial/drawer
    effect.
-   `FR-INV-109` → frozen Item × Store moving-WAC domain baseline.
-   `FR-CTRY-003/019` → version/effective CountryRuleSet and
    verification boundary.
