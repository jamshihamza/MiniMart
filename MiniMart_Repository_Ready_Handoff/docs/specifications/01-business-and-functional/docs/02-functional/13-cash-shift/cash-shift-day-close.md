# MiniMart Cashier Shift and Day Close Functional Specification --- v0.5

**Document ID:** MM-FRS-CSH-001\
**Requirement namespace:** `FR-CSH-001`--`FR-CSH-075`\
**Status:** Detailed Working Draft --- Batch 4

## Purpose

Define cashier/counter cash accountability and store business-day
closing without equating login sessions, shifts and calendar dates.

## Requirements

### FR-CSH-001 --- Shift concept

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

MiniMart shall represent a cashier/counter operating shift separately
from user login session.

**Acceptance:** One shift can be audited independently of login
reconnects.

### FR-CSH-002 --- Open shift

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Authorized cashier shall be able to open a shift for an eligible
counter.

**Acceptance:** Open shift receives stable identity and opening time.

### FR-CSH-003 --- One active shift policy

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

MiniMart shall enforce the approved number of simultaneous active shifts
per counter/cash drawer.

**Acceptance:** Conflicting shift opening is prevented.

### FR-CSH-004 --- Opening float

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Shift opening shall capture configured opening cash/float amount where
cash is used.

**Acceptance:** Expected cash begins from posted opening float.

### FR-CSH-005 --- Opening float zero

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Policy may allow a zero opening float without fake cash movement.

**Acceptance:** Shift can open with explicit zero.

### FR-CSH-006 --- Opening float permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Opening float entry/override shall follow configured permissions.

**Acceptance:** Unauthorized user cannot alter opening amount.

### FR-CSH-007 --- Opening float audit

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 2

Opening float and any authorized override shall be audited.

**Acceptance:** Actor/time/amount are traceable.

### FR-CSH-008 --- Shift business date

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Each shift shall be associated with an approved store business date.

**Acceptance:** Shift reporting does not rely only on calendar date.

### FR-CSH-009 --- Shift counter

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 2

Each shift shall identify its store and counter/drawer context.

**Acceptance:** Cash accountability is scoped.

### FR-CSH-010 --- Cashier attribution

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Shift shall identify responsible cashier(s) according to approved
operating model.

**Acceptance:** Responsibility is explicit.

### FR-CSH-011 --- Sale requires eligible shift

**Source:** BR-CASH-001\
**Priority:** MUST

**Applicability:** Where the approved policy enables the behavior\
**Phase:** 2

Cash sale posting shall require an appropriate open shift when shift
control is enabled.

**Acceptance:** Cash does not post outside accountability window.

### FR-CSH-012 --- Non-cash sale shift inclusion

**Source:** BR-CASH-004\
**Priority:** MUST\
**Phase:** 2

Card/QR/credit sales during a shift shall be included in shift tender
summaries even if they do not affect physical cash.

**Acceptance:** Shift totals reconcile to sales.

### FR-CSH-013 --- Cash sale effect

**Source:** BR-CASH-002\
**Priority:** MUST\
**Phase:** 2

Posted cash sale shall increase expected cash by the effective cash
retained after change/rounding.

**Acceptance:** Expected cash is derived, not manually typed.

### FR-CSH-014 --- Cash refund effect

**Source:** BR-CASH-002\
**Priority:** MUST\
**Phase:** 2

Posted cash refund shall reduce expected cash.

**Acceptance:** Refund is traceable to source return.

### FR-CSH-015 --- Customer cash collection effect

**Source:** BR-CASH-002\
**Priority:** MUST\
**Phase:** 2

Posted cash customer collection during shift shall increase expected
cash.

**Acceptance:** Collection appears in shift cash sources.

### FR-CSH-016 --- Cash-in movement

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Authorized users shall be able to record non-sale cash added to drawer
using approved reason.

**Acceptance:** Expected cash increases with source/reason.

### FR-CSH-017 --- Cash-out movement

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Authorized users shall be able to record non-refund cash removed from
drawer using approved reason.

**Acceptance:** Expected cash decreases with source/reason.

### FR-CSH-018 --- Cash movement reason

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 2

Manual cash-in/cash-out shall require controlled reason and
optional/required note by policy.

**Acceptance:** Movement is explainable.

### FR-CSH-019 --- Cash movement approval

**Source:** BR-SEC-004\
**Priority:** SHOULD\
**Phase:** 2

Configured high-value/sensitive cash movements shall require manager
approval.

**Acceptance:** Approver and reason are retained.

### FR-CSH-020 --- Cash movement immutability

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 2

Posted cash movement shall not be edited/deleted to change amount.

**Acceptance:** Correction uses compensating movement.

### FR-CSH-021 --- Cash movement safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 2

Retrying a cash movement posting shall not duplicate drawer effect.

**Acceptance:** One effective movement remains.

### FR-CSH-022 --- Expected cash calculation

**Source:** BR-CASH-002\
**Priority:** MUST\
**Phase:** 2

MiniMart shall calculate expected cash from opening float plus/minus all
posted cash-affecting transactions assigned to shift.

**Acceptance:** Formula is reproducible.

### FR-CSH-023 --- Expected cash components

**Source:** BR-CASH-002\
**Priority:** MUST\
**Phase:** 2

Shift review shall show components contributing to expected cash.

**Acceptance:** Cashier/manager can explain total.

### FR-CSH-024 --- Tender summary

**Source:** BR-CASH-004\
**Priority:** MUST\
**Phase:** 2

Shift shall summarize posted sales/refunds/collections by tender type.

**Acceptance:** Tender totals reconcile to source transactions.

### FR-CSH-025 --- Uncertain electronic payments

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 2/3

Unresolved electronic payment/refund states shall be separately visible
and not silently included as confirmed tender.

**Acceptance:** Shift close exposes exceptions.

### FR-CSH-026 --- Cash count entry

**Source:** BR-CASH-002\
**Priority:** MUST\
**Phase:** 2

At close, authorized user shall enter actual physical cash count.

**Acceptance:** Count uses approved money precision.

### FR-CSH-027 --- Denomination count

**Source:** BR-CASH-002\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should optionally support denomination-based cash counting.

**Acceptance:** Denomination total equals declared actual cash.

### FR-CSH-028 --- Blind cash close option

**Source:** BR-CASH-003\
**Priority:** SHOULD\
**Phase:** 2

Store policy should support hiding expected cash until cashier submits
actual count.

**Acceptance:** Cashier declaration is not biased by expected amount.

### FR-CSH-029 --- Expected vs actual

**Source:** BR-CASH-003\
**Priority:** MUST\
**Phase:** 2

MiniMart shall calculate shortage/overage as actual cash minus expected
cash.

**Acceptance:** Sign and amount are explicit.

### FR-CSH-030 --- Zero difference

**Source:** BR-CASH-003\
**Priority:** MUST\
**Phase:** 2

A zero-difference shift shall close without artificial adjustment.

**Acceptance:** Close record remains.

### FR-CSH-031 --- Difference reason

**Source:** BR-CASH-003\
**Priority:** SHOULD\
**Phase:** 2

Configured non-zero differences shall require explanation/reason.

**Acceptance:** Reason is retained.

### FR-CSH-032 --- Difference approval

**Source:** BR-CASH-003\
**Priority:** MUST\
**Phase:** 2

Differences exceeding configured threshold shall require manager
approval.

**Acceptance:** Approver is audited.

### FR-CSH-033 --- No silent balancing

**Source:** BR-CASH-003\
**Priority:** MUST\
**Phase:** 2

MiniMart shall not silently alter expected or actual cash to force a
zero difference.

**Acceptance:** Original variance remains visible.

### FR-CSH-034 --- Shift review

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Before close, MiniMart shall show shift sales, returns, tenders, cash
movements, expected cash, actual cash and variance.

**Acceptance:** User can review before posting close.

### FR-CSH-035 --- Close shift

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

Authorized user shall be able to close an eligible shift after required
checks/approvals.

**Acceptance:** Closed shift receives close time/status.

### FR-CSH-036 --- Open exceptions block/warn

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

MiniMart shall apply configured block/warn policy for unresolved
payment/refund/transaction exceptions at shift close.

**Acceptance:** Exception cannot disappear silently.

### FR-CSH-037 --- Shift close immutability

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 2

A closed shift shall not be reopened/edited casually to change declared
cash or totals.

**Acceptance:** Correction uses explicit authorized process.

### FR-CSH-038 --- Shift close audit

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 2

Shift opening, cash movements, declarations, approvals and closing shall
be audited.

**Acceptance:** Full accountability chain is available.

### FR-CSH-039 --- Shift close receipt/report

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

MiniMart shall produce a shift-close summary document/report.

**Acceptance:** Summary matches posted close.

### FR-CSH-040 --- Shift handover

**Source:** BR-CASH-001\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should support an explicit handover model where one cashier
closes and another opens, without carrying unexplained cash.

**Acceptance:** Cash transfer/float is represented according to policy.

### FR-CSH-041 --- Logout with open shift

**Source:** BR-CASH-001\
**Priority:** MUST\
**Phase:** 2

User logout shall not silently close an open shift.

**Acceptance:** Shift remains open or explicit handover/close is
required.

### FR-CSH-042 --- Restart with open shift

**Source:** BR-OPS-005\
**Priority:** MUST\
**Phase:** 2

Application/service restart shall preserve open shift state and posted
cash movements.

**Acceptance:** Recovery does not create a new shift automatically.

### FR-CSH-043 --- Offline shift operation

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 2

Shift open, local cash movements and close shall work without cloud
while Store Node/database are operational.

**Acceptance:** Cloud loss alone does not break cash accountability.

### FR-CSH-044 --- Shift close retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 2

Retrying shift close after timeout/restart shall not create duplicate
close records/effects.

**Acceptance:** One effective close remains.

### FR-CSH-045 --- Multi-counter separation

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 2

Each counter/shift shall maintain separate accountability while
store-level reports consolidate them.

**Acceptance:** Counter A cash is not mixed into Counter B close.

### FR-CSH-046 --- Business day entity

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

MiniMart shall represent a store business day independently from
calendar date/time.

**Acceptance:** All relevant transactions can be grouped consistently.

### FR-CSH-047 --- Open business day

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Store shall have a defined current business day according to approved
rollover/opening policy.

**Acceptance:** New shifts use correct business date.

### FR-CSH-048 --- Business date rollover

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Business-date rollover behavior shall be explicitly configured/approved
and shall not be inferred solely from midnight.

**Acceptance:** After-midnight trading can be handled deterministically.

### FR-CSH-049 --- One open business day policy

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

MiniMart shall prevent conflicting active business-day states for the
same store except through explicit recovery procedure.

**Acceptance:** Transactions are not split ambiguously.

### FR-CSH-050 --- Day-close prerequisites

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Day close shall validate required shift statuses and unresolved
operational exceptions.

**Acceptance:** Close cannot silently ignore open accountability.

### FR-CSH-051 --- Open shift at day close

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Policy shall define whether open shifts block day close or require
authorized forced exception handling.

**Acceptance:** Behavior is explicit and audited.

### FR-CSH-052 --- Uncertain payment at day close

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 2/3

Unresolved payment/refund states shall be visible and subject to
block/warn policy before day close.

**Acceptance:** Day summary identifies unresolved amounts.

### FR-CSH-053 --- Day sales totals

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Day close shall summarize posted gross/net sales and returns according
to approved reporting definitions.

**Acceptance:** Totals reconcile to posted transactions.

### FR-CSH-054 --- Day tender totals

**Source:** BR-CASH-004\
**Priority:** MUST\
**Phase:** 2

Day close shall summarize confirmed tenders and refunds by tender type.

**Acceptance:** Totals reconcile to shift/source records.

### FR-CSH-055 --- Day cash variance

**Source:** BR-CASH-003\
**Priority:** MUST\
**Phase:** 2

Day close shall consolidate approved shift cash shortages/overages
without erasing individual variances.

**Acceptance:** Store variance traces to shifts.

### FR-CSH-056 --- Day credit totals

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 2

Day close shall include customer-credit sales/collections/adjustments
relevant to the day as separate categories.

**Acceptance:** Credit is not treated as physical cash.

### FR-CSH-057 --- Day purchase exclusion clarity

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Day-close sales/tender totals shall not silently mix unrelated
purchasing transactions unless an explicit cash-payment workflow is
later specified.

**Acceptance:** Report scope is clear.

### FR-CSH-058 --- Day-close review

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Authorized manager shall review day totals and exceptions before posting
close.

**Acceptance:** Review is explicit.

### FR-CSH-059 --- Day-close permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Closing a store business day shall require authorized role.

**Acceptance:** Ordinary cashier cannot close store day unless
permitted.

### FR-CSH-060 --- Day-close posting

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

Posting day close shall create a stable close record based on posted
source transactions and declarations.

**Acceptance:** Source transactions are not rewritten.

### FR-CSH-061 --- Day-close immutability

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 2

Posted day close shall not be edited to force new totals.

**Acceptance:** Late corrections are handled by explicit subsequent
adjustment/reopen policy.

### FR-CSH-062 --- Late transaction policy

**Source:** BR-CASH-005\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Treatment of a legitimate transaction discovered after day close shall
be explicitly defined.

**Acceptance:** Implementation does not silently backdate into closed
day.

### FR-CSH-063 --- Day reopen policy

**Source:** BR-CASH-005\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Whether a closed business day may be formally reopened shall be an
explicit high-control policy decision.

**Acceptance:** No casual reopen exists.

### FR-CSH-064 --- Next business day

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

After successful day close, MiniMart shall establish/allow the next
business day according to approved rollover model.

**Acceptance:** New transactions use correct business date.

### FR-CSH-065 --- Day-close report

**Source:** BR-CASH-005\
**Priority:** MUST\
**Phase:** 2

MiniMart shall produce a store day-close summary with sales, returns,
tenders, cash variances and unresolved exceptions.

**Acceptance:** Report reconciles to close record.

### FR-CSH-066 --- Day-close audit

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 2

Day-close review, approvals, forced exceptions and posting shall be
audited.

**Acceptance:** Manager actions are traceable.

### FR-CSH-067 --- Day-close offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 2

Store day close shall not require cloud if all authoritative local data
are available.

**Acceptance:** Cloud loss alone does not prevent local close.

### FR-CSH-068 --- Day-close retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 2

Retrying day close shall not create duplicate close records or duplicate
downstream effects.

**Acceptance:** One effective close remains.

### FR-CSH-069 --- Closed-day reporting stability

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 2

Later master-data changes shall not rewrite closed-day transaction
meaning.

**Acceptance:** Historical day report remains explainable.

### FR-CSH-070 --- Shift/day timezone

**Source:** BR-LOC-004\
**Priority:** MUST\
**Phase:** 2

Business date and timestamps shall use configured store timezone and
preserve actual event time.

**Acceptance:** Reports distinguish business date from timestamp.

### FR-CSH-071 --- Clock anomaly visibility

**Source:** BR-OPS-005\
**Priority:** SHOULD\
**Phase:** 2

Material device/server clock anomalies should be detectable and surfaced
to authorized users/support.

**Acceptance:** Time issues do not silently corrupt day grouping.

### FR-CSH-072 --- Shift report access

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Shift cash declarations and variance reports shall be restricted to
authorized roles.

**Acceptance:** Sensitive cash information is controlled.

### FR-CSH-073 --- Day report access

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 2

Day-close management reports shall require appropriate authorization.

**Acceptance:** Cashier sees only permitted scope.

### FR-CSH-074 --- Cash variance reporting

**Source:** BR-CASH-003\
**Priority:** MUST\
**Phase:** 2

Management shall be able to report shortages/overages by date, store,
counter and cashier as permitted.

**Acceptance:** Variance trends are visible without changing records.

### FR-CSH-075 --- Shift/day acceptance suite

**Source:** BR-CASH-001, BR-DATA-004\
**Priority:** MUST\
**Phase:** 2

Tests shall cover open float, cash sale/refund/collection, cash-in/out,
blind count, variance approval, restart, multi-counter close, day
rollover and close retry.

**Acceptance:** Cash-control invariants are regression-tested.

## Expected cash model

``` text
Opening float
+ cash sales
+ cash customer collections
+ approved cash-in
- cash refunds
- approved cash-out
= expected cash
```

Actual cash is independently declared/countable. MiniMart reports the
difference; it never silently forces the drawer to balance.

## Business-day principle

A store business date is explicit and may differ from calendar date for
after-midnight trading. Exact rollover/reopen/late-transaction policy
remains a decision gate.
