# MiniMart FRS Batch 4 --- Cross-Module Acceptance Scenarios v0.5

**Document ID:** MM-FRS-B4-ACCEPT-001\
**Status:** Working Draft

These scenarios connect Customers, Customer Credit, POS/Payments,
Cashier Shift, Day Close and Reporting.

## AC-B4-001 --- Anonymous cash sale

**Given** an open eligible shift and a normal walk-in customer\
**When** cashier completes a cash sale without selecting a customer\
**Then** sale succeeds and MiniMart does not force creation of a
customer record.

## AC-B4-002 --- Credit sale requires identified eligible customer

**Given** a sale with Customer Credit tender selected\
**When** no eligible identified customer is attached\
**Then** MiniMart blocks the credit tender without affecting other sale
lines/tenders.

## AC-B4-003 --- Credit sale within limit

**Given** a customer with sufficient available credit\
**When** a credit sale posts\
**Then** only the posted credit amount increases customer outstanding
exactly once.

## AC-B4-004 --- Concurrent credit-limit check

**Given** two counters attempt credit sales for the same customer near
the credit limit\
**When** both post concurrently\
**Then** authoritative posting revalidation enforces the configured
limit/override policy.

## AC-B4-005 --- Split cash + customer credit

**Given** a sale of 1,000 and an eligible customer\
**When** 300 is settled by cash and 700 by customer credit\
**Then** shift cash increases by 300 and customer outstanding increases
by 700.

## AC-B4-006 --- Return against credit sale

**Given** a posted credit sale and an eligible return\
**When** goods worth 200 are returned\
**Then** the approved credit/refund policy adjusts customer balance and
stock without rewriting the original sale.

## AC-B4-007 --- Customer collection

**Given** customer outstanding of 700\
**When** an authorized user records a confirmed cash collection of 300\
**Then** outstanding becomes 400 and shift expected cash increases by
300 exactly once.

## AC-B4-008 --- Collection retry after timeout

**Given** a customer collection posting returns an ambiguous client
timeout\
**When** user safely retries\
**Then** MiniMart resolves the original posting and does not reduce
outstanding or increase cash twice.

## AC-B4-009 --- Shift opening float

**Given** an eligible counter with no conflicting active shift\
**When** cashier opens a shift with an opening float of 500\
**Then** expected cash begins at 500 and opening float is auditable.

## AC-B4-010 --- Cash refund during shift

**Given** a posted cash refund of 100\
**When** shift expected cash is recalculated\
**Then** expected cash is reduced by 100 and refund remains linked to
its return.

## AC-B4-011 --- Cash in/out

**Given** an open shift\
**When** authorized cash-in of 200 and cash-out of 50 are posted\
**Then** expected cash changes by +150 and both movements retain
reasons/audit.

## AC-B4-012 --- Blind close with shortage

**Given** store policy uses blind close and expected cash is 8,000\
**When** cashier declares 7,980 before seeing expected cash\
**Then** MiniMart records a -20 variance and does not silently rebalance
it.

## AC-B4-013 --- Variance approval

**Given** shift variance exceeds configured threshold\
**When** cashier attempts close without required manager approval\
**Then** close is blocked until an authorized approver and reason are
recorded.

## AC-B4-014 --- Multi-counter shift close

**Given** Counter 1 and Counter 2 have independent shifts\
**When** each closes\
**Then** each shift reconciles only its own accountable transactions
while store reporting can consolidate both.

## AC-B4-015 --- Business date after midnight

**Given** approved store policy keeps trading under the prior business
date after midnight\
**When** a sale posts at 00:30 calendar time\
**Then** actual timestamp is retained and the approved business date is
assigned separately.

## AC-B4-016 --- Day close with open shift

**Given** a shift remains open\
**When** manager attempts day close\
**Then** MiniMart follows the configured block/forced-exception policy
and never silently ignores the open shift.

## AC-B4-017 --- Day close retry

**Given** day-close posting is interrupted after submission\
**When** manager retries after recovery\
**Then** exactly one effective day-close record exists.

## AC-B4-018 --- Offline shift/day close

**Given** cloud is unavailable but Store Node and store PostgreSQL are
healthy\
**When** cashier closes shift and authorized manager closes the business
day\
**Then** local close succeeds and later synchronization does not
duplicate close records.

## AC-B4-019 --- Daily report reconciliation

**Given** a closed business day\
**When** daily sales/tender/return/shift reports are generated\
**Then** totals reconcile to the same posted source transactions and
documented definitions.

## AC-B4-020 --- Customer statement reconciliation

**Given** credit sales, a return and customer collections\
**When** a statement is generated\
**Then** opening balance + charges - credits - collections + approved
adjustments equals closing balance.

## AC-B4-021 --- Report excludes uncertain payment from confirmed tender

**Given** an electronic payment remains uncertain\
**When** tender summary/day-close report is generated\
**Then** the amount appears as an exception/unresolved state rather than
confirmed tender.

## AC-B4-022 --- PII access/export restriction

**Given** a user without customer-sensitive export permission\
**When** they request a customer report/export\
**Then** restricted personal fields are denied or masked according to
policy.

## AC-B4-023 --- Historical customer edit

**Given** an old posted credit sale\
**When** customer name/contact is later edited\
**Then** the historical document remains understandable and is not
silently rewritten.

## AC-B4-024 --- Closed-day historical stability

**Given** a closed business day\
**When** product/category/customer master data changes later\
**Then** historical reports remain explainable according to documented
historical/current grouping semantics.
