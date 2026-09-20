# MiniMart Goods Receipt (GRN) Functional Specification --- v0.3

**Document ID:** MM-FRS-PUR-GRN-001\
**Requirement namespace:** `FR-PUR-046`--`FR-PUR-085`\
**Status:** Detailed Working Draft --- Batch 2

## Requirements

### FR-PUR-046 --- Create Goods Receipt

**Source:** BR-PUR-001, BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create a Goods Receipt (GRN) for
received goods.

**Acceptance:** Draft GRN has no final stock effect.

### FR-PUR-047 --- GRN supplier

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Each GRN shall identify one eligible supplier.

**Acceptance:** GRN cannot post without supplier.

### FR-PUR-048 --- GRN source PO

**Source:** BR-PUR-001\
**Priority:** MUST

**Applicability:** When the workflow is PO-based\
**Phase:** 1

A GRN created from a PO shall retain PO/line linkage.

**Acceptance:** Receipt traces back to PO.

### FR-PUR-049 --- Direct GRN

**Source:** BR-PUR-001\
**Priority:** MUST

**Applicability:** If approved policy allows the behavior\
**Phase:** 1

MiniMart shall support GRN creation without a PO when store policy
permits.

**Acceptance:** Direct GRN remains auditable.

### FR-PUR-050 --- Supplier invoice/reference duplicate check

**Source:** BR-PUR-006, BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall detect a likely duplicate supplier invoice/reference
within configured scope before posting.

**Acceptance:** Duplicate is blocked or explicitly overridden by policy.

### FR-PUR-051 --- GRN receipt date

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

GRN shall retain receiving/posting date separately from supplier invoice
date where both exist.

**Acceptance:** Both dates are queryable.

### FR-PUR-052 --- Add item by barcode

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Receiving users shall be able to add/find items by valid barcode.

**Acceptance:** Resolved item is unambiguous.

### FR-PUR-053 --- Add item by search/code

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Receiving users shall be able to add/find items by code or description.

**Acceptance:** Large-catalog lookup remains practical.

### FR-PUR-054 --- Received quantity

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Each GRN line shall record received invoiced quantity.

**Acceptance:** Stock effect matches validated conversion.

### FR-PUR-055 --- Free received quantity

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Each GRN line shall separately record applicable free quantity.

**Acceptance:** Physical stock includes free quantity according to
costing policy.

### FR-PUR-056 --- Purchase UoM

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

GRN shall record purchase unit and apply configured conversion to
inventory quantity.

**Acceptance:** Later UoM changes do not reinterpret receipt.

### FR-PUR-057 --- Unit cost

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

GRN shall record transaction purchase cost inputs with exact monetary
semantics.

**Acceptance:** Historical cost is reproducible.

### FR-PUR-058 --- Line discount

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

GRN shall support applicable line discount inputs.

**Acceptance:** Net line purchase value is reproducible.

### FR-PUR-059 --- Tax information

**Source:** BR-PUR-003\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1/2

GRN shall capture/apply required purchase-tax information through active
country rules.

**Acceptance:** Core does not assume a tax formula.

### FR-PUR-060 --- Batch capture

**Source:** BR-PUR-003, BR-INV-005\
**Priority:** MUST

**Applicability:** Where required by approved policy/rule\
**Phase:** 1

A batch-tracked receipt line shall identify batch/lot received.

**Acceptance:** Posting fails if required batch is missing.

### FR-PUR-061 --- Multiple batches on one receipt

**Source:** BR-INV-005\
**Priority:** MUST\
**Phase:** 1

One item receipt shall support splitting quantity across multiple
batches.

**Acceptance:** Batch quantities reconcile to line quantity.

### FR-PUR-062 --- Expiry capture

**Source:** BR-PUR-003, BR-INV-005\
**Priority:** MUST

**Applicability:** Where required by approved policy/rule\
**Phase:** 1

Expiry-tracked receipt quantities shall carry applicable expiry
information.

**Acceptance:** Required expiry cannot be omitted.

### FR-PUR-063 --- Expired goods warning/block

**Source:** BR-INV-005\
**Priority:** MUST\
**Phase:** 1

MiniMart shall apply configured policy when received goods are already
expired.

**Acceptance:** Condition cannot be silently accepted.

### FR-PUR-064 --- Near-expiry warning

**Source:** BR-INV-005\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should warn on receipt within a configured near-expiry
threshold.

**Acceptance:** Warning appears before posting.

### FR-PUR-065 --- Unknown item quick-create

**Source:** BR-CAT-007\
**Priority:** MUST\
**Phase:** 1

Authorized receiving users may invoke skeleton-item creation for a
genuinely unknown product.

**Acceptance:** Receiving resumes only after valid identity exists.

### FR-PUR-066 --- Inactive item receipt

**Source:** BR-CAT-001\
**Priority:** MUST\
**Phase:** 1

Receiving an inactive/non-purchasable item shall be blocked or require
explicit authorized exception according to policy.

**Acceptance:** Inactive status is not ignored.

### FR-PUR-067 --- PO quantity comparison

**Source:** BR-PUR-003\
**Priority:** MUST

**Applicability:** When the workflow is PO-based\
**Phase:** 1

GRN shall compare current receipt quantity to remaining PO quantity.

**Acceptance:** Variance is visible.

### FR-PUR-068 --- PO price comparison

**Source:** BR-PUR-003\
**Priority:** SHOULD

**Applicability:** When the workflow is PO-based\
**Phase:** 1

GRN should compare actual cost to PO expected cost.

**Acceptance:** Variance is visible.

### FR-PUR-069 --- Supplier invoice total comparison

**Source:** BR-PUR-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should compare calculated GRN totals with entered
supplier-document totals and flag material mismatch.

**Acceptance:** Mismatch is visible.

### FR-PUR-070 --- GRN validation

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Before posting, MiniMart shall validate supplier, lines, units,
quantities, costs, required batch/expiry and country-required data.

**Acceptance:** Invalid GRN does not post partially.

### FR-PUR-071 --- GRN preview/summary

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

User shall be able to review receipt quantities and commercial totals
before final posting.

**Acceptance:** Posting is explicit.

### FR-PUR-072 --- GRN posting authorization

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Final GRN posting shall require applicable permission and configured
approval.

**Acceptance:** Unauthorized draft creates no stock.

### FR-PUR-073 --- Atomic GRN business effect

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

A posted GRN shall not appear completed while required stock/business
effects are missing, or vice versa.

**Acceptance:** Failure produces no falsely completed GRN.

### FR-PUR-074 --- Stock increase

**Source:** BR-PUR-002\
**Priority:** MUST\
**Phase:** 1

Posting a valid GRN shall increase inventory by defined received stock
quantity.

**Acceptance:** Movement traces to GRN.

### FR-PUR-075 --- Purchase history update

**Source:** BR-SUP-004\
**Priority:** MUST\
**Phase:** 1

Posted GRN shall contribute to supplier/item purchase history.

**Acceptance:** History points to source.

### FR-PUR-076 --- Costing input

**Source:** BR-PRI-003\
**Priority:** MUST\
**Phase:** 1

Posted GRN shall provide validated cost inputs required by selected
inventory costing policy.

**Acceptance:** GRN does not invent costing policy.

### FR-PUR-077 --- GRN posting audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Posting shall retain posting actor/time and relevant approval/exception
information.

**Acceptance:** Who posted is identifiable.

### FR-PUR-078 --- GRN print/export

**Source:** BR-PUR-001\
**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to view/print/export a posted GRN
summary.

**Acceptance:** Output reflects posted values.

### FR-PUR-079 --- GRN search

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Users shall be able to search GRNs by supplier, MiniMart reference,
supplier reference and date/status.

**Acceptance:** Receipt is findable.

### FR-PUR-080 --- Posted GRN no ordinary edit

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted GRN shall not be reopened for ordinary editing of
stock/financial values.

**Acceptance:** Correction uses return/reversal.

### FR-PUR-081 --- GRN reversal/correction control

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

Any enabled full reversal/correction shall create an explicit traceable
compensating effect rather than erase the original.

**Acceptance:** Original remains visible.

### FR-PUR-082 --- Posting restart recovery

**Source:** BR-OPS-005, BR-REL-001\
**Priority:** MUST\
**Phase:** 1

After restart, MiniMart shall determine whether GRN posting completed
and shall not invite blind reposting.

**Acceptance:** Exactly one effective result remains.

### FR-PUR-083 --- GRN offline posting

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

A valid local GRN can post without cloud connectivity while local
services are operational.

**Acceptance:** Cloud sync may occur later.

### FR-PUR-084 --- Concurrent duplicate GRN protection

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Concurrent/repeated attempts to post the same logical GRN shall not
create duplicate inventory effects.

**Acceptance:** Only one effective posting occurs.

### FR-PUR-085 --- GRN source values preserved

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Posted GRN shall retain enough item/unit/cost/supplier values to remain
understandable after master changes.

**Acceptance:** Later master edits do not rewrite history.

## Posting model

``` text
Supplier / Optional PO → Draft GRN
→ Items + Qty + Free Qty + UoM + Cost + Discount + Tax inputs
→ Batch / Expiry where required → Validate → POST
→ Posted GRN + Stock Movement + Purchase History + Audit
```

## Acceptance scenarios

-   Direct GRN posts while internet is disconnected and local services
    are healthy.
-   Batch/expiry-tracked item cannot post without required tracking
    data.
-   Repeated posting after timeout produces one inventory effect.
-   Duplicate supplier invoice/reference is detected before posting.
-   Posted GRN cannot be edited to reduce quantity; correction uses
    explicit return/reversal.
