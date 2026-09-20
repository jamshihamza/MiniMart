# MiniMart India Country-Pack Boundary --- v0.6

**Document ID:** MM-FRS-CTRY-IN-001\
**Requirement namespace:** `FR-CTRY-036`--`FR-CTRY-050`\
**Status:** Boundary Draft --- legal/compliance details require current
official verification

## Requirements

### FR-CTRY-036 --- India edition

**Source:** BRD §22 India Edition\
**Priority:** MUST\
**Phase:** 4

MiniMart shall provide an India country pack after the Malaysia
baseline.

**Acceptance:** India behavior uses same common core.

### FR-CTRY-037 --- India currency/formatting

**Source:** BRD §22 India Edition, BR-LOC-004\
**Priority:** MUST\
**Phase:** 4

India pack shall define Indian currency/number/date presentation.

**Acceptance:** Formatting is consistent across POS/receipt/report.

### FR-CTRY-038 --- India languages

**Source:** BR-LOC-003\
**Priority:** MUST\
**Phase:** 4

India edition shall support English and appropriate regional languages
according to rollout; Malayalam is anticipated.

**Acceptance:** Localization does not alter transaction values.

### FR-CTRY-039 --- India GST boundary

**Source:** BRD §22 India Edition\
**Priority:** MUST\
**Phase:** 4

GST calculation/document/reporting rules shall be specified from current
official requirements before implementation.

**Acceptance:** No GST rate/category is invented here.

### FR-CTRY-040 --- India HSN boundary

**Source:** BRD §22 India Edition\
**Priority:** MUST\
**Phase:** 4

HSN-related product fields/validation shall be defined from verified
business/legal requirements.

**Acceptance:** Catalog extension is versioned and justified.

### FR-CTRY-041 --- India MRP boundary

**Source:** BRD §22 India Edition\
**Priority:** MUST\
**Phase:** 4

MRP-related pricing/display controls shall be specified from verified
current requirements before implementation.

**Acceptance:** Core pricing does not assume MRP rules globally.

### FR-CTRY-042 --- India UPI boundary

**Source:** BR-PAY-003\
**Priority:** MUST\
**Phase:** 4

India pack shall enable approved UPI tender/integration models while
retaining common payment states/idempotency.

**Acceptance:** Provider behavior does not bypass core payment rules.

### FR-CTRY-043 --- India invoice/receipt fields

**Source:** BRD §22 India Edition\
**Priority:** MUST

**Verification Gate:** Authoritative verification required before
activation\
**Phase:** 4

India mandatory invoice/receipt fields shall be defined by dedicated
verified compliance specification.

**Acceptance:** Output is not based on assumptions.

### FR-CTRY-044 --- India GST reporting/export

**Source:** BRD §22 India Edition\
**Priority:** MUST

**Verification Gate:** Authoritative verification required before
activation\
**Phase:** 4

India GST reporting/export requirements shall be separately specified
and reconciled to posted transactions.

**Acceptance:** Operational reports are not automatically statutory.

### FR-CTRY-045 --- India e-invoice boundary

**Source:** BRD §22 India Edition\
**Priority:** MUST

**Decision Status:** OPEN

**Verification Gate:** Verified rule required before activation\
**Phase:** 4

Any applicable India e-invoicing/e-way or related digital compliance
behavior shall be scoped only after current official verification and
target-customer applicability review.

**Acceptance:** No universal applicability is assumed.

### FR-CTRY-046 --- India customer/supplier tax identifiers

**Source:** BRD §22 India Edition\
**Priority:** MUST

**Verification Gate:** Authoritative verification required before
activation\
**Phase:** 4

Party tax identifiers/validation shall be defined from verified
requirements and transaction context.

**Acceptance:** Unnecessary identifiers are not mandatory.

### FR-CTRY-047 --- India tax-inclusive/exclusive pricing

**Source:** BR-PRI-003\
**Priority:** MUST

**Verification Gate:** Authoritative verification required before
activation\
**Phase:** 4

India pack shall define approved interaction between selling price, MRP
and applicable taxes from verified requirements.

**Acceptance:** POS totals are reproducible.

### FR-CTRY-048 --- India accountant export

**Source:** BR-ACC-006\
**Priority:** SHOULD\
**Phase:** 4

India edition may provide approved accounting-system exports without
coupling core transactions to one accounting vendor.

**Acceptance:** Export semantics are documented.

### FR-CTRY-049 --- India compliance versioning

**Source:** BRD §22 India Edition\
**Priority:** MUST\
**Phase:** 4

India compliance rules shall carry effective/version context and
migration tests.

**Acceptance:** Historical documents retain original meaning.

### FR-CTRY-050 --- India acceptance pack

**Source:** BRD §22 India Edition\
**Priority:** MUST\
**Phase:** 4

Before India production release, a verified acceptance pack shall cover
representative GST/HSN/MRP/receipt/payment/localization scenarios
applicable to target businesses.

**Acceptance:** Release evidence references current authoritative rules.

## Important

This file intentionally does **not** state current GST rates,
thresholds, filing/e-invoice rules or other legal specifics. Those must
be verified from authoritative Indian sources when the India compliance
specification is created.
