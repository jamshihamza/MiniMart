# MiniMart Common Functional Foundation --- v0.1

**Document ID:** MM-FRS-COM-001\
**Parent:** `../FRS.md`\
**Status:** Working Draft\
**Scope:** Cross-cutting functional rules used by all MiniMart modules

## 1. Purpose

This document defines common functional behaviour so that Catalog,
Purchasing, Inventory, POS, Payments and later modules do not
independently invent conflicting rules.

## 2. Terminology

-   **Company** --- the business entity operating one or more
    stores/branches.
-   **Store / Branch** --- a retail operating location.
-   **Counter** --- a checkout terminal or registered POS operating
    point.
-   **Store Node** --- the local MiniMart store service used by
    counters/back office.
-   **Business document** --- a business record such as GRN, sale,
    return or adjustment.
-   **Draft** --- editable, not yet posted.
-   **Posted** --- business effect committed and treated as historical.
-   **Reversal / correction** --- a new business record that offsets or
    corrects a posted document.
-   **Manager override** --- explicit approval by an authorized second
    actor or authorized manager action.
-   **Cloud unavailable** --- local store services remain available but
    internet/cloud services cannot be reached.
-   **Store service unavailable** --- Store Node and/or its required
    local database cannot serve the operation.

## 3. Common requirements

### FR-COM-001 --- Authenticated actor

**Source:** BR-SEC-001\
**Priority:** MUST\
**Phase:** 1\
**Actors:** All internal users

MiniMart shall associate protected business actions with an
authenticated user or explicitly approved system identity.

**Acceptance criteria** - A protected action cannot be posted without an
identifiable actor. - Completed business documents retain the actor
identity relevant to the action.

### FR-COM-002 --- Business context

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall associate business transactions with the relevant
company, store/branch, operational origin/counter where applicable, user
and business date/time.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall associate business transactions with the relevant
company, store/branch, operational origin/counter where applicable, user
and business date/time.

### FR-COM-003 --- Draft document

**Source:** BR-DATA-002\

**Priority:** MUST\
**Phase:** 1

Where a business process supports drafts, a draft may be edited without
creating the final financial or stock effect.

Draft behaviour may differ by module and must be specified by that
module.

**Acceptance:** A functional test demonstrates the stated behavior:
Where a business process supports drafts, a draft may be edited without
creating the final financial or stock effect.

### FR-COM-004 --- Posting

**Source:** BR-DATA-001, BR-DATA-005\
**Priority:** MUST\
**Phase:** 1

Posting a business document shall either complete the defined business
effects together or fail without leaving an apparently successful
partial document.

The technical transaction mechanism is defined later by
architecture/data specifications.

**Acceptance:** A functional test demonstrates the stated behavior:
Posting a business document shall either complete the defined business
effects together or fail without leaving an apparently successful
partial document.

### FR-COM-005 --- Posted document immutability

**Source:** BR-DATA-001, BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall not permit ordinary editing of a posted financial or
stock-affecting document in a way that silently changes its historical
economic effect.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall not permit ordinary editing of a posted financial or
stock-affecting document in a way that silently changes its historical
economic effect.

### FR-COM-006 --- Correction by explicit business action

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

When a posted document requires correction, MiniMart shall use an
explicit reversal, return, cancellation/correction document, or other
defined compensating business process.

The original document must remain traceable.

**Acceptance:** A functional test demonstrates the stated behavior: When
a posted document requires correction, MiniMart shall use an explicit
reversal, return, cancellation/correction document, or other defined
compensating business process.

### FR-COM-007 --- Permission check

**Source:** BR-SEC-002, BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall check the current user's authorization before performing
protected operations.

A denied operation must not create its protected business effect.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall check the current user's authorization before performing
protected operations.

### FR-COM-008 --- Manager approval

**Source:** BR-SEC-004\
**Priority:** MUST\
**Phase:** 1

Where policy requires manager/supervisor approval, MiniMart shall retain
both the initiating user and approving user.

Approval shall not require the initiating user to sign out and
impersonate the approver.

**Acceptance:** A functional test demonstrates the stated behavior:
Where policy requires manager/supervisor approval, MiniMart shall retain
both the initiating user and approving user.

### FR-COM-009 --- Approval reason

**Source:** BR-SEC-004, BR-AUD-002\

**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support requiring a reason for configured high-risk
approvals such as price overrides, excessive discounts, returns without
original sale, or stock adjustments.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support requiring a reason for configured high-risk
approvals such as price overrides, excessive discounts, returns without
original sale, or stock adjustments.

### FR-COM-010 --- Audit of privileged action

**Source:** BR-AUD-001 through BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall create an audit record for configured privileged or
sensitive actions.

Audit information shall include, where relevant, actor, approver,
action, time, operational origin, affected record/document, reason and
meaningful before/after values.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall create an audit record for configured privileged or
sensitive actions.

### FR-COM-011 --- User-visible failure

**Source:** BR-DATA-005\
**Priority:** MUST\
**Phase:** 1

When an operation fails, MiniMart shall provide a clear user-visible
result and shall not falsely display the operation as completed.

**Acceptance:** A functional test demonstrates the stated behavior: When
an operation fails, MiniMart shall provide a clear user-visible result
and shall not falsely display the operation as completed.

### FR-COM-012 --- Safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Retrying a business-critical operation after timeout, restart or
communication failure shall not silently create duplicate financial or
stock effects.

**Acceptance:** A functional test demonstrates the stated behavior:
Retrying a business-critical operation after timeout, restart or
communication failure shall not silently create duplicate financial or
stock effects.

### FR-COM-013 --- Uncertain status

**Source:** BR-PAY-006, BR-DATA-005\
**Priority:** MUST\
**Phase:** 1

If MiniMart cannot safely determine whether an external financial action
succeeded, it shall represent the operation as requiring
recovery/reconciliation rather than automatically repeating it.

**Acceptance:** A functional test demonstrates the stated behavior: If
MiniMart cannot safely determine whether an external financial action
succeeded, it shall represent the operation as requiring
recovery/reconciliation rather than automatically repeating it.

### FR-COM-014 --- Internet/cloud unavailable

**Source:** BR-OPS-001, BR-POS-010\
**Priority:** MUST\
**Phase:** 1

When internet/cloud connectivity is unavailable but the local Store Node
and store database are operational, MiniMart shall continue defined
local store operations.

Cloud-unavailable status shall be visible without unnecessarily
interrupting checkout.

**Acceptance:** A functional test demonstrates the stated behavior: When
internet/cloud connectivity is unavailable but the local Store Node and
store database are operational, MiniMart shall continue defined local
store operations.

### FR-COM-015 --- Store service unavailable

**Source:** BR-OPS-001, BR-DATA-005\

**Priority:** MUST\
**Phase:** 1

When the required local Store Node/store database is unavailable,
MiniMart shall prevent unsafe posting and clearly indicate that local
store service is unavailable.

A later survival-mode phase may define limited terminal-local operation.

**Acceptance:** A functional test demonstrates the stated behavior: When
the required local Store Node/store database is unavailable, MiniMart
shall prevent unsafe posting and clearly indicate that local store
service is unavailable.

### FR-COM-016 --- Recovery after application restart

**Source:** BR-OPS-005, BR-REL-001\
**Priority:** MUST\
**Phase:** 1

A business document already confirmed as successfully posted shall
remain available after POS/back-office application restart.

**Acceptance:** A functional test demonstrates the stated behavior: A
business document already confirmed as successfully posted shall remain
available after POS/back-office application restart.

### FR-COM-017 --- Duplicate user command protection

**Source:** BR-DATA-004\

**Priority:** MUST\
**Phase:** 1

Rapid repeated activation of a posting/payment command shall not create
duplicate business documents or duplicate tender effects.

**Acceptance:** A functional test demonstrates the stated behavior:
Rapid repeated activation of a posting/payment command shall not create
duplicate business documents or duplicate tender effects.

### FR-COM-018 --- Multi-counter conflict

**Source:** BR-OPS-002, BR-POS-007\
**Priority:** MUST\
**Phase:** 1

MiniMart shall detect or prevent conflicting multi-counter actions where
simultaneous completion would create invalid business state.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall detect or prevent conflicting multi-counter actions where
simultaneous completion would create invalid business state.

### FR-COM-019 --- Held-document ownership/concurrency

**Source:** BR-POS-007\
**Priority:** MUST\
**Phase:** 1

A held sale may be visible/retrievable according to store policy, but
two counters shall not be able to complete the same held sale.

**Acceptance:** A functional test demonstrates the stated behavior: A
held sale may be visible/retrievable according to store policy, but two
counters shall not be able to complete the same held sale.

### FR-COM-020 --- Business date/time

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall retain sufficient date/time information to identify when
a business action occurred and the business date to which it belongs.

Exact timezone/storage representation is defined later.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall retain sufficient date/time information to identify when
a business action occurred and the business date to which it belongs.

### FR-COM-021 --- Document numbering

**Source:** BR-DATA-001\

**Priority:** MUST\
**Phase:** 1

Business documents that require human-facing numbers shall receive
numbers according to configured business/country rules.

Internal technical identifiers and human-facing document numbers may be
different concepts.

**Acceptance:** A functional test demonstrates the stated behavior:
Business documents that require human-facing numbers shall receive
numbers according to configured business/country rules.

### FR-COM-022 --- Search and selection

**Source:** BR-CAT-007\

**Priority:** MUST\
**Phase:** 1

Where a workflow requires selecting a product, supplier, customer or
document, MiniMart shall provide a practical search/selection mechanism
suitable for the expected data volume.

**Acceptance:** A functional test demonstrates the stated behavior:
Where a workflow requires selecting a product, supplier, customer or
document, MiniMart shall provide a practical search/selection mechanism
suitable for the expected data volume.

### FR-COM-023 --- Deactivation over destructive deletion

**Source:** BR-DATA-007\

**Priority:** SHOULD\
**Phase:** 1

Master records referenced by historical business transactions should
normally be deactivated rather than destructively deleted.

Module specifications shall define any exceptions.

**Acceptance:** A functional test demonstrates the stated behavior:
Module specifications shall define any exceptions.

### FR-COM-024 --- Historical meaning

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Changes to current master data shall not make historical posted
transactions misleading. Posted documents must retain the business
values necessary to understand the original transaction.

**Acceptance:** A functional test demonstrates the stated behavior:
Changes to current master data shall not make historical posted
transactions misleading. Posted documents must retain the business
values necessary to understand the original transaction.

### FR-COM-025 --- Reason codes

**Source:** BR-AUD-002\

**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support controlled reason codes for business exceptions
such as void, return, stock adjustment, wastage and manager override
where required.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support controlled reason codes for business exceptions
such as void, return, stock adjustment, wastage and manager override
where required.

### FR-COM-026 --- External dependency isolation

**Source:** BR-OPS-001\

**Priority:** MUST\
**Phase:** 1

Failure of a non-critical external dependency shall not invalidate an
otherwise successfully posted local business transaction unless that
dependency is explicitly required to complete the transaction.

**Acceptance:** A functional test demonstrates the stated behavior:
Failure of a non-critical external dependency shall not invalidate an
otherwise successfully posted local business transaction unless that
dependency is explicitly required to complete the transaction.

### FR-COM-027 --- No silent data discard

**Source:** BR-PUR-006, BR-DATA-005\
**Priority:** MUST\
**Phase:** 1

MiniMart shall not silently discard invalid or unprocessed business data
during imports, posting or recovery. Invalid items must be reported or
retained for explicit resolution.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall not silently discard invalid or unprocessed business data
during imports, posting or recovery. Invalid items must be reported or
retained for explicit resolution.

### FR-COM-028 --- Status visibility

**Source:** BR-SUPT-003\

**Priority:** MUST\
**Phase:** 1

Users shall be able to distinguish relevant operational states such as
draft, posted, cancelled/reversed, pending recovery, offline/cloud
unavailable, and failed where those states affect their work.

**Acceptance:** A functional test demonstrates the stated behavior:
Users shall be able to distinguish relevant operational states such as
draft, posted, cancelled/reversed, pending recovery, offline/cloud
unavailable, and failed where those states affect their work.

### FR-COM-029 --- Localization-ready user text

**Source:** BR-LOC-001 through BR-LOC-005\
**Priority:** MUST\
**Phase:** 1

User-facing business labels/messages and customer-facing receipt content
shall be capable of country/language-specific presentation without
changing core business meaning.

**Acceptance:** A functional test demonstrates the stated behavior:
User-facing business labels/messages and customer-facing receipt content
shall be capable of country/language-specific presentation without
changing core business meaning.

### FR-COM-030 --- Country rule isolation

**Source:** BO-006\
**Priority:** MUST\
**Phase:** 1

A country-specific rule shall be identified as country behaviour rather
than silently embedded as a universal MiniMart rule.

## 4. Common acceptance scenarios

### AC-COM-001 --- Posted transaction survives restart

Given a transaction has been confirmed as posted, when the client
application restarts, the transaction remains retrievable and is not
reposted.

### AC-COM-002 --- Internet disconnected

Given Store Node and local database are operational, when internet
access is removed, defined local checkout operations continue and
cloud-unavailable status is visible.

### AC-COM-003 --- Duplicate submit

Given a posting action is in progress, when the user activates the
command repeatedly, only one business effect is created.

### AC-COM-004 --- Unauthorized action

Given a user lacks a required permission, when the protected action is
requested, the action is denied and no protected business effect is
created.

### AC-COM-005 --- Manager override

Given a policy requires manager approval, when an authorized manager
approves, the action records both initiating and approving actors.

### AC-COM-006 --- Two-counter conflict

Given two counters attempt an exclusive action on the same business
document, MiniMart prevents both from completing incompatible results.

## 5. Open common decisions

-   Exact business-date rollover rule.
-   Human document-number format and country/store sequencing.
-   Exact manager-override expiry/session behaviour.
-   Which actions require mandatory reason codes by default.
-   Survival-mode scope when Store Node is unavailable.

**Acceptance:** A functional test demonstrates the stated behavior: A
country-specific rule shall be identified as country behaviour rather
than silently embedded as a universal MiniMart rule.
