# MiniMart Malaysia Country-Pack Boundary --- v0.6

**Document ID:** MM-FRS-CTRY-MY-001\
**Requirement namespace:** `FR-CTRY-021`--`FR-CTRY-035`\
**Status:** Boundary Draft --- legal/compliance details require current
official verification

## Requirements

### FR-CTRY-021 --- Malaysia edition

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST\
**Phase:** 2

MiniMart shall provide a Malaysia country pack as the first production
country edition.

**Acceptance:** Store can activate Malaysia behavior without code fork.

### FR-CTRY-022 --- Malaysia currency/formatting

**Source:** BRD §22 Malaysia Edition, BR-LOC-004\
**Priority:** MUST\
**Phase:** 2

Malaysia pack shall define Malaysian currency/number/date presentation
after approved product decisions.

**Acceptance:** Formatting is consistent across POS/receipt/report.

### FR-CTRY-023 --- Malaysia languages

**Source:** BR-LOC-002\
**Priority:** MUST\
**Phase:** 2

Malaysia edition shall support English and Bahasa Malaysia initially,
with Chinese/Tamil support according to approved rollout requirements.

**Acceptance:** Language selection does not alter transaction values.

### FR-CTRY-024 --- Malaysia tax boundary

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST\
**Phase:** 2

Applicable Malaysia tax treatment shall be specified only after current
official verification.

**Acceptance:** No tax rate/category is hard-coded from this boundary
FRS.

### FR-CTRY-025 --- Malaysia e-invoice boundary

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST\
**Phase:** 2

MyInvois/e-invoicing behavior shall be defined in a dedicated verified
compliance specification before production integration.

**Acceptance:** This FRS records capability boundary, not legal details.

### FR-CTRY-026 --- Malaysia invoice identity fields

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST\
**Phase:** 2

Required seller/buyer/document identifiers shall be added only from
verified compliance specification.

**Acceptance:** Field requirements are versioned.

### FR-CTRY-027 --- Malaysia offline e-invoice handling

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST

**Decision Status:** OPEN

**Verification Gate:** Verified rule required before activation\
**Phase:** 2

Offline/late-submission behavior for Malaysia e-invoicing shall follow
verified official rules and product recovery design.

**Acceptance:** Store does not invent submission deadlines.

### FR-CTRY-028 --- Malaysia cash rounding

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST

**Verification Gate:** Authoritative verification required before
activation\
**Phase:** 2

Malaysia cash rounding behavior shall be implemented only from verified
current rule and clearly separated from item pricing.

**Acceptance:** Tests prove tender/receipt consistency.

### FR-CTRY-029 --- Malaysia QR/digital payment

**Source:** BR-PAY-003\
**Priority:** MUST\
**Phase:** 2/3

Malaysia pack shall allow approved DuitNow/QR/e-wallet tender
configuration/integration according to selected provider model.

**Acceptance:** Common payment uncertainty/idempotency rules remain
applicable.

### FR-CTRY-030 --- Malaysia receipt fields

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST

**Verification Gate:** Authoritative verification required before
activation\
**Phase:** 2

Malaysia receipt/invoice mandatory fields shall be defined in verified
compliance specification.

**Acceptance:** Printer output conforms to approved spec.

### FR-CTRY-031 --- Malaysia tax/report exports

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST

**Verification Gate:** Authoritative verification required before
activation\
**Phase:** 2

Required Malaysia compliance reports/exports shall be separately
specified and reconciled to posted transactions.

**Acceptance:** Generic operational reports are not treated as statutory
by default.

### FR-CTRY-032 --- Malaysia product classification fields

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST

**Decision Status:** OPEN

**Verification Gate:** Verified rule required before activation\
**Phase:** 2

Any Malaysia-specific product classification/tax codes shall be
introduced only where verified requirement/use case exists.

**Acceptance:** Catalog avoids speculative fields.

### FR-CTRY-033 --- Malaysia customer/supplier identifiers

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST

**Decision Status:** OPEN

**Verification Gate:** Verified rule required before activation\
**Phase:** 2

Malaysia-specific party identifiers/validation shall come from verified
invoicing/tax requirements.

**Acceptance:** Core party data is not over-collected.

### FR-CTRY-034 --- Malaysia compliance versioning

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST\
**Phase:** 2

Malaysia compliance rules/integration contracts shall record
effective/version context.

**Acceptance:** Changes can be tested/migrated without rewriting
history.

### FR-CTRY-035 --- Malaysia acceptance pack

**Source:** BRD §22 Malaysia Edition\
**Priority:** MUST\
**Phase:** 2

Before Malaysia production release, a verified acceptance pack shall
cover representative tax, receipt, e-invoice, payment and localization
scenarios.

**Acceptance:** Release evidence references current authoritative rules.

## Important

This file intentionally does **not** state current tax rates, submission
deadlines, legal thresholds or mandatory identifiers. Those must be
verified from authoritative Malaysian sources when the compliance
specification is created.
