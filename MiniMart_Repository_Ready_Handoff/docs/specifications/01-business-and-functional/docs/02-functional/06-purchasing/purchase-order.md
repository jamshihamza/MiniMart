# MiniMart Purchase Order Functional Specification --- v0.3

**Document ID:** MM-FRS-PUR-PO-001\
**Requirement namespace:** `FR-PUR-021`--`FR-PUR-045`\
**Status:** Detailed Working Draft --- Batch 2

## Requirements

### FR-PUR-021 --- Purchase Order optionality

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support Purchase Orders without requiring a PO for every
Goods Receipt unless store policy explicitly requires it.

**Acceptance:** PO-based and policy-permitted direct GRN workflows can
coexist.

### FR-PUR-022 --- Create Purchase Order

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create a draft Purchase Order for an
eligible supplier.

**Acceptance:** Draft PO has no stock effect.

### FR-PUR-023 --- PO supplier

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

A PO shall identify exactly one supplier.

**Acceptance:** Approval is blocked without supplier.

### FR-PUR-024 --- PO lines

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

A PO shall support item lines with ordered quantity, purchase unit and
expected commercial values.

**Acceptance:** Each line is independently receivable.

### FR-PUR-025 --- PO expected price

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

A PO may record expected purchase cost/discount/tax inputs for
comparison with actual receipt/invoice values.

**Acceptance:** Receipt variance can be identified.

### FR-PUR-026 --- PO expected delivery

**Source:** BR-PUR-001\
**Priority:** SHOULD\
**Phase:** 1

A PO should support expected delivery date or equivalent planning
information.

**Acceptance:** Expected date is visible/searchable.

### FR-PUR-027 --- PO notes/reference

**Source:** BR-PUR-001\
**Priority:** SHOULD\
**Phase:** 1

A PO should support internal notes and supplier-facing/reference
information as appropriate.

**Acceptance:** Internal notes are not automatically printed externally.

### FR-PUR-028 --- PO draft editing

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

A draft PO may be edited by authorized users before approval/release.

**Acceptance:** Draft edits do not affect stock.

### FR-PUR-029 --- PO approval

**Source:** BR-SEC-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support a policy requiring approval before a PO is
eligible for receiving.

**Acceptance:** Approval state is visible.

### FR-PUR-030 --- PO approver identity

**Source:** BR-AUD-001\
**Priority:** MUST

**Applicability:** When approval workflow is enabled\
**Phase:** 1

When PO approval is required, MiniMart shall retain approving actor and
approval time.

**Acceptance:** Approval is auditable.

### FR-PUR-031 --- PO status

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish draft, approved/released, partially received,
fully received/closed and cancelled PO states.

**Acceptance:** Remaining receivable quantity is determinable.

### FR-PUR-032 --- Partial receipt

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

A PO line may be partially received when policy allows.

**Acceptance:** Remaining quantity is reduced correctly.

### FR-PUR-033 --- Multiple receipts against PO

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

A PO may be fulfilled by multiple GRNs.

**Acceptance:** All receipts and remaining quantities are traceable.

### FR-PUR-034 --- Over-receipt policy

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall apply configured policy to receiving more than remaining
PO quantity: block, warn, or require approval.

**Acceptance:** Over-receipt cannot occur silently.

### FR-PUR-035 --- Under-receipt closure

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to close a PO/line with an unreceived
remainder using an explicit action/reason.

**Acceptance:** Unreceived quantity is not treated as received.

### FR-PUR-036 --- PO cancellation

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

An eligible unfulfilled PO may be cancelled by an authorized user
without creating stock effects.

**Acceptance:** Cancellation is retained.

### FR-PUR-037 --- Cancel partially received PO

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Cancelling/closing a partially received PO shall preserve linked posted
GRNs and only cancel the remaining commitment.

**Acceptance:** Received history remains unchanged.

### FR-PUR-038 --- PO supplier change control

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Changing supplier on an approved or partially received PO shall be
restricted; posted receipts shall never be reassigned silently.

**Acceptance:** Historical linkage remains correct.

### FR-PUR-039 --- PO line removal control

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

A line with posted receipt activity shall not be removed in a way that
hides that activity.

**Acceptance:** Receipt history remains visible.

### FR-PUR-040 --- PO search

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Users shall be able to search/filter POs by supplier, reference, status
and relevant date.

**Acceptance:** Open orders are readily identifiable.

### FR-PUR-041 --- PO receiving selection

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

GRN workflow shall be able to select an eligible PO and load its
receivable lines.

**Acceptance:** Fully received/cancelled quantities are excluded.

### FR-PUR-042 --- Concurrent PO receiving

**Source:** BR-OPS-002, BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall prevent concurrent users from independently receiving the
same remaining PO quantity into an invalid over-receipt.

**Acceptance:** Posting revalidates remaining quantity.

### FR-PUR-043 --- PO price variance visibility

**Source:** BR-PUR-003\
**Priority:** SHOULD\
**Phase:** 1

When actual receipt/invoice cost differs from PO expected cost, MiniMart
should show the variance before posting.

**Acceptance:** User can review difference.

### FR-PUR-044 --- PO quantity variance visibility

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall show ordered, previously received, current receipt and
remaining quantities during PO-based receiving.

**Acceptance:** Consequence is visible before posting.

### FR-PUR-045 --- Direct GRN policy

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Store policy shall determine whether direct GRN without PO is allowed;
proposed Phase-1 default is allowed.

**Acceptance:** Direct GRN is explicit, not simulated by a fake PO.

## Lifecycle

``` text
DRAFT → APPROVED/RELEASED → PARTIALLY RECEIVED → FULLY RECEIVED/CLOSED
   └──────────────→ CANCELLED (when eligible)
```

A Purchase Order has no physical stock effect by itself.

## Acceptance scenarios

-   A PO for 10 units is received as 4 + 6 across two GRNs and closes
    with zero remaining.
-   Two users attempt to receive the same remaining quantity; posting
    prevents invalid double receipt.
-   A partially received PO is closed; prior GRNs remain unchanged.
-   Direct GRN remains possible when store policy allows it.
