# Aggregate Catalog --- v0.2

## Organization

### Company

Stable business identity and company-level operational defaults.

### Store

Stable Store identity, profile, timezone, currency/default locale and
active country assignment. BusinessDate lifecycle is not owned here.

### Counter

Stable Store-bound counter identity and activation/enrollment context.

## Identity & Access

### UserAccount

User identity, authentication/activation references and assignments.
Historical actor identity survives deactivation.

### Role

Permission-set lifecycle.

### OverrideAuthorization

Short-lived scoped approval with manager identity, action scope, reason
and expiry.

### SupportSession

Temporary support authorization, scope, consent/reference, expiry and
audit identity.

## Catalog

### Item

Company-wide Item identity. Owns Barcode/UoM/tracking attributes and
SupplierAssociation references. Referenced Item is not destructively
deleted.

### Category

Controlled category hierarchy identity.

### Brand

Reusable brand identity.

## Pricing

### ItemPriceSchedule

Store + Item scoped effective/future selling-price history. Produces
immutable `PriceSnapshot` inputs for Sales.

## Procurement

### Supplier

Company-wide Supplier identity, business/contact/terms context, status
and supplier-item associations.

### PurchaseOrder

Owns PO header/lines, approval state, ordered quantity, received
allocation/remaining receivable state and closure/cancellation. Linked
GRN posting revalidates and updates receipt allocation atomically.

### GoodsReceipt

Owns received commercial document/lines, supplier/source PO references,
quantity/free quantity, acquisition-value inputs, batch/expiry capture
and posting state.

### PurchaseReturn

Owns supplier-return commercial document/lines, source GRN reference
where used, reason, commercial correction inputs and posting state.

## Inventory

### InventoryPosition

Consistency root for exactly one Item × Store.

Owns: - total on-hand; - quantities by `StockBucket/Disposition`; -
batch/expiry sub-position facts where tracking applies; - current
operational moving WAC; - concurrency/version boundary.

Accepted stock changes create immutable `StockMovement` facts. Sale
availability uses policy-eligible sellable quantity, not
undifferentiated total quantity.

### StockCount

Count scope/session, captured physical observations, discrepancy,
approval and adjustment-posting request. Completion never directly
overwrites InventoryPosition; it creates explicit adjustment effects.

## Sales

### Sale

Owns commercial Sale identity, SaleLine entities,
customer/item/price/tax snapshots, totals, BusinessContext and
lifecycle.

A posted Sale is immutable. Held-sale concurrency is guarded by Sale
identity/version/claim semantics. Sale does not own stock, credit
exposure, provider state or shift cash.

## Payments

### CheckoutPayment

Owns the payment process for one checkout: - PaymentAttempt; -
PaymentCommitment; - PostedTender settlement facts; - remaining due; -
split-tender/recovery state.

A confirmed commitment cannot be deleted. PostedTender is owned by
Payments and references the posted Sale it settles.

### RefundExecution

Owns execution of one intended refund settlement operation against a
Return-owned RefundObligation: - RefundExecutionId; -
RefundAttempt(s); - manual/external/integrated reference; -
pending/failed/uncertain/confirmed outcome; - idempotency/reconciliation
state.

RefundExecution does not own the commercial Return or inventory effect.

## Returns

### SalesReturn

Owns ReturnLine entities, original Sale/line linkage where available,
reason/approval, requested inventory disposition, commercial return
totals and `RefundObligation`.

`SalesReturnStatus` and `RefundObligationStatus` are separate state
dimensions.

Concurrent linked returns must revalidate remaining eligible SaleLine
quantity/value under the original-sale/line consistency key.

## Customer & Credit

### Customer

Company-wide Customer identity/profile/privacy context. Material
concurrent edits require explicit conflict handling.

### CreditAccount

Authoritative retail credit eligibility/exposure root. Owns immutable
`CreditLedgerEntry` facts and posting-time exposure revalidation.

### CustomerCollection

Collection document/process, tender/source context, allocation intent
and posting/reversal identity. CreditAccount remains authoritative for
outstanding balance.

## Cash & Business Day

### CashierShift

Owns shift accountability, opening float, immutable `CashMovement`
facts, tender summaries, declared actual cash, expected cash, variance
and close state.

### BusinessDay

Owns Store + BusinessDate lifecycle, close prerequisites, closed-state
history and controlled exceptional transition seam.

## Accounting-Lite

### SupplierPayable

One supplier liability/obligation with source, due context, credits and
allocation state.

### SupplierPayment

One supplier payment with payment account/method,
allocations/unallocated amount and reversal identity.

### FinancialAccount

Controlled operational cash/bank account master. No online-banking
credential ownership.

### FinancialTransaction

Generic non-sale/non-purchase operational cash/bank receipt or payment
with category/counterparty/reason/source and immutable posting/reversal
semantics.

### AccountTransfer

One transfer identity coordinating equal source/destination value before
explicit fee/adjustment.

### ExpenseCategory

Controlled reusable expense classification hierarchy/lifecycle.

### Expense

Business expense document with amount/category/payee/reference, payment
account/method, approval and reversal.

### ReconciliationSession

Account/period reconciliation, ReconciliationMatch facts, unmatched
items, explicit differences/adjustments and completion.

### FinancialMovement --- immutable domain fact

Not an aggregate root. Every posted Accounting-Lite balance-affecting
operation produces immutable source-linked movement fact(s).
FinancialAccount balances are derived/maintained from these facts and
are never directly overwritten.

## Country Policy

### CountryRuleSet

Versioned/effective verified policy identity supplying tax, rounding,
document, payment and compliance behavior. Superseding a rule set never
rewrites posted history.
