# MiniMart Purchase Return Functional Specification --- v0.3

**Document ID:** MM-FRS-PUR-RET-001\
**Requirement namespace:** `FR-PUR-086`--`FR-PUR-110`\
**Status:** Detailed Working Draft --- Batch 2

## Requirements

### FR-PUR-086 --- Create purchase return

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create a purchase return to an
eligible supplier.

**Acceptance:** Draft return has no stock effect.

### FR-PUR-087 --- Return supplier

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Each purchase return shall identify the supplier receiving returned
goods.

**Acceptance:** Posting requires supplier.

### FR-PUR-088 --- Reference original GRN

**Source:** BR-PUR-004\
**Priority:** SHOULD\
**Phase:** 1

A purchase return should reference original GRN/line where reasonably
available.

**Acceptance:** Original receipt linkage is visible.

### FR-PUR-089 --- Return without original GRN

**Source:** BR-PUR-004\
**Priority:** SHOULD\
**Phase:** 1

MiniMart may support controlled exceptional return without direct GRN
reference when authorized and justified.

**Acceptance:** Reason/approval are mandatory by policy.

### FR-PUR-090 --- Return item and quantity

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Each return line shall identify item, return quantity and applicable
unit.

**Acceptance:** Quantity precision is validated.

### FR-PUR-091 --- Return batch

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

For batch-tracked stock, purchase return shall identify the batch being
returned.

**Acceptance:** Selected batch is reduced.

### FR-PUR-092 --- Return expiry context

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 1

Expiry-tracked return shall preserve relevant batch/expiry context.

**Acceptance:** Returned stock is traceable.

### FR-PUR-093 --- Return reason

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Purchase returns shall require a controlled/explanatory reason according
to policy.

**Acceptance:** Posted return retains reason.

### FR-PUR-094 --- Returnable quantity check

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

When linked to original GRN, MiniMart shall determine remaining eligible
return quantity after prior returns/corrections.

**Acceptance:** Over-return is blocked or explicitly exceptional.

### FR-PUR-095 --- Current stock availability

**Source:** BR-INV-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall verify sufficient eligible stock/batch to physically
return unless policy explicitly permits a controlled negative result.

**Acceptance:** Insufficient stock is not ignored.

### FR-PUR-096 --- Return commercial values

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Purchase return shall retain commercial values needed to represent
supplier credit/correction according to policy.

**Acceptance:** Financial meaning is reproducible.

### FR-PUR-097 --- Return tax treatment

**Source:** BR-PUR-004\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1/2

Tax treatment shall be supplied by active country/accounting rules.

**Acceptance:** Core does not invent tax treatment.

### FR-PUR-098 --- Return approval

**Source:** BR-SEC-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support requiring approval for purchase returns based on
configured risk thresholds.

**Acceptance:** Approver is retained.

### FR-PUR-099 --- Return validation

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Before posting, MiniMart shall validate supplier, items, quantities,
batch/stock, reason and required commercial/country fields.

**Acceptance:** Invalid return does not post.

### FR-PUR-100 --- Return posting authorization

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Final purchase-return posting shall require applicable permission.

**Acceptance:** Unauthorized action creates no stock effect.

### FR-PUR-101 --- Atomic purchase-return effect

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

A posted purchase return shall commit required document, stock and
related business effects as one logical outcome.

**Acceptance:** No falsely partial completed return.

### FR-PUR-102 --- Stock decrease

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Posting a purchase return shall reduce eligible inventory by validated
return quantity.

**Acceptance:** Movement traces to return.

### FR-PUR-103 --- Supplier history

**Source:** BR-SUP-004\
**Priority:** MUST\
**Phase:** 1

Posted purchase return shall appear in supplier transaction history.

**Acceptance:** Return is linked to source.

### FR-PUR-104 --- Costing correction input

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Purchase return shall provide information required by selected costing
policy to account for returned inventory value.

**Acceptance:** Cost effect follows approved rule.

### FR-PUR-105 --- Return audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Posting/approval of purchase return shall be audited.

**Acceptance:** Actor, reason and source are available.

### FR-PUR-106 --- Posted return immutability

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted purchase return shall not be edited to silently alter
stock/financial effect.

**Acceptance:** Further correction is explicit.

### FR-PUR-107 --- Return safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Retrying purchase-return posting shall not create duplicate stock
reductions.

**Acceptance:** One effective return remains.

### FR-PUR-108 --- Return offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Valid local purchase returns may post while cloud is unavailable,
subject to local stock and authorization.

**Acceptance:** Cloud loss alone does not block.

### FR-PUR-109 --- Return search

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Users shall be able to find purchase returns by supplier, source
GRN/reference, date and MiniMart reference.

**Acceptance:** History is practical to investigate.

### FR-PUR-110 --- Return history preservation

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Later supplier/item/master changes shall not make a posted purchase
return misleading.

**Acceptance:** Historical values remain understandable.

## Workflow

``` text
Supplier + Original GRN (preferred) → Select Item / Batch
→ Quantity + Reason → Validate returnable/available stock
→ Approval if required → POST
→ Stock decrease + Supplier history + Audit
```

## Acceptance scenarios

-   Linked return cannot exceed remaining eligible quantity without
    explicitly defined exception.
-   Batch-controlled return reduces selected batch.
-   Retrying after timeout does not double-reduce stock.
-   Historical GRN and return remain visible after master-data changes.
