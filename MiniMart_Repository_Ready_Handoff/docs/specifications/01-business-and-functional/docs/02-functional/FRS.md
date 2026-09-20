# MiniMart Functional Requirements Specification (FRS) --- v1.0

**Document ID:** MM-FRS-001\
**Status:** FROZEN --- authoritative functional baseline\
\
**Primary source:** `../01-business/BRD.md`\
**Companion:** `NFRS.md`\
**Audit:** `FRS-CONSISTENCY-AUDIT-v0.6.md`\
**Remediation acceptance:** `REMEDIATION-ACCEPTANCE-v0.8.md`

## 1. Purpose

This master document indexes the detailed MiniMart functional
specifications and states the current freeze status before Domain
Modeling.

## 2. Specification chain

`BRD → FRS + NFRS → Domain Model → Database Model → Architecture refinement → API Contracts → UI Specification → Backlog → Implementation + Tests`

## 3. Requirement convention

Functional IDs use `FR-<AREA>-<NUMBER>`. Priority, applicability, phase,
decision status and verification status are separate concepts. Legacy
metadata normalization remains a v1.0 preparation task.

## 4. Functional coverage

  -----------------------------------------------------------------------
  Namespace        Area              Range            v0.8 status
  ---------------- ----------------- ---------------- -------------------
  `FR-COM`         Common foundation `001–030`        Detailed baseline

  `FR-ORG`         Organization /    `001–030`        Detailed Draft
                   Store / Counter                    

  `FR-IAM`         Identity & Access `001–040`        Detailed Draft

  `FR-CAT`         Catalog           `001–060`        Detailed Draft ---
                                                      ownership resolved

  `FR-PRI`         Pricing           `001–036`        Detailed Draft ---
                                                      store price scope
                                                      resolved

  `FR-SUP`         Suppliers         `001–036`        Detailed Draft ---
                                                      ownership resolved

  `FR-PUR`         Purchasing / GRN  `001–110`        Detailed Draft
                   / Purchase Return                  

  `FR-INV`         Inventory / Count `001–110`        Detailed Draft ---
                   / Costing                          WAC baseline
                                                      resolved

  `FR-POS`         POS               `001–090`        Detailed Draft ---
                                                      posting lifecycle
                                                      resolved

  `FR-PAY`         Payments          `001–075`        Detailed Draft ---
                                                      commitment/tender
                                                      lifecycle resolved

  `FR-RET`         Sales Returns /   `001–060`        Detailed Draft ---
                   Refunds                            refund obligation
                                                      lifecycle resolved

  `FR-CUS`         Customers         `001–045`        Detailed Draft ---
                                                      company identity
                                                      resolved

  `FR-CRD`         Customer Credit   `001–065`        Detailed Draft ---
                                                      Phase-1 basic
                                                      profile aligned

  `FR-CSH`         Shift / Day Close `001–075`        Detailed Draft

  `FR-RPT`         Reporting         `001–065`        Detailed Draft

  `FR-IMP`         Import / Export   `001–045`        Detailed Draft

  `FR-AUD`         Audit             `001–045`        Detailed Draft

  `FR-HW`          Hardware          `001–050`        Detailed Draft

  `FR-BR`          Backup / Recovery `001–045`        Detailed Draft

  `FR-SUPT`        Support /         `001–045`        Detailed Draft
                   Diagnostics                        

  `FR-CTRY`        Country Behavior  `001–050`        Boundary Draft ---
                                                      version model
                                                      resolved

  `FR-ACC`         Accounting-Lite   `001–050`        Detailed
                                                      Remediation Draft
  -----------------------------------------------------------------------

**Total detailed functional requirements:** 1,257.

## 5. Canonical cross-module invariants

-   Posted local business documents are immutable except through
    explicit correction/reversal processes.
-   Final local Sale posting atomically commits Sale + stock + posted
    Tenders + audit + outbox.
-   External/manual payment success before Sale posting is represented
    as a Payment Commitment, not falsely as a posted Tender.
-   A posted Return may own an outstanding Refund Obligation; refund
    settlement can complete later without reposting stock.
-   Inventory uses moving weighted-average operational cost per Item per
    Store.
-   Phase-1 negative stock is blocked under the initial WAC baseline.
-   Item, Supplier and Customer identities are company/tenant-wide.
-   Stock, WAC and selling-price assignments are store-scoped.
-   Country behavior has a version/effective identity; posted history
    preserves applicable context/outcomes.
-   Business-critical retry cannot duplicate financial, stock or payment
    effects.
-   Internet/cloud outage does not block defined local trading while
    Store Node/database are healthy.

## 6. Phase-1 credit baseline

Basic customer credit is part of the Phase-1/2 retail baseline:
eligibility, limit/terms, outstanding, authoritative credit check,
credit tender, collection, reversal, audit, offline local-store
operation and multi-counter protection.

Advanced aging policy, write-off, interest/late fees and multi-branch
offline exposure remain later.

## 7. Accounting-Lite

`21-accounting-lite/accounting-lite.md` closes the BRD Phase-2
functional gap for: - supplier liabilities/payments; - customer
receivable linkage; - cash/bank movements and transfers; - expenses; -
reconciliation; - accountant exports.

It does not claim full general-ledger/statutory accounting completeness.

## 8. Country boundary

Current tax rates, legal thresholds, e-invoice deadlines and legal
applicability are intentionally not asserted here. Dedicated compliance
specifications require dated authoritative verification.

## 9. Frozen v1.0 result

The semantic remediation, metadata normalization, NFRS reconciliation
and second consistency audit are complete.

-   all 1,257 functional requirements have direct Source metadata;
-   all 1,257 have requirement-level Acceptance metadata;
-   Priority values use only `MUST / SHOULD / COULD / LATER`;
-   applicability, decision status and verification gates are separated
    from Priority;
-   all Phase values use the approved phase vocabulary;
-   the NFRS is reconciled to current recovery/accounting/support
    semantics;
-   the Decision Register is consolidated;
-   the second full consistency audit passed.

## 10. Domain Model gate

**FRS v1.0 is frozen.** Formal Domain Model baselining is authorized
from this frozen source. Downstream design shall preserve the frozen
invariants and shall not silently resolve `OPEN`, `VERIFY` or `DEFERRED`
decisions.
