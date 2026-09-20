# MiniMart Audit Functional Specification --- v0.6

**Document ID:** MM-FRS-AUD-001\
**Requirement namespace:** `FR-AUD-001`--`FR-AUD-045`\
**Status:** Detailed Working Draft --- Batch 5

## Requirements

### FR-AUD-001 --- Audit important actions

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall create audit records for defined security, financial,
inventory, configuration and support actions.

**Acceptance:** Required actions produce audit evidence.

### FR-AUD-002 --- Actor identity

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Audit record shall identify authenticated actor or system process
responsible.

**Acceptance:** Actor is not represented only by display name.

### FR-AUD-003 --- Approver identity

**Source:** BR-SEC-004\
**Priority:** MUST\
**Phase:** 1

Where manager approval/override occurs, approving actor shall be
recorded separately.

**Acceptance:** Operator and approver are distinguishable.

### FR-AUD-004 --- Timestamp

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Audit record shall retain reliable event timestamp and relevant business
date where applicable.

**Acceptance:** Sequence/investigation is possible.

### FR-AUD-005 --- Store/counter/device context

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Audit shall retain applicable store, counter and device/service context.

**Acceptance:** Origin is identifiable.

### FR-AUD-006 --- Affected entity

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Audit shall identify affected business object and stable record
identity.

**Acceptance:** Investigator can locate source record.

### FR-AUD-007 --- Action type

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Audit shall use explicit action/event classification.

**Acceptance:** Create/change/approve/void/etc. are distinguishable.

### FR-AUD-008 --- Before/after information

**Source:** BR-AUD-002\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1

Material mutable changes shall retain relevant before/after values or
equivalent change representation.

**Acceptance:** Change is understandable.

### FR-AUD-009 --- Reason

**Source:** BR-AUD-004\
**Priority:** MUST

**Applicability:** Where required by approved policy/rule\
**Phase:** 1

Operations requiring reason shall preserve it in audit context.

**Acceptance:** Reason is not lost after posting.

### FR-AUD-010 --- No casual edit

**Source:** BR-AUD-003\
**Priority:** MUST\
**Phase:** 1

Ordinary application users shall not edit or delete audit history.

**Acceptance:** Audit UI is read-only.

### FR-AUD-011 --- Privileged audit administration

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Any retention/export/administrative operation affecting audit
availability shall be highly permissioned and itself auditable.

**Acceptance:** Audit cannot be silently disabled.

### FR-AUD-012 --- Authentication events

**Source:** BR-SEC-001\
**Priority:** MUST\
**Phase:** 1

Security policy shall audit relevant login failures, resets, lockouts
and support access without logging secrets.

**Acceptance:** Security investigation is possible.

### FR-AUD-013 --- Permission changes

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Role/permission assignment and protected authorization changes shall be
audited.

**Acceptance:** Privilege escalation is traceable.

### FR-AUD-014 --- Manager overrides

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Manager overrides shall record requested action, operator, approver and
reason.

**Acceptance:** Override reports can be produced.

### FR-AUD-015 --- Price changes

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Price creation/change/override shall be auditable.

**Acceptance:** Original/new price and actor are traceable.

### FR-AUD-016 --- Discounts

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Material/manual discounts shall retain audit context according to
policy.

**Acceptance:** Discount review is possible.

### FR-AUD-017 --- Voids/cancellations

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Protected void/cancel operations shall be audited.

**Acceptance:** Cancelled activity is not invisible.

### FR-AUD-018 --- Sales returns/refunds

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Returns, refund approvals and exceptional no-receipt returns shall be
audited.

**Acceptance:** Source/reason/actor are traceable.

### FR-AUD-019 --- Stock adjustments/count approvals

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Manual stock adjustments and count variance approvals shall be audited.

**Acceptance:** Inventory corrections are explainable.

### FR-AUD-020 --- Cash movements/variance approvals

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 2

Cash-in/out, variance approvals and forced shift/day-close exceptions
shall be audited.

**Acceptance:** Cash-control exceptions are traceable.

### FR-AUD-021 --- Customer credit changes

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 2

Credit limits/status/terms and manual balance adjustments shall be
audited.

**Acceptance:** Customer financial control changes are traceable.

### FR-AUD-022 --- Import audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Bulk imports shall create audit summary and link to import execution.

**Acceptance:** Mass change has one traceable context.

### FR-AUD-023 --- Export audit

**Source:** BR-AUD-001\
**Priority:** SHOULD\
**Phase:** 2

Sensitive/bulk exports should be audited.

**Acceptance:** Data extraction can be investigated.

### FR-AUD-024 --- Configuration changes

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Material store/counter/country/security configuration changes shall be
audited.

**Acceptance:** Operational behavior changes are traceable.

### FR-AUD-025 --- Support actions

**Source:** BR-SUPT-005\
**Priority:** MUST\
**Phase:** 1/2

Privileged support actions shall be audited according to capability.

**Acceptance:** Remote/local support activity is attributable.

### FR-AUD-026 --- Audit search

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 2

Authorized users shall search audit by date, actor, store, action and
affected entity.

**Acceptance:** Investigation does not require raw DB access.

### FR-AUD-027 --- Audit filters

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 2

Audit viewer shall support practical filtering and bounded result
retrieval.

**Acceptance:** Large history remains usable.

### FR-AUD-028 --- Audit detail view

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 2

Authorized viewer shall inspect event details including reason and
before/after context where available.

**Acceptance:** Summary can be expanded safely.

### FR-AUD-029 --- Audit export

**Source:** BR-AUD-001\
**Priority:** SHOULD\
**Phase:** 2

Authorized users may export selected audit evidence in read-only form.

**Acceptance:** Export matches filtered source.

### FR-AUD-030 --- Audit access control

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Audit visibility shall be restricted by role/scope.

**Acceptance:** Cashier cannot browse unrelated privileged audit data.

### FR-AUD-031 --- Sensitive-data minimization

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 1

Audit shall avoid passwords, secrets, full payment credentials and
unnecessary PII.

**Acceptance:** Audit is useful without becoming a secret store.

### FR-AUD-032 --- Secret redaction

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Credentials/tokens/keys shall never be written to audit payloads in
plaintext.

**Acceptance:** Security test confirms redaction.

### FR-AUD-033 --- Audit durability

**Source:** BR-REL-001\
**Priority:** MUST\
**Phase:** 1

Audit required for a transactional business action shall be committed
consistently with that action where architecture requires it.

**Acceptance:** Completed action is not missing required audit.

### FR-AUD-034 --- Audit ordering/correlation

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Related events shall carry correlation/reference information sufficient
to reconstruct workflow.

**Acceptance:** Sale/override/payment chain can be followed.

### FR-AUD-035 --- System actor

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Automated/system-generated changes shall identify system actor/process
and trigger context.

**Acceptance:** Automation is not attributed to a human falsely.

### FR-AUD-036 --- Offline audit

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Required local audit shall continue while cloud is unavailable.

**Acceptance:** Internet loss does not create audit gaps.

### FR-AUD-037 --- Audit synchronization

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 2/3

Replicated audit records shall retain stable identity and not duplicate
under retry.

**Acceptance:** Central history preserves source identity.

### FR-AUD-038 --- Clock anomaly

**Source:** BR-OPS-005\
**Priority:** SHOULD\
**Phase:** 2

Material clock/time anomalies affecting audit interpretation should be
surfaced.

**Acceptance:** Investigator can recognize questionable timing.

### FR-AUD-039 --- Retention policy

**Source:** BR-AUD-003\
**Priority:** MUST

**Decision Status:** OPEN

**Verification Gate:** Legal verification required\
**Phase:** 2

Audit retention duration shall be explicit and aligned with applicable
business/legal retention requirements.

**Acceptance:** No agent invents deletion period.

### FR-AUD-040 --- Archive boundary

**Source:** BR-AUD-003\
**Priority:** SHOULD\
**Phase:** 2+

If audit is archived, authorized retrieval shall preserve integrity and
context.

**Acceptance:** Archive is not equivalent to deletion.

### FR-AUD-041 --- Tamper evidence

**Source:** BR-AUD-003\
**Priority:** SHOULD\
**Phase:** 2+

MiniMart should support controls/detection appropriate to identify
unauthorized audit tampering.

**Acceptance:** Tamper risk is operationally detectable.

### FR-AUD-042 --- Audit failure behavior

**Source:** BR-DATA-005\
**Priority:** MUST\
**Phase:** 1

If a required audit record cannot be persisted for a protected action,
MiniMart shall not silently proceed as fully successful.

**Acceptance:** Failure is blocked/recoverable according to action
criticality.

### FR-AUD-043 --- Audit health

**Source:** BR-SUPT-003\
**Priority:** SHOULD\
**Phase:** 2

System health should indicate material audit-pipeline failures/backlog.

**Acceptance:** Support can detect missing pipeline.

### FR-AUD-044 --- Audit reporting boundary

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 2

Audit reports describe recorded actions and shall not infer intent or
misconduct automatically.

**Acceptance:** Evidence remains factual.

### FR-AUD-045 --- Audit acceptance suite

**Source:** BR-AUD-001, BR-AUD-003\
**Priority:** MUST\
**Phase:** 1/2

Tests shall cover actor/approver, before-after, offline, retry,
permission, redaction, protected-action failure and read-only history.

**Acceptance:** Audit invariants are regression-tested.

## Principle

Audit records explain **who/what/when/where/reason/change**. They are
evidence, not a substitute for the business document and not an editable
notes system.
