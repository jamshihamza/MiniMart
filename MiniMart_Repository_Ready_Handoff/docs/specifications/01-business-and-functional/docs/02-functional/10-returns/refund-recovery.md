# MiniMart Refund and Return Recovery Functional Specification --- v0.4

**Document ID:** MM-FRS-RET-REF-001\
**Requirement namespace:** `FR-RET-036`--`FR-RET-060`\
**Status:** Detailed Working Draft --- Batch 3

## Canonical return/refund lifecycle

The domain distinguishes:

`Return Draft → Return Posted → Refund Obligation → Refund Attempt → Refund Settled / Failed / Uncertain → Reconciled`

A posted Return owns the commercial return and inventory disposition.
Refund settlement may be immediate or later. A later refund recovery
action must never repost the Return or stock movement.

## Requirements

### FR-RET-036 --- Refund method selection

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 1

Return workflow shall select an approved refund method based on original
tender, store policy and provider capability.

**Acceptance:** Refund method is explicit before posting.

### FR-RET-037 --- Original tender awareness

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 1

For linked returns, MiniMart shall show original tender composition
relevant to refund decision.

**Acceptance:** User can apply policy correctly.

### FR-RET-038 --- Cash refund

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 1

Authorized cash refund shall record cash outflow and applicable drawer
event.

**Acceptance:** Refund is included in cash reconciliation.

### FR-RET-039 --- Card refund manual recording

**Source:** BR-RET-005\
**Priority:** MUST

**Applicability:** Where an external dependency/provider is used\
**Phase:** 2

Where card refund occurs on an external terminal, authorized user shall
record confirmed refund/reference without claiming MiniMart initiated
it.

**Acceptance:** External refund is reconcilable.

### FR-RET-040 --- QR/digital refund manual recording

**Source:** BR-RET-005\
**Priority:** MUST

**Applicability:** Where an external dependency/provider is used\
**Phase:** 2

Where digital refund occurs externally, authorized user shall record
confirmed refund/reference.

**Acceptance:** External refund is reconcilable.

### FR-RET-041 --- Integrated refund extension

**Source:** BR-RET-005\
**Priority:** LATER\
**Phase:** 3

Later provider-integrated refund shall preserve original-payment
linkage, request identity, idempotency and uncertain-state handling.

**Acceptance:** Core return model need not be replaced.

### FR-RET-042 --- Refund cannot exceed eligible value

**Source:** BR-RET-003\
**Priority:** MUST\
**Phase:** 1

Ordinary refund shall not exceed remaining eligible refundable value for
linked sale/line.

**Acceptance:** Over-refund is blocked.

### FR-RET-043 --- Prior refund awareness

**Source:** BR-RET-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall consider prior effective returns/refunds when calculating
remaining refundable value.

**Acceptance:** Same value is not refunded twice.

### FR-RET-044 --- Refund rounding

**Source:** BR-RET-005\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1/2

Refund rounding shall follow approved country/tender rules and original
economic context.

**Acceptance:** No ad-hoc rounding is invented.

### FR-RET-045 --- Mixed-tender refund policy

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 2

MiniMart shall define how a refund is allocated across original split
tenders.

**Acceptance:** Implementation waits for approved allocation rule where
ambiguous.

### FR-RET-046 --- Credit-sale return

**Source:** BR-PAY-004, BR-RET-005\
**Priority:** MUST\
**Phase:** 2

Return against customer-credit sale shall adjust customer
outstanding/refund position according to Customer Credit rules rather
than automatically paying cash.

**Acceptance:** Credit module remains authoritative.

### FR-RET-047 --- Refund approval threshold

**Source:** BR-RET-007\
**Priority:** MUST\
**Phase:** 1

Configured high-value/high-risk refunds shall require manager approval.

**Acceptance:** Approver and reason are retained.

### FR-RET-048 --- Refund failure

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 2/3

Confirmed failed electronic refund shall not be recorded as successful.

**Acceptance:** Return remains in defined recovery state.

### FR-RET-049 --- Refund uncertain state

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Ambiguous electronic refund result shall remain uncertain until
status/reconciliation resolves it.

**Acceptance:** No blind duplicate refund.

### FR-RET-050 --- Refund retry protection

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/3

Retrying refund action shall not create duplicate cash/electronic refund
effect.

**Acceptance:** One intended refund is represented once.

### FR-RET-051 --- Posted return with outstanding refund obligation

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 2

If a Return is posted and its refund is not fully settled, MiniMart
shall retain an explicit outstanding Refund Obligation and expose a
refund-pending/uncertain recovery state.

Return posting status and refund settlement status are separate.
Settling the refund later shall not repost stock or create a second
Return.

**Acceptance:** Outstanding refund amount and state are visible;
retry/reconciliation can settle the obligation exactly once without
duplicating inventory effects.

### FR-RET-052 --- Return cancellation before posting

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

An unposted return may be cancelled safely.

**Acceptance:** No stock/refund effect remains.

### FR-RET-053 --- Cannot casually cancel posted return

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted return with stock/refund effect shall not be deleted/cancelled
as if it never occurred.

**Acceptance:** Correction uses explicit reversal/correction.

### FR-RET-054 --- Return reprint

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

Authorized user shall be able to reprint return/refund document.

**Acceptance:** Reprint creates no additional stock/refund effect.

### FR-RET-055 --- Refund receipt masking

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Return/refund document shall not expose prohibited sensitive payment
data.

**Acceptance:** Only approved masked/reference data appears.

### FR-RET-056 --- Cash drawer failure on refund

**Source:** BR-HW-003\
**Priority:** MUST\
**Phase:** 1

Drawer hardware failure shall not cause duplicate refund posting;
MiniMart shall show operational recovery guidance.

**Acceptance:** Financial state remains unambiguous.

### FR-RET-057 --- Printer failure on return

**Source:** BR-HW-002\
**Priority:** MUST\
**Phase:** 1

Printer failure after posted return shall not reverse return/refund;
reprint remains available.

**Acceptance:** Return remains valid.

### FR-RET-058 --- No-receipt return reporting

**Source:** BR-RET-007\
**Priority:** MUST\
**Phase:** 2

Exceptional no-receipt/no-original-sale returns shall be separately
identifiable for management/audit reporting.

**Acceptance:** High-risk activity can be reviewed.

### FR-RET-059 --- Return/refund reconciliation

**Source:** BR-PAY-007\
**Priority:** MUST\
**Phase:** 2

Refunds shall contribute to tender/cash/provider reconciliation using
permitted references and status.

**Acceptance:** Day/shift totals can explain refunds.

### FR-RET-060 --- Return acceptance suite

**Source:** BR-RET-001, BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/2

Automated/integration tests shall cover partial/full return, prior
return, over-return, damaged disposition, offline return, retry/restart,
concurrent return and refund failure/uncertainty.

**Acceptance:** Return/refund invariants are regression-tested.

## Critical invariant

A refund must never be assumed successful merely because MiniMart lost a
provider response. Cash, external-terminal and future integrated refunds
each use their own authoritative confirmation/recovery rules.
