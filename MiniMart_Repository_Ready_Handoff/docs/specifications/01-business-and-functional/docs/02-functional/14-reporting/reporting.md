# MiniMart Reporting Functional Specification --- v0.5

**Document ID:** MM-FRS-RPT-001\
**Requirement namespace:** `FR-RPT-001`--`FR-RPT-065`\
**Status:** Detailed Working Draft --- Batch 4

## Purpose

Define operational reporting, reconciliation, filtering and export
behavior over posted MiniMart data.

## Requirements

### FR-RPT-001 --- Reporting read-only principle

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Reports shall present posted/approved operational data and shall not
provide a hidden route to edit source transactions.

**Acceptance:** Changing report filters never changes business records.

### FR-RPT-002 --- Report authorization

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Each report/data scope shall require appropriate role permission.

**Acceptance:** Unauthorized users cannot view restricted
financial/customer data.

### FR-RPT-003 --- Store scope

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Reports shall identify and filter by permitted store scope.

**Acceptance:** Totals state which store(s) are included.

### FR-RPT-004 --- Business date filter

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Operational reports shall support business-date filtering where
relevant.

**Acceptance:** After-midnight transactions follow assigned business
date.

### FR-RPT-005 --- Timestamp/date filter

**Source:** BRD §20 Reports\
**Priority:** SHOULD\
**Phase:** 2

Reports should support actual timestamp/calendar-date filters where
investigation requires them.

**Acceptance:** Business date and timestamp are not conflated.

### FR-RPT-006 --- Counter filter

**Source:** BRD §20 Reports\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Sales/tender/shift reports shall support counter filtering.

**Acceptance:** Counter totals reconcile to source.

### FR-RPT-007 --- Cashier filter

**Source:** BRD §20 Reports\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Sales/discount/return/shift reports shall support cashier filtering
subject to permissions.

**Acceptance:** User-level totals are traceable.

### FR-RPT-008 --- Product filter

**Source:** BRD §20 Reports\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Sales/inventory/purchase reports shall support product search/filter.

**Acceptance:** Selected product scope is visible.

### FR-RPT-009 --- Category/brand filter

**Source:** BRD §20 Reports\
**Priority:** SHOULD\
**Phase:** 2

Applicable reports should filter/group by category/brand.

**Acceptance:** Grouping uses historical/current semantics defined by
report.

### FR-RPT-010 --- Supplier filter

**Source:** BRD §20 Reports\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Purchase reports shall support supplier filtering.

**Acceptance:** Supplier scope is explicit.

### FR-RPT-011 --- Customer filter

**Source:** BRD §20 Reports\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Customer/credit reports shall support customer filtering with privacy
permissions.

**Acceptance:** Customer scope is explicit.

### FR-RPT-012 --- Tender filter

**Source:** BRD §20 Reports\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Payment reports shall support tender-type filtering.

**Acceptance:** Cash/card/QR/credit are distinguishable.

### FR-RPT-013 --- Status filter

**Source:** BRD §20 Reports\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Reports shall distinguish posted/completed from
cancelled/failed/pending/uncertain states as appropriate.

**Acceptance:** Unresolved states are not silently counted as success.

### FR-RPT-014 --- Report generated timestamp

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Report output shall show generation time and applicable as-of
period/scope.

**Acceptance:** Reader knows report context.

### FR-RPT-015 --- Pagination/large result handling

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Large reports shall be usable without requiring the UI to load an unsafe
unbounded result set.

**Acceptance:** User can navigate/export within defined limits.

### FR-RPT-016 --- Daily sales summary

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

MiniMart shall provide daily sales summary with approved gross sales,
discounts, returns and net-sales definitions.

**Acceptance:** Totals reconcile to posted sales/returns.

### FR-RPT-017 --- Sales by item

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Report shall summarize sold/returned quantity and value by item.

**Acceptance:** Drill/reference can trace to source where permitted.

### FR-RPT-018 --- Sales by category

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Report shall summarize sales by category according to defined
category-history semantics.

**Acceptance:** Total reconciles to selected sales scope.

### FR-RPT-019 --- Sales by cashier

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Report shall summarize sales/returns/discounts by cashier.

**Acceptance:** Totals reconcile to source transactions.

### FR-RPT-020 --- Sales by counter

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Report shall summarize sales by counter.

**Acceptance:** Store total reconciles to included counters.

### FR-RPT-021 --- Discount report

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Report shall show discounts, discount type/reason and override context
where permitted.

**Acceptance:** Management can review exceptional discounts.

### FR-RPT-022 --- Price override report

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 2

Report shall identify manual price overrides with original/overridden
values and approver context.

**Acceptance:** High-risk overrides are reviewable.

### FR-RPT-023 --- Returns report

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Report shall summarize sales returns by reason, item, cashier and value.

**Acceptance:** Returns reconcile to posted return documents.

### FR-RPT-024 --- No-receipt return report

**Source:** BR-RET-007\
**Priority:** MUST

**Applicability:** If the feature is enabled\
**Phase:** 2

Exceptional returns without original sale shall be separately
identifiable.

**Acceptance:** High-risk return activity is visible.

### FR-RPT-025 --- Tender summary

**Source:** BR-PAY-007\
**Priority:** MUST\
**Phase:** 2

Report shall summarize confirmed tenders and refunds by type.

**Acceptance:** Totals reconcile to posted payment records.

### FR-RPT-026 --- Payment exception report

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 2/3

Report shall list pending/uncertain/failed electronic payment/refund
cases requiring operational follow-up.

**Acceptance:** Exceptions are not hidden inside confirmed totals.

### FR-RPT-027 --- Cash movement report

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Report shall list opening floats, cash-in/out, cash refunds/collections
and closing declarations as permitted.

**Acceptance:** Drawer movement is explainable.

### FR-RPT-028 --- Cash variance report

**Source:** BR-CASH-003\
**Priority:** MUST\
**Phase:** 2

Report shall show expected, actual and shortage/overage by
shift/counter/cashier.

**Acceptance:** No silent balancing occurs.

### FR-RPT-029 --- Shift close report

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Report shall reproduce posted shift-close summary.

**Acceptance:** Report matches close record.

### FR-RPT-030 --- Day close report

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Report shall reproduce posted store day-close summary.

**Acceptance:** Report matches close record and included shifts.

### FR-RPT-031 --- Current stock report

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 2

Report shall show current stock by item/store and relevant batch where
configured.

**Acceptance:** Quantity reconciles to inventory balance/movements.

### FR-RPT-032 --- Low stock report

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 2

Report shall identify items below approved reorder/low-stock threshold
once threshold ownership is defined.

**Acceptance:** Threshold basis is visible.

### FR-RPT-033 --- Negative stock report

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 2

Report shall identify negative stock quantities where policy permits
them.

**Acceptance:** Negative inventory is operationally visible.

### FR-RPT-034 --- Stock movement report

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 2

Report shall show inventory movements with source document, direction,
quantity and running/contextual balance where supported.

**Acceptance:** Current stock can be investigated.

### FR-RPT-035 --- Batch/expiry report

**Source:** BR-INV-009\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 2

Report shall show batch quantities and expiry information according to
configured tracking.

**Acceptance:** Expiring/expired stock can be identified.

### FR-RPT-036 --- Inventory valuation report

**Source:** BR-INV-009\
**Priority:** MUST

**Decision Status:** Resolved by v0.8 WAC baseline\
**Phase:** 2

Report shall show inventory valuation as of defined date using the
approved costing method.

**Acceptance:** Method/as-of scope are stated.

### FR-RPT-037 --- Stock count variance report

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 2

Report shall show expected, counted, variance, reason/approval for
posted counts.

**Acceptance:** Variance traces to adjustment.

### FR-RPT-038 --- Stock adjustment report

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 2

Report shall show manual adjustments by item/reason/user/value where
permitted.

**Acceptance:** High-risk adjustments are reviewable.

### FR-RPT-039 --- Purchase summary

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 2

Report shall summarize posted purchases/GRNs by period/store/supplier.

**Acceptance:** Totals reconcile to source documents.

### FR-RPT-040 --- Purchase by supplier

**Source:** BR-SUP-004\
**Priority:** MUST\
**Phase:** 2

Report shall show quantities/values purchased from selected suppliers.

**Acceptance:** Supplier purchasing history is available.

### FR-RPT-041 --- Purchase return report

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 2

Report shall summarize posted purchase returns.

**Acceptance:** Totals reconcile to source returns.

### FR-RPT-042 --- Purchase price history

**Source:** BR-SUP-004\
**Priority:** SHOULD\
**Phase:** 2

Authorized report shall show historical purchase prices by
item/supplier.

**Acceptance:** Cost-sensitive access is controlled.

### FR-RPT-043 --- Customer outstanding report

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 2

Report shall show customer outstanding balances as of a stated
date/scope.

**Acceptance:** Total reconciles to credit ledger/transactions.

### FR-RPT-044 --- Customer aging report

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 2

Report shall show due/overdue customer amounts using approved aging
buckets.

**Acceptance:** As-of date and bucket definitions are visible.

### FR-RPT-045 --- Customer statement

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 2

Report shall provide customer opening balance, transactions,
collections/adjustments and closing balance for selected period.

**Acceptance:** Statement reconciles mathematically.

### FR-RPT-046 --- Credit override report

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 2

Report shall identify over-limit/credit-status overrides where enabled.

**Acceptance:** Approver/reason are reviewable.

### FR-RPT-047 --- Management daily summary

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

MiniMart shall provide a concise daily management summary covering
sales, returns, tender mix, cash variance and key exceptions.

**Acceptance:** Summary links/reconciles to detailed reports.

### FR-RPT-048 --- Exception-oriented reporting

**Source:** BRD §20 Reports\
**Priority:** SHOULD\
**Phase:** 2

Management reports should highlight material exceptions such as negative
stock, uncertain payments, cash variance and unusual overrides.

**Acceptance:** Exceptions are actionable, not silently buried.

### FR-RPT-049 --- Comparative periods

**Source:** BRD §20 Reports\
**Priority:** COULD\
**Phase:** 2+

Selected reports may compare approved periods without changing source
calculations.

**Acceptance:** Comparison labels each period clearly.

### FR-RPT-050 --- Report totals definition

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Every financial report shall use documented definitions for
gross/net/discount/tax/return values.

**Acceptance:** Different reports do not use unexplained conflicting
definitions.

### FR-RPT-051 --- Historical master-data semantics

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 2

Reports shall define whether grouping uses historical posted attributes
or current master attributes where changes could alter interpretation.

**Acceptance:** Historical totals remain explainable.

### FR-RPT-052 --- As-of reporting

**Source:** BR-DATA-007\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 2

Balance/valuation reports shall state as-of date/time and use only
effective data applicable to that point.

**Acceptance:** Later transactions do not leak into historical as-of
result.

### FR-RPT-053 --- Offline local reports

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 2

Reports based on authoritative local store data shall remain available
without cloud where practical.

**Acceptance:** Output clearly states local/store scope.

### FR-RPT-054 --- Central multi-branch report scope

**Source:** BR-INV-008\
**Priority:** LATER\
**Phase:** 3

Cloud/central reports shall support multiple branches once synchronized
centralization is implemented.

**Acceptance:** Report indicates synchronization/as-of limitations.

### FR-RPT-055 --- Incomplete sync warning

**Source:** BR-DATA-006\
**Priority:** MUST\
**Phase:** 3

Central report shall not imply completeness when known branch
synchronization is stale/incomplete.

**Acceptance:** Freshness/exception is visible.

### FR-RPT-056 --- Print report

**Source:** BRD §20 Reports\
**Priority:** SHOULD\
**Phase:** 2

Authorized user should be able to print selected reports in readable
form.

**Acceptance:** Printed scope/totals match screen/export.

### FR-RPT-057 --- Export CSV

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Authorized user shall be able to export appropriate tabular reports to
CSV.

**Acceptance:** Export preserves report scope and exact values.

### FR-RPT-058 --- Export spreadsheet boundary

**Source:** BRD §20 Reports\
**Priority:** SHOULD\
**Phase:** 2

Spreadsheet export may be provided through Import/Export specification
without changing report calculations.

**Acceptance:** Exported totals match report.

### FR-RPT-059 --- Export permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Sensitive report export shall require explicit permission independent
where appropriate from on-screen viewing.

**Acceptance:** Unauthorized bulk data extraction is blocked.

### FR-RPT-060 --- PII-aware export

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 2

Customer-containing reports/exports shall minimize/mask personal data
according to permission and purpose.

**Acceptance:** Financial reporting need not expose unnecessary PII.

### FR-RPT-061 --- Report audit

**Source:** BR-AUD-001\
**Priority:** SHOULD\
**Phase:** 2

Access/export of selected sensitive reports should be auditable
according to policy.

**Acceptance:** Sensitive extraction can be investigated.

### FR-RPT-062 --- Report failure behavior

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

If report generation fails or is incomplete, MiniMart shall show
failure/scope status rather than a misleading partial total.

**Acceptance:** User is not given false completeness.

### FR-RPT-063 --- Report performance target

**Source:** BRD §20 Reports\
**Priority:** SHOULD\
**Phase:** 2

Common store reports shall have benchmark targets defined against
representative data volumes before release sign-off.

**Acceptance:** Performance is measured, not assumed.

### FR-RPT-064 --- No accounting claim beyond scope

**Source:** BR-ACC-007\
**Priority:** MUST\
**Phase:** 2

Operational reports shall not be labelled as statutory accounting
statements unless corresponding accounting rules are professionally
validated and implemented.

**Acceptance:** Retail reports remain operational.

### FR-RPT-065 --- Reporting acceptance suite

**Source:** BRD §20 Reports, BR-DATA-007\
**Priority:** MUST\
**Phase:** 2

Tests shall reconcile daily sales, tenders, returns, stock, customer
balances, shift/day close and exports against known posted scenarios.

**Acceptance:** Cross-report totals are regression-tested.

## Reporting principle

Reports are consumers of posted business data. They do not become an
alternate transaction-editing system.

## Initial report families

Sales, payments, cash/shift/day close, inventory, purchasing, customer
credit and management exception summaries are included. Statutory
accounting statements are not claimed until the accounting layer is
validated.
