# MiniMart Database Model v0.1 --- Deep Consistency Review

**Document ID:** MM-DB-REV-001\
**Reviewed baseline:** MiniMart Database Model v0.1\
**Upstream authority:** MiniMart Domain Model v1.0 FROZEN\
**Review verdict:** **DO NOT FREEZE --- REMEDIATION REQUIRED**

## Executive result

The Database Model v0.1 is a useful working baseline, but the deep
review found issues that must be corrected before a v0.2 Freeze
Candidate is created.

  Measure                                                Result
  ---------------------------------------------------- --------
  Logical catalog tables                                     74
  Tables represented in reference DDL                        30
  Catalog tables absent from reference DDL                   44
  Frozen aggregate roots                                     35
  Frozen decision seams                                      60
  Decision IDs explicitly mapped in DB seam document          0
  Freeze blockers                                             7
  Major findings                                              8
  Minor findings                                              0

## What passed

The review confirms that v0.1 correctly preserves these fundamental
directions:

-   PostgreSQL as Store Node database;
-   UUIDv7 application-generated identities;
-   exact decimal rather than floating point;
-   company-wide Item/Supplier/Customer and store-scoped
    stock/WAC/price;
-   PaymentCommitment distinct from PostedTender;
-   SalesReturn distinct from RefundObligation/RefundExecution;
-   immutable stock/credit/cash/financial facts as the intended history
    model;
-   explicit BusinessDate;
-   same-transaction Audit + Outbox intent;
-   external provider calls outside local database transactions;
-   open policy decisions are generally not hard-coded.

These strengths are not enough for freeze because the physical
enforcement/coverage is incomplete in several high-risk areas.

## Freeze blockers and major findings

### DBR-BLK-001 --- Reference physical schema covers only 30 of 74 catalog tables

**Severity:** BLOCKER\
**Area:** Physical completeness

**Evidence:** 30 CREATE TABLE definitions exist; 44 catalog tables have
no reference DDL.

**Risk:** A freeze candidate cannot be deeply checked for keys, tenant
isolation, lifecycle constraints, indexes, immutability or transaction
support across all frozen aggregate roots.

**Required remediation:** Produce complete v0.2 reference DDL/logical
column model for all 74 tables, even if production migrations remain
later.

### DBR-BLK-002 --- Owned-child foreign keys do not consistently enforce tenant agreement

**Severity:** BLOCKER\
**Area:** Tenant isolation / referential integrity

**Evidence:** Examples include item_barcodes→items,
inventory_bucket_positions→inventory_positions, sale_lines→sales,
payment attempts/commitments/tenders→checkout_payments, return
lines/obligations→sales_returns, credit ledger→credit_accounts and cash
movements→shifts using parent ID alone while the child also stores
tenant_id.

**Risk:** A malformed/buggy write can persist tenant_id=A on a child
whose parent belongs to tenant B. Global UUID uniqueness does not prove
tenant equality.

**Required remediation:** For every tenant-bearing owned relationship,
either use composite tenant-scoped FK `(tenant_id,parent_id)` to a
matching UNIQUE key, or remove redundant child tenant_id and derive
tenant through the parent. Document one consistent rule.

### DBR-BLK-003 --- Database decision-seam treatment is not traceable to all 60 frozen Decision IDs

**Severity:** BLOCKER\
**Area:** Decision governance

**Evidence:** Frozen Domain Model contains 60 non-resolved/verification
Decision IDs; the database treatment document explicitly cites only 0
IDs.

**Risk:** Conceptual prose cannot prove that every
OPEN/PROPOSED/VERIFY/DEFERRED seam survived physical design without
accidental resolution.

**Required remediation:** Create a 60/60 Decision-ID matrix with
database columns/constraints/indexes/migrations affected and an explicit
'not resolved here' treatment.

### DBR-BLK-004 --- Physical transaction specification is incomplete versus the frozen posting-envelope matrix

**Severity:** BLOCKER\
**Area:** Transaction envelopes

**Evidence:** Detailed database flows exist for Sale, Goods Receipt,
Sales Return, Refund and generic credit/Stock Count, but Purchase
Return, Customer Collection, Supplier Payment, Financial
receipt/payment, Account Transfer, Expense and Manual cash-in/out lack
equivalent lock/revalidation/write/source-uniqueness sequences.

**Risk:** The most important cross-context atomicity guarantee can
diverge by implementation path.

**Required remediation:** Define all 13 frozen local posting envelopes
with exact lock roots/order, revalidation, immutable facts, maintained
balances, Audit, Outbox and idempotency behavior.

### DBR-BLK-005 --- Cumulative Sales/Purchase return eligibility has no concrete PostgreSQL serialization mechanism

**Severity:** BLOCKER\
**Area:** Concurrency

**Evidence:** v0.1 says to acquire source consistency keys/advisory
guards and scan posted return facts, but does not define whether the
source line is row-locked, which advisory key is used, or how two
concurrent returns are serialized.

**Risk:** Two counters can both observe remaining returnable quantity
and over-return the same SaleLine/GRNLine.

**Required remediation:** Choose a physical serialization strategy that
does not change business policy: e.g. `SELECT ... FOR UPDATE` on
immutable source line solely as a mutex, or transaction-scoped advisory
lock derived from tenant+source-line identity; then query cumulative
effective returns under that lock.

### DBR-BLK-006 --- Maintained balances lack complete database reconciliation invariants

**Severity:** BLOCKER\
**Area:** Ledger/current-state reconciliation

**Evidence:** InventoryPosition/on_hand, bucket positions,
CreditAccount.outstanding, CashierShift.expected_cash and
FinancialAccount.current_balance are maintained beside immutable
ledgers, but v0.1 does not specify authoritative equations, drift
detection, rebuild rules or same-source uniqueness for each.

**Risk:** A crash/bug/migration can leave current balances inconsistent
with immutable facts while both appear valid.

**Required remediation:** Define invariant equations, update source
identity, reconciliation queries, repair policy and acceptance tests for
Inventory, Credit, Cash and Financial balances. Explicitly define
`on_hand = Σ bucket quantities` where buckets are active.

### DBR-BLK-007 --- Idempotency and inbox deduplication transaction semantics are not sufficiently precise

**Severity:** BLOCKER\
**Area:** Idempotency / inbox atomicity

**Evidence:** A unique idempotency key exists, but v0.1 does not define
claim/in-progress/completed race handling or fingerprint mismatch
behavior. Inbox receipt is described as 'before/with' application rather
than explicitly committed atomically with the applied incoming effect.

**Risk:** Concurrent retries can race; a crash can record a message
without applying it or apply it without durable dedup evidence.

**Required remediation:** Specify idempotency state machine and
locking/insert-on-conflict behavior; require inbox receipt + incoming
business effect + resulting outbox/audit to commit in the same
transaction.

### DBR-MAJ-001 --- `numeric(24,8)` is selected without documented capacity proof

**Severity:** MAJOR\
**Area:** Numeric precision

**Evidence:** The type is consistently proposed, but maximum document
totals, cumulative balances, quantities, WAC and intermediate
multiplication/division bounds are not proven.

**Risk:** Rare large values or intermediate calculations can
overflow/round unexpectedly despite using exact decimal.

**Required remediation:** Create a precision budget per value class and
boundary tests; widen types if necessary. Legal/display rounding remains
CountryRuleSet policy.

### DBR-MAJ-002 --- Append-only protection is described but not physically specified

**Severity:** MAJOR\
**Area:** Immutability

**Evidence:** v0.1 mentions repository permissions/status-aware
predicates/trigger protection, while reference DDL contains no
immutable-table UPDATE/DELETE guard strategy.

**Risk:** A defect or support script could rewrite stock, tender,
credit, cash, financial or audit history.

**Required remediation:** Specify DB role privileges and/or immutable
triggers for high-risk ledger/fact tables, with an explicit controlled
migration/repair path.

### DBR-MAJ-003 --- Outbox publisher claim/lease behavior is unspecified

**Severity:** MAJOR\
**Area:** Outbox concurrency

**Evidence:** Pending index and retry fields exist, but no
`FOR UPDATE SKIP LOCKED`, lease/claim, worker ownership or
crash-after-publish behavior is defined.

**Risk:** Multiple workers may duplicate work or stall rows.
At-least-once behavior is not explicit.

**Required remediation:** Define outbox dispatch concurrency and
at-least-once semantics; rely on event ID/inbox dedup for duplicate
delivery.

### DBR-MAJ-004 --- Moving-WAC physical update and audit evidence are under-specified

**Severity:** MAJOR\
**Area:** WAC reproducibility

**Evidence:** GRN says update WAC and stock movements store
unit_cost/value_delta, but prior/new quantity/value/WAC derivation,
zero-stock reset behavior and deterministic discount/tax acquisition
allocation evidence are not fully specified.

**Risk:** Costing may be correct operationally but difficult to
reproduce/reconcile after failure or migration.

**Required remediation:** Define WAC transaction formula inputs, stored
evidence and reconciliation query, including free quantity, allocated
discounts, recoverable/non-recoverable tax classification and
purchase-return treatment.

### DBR-MAJ-005 --- Tender/refund materialization uniqueness is incomplete

**Severity:** MAJOR\
**Area:** Payment/refund source identity

**Evidence:** `posted_tenders` uniquely constrains nullable
`payment_commitment_id`; manual/cash paths and
RefundExecution/RefundObligation linkage are not yet physically complete
because relevant catalog tables are absent from reference DDL.

**Risk:** A retry may materialize duplicate settlement facts on paths
without a non-null commitment.

**Required remediation:** Define a non-null logical settlement source
identity/idempotency key for every PostedTender and refund settlement
path.

### DBR-MAJ-006 --- Index strategy is illustrative rather than workload-complete

**Severity:** MAJOR\
**Area:** Index/query coverage

**Evidence:** Only core examples are listed; the 74-table model has no
query-to-index matrix for barcode, item search, document lookup, event
search, allocations, reconciliation, sync and posting locks.

**Risk:** Correctness may survive but Phase-1 performance targets and
lock efficiency may fail at realistic volume.

**Required remediation:** Create query/index coverage matrix with
expected cardinality/selectivity and EXPLAIN/benchmark acceptance
targets.

### DBR-MAJ-007 --- Cross-schema migration ordering and application/schema compatibility contract need concrete design

**Severity:** MAJOR\
**Area:** Migration compatibility

**Evidence:** Expand/contract is stated, but 15-schema dependency
ordering, migration lock, partially applied migration recovery and Store
Node startup compatibility range are not specified.

**Risk:** Interrupted upgrades can leave a store unable to trade or
allow incompatible code to write.

**Required remediation:** Define migration ledger/lock, module
dependency order, transactional vs non-transactional migration rules,
compatibility range and recovery procedure.

### DBR-MAJ-008 --- Frozen lifecycle constraints are not enumerated table-by-table

**Severity:** MAJOR\
**Area:** Lifecycle constraints

**Evidence:** Status is mostly `varchar(40)` and the model says CHECK
constraints should be used 'where frozen', but there is no authoritative
status/transition constraint matrix.

**Risk:** Persistence can accept impossible states even when the Domain
Model has frozen lifecycle rules.

**Required remediation:** Create lifecycle persistence matrix: allowed
stored states, required companion timestamps/amounts, transition
enforcement location and invariants for Sale, payment
attempts/commitments, Return, RefundObligation/Execution, shifts,
BusinessDay and procurement documents.

## Missing reference-DDL coverage

The following 44 catalog tables are not yet represented in the reference
DDL:

`accounting.account_transfers, accounting.expense_categories, accounting.expenses, accounting.financial_transactions, accounting.reconciliation_matches, accounting.reconciliation_sessions, accounting.supplier_payable_allocations, accounting.supplier_payables, accounting.supplier_payment_allocations, accounting.supplier_payments, cash.shift_tender_summaries, catalog.brands, catalog.categories, catalog.item_categories, catalog.item_uoms, country.country_rule_values, customer.collection_allocations, customer.customer_collections, customer.customers, iam.override_authorizations, iam.permissions, iam.role_permissions, iam.roles, iam.support_sessions, iam.user_accounts, iam.user_roles, integration.dead_letters, integration.sync_checkpoints, inventory.inventory_batches, inventory.stock_count_lines, inventory.stock_counts, payments.refund_attempts, payments.refund_executions, pricing.item_price_entries, pricing.item_price_schedules, procurement.goods_receipt_lines, procurement.goods_receipts, procurement.purchase_order_lines, procurement.purchase_orders, procurement.purchase_return_lines, procurement.purchase_returns, procurement.supplier_items, procurement.suppliers, sales.sale_state_history`

This is acceptable for a v0.1 working baseline, but not for a freeze
candidate because their constraints and transaction participation cannot
yet be independently reviewed.

## Tenant-FK observation

The reference DDL contains 16 FK/reference lines. Only 2 use an explicit
composite `(tenant_id, parent_id)` pattern.

This does not mean every remaining FK is necessarily wrong; some
references may deliberately omit duplicated tenant columns. However,
**where both child and parent store tenant_id, the database must prevent
disagreement**.

## Decision-seam coverage

The frozen Domain Model carries 60 non-resolved/verification decision
seams. The current Database Model treatment is concept-oriented and
explicitly cites only 0 Decision IDs.

v0.2 must include a machine-checkable **60/60 Decision-ID matrix**. A
seam can be marked `NO PHYSICAL EFFECT`, but it cannot be omitted.

## Required v0.2 remediation sequence

1.  Complete all 74 table definitions and column/key ownership.
2.  Normalize tenant-safe FK strategy.
3.  Add 60/60 Decision-ID database treatment matrix.
4.  Complete all 13 posting-envelope physical transaction
    specifications.
5.  Define return-over-allocation serialization.
6.  Define maintained-balance reconciliation equations and drift
    detection.
7.  Harden idempotency/inbox atomicity.
8.  Add WAC evidence/reconciliation specification.
9.  Add immutable-ledger DB protection strategy.
10. Complete settlement-source uniqueness.
11. Build lifecycle constraint matrix.
12. Build query/index coverage matrix.
13. Define outbox worker concurrency.
14. Define migration compatibility/recovery contract.
15. Run multi-counter concurrency and failure-mode validation against
    the completed model.

## Gate

**Database Model v0.1 must not be frozen.**

After the findings above are remediated and revalidated, create:

**MiniMart Database Model v0.2 --- Freeze Candidate**

Do not begin API Contracts from v0.1. The next artifact should be the
remediated Database Model v0.2, followed by its final freeze review.
