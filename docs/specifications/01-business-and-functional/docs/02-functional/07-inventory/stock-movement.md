# MiniMart Stock Movement Functional Specification --- v0.3

**Document ID:** MM-FRS-INV-MOV-001\
**Requirement namespace:** `FR-INV-031`--`FR-INV-055`\
**Status:** Detailed Working Draft --- Batch 2

## Requirements

### FR-INV-031 --- Stock movement source

**Source:** BR-INV-001, BR-DATA-003\
**Priority:** MUST\
**Phase:** 1

Each stock movement shall identify movement type and source
document/process.

**Acceptance:** Movement traces to cause.

### FR-INV-032 --- Goods receipt movement

**Source:** BR-PUR-002\
**Priority:** MUST\
**Phase:** 1

Posted GRN shall create the defined positive stock movement.

**Acceptance:** Quantity matches receipt conversion.

### FR-INV-033 --- Purchase return movement

**Source:** BR-PUR-004\
**Priority:** MUST\
**Phase:** 1

Posted purchase return shall create the defined negative stock movement.

**Acceptance:** Quantity matches return.

### FR-INV-034 --- Sale movement

**Source:** BR-INV-001\
**Priority:** MUST\
**Phase:** 1

A posted sale shall create the defined negative stock movement for
stock-managed items.

**Acceptance:** Movement traces to sale.

### FR-INV-035 --- Sales return movement

**Source:** BR-INV-001\
**Priority:** MUST\
**Phase:** 1

An eligible posted sales return shall create positive stock movement or
alternate disposition according to return policy.

**Acceptance:** Disposition is explicit.

### FR-INV-036 --- Opening stock movement

**Source:** BR-INV-001\
**Priority:** MUST\
**Phase:** 1

Initial stock shall be introduced through a controlled opening-stock
process rather than direct balance editing.

**Acceptance:** Opening source is auditable.

### FR-INV-037 --- Positive adjustment movement

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

An approved positive adjustment shall create a positive stock movement
with reason.

**Acceptance:** No hidden balance edit.

### FR-INV-038 --- Negative adjustment movement

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

An approved negative adjustment shall create a negative stock movement
with reason.

**Acceptance:** Negative policy is applied.

### FR-INV-039 --- Stock count variance movement

**Source:** BR-INV-006\
**Priority:** MUST\
**Phase:** 1

Posting approved stock-count variance shall create adjustment
movement(s) rather than rewrite history.

**Acceptance:** Variance traces to count.

### FR-INV-040 --- Damage movement

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

Damage/write-off shall use an explicit reason/movement type.

**Acceptance:** Damaged quantity is reportable.

### FR-INV-041 --- Expiry/wastage movement

**Source:** BR-INV-007\
**Priority:** MUST\
**Phase:** 1

Expiry/wastage removal shall use an explicit reason/movement type.

**Acceptance:** Wastage is traceable.

### FR-INV-042 --- Future transfer movement

**Source:** BR-INV-008\
**Priority:** LATER\
**Phase:** 3

Interbranch transfer shall eventually create explicit source/destination
inventory effects rather than direct balance edits.

**Acceptance:** Reserved for Phase 3.

### FR-INV-043 --- Movement quantity sign

**Source:** BR-INV-001\
**Priority:** MUST\
**Phase:** 1

Movement direction/quantity semantics shall be unambiguous and
consistently interpreted.

**Acceptance:** Effect is reproducible.

### FR-INV-044 --- Movement unit conversion snapshot

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

A movement from a non-base unit shall retain enough conversion context
to reproduce its base-quantity effect.

**Acceptance:** Later UoM changes do not reinterpret history.

### FR-INV-045 --- Movement batch

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

Batch-tracked movement shall identify affected batch.

**Acceptance:** Batch balance can be reconstructed.

### FR-INV-046 --- Movement expiry context

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 1

Expiry context associated with batch stock shall remain traceable
through movements.

**Acceptance:** Expiry history remains understandable.

### FR-INV-047 --- Movement actor

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Manual/privileged movements shall identify responsible actor;
system-generated movements shall identify source process/document.

**Acceptance:** Cause is identifiable.

### FR-INV-048 --- Movement timestamp/business date

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

Stock movements shall retain posting time and applicable business date
context.

**Acceptance:** Chronology is queryable.

### FR-INV-049 --- Movement reason

**Source:** BR-INV-007\
**Priority:** MUST

**Applicability:** For adjustment transactions\
**Phase:** 1

Manual adjustment movements shall require a controlled reason and
optional explanatory note according to policy.

**Acceptance:** Reason is retained.

### FR-INV-050 --- Movement reference

**Source:** BR-INV-003\
**Priority:** MUST\
**Phase:** 1

Users shall be able to navigate from movement history to source business
document where applicable.

**Acceptance:** Source is accessible.

### FR-INV-051 --- Movement cannot be directly edited

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted movement shall not be directly edited to change stock.

**Acceptance:** Correction creates compensating movement.

### FR-INV-052 --- Movement duplicate protection

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

One source posting shall not create duplicate stock movements because of
retries.

**Acceptance:** Exactly one logical effect.

### FR-INV-053 --- Movement ordering/concurrency

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 1

Concurrent stock-affecting postings shall be processed so resulting
stock and policy checks are consistent.

**Acceptance:** No lost update.

### FR-INV-054 --- Balance reconciliation

**Source:** BR-INV-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall provide a way to verify maintained current stock agrees
with authoritative posted movement history.

**Acceptance:** Mismatch is detectable.

### FR-INV-055 --- Movement export/report

**Source:** BR-INV-009\
**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to export/report movement history for
investigation/accounting.

**Acceptance:** Output includes source and quantities.

## Movement sources

``` text
Opening Stock        +
Goods Receipt        +
Purchase Return      -
Sale                 -
Sales Return         + / disposition-specific
Adjustment           +/-
Stock Count Variance +/-
Damage/Expiry        -
Future Transfer      source-/destination+
```

The later Domain/Data Model will define ledger entities/tables.
