# MiniMart Requirements Traceability --- v0.9

**Document ID:** MM-TRACE-001\
**Status:** Normalized through Accounting-Lite; second consistency audit
passed

## 1. Traceability chain

``` text
Business Requirement (BR-*)
        ↓
Functional Requirement (FR-*) / Non-Functional Requirement (NFR-*)
        ↓
Domain Rule / Domain Event
        ↓
Database / Data Requirement
        ↓
API Contract
        ↓
UI Requirement
        ↓
Development Backlog Item (MM-*)
        ↓
Automated / Manual Test
```

## 2. Batch 1 coverage

### Organization / Store / Counter

  ---------------------------------------------------------------------
  Business requirement / objective   Functional requirements
  ---------------------------------- ----------------------------------
  BR-BIZ-002                         FR-ORG-004, FR-ORG-005

  BR-OPS-002                         FR-ORG-014 through FR-ORG-020

  BR-OPS-003                         FR-ORG-001, FR-ORG-005,
                                     FR-ORG-010, FR-ORG-012, FR-ORG-015

  BR-LOC-001 / BR-LOC-004            FR-ORG-009 through FR-ORG-011

  BR-AUD-001 / BR-AUD-004            FR-ORG-023

  BR-DATA-007                        FR-ORG-024

  BO-006                             FR-ORG-008, FR-ORG-029

  BO-009                             FR-ORG-004, FR-ORG-020
  ---------------------------------------------------------------------

### Identity & Access

  ---------------------------------------------------------------------
  Business requirement               Functional requirements
  ---------------------------------- ----------------------------------
  BR-SEC-001                         FR-IAM-001, FR-IAM-006 through
                                     FR-IAM-014, FR-IAM-030 through
                                     FR-IAM-032

  BR-SEC-002                         FR-IAM-015 through FR-IAM-021,
                                     FR-IAM-028, FR-IAM-029

  BR-SEC-003                         FR-IAM-016, FR-IAM-022 through
                                     FR-IAM-027

  BR-SEC-004                         FR-IAM-022 through FR-IAM-027

  BR-SEC-005                         FR-IAM-013, FR-IAM-014

  BR-SEC-006                         FR-IAM-020, FR-IAM-040

  BR-AUD-001 through BR-AUD-004      FR-IAM-005, FR-IAM-020,
                                     FR-IAM-023, FR-IAM-035, FR-IAM-040

  BR-SUPT-002                        FR-IAM-033, FR-IAM-036

  BR-SUPT-005                        FR-IAM-035

  BR-SUPT-006                        FR-IAM-034
  ---------------------------------------------------------------------

### Product Catalog

  ---------------------------------------------------------------------
  Business requirement               Functional requirements
  ---------------------------------- ----------------------------------
  BR-CAT-001                         FR-CAT-001 through FR-CAT-008

  BR-CAT-002                         FR-CAT-003, FR-CAT-009, FR-CAT-012
                                     through FR-CAT-015

  BR-CAT-003                         FR-CAT-009 through FR-CAT-016

  BR-CAT-004                         FR-CAT-017 through FR-CAT-025

  BR-CAT-005                         FR-CAT-029 through FR-CAT-031,
                                     FR-CAT-039 through FR-CAT-043

  BR-CAT-006                         FR-CAT-026 through FR-CAT-028

  BR-CAT-007                         FR-CAT-034 through FR-CAT-038

  BR-CAT-008                         FR-CAT-046 through FR-CAT-049

  BR-SUP-003                         FR-CAT-054, FR-CAT-055

  BR-DATA-007                        FR-CAT-008, FR-CAT-031, FR-CAT-051

  BR-OPS-001 / BR-POS-010            FR-CAT-057
  ---------------------------------------------------------------------

### Pricing

  Business requirement      Functional requirements
  ------------------------- -------------------------------------------
  BR-PRI-001                FR-PRI-001, FR-PRI-020, FR-PRI-031
  BR-PRI-002                FR-PRI-003 through FR-PRI-006, FR-PRI-032
  BR-PRI-003                FR-PRI-007 through FR-PRI-012
  BR-PRI-004                FR-PRI-013 through FR-PRI-015, FR-PRI-024
  BR-PRI-005                FR-PRI-016 through FR-PRI-019, FR-PRI-033
  BR-PRI-006                FR-PRI-029, FR-PRI-030
  BR-POS-004                FR-PRI-025
  BR-POS-005                FR-PRI-022 through FR-PRI-026
  BR-DATA-007               FR-PRI-006, FR-PRI-021
  BR-OPS-001 / BR-POS-010   FR-PRI-035
  BO-006                    FR-PRI-036

### Supplier Management

  ---------------------------------------------------------------------
  Business requirement               Functional requirements
  ---------------------------------- ----------------------------------
  BR-SUP-001                         FR-SUP-001 through FR-SUP-004,
                                     FR-SUP-011 through FR-SUP-018

  BR-SUP-002                         FR-SUP-005 through FR-SUP-010

  BR-SUP-003                         FR-SUP-019 through FR-SUP-021

  BR-SUP-004                         FR-SUP-022 through FR-SUP-024

  BR-SUP-005                         FR-SUP-036

  BR-ACC-002                         FR-SUP-025

  BR-DATA-007                        FR-SUP-014, FR-SUP-030

  BR-OPS-001                         FR-SUP-031
  ---------------------------------------------------------------------

## 3. Existing common foundation mappings

  Business requirement   Functional/NFR requirement
  ---------------------- -------------------------------------
  BR-POS-010             FR-COM-014, NFR-OFF-001
  BR-DATA-002            FR-COM-005, FR-COM-006
  BR-SEC-004             FR-COM-008
  BR-DATA-004            FR-COM-012, FR-COM-017, NFR-REL-004
  BR-POS-007             FR-COM-018, FR-COM-019
  BR-REL-001             FR-COM-016, NFR-REL-001

## 4. Coverage notes / unresolved traceability

The following are intentionally not considered fully closed by Batch 1:

-   `BR-PRI-003` cost behaviour depends on the future inventory costing
    decision.
-   `BR-CAT-006` weighted-product end-to-end behaviour also depends on
    hardware/POS specifications.
-   `BR-SUP-002` country-specific supplier tax fields depend on
    Malaysia/India country specifications.
-   `BR-OPS-003` business-date behaviour depends on Cashier Shift/Day
    Close.
-   manager-override details will be refined by POS, Pricing, Returns
    and Inventory.
-   multi-store pricing is intentionally deferred beyond Phase 1.

## 5. Readiness rule

A material development backlog item is not ready merely because an
`FR-*` exists. Before implementation it should also have:

1.  resolved or explicitly deferred open decisions;
2.  applicable domain rules;
3.  acceptance criteria/tests;
4.  API/UI contracts where the feature crosses those boundaries;
5.  architecture/data review for money, inventory, security or
    synchronization effects.

## 6. Batch 2 coverage --- Purchasing

  ---------------------------------------------------------------------
  Business requirement               Functional requirements
  ---------------------------------- ----------------------------------
  BR-PUR-001                         FR-PUR-001--004, 021--045,
                                     046--053, 078--085

  BR-PUR-002                         FR-PUR-074; FR-INV-032

  BR-PUR-003                         FR-PUR-005--015, 024--025,
                                     032--035, 043--044, 054--076

  BR-PUR-004                         FR-PUR-086--110; FR-INV-033

  BR-PUR-005                         Detailed purchase import remains
                                     for Import/Export FRS

  BR-PUR-006                         FR-PUR-050, FR-PUR-070; import
                                     validation remains cross-linked to
                                     Import/Export

  BR-SUP-004                         FR-PUR-075, FR-PUR-103

  BR-CAT-007                         FR-PUR-015, FR-PUR-065

  BR-DATA-001/002/004/007            FR-PUR-019--020, 073, 080--085,
                                     101, 106--110

  BR-OPS-001                         FR-PUR-018, 083, 108
  ---------------------------------------------------------------------

## 7. Batch 2 coverage --- Inventory

  ---------------------------------------------------------------------
  Business requirement               Functional requirements
  ---------------------------------- ----------------------------------
  BR-INV-001                         FR-INV-002--005, 031--043

  BR-INV-002                         FR-INV-001, 005--006, 019--020

  BR-INV-003                         FR-INV-002, 024, 050, 054, 089

  BR-INV-004                         FR-INV-008--013, 085, 101

  BR-INV-005                         FR-INV-014--018, 045--046, 062,
                                     084, 107

  BR-INV-006                         FR-INV-056--079

  BR-INV-007                         FR-INV-037--041, 049, 069,
                                     080--090

  BR-INV-008                         FR-INV-042 (Phase 3 extension)

  BR-INV-009                         FR-INV-021--025, 055, 066,
                                     091--110

  BR-DATA-001/002/004/007            FR-INV-018, 030, 044, 051--054,
                                     073, 088, 090, 103, 105, 108

  BR-OPS-001                         FR-INV-028, 079
  ---------------------------------------------------------------------

## 8. Batch 2 decision dependencies

v0.8/v0.9 resolved the initial costing and negative-stock baselines:

-   `FR-INV-091–110` uses moving weighted-average cost per Item per
    Store.
-   `FR-INV-008–013` may describe policy modes, but the Phase-1 default
    is **BLOCK** under the approved WAC baseline.
-   `FR-PUR-055`, `076`, `104` use the approved
    free-quantity/acquisition-cost treatment.
-   Recoverable/non-recoverable purchase-tax classification remains a
    verified country/accounting input; the core capitalization rule is
    defined.

Still open for later implementation: - `FR-INV-064`, `074–076` require
`DEC-INV-003` before stock-count concurrency implementation. -
Batch-aware POS depletion depends on `DEC-INV-004` and `DEC-INV-005`.

## 9. Batch 2 readiness boundary

Batch 2 is sufficiently specified to proceed to POS/Payments
requirements as a working draft, but inventory costing, negative-stock
default, count concurrency, and batch/expiry depletion remain decision
gates before corresponding production implementation.

## 10. Batch 3 coverage --- POS

  ---------------------------------------------------------------------
  Business requirement               Functional requirements
  ---------------------------------- ----------------------------------
  BR-POS-001                         FR-POS-004--007, 018--025, 048,
                                     066--069, 084

  BR-POS-002                         FR-POS-008--012, 085

  BR-POS-003                         FR-POS-013--015

  BR-POS-004                         FR-POS-027--030, 035

  BR-POS-005                         FR-POS-031--035

  BR-POS-006                         FR-POS-039--042; FR-PAY-065

  BR-POS-007                         FR-POS-043--044

  BR-POS-008                         FR-POS-016--017, 045--047

  BR-POS-009                         FR-POS-001, 080--081

  BR-POS-010                         FR-POS-059, 090

  BR-POS-011                         FR-POS-060--064, 078--083

  BR-OPS-001/004/005                 FR-POS-059--064

  BR-INV-002/004/005                 FR-POS-036--038, 053, 058

  BR-DATA-001/002/004/007            FR-POS-023, 047, 049, 052, 055,
                                     057, 064--065, 086
  ---------------------------------------------------------------------

## 11. Batch 3 coverage --- Payments

  ---------------------------------------------------------------------
  Business requirement               Functional requirements
  ---------------------------------- ----------------------------------
  BR-PAY-001                         FR-PAY-001--14, 052, 061

  BR-PAY-002                         FR-PAY-026--035, 055

  BR-PAY-003                         FR-PAY-036--045, 055

  BR-PAY-004                         FR-PAY-069--072; detailed
                                     customer-credit policy remains
                                     Batch 4

  BR-PAY-005                         FR-PAY-056--068, 072, 074

  BR-PAY-006                         FR-PAY-016--020, 029, 031--35,
                                     039, 041--50, 062--68, 075

  BR-PAY-007                         FR-PAY-015, 024, 054, 073

  BR-SEC-006                         FR-PAY-025, 046--047, 053

  BR-DATA-004                        FR-PAY-020, 031, 035, 041, 050,
                                     075
  ---------------------------------------------------------------------

## 12. Batch 3 coverage --- Sales Returns & Refunds

  Business requirement      Functional requirements
  ------------------------- ---------------------------------------------------------
  BR-RET-001                FR-RET-001, 006--009, 023--024, 028--033, 052, 054, 060
  BR-RET-002                FR-RET-002--005
  BR-RET-003                FR-RET-010--011, 019--020, 025, 042--045
  BR-RET-004                FR-RET-014--018
  BR-RET-005                FR-RET-036--046, 055--057, 059
  BR-RET-006                FR-RET-012--013
  BR-RET-007                FR-RET-021, 047, 058
  BR-INV-005                FR-RET-017--018
  BR-DATA-001/002/004/007   FR-RET-025--026, 032--035, 050, 053

## 13. Batch 3 decision dependencies

The following remain explicit decision gates:

-   Batch-aware sale depletion depends on `DEC-INV-004` and
    `DEC-INV-005`.
-   Negative-stock behavior exists functionally, but default depends on
    `DEC-INV-002`.
-   Held/active sale repricing depends on `DEC-POS-001` and
    `DEC-POS-002`.
-   Store Node survival behavior depends on `DEC-POS-004`.
-   Mixed cash/electronic rounding depends on `DEC-PAY-003` and country
    rules.
-   Partially-paid recovery depends on `DEC-PAY-005`.
-   No-receipt returns depend on `DEC-RET-001`.
-   Mixed-tender refunds depend on `DEC-RET-003`.
-   Tax/discount reversal behavior depends on `DEC-RET-006` and
    country/accounting validation.

## 14. Batch 3 readiness boundary

Batch 3 defines the complete working-draft checkout chain:

`Product → Price → Sale → Stock Policy → Payment → Posting → Receipt → Return → Refund`.

It is ready to feed Batch 4 requirements and later Domain Modeling,
while the listed decision gates remain unresolved and must not be
invented during implementation.

## 15. Batch 4 coverage --- Customers

  Business requirement   Functional requirements
  ---------------------- -------------------------------------
  BR-CUS-001             FR-CUS-002--014, 21--25, 36--39, 43
  BR-CUS-002             FR-CUS-001, 006
  BR-CUS-003             FR-CUS-007, 015--20
  BR-CUS-004             FR-CUS-026--030, 40, 44
  BR-CUS-005             FR-CUS-019, 41--42
  BR-OPS-001             FR-CUS-033--035
  BR-DATA-007            FR-CUS-014, 032
  BR-AUD-001             FR-CUS-010, 031

## 16. Batch 4 coverage --- Customer Credit

  Business requirement   Functional requirements
  ---------------------- ----------------------------------------
  BR-PAY-004             FR-CRD-001--22, 44, 48--50, 59--61, 65
  BR-PAY-005             FR-CRD-011, 060
  BR-RET-005             FR-CRD-020--22, 061
  BR-ACC-003             FR-CRD-007, 23--45, 55--56, 62--64
  BR-CUS-003             FR-CRD-039--43
  BR-AUD-001             FR-CRD-046, 057--58
  BR-OPS-001/002         FR-CRD-048--53
  BR-DATA-001/002/004    FR-CRD-019, 27--29, 38, 49, 52, 65

## 17. Batch 4 coverage --- Cashier Shift & Day Close

  Business requirement     Functional requirements
  ------------------------ ----------------------------------------
  BR-CASH-001              FR-CSH-001--12, 16--21, 35, 40--45, 75
  BR-CASH-002              FR-CSH-013--15, 22--29
  BR-CASH-003              FR-CSH-29--33, 55, 74
  BR-CASH-004              FR-CSH-012, 24, 54, 56
  BR-CASH-005              FR-CSH-34--39, 46--69
  BR-OPS-001/002/003/005   FR-CSH-008--10, 42--45, 67, 70--71
  BR-PAY-006               FR-CSH-025, 36, 52
  BR-DATA-002/004/007      FR-CSH-020--21, 37, 44, 61, 68--69

## 18. Batch 4 coverage --- Reporting

The BRD's **Section 20 --- Reports** is a category-level business
requirement without individual `BR-RPT-*` IDs. Batch 4 deliberately does
**not** invent missing BRD identifiers.

  BRD source area                   Functional requirements
  --------------------------------- -------------------------
  BRD §20 Sales reports             FR-RPT-016--24
  BRD §20 Cash/Payments reports     FR-RPT-025--30
  BRD §20 Inventory reports         FR-RPT-031--38
  BRD §20 Purchasing reports        FR-RPT-039--42
  BRD §20 Customer/Credit reports   FR-RPT-043--46
  BRD §20 Management reports        FR-RPT-047--50
  BR-DATA-007                       FR-RPT-051--52
  BR-OPS-001                        FR-RPT-053
  BR-INV-008 / BR-DATA-006          FR-RPT-054--55
  BR-CUS-004 / BR-SEC-003           FR-RPT-059--61
  BR-ACC-007                        FR-RPT-064

## 19. Batch 4 decision dependencies

-   Customer retention/anonymization depends on `DEC-CUS-002`.
-   Credit-limit default behavior depends on `DEC-CRD-001`.
-   Collection allocation and overpayment depend on `DEC-CRD-002` and
    `DEC-CRD-003`.
-   Multi-branch offline credit depends on `DEC-CRD-006`.
-   Business-date rollover depends on `DEC-CSH-001`.
-   Day-close handling of open shifts, late transactions and reopen
    depends on `DEC-CSH-002`--`004`.
-   Historical/current master grouping in reports depends on
    `DEC-RPT-001`.
-   Inventory valuation reporting still depends on Batch 2 costing
    decision `DEC-INV-001`.
-   Country-specific tax, invoicing, payment rounding and legal
    retention remain country-pack/validation concerns.

## 20. Batch 4 readiness boundary

Batch 4 completes the working-draft store operating loop:

`Customer → Credit → Sale/Collection → Shift Cash Accountability → Store Business Day Close → Operational Reports`.

It is ready to feed the remaining supporting-function FRS batch and
later Domain Modeling. Open decisions above remain explicit gates and
must not be invented by implementation agents.

## 15. Batch 4 coverage --- Customers

  Business requirement   Functional requirements
  ---------------------- --------------------------------------------
  BR-CUS-001             FR-CUS-002--013, 021--026, 036--039, 043
  BR-CUS-002             FR-CUS-001
  BR-CUS-003             FR-CUS-007, 015--020, 032; FR-CRD-039--043
  BR-CUS-004             FR-CUS-027--030, 040, 044; FR-RPT-060
  BR-CUS-005             FR-CUS-019, 041--042; FR-CRD-045
  BR-PAY-004             FR-CUS-017, 020; FR-CRD-001--022
  BR-DATA-007            FR-CUS-014, 032
  BR-OPS-001             FR-CUS-033--035
  BR-AUD-001             FR-CUS-031

## 16. Batch 4 coverage --- Customer Credit

  Business requirement   Functional requirements
  ---------------------- ------------------------------------------
  BR-PAY-004             FR-CRD-001--22, 044, 048--050, 059--061
  BR-PAY-005             FR-CRD-011, 060
  BR-RET-005             FR-CRD-020--022, 061
  BR-ACC-003             FR-CRD-007, 023--38, 55--56, 62--64
  BR-CUS-003             FR-CRD-039--43
  BR-AUD-001             FR-CRD-046, 057--058
  BR-SEC-003/004         FR-CRD-016, 037, 047
  BR-OPS-001/002         FR-CRD-048--053
  BR-DATA-001/002/004    FR-CRD-013, 019, 027--029, 038, 052, 065

## 17. Batch 4 coverage --- Cashier Shift & Day Close

  Business requirement     Functional requirements
  ------------------------ -------------------------------------
  BR-CASH-001              FR-CSH-001--12, 016--21, 35, 40--45
  BR-CASH-002              FR-CSH-013--15, 22--29
  BR-CASH-003              FR-CSH-029--33, 55, 74
  BR-CASH-004              FR-CSH-012, 24, 54, 56
  BR-CASH-005              FR-CSH-034--39, 46--69
  BR-PAY-006               FR-CSH-025, 36, 52
  BR-OPS-001/002/003/005   FR-CSH-008--10, 42--45, 67, 70--71
  BR-SEC-003/004           FR-CSH-006, 019, 32, 59, 72--73
  BR-DATA-002/004/007      FR-CSH-020--21, 37, 44, 61, 68--69

## 18. Batch 4 coverage --- Reporting

The BRD defines reporting as **Section 20** rather than a `BR-RPT-*`
identifier namespace. Batch 4 therefore traces report requirements to
that BRD section plus the underlying business requirements whose data is
reported.

  Business source              Functional requirements
  ---------------------------- -------------------------
  BRD §20 Reporting            FR-RPT-001--065
  BR-INV-009                   FR-RPT-031--036
  BR-INV-006/007               FR-RPT-037--038
  BR-PUR-001/004, BR-SUP-004   FR-RPT-039--042
  BR-CUS-003/004               FR-RPT-044--045, 060
  BR-ACC-003                   FR-RPT-043
  BR-PAY-006/007               FR-RPT-025--026
  BR-CASH-001/003/005          FR-RPT-027--030
  BR-AUD-001/004               FR-RPT-022, 046, 061
  BR-DATA-006/007              FR-RPT-051--055
  BR-SEC-003                   FR-RPT-002, 059

## 19. Batch 4 decision dependencies

The following remain explicit decision gates:

-   Customer retention/anonymization depends on `DEC-CUS-002` and
    country/legal obligations.
-   Credit-limit default behavior depends on `DEC-CRD-001`.
-   Collection allocation order and customer advances depend on
    `DEC-CRD-002` and `DEC-CRD-003`.
-   Multi-branch disconnected credit depends on `DEC-CRD-006`.
-   Business-date rollover, late transactions and day reopening depend
    on `DEC-CSH-004`, `DEC-CSH-006` and `DEC-CSH-007`.
-   Inventory valuation reporting remains blocked on the Batch 2 costing
    decision (`DEC-INV-001`).
-   Central multi-branch report completeness/freshness depends on
    `DEC-RPT-003`.

## 20. Batch 4 readiness boundary

Batch 4 completes the store-management loop around the checkout engine:

`Customer → Credit Eligibility → Sale/Credit → Collection → Shift Accountability → Business Day Close → Operational Reporting`.

Batch 4 is a functional specification only. It does not introduce
database schemas, API endpoints, UI layouts, statutory accounting
claims, or country-specific legal rules.

## 21. Batch 5 coverage --- Import & Export

  Business source           Functional requirements
  ------------------------- -------------------------------------
  BR-CAT-008                FR-IMP-002--003, 011, 016, 022--023
  BR-PRI-005                FR-IMP-024
  BR-PUR-005/006            FR-IMP-002, 004--17, 026, 045
  BR-INV-001                FR-IMP-027
  BR-CUS-001/004            FR-IMP-028, 041
  BR-ACC-006 / BR-BIZ-002   FR-IMP-036--043
  BR-AUD-001/002/003        FR-IMP-020--021, 042, 044
  BR-DATA-001/004           FR-IMP-015, 018--019, 032, 034, 039

## 22. Batch 5 coverage --- Audit

  Business requirement     Functional requirements
  ------------------------ ------------------------------
  BR-AUD-001               FR-AUD-001, 21--30, 44--45
  BR-AUD-002               FR-AUD-002, 004--009, 34--35
  BR-AUD-003               FR-AUD-010--011, 39--41, 45
  BR-AUD-004               FR-AUD-009, 14--20
  BR-SEC-001/003/004/006   FR-AUD-003, 011--14, 30, 32
  BR-SUPT-003/005          FR-AUD-025, 43
  BR-OPS-001               FR-AUD-036
  BR-DATA-004/005          FR-AUD-037, 42

## 23. Batch 5 coverage --- Hardware

  Business requirement   Functional requirements
  ---------------------- -----------------------------------------------
  BR-HW-001              FR-HW-001--11, 43--45, 48, 50
  BR-HW-002              FR-HW-012--18, 47
  BR-HW-003              FR-HW-019--22
  BR-HW-004              FR-HW-023--25
  BR-HW-005              FR-HW-026--28
  BR-HW-006              FR-HW-029--31
  BR-HW-007              FR-HW-032--35
  BR-HW-008              FR-HW-005, 016--18, 021, 025, 028, 43, 49--50
  BR-LOC-005             FR-HW-015
  BR-SUPT-003/004        FR-HW-003, 006, 041--42

## 24. Batch 5 coverage --- Backup & Recovery

  Business requirement   Functional requirements
  ---------------------- -------------------------------
  BR-REL-002             FR-BR-001--15, 39--40, 45
  BR-REL-003             FR-BR-010, 16, 18--19, 30, 43
  BR-REL-004             FR-BR-021--22, 45
  BR-REL-005             FR-BR-016, 23--35, 41--44
  BR-REL-006             FR-BR-009
  BR-REL-007             FR-BR-019, 36--38
  BR-SEC-003/006         FR-BR-004--005, 17
  BR-DATA-004/006        FR-BR-033--34

## 25. Batch 5 coverage --- Support & Diagnostics

  Business requirement   Functional requirements
  ---------------------- ------------------------------
  BR-SUPT-001            FR-SUPT-001--004, 044--45
  BR-SUPT-002            FR-SUPT-014, 021--22, 29, 42
  BR-SUPT-003            FR-SUPT-005--13, 33, 36
  BR-SUPT-004            FR-SUPT-015--19, 34--35, 43
  BR-SUPT-005            FR-SUPT-020, 25, 30, 32
  BR-SUPT-006            FR-SUPT-023--28, 45
  BR-SEC-005/006         FR-SUPT-017, 28, 38
  BR-DATA-002/005/006    FR-SUPT-031, 37, 39

## 26. Batch 5 coverage --- Country behavior

The BRD country requirements are expressed primarily in **BRD §22
Country Editions**, localization requirements and `BO-006`, rather than
a `BR-CTRY-*` namespace.

  Business source                     Functional requirements
  ----------------------------------- -------------------------
  BO-006 / BRD §22 Country Editions   FR-CTRY-001--020
  BR-LOC-001/004/005                  FR-CTRY-006--10
  BR-PAY-003                          FR-CTRY-017
  BRD §22 Malaysia Edition            FR-CTRY-021--035
  BR-LOC-002                          FR-CTRY-023
  BRD §22 India Edition               FR-CTRY-036--050
  BR-LOC-003                          FR-CTRY-038
  BR-PRI-003                          FR-CTRY-047
  BR-ACC-006                          FR-CTRY-048

## 27. Batch 5 verification gates

-   Country legal/tax/e-invoice details remain **verification gates**,
    not assumed requirements.
-   Backup RPO/RTO/retention remain deployment decisions.
-   Audit/log retention remains legal/privacy/operations dependent.
-   Exact supported hardware models/interfaces remain Phase 0 validation
    decisions.
-   Remote-support technology remains a controlled infrastructure
    decision.
-   Import does not bypass domain validation or posting invariants.

## 28. FRS coverage status after Batch 5

The functional baseline now covers the intended initial MiniMart
operating surface:

`Organization → IAM → Catalog → Pricing → Suppliers → Purchasing → Inventory → POS → Payments → Returns → Customers → Credit → Shift/Day Close → Reporting → Import/Export → Audit → Hardware → Backup/Recovery → Support/Diagnostics → Country Boundaries`.

The next step is a **full FRS consistency audit and freeze-candidate
review toward v1.0**, including ID/reference validation,
terminology/state alignment, open-decision classification, cross-module
invariant review and removal of contradictions before Domain Modeling.

## 29. Full consistency-audit corrections

  ---------------------------------------------------------------------
  BRD requirement                    Audit result
  ---------------------------------- ----------------------------------
  `BR-BIZ-001`                       Product-scope constraint; no
                                     one-to-one FR required.

  `BR-OPS-004`                       Covered across POS recovery,
                                     Backup/Recovery, Hardware and
                                     Support; central mapping should be
                                     consolidated.

  `BR-OPS-005`                       Covered by Common durability, POS
                                     recovery, Inventory durability and
                                     Shift recovery.

  `BR-DATA-003`                      Substantively covered by Inventory
                                     Stock Movement; add explicit
                                     source mapping.

  `BR-DATA-005`                      Covered by Common failure behavior
                                     and module recovery rules; add
                                     central mapping.

  `BR-ACC-001`                       Partial coverage; Accounting-Lite
                                     remediation required.

  `BR-ACC-004`                       Cash movement covered; general
                                     bank movement not yet specified.

  `BR-ACC-005`                       Functional gap: expense recording
                                     not yet specified.
  ---------------------------------------------------------------------

Traceability cannot be declared complete until Accounting-Lite is
specified and Batch-1/Common source gaps are normalized.

## 30. v0.8 remediation traceability

  ----------------------------------------------------------------------
  BRD source                       Remediated functional coverage
  -------------------------------- -------------------------------------
  `BR-DATA-001`, `BR-PAY-006/007`  `FR-POS-052/054`, `FR-PAY-062–068`,
                                   `FR-PAY-073` --- Payment Commitment
                                   is separated from posted Tender and
                                   final Sale posting.

  `BR-RET-005`, `BR-DATA-001`      `FR-RET-026`, `FR-RET-048–051` ---
                                   posted Return and Refund
                                   Obligation/settlement are separate
                                   states.

  `BR-PRI-003`, `BR-INV-009`,      `FR-INV-091–110` --- moving WAC
  `BR-PUR-003/004`                 operational baseline and
                                   acquisition-cost rules.

  `BR-PAY-004`, `BR-ACC-003`       Phase-1/2 minimum `FR-CRD-*` subset
                                   --- basic credit
                                   sale/collection/outstanding.

  `BR-CAT-001/002`, `BR-CUS-001`,  company-wide Item/Customer/Supplier
  `BR-SUP-001`, `BR-PRI-001`       identity and store-scoped
                                   price/stock/cost baseline.

  `BO-006`, BRD Country Editions   `FR-CTRY-003` plus
                                   `DOMAIN-OWNERSHIP-BASELINE-v0.8.md`
                                   --- version/effective country
                                   behavior and immutable historical
                                   meaning.

  `BR-ACC-001`                     `FR-ACC-001–010`, `041–050`

  `BR-ACC-002`                     `FR-ACC-011–020`

  `BR-ACC-003`                     `FR-ACC-021–023` plus Customer Credit

  `BR-ACC-004`                     `FR-ACC-024–033`, `040`

  `BR-ACC-005`                     `FR-ACC-034–040`

  `BR-ACC-006`                     `FR-ACC-047–048`

  `BR-ACC-007`                     `FR-ACC-002`, `050`; full accounting
                                   remains professionally validated
                                   later
  ----------------------------------------------------------------------

### Result

The seven v0.7 freeze blockers now have explicit v0.8 working baselines.
Remaining v1.0 work is primarily specification normalization, NFRS
reconciliation, automated re-audit and final freeze review.

## 31. v1.0 Release Candidate gate

The v0.9 second consistency audit reports: - 1,257 unique FR IDs; - 0
duplicate IDs; - 0 namespace gaps; - 0 invalid explicit BR references; -
0 missing direct Source fields; - 0 missing requirement-level Acceptance
fields; - 0 non-standard Priority values; - 0 non-standard Phase
values; - 84 unique NFR IDs; - 102 unique acceptance scenarios; - 0
broken Markdown references detected by the package scan.

`BR-BIZ-001` remains a product-scope constraint rather than an
artificial one-to-one FR. All other explicit BRD requirement IDs have
direct functional citation.

The FRS is approved by the audit for **v1.0 Release Candidate
creation**. Final freeze remains a separate review action.
