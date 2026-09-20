# Observability, Reliability and Recovery --- v0.3

## Audit versus telemetry

**Audit** is durable business/security evidence stored through the
frozen Audit model. It is append-only and participates in required
Posting Envelopes.

**Telemetry** is operational evidence: logs, traces and metrics. It is
not business truth and may be sampled/expired according to approved
operational policy.

## Telemetry rules

-   allow-list structured fields;
-   redact secrets, password/PIN/PAN and unnecessary PII;
-   correlation IDs may appear in logs/traces;
-   high-cardinality business IDs must not be metric-label dimensions;
-   retention remains DEC-SUPT-002 / DEC-AUD-001 policy, not hard-coded
    here;
-   desktop, Store Node and cloud propagate correlation identity without
    trusting it for authorization.

## Reliability

Cloud outage: local posting continues.\
Printer failure: post remains valid, reprint path exposed.\
Provider uncertainty: durable recovery state.\
DB unavailable/incompatible: Store Node does not claim transactional
readiness.

## Recovery

Immutable facts are reconstruction evidence. Reconciliation can detect
drift; repair requires controlled maintenance and audit. Backup
RPO/RTO/retention/provider remain DEC-BR-001..004 seams.
