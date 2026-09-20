# MiniMart Payments Core Functional Specification --- v0.4

**Document ID:** MM-FRS-PAY-001\
**Requirement namespace:** `FR-PAY-001`--`FR-PAY-025`\
**Status:** Detailed Working Draft --- Batch 3

## Requirements

### FR-PAY-001 --- Payment amount due

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

Payment workflow shall receive the validated sale amount due from POS.

**Acceptance:** Tendering cannot use a stale payable amount.

### FR-PAY-002 --- Supported tender types

**Source:** BR-PAY-001, BR-PAY-002, BR-PAY-003, BR-PAY-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support configured tender types including cash, card,
QR/digital and customer credit where enabled.

**Acceptance:** Only enabled tenders are selectable.

### FR-PAY-003 --- Tender configuration by store

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

Tender availability and relevant behavior shall be configurable by
store/country policy.

**Acceptance:** Disabled tender cannot be selected.

### FR-PAY-004 --- Tender exact money

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

Tender amounts, change and rounding shall use exact approved monetary
rules.

**Acceptance:** Tender totals reconcile exactly.

### FR-PAY-005 --- Cash tender entry

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to enter cash tendered amount.

**Acceptance:** Amount is validated against permitted precision.

### FR-PAY-006 --- Cash change calculation

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall calculate change due from cash tender using approved
payable/rounding rules.

**Acceptance:** Displayed change matches posted tender.

### FR-PAY-007 --- Cash insufficient amount

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

A single cash tender below remaining due shall not complete the sale
unless split/partial tender workflow is active.

**Acceptance:** Unsettled balance remains explicit.

### FR-PAY-008 --- Cash over-tender

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

Cash over-tender shall be permitted only where change is allowed.

**Acceptance:** Change is calculated and retained.

### FR-PAY-009 --- Cash rounding

**Source:** BR-PAY-001\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1

Cash rounding shall follow the active approved country/tender rule and
be represented separately from item pricing.

**Acceptance:** Rounding is reproducible on receipt/reports.

### FR-PAY-010 --- No rounding invention

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

Core payment shall not invent country-specific cash-rounding increments.

**Acceptance:** Rule comes from approved country configuration.

### FR-PAY-011 --- Cash drawer event

**Source:** BR-PAY-001, BR-HW-003\
**Priority:** MUST\
**Phase:** 1

Applicable cash completion shall request configured cash-drawer action.

**Acceptance:** Drawer failure does not invalidate posted sale.

### FR-PAY-012 --- Cash tender audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Posted cash tender shall retain cashier/counter/sale/time context.

**Acceptance:** Tender is traceable.

### FR-PAY-013 --- Tender cancellation before commit

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

An unconfirmed draft payment component may be cancelled safely before it
becomes a Payment Commitment or posted Tender.

**Acceptance:** No payment effect remains.

### FR-PAY-014 --- Tender immutability after sale posting

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

Posted tender shall not be edited to alter completed sale settlement.

**Acceptance:** Correction uses refund/reversal workflow.

### FR-PAY-015 --- Payment reference

**Source:** BR-PAY-007\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1

Non-cash tenders shall retain permitted external/reference identifiers
needed for reconciliation without storing prohibited sensitive data.

**Acceptance:** Reference is searchable/reconcilable.

### FR-PAY-016 --- Payment status

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

Payment processing shall distinguish at least not-started,
pending/in-progress, successful, failed/cancelled and uncertain where
applicable.

**Acceptance:** POS never collapses uncertain into success.

### FR-PAY-017 --- Failed payment

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

A confirmed failed tender shall not settle the sale.

**Acceptance:** Cashier may retry or choose another tender safely.

### FR-PAY-018 --- Cancelled payment

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

A confirmed cancelled tender shall not settle the sale.

**Acceptance:** No successful payment is recorded.

### FR-PAY-019 --- Payment timeout

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

A timeout without authoritative result shall become an uncertain/pending
resolution state rather than automatic failure/success.

**Acceptance:** Duplicate charge risk is controlled.

### FR-PAY-020 --- Tender retry protection

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

Retry logic shall not create a second successful tender for the same
intended payment merely because the first response was lost.

**Acceptance:** Resolution checks prior attempt.

### FR-PAY-021 --- Payment permissions

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Sensitive tender operations, manual confirmation, cancellation and
refund shall require applicable permissions.

**Acceptance:** Unauthorized action is blocked.

### FR-PAY-022 --- Payment audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Material payment state changes and manual confirmations shall be
auditable.

**Acceptance:** Actor, tender, sale and reason are traceable.

### FR-PAY-023 --- Payment offline behavior

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Tender behavior while internet is unavailable shall depend on tender
capability: local cash remains usable; cloud-dependent tender may be
limited/blocked/pending according to provider integration.

**Acceptance:** POS states limitation explicitly.

### FR-PAY-024 --- Payment reconciliation data

**Source:** BR-PAY-007\
**Priority:** MUST\
**Phase:** 2

MiniMart shall retain sufficient non-sensitive tender information for
shift/day/provider reconciliation.

**Acceptance:** Tender totals and references can be compared.

### FR-PAY-025 --- No prohibited card data storage

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

MiniMart shall not store full PAN or other prohibited sensitive payment
credentials in ordinary application data.

**Acceptance:** Receipt/log/database output excludes prohibited values.

## Payment-state principle

A payment result is never guessed. A tender is either clearly
uncommitted, successful, failed/cancelled, or unresolved/uncertain
according to its integration capability.
