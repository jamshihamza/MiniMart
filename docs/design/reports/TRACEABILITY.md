# Reporting design traceability

> Navigation and review aid for the Reporting visual-design package. It is not product authority. The frozen specifications, Decision Register and backlog outrank it. Status: `review-ready`, not an approved visual reference.

Base commit: `a0350fe214dfe94525b502ce983db1a0d1fbce82`. Source: `source/MiniMartReports.dc.html` (80 screens). Machine-readable form: `traceability.json`.

## Authority used

- requirements: docs/specifications/01-business-and-functional/docs/02-functional/14-reporting/reporting.md (FR-RPT-001..065)
- ui: docs/specifications/06-ui-specification/screens/UI-RPT-001..005 and UI-EXP-001
- api: docs/specifications/05-api-contracts: API-RPT-001 (reporting.read), API-RPT-002 (reporting.read), API-RPT-003 (reporting.write), docs/06-READ-QUERY-REPORTING.md
- backlog: docs/backlog: MM-079..MM-083 (Reports), MM-097 (Export Center)
- decisions: DEC-RPT-001 (OPEN by report), DEC-RPT-002 (PROPOSED)

## Frozen UI screens and design screens

| Source                                                                 | Design screens | API                                   |
| ---------------------------------------------------------------------- | -------------- | ------------------------------------- |
| UI-RPT-001 Reports Home                                                | 01–10 (10)     | API-RPT-001                           |
| UI-RPT-002 Sales Report                                                | 29–39 (11)     | API-RPT-001, API-RPT-002, API-RPT-003 |
| UI-RPT-003 Inventory Report                                            | 44–51 (8)      | API-RPT-001, API-RPT-002, API-RPT-003 |
| UI-RPT-004 Purchase / Supplier Report                                  | 52–55 (4)      | API-RPT-001, API-RPT-002, API-RPT-003 |
| UI-RPT-005 Credit / Collection Report                                  | 56–60 (5)      | API-RPT-001, API-RPT-002, API-RPT-003 |
| Shared by UI-RPT-002..005 (viewer anatomy, rules and states)           | 11–28 (18)     | API-RPT-002                           |
| UI-EXP-001 Export Center (hand-off proposal)                           | 64–72 (9)      | API-RPT-003, API-IMP-005, API-IMP-010 |
| No frozen owner screen: cash and day-close reports                     | 40–43 (4)      | API-RPT-002                           |
| No frozen owner screen: management summary (UI-SYS-003 is the nearest) | 61–63 (3)      | API-RPT-002                           |
| No frozen UI: central reports (Phase 3)                                | 73 (1)         | API-RPT-002                           |
| Design package only                                                    | 74–80 (7)      | none                                  |

## Permissions

- `reporting.read`: report definitions and report runs (API-RPT-001, API-RPT-002).
- `reporting.write`: report export jobs (API-RPT-003). This is the only export permission in the frozen contracts.
- Any other permission (cost visibility, drill-down, unmasking customer data, sensitive export, per-cashier visibility) is not defined and is marked GAP.

## Requirement coverage (FR-RPT-001..065)

| Requirement | Title                             | Screens                            |
| ----------- | --------------------------------- | ---------------------------------- |
| FR-RPT-001  | Reporting read-only principle     | 01, 03, 11, 18, 28, 75, 77, 79, 80 |
| FR-RPT-002  | Report authorization              | 01, 02, 05, 06, 22                 |
| FR-RPT-003  | Store scope                       | 11, 12                             |
| FR-RPT-004  | Business date filter              | 12, 13, 21, 29                     |
| FR-RPT-005  | Timestamp/date filter             | 12, 13                             |
| FR-RPT-006  | Counter filter                    | 12, 33, 40, 41                     |
| FR-RPT-007  | Cashier filter                    | 12, 32, 34, 40, 41                 |
| FR-RPT-008  | Product filter                    | 12, 30, 44, 47                     |
| FR-RPT-009  | Category/brand filter             | 03, 12, 15, 31                     |
| FR-RPT-010  | Supplier filter                   | 12, 52, 53                         |
| FR-RPT-011  | Customer filter                   | 12, 56, 58, 60                     |
| FR-RPT-012  | Tender filter                     | 12, 38                             |
| FR-RPT-013  | Status filter                     | 12, 20, 38, 39                     |
| FR-RPT-014  | Report generated timestamp        | 01, 11, 61                         |
| FR-RPT-015  | Pagination/large result handling  | 04, 11, 17, 19, 76                 |
| FR-RPT-016  | Daily sales summary               | 14, 29                             |
| FR-RPT-017  | Sales by item                     | 18, 30                             |
| FR-RPT-018  | Sales by category                 | 31                                 |
| FR-RPT-019  | Sales by cashier                  | 32                                 |
| FR-RPT-020  | Sales by counter                  | 33                                 |
| FR-RPT-021  | Discount report                   | 34                                 |
| FR-RPT-022  | Price override report             | 35                                 |
| FR-RPT-023  | Returns report                    | 36                                 |
| FR-RPT-024  | No-receipt return report          | 37                                 |
| FR-RPT-025  | Tender summary                    | 38                                 |
| FR-RPT-026  | Payment exception report          | 39, 62                             |
| FR-RPT-027  | Cash movement report              | 40                                 |
| FR-RPT-028  | Cash variance report              | 41, 62                             |
| FR-RPT-029  | Shift close report                | 42                                 |
| FR-RPT-030  | Day close report                  | 43                                 |
| FR-RPT-031  | Current stock report              | 44                                 |
| FR-RPT-032  | Low stock report                  | 45                                 |
| FR-RPT-033  | Negative stock report             | 46                                 |
| FR-RPT-034  | Stock movement report             | 47                                 |
| FR-RPT-035  | Batch/expiry report               | 48                                 |
| FR-RPT-036  | Inventory valuation report        | 14, 49                             |
| FR-RPT-037  | Stock count variance report       | 50                                 |
| FR-RPT-038  | Stock adjustment report           | 51                                 |
| FR-RPT-039  | Purchase summary                  | 52                                 |
| FR-RPT-040  | Purchase by supplier              | 53                                 |
| FR-RPT-041  | Purchase return report            | 54                                 |
| FR-RPT-042  | Purchase price history            | 55                                 |
| FR-RPT-043  | Customer outstanding report       | 56                                 |
| FR-RPT-044  | Customer aging report             | 14, 57                             |
| FR-RPT-045  | Customer statement                | 58                                 |
| FR-RPT-046  | Credit override report            | 59                                 |
| FR-RPT-047  | Management daily summary          | 01, 61                             |
| FR-RPT-048  | Exception-oriented reporting      | 01, 62                             |
| FR-RPT-049  | Comparative periods               | 63                                 |
| FR-RPT-050  | Report totals definition          | 11, 14, 29, 74                     |
| FR-RPT-051  | Historical master-data semantics  | 03, 15, 31                         |
| FR-RPT-052  | As-of reporting                   | 16, 49, 57                         |
| FR-RPT-053  | Offline local reports             | 07, 11, 25                         |
| FR-RPT-054  | Central multi-branch report scope | 10, 73                             |
| FR-RPT-055  | Incomplete sync warning           | 10, 73                             |
| FR-RPT-056  | Print report                      | 11, 71                             |
| FR-RPT-057  | Export CSV                        | 11, 64, 66, 67, 69                 |
| FR-RPT-058  | Export spreadsheet boundary       | 64, 67                             |
| FR-RPT-059  | Export permission                 | 65, 70                             |
| FR-RPT-060  | PII-aware export                  | 60, 70                             |
| FR-RPT-061  | Report audit                      | 72                                 |
| FR-RPT-062  | Report failure behavior           | 08, 09, 23, 24, 26, 27, 68, 69     |
| FR-RPT-063  | Report performance target         | 78                                 |
| FR-RPT-064  | No accounting claim beyond scope  | 28, 79, 80                         |
| FR-RPT-065  | Reporting acceptance suite        | 78                                 |

Coverage: 65 of 65 requirements have at least one screen. FR-RPT-063 and FR-RPT-065 need data volumes and tests, so they point to the decisions screen.

## Open decisions

| Decision                      | Status   | What is undecided                                                                                                                                  |
| ----------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEC-RPT-001                   | OPEN     | Historical versus current master grouping, decided per report.                                                                                     |
| DEC-RPT-002                   | PROPOSED | The Phase-2 baseline report list is the one in the Reporting FRS. The design follows that list; it is not frozen.                                  |
| FR-RPT-050 / 016              | OPEN     | Definitions of gross sales, discounts, returns, net sales and tax for reports. FR-RPT-016 requires "approved" definitions that no document states. |
| FR-RPT-044                    | OPEN     | Approved aging buckets and the due-date basis (with DEC-CRD-002).                                                                                  |
| DEC-INV-007                   | OPEN     | Who owns the reorder or low-stock threshold.                                                                                                       |
| DEC-INV-004 / 005             | OPEN     | Batch selection and expiry/FEFO policy; DEC-POS-003 expiry-sale policy is VERIFY.                                                                  |
| DEC-INV-003                   | OPEN     | Stock-count concurrency policy.                                                                                                                    |
| DEC-RET-001                   | OPEN     | Whether no-receipt returns exist and under what eligibility.                                                                                       |
| DEC-CRD-001 / 002 / 003 / 004 | OPEN     | Credit limit, collection allocation, customer advance and suspended-credit override policies.                                                      |
| DEC-CSH-001..005, DEC-COM-001 | OPEN     | Business-date rollover, day close, late transactions, reopen and active-shift policies.                                                            |
| DEC-PAY-001                   | PROPOSED | Card and QR adapter baseline behaviour.                                                                                                            |
| DEC-CUS-002                   | VERIFY   | Customer retention and anonymisation period.                                                                                                       |
| DEC-PUR-001 / 002 / 006       | PROPOSED | Purchase-order and direct-GRN policy. Tax recoverability is VERIFY.                                                                                |
| DEC-INV-001                   | RESOLVED | Moving weighted-average cost per Item per Store. Used for inventory valuation.                                                                     |
| DEC-INV-010                   | RESOLVED | Phase-1 negative-stock default is BLOCK.                                                                                                           |

## Authority gaps (no decision ID)

| Gap                                                                                | Detail                                                                                                                                                                           |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Report codes, name keys, filter field codes and operators are not frozen           | ReportDefinition and ReportRunRequest define only the shapes. The design uses human labels.                                                                                      |
| No frozen screen owns Cash/Shift/Day-close reports or the Management Daily Summary | UI-RPT-001..005 cover sales/tender, inventory, purchasing/payables and credit/collections. The cash and management reports in FR-RPT-027..030 and 047..049 have no named screen. |
| Permissions beyond reporting.read and reporting.write are not defined              | Needed for cost-sensitive access, source drill-down, unmasking customer data, sensitive export and per-cashier visibility.                                                       |
| Hand-off from a report to Export Center is not described                           | UI-EXP-001 lists import and export operations only. The "Continue in Export Center" link is a design proposal.                                                                   |
| Page limits differ between contracts                                               | ReportRunRequest.limit allows 1–500 while PageInfo.limit allows at most 200.                                                                                                     |
| No central or multi-branch report screen exists (Phase 3)                          | UI-CLD-001..003 are cloud screens; FR-RPT-054/055 have no frozen screen.                                                                                                         |
| Print channel, page size and orientation are undefined                             | FR-RPT-056 says "readable form" only.                                                                                                                                            |
| Audit policy for report access and export is undefined                             | FR-RPT-061 is a SHOULD "according to policy".                                                                                                                                    |
| Export artifact retention is a policy seam                                         | API 16-IMPORT-EXPORT-JOB-ARTIFACT.                                                                                                                                               |
| Performance targets and the acceptance suite are not visual                        | FR-RPT-063 and FR-RPT-065 need data volumes and tests, not screens.                                                                                                              |

## Screens

| Screen | Name                                                | Group                           |
| ------ | --------------------------------------------------- | ------------------------------- |
| 01     | Reports Home — authorized catalog                   | Reports Home                    |
| 02     | Reports Home — search and family filter applied     | Reports Home                    |
| 03     | Report definition — supported filters and grouping  | Reports Home                    |
| 04     | Reports Home — loading                              | Reports Home                    |
| 05     | Reports Home — empty (no authorized reports)        | Reports Home                    |
| 06     | Reports Home — permission denied                    | Reports Home                    |
| 07     | Reports Home — local scope (cloud sync unavailable) | Reports Home                    |
| 08     | Reports Home — Store Node unavailable               | Reports Home                    |
| 09     | Reports Home — incompatible client                  | Reports Home                    |
| 10     | Reports Home — later-phase central reports          | Reports Home                    |
| 11     | Report viewer — anatomy                             | Report viewer                   |
| 12     | Filter bar — filters and applicability              | Report viewer                   |
| 13     | Business date versus timestamp                      | Report viewer                   |
| 14     | Totals definitions — status of each term            | Report viewer                   |
| 15     | Grouping basis — historical or current master       | Report viewer                   |
| 16     | As-of reporting                                     | Report viewer                   |
| 17     | Pagination and bounded results                      | Report viewer                   |
| 18     | Drill-down — source reference (read-only)           | Report viewer                   |
| 19     | Report — loading                                    | Report states                   |
| 20     | Report — empty result                               | Report states                   |
| 21     | Report — validation error                           | Report states                   |
| 22     | Report — permission denied                          | Report states                   |
| 23     | Report — definition conflict                        | Report states                   |
| 24     | Report — run failed (no partial totals)             | Report states                   |
| 25     | Report — local scope (cloud sync unavailable)       | Report states                   |
| 26     | Report — Store Node unavailable                     | Report states                   |
| 27     | Report — incompatible client                        | Report states                   |
| 28     | Read-only guarantee and operational scope           | Report states                   |
| 29     | Daily Sales Summary                                 | Sales reports                   |
| 30     | Sales by Item                                       | Sales reports                   |
| 31     | Sales by Category                                   | Sales reports                   |
| 32     | Sales by Cashier                                    | Sales reports                   |
| 33     | Sales by Counter                                    | Sales reports                   |
| 34     | Discount Report                                     | Sales reports                   |
| 35     | Price Override Report                               | Sales reports                   |
| 36     | Returns Report                                      | Sales reports                   |
| 37     | No-Receipt Return Report                            | Sales reports                   |
| 38     | Tender Summary                                      | Sales reports                   |
| 39     | Payment Exception Report                            | Sales reports                   |
| 40     | Cash Movement Report                                | Cash and day close reports      |
| 41     | Cash Variance Report                                | Cash and day close reports      |
| 42     | Shift Close Report                                  | Cash and day close reports      |
| 43     | Day Close Report                                    | Cash and day close reports      |
| 44     | Current Stock                                       | Inventory reports               |
| 45     | Low Stock Report — threshold ownership undefined    | Inventory reports               |
| 46     | Negative Stock Report — normally empty              | Inventory reports               |
| 47     | Stock Movement Report                               | Inventory reports               |
| 48     | Batch / Expiry Report                               | Inventory reports               |
| 49     | Inventory Valuation Report                          | Inventory reports               |
| 50     | Stock Count Variance Report                         | Inventory reports               |
| 51     | Stock Adjustment Report                             | Inventory reports               |
| 52     | Purchase Summary                                    | Purchasing reports              |
| 53     | Purchase by Supplier                                | Purchasing reports              |
| 54     | Purchase Return Report                              | Purchasing reports              |
| 55     | Purchase Price History — cost-sensitive             | Purchasing reports              |
| 56     | Customer Outstanding Report                         | Credit and collection reports   |
| 57     | Customer Aging Report                               | Credit and collection reports   |
| 58     | Customer Statement                                  | Credit and collection reports   |
| 59     | Credit Override Report                              | Credit and collection reports   |
| 60     | Customer data — masked by default                   | Credit and collection reports   |
| 61     | Management Daily Summary                            | Management summary              |
| 62     | Exception Highlights                                | Management summary              |
| 63     | Comparative Periods — optional                      | Management summary              |
| 64     | Export dialog — format and scope                    | Export and print                |
| 65     | Export — permission required                        | Export and print                |
| 66     | Export job — queued and running                     | Export and print                |
| 67     | Export job — completed, hand off to Export Center   | Export and print                |
| 68     | Export job — failed and cancelled                   | Export and print                |
| 69     | Export — outcome unknown (recovery)                 | Export and print                |
| 70     | Export — personal data minimised                    | Export and print                |
| 71     | Print preview                                       | Export and print                |
| 72     | Report access and export audit notice               | Export and print                |
| 73     | Central report — incomplete sync warning            | Central and later phase         |
| 74     | Report components                                   | Design system and documentation |
| 75     | Accessibility and keyboard behaviour                | Design system and documentation |
| 76     | Responsive behaviour                                | Design system and documentation |
| 77     | Requirement to screen index                         | Design system and documentation |
| 78     | Open decisions and authority gaps                   | Design system and documentation |
| 79     | Boundaries — what this package does not define      | Design system and documentation |
| 80     | Documentation — confirmations                       | Design system and documentation |
