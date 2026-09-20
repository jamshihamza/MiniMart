# MiniMart Non-Functional Requirements Specification (NFRS) --- v1.0

**Document ID:** MM-NFRS-001\
**Status:** FROZEN --- authoritative non-functional baseline\
\
**Companion:** `FRS.md`\
**Applies to:** POS Terminal, Back Office, Store Node, local PostgreSQL,
Cloud services, synchronization, country packs, hardware adapters and
support tooling.

Numeric performance/recovery targets are release gates only after
benchmark hardware, dataset, concurrency and measurement method are
defined.

## 1. Performance

### NFR-PERF-001 --- Barcode scan responsiveness

**Priority:** MUST\
Under the defined Phase-1 benchmark, normal barcode scan-to-cart-line
response should be under **100 ms** excluding hardware scan latency.

### NFR-PERF-002 --- Product search

**Priority:** MUST\
Typical local product search should be under **50 ms** at approximately
50,000 active items under the defined benchmark.

### NFR-PERF-003 --- Checkout completion

**Priority:** MUST\
After all required local payment conditions are satisfied, local sale
posting to receipt-ready state should normally complete within **1.5
seconds**, excluding external provider latency and physical printer
throughput.

### NFR-PERF-004 --- Performance isolation

**Priority:** MUST\
Cloud synchronization, reporting, export, backup and diagnostic work
shall not materially block foreground checkout under normal operating
load.

### NFR-PERF-005 --- Multi-counter benchmark

**Priority:** MUST\
Release qualification for multi-counter deployment shall include
representative concurrent sale, stock and held-sale workloads.

## 2. Reliability and durability

### NFR-REL-001 --- Posted transaction durability

**Priority:** MUST\
A locally confirmed posted business transaction shall survive
application/service restart.

### NFR-REL-002 --- No silent loss

**Priority:** MUST\
Committed business transactions, Payment Commitments, Refund Obligations
and other recoverable monetary states shall not be silently lost after
restart.

### NFR-REL-003 --- Crash/power-loss qualification

**Priority:** MUST\
Critical posting workflows shall be tested for process crash, forced
termination and representative power-loss/restart recovery.

### NFR-REL-004 --- Idempotent retry

**Priority:** MUST\
Retry shall not create duplicate sale, stock, tender, payment, refund,
purchase, accounting-lite or synchronization effects.

### NFR-REL-005 --- Explicit uncertain state

**Priority:** MUST\
When an external monetary outcome cannot be determined safely, MiniMart
shall preserve an explicit uncertain/reconciliation state rather than
guess success or failure.

### NFR-REL-006 --- Recovery without historical rewrite

**Priority:** MUST\
Recovery shall complete, reverse or reconcile an interrupted workflow
without destructively rewriting already posted history.

### NFR-REL-007 --- Hardware failure isolation

**Priority:** MUST\
Peripheral failure after business posting shall not invalidate or
duplicate the posted business transaction.

## 3. Offline and degraded operation

### NFR-OFF-001 --- Internet independence

**Priority:** MUST\
Loss of internet/cloud connectivity shall not block defined local store
checkout while Store Node and local PostgreSQL remain healthy.

### NFR-OFF-002 --- Local outcome authority

**Priority:** MUST\
Delayed cloud synchronization shall not change the locally confirmed
outcome of a completed store transaction.

### NFR-OFF-003 --- Store-service failure distinction

**Priority:** MUST\
The product shall distinguish cloud-offline operation from Store
Node/database unavailability; the latter may safely block posting.

### NFR-OFF-004 --- Local diagnostics

**Priority:** MUST\
Store/L1 support shall be able to inspect essential Store Node,
database, hardware, backup and synchronization health without internet
access.

### NFR-OFF-005 --- Offline authorization

**Priority:** MUST\
Permissions required for offline operations shall be enforceable locally
without requiring a live cloud authorization round trip.

## 4. Data integrity and concurrency

### NFR-DATA-001 --- Exact money

**Priority:** MUST\
Money calculations shall use exact decimal/minor-unit semantics;
JavaScript binary floating-point shall not be the authoritative
representation of monetary value.

### NFR-DATA-002 --- Quantity precision

**Priority:** MUST\
Quantity precision shall be deterministic for whole, fractional and
weighed items according to item/UoM rules.

### NFR-DATA-003 --- Atomic local posting

**Priority:** MUST\
Where the FRS defines one local posting transaction, all required local
effects shall commit together or roll back together.

### NFR-DATA-004 --- Stable identifiers

**Priority:** MUST\
Business documents, payment attempts/commitments, refunds, stock
movements, audit events and synchronization messages shall have stable
identities sufficient for retry and reconciliation.

### NFR-DATA-005 --- Multi-counter consistency

**Priority:** MUST\
Concurrent counters shall not silently overwrite or double-consume
protected business state such as held sales, stock-count sessions,
customer credit exposure or document numbering.

### NFR-DATA-006 --- Historical meaning

**Priority:** MUST\
Later master-data, price, country-rule or configuration changes shall
not silently reinterpret posted historical transactions.

### NFR-DATA-007 --- Country-rule versioning

**Priority:** MUST\
Posted transactions shall retain sufficient country
context/version/effective-rule outcome to preserve historical meaning
after country-pack updates.

## 5. Scalability

### NFR-SCALE-001 --- Phase-1 catalog

**Priority:** MUST\
The Phase-1 design shall support at least 30,000--50,000+ active items
without unacceptable checkout degradation.

### NFR-SCALE-002 --- Growth headroom

**Priority:** SHOULD\
The design should not prevent materially larger catalogs without
replacing core domain concepts.

### NFR-SCALE-003 --- Counter growth

**Priority:** MUST\
MiniMart shall progress from one counter to multiple counters without
replacing the application or cloning company-wide masters.

### NFR-SCALE-004 --- Store growth

**Priority:** MUST\
Core identity and ownership shall support later multi-store operation
without redefining Item, Supplier or Customer identity.

### NFR-SCALE-005 --- Tenant readiness

**Priority:** MUST\
Cloud-facing records and contracts shall not prevent later shared
multi-tenancy even when early customers use dedicated deployment.

## 6. Security

### NFR-SEC-001 --- Authorization

**Priority:** MUST\
Sensitive operations require explicit authorization and, where
specified, manager approval.

### NFR-SEC-002 --- Credential protection

**Priority:** MUST\
Passwords, tokens, encryption keys and provider secrets shall not be
stored in source code or ordinary plaintext configuration.

### NFR-SEC-003 --- Password/PIN protection

**Priority:** MUST\
Password-equivalent secrets shall use approved modern password hashing
and secure secret-storage mechanisms appropriate to their type.

### NFR-SEC-004 --- No universal hidden credential

**Priority:** MUST\
MiniMart shall not use an undocumented universal master password or
equivalent support bypass.

### NFR-SEC-005 --- Audit of sensitive actions

**Priority:** MUST\
Manager overrides, permission changes, support elevation, sensitive
exports and financial corrections shall be auditable.

### NFR-SEC-006 --- Transport security

**Priority:** MUST\
Network communication carrying authentication, business or personal data
shall use authenticated encrypted transport appropriate to the
deployment.

### NFR-SEC-007 --- Device enrollment

**Priority:** MUST\
Store/counter/cloud trust shall use explicit device/installation
enrollment rather than implicit trust by network location alone.

### NFR-SEC-008 --- Payment-data minimization

**Priority:** MUST\
MiniMart shall avoid storing PAN or unnecessary payment-card credentials
and shall retain only references/status data required by the approved
integration.

### NFR-SEC-009 --- Signed release artifacts

**Priority:** MUST\
Production installers/updates shall support authenticity/integrity
verification through approved signing/release controls.

## 7. Privacy

### NFR-PRIV-001 --- Data minimization

**Priority:** MUST\
Collect only customer/person data required for defined business, support
or compliance purposes.

### NFR-PRIV-002 --- Role-based visibility

**Priority:** MUST\
PII and sensitive financial data shall be visible only to
roles/functions that require it.

### NFR-PRIV-003 --- Diagnostic minimization

**Priority:** MUST\
Support bundles shall minimize PII/business-data exposure and redact
secrets by default.

### NFR-PRIV-004 --- Export control

**Priority:** MUST\
Bulk customer/financial exports require explicit authorization and audit
where specified.

### NFR-PRIV-005 --- Retention policy boundary

**Priority:** MUST\
Retention/anonymization/deletion behavior shall follow approved
deployment/country policy and shall not destroy records required to
preserve financial/audit history.

## 8. Backup, recovery and continuity

### NFR-BACKUP-001 --- Documented backup

**Priority:** MUST\
Store and cloud business data shall have documented backup procedures
appropriate to the deployment.

### NFR-BACKUP-002 --- Multiple recovery points

**Priority:** MUST\
Production backup design shall maintain multiple recovery points and an
off-device/off-host copy according to approved retention policy.

### NFR-BACKUP-003 --- Restore testing

**Priority:** MUST\
Backups shall be periodically restored in a controlled test and
representative business data verified.

### NFR-BACKUP-004 --- Migration recovery

**Priority:** MUST\
Database/schema migration procedures shall include rollback/recovery
strategy and backup compatibility checks.

### NFR-BACKUP-005 --- RPO/RTO ownership

**Priority:** MUST\
Each production deployment shall define approved RPO and RTO targets
before go-live; exact values remain an operations decision until
approved.

### NFR-BACKUP-006 --- Backup health visibility

**Priority:** MUST\
Failed, stale or missing backups shall be visible to authorized
operations/support personnel.

### NFR-BACKUP-007 --- Post-restore idempotency

**Priority:** MUST\
Recovery and subsequent synchronization/retry shall not duplicate
transactions already accepted locally or centrally.

## 9. Observability, support and operability

### NFR-OPS-001 --- Health indicators

**Priority:** MUST\
Health indicators shall distinguish common application, Store Node,
database, cloud/sync and peripheral failure classes.

### NFR-OPS-002 --- Actionable diagnostics

**Priority:** MUST\
Operational failures shall produce actionable diagnostic information
without exposing secrets.

### NFR-OPS-003 --- Correlation

**Priority:** MUST\
Critical requests/transactions shall have correlation identifiers
sufficient to trace activity across POS, Store Node and synchronization
logs.

### NFR-OPS-004 --- Time-limited support access

**Priority:** MUST\
Remote/elevated support access shall be identity-based,
time-limited/revocable and audited.

### NFR-OPS-005 --- No support superuser shortcut

**Priority:** MUST\
Support capability shall not depend on a permanent universal
business-administrator credential.

### NFR-OPS-006 --- Bounded logs

**Priority:** MUST\
Operational logs shall have configurable bounded retention and shall not
grow without control.

### NFR-OPS-007 --- Clock/timezone visibility

**Priority:** MUST\
Diagnostics shall expose relevant store timezone/business-date/time
context needed to investigate ordering, day-close and synchronization
issues.

## 10. Usability

### NFR-UX-001 --- High-frequency POS input

**Priority:** MUST\
High-frequency POS workflows shall be usable primarily with barcode
scanner and keyboard, with mouse/touch as appropriate.

### NFR-UX-002 --- Offline visibility

**Priority:** MUST\
Cloud-offline status shall be visible without unnecessarily interrupting
local checkout.

### NFR-UX-003 --- Error classification

**Priority:** MUST\
User messages shall distinguish correctable validation errors,
permission/approval requirements, hardware failures, uncertain
payment/refund states and technical recovery conditions.

### NFR-UX-004 --- No duplicate-action encouragement

**Priority:** MUST\
During uncertain posting/payment/refund states, the UI shall not
encourage users to repeat an action that may duplicate money or stock
effects.

### NFR-UX-005 --- Recovery guidance

**Priority:** MUST\
Interrupted monetary workflows shall present explicit
recovery/reconciliation guidance appropriate to user permission.

## 11. Localization and country packs

### NFR-LOC-001 --- Multiple languages

**Priority:** MUST\
MiniMart shall support multiple UI languages without separate
application forks.

### NFR-LOC-002 --- Locale presentation

**Priority:** MUST\
Currency, date, time, number and address presentation shall be
configurable by store/country context.

### NFR-LOC-003 --- Receipt scripts

**Priority:** MUST\
Receipt rendering shall support required customer-facing scripts subject
to verified printer capability.

### NFR-LOC-004 --- Country-pack isolation

**Priority:** MUST\
Country-specific tax, rounding, document and compliance behavior shall
reside behind country-pack boundaries rather than fork the core product.

### NFR-LOC-005 --- Compliance verification gate

**Priority:** MUST\
A country rule shall not be represented as production-compliant solely
from assumption; current legal/tax/e-invoice behavior requires dated
authoritative verification.

## 12. Maintainability and architecture governance

### NFR-MAINT-001 --- Modular boundaries

**Priority:** MUST\
Business modules shall have explicit ownership and public interfaces.

### NFR-MAINT-002 --- No cross-module internal-table dependency

**Priority:** MUST\
One module shall not depend directly on another module's
private/internal tables as its functional integration contract.

### NFR-MAINT-003 --- Modular monolith baseline

**Priority:** MUST\
The initial backend remains a modular monolith; microservices require an
explicit later architectural decision.

### NFR-MAINT-004 --- ADR governance

**Priority:** MUST\
Material architecture changes require an ADR or equivalent approved
decision rather than silent implementation-agent divergence.

### NFR-MAINT-005 --- Migration review

**Priority:** MUST\
Production database migrations require explicit review and automated
verification.

### NFR-MAINT-006 --- Country extension stability

**Priority:** MUST\
Adding a country pack shall not require duplicating core retail modules.

## 13. Testability and release quality

### NFR-TEST-001 --- Protected domain tests

**Priority:** MUST\
Critical money, inventory, posting, reversal, credit, accounting-lite
and synchronization rules shall have automated tests.

### NFR-TEST-002 --- AI test guardrail

**Priority:** MUST\
AI coding agents shall not delete, weaken or bypass tests merely to make
a change pass.

### NFR-TEST-003 --- Failure-mode acceptance

**Priority:** MUST\
Crash, retry, concurrency, offline, hardware-failure and uncertain
external-payment/refund scenarios shall be included in acceptance
testing.

### NFR-TEST-004 --- Contract tests

**Priority:** MUST\
Public module/API/synchronization contracts shall have automated
compatibility/contract tests where appropriate.

### NFR-TEST-005 --- Country-pack regression

**Priority:** MUST\
Country-pack changes shall run common-core and relevant country
regression tests and shall not alter posted historical outcomes.

### NFR-TEST-006 --- Restore drill evidence

**Priority:** MUST\
Release/operations evidence shall include successful restore-drill
results according to the approved schedule.

## 14. Deployment and compatibility

### NFR-DEP-001 --- Store Node service

**Priority:** MUST\
Store Node shall support reliable Windows service operation and restart
behavior appropriate to store deployment.

### NFR-DEP-002 --- One-counter topology

**Priority:** MUST\
A one-counter deployment may run Store Node and PostgreSQL on the same
Windows PC without changing domain behavior.

### NFR-DEP-003 --- Multi-counter topology

**Priority:** MUST\
A multi-counter deployment shall support counters connecting over LAN to
the designated Store Node/database host.

### NFR-DEP-004 --- Signed/controlled update

**Priority:** MUST\
Production updates shall be controlled, versioned and recoverable;
incompatible schema/application combinations shall be detected.

### NFR-DEP-005 --- Hardware capability verification

**Priority:** MUST\
Required printer/scanner/scale/display capabilities shall be verified
against supported target hardware before production reliance.

## 15. Release-gate note

The following remain deployment or later-phase decisions rather than
invented numeric requirements: - exact production RPO/RTO; - exact
backup/log/audit retention periods; - exact supported peripheral
models/interfaces; - remote-support provider; - integrated payment
provider; - Phase-3 synchronization freshness/service-level targets; -
current Malaysia/India legal thresholds, rates and deadlines.

They must be approved in the relevant deployment/compliance
specification before becoming production release gates.
