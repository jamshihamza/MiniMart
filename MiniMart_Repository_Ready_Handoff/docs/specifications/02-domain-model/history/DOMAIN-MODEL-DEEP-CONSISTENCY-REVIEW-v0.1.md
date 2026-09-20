# MiniMart Domain Model v0.1 --- Deep Consistency Review

**Document ID:** MM-DM-AUD-001\
**Review status:** COMPLETE\
**Freeze verdict:** **NOT READY AS v0.1 --- remediation required before
v0.2 Freeze Candidate**\
**Source:** MiniMart Domain Model v0.1 against MiniMart FRS/NFRS v1.0
FROZEN

## 1. Review scope

This review stress-tested:

-   aggregate and aggregate-root boundaries;
-   local transaction envelopes;
-   source-of-truth ownership;
-   Sale/Payment/Return/Refund lifecycles;
-   event ownership and causality;
-   cross-context dependency direction;
-   multi-counter/concurrent posting boundaries;
-   immutable-history rules;
-   inventory/WAC and stock-disposition semantics;
-   Customer Credit/Cash/Accounting-Lite interaction;
-   all remaining Decision Register seams.

The review deliberately does not design PostgreSQL tables, API DTOs or
UI screens.

## 2. Executive result

The v0.1 model is directionally sound and preserves the most important
frozen FRS semantics, but it should **not** be frozen unchanged.

The review found **5 freeze blockers** and **7 major consistency
defects**. None requires changing the frozen FRS. They are Domain Model
translation/precision defects and can be remediated in v0.2.

## 3. Freeze blockers

### DM-AUD-BLK-001 --- Refund execution has no explicit Payments aggregate owner

v0.1 says Payments owns refund attempts, but the only Payments aggregate
root is `CheckoutPayment`. A refund may occur after the checkout is
completed, may be manual/external/integrated, and may exist even when no
original provider session can be reused.

**Risk:** refund attempt identity, idempotency, uncertain state and
retry ownership become ambiguous.

**Required remediation:** add a Payments aggregate root
`RefundExecution`, linked to a Return-owned `RefundObligation`. Payments
owns refund attempts/provider/manual outcomes; Returns owns the
commercial obligation.

------------------------------------------------------------------------

### DM-AUD-BLK-002 --- Return posting status and refund settlement status are conflated

The v0.1 lifecycle diagram chains
`RETURN_POSTED → REFUND_OUTSTANDING → ...`, which makes refund
settlement look like a continuation of Return status. Frozen FRS
explicitly requires Return posting status and refund settlement status
to be separate.

It also fails to show the valid case where an immediate cash/manual
refund is already settled when the Return posts.

**Required remediation:** model two orthogonal lifecycles:

-   `SalesReturnStatus: DRAFT → POSTING → POSTED`
-   `RefundObligationStatus: OUTSTANDING / PENDING / UNCERTAIN / FAILED / SETTLED`

A Return may post with an obligation already `SETTLED` or still
outstanding.

------------------------------------------------------------------------

### DM-AUD-BLK-003 --- Required posting envelopes are incomplete

v0.1 defines Sale, Goods Receipt and Sales Return envelopes, but the FRS
also requires atomic or exactly-once coordination for other business
operations.

Missing/under-specified envelopes include:

-   PO-linked Goods Receipt + PO received allocation/revalidation;
-   Purchase Return + Inventory + supplier-liability/credit effect;
-   Stock Count completion + CountAdjustment effects;
-   Customer Collection + CreditAccount + cash/bank/shift effect;
-   Supplier Payment + payable allocations + FinancialAccount movement;
-   Expense + FinancialAccount/drawer effect;
-   Account Transfer + both financial-account sides;
-   cash-in/cash-out + CashierShift + Accounting-Lite linkage where
    enabled.

**Risk:** downstream database design could accidentally make these
partially posted.

**Required remediation:** define a complete transaction-envelope matrix
and application-level posting coordinator rule.

------------------------------------------------------------------------

### DM-AUD-BLK-004 --- Concurrency consistency keys are not explicit enough

The FRS contains hard concurrency requirements for stock, held sales, PO
receiving, sales returns, Customer Credit and customer edits. v0.1 names
some aggregates but does not state which consistency key must
serialize/revalidate each race.

Particularly important: - two returns against the same remaining
SaleLine quantity; - two GRNs against the same remaining PO line
quantity; - two credit sales against the same CreditAccount; -
concurrent stock-affecting postings against Item × Store; - two counters
completing the same held Sale.

**Required remediation:** add a concurrency matrix identifying
consistency key, owner, posting-time revalidation and prohibited race
outcome. Leave physical PostgreSQL locking strategy for the Database
Model.

------------------------------------------------------------------------

### DM-AUD-BLK-005 --- Decision-seam coverage is incomplete

`09-OPEN-DECISION-SEAMS.md` preserves important POS/credit/return
decisions, but it does not account for every non-resolved Decision
Register item.

Missing categories include PO optionality/approval/over-receipt,
duplicate supplier reference behavior, reorder ownership, opening
stock/go-live, suspended-credit override, simultaneous shifts, reporting
semantics, import retention/go-live controls, audit tamper evidence,
support/backup decisions and several proposed/verify country/hardware
decisions.

**Required remediation:** create a complete Decision Register → Domain
Treatment matrix classifying every non-resolved decision as
`DOMAIN POLICY`, `APPLICATION POLICY`, `INFRASTRUCTURE`,
`COMPLIANCE VERIFY`, or `DEFERRED`, with an explicit "must not assume"
rule.

## 4. Major findings

### DM-AUD-MAJ-001 --- Supplier aggregate is missing from the master aggregate table

The detailed Aggregate Catalog and machine registry include company-wide
`Supplier`, but `DOMAIN-MODEL.md` does not list it under Procurement.

**Remediation:** make the master catalog, registry and detailed catalog
identical.

### DM-AUD-MAJ-002 --- BusinessDate ownership is ambiguous

The context map says Organization provides BusinessDate context, while
`BusinessDay` is owned by Cash & Business Day.

**Remediation:** Organization supplies Store timezone/configuration;
Cash & Business Day resolves/owns operational BusinessDate state. Other
contexts receive `BusinessContext` containing the resolved BusinessDate.

### DM-AUD-MAJ-003 --- Accounting-Lite lacks explicit domain objects for required money movements

FRS requires non-sale cash/bank receipts/payments and controlled expense
categories. v0.1 has `FinancialAccount`, `AccountTransfer` and
`Expense`, but no explicit aggregate for generic non-sale
receipt/payment and no controlled `ExpenseCategory`.

**Remediation:** add `FinancialTransaction` and `ExpenseCategory`
aggregate roots plus immutable `FinancialMovement` facts.

### DM-AUD-MAJ-004 --- PostedTender ownership is ambiguous

v0.1 correctly distinguishes Payment Commitment from Posted Tender, but
does not clearly state whether PostedTender belongs to Sales or
Payments.

**Remediation:** Payments owns `PostedTender` as an immutable settlement
fact; the Sale stores settlement references/snapshot totals.
`TenderPosted` is emitted by Payments inside the Sale Posting Envelope.

### DM-AUD-MAJ-005 --- Inventory disposition is under-modeled

Returns require sellable/damaged/quarantine/other disposition. A single
undifferentiated Item × Store quantity is insufficient.

**Remediation:** InventoryPosition remains Item × Store, but owns
quantities by `StockBucket/Disposition` plus batch/expiry sub-position
where applicable. Sale availability consumes eligible sellable quantity
only. WAC remains Item × Store under the frozen baseline.

### DM-AUD-MAJ-006 --- Bidirectional context arrows need orchestration rules

Sales ↔ Payments and Returns ↔ Payments are legitimate collaborations,
but direct mutual domain dependencies would create cyclic module
coupling.

**Remediation:** define application-level coordinators
(`SalePostingCoordinator`, `ReturnPostingCoordinator`, etc.) that call
public domain ports under one Unit of Work. Contexts never read/write
each other's internal persistence.

### DM-AUD-MAJ-007 --- Event causality/producer ownership is insufficiently precise

Events such as `RefundSettled` and `RefundObligationSettled`, or
`SalePosted` and `TenderPosted`, can represent related facts in the same
transaction. v0.1 does not identify producer, causation or whether
events may be used to enforce local invariants.

**Remediation:** add producer/consumer rules,
`PostingEnvelopeId`/correlation/causation identity, and state that local
atomic invariants are enforced synchronously inside the
transaction---not by later outbox event consumption.

## 5. Aggregate-boundary stress test

  ----------------------------------------------------------------------------------------
  Boundary                Review result           Required action
  ----------------------- ----------------------- ----------------------------------------
  Sale                    Sound                   Keep separate from
                                                  Inventory/Payments/Credit

  CheckoutPayment         Sound for checkout      Add separate RefundExecution

  InventoryPosition Item  Sound                   Add disposition buckets and explicit
  × Store                                         concurrency key

  SalesReturn             Sound commercial root   Split Return status from
                                                  RefundObligation status

  CreditAccount           Sound                   Explicit posting-time
                                                  serialization/revalidation

  PurchaseOrder           Sound                   Include PO allocation/revalidation in
                                                  linked GRN envelope

  GoodsReceipt            Sound                   Clarify PO-linked transaction envelope

  SupplierPayable         Sound                   Clarify payment/allocation transaction
                                                  envelope

  CashierShift            Sound                   Define CashMovement fact and shift
                                                  consistency key

  BusinessDay             Sound                   Clarify BusinessDate ownership

  FinancialAccount        Sound                   Add
                                                  FinancialTransaction/FinancialMovement

  CountryRuleSet          Sound                   Keep verified/versioned policy boundary
  ----------------------------------------------------------------------------------------

## 6. Transaction-envelope stress test

**PASS:** Sale posting principle.\
**PASS with clarification:** Goods Receipt.\
**PASS with lifecycle correction:** Sales Return.\
**MISSING in v0.1:** Purchase Return, Stock Count, Customer Collection,
Supplier Payment, Expense, Account Transfer and explicit cash movement
coordination.

No external provider call may participate in a local database
transaction. A confirmed external outcome becomes a durable local
commitment/result first; the local posting envelope then consumes that
fact exactly once.

## 7. Concurrency stress test

The Domain Model must identify business consistency keys without
prematurely choosing PostgreSQL mechanics.

Required keys:

-   `SaleId` --- held/retrieved/completion race.
-   `ItemId + StoreId` --- stock/WAC race.
-   `PurchaseOrderId + POLineId` --- remaining receivable quantity.
-   `OriginalSaleId + SaleLineId` --- remaining returnable
    quantity/value.
-   `CreditAccountId` --- concurrent credit exposure.
-   `CustomerId` --- material profile edit conflict.
-   `SupplierPayableId` --- concurrent payment allocation.
-   `CashierShiftId` / configured Counter-Drawer scope --- cash
    movement/close/open race.
-   `BusinessDayId` --- close/late transaction/reopen race.
-   `FinancialAccountId` --- balance-affecting financial movement
    ordering where required.
-   idempotency/source identity --- duplicate GRN, Sale, Return,
    movement and transfer retries.

The Database Model may implement these through optimistic versioning,
row locks, uniqueness constraints, serializable sections or other
PostgreSQL mechanisms, but may not weaken the business invariant.

## 8. Event-causality stress test

The outbox is a publication mechanism, not the mechanism that makes
local Sale/Stock/Tender/Credit/Cash effects consistent.

For one local posting envelope: 1. owning aggregates validate; 2.
required aggregate changes are persisted in one local transaction; 3.
audit/outbox records are persisted in that same transaction; 4. after
commit, events may feed projections, sync and external workflows.

Related events share `PostingEnvelopeId`/correlation identity. Each
event has exactly one owning producer.

## 9. Decision-seam stress test

The frozen Decision Register contains resolved, open, verify, proposed
and deferred decisions. v0.1 correctly avoided inventing several
high-risk values, but its seam document is incomplete.

v0.2 must preserve **all** non-resolved decisions and classify them. A
proposed direction is not an approved default unless the Decision
Register says it is resolved.

## 10. Freeze recommendation

**Do not freeze v0.1.**

Proceed to **Domain Model v0.2 Freeze Candidate** only after applying
all 5 blockers and 7 major remediations above.

No FRS v1.0 change is required.
