# MiniMart Backup & Recovery Functional Specification --- v0.6

**Document ID:** MM-FRS-BR-001\
**Requirement namespace:** `FR-BR-001`--`FR-BR-045`\
**Status:** Detailed Working Draft --- Batch 5

## Requirements

### FR-BR-001 --- Backup policy

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall have an explicit backup policy for store data and
applicable cloud data.

**Acceptance:** Deployment identifies what is backed up, frequency and
retention.

### FR-BR-002 --- Store database backup

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Authoritative store PostgreSQL data shall be backed up using an approved
recoverable method.

**Acceptance:** Backup can be located and validated.

### FR-BR-003 --- Configuration backup

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Required MiniMart configuration needed for recovery shall be included or
reproducibly restorable.

**Acceptance:** Recovered store can be reconfigured safely.

### FR-BR-004 --- Secrets handling

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Backups shall not expose plaintext secrets beyond approved secure
mechanism.

**Acceptance:** Backup storage does not become credential leak.

### FR-BR-005 --- Backup encryption

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Backup containing sensitive business/customer data shall be protected
appropriately at rest/in transit.

**Acceptance:** Unauthorized casual access is prevented.

### FR-BR-006 --- Backup schedule

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Backup execution shall follow configured schedule appropriate to
recovery objectives.

**Acceptance:** Missed schedule is detectable.

### FR-BR-007 --- Backup status

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

System health shall expose last successful backup and material failure
state.

**Acceptance:** Store/support can detect stale backup.

### FR-BR-008 --- Backup failure alert

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Repeated/material backup failure shall produce actionable operational
alert.

**Acceptance:** Failure is not silent.

### FR-BR-009 --- Backup while trading

**Source:** BR-REL-006\
**Priority:** MUST\
**Phase:** 1

Routine backup shall minimize trading interruption and preserve
transactional consistency.

**Acceptance:** Backup does not require normal checkout shutdown where
avoidable.

### FR-BR-010 --- Backup integrity check

**Source:** BR-REL-003\
**Priority:** MUST\
**Phase:** 1

Backup process shall include approved integrity/validity checks.

**Acceptance:** A file existing is not treated as proof of restorable
backup.

### FR-BR-011 --- Backup retention

**Source:** BR-REL-002\
**Priority:** MUST

**Decision Status:** OPEN\
**Phase:** 1/2

Retention periods shall be explicitly configured/approved based on
business/legal/storage needs.

**Acceptance:** No implementation agent invents retention.

### FR-BR-012 --- Backup rotation

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Retention/rotation shall avoid one failed/corrupt latest backup
destroying all recovery points.

**Acceptance:** Multiple recovery points exist per policy.

### FR-BR-013 --- Off-device copy

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Production store recovery design shall include backup outside the single
store database disk/device.

**Acceptance:** Single disk loss does not destroy every backup.

### FR-BR-014 --- Cloud/offsite copy

**Source:** BR-REL-002\
**Priority:** SHOULD\
**Phase:** 2

Where connectivity permits, protected offsite/cloud backup should reduce
site-loss risk.

**Acceptance:** Offline store operation does not wait for upload.

### FR-BR-015 --- Backup bandwidth tolerance

**Source:** BR-OPS-001\
**Priority:** SHOULD\
**Phase:** 2

Offsite backup/upload shall tolerate intermittent internet and resume
safely.

**Acceptance:** Connectivity loss does not corrupt local trading.

### FR-BR-016 --- Restore procedure

**Source:** BR-REL-003, BR-REL-005\
**Priority:** MUST\
**Phase:** 1

MiniMart shall document and support a controlled restore procedure.

**Acceptance:** Authorized support can recover from selected valid
backup.

### FR-BR-017 --- Restore authorization

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Restore/destructive recovery actions shall require elevated
authorization.

**Acceptance:** Ordinary cashier cannot overwrite store data.

### FR-BR-018 --- Restore target validation

**Source:** BR-REL-003\
**Priority:** MUST\
**Phase:** 1

Restore shall verify target/store identity and backup compatibility
before destructive steps.

**Acceptance:** Wrong-store restore risk is controlled.

### FR-BR-019 --- Restore version compatibility

**Source:** BR-REL-007\
**Priority:** MUST\
**Phase:** 1

Restore process shall define supported application/database version
compatibility and migration path.

**Acceptance:** Old backup is not blindly loaded into incompatible
version.

### FR-BR-020 --- Restore audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Restore/recovery actions shall be audited where system availability
permits.

**Acceptance:** Recovery event is traceable.

### FR-BR-021 --- Restore test

**Source:** BR-REL-004\
**Priority:** MUST\
**Phase:** 0/1

Backups shall be periodically restored in a test/recovery exercise.

**Acceptance:** Restorability is demonstrated, not assumed.

### FR-BR-022 --- Restore test evidence

**Source:** BR-REL-004\
**Priority:** MUST\
**Phase:** 1/2

Restore drill shall record backup used, outcome, duration and issues.

**Acceptance:** Operations can prove/test recovery.

### FR-BR-023 --- Recovery objectives

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 0/1

MiniMart shall define target RPO/RTO for store and cloud services before
production sign-off.

**Acceptance:** Backup frequency/recovery design can be evaluated.

### FR-BR-024 --- Store PC failure

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 1

Recovery procedure shall cover loss/failure of Store Node host.

**Acceptance:** Store can be rebuilt/restored on replacement host.

### FR-BR-025 --- Database failure

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 1

Recovery procedure shall cover PostgreSQL service/data failure.

**Acceptance:** Recovery chooses repair/restore without fabricating
transactions.

### FR-BR-026 --- POS terminal failure

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 1

Failure of one POS terminal in multi-counter store shall not require
restoring authoritative store database on that terminal.

**Acceptance:** Other counters remain isolated from terminal failure
where architecture permits.

### FR-BR-027 --- Network/LAN failure

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 1

Recovery guidance shall distinguish LAN/Store Node reachability failure
from internet/cloud outage.

**Acceptance:** Operator takes correct action.

### FR-BR-028 --- Internet outage

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Internet outage alone shall not trigger destructive restore/recovery.

**Acceptance:** Store continues local operation.

### FR-BR-029 --- Power interruption

**Source:** BR-OPS-005\
**Priority:** MUST\
**Phase:** 1

After power recovery, MiniMart shall verify service/database health and
transaction outcomes before normal trading resumes.

**Acceptance:** Committed transactions are not blindly reposted.

### FR-BR-030 --- Corruption detection

**Source:** BR-REL-003\
**Priority:** MUST\
**Phase:** 1

Material database/backup corruption indicators shall be surfaced and
handled by controlled recovery.

**Acceptance:** System does not silently continue on known unsafe state.

### FR-BR-031 --- Recovery mode status

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

If store is in recovery/degraded mode, authorized users shall see clear
status.

**Acceptance:** Degraded state is not mistaken for normal.

### FR-BR-032 --- Recovery read-only option

**Source:** BR-REL-005\
**Priority:** SHOULD\
**Phase:** 2

Where appropriate, recovery may expose read-only diagnostics/history
while posting remains blocked.

**Acceptance:** Investigation does not worsen corruption.

### FR-BR-033 --- No duplicate after restore

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1/3

Post-restore synchronization/retry shall use stable identities so
already-centralized transactions are not duplicated.

**Acceptance:** Recovery does not double financial/stock effects.

### FR-BR-034 --- Sync backlog preservation

**Source:** BR-DATA-006\
**Priority:** MUST\
**Phase:** 2/3

Recovery design shall preserve/reconstruct required synchronization
state or safely reconcile it.

**Acceptance:** Restored store does not silently lose unsynced business
data.

### FR-BR-035 --- Cloud recovery

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 2/3

Cloud services/database shall have independent managed backup/recovery
appropriate to central functions.

**Acceptance:** Store billing remains independent of cloud recovery.

### FR-BR-036 --- Update precondition

**Source:** BR-REL-007\
**Priority:** MUST\
**Phase:** 1

Risky schema/application updates shall verify required backup/recovery
readiness before proceeding.

**Acceptance:** Update does not knowingly remove recovery path.

### FR-BR-037 --- Update rollback boundary

**Source:** BR-REL-007\
**Priority:** MUST\
**Phase:** 1

Release process shall define when rollback is safe versus
forward-fix/migration required.

**Acceptance:** Operator does not restore old binaries against
incompatible data blindly.

### FR-BR-038 --- Historical data protection

**Source:** BR-REL-007\
**Priority:** MUST\
**Phase:** 1

Update/recovery shall preserve posted historical transactions and audit
meaning.

**Acceptance:** Upgrade does not rewrite history unexpectedly.

### FR-BR-039 --- Backup privacy

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 1

Backup access/export shall be controlled because backups may contain
customer/business data.

**Acceptance:** Backup is treated as sensitive data.

### FR-BR-040 --- Backup deletion control

**Source:** BR-REL-002\
**Priority:** MUST\
**Phase:** 1

Manual deletion/purge of protected backups shall require authorization
and retention rules.

**Acceptance:** Ordinary user cannot erase recovery history.

### FR-BR-041 --- Disaster recovery runbook

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 1

MiniMart deployment shall maintain a concise recovery runbook for common
store failure scenarios.

**Acceptance:** Support can follow deterministic steps.

### FR-BR-042 --- Recovery escalation

**Source:** BR-SUPT-001\
**Priority:** MUST\
**Phase:** 1

Runbook shall define when store staff stop and escalate to L1/L2
support.

**Acceptance:** Unsafe repair attempts are reduced.

### FR-BR-043 --- Recovery verification

**Source:** BR-REL-003\
**Priority:** MUST\
**Phase:** 1

After restore, MiniMart shall verify key store identity, database health
and representative business data before reopening posting.

**Acceptance:** Recovery success is validated.

### FR-BR-044 --- Recovery reconciliation

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 1/3

After major recovery, authorized process shall reconcile recent
sales/payments/stock/sync exceptions as appropriate.

**Acceptance:** Data gaps/duplicates are investigated.

### FR-BR-045 --- Backup/recovery acceptance suite

**Source:** BR-REL-002, BR-REL-004\
**Priority:** MUST\
**Phase:** 0/1

Release/operations tests shall cover backup failure, restore drill,
version compatibility, power recovery and post-restore idempotency.

**Acceptance:** Recovery capability is regression-tested.

## Principle

A backup is not considered successful merely because a file exists.
MiniMart operations require **restorable, tested recovery points** and
an explicit recovery procedure.
