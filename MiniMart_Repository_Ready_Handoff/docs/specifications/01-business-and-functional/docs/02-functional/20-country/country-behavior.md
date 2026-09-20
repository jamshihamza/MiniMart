# MiniMart Country Behavior Boundary Functional Specification --- v0.6

**Document ID:** MM-FRS-CTRY-001\
**Requirement namespace:** `FR-CTRY-001`--`FR-CTRY-020`\
**Status:** Detailed Working Draft --- Batch 5

This file defines the **boundary and extension contract**, not current
tax/legal rules.

## Requirements

### FR-CTRY-001 --- Common core

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 1

MiniMart shall use one common retail core with country-specific behavior
supplied through explicit country configuration/pack boundaries.

**Acceptance:** Malaysia and India are not separate application forks.

### FR-CTRY-002 --- Country assignment

**Source:** BO-006\
**Priority:** MUST\
**Phase:** 1

Each store shall have an approved active country context.

**Acceptance:** Country-dependent rules resolve deterministically.

### FR-CTRY-003 --- Country rule-set version identity

**Source:** BO-006\
**Priority:** MUST\
**Phase:** 1/2

Active country behavior shall have a stable version/effective identity
suitable for support, audit and historical interpretation.

Posted documents shall preserve the applicable country context/rule-set
version identity and calculated outcomes needed to prevent later
country-pack updates from reinterpreting historical transactions.

**Acceptance:** Updating a country pack changes future applicable
behavior according to effective rules but does not recalculate a
previously posted document.

### FR-CTRY-004 --- No silent country switch

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Changing store country after trading begins shall be highly controlled
or prohibited due to historical/compliance impact.

**Acceptance:** Historical documents are not reinterpreted silently.

### FR-CTRY-005 --- Country rule isolation

**Source:** BO-006\
**Priority:** MUST\
**Phase:** 1

Tax, invoicing, rounding, identifiers, payment extensions and receipt
rules shall enter through country-specific contracts rather than
scattered core conditionals.

**Acceptance:** Core remains testable/country-neutral.

### FR-CTRY-006 --- Currency configuration

**Source:** BR-LOC-004\
**Priority:** MUST\
**Phase:** 1

Country pack shall define supported default currency/formatting context.

**Acceptance:** Money display uses approved country/store settings.

### FR-CTRY-007 --- Number formatting

**Source:** BR-LOC-004\
**Priority:** MUST\
**Phase:** 1

Country/localization configuration shall define display formatting
without changing stored exact numeric value.

**Acceptance:** Same value is not recalculated by locale.

### FR-CTRY-008 --- Date/time formatting

**Source:** BR-LOC-004\
**Priority:** MUST\
**Phase:** 1

Country/localization configuration shall define approved date/time
display conventions.

**Acceptance:** Display does not change event timestamp/business date.

### FR-CTRY-009 --- UI languages

**Source:** BR-LOC-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support selectable UI localization independent from core
business identities.

**Acceptance:** Changing UI language does not change transaction
meaning.

### FR-CTRY-010 --- Receipt languages/scripts

**Source:** BR-LOC-005\
**Priority:** MUST\
**Phase:** 1

Country/store configuration shall define required/optional
customer-facing receipt scripts subject to printer capability.

**Acceptance:** Unsupported printer capability is detected during setup.

### FR-CTRY-011 --- Country-specific item fields

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Country pack may extend item master with regulatory/commercial fields
without forking catalog identity.

**Acceptance:** Common item still has one core identity.

### FR-CTRY-012 --- Country-specific customer/supplier fields

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Country pack may extend party records with required local
identifiers/validation.

**Acceptance:** Core customer/supplier remains common.

### FR-CTRY-013 --- Tax rule boundary

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Tax calculation/reporting rules shall be defined by verified country
specifications before production implementation.

**Acceptance:** Core FRS does not invent tax law.

### FR-CTRY-014 --- E-invoice boundary

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Electronic invoicing integration shall be country-specific and versioned
against verified official requirements.

**Acceptance:** Core sale can remain locally valid according to approved
offline/compliance policy.

### FR-CTRY-015 --- Receipt/document boundary

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Country pack shall define mandatory receipt/invoice fields after legal
verification.

**Acceptance:** Generic receipt does not assume one country's mandatory
fields.

### FR-CTRY-016 --- Cash rounding boundary

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Country-specific cash rounding shall be explicitly defined and tested
before activation.

**Acceptance:** Core payment never guesses rounding increment.

### FR-CTRY-017 --- Payment-method boundary

**Source:** BR-PAY-003\
**Priority:** MUST\
**Phase:** 1/3

Country pack may enable appropriate QR/digital/payment adapters without
changing common tender state machine.

**Acceptance:** Provider/country specifics remain isolated.

### FR-CTRY-018 --- Reporting/export boundary

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Country-specific regulatory reports/exports shall be separate from
generic operational reports.

**Acceptance:** Operational report is not mislabeled statutory.

### FR-CTRY-019 --- Official verification gate

**Source:** BRD §22 Country Editions\
**Priority:** MUST\
**Phase:** 2

Legal/tax/e-invoice rules shall require dated verification against
authoritative sources before implementation/release.

**Acceptance:** Unverified assumptions cannot be promoted to compliance
rule.

### FR-CTRY-020 --- Country regression suite

**Source:** BO-006\
**Priority:** MUST\
**Phase:** 2

Each country pack shall have regression examples covering
prices/tax/rounding/documents/payments/localization as applicable.

**Acceptance:** Core changes cannot silently break a country pack.
