# MiniMart Sales Return Functional Specification --- v0.4

**Document ID:** MM-FRS-RET-001\
**Requirement namespace:** `FR-RET-001`--`FR-RET-035`\
**Status:** Detailed Working Draft --- Batch 3

## Requirements

### FR-RET-001 --- Start sales return

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

Authorized user shall be able to start a sales-return transaction.

**Acceptance:** Draft return has no stock/refund effect.

### FR-RET-002 --- Return with original sale

**Source:** BR-RET-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support return against an identified original posted
sale.

**Acceptance:** Eligible original lines/quantities are shown.

### FR-RET-003 --- Locate original sale

**Source:** BR-RET-002\
**Priority:** MUST\
**Phase:** 1

Authorized user shall be able to locate original sale by
receipt/reference and permitted search criteria.

**Acceptance:** Correct posted sale can be selected.

### FR-RET-004 --- Return without original sale

**Source:** BR-RET-002\
**Priority:** SHOULD\
**Phase:** 1/2

MiniMart may support a controlled no-receipt/no-original-sale return
when store policy allows.

**Acceptance:** Such return requires stricter
permission/reason/valuation rules.

### FR-RET-005 --- Return customer context

**Source:** BR-CUS-003\
**Priority:** SHOULD\
**Phase:** 1/2

Return shall retain/reuse applicable customer identity where original
sale or policy requires it.

**Acceptance:** Customer is not fabricated for ordinary anonymous
return.

### FR-RET-006 --- Select return line

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

User shall select eligible sold item/line for return.

**Acceptance:** Returned item traces to original line where linked.

### FR-RET-007 --- Partial line return

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support returning part of originally sold quantity.

**Acceptance:** Remaining eligible quantity is recalculated.

### FR-RET-008 --- Full sale return

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support returning all remaining eligible quantities from
a sale.

**Acceptance:** Already-returned quantity is not returned again.

### FR-RET-009 --- Return quantity precision

**Source:** BR-CAT-006\
**Priority:** MUST\
**Phase:** 1

Return quantity shall respect item quantity precision and original sale
constraints.

**Acceptance:** Invalid fractional return is rejected.

### FR-RET-010 --- Remaining eligible quantity

**Source:** BR-RET-003\
**Priority:** MUST\
**Phase:** 1

For linked returns, MiniMart shall calculate original sold quantity less
prior effective returns/corrections.

**Acceptance:** Ordinary return cannot exceed remaining eligible
quantity.

### FR-RET-011 --- Over-return prevention

**Source:** BR-RET-003\
**Priority:** MUST\
**Phase:** 1

Return beyond remaining eligible quantity shall be blocked unless an
explicitly designed exceptional process exists.

**Acceptance:** No silent over-return occurs.

### FR-RET-012 --- Return reason

**Source:** BR-RET-006\
**Priority:** MUST\
**Phase:** 1

Each return or applicable return line shall capture a controlled reason.

**Acceptance:** Posted return retains reason.

### FR-RET-013 --- Return note

**Source:** BR-RET-006\
**Priority:** SHOULD\
**Phase:** 1

Policy may require explanatory note for selected reasons/thresholds.

**Acceptance:** Required note blocks posting if absent.

### FR-RET-014 --- Return condition

**Source:** BR-RET-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support recording return disposition/condition needed to
decide whether stock becomes sellable, damaged, quarantine or another
approved state.

**Acceptance:** Stock effect is explicit.

### FR-RET-015 --- Sellable return to stock

**Source:** BR-RET-004\
**Priority:** MUST\
**Phase:** 1

A return accepted as sellable shall create the approved positive stock
effect.

**Acceptance:** Movement traces to sales return.

### FR-RET-016 --- Damaged/non-sellable return

**Source:** BR-RET-004\
**Priority:** MUST\
**Phase:** 1

A damaged/non-sellable return shall not silently increase ordinary
sellable stock; it shall follow defined disposition movement/process.

**Acceptance:** Disposition is traceable.

### FR-RET-017 --- Batch-tracked return

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

For batch-tracked goods, return shall identify/reconstruct applicable
batch according to approved policy.

**Acceptance:** Stock returns to correct batch/disposition.

### FR-RET-018 --- Expiry-tracked return

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where relevant\
**Phase:** 1

Expiry context shall be retained for returned expiry-managed goods where
required.

**Acceptance:** Expired goods are not silently restored as normal
sellable stock.

### FR-RET-019 --- Return price basis

**Source:** BR-RET-003\
**Priority:** MUST\
**Phase:** 1

Linked return refund value shall be based on approved original-sale
economic values and return policy, not current selling price by default.

**Acceptance:** Later price changes do not change historical refund
basis.

### FR-RET-020 --- Discount/tax reversal basis

**Source:** BR-RET-003\
**Priority:** MUST\
**Phase:** 1/2

Return shall reverse/adjust original discount and tax effects according
to approved country/accounting rules.

**Acceptance:** Return total is reproducible.

### FR-RET-021 --- Return approval

**Source:** BR-RET-007\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support manager approval based on reason, amount,
no-receipt status or other configured risk thresholds.

**Acceptance:** Approver is retained.

### FR-RET-022 --- Return permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Creating/posting/refunding returns shall require applicable permissions.

**Acceptance:** Unauthorized action creates no effect.

### FR-RET-023 --- Return validation

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

Before posting, MiniMart shall validate source, eligibility, quantity,
reason, disposition, refund plan and required approvals.

**Acceptance:** Invalid return does not partially post.

### FR-RET-024 --- Return preview

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

User shall review items, quantities, refund amount and disposition
before posting.

**Acceptance:** Posting is explicit.

### FR-RET-025 --- Posted return immutability

**Source:** BR-RET-003, BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

Posted return shall not be edited to rewrite its stock/refund effect.

**Acceptance:** Further correction uses explicit reversal/correction.

### FR-RET-026 --- Atomic return posting

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

Posting a Return shall atomically commit the Return document, inventory
disposition/stock effects, the resulting Refund Obligation or immediate
refund settlement record as applicable, audit records and
synchronization-intent/outbox records.

A Return may be posted while an electronic/manual refund remains pending
or uncertain, provided the outstanding Refund Obligation is explicit and
recoverable. Such a Return shall not be presented as fully
refund-settled.

**Acceptance:** Stock cannot be returned without a traceable refund
obligation/settlement state, and unresolved refund money is never
falsely marked successful.

### FR-RET-027 --- Return audit

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Return posting, approval, exceptional no-receipt return and refund
actions shall be audited.

**Acceptance:** Actor/reason/source are traceable.

### FR-RET-028 --- Return reference

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

Posted return shall have stable MiniMart identity/reference.

**Acceptance:** Return is searchable and printable.

### FR-RET-029 --- Return receipt/document

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall produce a return/refund document representation from
posted data.

**Acceptance:** Document totals match posted return.

### FR-RET-030 --- Return search

**Source:** BR-RET-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to find returns by return reference,
original sale, date and permitted customer/item context.

**Acceptance:** History is practical to investigate.

### FR-RET-031 --- Return offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

A valid local return using locally available source data and permitted
refund method may post while cloud is unavailable.

**Acceptance:** Cloud loss alone does not block eligible local return.

### FR-RET-032 --- Return restart recovery

**Source:** BR-OPS-005\
**Priority:** MUST\
**Phase:** 1

After restart, MiniMart shall determine whether return posting completed
and shall not invite blind reposting.

**Acceptance:** Exactly one effective return remains.

### FR-RET-033 --- Return safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Retrying return posting shall not create duplicate stock increase or
refund.

**Acceptance:** One effective return remains.

### FR-RET-034 --- Concurrent return protection

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Concurrent counters/users shall not both return the same remaining
eligible quantity beyond allowed amount.

**Acceptance:** Eligibility is revalidated at posting.

### FR-RET-035 --- Historical preservation

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Later item/customer/price changes shall not rewrite historical return
meaning.

**Acceptance:** Posted return remains understandable.

## Return principle

A sales return is a new business document. It never rewrites the
original sale.

## Stock disposition

``` text
Returned item
  ├─ Sellable → approved positive stock movement
  ├─ Damaged  → damaged/quarantine disposition
  └─ Expired/other → policy-defined disposition
```
