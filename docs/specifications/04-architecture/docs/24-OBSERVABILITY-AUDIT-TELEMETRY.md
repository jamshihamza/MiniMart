# Observability, Audit and Telemetry Contract

## Audit

Purpose: business/security accountability.\
Storage: frozen append-only Audit model.\
Durability: same transaction where required.\
Access: permission-controlled.\
Retention/tamper mechanism: DEC-AUD-001/002.

## Logs

Purpose: operational diagnosis. Structured allow-list. Sensitive fields
redacted. Retention: DEC-SUPT-002.

## Traces

Carry correlation/causation/posting-envelope identity across client →
Store Node → adapter/cloud where safe. Trace IDs are not authorization
credentials.

## Metrics

Low-cardinality dimensions only: service/module/operation/result/store
class/build version as approved. Do not label metrics with SaleId,
CustomerId, ItemId, user names, receipt numbers or other unbounded IDs.

## Diagnostic bundles

Generated through DiagnosticBundlePolicy seam. Default architecture
excludes secrets and does not assume inclusion of PII/business payloads.
DEC-SUPT-003 remains proposed.

## Alert examples

DB readiness, Posting Envelope error rate, lock wait, outbox oldest age,
dead letters, sync incompatibility, reconciliation drift, backup
age/restore-test state.
