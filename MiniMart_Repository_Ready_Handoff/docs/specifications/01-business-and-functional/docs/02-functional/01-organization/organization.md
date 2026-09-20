# MiniMart Organization, Store and Counter Functional Specification --- v0.2

**Document ID:** MM-FRS-ORG-001\
**Requirement prefix:** `FR-ORG`\
**Status:** Detailed Working Draft --- Batch 1\
**Parent:** `../FRS.md`\
**Primary BRD sources:** `BR-BIZ-002`, `BR-OPS-002`, `BR-OPS-003`,
`BR-LOC-004`, `BO-006`, `BO-009`

## 1. Purpose

Define the functional behaviour used to represent a MiniMart business,
its stores/branches, counters, business context and store-level
configuration.

This document defines business behaviour only. It does not define
database tables, API routes, service classes, or UI components.

## 2. Actors

-   `ACT-001` Business Owner
-   `ACT-002` Administrator
-   `ACT-003` Store Manager
-   `ACT-009` Support Technician --- diagnostic access only where
    authorized

## 3. Scope

### In scope

-   company profile;
-   store/branch profile;
-   counter registration;
-   active/inactive status;
-   store/counter identity;
-   country/currency/timezone/language configuration;
-   business date context;
-   receipt/business identity settings;
-   store-level operational settings;
-   counter assignment and status;
-   multi-counter consistency;
-   configuration audit.

### Out of scope

-   tenant database implementation;
-   cloud provisioning mechanics;
-   licensing implementation;
-   tax calculation rules;
-   user/role definition;
-   hardware-driver implementation;
-   detailed document-number algorithms.

## 4. Functional Requirements

### FR-ORG-001 --- Company profile

**Source:** BR-BIZ-002, BR-OPS-003\
**Priority:** MUST\
**Phase:** 1\
**Actors:** ACT-001, ACT-002

MiniMart shall maintain an identifiable company/business profile used as
the parent context for stores/branches.

**Acceptance criteria** - An authorized administrator can
create/configure the initial company profile. - Business transactions
can be associated with the configured company. - Company identity
remains available to historical documents even after later profile
changes.

### FR-ORG-002 --- Company business identity

**Source:** BR-OPS-003\

**Priority:** MUST\
**Phase:** 1

The company profile shall support business identity information required
for operational documents, such as legal/trading name and applicable
registration/tax identifiers.

Country-specific mandatory fields are defined by country specifications.

**Acceptance:** A functional test demonstrates the stated behavior: The
company profile shall support business identity information required for
operational documents, such as legal/trading name and applicable
registration/tax identifiers.

### FR-ORG-003 --- Company activation state

**Source:** BR-OPS-003\

**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish an active company configuration from a
disabled/non-operational configuration.

Disabling the company shall require elevated authorization and shall not
delete historical transactions.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall distinguish an active company configuration from a
disabled/non-operational configuration.

### FR-ORG-004 --- Store/branch creation

**Source:** BR-BIZ-002\
**Priority:** MUST\
**Phase:** 1\
**Actors:** ACT-001, ACT-002

Authorized users shall be able to define one or more stores/branches
under the company.

Phase 1 must support at least one store and must not prevent future
multi-branch use.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to define one or more stores/branches
under the company.

### FR-ORG-005 --- Store identity

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

Each store shall have a stable identity independent of its display name.

Renaming a store shall not change the historical identity of
transactions already associated with it.

**Acceptance:** A functional test demonstrates the stated behavior: Each
store shall have a stable identity independent of its display name.

### FR-ORG-006 --- Store profile

**Source:** BR-OPS-002, BR-OPS-003\

**Priority:** MUST\
**Phase:** 1

A store profile shall support operational information such as store
name, address/contact information, receipt identity information, and
applicable local configuration.

**Acceptance:** A functional test demonstrates the stated behavior: A
store profile shall support operational information such as store name,
address/contact information, receipt identity information, and
applicable local configuration.

### FR-ORG-007 --- Store activation/deactivation

**Source:** BR-OPS-002\

**Priority:** MUST\
**Phase:** 1

An authorized administrator shall be able to deactivate a store that is
no longer operational.

A store with historical transactions shall not be destructively deleted
through ordinary administration.

**Acceptance:** A functional test demonstrates the stated behavior: An
authorized administrator shall be able to deactivate a store that is no
longer operational.

### FR-ORG-008 --- Country assignment

**Source:** BO-006\
**Priority:** MUST\
**Phase:** 1

Each operational store shall have an applicable country
configuration/country pack.

Changing the country of an already trading store shall be treated as a
controlled administrative operation and shall not reinterpret historical
posted transactions.

**Acceptance:** A functional test demonstrates the stated behavior: Each
operational store shall have an applicable country configuration/country
pack.

### FR-ORG-009 --- Currency context

**Source:** BR-LOC-004\
**Priority:** MUST\
**Phase:** 1

Each store shall have a configured operating currency appropriate to its
country/business setup.

Historical posted documents shall retain their original monetary meaning
if configuration later changes.

**Acceptance:** A functional test demonstrates the stated behavior: Each
store shall have a configured operating currency appropriate to its
country/business setup.

### FR-ORG-010 --- Timezone

**Source:** BR-LOC-004, BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

Each store shall have an explicit timezone used for business-date and
user-facing local-time interpretation.

**Acceptance:** A functional test demonstrates the stated behavior: Each
store shall have an explicit timezone used for business-date and
user-facing local-time interpretation.

### FR-ORG-011 --- Default language

**Source:** BR-LOC-001, BR-LOC-004\
**Priority:** MUST\
**Phase:** 1

A store shall have a default user/customer-facing language
configuration, subject to installed country/language support.

Per-user language selection may be added by the IAM/UI specifications.

**Acceptance:** A functional test demonstrates the stated behavior: A
store shall have a default user/customer-facing language configuration,
subject to installed country/language support.

### FR-ORG-012 --- Business date

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall identify the business date to which store transactions
belong.

The exact rollover policy remains configurable/open until
cashier/day-close requirements are finalized.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall identify the business date to which store transactions
belong.

### FR-ORG-013 --- Business-date visibility

**Source:** BR-CASH-005\

**Priority:** MUST\
**Phase:** 1

Where the effective business date differs from the calendar date or is
operationally important, MiniMart shall make the active business date
visible to authorized users.

**Acceptance:** A functional test demonstrates the stated behavior:
Where the effective business date differs from the calendar date or is
operationally important, MiniMart shall make the active business date
visible to authorized users.

### FR-ORG-014 --- Counter registration

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 1\
**Actors:** ACT-002

Each POS counter shall be registered to a store before it can perform
protected store transactions.

**Acceptance:** A functional test demonstrates the stated behavior: Each
POS counter shall be registered to a store before it can perform
protected store transactions.

### FR-ORG-015 --- Counter identity

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

Each counter shall have a stable counter identity and a human-readable
counter name/number.

Renaming a counter shall not alter historical transaction attribution.

**Acceptance:** A functional test demonstrates the stated behavior: Each
counter shall have a stable counter identity and a human-readable
counter name/number.

### FR-ORG-016 --- Counter activation/deactivation

**Source:** BR-OPS-002\

**Priority:** MUST\
**Phase:** 1

Authorized administrators shall be able to activate/deactivate counters.

A deactivated counter shall not initiate new protected transactions but
historical records shall remain available.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized administrators shall be able to activate/deactivate counters.

### FR-ORG-017 --- Counter/store binding

**Source:** BR-OPS-002, BR-OPS-003\

**Priority:** MUST\
**Phase:** 1

A counter shall operate in the context of its assigned store.

Changing a counter's store assignment shall be a controlled operation
and shall not reassign historical transactions.

**Acceptance:** A functional test demonstrates the stated behavior: A
counter shall operate in the context of its assigned store.

### FR-ORG-018 --- Counter uniqueness within store

**Source:** BR-OPS-002\

**Priority:** MUST\
**Phase:** 1

MiniMart shall prevent ambiguous active counter identification within a
store.

The exact technical identifier format is deferred to the
data/architecture specifications.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall prevent ambiguous active counter identification within a
store.

### FR-ORG-019 --- Counter operational status

**Source:** BR-OPS-002\

**Priority:** SHOULD\
**Phase:** 1

Authorized users/support personnel shall be able to determine whether a
registered counter is active and recently connected/operational where
such status information is available.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users/support personnel shall be able to determine whether a
registered counter is active and recently connected/operational where
such status information is available.

### FR-ORG-020 --- Multi-counter shared store context

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 1

All active counters in the same store shall use the same authoritative
store configuration for business-critical rules that must be consistent
across counters.

**Acceptance:** A functional test demonstrates the stated behavior: All
active counters in the same store shall use the same authoritative store
configuration for business-critical rules that must be consistent across
counters.

### FR-ORG-021 --- Store setting scope

**Source:** BR-OPS-003\

**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish settings that apply company-wide, store-wide,
and counter-specific where required.

A more specific setting shall not silently override a higher-level
business rule unless the setting is explicitly designed to be
overridable.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall distinguish settings that apply company-wide, store-wide,
and counter-specific where required.

### FR-ORG-022 --- Configuration validation

**Source:** BR-DATA-005\

**Priority:** MUST\
**Phase:** 1

MiniMart shall prevent a store/counter from being marked operational
when mandatory configuration required for its current country/phase is
missing.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall prevent a store/counter from being marked operational
when mandatory configuration required for its current country/phase is
missing.

### FR-ORG-023 --- Configuration change audit

**Source:** BR-AUD-001, BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Changes to material company/store/counter configuration shall be
auditable, including actor, time, affected setting and meaningful
before/after values where appropriate.

**Acceptance:** A functional test demonstrates the stated behavior:
Changes to material company/store/counter configuration shall be
auditable, including actor, time, affected setting and meaningful
before/after values where appropriate.

### FR-ORG-024 --- Historical configuration meaning

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Changes to store identity, receipt settings, currency presentation,
language, or similar master configuration shall not make historical
posted documents misleading.

**Acceptance:** A functional test demonstrates the stated behavior:
Changes to store identity, receipt settings, currency presentation,
language, or similar master configuration shall not make historical
posted documents misleading.

### FR-ORG-025 --- Store receipt identity

**Source:** BR-LOC-004\

**Priority:** MUST\
**Phase:** 1

MiniMart shall support the business identity information needed on
receipts and operational documents.

Country-specific mandatory receipt content is defined in the applicable
country specification.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support the business identity information needed on
receipts and operational documents.

### FR-ORG-026 --- Store contact information

**Source:** BR-OPS-003\

**Priority:** SHOULD\
**Phase:** 1

Store address, telephone and other configured contact information shall
be available for use on customer/supplier-facing documents where
required.

**Acceptance:** A functional test demonstrates the stated behavior:
Store address, telephone and other configured contact information shall
be available for use on customer/supplier-facing documents where
required.

### FR-ORG-027 --- Operational configuration availability offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Configuration required for ordinary local store operation shall remain
available when internet/cloud connectivity is unavailable.

**Acceptance:** A functional test demonstrates the stated behavior:
Configuration required for ordinary local store operation shall remain
available when internet/cloud connectivity is unavailable.

### FR-ORG-028 --- Store Node association

**Source:** BR-OPS-001, BR-OPS-002\

**Priority:** MUST\
**Phase:** 1

A store shall have an identifiable local store-service context used by
its counters/back-office operation.

The deployment and networking mechanism is an architecture concern.

**Acceptance:** A functional test demonstrates the stated behavior: A
store shall have an identifiable local store-service context used by its
counters/back-office operation.

### FR-ORG-029 --- Unsupported country configuration

**Source:** BR-LOC-004\

**Priority:** MUST\
**Phase:** 1

MiniMart shall not silently treat an unsupported country as though
another country's tax/compliance rules apply.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall not silently treat an unsupported country as though
another country's tax/compliance rules apply.

### FR-ORG-030 --- Organization setup completion

**Source:** BR-BIZ-002, BR-OPS-002\

**Priority:** MUST\
**Phase:** 1

MiniMart shall provide a determinable state indicating whether minimum
company/store/counter configuration required to begin store operations
is complete.

## 5. Main Workflows

### WF-ORG-001 --- Initial store setup

1.  Administrator creates/configures company.
2.  Administrator creates store.
3.  Country, currency, timezone and default language are selected.
4.  Required store identity/receipt information is entered.
5.  At least one counter is registered.
6.  MiniMart validates mandatory configuration.
7.  Store is marked ready for subsequent user/catalog setup.

### WF-ORG-002 --- Add another counter

1.  Administrator selects store.
2.  Creates/registers counter.
3.  Assigns human-readable counter name/number.
4.  System validates uniqueness/required settings.
5.  Counter becomes available for authorized activation/use.

## 6. Failure / Offline Behaviour

-   Internet/cloud loss shall not remove the locally required
    company/store/counter context.
-   If mandatory store configuration cannot be loaded from the Store
    Node, protected posting shall be blocked safely.
-   A configuration conflict must not be silently resolved by an
    arbitrary counter.

## 7. Open Decisions

-   Exact business-date rollover policy.
-   Whether branch/store numbering is user-defined, system-generated, or
    both.
-   Exact receipt-number/document-number scope by company/store/counter.
-   Whether a store can support multiple operating currencies in a later
    phase.
-   Exact counter enrollment/re-enrollment procedure.
-   Licensing relationship to company/store/counter limits.

## 8. Traceability Summary

`BR-BIZ-002 → FR-ORG-004, 005`\
`BR-OPS-002 → FR-ORG-014 through 020`\
`BR-OPS-003 → FR-ORG-001, 005, 010, 012, 015`\
`BR-LOC-004 → FR-ORG-009 through 011`\
`BO-006 → FR-ORG-008, 029`\
`BO-009 → FR-ORG-004, 020`

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall provide a determinable state indicating whether minimum
company/store/counter configuration required to begin store operations
is complete.
