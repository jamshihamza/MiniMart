# MiniMart Domain Model v1.0 — FROZEN

**Document ID:** MM-DM-001-FROZEN\
**Status:** FROZEN BASELINE\
**Source authority:** MiniMart FRS v1.0 FROZEN + NFRS v1.0 + frozen
Decision Register

## 1. Modeling rules

1.  Business meaning precedes persistence shape.
2.  Aggregate boundaries express consistency/ownership, not screens or
    tables.
3.  One local transaction may coordinate several aggregates without
    merging them into one giant aggregate.
4.  Module-owned state is accessed only through the owning module's
    public domain/application contract.
5.  Posted financial/stock facts are immutable; correction uses explicit
    reversal/compensation.
6.  External payment/refund outcomes and local posting are separate
    facts.
7.  Local atomic invariants are enforced synchronously inside the local
    Unit of Work; outbox events do not repair partial local posting.
8.  Item, Supplier and Customer identity are company/tenant-wide.
9.  Inventory quantity/WAC and selling-price assignment are
    store-scoped.
10. Country behavior is version/effective aware and historical outcomes
    are preserved.
11. Open/Verify/Deferred/Proposed decisions remain explicit seams.

## 2. Bounded contexts and aggregate roots

  ------------------------------------------------------------------------
  Context                 Classification          Aggregate roots
  ----------------------- ----------------------- ------------------------
  Organization            Supporting              Company, Store, Counter

  Identity & Access       Supporting              UserAccount, Role,
                                                  OverrideAuthorization,
                                                  SupportSession

  Catalog                 Core-supporting         Item, Category, Brand

  Pricing                 Core-supporting         ItemPriceSchedule

  Procurement             Core                    Supplier, PurchaseOrder,
                                                  GoodsReceipt,
                                                  PurchaseReturn

  Inventory               Core                    InventoryPosition,
                                                  StockCount

  Sales                   Core                    Sale

  Payments                Core                    CheckoutPayment,
                                                  RefundExecution

  Returns                 Core                    SalesReturn

  Customer & Credit       Core-supporting         Customer, CreditAccount,
                                                  CustomerCollection

  Cash & Business Day     Core-supporting         CashierShift,
                                                  BusinessDay

  Accounting-Lite         Supporting              SupplierPayable,
                                                  SupplierPayment,
                                                  FinancialAccount,
                                                  FinancialTransaction,
                                                  AccountTransfer,
                                                  ExpenseCategory,
                                                  Expense,
                                                  ReconciliationSession

  Country Policy          Supporting/policy       CountryRuleSet
  ------------------------------------------------------------------------

**Total: 13 bounded contexts / 35 aggregate roots.**

Audit, reporting, import/export, hardware, backup/recovery, support
diagnostics and synchronization/outbox are
cross-cutting/application/infrastructure capabilities unless a later
approved requirement gives them an independent business lifecycle.

## 3. Critical ownership

### Organization

Owns Company/Store/Counter identity, timezone and store configuration.
It does **not** own operational BusinessDate state.

### Cash & Business Day

Owns BusinessDay and resolves the operational `BusinessDate` for a
Store. Other contexts receive that resolved value in `BusinessContext`.

### Procurement

Owns company-wide Supplier, PO commitment/remaining-receivable state,
GoodsReceipt and PurchaseReturn.

### Inventory

`InventoryPosition = ItemId × StoreId`. It owns authoritative local
stock quantity, disposition buckets and operational moving WAC. Accepted
changes create immutable StockMovement facts.

### Sales

Sale owns commercial lines, snapshots, totals and Sale lifecycle. It
does not own stock, provider state, credit exposure or shift state.

### Payments

`CheckoutPayment` owns checkout PaymentAttempt, PaymentCommitment and
PostedTender settlement facts.\
`RefundExecution` owns refund execution attempts/results against a
Return-owned RefundObligation.

### Returns

SalesReturn owns commercial return lines, disposition request and
`RefundObligation`. Return posting status is separate from
refund-settlement status.

### Customer & Credit

Customer owns customer master identity/profile. CreditAccount owns
credit eligibility/exposure and immutable CreditLedgerEntry facts.
CustomerCollection owns a collection document/process.

### Cash & Business Day

CashierShift owns cash accountability and immutable CashMovement facts.
BusinessDay owns operating-day lifecycle/close state.

### Accounting-Lite

Owns supplier liability/payment, controlled FinancialAccount master,
immutable FinancialMovement facts, non-sale FinancialTransaction,
AccountTransfer, ExpenseCategory/Expense and ReconciliationSession.

### Country Policy

CountryRuleSet owns verified version/effective policy identity. Posted
documents retain the rule-set reference and calculated outcome needed to
preserve history.

## 4. Entity/domain-fact catalog

Important non-root objects include:

-   PurchaseOrderLine, GoodsReceiptLine, PurchaseReturnLine;
-   InventoryBucketPosition, BatchPosition, StockMovement;
-   SaleLine;
-   PaymentAttempt, PaymentCommitment, PostedTender;
-   ReturnLine, RefundObligation;
-   RefundAttempt;
-   CreditLedgerEntry, CollectionAllocation;
-   CashMovement;
-   SupplierPayableAllocation, SupplierPaymentAllocation;
-   FinancialMovement;
-   ReconciliationMatch.

These are not independent aggregate roots unless a later approved
requirement gives them an independent lifecycle.

## 5. Posting-envelope rule

A **Posting Envelope** is an application-level orchestration boundary
that coordinates module-owned aggregate operations under one local
database transaction/Unit of Work.

The coordinator: 1. loads/revalidates required consistency roots through
public module ports; 2. invokes domain operations; 3. persists all
required local effects atomically; 4. persists audit + outbox records in
the same transaction; 5. commits once; 6. only after commit allows
outbox publication/projections/sync.

It never performs direct cross-module internal-table writes.

Complete envelope definitions are in
`11-TRANSACTION-AND-CONCURRENCY-MATRIX.md`.

## 6. External money rule

Provider/manual monetary outcomes cannot participate in the local
database transaction.

Canonical checkout path:

`PaymentAttempt → external/manual outcome → PaymentCommitment → local Sale Posting Envelope → PostedTender`

Canonical refund path when settlement execution is distinct/asynchronous:

`RefundObligation → RefundExecution/RefundAttempt → outcome → obligation settlement/reconciliation`

An immediate authorized cash/manual settlement may create and settle the RefundObligation inside the Return Posting Envelope without requiring a long-lived asynchronous RefundExecution. The settlement action still has stable idempotency/audit identity.

A confirmed outcome is durable and must never be silently forgotten or
charged/refunded again.

## 7. Historical immutability

Posted Sale, GoodsReceipt, PurchaseReturn, SalesReturn, PostedTender,
StockMovement, CreditLedgerEntry, CashMovement, FinancialMovement and
Accounting-Lite posted documents are immutable facts.

Correction uses reversal, compensating document/movement, explicit
refund/reversal or approved adjustment.

## 8. Concurrency rule

The Domain Model defines **business consistency keys and posting-time
revalidation**, not PostgreSQL mechanics.

Required consistency keys are listed in
`11-TRANSACTION-AND-CONCURRENCY-MATRIX.md`. The Database Model may
choose row locks, optimistic versions, uniqueness constraints or
serializable sections, but may not weaken the business invariant.

## 9. Decision governance

Every non-resolved frozen Decision Register item is mapped in
`13-DECISION-SEAM-MATRIX.md`.

`PROPOSED` is not silently promoted to approved behavior.\
`OPEN` is not guessed.\
`VERIFY` requires authoritative verification.\
`DEFERRED` remains outside the current implementation scope unless
explicitly activated.

## 10. Boundary to later stages

Database Model decides tables, keys, constraints, indexes, locking and
transaction implementation.\
API Contracts decide endpoints/DTOs/transport errors.\
UI Specification decides screens/interactions.\
None may redefine these domain ownership/lifecycle invariants without
approved change control.

## 11. Frozen baseline gate

This Domain Model is frozen as **MiniMart Domain Model v1.0**.

Downstream Database, API, UI and implementation work must conform to these ownership, lifecycle, transaction, concurrency and decision-seam invariants. A semantic change requires explicit specification change control rather than silent reinterpretation.
