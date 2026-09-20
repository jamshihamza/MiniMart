# MiniMart FRS Freeze-Blocker Decision Classification

**Document ID:** MM-FRS-FREEZE-DEC-001\
**Status:** Audit working register

This document classifies what must be resolved before Domain Modeling;
it does not replace `DECISION-REGISTER.md`.

## Blocking before Domain Model freeze

  ------------------------------------------------------------------------
  Topic                   Existing                 Required outcome
                          decision/reference       
  ----------------------- ------------------------ -----------------------
  Inventory costing       `DEC-INV-001`,           Approve initial method
                          `DEC-PUR-004/005/006`,   and edge-case
                          `DEC-INV-006`            treatment.

  Sale/payment lifecycle  `FR-POS-052`,            Separate Payment
                          `FR-PAY-062–068`,        Attempt/provider
                          `DEC-PAY-005`            outcome/Tender/Sale
                                                   posting/recovery.

  Return/refund lifecycle `FR-RET-026`,            Separate Return, Refund
                          `FR-RET-048–051`         Obligation, Refund
                                                   Attempt and settlement.

  Phase-1 credit          BRD Phase 1,             Promote minimal credit
                          `FR-PAY-069/070`,        to Phase 1 or move BRD
                          `FR-CRD-*`               scope to Phase 2.

  Customer identity scope `DEC-CUS-001`            Approve company/store
                                                   identity ownership.

  Item master ownership   Catalog open decision    Create central decision
                                                   and baseline it.

  Price scope             Pricing open decision /  Define Phase-1
                          `FR-PRI-012`             ownership/scope.

  Country rule versioning `DEC-CTRY-004`           Approve
                                                   effective/version
                                                   concept.

  Accounting-lite scope   BRD §21 / audit blocker  Add bounded FRS before
                                                   full-domain freeze.
  ------------------------------------------------------------------------

## May defer if explicitly recorded

Negative-stock default, FEFO default, stock-count concurrency UX,
payment provider, exact hardware models, remote-support provider, exact
production RPO/RTO values, day reopen policy, current country legal
values, full Phase-3 sync algorithm and Phase-5 modules.

## Rule

An implementation agent must not choose a blocking item silently. Any
provisional baseline used for Domain Modeling must be recorded centrally
with rationale and affected requirements.
