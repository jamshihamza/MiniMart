# MiniMart Inventory Costing Functional Specification --- v0.3

**Document ID:** MM-FRS-INV-COST-001\
**Requirement namespace:** `FR-INV-091`--`FR-INV-110`\
**Status:** Decision-Sensitive Working Draft --- Batch 2

## Requirements

### FR-INV-091 --- Costing policy explicit

**Source:** BR-PRI-003, BR-INV-009\
**Priority:** MUST\
**Phase:** 1/2

MiniMart shall use an explicitly selected inventory costing policy;
implementation agents shall not infer or change it.

**Acceptance:** Active method is identifiable.

### FR-INV-092 --- Initial weighted-average costing baseline

**Source:** BR-PRI-003\
**Priority:** MUST\
**Phase:** 1/2

MiniMart shall use **per-item, per-store moving weighted-average cost
(WAC)** as the initial operational inventory costing method.

For a positive on-hand balance, a receipt updates WAC from the prior
inventory value plus the receipt's approved net acquisition value
divided by the resulting quantity. Exact decimal arithmetic and defined
rounding shall be used.

**Acceptance:** Automated examples reproduce WAC across multiple
receipts at different costs without using JavaScript floating-point
arithmetic.

### FR-INV-093 --- Cost precision

**Source:** BR-PRI-003\
**Priority:** MUST\
**Phase:** 1/2

Inventory cost calculations shall use sufficient exact decimal precision
and defined rounding rules.

**Acceptance:** Calculations are reproducible.

### FR-INV-094 --- GRN cost input

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1/2

Posted GRN shall provide purchase values used by approved costing
method.

**Acceptance:** Cost update traces to GRN.

### FR-INV-095 --- Free quantity costing

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1/2

Supplier free quantity received on the same commercial line/receipt
shall contribute quantity but no additional purchase consideration. The
line's approved net acquisition value shall therefore be spread across
the total accepted quantity, including free quantity.

**Acceptance:** Example: paid quantity plus free quantity produces one
reproducible effective acquisition unit cost.

### FR-INV-096 --- Purchase discount acquisition-cost treatment

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1/2

Line discounts and deterministically allocated document-level purchase
discounts shall reduce inventory acquisition value before WAC is
updated.

Document-level discount allocation shall use an approved deterministic
basis and preserve allocation evidence.

**Acceptance:** The same GRN values always produce the same allocated
acquisition value and WAC.

### FR-INV-097 --- Purchase tax acquisition-cost boundary

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 2

Taxes classified by the active verified country/accounting rules as
recoverable/input-credit shall be excluded from inventory acquisition
cost; taxes classified as non-recoverable and directly attributable to
acquisition shall be capitalized into inventory cost.

The core costing engine shall consume the classification result and
shall not invent tax recoverability.

**Acceptance:** Given an approved recoverable/non-recoverable
classification, WAC treatment is deterministic and country logic remains
outside the core costing calculation.

### FR-INV-098 --- Ancillary landed-cost extension

**Source:** BR-PRI-003\
**Priority:** LATER\
**Phase:** 3+

Design shall not prevent later allocation of freight/duty/landed costs
to inventory.

**Acceptance:** Not required for Phase 1 unless approved.

### FR-INV-099 --- Purchase return costing

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1/2

A purchase return shall reduce inventory quantity and operational
inventory value using the item's current store WAC at return posting.
Supplier commercial credit remains separately represented by the
purchase-return document.

Any difference between supplier credit value and operational inventory
value is an accounting/reconciliation concern and shall not silently
rewrite prior WAC history.

**Acceptance:** Purchase return reduces stock value reproducibly and
does not retroactively recalculate historical receipts/issues.

### FR-INV-100 --- Sales cost-of-goods input

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 2

Approved costing policy shall provide inventory cost value needed for
sales profitability/accounting reports.

**Acceptance:** Posted sale can be valued.

### FR-INV-101 --- Negative stock costing boundary

**Source:** BR-INV-004\
**Priority:** MUST\
**Phase:** 1/2

The initial WAC baseline assumes stock-affecting issues do not take
on-hand quantity below zero. Phase-1 default shall therefore block
negative stock.

If a later policy enables negative stock, its valuation/reconciliation
algorithm shall be specified as a separate approved costing extension
before activation.

**Acceptance:** Phase-1 WAC has no undefined negative-balance
calculation path.

### FR-INV-102 --- Cost history

**Source:** BR-PRI-003\
**Priority:** MUST\
**Phase:** 2

MiniMart shall retain sufficient costing history to explain inventory
valuation and historical COGS according to approved method.

**Acceptance:** Valuation is auditable.

### FR-INV-103 --- Cost recomputation control

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 2

Changing current cost policy/configuration shall not silently rewrite
historical posted financial meaning without explicit
migration/revaluation.

**Acceptance:** Historical reports remain explainable.

### FR-INV-104 --- Cost access permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Sensitive purchase/inventory cost information shall be visible only to
authorized roles.

**Acceptance:** Cashier access does not imply cost access.

### FR-INV-105 --- Cost override prohibition

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1/2

Users shall not directly edit a computed inventory cost balance;
correction must originate from a defined business/revaluation process.

**Acceptance:** No hidden cost edit.

### FR-INV-106 --- Inventory valuation report basis

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 2

Inventory valuation reports shall identify valuation date/store and
approved costing method.

**Acceptance:** Report basis is explicit.

### FR-INV-107 --- Batch vs costing separation

**Source:** BR-INV-005\
**Priority:** MUST\
**Phase:** 1/2

Physical batch/expiry depletion policy and financial costing method
shall be separate concepts unless approved policy explicitly links them.

**Acceptance:** FEFO/FIFO physical issue does not automatically redefine
costing.

### FR-INV-108 --- Costing tests

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1/2

Approved costing method shall have automated examples covering changing
costs, free quantity, discounts, returns, rounding and permitted
negative-stock cases.

**Acceptance:** Tests lock approved rule.

### FR-INV-109 --- Costing baseline gate satisfied

**Source:** BR-PRI-003\
**Priority:** MUST\
**Phase:** 1/2

The Domain Model shall represent the approved moving weighted-average
baseline, store-level cost scope, acquisition-value inputs and immutable
historical cost effects without assuming full double-entry accounting.

**Acceptance:** Domain Model can distinguish current WAC, stock movement
quantity/value and source document without an unresolved costing-method
decision.

### FR-INV-110 --- Accounting validation boundary

**Source:** BR-ACC-007\
**Priority:** MUST\
**Phase:** 2

Operational WAC is a product costing baseline, not a claim of complete
statutory accounting treatment. Full financial-accounting posting, tax
treatment and valuation presentation shall be professionally validated
before double-entry accounting is baselined.

**Acceptance:** Operational inventory valuation can proceed while full
accounting validation remains an explicit later gate.
