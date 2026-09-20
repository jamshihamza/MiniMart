# MiniMart Import & Export Functional Specification --- v0.6

**Document ID:** MM-FRS-IMP-001\
**Requirement namespace:** `FR-IMP-001`--`FR-IMP-045`\
**Status:** Detailed Working Draft --- Batch 5

## Purpose

Define safe bulk data entry, migration and export without bypassing
MiniMart business validation, audit or transaction integrity.

## Requirements

### FR-IMP-001 --- Import permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Bulk import shall require explicit permission appropriate to the
imported business object.

**Acceptance:** Unauthorized user cannot start or commit import.

### FR-IMP-002 --- Supported file formats

**Source:** BR-CAT-008, BR-PUR-005\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support CSV and approved spreadsheet input where
specified by the target module.

**Acceptance:** Unsupported format is rejected clearly.

### FR-IMP-003 --- Import template

**Source:** BR-CAT-008\
**Priority:** MUST\
**Phase:** 1

MiniMart shall provide or document the expected columns, data types and
required fields for supported imports.

**Acceptance:** User can prepare a valid file without guessing.

### FR-IMP-004 --- Import scope declaration

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Every import shall identify target object/process and import mode before
validation.

**Acceptance:** Product data cannot accidentally be interpreted as a
purchase.

### FR-IMP-005 --- File validation

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

MiniMart shall validate file structure before processing business rows.

**Acceptance:** Malformed file creates no business records.

### FR-IMP-006 --- Header validation

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Required headers/columns shall be validated and unknown/duplicate
columns handled by explicit policy.

**Acceptance:** Ambiguous columns do not silently map.

### FR-IMP-007 --- Row validation

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Each row shall be validated against target functional rules before
commit.

**Acceptance:** Invalid row identifies row and reason.

### FR-IMP-008 --- Data type validation

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Dates, quantities, money, codes and booleans shall be parsed using
explicit formats.

**Acceptance:** Ambiguous parsing is rejected rather than guessed.

### FR-IMP-009 --- Required-field validation

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Missing required fields shall be reported before affected row is
committed.

**Acceptance:** Required data is never silently defaulted unless
specification says so.

### FR-IMP-010 --- Reference validation

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

References such as supplier, product, UOM or category shall resolve
unambiguously or be rejected/queued for approved creation.

**Acceptance:** Wrong master is not silently selected.

### FR-IMP-011 --- Duplicate detection

**Source:** BR-CAT-008, BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Import shall detect duplicate identifiers within the file and against
existing data according to module rules.

**Acceptance:** Duplicate barcode/invoice/code is surfaced.

### FR-IMP-012 --- Preview

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

User shall be able to review validation summary before committing a
material import.

**Acceptance:** Counts of valid/warning/error rows are visible.

### FR-IMP-013 --- Error report

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

MiniMart shall provide a downloadable/viewable error report with row,
field and reason.

**Acceptance:** User can correct source file efficiently.

### FR-IMP-014 --- Warnings distinct from errors

**Source:** BR-PUR-006\
**Priority:** MUST\
**Phase:** 1

Warnings that may be accepted shall be distinguished from blocking
errors.

**Acceptance:** Commit policy is explicit.

### FR-IMP-015 --- All-or-nothing mode

**Source:** BR-DATA-001\
**Priority:** MUST

**Applicability:** Where the import/export operation posts a
transaction\
**Phase:** 1

Imports that represent one business document shall commit atomically.

**Acceptance:** A GRN/imported transaction is not half-posted.

### FR-IMP-016 --- Row-independent mode

**Source:** BR-CAT-008\
**Priority:** SHOULD\
**Phase:** 1

Master-data imports may support valid-row commit with explicit
failed-row reporting where approved.

**Acceptance:** User knows exactly which rows committed.

### FR-IMP-017 --- Dry run

**Source:** BR-PUR-006\
**Priority:** SHOULD\
**Phase:** 1

Material imports should support validation/dry-run without business
effect.

**Acceptance:** Dry run creates no posted records.

### FR-IMP-018 --- Import identity

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Each import execution shall have stable identity for audit/retry
investigation.

**Acceptance:** Same execution can be traced.

### FR-IMP-019 --- Safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Retry after timeout/restart shall not silently duplicate records or
posted transactions.

**Acceptance:** Business effect remains idempotent where required.

### FR-IMP-020 --- Import audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Import shall retain actor, file metadata/hash where appropriate, target,
counts, time and outcome.

**Acceptance:** Bulk change is traceable.

### FR-IMP-021 --- Import source preservation

**Source:** BR-AUD-002\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should retain sufficient source metadata/error evidence without
unnecessarily storing sensitive source files forever.

**Acceptance:** Investigation is possible within retention policy.

### FR-IMP-022 --- Product import

**Source:** BR-CAT-008\
**Priority:** MUST\
**Phase:** 1

Product import shall support approved catalog fields and catalog
validation rules.

**Acceptance:** Imported product behaves like manually created product.

### FR-IMP-023 --- Barcode import

**Source:** BR-CAT-002, BR-CAT-008\
**Priority:** MUST\
**Phase:** 1

Product import shall validate barcode uniqueness/ownership.

**Acceptance:** Barcode conflict is not silently reassigned.

### FR-IMP-024 --- Price import/update

**Source:** BR-PRI-005\
**Priority:** MUST\
**Phase:** 1

Authorized bulk price update shall validate effective date, money and
pricing policy.

**Acceptance:** Price history/audit are preserved.

### FR-IMP-025 --- Supplier import

**Source:** BR-SUP-001\
**Priority:** SHOULD\
**Phase:** 1/2

Supplier master may be imported with duplicate and country-field
validation.

**Acceptance:** Imported supplier is traceable.

### FR-IMP-026 --- Purchase invoice/GRN import

**Source:** BR-PUR-005\
**Priority:** SHOULD\
**Phase:** 1/2

Supplier invoice data may be transformed into a validated draft
purchase/GRN workflow.

**Acceptance:** Import does not bypass posting controls.

### FR-IMP-027 --- Opening stock import

**Source:** BR-INV-001\
**Priority:** MUST

**Applicability:** For migration/opening-data workflows\
**Phase:** 1

Opening stock migration shall use an explicit opening-stock process that
creates traceable stock effect.

**Acceptance:** Users cannot directly overwrite stock balance.

### FR-IMP-028 --- Customer import

**Source:** BR-CUS-001\
**Priority:** SHOULD\
**Phase:** 2

Customer import shall apply duplicate/privacy/customer validation rules.

**Acceptance:** Import does not imply marketing consent.

### FR-IMP-029 --- Import localization

**Source:** BR-LOC-004\
**Priority:** MUST\
**Phase:** 1

Import templates shall use explicit date/decimal/currency conventions
independent of ambiguous UI locale assumptions.

**Acceptance:** Same file parses deterministically.

### FR-IMP-030 --- Unicode import

**Source:** BR-LOC-001\
**Priority:** MUST\
**Phase:** 1

Supported imports shall preserve approved Unicode text.

**Acceptance:** Malayalam/Bahasa/other supported text is not corrupted.

### FR-IMP-031 --- Large import progress

**Source:** BR-CAT-005\
**Priority:** MUST\
**Phase:** 1

Long-running imports shall expose progress/state without implying
completion early.

**Acceptance:** User can distinguish
validating/committing/completed/failed.

### FR-IMP-032 --- Import cancellation

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

Cancellation shall be allowed only while it can be done safely;
committed business effects are not undone by deleting an import job.

**Acceptance:** Cancellation semantics are explicit.

### FR-IMP-033 --- Offline import

**Source:** BR-OPS-001\
**Priority:** SHOULD\
**Phase:** 1

Store-local imports may operate without cloud when target data is
locally authoritative.

**Acceptance:** Cloud loss alone does not corrupt import.

### FR-IMP-034 --- Concurrent import protection

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Concurrent imports/edits shall respect uniqueness and posting rules at
commit time.

**Acceptance:** Race cannot silently create duplicate critical
identifiers.

### FR-IMP-035 --- Export permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1/2

Data export shall require permission appropriate to data sensitivity.

**Acceptance:** Unauthorized bulk extraction is blocked.

### FR-IMP-036 --- CSV export

**Source:** BR-BIZ-002\
**Priority:** MUST\
**Phase:** 2

MiniMart shall support CSV export for approved operational/accounting
data sets.

**Acceptance:** Export contains documented columns and scope.

### FR-IMP-037 --- Spreadsheet export

**Source:** BR-BIZ-002\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should support spreadsheet-friendly export for approved
workflows.

**Acceptance:** Values reconcile to source/report.

### FR-IMP-038 --- Export filters

**Source:** BR-BIZ-002\
**Priority:** MUST\
**Phase:** 2

Export shall preserve selected store/date/status/filter scope.

**Acceptance:** Output states or accompanies its scope.

### FR-IMP-039 --- Exact value export

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 2

Money and quantities shall export without binary floating-point
corruption.

**Acceptance:** Exported totals reconcile.

### FR-IMP-040 --- Export encoding

**Source:** BR-LOC-001\
**Priority:** MUST\
**Phase:** 2

Text exports shall use documented Unicode-safe encoding.

**Acceptance:** Supported scripts remain readable.

### FR-IMP-041 --- PII-aware export

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 2

Customer/person data export shall minimize/mask fields according to
permission and purpose.

**Acceptance:** Unnecessary PII is excluded.

### FR-IMP-042 --- Audit-sensitive export

**Source:** BR-AUD-003\
**Priority:** MUST\
**Phase:** 2

Audit exports shall be read-only representations and shall not create an
import path that edits audit history.

**Acceptance:** Export cannot mutate audit source.

### FR-IMP-043 --- Accountant export boundary

**Source:** BR-ACC-006, BR-BIZ-002\
**Priority:** MUST\
**Phase:** 2

MiniMart shall support approved accountant/external-system export
without claiming full accounting semantics beyond validated scope.

**Acceptance:** Operational data is clearly defined.

### FR-IMP-044 --- Export audit

**Source:** BR-AUD-001\
**Priority:** SHOULD\
**Phase:** 2

Sensitive/bulk exports should be audited with actor, scope and time.

**Acceptance:** Data extraction can be investigated.

### FR-IMP-045 --- Import/export acceptance suite

**Source:** BR-PUR-006, BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/2

Tests shall cover malformed files, duplicates, partial master import,
atomic transaction import, retry, Unicode, exact money and
permission/PII controls.

**Acceptance:** Import/export invariants are regression-tested.

## Core rule

Import is an alternate input channel, **not** an alternate business-rule
engine. Imported transactions must pass the same functional controls as
interactive transactions.
