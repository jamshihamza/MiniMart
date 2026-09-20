# MiniMart Customer Management Functional Specification --- v0.5

**Document ID:** MM-FRS-CUS-001\
**Requirement namespace:** `FR-CUS-001`--`FR-CUS-045`\
**Status:** Detailed Working Draft --- Batch 4

## Purpose

Define lightweight retail customer identity and history without turning
MiniMart into a CRM.

## Requirements

### FR-CUS-001 --- Walk-in sale without customer

**Source:** BR-CUS-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall allow an ordinary cash sale without creating or selecting
a customer record.

**Acceptance:** Cashier can complete an eligible cash sale with no
customer attached.

### FR-CUS-002 --- Create customer

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create a customer record when business
need requires identification.

**Acceptance:** A stable customer identity is created after validation.

### FR-CUS-003 --- Customer code

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

Each customer shall have a stable MiniMart customer identifier and may
have a human-readable customer code.

**Acceptance:** Customer can be referenced without relying on name or
phone.

### FR-CUS-004 --- Customer type

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should distinguish configured customer types such as individual
and business where operationally useful.

**Acceptance:** Type drives only approved fields/rules.

### FR-CUS-005 --- Customer name

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

Customer record shall support the name required for operational
identification.

**Acceptance:** Required name validation is enforced.

### FR-CUS-006 --- Contact details

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1

Customer record may store approved phone, email and address fields where
needed.

**Acceptance:** Optional contact data is not required for walk-in cash
sale.

### FR-CUS-007 --- Business/tax identity

**Source:** BR-CUS-003\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 2

Customer record shall support approved business/tax identifiers required
by invoicing or country rules.

**Acceptance:** Core module does not invent country-specific formats.

### FR-CUS-008 --- Customer search

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to search customers by permitted
identifiers and contact fields.

**Acceptance:** Correct customer can be selected efficiently.

### FR-CUS-009 --- Duplicate detection

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall warn or block likely duplicate customer creation using
approved matching fields.

**Acceptance:** User is not silently allowed to create obvious duplicate
identity.

### FR-CUS-010 --- Duplicate override

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1

Where duplicate creation is legitimately required, authorized user may
proceed with reason according to policy.

**Acceptance:** Exception is auditable.

### FR-CUS-011 --- Edit customer

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to update mutable customer profile
fields.

**Acceptance:** Changes do not rewrite historical posted documents.

### FR-CUS-012 --- Deactivate customer

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to deactivate a customer without deleting
historical transactions.

**Acceptance:** Inactive customer remains available for history.

### FR-CUS-013 --- Reactivate customer

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to reactivate an eligible customer.

**Acceptance:** History and identity are preserved.

### FR-CUS-014 --- No destructive delete with history

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

A customer referenced by posted business records shall not be physically
deleted through ordinary workflow.

**Acceptance:** Historical documents remain interpretable.

### FR-CUS-015 --- Attach customer to sale

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to attach an eligible customer to an unposted sale
when required.

**Acceptance:** Posted sale retains selected customer identity/snapshot
as applicable.

### FR-CUS-016 --- Change customer before payment commitment

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 1

Attached customer may be changed before payment commitment subject to
credit/compliance rules.

**Acceptance:** Dependent eligibility is revalidated.

### FR-CUS-017 --- Credit requires identified customer

**Source:** BR-CUS-003, BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

Customer-credit tender shall require an eligible identified customer.

**Acceptance:** Anonymous customer cannot receive credit.

### FR-CUS-018 --- Statement eligibility

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 2

Customer statements shall be available only for identified customers
with relevant transactions.

**Acceptance:** Statement is tied to one stable customer identity.

### FR-CUS-019 --- Customer transaction history

**Source:** BR-CUS-005\
**Priority:** MUST\
**Phase:** 2

Authorized users shall be able to view relevant sales, returns, credit
and collections for a customer.

**Acceptance:** History is read-only with links to source documents.

### FR-CUS-020 --- Customer balance visibility

**Source:** BR-CUS-003\
**Priority:** MUST\
**Phase:** 2

Where customer credit is enabled, authorized users shall see current
outstanding/available credit information from the Credit module.

**Acceptance:** Customer master does not independently calculate a
conflicting balance.

### FR-CUS-021 --- Customer notes

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1

Authorized users may record non-sensitive operational notes subject to
access policy.

**Acceptance:** Notes are attributable and do not alter financial
history.

### FR-CUS-022 --- Customer status

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1

Customer shall have explicit operational status such as active/inactive
and credit eligibility shall be separately controlled.

**Acceptance:** Deactivation prevents new use according to policy.

### FR-CUS-023 --- Company-wide customer identity

**Source:** BR-CUS-001\
**Priority:** MUST\
**Phase:** 1/2

Customer identity shall be company/tenant-wide. A customer may retain
originating/preferred-store metadata, but the same Customer identity may
be referenced by multiple stores subject to privacy/permission rules.

Automatic duplicate merge remains a later controlled capability.

**Acceptance:** Multi-store growth does not require cloning the same
customer solely because a transaction occurs at another store.

### FR-CUS-024 --- Customer merge decision gate

**Source:** BR-CUS-001\
**Priority:** LATER\
**Phase:** 3+

MiniMart may later support controlled duplicate-customer merge, but
ordinary editing shall not merge identities implicitly.

**Acceptance:** No Phase-1 hidden merge behavior exists.

### FR-CUS-025 --- Import boundary

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 2

Customer bulk import shall use Import/Export validation rules and
customer duplicate controls.

**Acceptance:** Invalid rows do not silently create customers.

### FR-CUS-026 --- Export boundary

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 2

Customer export shall require authorization and privacy-aware field
selection.

**Acceptance:** Sensitive fields are not exported by default without
permission.

### FR-CUS-027 --- Minimum data collection

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall collect only customer data needed for approved business
purposes.

**Acceptance:** Optional profile fields are not mandatory without
business need.

### FR-CUS-028 --- PII access control

**Source:** BR-CUS-004, BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Customer personal information shall be visible only to roles that need
it.

**Acceptance:** Cashier access can be more limited than administrator
access.

### FR-CUS-029 --- PII in logs

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 1

Application logs and diagnostics shall avoid unnecessary customer
personal information.

**Acceptance:** Routine technical logs do not expose full customer
profile.

### FR-CUS-030 --- PII in support bundle

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 2

Support diagnostics shall minimize or mask customer personal data unless
explicitly authorized for a case.

**Acceptance:** Diagnostic export is privacy-aware.

### FR-CUS-031 --- Customer audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Creation, material profile changes, deactivation and credit-control
changes shall be auditable.

**Acceptance:** Actor/time/change are traceable.

### FR-CUS-032 --- Historical customer snapshot

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1/2

Posted documents shall retain enough historical customer meaning that
later profile edits do not rewrite prior invoices/sales.

**Acceptance:** Old document remains understandable.

### FR-CUS-033 --- Offline customer lookup

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Locally available customer lookup shall work without cloud while Store
Node/database are operational.

**Acceptance:** Internet loss alone does not block eligible customer
selection.

### FR-CUS-034 --- Offline customer creation

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Authorized local customer creation shall be possible without cloud when
required for local transaction processing.

**Acceptance:** Created identity is safely synchronized later.

### FR-CUS-035 --- Offline duplicate handling

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/3

MiniMart shall define safe duplicate-resolution behavior for customers
independently created at disconnected branches/stores.

**Acceptance:** Synchronization does not silently merge unrelated
people.

### FR-CUS-036 --- Customer concurrency

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Concurrent edits shall not silently overwrite material customer changes.

**Acceptance:** Conflict is prevented or made explicit.

### FR-CUS-037 --- Phone normalization boundary

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1/2

Customer contact normalization shall be country/configuration aware and
shall not invent invalid universal assumptions.

**Acceptance:** Search can use approved normalized form.

### FR-CUS-038 --- Email validation

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1

If email is supplied, MiniMart should perform reasonable format
validation without claiming deliverability.

**Acceptance:** Invalid format is identified.

### FR-CUS-039 --- Address structure

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1/2

Address storage shall support country-appropriate structured/free-form
fields without forcing one country's layout globally.

**Acceptance:** Country pack may extend validation.

### FR-CUS-040 --- Customer communication consent boundary

**Source:** BR-CUS-004\
**Priority:** LATER

**Verification Gate:** Country-specific verification required\
**Phase:** 3+

Any marketing/communication consent feature shall be explicitly
specified and legally validated before use.

**Acceptance:** Customer master does not imply marketing consent.

### FR-CUS-041 --- Loyalty separation

**Source:** BR-CUS-005\
**Priority:** LATER\
**Phase:** 5

Loyalty points/membership benefits shall remain a separate later
capability and shall not be inferred from customer creation.

**Acceptance:** Phase-1 customer works without loyalty.

### FR-CUS-042 --- CRM separation

**Source:** BR-CUS-005\
**Priority:** LATER\
**Phase:** 5

Campaigns, lead management and advanced CRM are outside this FRS batch.

**Acceptance:** Customer module remains retail-operational.

### FR-CUS-043 --- Customer lookup performance

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 1

Customer search should remain responsive for expected store datasets.

**Acceptance:** Benchmark criteria are defined before performance
sign-off.

### FR-CUS-044 --- Customer data retention decision

**Source:** BR-CUS-004\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Retention/anonymization rules shall be defined before production privacy
baseline and shall respect legal/accounting retention constraints.

**Acceptance:** No implementation agent chooses retention period.

### FR-CUS-045 --- Customer acceptance suite

**Source:** BR-CUS-001, BR-CUS-004\
**Priority:** MUST\
**Phase:** 1/2

Tests shall cover anonymous cash sale, customer creation/search,
duplicate warning, deactivation, offline use, history preservation and
PII authorization.

**Acceptance:** Customer invariants are regression-tested.

## Boundary

``` text
Walk-in cash sale → customer optional
Credit / statement / identified invoice use case → customer required
```

Loyalty, campaigns and advanced CRM remain later scope.
