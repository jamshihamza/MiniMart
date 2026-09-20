# MiniMart Stock Count and Adjustment Functional Specification --- v0.3

**Document ID:** MM-FRS-INV-COUNT-001\
**Requirement namespace:** `FR-INV-056`--`FR-INV-090`\
**Status:** Detailed Working Draft --- Batch 2

## Requirements

### FR-INV-056 --- Create stock count

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create a stock-count session.

**Acceptance:** Creating count has no immediate stock effect.

### FR-INV-057 --- Count scope

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

A stock count shall define scope, such as selected items/category or
whole store.

**Acceptance:** Scope is retained.

### FR-INV-058 --- Count reference/time

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

A count shall retain reference, store and relevant start/snapshot timing
context.

**Acceptance:** Count can be audited.

### FR-INV-059 --- Capture counted quantity

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

Users shall be able to record counted quantity for in-scope items.

**Acceptance:** Quantity precision is validated.

### FR-INV-060 --- Barcode count entry

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

Stock count shall support item identification by barcode.

**Acceptance:** Repeated scans follow defined counting behaviour.

### FR-INV-061 --- Manual item search in count

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

Count users shall be able to locate in-scope items by code/description.

**Acceptance:** Non-barcoded items can be counted.

### FR-INV-062 --- Batch count

**Source:** BR-INV-005, BR-INV-006\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

Batch-tracked items shall be countable by batch.

**Acceptance:** Batch variance is independently visible.

### FR-INV-063 --- Blind count option

**Source:** BR-INV-006\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should support a blind-count mode hiding expected quantity from
counter until review.

**Acceptance:** Counter cannot infer system quantity in blind mode.

### FR-INV-064 --- Expected quantity

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

MiniMart shall determine system quantity against which a count is
compared using a defined count timing/concurrency rule.

**Acceptance:** Expected quantity basis is explicit.

### FR-INV-065 --- Variance calculation

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

MiniMart shall calculate variance between expected and counted quantity.

**Acceptance:** Variance sign/value are clear.

### FR-INV-066 --- Variance value extension

**Source:** BR-INV-009\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should calculate estimated value impact of count variance using
approved costing method.

**Acceptance:** Method is identified.

### FR-INV-067 --- Recount

**Source:** BR-INV-006\
**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to request/record a recount before final
posting.

**Acceptance:** Prior entries remain traceable where policy requires.

### FR-INV-068 --- Count review

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

A count shall be reviewable before variance is posted.

**Acceptance:** Review shows expected, counted and variance.

### FR-INV-069 --- Count approval

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

Posting material count variances shall require applicable permission and
configured approval thresholds.

**Acceptance:** Approver is retained when required.

### FR-INV-070 --- Count posting

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

Posting an approved count shall create explicit adjustment movements for
accepted variance.

**Acceptance:** No direct balance overwrite.

### FR-INV-071 --- Count zero variance

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

A completed count with zero variance shall be recordable without
unnecessary stock movement.

**Acceptance:** Count history remains.

### FR-INV-072 --- Count cancellation

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

An unposted count may be cancelled by authorized user with reason where
policy requires.

**Acceptance:** Cancellation creates no stock effect.

### FR-INV-073 --- Posted count immutability

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted stock count shall not be edited to change resulting adjustment.

**Acceptance:** Correction requires new count/adjustment.

### FR-INV-074 --- Concurrent sales during count policy

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

MiniMart shall define how stock-affecting transactions during an open
count are handled so variance is not silently corrupted.

**Acceptance:** Count basis/concurrency rule is explicit.

### FR-INV-075 --- Count locking option

**Source:** BR-INV-006\
**Priority:** SHOULD\
**Phase:** 1

MiniMart may support policy to lock selected inventory operations for
count scope when operationally acceptable.

**Acceptance:** Lock state is visible.

### FR-INV-076 --- Count without full shutdown

**Source:** BR-INV-006\
**Priority:** SHOULD\
**Phase:** 1

The design should support cycle/selective counting without requiring
entire store to stop trading.

**Acceptance:** Scope-specific count is possible.

### FR-INV-077 --- Count user attribution

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Count entries and final posting shall retain applicable user
attribution.

**Acceptance:** Who counted/reviewed/posted is identifiable.

### FR-INV-078 --- Count audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Material changes, recounts, approval and posting shall be auditable.

**Acceptance:** History is reviewable.

### FR-INV-079 --- Count offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Local count workflow shall remain available without cloud when local
services are operational.

**Acceptance:** Cloud loss alone does not invalidate count.

### FR-INV-080 --- Create manual adjustment

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create a controlled stock adjustment
outside count when legitimate reason exists.

**Acceptance:** Draft has no stock effect.

### FR-INV-081 --- Adjustment direction/quantity

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

Adjustment shall explicitly state quantity increase/decrease or target
correction semantics defined by workflow.

**Acceptance:** Resulting movement is unambiguous.

### FR-INV-082 --- Adjustment reason code

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

Adjustment shall require a controlled reason code.

**Acceptance:** Posted adjustment retains reason.

### FR-INV-083 --- Adjustment note

**Source:** BR-INV-007\
**Priority:** SHOULD\
**Phase:** 1

Policy may require explanatory notes for selected reason codes or
thresholds.

**Acceptance:** Required note blocks posting if absent.

### FR-INV-084 --- Adjustment batch

**Source:** BR-INV-005, BR-INV-007\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

Batch-tracked adjustments shall identify affected batch.

**Acceptance:** Correct batch changes.

### FR-INV-085 --- Adjustment negative-stock check

**Source:** BR-INV-004\
**Priority:** MUST\
**Phase:** 1

A negative adjustment shall apply configured negative-stock policy
before posting.

**Acceptance:** Policy is enforced.

### FR-INV-086 --- Adjustment approval threshold

**Source:** BR-INV-007\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support manager approval based on configured
quantity/value/reason thresholds.

**Acceptance:** Approval is auditable.

### FR-INV-087 --- Adjustment posting

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

Posting a valid adjustment shall create corresponding stock movement and
audit record.

**Acceptance:** One explicit effect is created.

### FR-INV-088 --- Adjustment safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Retrying adjustment posting shall not create duplicate movement.

**Acceptance:** Exactly one effect remains.

### FR-INV-089 --- Adjustment search/history

**Source:** BR-INV-003\
**Priority:** MUST\
**Phase:** 1

Users shall be able to find adjustments by item, date, reason, actor and
document reference.

**Acceptance:** Investigation is practical.

### FR-INV-090 --- Adjustment correction

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted adjustment shall be corrected by a new compensating
adjustment/process rather than editing posted movement.

**Acceptance:** Original remains visible.

## Count workflow

``` text
Create Count → Define Scope → Capture Count
→ Determine Expected Quantity → Review Variance
→ Recount/Approve if required → Post
→ Explicit Adjustment Movement
```

## Decision gate

MiniMart must choose how expected quantity is determined when
sales/receipts occur during an open count. Options include scope
locking, snapshot-plus-movement reconciliation, or another validated
approach. Implementation agents must not choose this silently.
