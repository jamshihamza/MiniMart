# MiniMart Support & Diagnostics Functional Specification --- v0.6

**Document ID:** MM-FRS-SUPT-001\
**Requirement namespace:** `FR-SUPT-001`--`FR-SUPT-045`\
**Status:** Detailed Working Draft --- Batch 5

## Requirements

### FR-SUPT-001 --- Support tiers

**Source:** BR-SUPT-001\
**Priority:** MUST\
**Phase:** 1

MiniMart support shall recognize Store Staff → L1 Support Partner → L2
MiniMart Technical Support → External Vendor escalation.

**Acceptance:** Cases can be routed without granting every tier full
privileges.

### FR-SUPT-002 --- Self-service status

**Source:** BR-SUPT-001\
**Priority:** MUST\
**Phase:** 1

Store staff shall see simple operational health and safe recovery
guidance for common issues.

**Acceptance:** Basic issues can be resolved without technical DB
access.

### FR-SUPT-003 --- Safe restart guidance

**Source:** BR-SUPT-001\
**Priority:** MUST\
**Phase:** 1

Support workflow shall identify safe service/app restart actions that do
not repost transactions.

**Acceptance:** Staff can recover common UI/device issues.

### FR-SUPT-004 --- Escalation criteria

**Source:** BR-SUPT-001\
**Priority:** MUST\
**Phase:** 1

MiniMart documentation/diagnostics shall define when issue should be
escalated.

**Acceptance:** Staff does not perform unsafe repair.

### FR-SUPT-005 --- System health summary

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall expose health for Store Node, database, cloud
connectivity/sync, backup and configured critical hardware where
detectable.

**Acceptance:** Support can identify failing layer.

### FR-SUPT-006 --- Store Node health

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

Health view shall show Store Node availability/version/status.

**Acceptance:** POS connectivity issue can be differentiated.

### FR-SUPT-007 --- Database health

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

Health shall indicate database connectivity and material health state
without exposing credentials.

**Acceptance:** DB failure is visible.

### FR-SUPT-008 --- Cloud connectivity health

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

Health shall distinguish internet/cloud connectivity from local-store
health.

**Acceptance:** Cloud outage is not confused with store outage.

### FR-SUPT-009 --- Sync health

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 2/3

Health shall show synchronization backlog/failure/dead-letter summary
when sync is enabled.

**Acceptance:** Stale central data is detectable.

### FR-SUPT-010 --- Backup health

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

Health shall show last successful backup and failure/staleness state.

**Acceptance:** Support can detect backup risk.

### FR-SUPT-011 --- Hardware health

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

Health shall summarize configured peripheral status where detectable.

**Acceptance:** Printer/scanner/etc. issues are localized.

### FR-SUPT-012 --- Application version

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

Diagnostics shall show MiniMart component versions/build identifiers.

**Acceptance:** Support can compare release state.

### FR-SUPT-013 --- Configuration summary

**Source:** BR-SUPT-003\
**Priority:** SHOULD\
**Phase:** 1

Diagnostics should show non-secret store/counter/configuration summary
relevant to support.

**Acceptance:** Misconfiguration can be identified.

### FR-SUPT-014 --- Diagnostic bundle

**Source:** BR-SUPT-002\
**Priority:** MUST\
**Phase:** 1/2

Authorized workflow shall create a bounded diagnostic bundle containing
approved logs/health/config metadata.

**Acceptance:** Support can investigate without raw unrestricted system
access.

### FR-SUPT-015 --- Diagnostic time range

**Source:** BR-SUPT-004\
**Priority:** MUST\
**Phase:** 1/2

User shall select or system shall bound diagnostic time range.

**Acceptance:** Bundle does not unnecessarily include all historical
data.

### FR-SUPT-016 --- PII minimization

**Source:** BR-SUPT-004\
**Priority:** MUST\
**Phase:** 1

Diagnostic bundle shall minimize/mask customer and personal data.

**Acceptance:** Routine support does not expose unnecessary PII.

### FR-SUPT-017 --- Secret redaction

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Diagnostics shall redact passwords, tokens, keys and prohibited payment
data.

**Acceptance:** Bundle is safe from known secret classes.

### FR-SUPT-018 --- Business data minimization

**Source:** BR-SUPT-004\
**Priority:** MUST\
**Phase:** 1

Diagnostic bundle shall include business document contents only when
necessary and authorized.

**Acceptance:** Support receives metadata before full business data.

### FR-SUPT-019 --- Bundle preview/description

**Source:** BR-SUPT-004\
**Priority:** SHOULD\
**Phase:** 2

Workflow should describe categories of data included before sharing.

**Acceptance:** Operator understands support data scope.

### FR-SUPT-020 --- Bundle identity

**Source:** BR-SUPT-005\
**Priority:** MUST\
**Phase:** 1/2

Generated diagnostic bundle shall have case/reference/time/source
identity.

**Acceptance:** Shared evidence is traceable.

### FR-SUPT-021 --- Support role

**Source:** BR-SUPT-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall provide a support role/capability set separate from
business administration.

**Acceptance:** Support diagnostics do not imply price/refund/user
privileges.

### FR-SUPT-022 --- Least privilege support

**Source:** BR-SUPT-002\
**Priority:** MUST\
**Phase:** 1

Support partner access shall be limited to required diagnostic/recovery
actions.

**Acceptance:** L1 cannot silently perform business overrides.

### FR-SUPT-023 --- Temporary elevation

**Source:** BR-SUPT-006\
**Priority:** MUST\
**Phase:** 2

Any elevated support access shall be time-limited and explicitly
authorized.

**Acceptance:** Privilege does not persist indefinitely.

### FR-SUPT-024 --- Support session identity

**Source:** BR-SUPT-006\
**Priority:** MUST\
**Phase:** 2

Remote/elevated support session shall identify support actor and store
authorization context.

**Acceptance:** Actions are attributable.

### FR-SUPT-025 --- Support session audit

**Source:** BR-SUPT-005\
**Priority:** MUST\
**Phase:** 2

Privileged support session start/end and material actions shall be
audited.

**Acceptance:** Remote intervention is reviewable.

### FR-SUPT-026 --- Remote support consent

**Source:** BR-SUPT-006\
**Priority:** MUST\
**Phase:** 2

Remote access shall require approved authorization/consent process
appropriate to deployment.

**Acceptance:** Support cannot silently connect.

### FR-SUPT-027 --- Remote support expiry

**Source:** BR-SUPT-006\
**Priority:** MUST\
**Phase:** 2

Remote access authorization shall expire/revoke according to policy.

**Acceptance:** Old support link cannot remain open indefinitely.

### FR-SUPT-028 --- Remote support no universal credential

**Source:** BR-SEC-005\
**Priority:** MUST\
**Phase:** 1

Remote support shall not rely on undocumented universal master password.

**Acceptance:** Access uses controlled identity/authorization.

### FR-SUPT-029 --- Read-only first

**Source:** BR-SUPT-002\
**Priority:** SHOULD\
**Phase:** 2

Support workflow should default to read-only diagnostics before
write/recovery actions.

**Acceptance:** Investigation minimizes risk.

### FR-SUPT-030 --- Protected write action

**Source:** BR-SUPT-005\
**Priority:** MUST\
**Phase:** 2

Any support action that changes configuration/data shall require
explicit capability, reason and audit.

**Acceptance:** Support changes are controlled.

### FR-SUPT-031 --- No direct financial edit

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

Support tools shall not provide hidden direct editing of posted
sales/payments/stock/credit.

**Acceptance:** Corrections use business workflows.

### FR-SUPT-032 --- Case reference

**Source:** BR-SUPT-005\
**Priority:** SHOULD\
**Phase:** 2

Support actions/bundles should be linkable to external/internal case
reference.

**Acceptance:** Investigation chain is easier to follow.

### FR-SUPT-033 --- Log levels

**Source:** BR-SUPT-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support approved operational log levels without requiring
permanent verbose sensitive logging.

**Acceptance:** Support can increase diagnostics temporarily if safe.

### FR-SUPT-034 --- Temporary verbose diagnostics

**Source:** BR-SUPT-004\
**Priority:** SHOULD\
**Phase:** 2

Enhanced diagnostics shall be time-bounded and privacy-aware.

**Acceptance:** Verbose mode does not remain indefinitely.

### FR-SUPT-035 --- Log retention

**Source:** BR-SUPT-004\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 2

Operational log retention shall be explicitly configured based on
support/privacy/storage needs.

**Acceptance:** No agent invents indefinite retention.

### FR-SUPT-036 --- Error correlation ID

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

User-facing serious errors should expose a non-sensitive
correlation/reference ID usable by support.

**Acceptance:** Support can find related diagnostics.

### FR-SUPT-037 --- Transaction-state diagnostic

**Source:** BR-DATA-005\
**Priority:** MUST\
**Phase:** 1

Support diagnostics shall help distinguish committed/not
committed/pending/uncertain transaction state without encouraging blind
repost.

**Acceptance:** Ambiguous incidents can be resolved safely.

### FR-SUPT-038 --- Payment diagnostic boundary

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1/3

Payment diagnostics shall expose state/reference but not prohibited card
credentials/provider secrets.

**Acceptance:** Support can reconcile safely.

### FR-SUPT-039 --- Sync diagnostic boundary

**Source:** BR-DATA-006\
**Priority:** MUST\
**Phase:** 2/3

Sync diagnostics shall expose backlog/error/idempotency references
without enabling casual event deletion.

**Acceptance:** Support can repair without hiding history.

### FR-SUPT-040 --- Backup diagnostic boundary

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Support can inspect backup status but destructive backup purge/restore
remains separately authorized.

**Acceptance:** Diagnostic role cannot erase recovery points.

### FR-SUPT-041 --- Health offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Local health/diagnostics shall remain available when cloud is
unavailable.

**Acceptance:** Internet outage can be diagnosed locally.

### FR-SUPT-042 --- Support offline bundle

**Source:** BR-SUPT-002\
**Priority:** MUST\
**Phase:** 1

Diagnostic bundle shall be savable locally for later transfer when
internet is unavailable.

**Acceptance:** Support evidence is not lost.

### FR-SUPT-043 --- External vendor sharing

**Source:** BR-SUPT-004\
**Priority:** MUST\
**Phase:** 2

Before sharing diagnostics with external vendor, MiniMart process shall
minimize data and use approved scope.

**Acceptance:** Vendor receives only necessary evidence.

### FR-SUPT-044 --- Support knowledge/runbook

**Source:** BR-SUPT-001\
**Priority:** MUST\
**Phase:** 1

Common incidents shall have concise runbook guidance with safe steps and
escalation.

**Acceptance:** L1 response is consistent.

### FR-SUPT-045 --- Support acceptance suite

**Source:** BR-SUPT-001, BR-SUPT-006\
**Priority:** MUST\
**Phase:** 1/2

Tests shall cover health visibility, bundle redaction, least privilege,
remote-session expiry/audit, offline diagnostics and protected actions.

**Acceptance:** Support controls are regression-tested.

## Support model

`Store Staff → L1 Support Partner → L2 MiniMart Technical Support → External Vendor`

Support capability does not equal business-administrator capability.
