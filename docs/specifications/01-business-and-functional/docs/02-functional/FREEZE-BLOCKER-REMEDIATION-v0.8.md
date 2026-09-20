# MiniMart Freeze-Blocker Remediation Report --- v0.8

**Document ID:** MM-FRS-REM-001\
**Status:** Semantic remediation completed; normalization pass remains

## 1. Purpose

This pass implements the next action approved after the v0.7 full FRS
consistency audit. It resolves the seven semantic/domain blockers
identified before FRS v1.0 and adds the missing Accounting-Lite
functional scope.

## 2. Blocker resolution status

  -----------------------------------------------------------------------
  Audit blocker                       v0.8 result
  ----------------------------------- -----------------------------------
  Accounting-Lite missing             **Resolved:** added
                                      `FR-ACC-001–050`.

  Sale atomicity vs pre-posting       **Resolved:** Payment
  payment                             Attempt/Commitment is distinct from
                                      posted Tender; final local Sale
                                      posting remains atomic.

  Return atomicity vs unresolved      **Resolved:** posted Return owns a
  refund                              Refund Obligation; settlement may
                                      complete later without reposting
                                      stock.

  Inventory costing unresolved        **Resolved baseline:** moving WAC
                                      per Item per Store; free
                                      qty/discount/tax
                                      boundary/purchase-return rules
                                      defined; Phase-1 negative stock
                                      blocked.

  Phase-1 basic credit conflict       **Resolved baseline:** minimum
                                      operational credit capability
                                      promoted to Phase 1/2; advanced
                                      credit remains later.

  Master ownership unresolved         **Resolved baseline:**
                                      Item/Supplier/Customer
                                      company-wide;
                                      stock/cost/store-price assignments
                                      store-scoped.

  Country-rule version model          **Resolved baseline:**
  unresolved                          version/effective rule-set identity
                                      and immutable posted historical
                                      context.
  -----------------------------------------------------------------------

## 3. New canonical payment model

`Payment Attempt → Payment Commitment → Posted Tender → Posted Sale`

-   Payment Attempt may be pending/failed/successful/uncertain.
-   A confirmed monetary outcome becomes a Payment Commitment that must
    be completed or reversed/refunded.
-   A Posted Tender is MiniMart's immutable settlement record associated
    during final Sale posting.
-   Final local Sale + stock + posted Tenders + audit + outbox commit
    atomically.
-   External provider money cannot literally be part of the local
    database transaction, so recovery is explicit and idempotent.

## 4. New canonical return/refund model

`Return Draft → Return Posted → Refund Obligation → Refund Attempt → Settled / Failed / Uncertain → Reconciled`

Return posting owns commercial return and stock disposition. Refund
settlement may be immediate or later. Later refund recovery cannot
repost the Return or inventory.

## 5. Costing baseline

Initial operational valuation is **moving weighted-average cost per Item
per Store**.

-   exact decimal arithmetic;
-   free quantity shares acquisition value across total accepted
    quantity;
-   purchase discounts reduce acquisition value;
-   recoverable purchase tax is excluded from acquisition cost;
-   non-recoverable directly attributable tax is included;
-   purchase return reduces operational inventory value using current
    WAC at return posting;
-   Phase-1 negative stock is blocked;
-   full statutory/double-entry accounting remains a later
    professional-validation boundary.

## 6. Ownership baseline

-   Item: company/tenant-wide.
-   Supplier: company/tenant-wide.
-   Customer: company/tenant-wide.
-   Stock: Item × Store.
-   WAC: Item × Store.
-   Selling price assignment: Item × Store/effective context.
-   Customer Credit: company-wide identity; later multi-branch offline
    coordination remains deferred.
-   Store: one active country context for ordinary trading.

## 7. Accounting-Lite added

`FR-ACC-001–050` now covers: - supplier payable and supplier payment; -
supplier returns/credits and allocation; - Customer Credit receivable
linkage; - cash/bank operational accounts and movements; - account
transfer/reconciliation; - business expenses; - opening balances; -
reversal/correction; - accountant export; - offline operation and
acceptance coverage.

It intentionally does not claim full general-ledger/statutory accounting
completeness.

## 8. Automated structural re-check

After remediation:

  Check                                             Result
  ----------------------------------------------- --------
  Functional requirements                            1,257
  Unique FR IDs                                      1,257
  Namespaces                                            22
  Duplicate FR IDs                                       0
  Namespace gaps                                         0
  Invalid explicit BRD references                        0
  Non-standard Phase values                              0
  Missing direct Source metadata                       117
  Missing requirement-level Acceptance metadata        226
  Non-standard Priority/applicability values            96

The remaining counts are specification-normalization work, concentrated
mainly in Common/Batch-1 and legacy priority conventions. They are no
longer unresolved core domain semantics.

## 9. Remaining work before FRS v1.0 Release Candidate

1.  Normalize `Priority`, `Applicability`, `Decision Status` and
    `Verification Gate`.
2.  Add/normalize missing Source and Acceptance metadata in
    Common/Batch-1.
3.  Reconcile NFRS with v0.8 payment recovery, refund recovery,
    backup/support and accounting-lite.
4.  Consolidate old Decision Register rows so resolved v0.8 overlays are
    reflected in the primary status table.
5.  Run a second full automated + semantic consistency audit.
6.  Produce FRS v1.0 Release Candidate.

## 10. Gate assessment

The v0.7 **semantic freeze blockers are remediated** at working-baseline
level.

However, MiniMart should still complete the normalization/NFRS/re-audit
pass before declaring FRS v1.0 frozen or starting the formal Domain
Model baseline. This avoids building the Domain Model from inconsistent
metadata or stale decision status.
