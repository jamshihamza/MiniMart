# MiniMart Inventory Core Functional Specification --- v0.3

**Document ID:** MM-FRS-INV-001\
**Requirement prefix:** `FR-INV`\
**Status:** Detailed Working Draft --- Batch 2

## Inventory Core Requirements

### FR-INV-001 --- Current stock visibility

**Source:** BR-INV-002\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to view current stock for an item in the
applicable store.

**Acceptance:** Displayed stock corresponds to posted stock-affecting
events.

### FR-INV-002 --- Stock traceability

**Source:** BR-INV-001, BR-INV-003\
**Priority:** MUST\
**Phase:** 1

Every inventory change shall be traceable to a defined source business
event/document or controlled adjustment.

**Acceptance:** Current stock can be explained by history.

### FR-INV-003 --- No arbitrary stock edit

**Source:** BR-INV-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall not provide an ordinary untracked 'set stock quantity'
action outside a defined opening/count/adjustment process.

**Acceptance:** Every correction has source/reason.

### FR-INV-004 --- Store-specific inventory

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 1

Inventory shall be identifiable by store/branch.

**Acceptance:** Stock in one store is not silently treated as stock in
another.

### FR-INV-005 --- Item-specific inventory

**Source:** BR-INV-002\
**Priority:** MUST\
**Phase:** 1

Inventory shall be identifiable by stable item identity rather than
current barcode/description alone.

**Acceptance:** Barcode change does not move stock.

### FR-INV-006 --- Available vs physical extension

**Source:** BR-INV-002\
**Priority:** SHOULD\
**Phase:** 1

The inventory model shall allow future distinction between
physical/on-hand quantity and reserved/available concepts.

**Acceptance:** Phase 1 may equate them where no reservation exists.

### FR-INV-007 --- Quantity precision

**Source:** BR-CAT-006\
**Priority:** MUST\
**Phase:** 1

Inventory quantities shall respect defined quantity precision and UoM
conversion.

**Acceptance:** Invalid fractional movements are rejected.

### FR-INV-008 --- Negative stock policy

**Source:** BR-INV-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support a configurable policy for transactions that would
create negative stock.

**Acceptance:** Policy outcome is explicit.

### FR-INV-009 --- Negative stock allow mode

**Source:** BR-INV-004\
**Priority:** MUST\
**Phase:** 1

Policy may allow negative stock without blocking while making negative
state visible.

**Acceptance:** Negative quantity is reportable.

### FR-INV-010 --- Negative stock warn mode

**Source:** BR-INV-004\
**Priority:** MUST\
**Phase:** 1

Policy may warn before permitting a transaction that creates negative
stock.

**Acceptance:** User sees warning.

### FR-INV-011 --- Negative stock approval mode

**Source:** BR-INV-004\
**Priority:** MUST\
**Phase:** 1

Policy may require authorized manager approval before permitting
negative stock.

**Acceptance:** Approver is audited.

### FR-INV-012 --- Negative stock block mode

**Source:** BR-INV-004\
**Priority:** MUST\
**Phase:** 1

Policy may block a transaction that would create negative stock.

**Acceptance:** Blocked operation creates no stock effect.

### FR-INV-013 --- Negative stock by operation

**Source:** BR-INV-004\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should permit policy differences by operation type, such as POS
sale versus stock adjustment/purchase return.

**Acceptance:** Policy is deterministic.

### FR-INV-014 --- Batch stock visibility

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

For batch-tracked items, authorized users shall be able to view stock by
batch.

**Acceptance:** Batch totals reconcile to item stock.

### FR-INV-015 --- Expiry visibility

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

For expiry-tracked items, users shall be able to view expiry information
associated with eligible stock.

**Acceptance:** Expiry is searchable/reportable.

### FR-INV-016 --- Expired stock identification

**Source:** BR-INV-005\
**Priority:** MUST\
**Phase:** 1

MiniMart shall identify expired stock according to configured date
rules.

**Acceptance:** Expired quantity can be reported.

### FR-INV-017 --- Near-expiry identification

**Source:** BR-INV-005\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should identify stock nearing expiry according to configurable
threshold.

**Acceptance:** Near-expiry filter/report is available.

### FR-INV-018 --- Batch identity preservation

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Later item/master changes shall not destroy historical batch identity on
posted movements.

**Acceptance:** Movement remains understandable.

### FR-INV-019 --- Inventory enquiry by barcode

**Source:** BR-INV-002\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to locate inventory information by active
barcode.

**Acceptance:** Barcode resolves to stable item.

### FR-INV-020 --- Inventory enquiry by item search

**Source:** BR-INV-002\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to search inventory by code/description.

**Acceptance:** Large catalog remains practical.

### FR-INV-021 --- Low-stock extension

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support a low-stock threshold/reorder indicator suitable
for reporting.

**Acceptance:** Items below threshold are identifiable.

### FR-INV-022 --- Zero-stock visibility

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to identify zero-stock items when
relevant.

**Acceptance:** Zero stock can be listed.

### FR-INV-023 --- Negative-stock reportability

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 1

Negative stock shall be explicitly reportable.

**Acceptance:** All negative items can be listed.

### FR-INV-024 --- Inventory movement history

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 1

Users shall be able to view movement history for an item/store over a
selected period.

**Acceptance:** History shows source, direction and date.

### FR-INV-025 --- Inventory valuation extension

**Source:** BR-INV-009\
**Priority:** MUST\
**Phase:** 2

MiniMart shall support inventory valuation reporting based on approved
costing method.

**Acceptance:** Valuation method is identified.

### FR-INV-026 --- Inventory permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Sensitive inventory actions shall require explicit permissions.

**Acceptance:** Unauthorized action creates no stock effect.

### FR-INV-027 --- Inventory audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Adjustments, counts, policy exceptions and other sensitive inventory
actions shall be auditable.

**Acceptance:** Actor/reason/source are retained.

### FR-INV-028 --- Offline inventory operation

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Local inventory enquiry and defined stock operations shall remain
available without cloud while local services are operational.

**Acceptance:** Cloud loss alone does not block.

### FR-INV-029 --- Inventory restart durability

**Source:** BR-REL-001\
**Priority:** MUST\
**Phase:** 1

Posted inventory effects shall survive application/service restart.

**Acceptance:** Restart does not revert committed stock.

### FR-INV-030 --- Inventory history immutability

**Source:** BR-DATA-001, BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

Posted stock history shall not be rewritten to hide/alter prior business
effects; correction uses new traceable movement.

**Acceptance:** Original movement remains visible.

## Core principle

``` text
Current Stock = Explainable result of posted stock-affecting business events
```

MiniMart shall not treat current stock as an unexplained editable
number.

## Remaining decisions

-   Reservation/available-stock concepts beyond Phase 1.
-   Exact low-stock/reorder threshold ownership (`DEC-INV-007`).
-   Stock-count concurrency (`DEC-INV-003`).
-   Batch depletion (`DEC-INV-004`) and expiry/FEFO (`DEC-INV-005`).

**Resolved in v0.8/v0.9:** Phase-1 negative stock is blocked and
operational inventory costing uses moving WAC per Item per Store.
