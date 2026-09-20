# MiniMart Full FRS Consistency Audit --- v0.6 Baseline

**Document ID:** MM-FRS-AUDIT-001\
**Audit output:** v0.7 Audit-Remediation Workspace\
**Scope:** BRD, FRS, NFRS, Traceability, Decision Register, acceptance
scenarios, and all detailed functional modules\
**Purpose:** determine readiness for FRS v1.0 freeze and Domain
Modeling.

## 1. Executive conclusion

**Freeze verdict: NOT READY for FRS v1.0.**\
**Domain Model verdict: DO NOT freeze the Domain Model yet.**

The specification is already substantial and internally strong in many
areas. The remaining risk is concentrated in a small number of
high-impact seams: accounting-lite scope, payment-versus-sale lifecycle,
return-versus-refund lifecycle, costing, Phase-1 credit scope, and
master-data ownership.

## 2. Machine-checked inventory

  Check                                             Result
  ----------------------------------------------- --------
  Functional requirement headings                     1207
  Unique FR IDs                                       1207
  Functional namespaces                                 21
  Duplicate FR IDs                                       0
  Namespace numbering gaps                               0
  Files with invalid explicit `BR-*` references          0
  BRD requirement IDs                                  126
  Requirement-level Source fields missing              121
  Requirement-level Acceptance fields missing          230
  Non-standard Priority entries                        100
  Non-standard Phase entries                             2
  Unique acceptance scenarios                           85

All 21 FR namespaces are duplicate-free and contiguous after restoring
`FR-COM-001–030`.

## 3. Freeze blockers

### AUD-BLK-001 --- Accounting-lite coverage is incomplete

**Severity:** BLOCKER

The BRD places accounting-lite in Phase 2 and requires operational
financial records, supplier liabilities, customer credit, cash/bank
movements, expenses and accountant exports. Customer credit and
accountant export are covered, and cash drawer movement exists, but
supplier liability is only a boundary (`FR-SUP-025`), general bank
movement is not specified, and business expense recording is not
specified.

**Remediation:** create a bounded Accounting-Lite FRS covering supplier
outstanding/payments, cash/bank movement boundary, expense recording,
reversal/correction, reconciliation and export linkage. Do not introduce
full double-entry yet.

### AUD-BLK-002 --- Sale atomicity conflicts with pre-posting committed tenders

**Severity:** BLOCKER\
**Requirements:** `FR-POS-052`, `FR-POS-054`, `FR-PAY-062–068`,
`FR-PAY-073`.

`FR-POS-052` says a completed sale must not exist without its required
tenders and vice versa. Split payment permits a committed tender to
exist before final sale posting and survive later tender
failure/restart. For external/integrated payment, provider success can
also occur before local sale posting.

**Required separation:** Payment Attempt → external/manual outcome →
internal Tender allocation → final Sale posting →
recovery/reconciliation if external money moved but local posting is
incomplete. The local database posting can remain atomic; an external
provider monetary action cannot literally participate in the same
database transaction.

### AUD-BLK-003 --- Return atomicity conflicts with unresolved refund

**Severity:** BLOCKER\
**Requirements:** `FR-RET-026`, `FR-RET-048–051`.

`FR-RET-026` couples completed return, stock and refund. `FR-RET-051`
permits stock return to be accepted while refund remains unresolved.

**Remediation:** separate Return Posting, Inventory Disposition, Refund
Obligation, Refund Attempt and Refund Settlement. A posted return may
have an outstanding refund obligation without being falsely marked fully
settled.

### AUD-BLK-004 --- Inventory costing is explicitly unresolved before Domain Model

**Severity:** BLOCKER\
**Requirements:** `FR-INV-091–110`.\
**Decisions:** `DEC-INV-001`, `DEC-PUR-004`, `DEC-PUR-005`,
`DEC-PUR-006`, `DEC-INV-006`.

Weighted Average is proposed, not approved. Free quantity, document
discount allocation, purchase-tax treatment and negative-stock costing
remain unresolved.

**Remediation:** approve an initial operational costing baseline and its
edge cases. Full double-entry remains later and requires professional
accounting validation.

### AUD-BLK-005 --- Phase-1 basic credit conflicts with Phase-2 Customer Credit

**Severity:** BLOCKER for release-scope consistency

BRD Phase 1 explicitly includes **basic credit sales**. `FR-PAY-069/070`
introduce credit tender in Phase 1, while `FR-CRD-001–065` are Phase 2.

**Remediation:** either promote a minimal credit subset to Phase 1 or
amend the BRD so credit begins in Phase 2. This must be an explicit
product decision.

### AUD-BLK-006 --- Core ownership/scope decisions are not frozen

**Severity:** BLOCKER for Domain Model

Domain identity/uniqueness depends on item master company ownership vs
store override, customer identity scope (`DEC-CUS-001` remains
proposed), Phase-1 price ownership/scope, supplier/payables scope, and
country-rule effective/version ownership (`DEC-CTRY-004`).

**Remediation:** centralize and baseline these ownership rules before
aggregate roots and unique constraints are frozen.

### AUD-BLK-007 --- Country rule effective/version model is unresolved

**Severity:** BLOCKER for country-aware historical meaning\
**Decision:** `DEC-CTRY-004`.

Current legal values may remain deferred, but the Domain Model needs a
stable concept for country context/version/effective rule identity or
immutable snapshots so later rule changes do not reinterpret posted
history.

## 4. Major findings

### AUD-MAJ-001 --- Common Foundation missing from v0.6

The master FRS and Traceability referenced
`00-common/common-foundation.md`, but it was absent. **Applied in v0.7
audit workspace:** restored the existing authoritative `FR-COM-001–030`
baseline without changing semantics.

### AUD-MAJ-002 --- Master FRS was stale/duplicated

v0.6 metadata still said Batch 4, the area table said "Scaffolded," and
Batch 4 status appeared twice. **Applied in v0.7:** replaced the master
FRS with a clean status/index document.

### AUD-MAJ-003 --- Batch-1/Common metadata is below later standard

Missing direct Source fields: **121**. Missing requirement-level
Acceptance fields: **230**.

Missing Source by namespace:
`{'FR-SUP': 19, 'FR-PRI': 15, 'FR-COM': 10, 'FR-CAT': 35, 'FR-IAM': 26, 'FR-ORG': 16}`\
Missing Acceptance by namespace:
`{'FR-SUP': 36, 'FR-PRI': 36, 'FR-COM': 29, 'FR-CAT': 60, 'FR-IAM': 40, 'FR-ORG': 29}`

**Remediation:** normalize Batch-1/Common source and testability
metadata, or explicitly adopt a documented scenario-level alternative.

### AUD-MAJ-004 --- Priority mixes priority, applicability and decision state

There are **100** non-standard Priority entries. Examples include
`OPEN`, `PROPOSED`, `MUST when integrated`, `MUST where applicable`, and
`MUST after verification`.

**Remediation:** separate Priority, Applicability, Decision Status and
Verification Gate.

### AUD-MAJ-005 --- Phase field contains governance gates

`FR-INV-109`: `Before Domain Model baseline`.\
`FR-INV-110`: `Before accounting posting baseline`.

These are gates, not product phases.

### AUD-MAJ-006 --- BRD traceability has partial gaps

BRD IDs never directly cited by detailed FR modules:
`['BR-ACC-001', 'BR-ACC-004', 'BR-ACC-005', 'BR-BIZ-001', 'BR-DATA-003']`.

-   `BR-BIZ-001`: scope statement; one-to-one FR not required.
-   `BR-DATA-003`: behavior exists in stock movement, but source mapping
    is missing.
-   `BR-ACC-001`, `BR-ACC-004`, `BR-ACC-005`: expose the Accounting-Lite
    gap.

The central Traceability file also omits covered requirements such as
`BR-OPS-004`, `BR-OPS-005`, and `BR-DATA-005`.

### AUD-MAJ-007 --- Open decisions are not fully normalized centrally

At least **53** explicit open-decision bullets exist across
Common/Batch-1/Batch-2 module sections. Several are represented in the
central register, but important Domain Model questions such as item
ownership and UoM scope do not have a one-to-one central decision
identity.

### AUD-MAJ-008 --- NFRS is still v0.1

It remains directionally consistent but has not been reconciled with
Batch 5 recovery, RPO/RTO, audit/log retention, remote support and newer
degraded/recovery semantics.

### AUD-MAJ-009 --- Phase-3 synchronization is functionally under-specified

Sync intent, backlog, stale central reporting, idempotency and recovery
appear across modules, but there is no dedicated functional sync
contract. This need not block Phase-1 Domain Modeling if stable
identities/ownership/event facts are defined now, but it must be
explicitly deferred before Phase 3.

## 5. Cross-module invariant audit

### PASS

-   posted financial/stock documents are not casually edited;
-   corrections use reversal/return/compensating processes;
-   inventory changes are traceable rather than direct balance edits;
-   retry must not duplicate business effects;
-   internet/cloud outage does not block ordinary local operation while
    Store Node/database are healthy;
-   Store Node/database outage is a separate failure class;
-   peripheral failure does not invalidate an already committed
    transaction;
-   historical transactions retain original business meaning;
-   country-specific rules are isolated;
-   current legal/tax/e-invoice details are not falsely treated as
    verified.

### PENDING/FAIL

-   meaning of "committed tender" before sale posting;
-   provider payment success vs posted MiniMart tender;
-   "completed return" while refund is pending;
-   inventory costing baseline;
-   master ownership scope;
-   Phase-1 credit baseline.

## 6. Lifecycle audit

**Sale:** coherent until partial/external payment succeeds before final
sale posting. A recovery state/domain concept is required.

**Payment:** payment status vocabulary is good, but Payment Attempt and
posted Tender must be distinct.

**Return/Refund:** eligibility, disposition and refund recovery are
individually strong; the combined lifecycle needs separation.

**Purchasing/GRN:** generally coherent; costing remains the major
dependency.

**Shift/Business Day:** functionally coherent. Exact
rollover/reopen/late-transaction policies may remain decisions because
Business Date is already explicit and separate from timestamp.

## 7. Phase audit

**Aligned:** retail core Phase 1; shift/reporting/compliance Phase 2;
integrated payments/multi-branch later; India Phase 4 boundary.

**Misaligned:** basic credit (BRD Phase 1 vs Credit FRS Phase 2);
Accounting-Lite (BRD Phase 2 vs no detailed module).

## 8. Country/compliance audit

**PASS for boundary design.** Malaysia and India files correctly avoid
asserting current rates, thresholds, deadlines or universal legal
applicability. Dedicated compliance specifications must later be
verified against authoritative official sources. For Domain Modeling
now, only the country-rule version/effective model is a blocker; current
legal values are not.

## 9. NFR audit

**Aligned:** offline-first operation, restart durability,
duplicate-effect prevention, authorization, no universal hidden
credential, privacy minimization, restore testing, support diagnostics,
localization, AI/test guardrails.

**Needs revision:** RPO/RTO ownership, audit/log retention,
concurrency/load benchmark conditions, Phase-3 sync freshness, and
recovery/degraded-mode expectations.

## 10. Freeze-decision classification

### Resolve before Domain Model freeze

1.  Inventory costing method and acquisition-cost edge cases.
2.  Sale/PaymentAttempt/Tender lifecycle.
3.  Return/RefundObligation lifecycle.
4.  Phase-1 credit baseline.
5.  Item/customer/price ownership sufficient for aggregate identity.
6.  Country rule version/effective model.
7.  Accounting-Lite scope if the Domain Model is intended to cover the
    approved Phase-2 BRD.

### May remain explicitly deferred

Negative-stock default, FEFO/batch picking default, stock-count
concurrency UX, payment provider selection, exact hardware models,
remote-support provider, exact production RPO/RTO values, day
reopen/late-transaction policy, current Malaysia/India legal details,
full Phase-3 sync algorithm, and Phase-5 modules.

## 11. Required remediation sequence

1.  Structural repairs --- Common Foundation, master FRS, README,
    traceability status.
2.  Resolve semantic blockers --- payment/tender, return/refund,
    costing, credit phase, ownership, country-rule versioning.
3.  Add bounded Accounting-Lite FRS.
4.  Normalize Priority/Applicability/Decision/Phase fields and
    Batch-1/Common source/acceptance metadata.
5.  Reconcile NFRS.
6.  Re-run automated consistency checks.
7.  Produce **FRS v1.0 Release Candidate**.
8.  Only then freeze the Domain Model.

## 12. Professional assessment

MiniMart's FRS is well beyond a scaffold. The main risk is now a small
set of **high-impact semantic seams** between otherwise detailed
modules.

The highest-risk seam is external money movement versus local
sale/return posting. Resolving it before Domain Modeling will prevent
major redesign later.

The second major gap is Accounting-Lite: the BRD promises supplier
liabilities, cash/bank movements and expenses, but the current FRS does
not yet define them sufficiently.

**Recommended status:** `FRS v0.7 — Audit Remediation Required`, not
`FRS v1.0 Freeze Candidate`.
