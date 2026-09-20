# MiniMart FRS Batch 5 --- Cross-Module Acceptance Scenarios v0.6

**Document ID:** MM-FRS-B5-ACCEPT-001\
**Status:** Working Draft

## AC-B5-001 --- Product import with one invalid row

A product import identifies the invalid row/field without silently
creating an incorrect product; commit behavior follows approved
master-import mode.

## AC-B5-002 --- Duplicate barcode import

A barcode already owned by another item is reported as conflict and is
not silently reassigned.

## AC-B5-003 --- Imported GRN atomicity

An imported supplier document that becomes a posted GRN creates all
required purchase/stock/audit effects atomically or none.

## AC-B5-004 --- Import retry

A timeout followed by retry does not duplicate a posted document or
critical master identifier.

## AC-B5-005 --- Unicode import/export

Supported Malayalam/Bahasa/other Unicode text survives approved import
and export without corruption.

## AC-B5-006 --- Sensitive export permission

A user lacking bulk customer/export permission cannot extract restricted
PII.

## AC-B5-007 --- Manager override audit

A protected POS override records operator, approver, reason, time,
store/counter and affected transaction.

## AC-B5-008 --- Audit cannot be edited

An ordinary administrator/business user cannot alter/delete an existing
audit event through normal application workflow.

## AC-B5-009 --- Audit redaction

Passwords, tokens, keys and prohibited payment credentials never appear
in audit payload or exported audit evidence.

## AC-B5-010 --- Offline audit

Cloud outage does not prevent required local audit records for local
trading.

## AC-B5-011 --- Printer fails after sale

Sale remains committed exactly once; printer failure is reported and
receipt can be reprinted later.

## AC-B5-012 --- Scanner disconnect

Current sale remains intact and cashier can use permitted product
search/manual fallback.

## AC-B5-013 --- Cash drawer failure

Drawer failure does not trigger duplicate cash sale/refund posting.

## AC-B5-014 --- Peripheral reconnect

A supported device can recover/reconnect without reposting completed
business transactions.

## AC-B5-015 --- Backup failure visibility

A missed/failed backup becomes visible in health status and does not
masquerade as successful backup.

## AC-B5-016 --- Restore drill

A selected backup is restored in a controlled test, compatibility is
checked and representative business data is verified.

## AC-B5-017 --- Post-restore idempotency

After recovery, sync/retry does not duplicate transactions already
accepted centrally.

## AC-B5-018 --- Support bundle privacy

Diagnostic bundle contains health/log/config evidence but redacts
secrets and minimizes customer/business data.

## AC-B5-019 --- Temporary support access

Remote/elevated support requires authorized identity, expires, and
material actions are audited.

## AC-B5-020 --- Local diagnostics during internet outage

Store staff/L1 can inspect Store Node, database, hardware and backup
health without cloud.

## AC-B5-021 --- Country isolation

A Malaysia-specific field/rule does not become mandatory for an India or
generic-country store unless its country pack requires it.

## AC-B5-022 --- Country rule verification gate

A proposed tax/e-invoice rule cannot be promoted from assumption to
production compliance behavior without dated authoritative verification.

## AC-B5-023 --- Country pack regression

A common-core change runs country-pack tests and cannot silently alter
historical tax/rounding/document behavior.

## AC-B5-024 --- Unsupported receipt script capability

Store setup/test identifies printer inability to render required script
before production receipt reliance.
