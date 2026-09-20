# MiniMart FRS v1.0 Release Candidate 1

**Release:** v1.0-rc1\
**Status:** Final specification freeze review\
**Functional requirements:** 1,257\
**NFR requirements:** 84\
**Functional namespaces:** 22\
**Acceptance scenarios:** 102

## 1. Release-candidate purpose

This package is the candidate baseline that will feed the MiniMart
Domain Model after final freeze review.

The RC incorporates: - BRD requirements baseline; - FRS Batches 1--5; -
Common Foundation; - Accounting-Lite; - v0.7 full consistency audit; -
v0.8 semantic freeze-blocker remediation; - v0.9 metadata
normalization; - v0.9 NFRS reconciliation; - consolidated Decision
Register; - second full consistency audit.

## 2. RC1 quality gate

The second consistency audit passed with: - 0 duplicate FR IDs; - 0 FR
numbering gaps; - 0 invalid explicit BRD references; - 0 missing FR
Source fields; - 0 missing FR Acceptance fields; - 0 non-standard
Priority values; - 0 non-standard Phase values; - 0 duplicate NFR IDs; -
0 duplicate acceptance scenario IDs; - 0 legacy prior-product-name branding.

## 3. Frozen semantic baselines proposed for v1.0

Unless final review identifies a defect, v1.0 will freeze these
principles:

1.  Offline-first store operation; cloud is not in the billing critical
    path.
2.  Company-wide Item, Supplier and Customer identities.
3.  Store-scoped inventory, moving WAC and selling-price assignments.
4.  Moving weighted-average operational inventory costing.
5.  Phase-1 negative stock blocked.
6.  Payment Attempt/Commitment is distinct from posted Tender.
7.  Final local Sale posting atomically commits Sale, stock, posted
    Tender, audit and outbox effects.
8.  Posted Return can own an outstanding Refund Obligation.
9.  Posted financial/stock history is corrected by explicit
    reversal/correction, not destructive rewrite.
10. Basic customer credit is part of the Phase-1/2 baseline.
11. Accounting-Lite is operational, not a claim of full
    statutory/general-ledger accounting.
12. Country behavior is isolated, version/effective aware and
    historically preserved.
13. Current legal/compliance values require authoritative verification
    before implementation.

## 4. Decisions allowed to remain open after FRS freeze

An FRS freeze does not require every deployment/policy choice to be
fixed.

The Domain Model may proceed while the Decision Register retains bounded
decisions such as: - business-date rollover; - human document-number
scope; - held-sale repricing; - stock-count concurrency; - batch/FEFO
policy; - no-receipt return; - mixed-tender refund allocation; -
credit-limit violation mode; - shift/day-close exception policy; -
hardware/provider selections; - production RPO/RTO and retention
values; - current Malaysia/India legal values.

The Domain Model must not silently choose these. It should model policy
boundaries where needed.

## 5. Change control during RC

Allowed: - contradiction/defect correction; - missing traceability
correction; - clarified wording that does not change semantics; -
explicit approval of an existing open decision; - authoritative
compliance update.

Requires review before acceptance: - new module; - new financial
lifecycle; - change to costing method; - change to master ownership; -
change to posted-document immutability; - change to offline-first
behavior; - change to payment/refund recovery semantics.

## 6. Final freeze checklist

Before renaming RC1 to FRS v1.0: - \[ \] Product owner approves RC1
semantic baselines. - \[ \] No newly identified contradiction remains. -
\[ \] Decision Register open items are accepted as intentionally
deferred/bounded. - \[ \] Malaysia/India current legal values are still
excluded from generic core assumptions. - \[ \] Accounting-Lite boundary
is accepted as operational rather than full GL. - \[ \] Domain Model
will use RC1/v1.0 as its authoritative functional source. - \[ \] RC
artifact hashes/version are retained for traceability.

## 7. Next stage after freeze

`FRS v1.0 Freeze → Domain Model v0.1`

The Domain Model should begin with aggregate/identity/lifecycle
boundaries, not database tables. Database modeling follows after the
Domain Model is reviewed.
