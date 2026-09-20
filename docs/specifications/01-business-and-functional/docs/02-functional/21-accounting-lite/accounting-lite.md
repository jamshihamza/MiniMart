# MiniMart Accounting-Lite Functional Specification --- v0.8

**Document ID:** MM-FRS-ACC-001\
**Requirement namespace:** `FR-ACC-001`--`FR-ACC-050`\
**Status:** Detailed Remediation Draft\
**Scope:** operational accounting-lite only; not a full general ledger

## Purpose

Close the BRD-approved Phase-2 gap for supplier liabilities, customer
receivable linkage, cash/bank movements, expenses and accountant exports
while preserving MiniMart's modular-monolith and immutable-posting
rules.

## Boundary

Accounting-Lite records operational financial obligations and movements.
It does **not** claim statutory accounting completeness,
chart-of-accounts design, journal-entry automation, financial statements
or country-specific tax compliance. Those require later professional
accounting validation.

## Requirements

### FR-ACC-001 --- Accounting-lite boundary

**Source:** BR-ACC-001\
**Priority:** MUST\
**Phase:** 2

MiniMart shall maintain operational financial records sufficient to
explain supplier liabilities, customer receivables, cash/bank movements,
expenses and accountant exports without claiming to be a full general
ledger.

**Acceptance:** Operational balances trace to posted source entries.

### FR-ACC-002 --- No full-GL claim

**Source:** BR-ACC-007\
**Priority:** MUST\
**Phase:** 2

Accounting-lite shall not silently introduce full double-entry/statutory
accounting behavior before professional accounting validation.

**Acceptance:** Product UI/spec clearly distinguishes operational
records from full accounting.

### FR-ACC-003 --- Exact money

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 2

All accounting-lite monetary values shall use exact decimal/minor-unit
handling and defined rounding.

**Acceptance:** Recalculation is deterministic.

### FR-ACC-004 --- Stable entry identity

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 2

Every operational financial entry shall have a stable unique identity
and source reference.

**Acceptance:** Retry/reconciliation can identify the same entry.

### FR-ACC-005 --- Posted-entry immutability

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 2

Posted accounting-lite entries shall not be edited to rewrite financial
history.

**Acceptance:** Correction uses reversal/adjustment.

### FR-ACC-006 --- Correction by reversal

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 2

Incorrect posted operational financial entries shall be corrected by
explicit reversal/correction with reason and linkage.

**Acceptance:** Original and correction remain traceable.

### FR-ACC-007 --- Atomic source effect

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 2

Where a business document creates an accounting-lite effect locally, its
required operational financial entry shall be committed atomically with
that document when they share the same local transaction boundary.

**Acceptance:** No posted source document silently misses its required
operational financial effect.

### FR-ACC-008 --- Audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 2

Posting, reversing and approving accounting-lite entries shall be
audited.

**Acceptance:** Actor/time/reason/source are available.

### FR-ACC-009 --- Permissions

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Viewing/posting/reversing sensitive financial records shall require
appropriate permissions.

**Acceptance:** Cashier access does not imply accounting access.

### FR-ACC-010 --- Historical meaning

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 2

Later supplier/customer/account/category changes shall not silently
change posted financial history.

**Acceptance:** Historical entry remains explainable.

### FR-ACC-011 --- Supplier payable creation

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

A posted supplier purchase/GRN or approved supplier invoice basis shall
create/update the corresponding supplier payable obligation according to
configured workflow.

**Acceptance:** Supplier outstanding increases exactly once.

### FR-ACC-012 --- Supplier payable source

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

Each supplier payable shall retain supplier, source document, document
date/business date, amount, currency and due-date/terms context where
used.

**Acceptance:** Outstanding is explainable.

### FR-ACC-013 --- Supplier payable return/credit

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

Posted purchase returns/supplier credits shall reduce or adjust supplier
outstanding without rewriting the original payable.

**Acceptance:** Net liability reconciles to source documents.

### FR-ACC-014 --- Supplier payment

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

Authorized users shall record payment to a supplier against an eligible
outstanding liability.

**Acceptance:** Payment reduces supplier outstanding exactly once.

### FR-ACC-015 --- Supplier payment tender/account

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Supplier payment shall identify the cash/bank/payment account or method
from which value was paid.

**Acceptance:** Cash/bank movement is traceable.

### FR-ACC-016 --- Supplier payment allocation

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

Supplier payment may be allocated to one or more eligible supplier
obligations according to explicit allocation rules.

**Acceptance:** Allocated and unallocated amounts reconcile.

### FR-ACC-017 --- Supplier unallocated payment

**Source:** BR-ACC-002\
**Priority:** SHOULD\
**Phase:** 2

If policy permits supplier advance/unallocated payment, that state shall
be explicit and not represented as a fake invoice allocation.

**Acceptance:** Advance remains visible.

### FR-ACC-018 --- Supplier payment reversal

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

Incorrect supplier payment shall be reversed/corrected explicitly rather
than deleted.

**Acceptance:** Outstanding is restored reproducibly.

### FR-ACC-019 --- Supplier statement

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

Authorized users shall view supplier
opening/transactions/payments/credits/closing outstanding for a selected
period.

**Acceptance:** Statement reconciles to source entries.

### FR-ACC-020 --- Supplier aging boundary

**Source:** BR-ACC-002\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should support supplier outstanding by due/aging status where
terms are available.

**Acceptance:** Aging derives from source due dates.

### FR-ACC-021 --- Customer receivable linkage

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 1/2

Accounting-lite shall consume the Customer Credit ledger as the
authoritative customer receivable source rather than maintain a second
editable balance.

**Acceptance:** Customer outstanding has one authoritative operational
ledger.

### FR-ACC-022 --- Customer collection linkage

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 1/2

Posted customer collections shall create the corresponding cash/bank
movement and reduce customer outstanding according to Customer Credit
rules.

**Acceptance:** Collection is represented once across credit and
cash/bank views.

### FR-ACC-023 --- Customer return/credit linkage

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 1/2

Returns/credit adjustments against credit sales shall flow through
Customer Credit rules and accounting-lite reporting without direct
balance edits.

**Acceptance:** Receivable reduction traces to return/adjustment.

### FR-ACC-024 --- Financial account master

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

MiniMart shall maintain a controlled list of operational cash/bank
accounts used to classify money movement.

**Acceptance:** Movement references a valid active account.

### FR-ACC-025 --- Cash account

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Store cash/drawer settlement may map to an operational cash account
without replacing shift/day-close controls.

**Acceptance:** Accounting view reconciles to shift cash.

### FR-ACC-026 --- Bank account

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Authorized users shall configure operational bank accounts needed for
receipts/payments/reconciliation without storing online-banking
credentials.

**Acceptance:** Account identity is available without secret
credentials.

### FR-ACC-027 --- Cash/bank receipt

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Authorized non-sale receipts shall be recordable with
source/category/counterparty/reason where applicable.

**Acceptance:** Receipt increases selected operational account exactly
once.

### FR-ACC-028 --- Cash/bank payment

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Authorized non-purchase payments shall be recordable with
source/category/counterparty/reason where applicable.

**Acceptance:** Payment reduces selected operational account exactly
once.

### FR-ACC-029 --- Account transfer

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Transfer between operational cash/bank accounts shall be represented as
one linked transfer with equal source/destination value before
fees/adjustments.

**Acceptance:** Transfer cannot create unexplained money.

### FR-ACC-030 --- Transfer retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 2

Retrying a transfer posting shall not duplicate either side.

**Acceptance:** One intended transfer is represented once.

### FR-ACC-031 --- Cash drawer boundary

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Cash-in/cash-out drawer movements remain governed by Shift/Day Close;
accounting-lite consumes their posted result rather than creating a
second drawer workflow.

**Acceptance:** Shift expected cash remains authoritative.

### FR-ACC-032 --- Bank reconciliation

**Source:** BR-ACC-004\
**Priority:** SHOULD\
**Phase:** 2

Authorized users should reconcile recorded bank movements against an
external statement/reference without altering original transactions.

**Acceptance:** Matched/unmatched state is visible.

### FR-ACC-033 --- Reconciliation difference

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

Reconciliation difference shall require explicit adjustment/reason
rather than silent balance overwrite.

**Acceptance:** Difference remains auditable.

### FR-ACC-034 --- Expense recording

**Source:** BR-ACC-005\
**Priority:** MUST\
**Phase:** 2

Authorized users shall record business expenses with date/business date,
amount, category, payment account/method, payee/reference and note as
applicable.

**Acceptance:** Expense appears in operational expense history.

### FR-ACC-035 --- Expense category

**Source:** BR-ACC-005\
**Priority:** MUST\
**Phase:** 2

Expense shall use a controlled category structure suitable for
management reporting/export.

**Acceptance:** Category is not arbitrary hidden text only.

### FR-ACC-036 --- Expense attachment/reference

**Source:** BR-ACC-005\
**Priority:** SHOULD\
**Phase:** 2

Expense may retain external bill/receipt/reference metadata or
attachment reference where supported.

**Acceptance:** Evidence can be linked without being required for every
expense.

### FR-ACC-037 --- Expense tax boundary

**Source:** BR-ACC-005\
**Priority:** MUST\
**Phase:** 2

Any tax classification/recoverability on expenses shall come from
verified country/accounting rules, not generic core assumptions.

**Acceptance:** Core expense workflow does not invent tax treatment.

### FR-ACC-038 --- Expense approval

**Source:** BR-SEC-004\
**Priority:** SHOULD\
**Phase:** 2

Expense posting above configured risk thresholds may require manager
approval.

**Acceptance:** Approver/reason are retained.

### FR-ACC-039 --- Expense reversal

**Source:** BR-ACC-005\
**Priority:** MUST\
**Phase:** 2

Posted expense correction shall use reversal/correction, not destructive
edit.

**Acceptance:** History remains auditable.

### FR-ACC-040 --- Expense cash-drawer interaction

**Source:** BR-ACC-004\
**Priority:** MUST\
**Phase:** 2

If an expense is paid from controlled store cash, the corresponding
drawer movement shall be linked and reflected in expected cash.

**Acceptance:** Expense does not create unexplained drawer variance.

### FR-ACC-041 --- Operational financial summary

**Source:** BR-ACC-001\
**Priority:** MUST\
**Phase:** 2

Authorized users shall view operational summaries for supplier
outstanding, customer outstanding, cash/bank movement and expenses.

**Acceptance:** Summary reconciles to underlying entries.

### FR-ACC-042 --- Source drill-down

**Source:** BR-ACC-001\
**Priority:** MUST\
**Phase:** 2

Financial summary/statement lines shall allow traceability to source
business document or operational entry where available.

**Acceptance:** User can explain a balance.

### FR-ACC-043 --- Period filtering

**Source:** BR-ACC-001\
**Priority:** MUST\
**Phase:** 2

Accounting-lite reports shall support explicit
date/business-date/store/account/counterparty filters as applicable.

**Acceptance:** Report basis is visible.

### FR-ACC-044 --- Opening balance migration

**Source:** BR-ACC-001\
**Priority:** MUST\
**Phase:** 2

Initial supplier/customer/account opening balances shall use controlled
migration/opening entries with effective date and audit evidence.

**Acceptance:** Opening balances are not hidden master edits.

### FR-ACC-045 --- No arbitrary balance edit

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 2

Users shall not directly overwrite supplier/customer/cash/bank balances.

**Acceptance:** Balance changes originate from posted entries.

### FR-ACC-046 --- Reconciliation control

**Source:** BR-ACC-001\
**Priority:** MUST\
**Phase:** 2

MiniMart shall provide reconciliation checks between operational
financial balances and their source modules where applicable.

**Acceptance:** Mismatch is surfaced, not silently corrected.

### FR-ACC-047 --- Accountant export

**Source:** BR-ACC-006\
**Priority:** MUST\
**Phase:** 2

Authorized users shall export accountant-ready operational financial
data in documented formats without changing source transactions.

**Acceptance:** Export totals reconcile to MiniMart.

### FR-ACC-048 --- Export traceability

**Source:** BR-ACC-006\
**Priority:** MUST\
**Phase:** 2

Accountant export shall include stable source identifiers and sufficient
classification/date/value context for downstream reconciliation.

**Acceptance:** Exported row can be traced back.

### FR-ACC-049 --- Offline operation

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 2

Store-local accounting-lite posting needed for store operations shall
remain available without cloud when Store Node/database are healthy.

**Acceptance:** Internet loss does not block permitted local
expense/payment records.

### FR-ACC-050 --- Accounting-lite acceptance suite

**Source:** BR-ACC-001, BR-ACC-007\
**Priority:** MUST\
**Phase:** 2

Acceptance tests shall cover supplier payable/payment/return, customer
collection linkage, expense paid from cash, bank movement/transfer,
reversal, retry, reconciliation and export.

**Acceptance:** Critical accounting-lite flows are regression-tested.

## Core integration rule

Accounting-Lite shall **consume posted facts from Purchasing, Customer
Credit, Shift/Day Close, Returns and Payments** rather than duplicate
those modules' business state. Where Accounting-Lite owns an operational
entry (for example an expense or supplier payment), that entry is
immutable after posting and corrected by reversal/correction.
