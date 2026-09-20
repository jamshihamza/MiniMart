# MiniMart Card, QR and Electronic Payment Functional Specification --- v0.4

**Document ID:** MM-FRS-PAY-ELEC-001\
**Requirement namespace:** `FR-PAY-026`--`FR-PAY-055`\
**Status:** Detailed Working Draft --- Batch 3

## Requirements

### FR-PAY-026 --- Manual card tender

**Source:** BR-PAY-002\
**Priority:** MUST\
**Phase:** 1

Phase-1 POS shall support recording a card payment confirmed on an
external terminal, subject to permission/policy.

**Acceptance:** Sale records card tender without pretending MiniMart
processed the card.

### FR-PAY-027 --- Card external reference

**Source:** BR-PAY-002\
**Priority:** SHOULD\
**Phase:** 1

Manual card tender should capture permitted terminal/reference
information where operationally required.

**Acceptance:** Reference can support reconciliation.

### FR-PAY-028 --- Card manual confirmation

**Source:** BR-PAY-002\
**Priority:** MUST\
**Phase:** 1

Cashier shall explicitly confirm external-terminal success before manual
card tender settles the sale.

**Acceptance:** Selecting Card alone does not settle sale.

### FR-PAY-029 --- Card failed/cancelled

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

If external card attempt fails/cancels, MiniMart shall keep sale unpaid
for that amount.

**Acceptance:** Cashier can retry/change tender.

### FR-PAY-030 --- Integrated card extension

**Source:** BR-PAY-002\
**Priority:** LATER\
**Phase:** 3

Architecture/FRS shall allow later direct terminal integration without
changing sale immutability or tender reconciliation principles.

**Acceptance:** Phase 1 manual terminal flow remains valid.

### FR-PAY-031 --- Integrated card request identity

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Each integrated payment attempt shall have stable request identity for
safe retry/status lookup.

**Acceptance:** Provider retry cannot silently double-charge.

### FR-PAY-032 --- Integrated card pending state

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Provider pending response shall keep payment unresolved until
authoritative outcome or approved recovery.

**Acceptance:** Sale is not marked paid prematurely.

### FR-PAY-033 --- Integrated card uncertain state

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Lost/ambiguous provider response shall enter uncertain state and require
status inquiry/reconciliation rather than blind retry.

**Acceptance:** Duplicate charge risk is minimized.

### FR-PAY-034 --- Integrated card status inquiry

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

MiniMart shall support provider-status lookup/recovery where integration
permits.

**Acceptance:** Uncertain attempt can be resolved.

### FR-PAY-035 --- Integrated card duplicate provider result

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Repeated provider callback/result shall be idempotently associated with
one tender.

**Acceptance:** Duplicate callback creates no duplicate tender.

### FR-PAY-036 --- QR tender availability

**Source:** BR-PAY-003\
**Priority:** MUST\
**Phase:** 1

POS shall support configured QR/digital tender modes appropriate to
active country/store.

**Acceptance:** Only approved mode is shown.

### FR-PAY-037 --- Manual QR confirmation

**Source:** BR-PAY-003\
**Priority:** MUST\
**Phase:** 1

Where QR is externally confirmed in Phase 1, cashier shall explicitly
confirm successful receipt before tender settles sale.

**Acceptance:** Selecting QR alone does not mark paid.

### FR-PAY-038 --- QR reference

**Source:** BR-PAY-003\
**Priority:** SHOULD\
**Phase:** 1

Manual QR tender should capture permitted reference information where
required for reconciliation.

**Acceptance:** Reference is retained.

### FR-PAY-039 --- QR failed/cancelled

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

Confirmed failed/cancelled QR attempt shall not settle sale.

**Acceptance:** Remaining due stays visible.

### FR-PAY-040 --- Integrated QR extension

**Source:** BR-PAY-003\
**Priority:** LATER\
**Phase:** 3

MiniMart shall allow later direct QR integration while preserving
idempotency and reconciliation rules.

**Acceptance:** Core sale contract need not be replaced.

### FR-PAY-041 --- Integrated QR request identity

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Integrated QR request shall use stable attempt identity.

**Acceptance:** Retry/status lookup refers to same attempt.

### FR-PAY-042 --- QR pending

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Pending QR provider state shall remain unresolved until authoritative
completion/failure/expiry.

**Acceptance:** Sale is not prematurely completed.

### FR-PAY-043 --- QR expiry

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Expired QR request shall not settle sale and shall be distinguishable
from successful payment.

**Acceptance:** Cashier can initiate a new permitted attempt.

### FR-PAY-044 --- QR uncertain state

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Ambiguous QR outcome shall use status/reconciliation recovery instead of
blind retry.

**Acceptance:** Duplicate receipt risk is controlled.

### FR-PAY-045 --- Provider outage

**Source:** BR-POS-011\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Provider outage shall be shown clearly and shall not prevent selection
of other permitted tenders.

**Acceptance:** Sale remains recoverable.

### FR-PAY-046 --- Provider credential isolation

**Source:** BR-SEC-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Payment provider secrets shall not be exposed to cashier UI or ordinary
logs.

**Acceptance:** Sensitive configuration is protected.

### FR-PAY-047 --- Provider callback authenticity

**Source:** BR-SEC-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Integrated payment callbacks/results shall be authenticated/validated
according to provider contract before changing tender state.

**Acceptance:** Untrusted callback cannot settle sale.

### FR-PAY-048 --- Refund to card/QR

**Source:** BR-RET-005\
**Priority:** MUST

**Applicability:** Where the capability is supported\
**Phase:** 2/3

Refund workflow shall use approved original-tender/provider rules for
card/QR refunds.

**Acceptance:** Refund is linked to original tender where applicable.

### FR-PAY-049 --- Manual electronic refund recording

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 2

Where refund is executed externally, authorized user shall record
confirmation/reference without claiming MiniMart initiated provider
refund.

**Acceptance:** Refund record is reconcilable.

### FR-PAY-050 --- Electronic refund uncertain state

**Source:** BR-PAY-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Ambiguous electronic refund outcome shall remain uncertain until
resolved.

**Acceptance:** System does not issue duplicate refund blindly.

### FR-PAY-051 --- Tender surcharge restriction

**Source:** BR-PRI-001\
**Priority:** MUST

**Decision Status:** OPEN

**Verification Gate:** Country-specific verification required\
**Phase:** 2+

Any payment-method surcharge/fee charged to customer shall require an
explicitly approved legal/pricing rule before implementation.

**Acceptance:** No agent invents surcharge behavior.

### FR-PAY-052 --- Tender-specific minimum/maximum

**Source:** BR-PAY-001\
**Priority:** SHOULD\
**Phase:** 1

MiniMart may enforce configured tender amount limits where
operational/provider rules require.

**Acceptance:** Out-of-range tender is rejected with reason.

### FR-PAY-053 --- Electronic tender receipt masking

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Receipt shall display only approved masked/non-sensitive payment
references.

**Acceptance:** No prohibited card credential appears.

### FR-PAY-054 --- Electronic tender reconciliation status

**Source:** BR-PAY-007\
**Priority:** SHOULD\
**Phase:** 2/3

Integrated tenders should expose reconciliation state separate from sale
completion state.

**Acceptance:** Operational mismatch can be investigated.

### FR-PAY-055 --- Provider-independent core

**Source:** BR-PAY-002, BR-PAY-003\
**Priority:** MUST\
**Phase:** 1/3

Core sale/tender behavior shall not be hard-coded to a single card/QR
provider.

**Acceptance:** Provider-specific behavior remains behind approved
integration contracts.

## Phase boundary

Phase 1 supports external-terminal/manual confirmation flows. Direct
provider integration is a later phase and must preserve request
identity, idempotency, pending/uncertain states and reconciliation.
