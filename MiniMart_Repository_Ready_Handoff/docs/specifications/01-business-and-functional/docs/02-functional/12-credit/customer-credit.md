# MiniMart Customer Credit Functional Specification --- v0.5

**Document ID:** MM-FRS-CRD-001\
**Requirement namespace:** `FR-CRD-001`--`FR-CRD-065`\
**Status:** Detailed Working Draft --- Batch 4

## Purpose

Define customer credit eligibility, exposure, collections, statements
and reconciliation while preserving posted-document traceability.

## Phase-1 basic credit baseline

Because the BRD explicitly includes **basic credit sales in Phase 1**,
the minimum credit capability is part of the retail-core baseline:

-   explicitly enabled/eligible identified customer;
-   credit status, limit/terms and current outstanding;
-   authoritative credit check/revalidation;
-   full or split credit sale;
-   due date/source reference;
-   return adjustment;
-   customer collection, receipt, posting, retry protection and
    reversal;
-   no direct balance editing;
-   history/audit/access control;
-   offline local-store operation and multi-counter concurrency;
-   exact currency handling and reconciliation.

Advanced aging policy, overdue automation, write-off, interest/late fees
and multi-branch offline credit remain Phase 2/3.

## Requirements

### FR-CRD-001 --- Enable customer credit

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

Customer credit shall be an explicitly enabled business capability, not
automatically available to every customer.

**Acceptance:** Disabled credit cannot be used as tender.

### FR-CRD-002 --- Credit eligibility

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

An identified active customer shall have explicit credit eligibility
before a credit sale is allowed.

**Acceptance:** Ineligible customer is blocked from credit tender.

### FR-CRD-003 --- Credit limit

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

MiniMart shall support a configured monetary credit limit for eligible
customers where policy uses limits.

**Acceptance:** Limit is visible to authorized users.

### FR-CRD-004 --- Unlimited/controlled exception

**Source:** BR-PAY-004\
**Priority:** SHOULD\
**Phase:** 1/2

If business policy permits no fixed limit, that state shall be explicit
rather than represented by an arbitrary huge number.

**Acceptance:** Credit state is unambiguous.

### FR-CRD-005 --- Credit terms

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

MiniMart shall support configured payment terms/due-date basis for
credit transactions.

**Acceptance:** Due date can be derived deterministically.

### FR-CRD-006 --- Credit status

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

Credit account shall have explicit status such as active, suspended or
closed.

**Acceptance:** Suspended/closed account cannot receive new credit
unless approved exception exists.

### FR-CRD-007 --- Current outstanding

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 1/2

MiniMart shall calculate current customer outstanding from posted credit
transactions, collections and adjustments.

**Acceptance:** Balance is derived from traceable entries.

### FR-CRD-008 --- Available credit

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

Where a limit applies, available credit shall be calculated from
approved limit and relevant outstanding/exposure.

**Acceptance:** POS sees current authoritative eligibility.

### FR-CRD-009 --- Pending exposure

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

Credit-limit evaluation shall define whether unresolved/pending
transactions consume available credit.

**Acceptance:** Concurrent sales cannot unknowingly oversubscribe limit.

### FR-CRD-010 --- Credit sale

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

Eligible sale amount may be settled wholly by customer credit when
policy permits.

**Acceptance:** Posted sale creates corresponding customer
receivable/outstanding effect.

### FR-CRD-011 --- Split cash plus credit

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1/2

Eligible sale may use customer credit for only the remaining portion
after other tenders.

**Acceptance:** Only credit portion increases outstanding.

### FR-CRD-012 --- Credit check at payment

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

POS shall request current credit eligibility before accepting credit
tender.

**Acceptance:** Stale customer master data alone cannot approve credit.

### FR-CRD-013 --- Credit revalidation at posting

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/2

Credit eligibility/exposure shall be revalidated at posting to handle
concurrent counters.

**Acceptance:** Two counters cannot silently exceed policy.

### FR-CRD-014 --- Within-limit sale

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

A credit sale within approved limit/terms shall proceed without
unnecessary override.

**Acceptance:** Resulting balance is updated exactly once.

### FR-CRD-015 --- Over-limit mode

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 2

MiniMart shall support an approved policy of BLOCK, WARN+APPROVAL, or
another explicitly configured mode for over-limit sales.

**Acceptance:** Configured mode is enforced.

### FR-CRD-016 --- Over-limit manager approval

**Source:** BR-SEC-004\
**Priority:** SHOULD\
**Phase:** 2

Where policy allows over-limit approval, approving manager and reason
shall be retained.

**Acceptance:** Override is auditable.

### FR-CRD-017 --- Suspended customer override

**Source:** BR-PAY-004\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Whether a suspended credit customer may be overridden shall be an
explicit policy decision.

**Acceptance:** Implementation does not assume override is allowed.

### FR-CRD-018 --- Credit sale due date

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

Posted credit exposure shall retain applicable transaction/due date
basis.

**Acceptance:** Aging can be reproduced.

### FR-CRD-019 --- Credit sale reference

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1/2

Each customer-credit exposure shall link to its source sale/document.
**Acceptance:** Outstanding can be explained.

### FR-CRD-020 --- Return against credit sale

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 1/2

Return/refund against a credit sale shall reduce/adjust customer
outstanding according to approved refund policy before defaulting to
cash payout.

**Acceptance:** Original credit effect is respected.

### FR-CRD-021 --- Partial return credit adjustment

**Source:** BR-RET-005\
**Priority:** MUST\
**Phase:** 1/2

A partial return shall adjust only eligible returned value.
**Acceptance:** Remaining customer outstanding stays correct.

### FR-CRD-022 --- Over-credit prevention

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/2

Return/credit adjustments shall not reduce receivable twice for the same
eligible value.

**Acceptance:** Prior adjustments are considered.

### FR-CRD-023 --- Record customer collection

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 1/2

Authorized user shall be able to record money received from a customer
against outstanding credit.

**Acceptance:** Collection has stable identity and tender.

### FR-CRD-024 --- Collection tender

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1/2

Customer collection shall record permitted tender type such as
cash/card/QR/bank method as configured.

**Acceptance:** Collection can be reconciled.

### FR-CRD-025 --- Collection amount validation

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 1/2

Collection amount shall use exact money validation and approved
overpayment policy.

**Acceptance:** Invalid amount is blocked.

### FR-CRD-026 --- Collection receipt

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 1/2

Posted customer collection shall produce a receipt/document
representation.

**Acceptance:** Receipt matches posted collection.

### FR-CRD-027 --- Collection posting

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1/2

Collection shall update customer outstanding and applicable cash/tender
reconciliation as one logical posting outcome.

**Acceptance:** No collection exists without its required effects.

### FR-CRD-028 --- Collection safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/2

Retrying collection posting shall not duplicate money received or
balance reduction.

**Acceptance:** One effective collection remains.

### FR-CRD-029 --- Collection reversal

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1/2

A posted collection shall be corrected by explicit reversal/correction
rather than editing/deleting it.

**Acceptance:** Original collection remains traceable.

### FR-CRD-030 --- Unallocated collection

**Source:** BR-ACC-003\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should support a controlled customer payment on account when
immediate invoice allocation is not required.

**Acceptance:** Unallocated amount remains visible.

### FR-CRD-031 --- Specific allocation

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 2

Authorized workflow shall support allocating collection to one or more
eligible outstanding documents where business policy requires.

**Acceptance:** Allocated amounts cannot exceed eligible balances.

### FR-CRD-032 --- Allocation order

**Source:** BR-ACC-003\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Automatic allocation order, if offered, shall be explicitly defined (for
example oldest due first) rather than assumed.

**Acceptance:** Manual/automatic behavior is documented.

### FR-CRD-033 --- Reallocation

**Source:** BR-ACC-003\
**Priority:** SHOULD\
**Phase:** 2

Authorized users may correct allocation without changing original
collection amount through controlled reallocation.

**Acceptance:** Audit explains allocation change.

### FR-CRD-034 --- Customer advance/overpayment

**Source:** BR-ACC-003\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Treatment of collections exceeding outstanding shall be explicitly
defined as advance, block, refund or approved alternative.

**Acceptance:** No silent negative receivable is created.

### FR-CRD-035 --- Credit note boundary

**Source:** BR-ACC-003\
**Priority:** MUST\
**Phase:** 2

Customer balance adjustments not arising from ordinary sales return
shall use an explicit approved adjustment/credit-note process.

**Acceptance:** Users cannot directly edit balance.

### FR-CRD-036 --- Debit adjustment boundary

**Source:** BR-ACC-003\
**Priority:** SHOULD\
**Phase:** 2

Additional customer charge adjustments, if supported, shall use explicit
authorized documents/reasons.

**Acceptance:** Balance change is traceable.

### FR-CRD-037 --- Adjustment approval

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Manual customer balance adjustments shall require permission and
configured approval/reason.

**Acceptance:** High-risk balance edits are controlled.

### FR-CRD-038 --- No direct balance edit

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1/2

Users shall never directly type over computed customer outstanding.
**Acceptance:** Balance is always derived from posted transactions.

### FR-CRD-039 --- Customer statement

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 1/2

Authorized user shall be able to produce a statement for a customer and
period.

**Acceptance:** Opening, transactions, collections/adjustments and
closing balance reconcile.

### FR-CRD-040 --- Statement source references

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 2

Statement entries shall identify source document/reference and date.

**Acceptance:** Customer can trace charges/payments.

### FR-CRD-041 --- Statement aging

**Source:** BR-CUS-003\
**Priority:** SHOULD\
**Phase:** 2

Statement/reporting should show due/overdue status according to approved
terms.

**Acceptance:** Aging basis is explicit.

### FR-CRD-042 --- Aging buckets

**Source:** BR-CUS-003\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should support configurable/report-defined aging buckets.

**Acceptance:** Bucket definitions appear on report.

### FR-CRD-043 --- Overdue amount

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 2

MiniMart shall calculate overdue amount using transaction due dates and
effective payments/adjustments.

**Acceptance:** Overdue total is reproducible.

### FR-CRD-044 --- Credit hold by overdue rule

**Source:** BR-PAY-004\
**Priority:** SHOULD\
**Phase:** 2

Store policy may suspend/block new credit based on overdue conditions.

**Acceptance:** Rule and exception are explicit.

### FR-CRD-045 --- Credit history

**Source:** BR-CUS-005\
**Priority:** MUST\
**Phase:** 1/2

Authorized users shall view customer credit transactions, collections,
returns and adjustments.

**Acceptance:** History links to source documents.

### FR-CRD-046 --- Credit audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1/2

Credit-limit/status/terms changes, overrides, collections and
adjustments shall be auditable.

**Acceptance:** Who/what/when/reason are available.

### FR-CRD-047 --- Credit information access

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1/2

Credit limits, outstanding and statements shall be restricted to
authorized roles.

**Acceptance:** Ordinary product/customer lookup need not expose
financial details.

### FR-CRD-048 --- Offline credit sale

**Source:** BR-OPS-001\
**Priority:** MUST

**Applicability:** Subject to approved policy\
**Phase:** 1/2

MiniMart shall define whether locally available customer credit can be
used while cloud is unavailable; local Store Node shall remain
authoritative for same-store counters.

**Acceptance:** Cloud loss alone need not block if local policy/data are
sufficient.

### FR-CRD-049 --- Multi-counter credit concurrency

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 1/2

Concurrent local credit sales shall evaluate against authoritative
store/customer exposure so limit policy is not silently bypassed.
**Acceptance:** Posting revalidation handles race.

### FR-CRD-050 --- Multi-branch offline credit risk

**Source:** BR-PAY-004\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 3

When multiple branches can trade disconnected, cross-branch credit
exposure policy shall explicitly address stale central balances.

**Acceptance:** Phase-3 design does not assume perfect real-time credit.

### FR-CRD-051 --- Collection offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1/2

Eligible local customer collections may post without cloud when local
services are operational.

**Acceptance:** Cloud synchronization later does not duplicate
collection.

### FR-CRD-052 --- Credit sync identity

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 2/3

Credit transactions and collections shall have stable identity for
idempotent synchronization.

**Acceptance:** Central replication creates no duplicate exposure.

### FR-CRD-053 --- Statement offline

**Source:** BR-OPS-001\
**Priority:** SHOULD\
**Phase:** 2

A statement may be generated from locally authoritative/available data
with clear scope if cloud is unavailable.

**Acceptance:** Report does not imply unseen branch data is included.

### FR-CRD-054 --- Credit currency

**Source:** BR-LOC-004\
**Priority:** MUST\
**Phase:** 1/2

Credit account amounts shall use the store/company approved currency
model.

**Acceptance:** Cross-currency credit is not silently introduced.

### FR-CRD-055 --- Credit write-off boundary

**Source:** BR-ACC-003\
**Priority:** LATER

**Applicability:** Controlled capability only\
**Phase:** 2+

Bad-debt/write-off behavior shall require explicit accounting policy and
authorization before implementation.

**Acceptance:** No ordinary user can erase debt.

### FR-CRD-056 --- Interest/late fee boundary

**Source:** BR-ACC-003\
**Priority:** LATER

**Applicability:** Out of initial scope\
**Phase:** 3+

Interest, finance charges or late fees shall not be implemented without
explicit legal/accounting specification.

**Acceptance:** Credit module does not invent finance charges.

### FR-CRD-057 --- Credit limit history

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1/2

Changes to credit limit shall retain effective audit history.
**Acceptance:** Past override/investigation can see prior limit.

### FR-CRD-058 --- Terms history

**Source:** BR-AUD-001\
**Priority:** SHOULD\
**Phase:** 1/2

Material credit-term changes should be auditable and not rewrite due
dates of posted transactions unless explicit process exists.
**Acceptance:** Historical due dates remain explainable.

### FR-CRD-059 --- Credit exposure on held sale

**Source:** BR-POS-006\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Whether held but unpaid credit-intended sales reserve credit exposure
shall be explicitly decided.

**Acceptance:** No hidden reservation behavior.

### FR-CRD-060 --- Partially paid credit sale

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1/2

When a sale is partly settled by other tender and partly by credit, only
posted credit portion enters customer outstanding.

**Acceptance:** Statement reconciles to sale tender split.

### FR-CRD-061 --- Refund exceeding outstanding

**Source:** BR-RET-005\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

If return value exceeds remaining related credit outstanding, excess
refund treatment shall follow approved policy.

**Acceptance:** No automatic cash payout is assumed.

### FR-CRD-062 --- Customer balance report

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Reporting shall provide customer outstanding balances with appropriate
as-of date.

**Acceptance:** Total can be reconciled to customer transactions.

### FR-CRD-063 --- Overdue report

**Source:** BRD §20 Reports\
**Priority:** MUST\
**Phase:** 2

Reporting shall identify overdue customer balances using approved
terms/aging basis.

**Acceptance:** Report states as-of date.

### FR-CRD-064 --- Credit reconciliation

**Source:** BR-PAY-007\
**Priority:** MUST\
**Phase:** 1/2

Credit sales, returns, collections and adjustments shall reconcile to
customer closing outstanding.

**Acceptance:** Unexplained balance differences are not silently hidden.

### FR-CRD-065 --- Credit acceptance suite

**Source:** BR-PAY-004, BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/2

Tests shall cover within-limit sale, over-limit policy, concurrent
counters, split tender, return, collection, retry, statement and overdue
calculation.

**Acceptance:** Credit invariants are regression-tested.

## Core invariant

``` text
Outstanding balance
= posted credit charges
- effective returns/credits
- effective collections/allocations
+ approved debit adjustments
```

Users never directly edit the computed balance.

## Decision-sensitive areas

Over-limit default, allocation order, customer advances, held-sale
credit reservation and multi-branch offline exposure remain explicit
decision gates.
