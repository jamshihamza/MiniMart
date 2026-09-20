# MiniMart FRS v1.0 Consistency Audit & Freeze Plan

**Document ID:** MM-FRS-FREEZE-PLAN-001\
**Status:** Approved next stage after Batch 5

## Objective

Convert the completed working-draft FRS set into a reviewed **v1.0
freeze candidate** before Domain Modeling.

## Audit passes

1.  **Requirement identity**
    -   no duplicate FR IDs;
    -   no gaps inside declared namespaces unless documented;
    -   document namespace/range matches actual headings.
2.  **BRD traceability**
    -   every cited `BR-*` exists;
    -   reporting/country sections use BRD section references where no
        BR namespace exists;
    -   important BRD requirements have functional coverage or explicit
        deferral.
3.  **Terminology**
    -   one preferred term for Store, Counter, Store Node, Business
        Date, Posted, Held, Return, Refund, Tender, Customer Credit, GRN
        and stock movement;
    -   remove conflicting synonyms where they imply different behavior.
4.  **State/lifecycle alignment**
    -   sale/payment/return/purchase/GRN/shift/day-close states agree
        across modules;
    -   pending/failed/uncertain/posted/voided semantics are consistent.
5.  **Cross-module invariants**
    -   posted financial documents immutable;
    -   corrections use reversal/correction;
    -   stock changes use traceable movements;
    -   exact money only;
    -   critical posting is atomic;
    -   retry/idempotency does not duplicate effects;
    -   cloud outage does not block normal local trading;
    -   audit and outbox/sync intent are preserved where required.
6.  **Decision Register classification**
    -   classify every open decision as:
        -   BLOCKING FOR DOMAIN MODEL,
        -   MAY DEFER TO DATA/API/UI,
        -   PHASE-LATER,
        -   COUNTRY/LEGAL VERIFICATION;
    -   resolve blocking business decisions or explicitly choose a
        provisional baseline.
7.  **NFR alignment**
    -   offline, reliability, performance, privacy, security,
        backup/recovery and support NFRs do not contradict functional
        requirements.
8.  **Acceptance coverage**
    -   critical requirements map to cross-module acceptance scenarios;
    -   add missing crash/retry/concurrency/offline scenarios.
9.  **Scope/phase alignment**
    -   Phase 1/2/3/4/5 tags are coherent;
    -   later features are not accidentally made Phase-1 mandatory.
10. **Freeze output**

-   issue an audit report;
-   correct inconsistencies;
-   produce FRS v1.0 Release Candidate;
-   list unresolved non-blocking decisions;
-   only then begin Domain Model.

## Domain Model entry gate

Domain modeling begins only after the freeze review confirms that no
unresolved contradiction changes the identity, lifecycle or ownership of
core entities such as Sale, Tender, Stock Movement, Purchase/GRN,
Return, Customer Credit, Shift and Business Day.
