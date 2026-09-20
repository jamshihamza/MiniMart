# MiniMart Second Full FRS Consistency Audit --- v0.9

**Document ID:** MM-FRS-AUDIT-002\
**Baseline audited:** v0.9 Normalized\
**Purpose:** verify remediation, metadata normalization and NFR
reconciliation before creating FRS v1.0 Release Candidate.

## 1. Executive verdict

**FRS v1.0 Release Candidate gate: PASS.**

The seven semantic blockers identified in the first full audit are now
remediated at the functional-specification level. The legacy
Common/Batch-1 metadata gaps are normalized, NFRS is reconciled with the
current FRS, and the central Decision Register now distinguishes
resolved, open, verification-dependent and deferred decisions.

This is a **Release Candidate pass**, not a claim that every future
implementation decision is frozen. Remaining open decisions are bounded
and classified so they do not change the core Domain Model
identities/lifecycles approved for the initial model.

## 2. Structural verification

  Check                                                          Result
  ------------------------------------------------------------ --------
  Functional requirements                                         1,257
  Unique functional requirement IDs                               1,257
  Functional namespaces                                              22
  Duplicate FR IDs                                                    0
  Namespace numbering gaps                                            0
  Invalid explicit `BR-*` references                                  0
  Requirements missing direct Source metadata                         0
  Requirements missing requirement-level Acceptance metadata          0
  Non-standard Priority values                                        0
  Non-standard Phase values                                           0
  Unique NFR IDs                                                     84
  Duplicate NFR IDs                                                   0
  Unique acceptance scenarios                                       102
  Broken `.md` references detected by package scan                    0

## 3. BRD coverage

All explicit BRD requirement IDs except `BR-BIZ-001` are directly cited
by one or more detailed functional requirements.

`BR-BIZ-001` is the overall product-scope statement that MiniMart is an
offline-first retail POS/management product; it is intentionally treated
as a scope constraint rather than forced into one artificial one-to-one
FR mapping.

`BR-DATA-003` is now explicitly mapped to `FR-INV-031` Stock Movement
Source.

The previous Accounting-Lite gaps for `BR-ACC-001`, `BR-ACC-004` and
`BR-ACC-005` are closed by `FR-ACC-001–050`.

## 4. Semantic blocker re-test

### Payment / Sale lifecycle --- PASS

Canonical distinction:

`Payment Attempt → Payment Commitment → Posted Tender → Posted Sale`

-   external/manual monetary success can exist before local Sale
    posting;
-   it is recoverable and idempotent;
-   it is not falsely represented as a posted Tender;
-   final local Sale + stock + posted Tenders + audit + outbox remain
    one database transaction.

### Return / Refund lifecycle --- PASS

Canonical distinction:

`Return Draft → Return Posted → Refund Obligation → Refund Attempt → Settled / Failed / Uncertain → Reconciled`

A posted Return can have an outstanding refund without reposting stock
during later recovery.

### Inventory costing --- PASS

Initial operational baseline: - moving weighted-average cost per Item
per Store; - exact arithmetic; - free quantity included in total
quantity over which net acquisition value is spread; - purchase
discounts reduce acquisition value; - verified recoverable tax excluded;
non-recoverable directly attributable tax included; - purchase return
operational valuation defined; - Phase-1 negative stock blocked.

Full statutory/double-entry accounting remains a separate
professional-validation boundary.

### Phase-1 customer credit --- PASS

Minimum credit capability is now Phase 1/2 and covers eligibility,
limit/terms, outstanding, credit sale, split credit, collection,
reversal, audit, local offline operation and concurrency.

Advanced aging/write-off/interest and multi-branch offline exposure
remain later.

### Domain ownership --- PASS

Approved baseline: - Item: company/tenant-wide; - Supplier:
company/tenant-wide; - Customer: company/tenant-wide; - stock: Item ×
Store; - WAC: Item × Store; - selling-price assignment: store-scoped; -
Customer Credit: company-wide identity with later multi-branch
coordination.

### Country-rule versioning --- PASS

The FRS now requires a version/effective country-rule identity and
preservation of posted historical context/outcomes. Current legal values
remain verification-gated rather than guessed.

### Accounting-Lite --- PASS

`FR-ACC-001–050` covers the BRD-approved operational accounting scope: -
supplier liabilities/payments; - customer-receivable linkage; -
cash/bank movements; - expenses; - reversal/correction; -
reconciliation; - opening balances; - accountant export.

It does not claim full general-ledger/statutory completeness.

## 5. NFR reconciliation --- PASS

NFRS v0.9 now explicitly covers: - payment/refund recovery and uncertain
state; - local atomic posting and stable identifiers; - exact money and
quantity; - multi-counter consistency; - country-rule historical
meaning; - backup/restore/RPO/RTO ownership; - diagnostics and
correlation; - time-limited support access; - privacy/export controls; -
country-pack verification; - architecture governance; - failure-mode
testing; - deployment topology and hardware verification.

There are 84 unique NFR IDs with no duplicates.

## 6. Metadata normalization --- PASS

Legacy Common/Batch-1 requirements now have: - direct Source metadata; -
requirement-level Acceptance metadata; - standard Priority values
(`MUST`, `SHOULD`, `COULD`, `LATER`).

Conditionality, unresolved decisions and verification dependencies are
now represented separately as: - `Applicability`; - `Decision Status`; -
`Verification Gate`.

Phase fields now contain product phases rather than governance
statements.

## 7. Decision governance --- PASS with bounded open decisions

The consolidated v0.9 Decision Register separates: - resolved domain
baselines; - implementation-time open decisions; -
authoritative-verification decisions; - later/deferred decisions.

Remaining open decisions do **not** require changing the approved core
identity/lifecycle model. Examples include business-date rollover
policy, stock-count concurrency strategy, batch/FEFO behavior,
no-receipt return policy, credit-limit violation mode, exact RPO/RTO,
hardware models and remote-support provider.

Downstream work must continue to respect these decision boundaries.

## 8. Remaining risks for Domain Modeling

These are not FRS release-candidate blockers but must remain visible:

1.  **Business Date / Day Close policy:** model Business Day explicitly
    and avoid hard-coding midnight rollover.
2.  **Batch/expiry depletion:** model batch/expiry capability without
    assuming FEFO as the universal policy.
3.  **Credit policy:** model credit account/exposure without hard-coding
    block-vs-override policy.
4.  **Document numbering:** separate immutable technical identity from
    human document number/scope.
5.  **Synchronization:** preserve stable identity, ownership,
    outbox/inbox and idempotency seams without prematurely freezing the
    full Phase-3 sync algorithm.
6.  **Country compliance:** model extensibility/versioning but do not
    encode unverified current tax/legal facts.
7.  **Accounting:** keep operational Accounting-Lite separate from a
    future validated full ledger.

## 9. Release-candidate recommendation

The normalized FRS is suitable to become **MiniMart FRS v1.0-RC1**.

Recommended next sequence:

`FRS v1.0-RC1 → final human/freeze review → FRS v1.0 Frozen → Domain Model v0.1`

The Domain Model should consume the resolved baselines and explicitly
reference still-open decisions rather than inventing their outcomes.

## 10. Audit conclusion

The first audit found substantive semantic contradictions. The second
audit does not find an unresolved contradiction that prevents creation
of the FRS v1.0 Release Candidate.

**Result: PASS FOR RELEASE CANDIDATE.**
