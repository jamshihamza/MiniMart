# MiniMart Specification Changelog

## v0.2 --- FRS Batch 1

Detailed functional specifications added for:

-   Organization / Store / Counter (`FR-ORG-001`--`030`)
-   Identity & Access (`FR-IAM-001`--`040`)
-   Product Catalog (`FR-CAT-001`--`060`)
-   Pricing (`FR-PRI-001`--`036`)
-   Supplier Management (`FR-SUP-001`--`036`)

Also: - updated master FRS module status; - expanded BR → FR
traceability; - documented unresolved dependencies/open decisions; -
retained the common functional foundation and NFRS from v0.1.

No database schema, API endpoint, UI component, or implementation code
has been introduced.

## v0.3 --- FRS Batch 2

Added 220 detailed working requirements: - Purchasing
`FR-PUR-001`--`110` - Inventory `FR-INV-001`--`110`

Added optional PO/direct-GRN behaviour, GRN validation/posting/recovery,
purchase returns, stock movements, negative-stock modes, batch/expiry
behaviour, stock count/adjustment, decision-sensitive costing, a
Decision Register, and expanded traceability.

Weighted-average costing is proposed but **not approved/frozen**. No
country-specific tax/legal treatment was invented.

## v0.4 --- FRS Batch 3

Added 225 detailed working requirements: - POS `FR-POS-001`--`090` -
Payments `FR-PAY-001`--`075` - Sales Returns/Refunds `FR-RET-001`--`060`

Added: - barcode/search checkout and quantity rules; - discount/price
override and manager approval; - held-sale concurrency and
revalidation; - negative-stock and batch/expiry decision gates; -
offline sale and restart/power-failure recovery; -
receipt/reprint/hardware-failure behavior; - cash, external card and QR
tender behavior; - future integrated-payment
pending/uncertain/idempotency rules; - split-tender partial-success
recovery; - sales return eligibility and concurrent over-return
prevention; - stock disposition for sellable/damaged returns; -
refund-method, retry and uncertainty rules; - 18 cross-module acceptance
scenarios; - expanded Decision Register and Traceability.

No country-specific payment, tax, cash-rounding or refund law was
invented. Those remain country-pack decisions requiring verification.

## v0.5 --- FRS Batch 4

Added 250 detailed working requirements: - Customers
`FR-CUS-001`--`045` - Customer Credit `FR-CRD-001`--`065` - Cashier
Shift & Day Close `FR-CSH-001`--`075` - Reporting `FR-RPT-001`--`065`

Added 24 cross-module acceptance scenarios.

Expanded the Decision Register for customer identity/privacy,
credit-limit and collection policy, shift/cash controls,
business-date/day-close behavior, reporting semantics and multi-branch
freshness.

Updated BRD→FRS traceability. The BRD reporting section has no
`BR-RPT-*` namespace, so reporting requirements are explicitly traced to
`BRD §20 Reporting` plus the underlying business requirement IDs instead
of inventing a BR identifier.

No database schema, API contract, UI layout, statutory accounting claim
or country-specific legal rule was introduced.

## v0.6 --- FRS Batch 5

Added 280 detailed/boundary requirements: - Import/Export: 45 - Audit:
45 - Hardware: 50 - Backup/Recovery: 45 - Support/Diagnostics: 45 -
Country Behavior: 50

Added 24 cross-module Batch 5 acceptance scenarios and expanded Decision
Register/Traceability.

Country files intentionally define capability boundaries only. Current
tax rates, thresholds, submission deadlines and legal applicability are
not asserted; those require dated authoritative verification in
dedicated compliance specifications.

FRS planned module coverage is now complete. v1.0 freeze remains pending
consistency audit.

## v0.8 --- Freeze-blocker remediation

-   Resolved Sale/PaymentAttempt/PaymentCommitment/Tender lifecycle.
-   Resolved Return/RefundObligation/Refund settlement lifecycle.
-   Approved working moving-WAC operational costing baseline.
-   Aligned Phase-1 basic Customer Credit scope.
-   Resolved company/store ownership baseline for Item, Supplier,
    Customer, stock, cost and price assignment.
-   Resolved country rule-set version/effective model.
-   Added `FR-ACC-001–050` Accounting-Lite.
-   Added remediation acceptance scenarios and traceability.
-   Structural check: 1,257 unique FRs, 22 namespaces, 0 duplicates, 0
    gaps, 0 invalid explicit BRD references.
-   FRS v1.0 still awaits metadata normalization, NFRS reconciliation
    and second re-audit.

## v1.0 --- Frozen requirements baseline

-   Final FRS freeze review passed.
-   FRS and NFRS marked FROZEN.
-   Consolidated Decision Register retained as governance companion.
-   1,257 FRs / 22 namespaces / 84 NFRs / 102 acceptance scenarios
    validated.
-   Domain Model v0.1 authorized to start.
