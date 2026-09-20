# Customer Credit, Cash and Accounting-Lite --- v0.2

## 1. Customer Credit

CreditAccount is the authoritative retail credit exposure root.

`Outstanding = Charges - EffectiveCredits - EffectiveCollections + ApprovedDebitAdjustments`

Each effect is represented by immutable `CreditLedgerEntry` with
source/idempotency identity.

Posting-time credit evaluation and application use the same
`CreditAccountId` consistency boundary so concurrent counters cannot
silently oversubscribe approved policy.

CustomerCollection is a separate document aggregate; posting coordinates
its CreditAccount effect and money/cash effect atomically.

## 2. Cashier Shift

CashierShift owns immutable `CashMovement` facts.

Expected cash:

`OpeningFloat + CashSales + CashCollections + ApprovedCashIn - CashRefunds - ApprovedCashOut`

Actual cash is independently declared/count-derived.

`Variance = ActualCash - ExpectedCash`

Source transactions are never rewritten to force a zero variance.

## 3. BusinessDate / BusinessDay

Cash & Business Day owns BusinessDay lifecycle and operational
BusinessDate resolution. Organization supplies timezone/store
configuration only.

BusinessDate may differ from wall-clock calendar date. Other contexts
preserve the resolved BusinessDate in posted BusinessContext.

## 4. Accounting-Lite

Accounting-Lite is operational financial control, not a full
statutory/general ledger.

### SupplierPayable

Source-linked supplier obligation. Concurrent allocations
serialize/revalidate by SupplierPayableId.

### SupplierPayment

Payment document with one/more allocations and unallocated amount where
policy permits. Posting also creates FinancialMovement effect.

### FinancialAccount

Controlled cash/bank account master.

### FinancialMovement

Immutable source-linked money movement fact. Operational balance is
derived/maintained from movements, never directly edited.

### FinancialTransaction

Generic authorized non-sale/non-purchase cash/bank receipt/payment with
source/category/counterparty/reason and reversal semantics.

### AccountTransfer

One transfer identity; source and destination FinancialMovement facts
post atomically. Retry cannot duplicate either side.

### ExpenseCategory

Controlled reusable expense classification.

### Expense

Expense document with category, payee/reference, payment account/method,
approval and explicit reversal/correction.

If paid from controlled store cash, Expense posting coordinates the
corresponding CashierShift cash-out effect.

### ReconciliationSession

Matches FinancialMovement facts to external evidence/statement
references. Difference is explicit and source transactions are not
rewritten.

## 5. Source-of-truth matrix

  -----------------------------------------------------------------------
  Business fact                       Owner
  ----------------------------------- -----------------------------------
  Customer identity                   Customer & Credit / Customer

  Customer credit exposure            Customer & Credit / CreditAccount

  Supplier identity                   Procurement / Supplier

  Supplier liability                  Accounting-Lite / SupplierPayable

  Sale commercial document            Sales / Sale

  Payment                             Payments / CheckoutPayment
  attempts/commitments/PostedTender   

  Refund execution attempts           Payments / RefundExecution

  Refund obligation                   Returns / SalesReturn

  Stock quantity/disposition/WAC      Inventory / InventoryPosition

  Shift expected/actual cash          Cash & Business Day / CashierShift

  BusinessDate lifecycle              Cash & Business Day / BusinessDay

  Operational cash/bank movement      Accounting-Lite / FinancialMovement

  Tax/rounding policy                 Country Policy / CountryRuleSet
  -----------------------------------------------------------------------
