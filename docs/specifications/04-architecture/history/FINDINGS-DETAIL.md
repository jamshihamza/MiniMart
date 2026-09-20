# Deep Architecture Findings

## ARCH-BLK-001 --- BLOCKER: Decision-seam traceability is not explicit

v0.1 states that open seams are preserved, but it does not provide a
60/60 architecture seam matrix tied to the frozen Decision IDs. A freeze
review cannot prove that no seam was accidentally resolved.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-BLK-002 --- BLOCKER: External-provider transaction choreography is ambiguous

The architecture says provider calls occur outside the DB transaction,
but does not define pre-call/post-call choreography for card/QR/refund
uncertainty, durable attempt/commitment state, crash points, and
reconciliation. This is critical to the frozen
PaymentAttempt/PaymentCommitment/PostedTender model.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-BLK-003 --- BLOCKER: Shared UnitOfWork boundary lacks a concrete module-safe persistence contract

v0.1 says coordinators share one transaction, but does not specify how
module-private repositories receive a transaction-scoped session without
exposing schemas or allowing accidental independent commits.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-BLK-004 --- BLOCKER: Store Node API trust/session model is incomplete

TLS/device enrollment are named, but the architecture does not define
counter identity, user session propagation, authorization context
resolution, replay/idempotency binding, or how LAN clients are prevented
from impersonating another counter.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-BLK-005 --- BLOCKER: Sync ownership/apply contract is under-specified

Outbox/inbox flow is described, but there is no explicit message
ownership matrix, apply-handler contract, schema/version compatibility
behavior, or rule preventing cloud-owned/configuration updates from
mutating store-owned transactional facts.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-BLK-006 --- BLOCKER: Upgrade compatibility gate is not operationally complete

Client/Store Node/schema compatibility ranges are mentioned, but
startup/rolling-upgrade choreography, write gating, expand-contract
sequencing, and rollback behavior across POS, Store Node, DB and sync
protocol are not specified.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-001 --- MAJOR: Read/query architecture is under-defined

Transactional module ownership is clear, but cross-module
search/reporting/read-model construction, freshness, rebuildability, and
whether Store Node queries may join schemas are not sufficiently
specified.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-002 --- MAJOR: BusinessContext resolution order and authority are incomplete

BusinessContext fields are listed, but exact resolution authority for
Tenant/Company/Store/Counter/User, BusinessDate and
CountryRuleSetVersion---and failure behavior when context cannot be
resolved---is not fully specified.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-003 --- MAJOR: Background worker concurrency/leadership is unspecified

Outbox, reconciliation and scheduled jobs exist, but
multi-process/duplicate-worker safety, leasing/locking, retry backoff
and shutdown semantics are not architecturally fixed.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-004 --- MAJOR: Database connection and transaction policy is incomplete

No pool sizing principle, transaction timeout/statement timeout, lock
timeout, cancellation, retry classification or connection-loss handling
is defined for Posting Envelopes.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-005 --- MAJOR: Observability lacks audit/telemetry separation and cardinality controls

Structured telemetry is listed, but security/audit evidence versus
operational logs, PII redaction, metric cardinality, retention and
correlation across desktop/Store Node/cloud are not sufficiently
bounded.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-006 --- MAJOR: Hardware command lifecycle is incomplete

Ports are defined, but device timeout/cancellation, printer
duplicate-risk, cash-drawer behavior, scanner/scale reconnect,
capability/version negotiation and hardware error taxonomy are missing.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-007 --- MAJOR: Configuration ownership and precedence are not specified

The runtime loads configuration, but local machine, store, company,
country-pack and cloud-delivered configuration precedence/versioning and
safe activation are not defined.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-008 --- MAJOR: Support/diagnostics architecture needs stronger isolation

Support sessions are time-limited/audited, but remote diagnostic access,
command allow-listing, elevation, secret/database access restrictions
and offline behavior are not concretely separated.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-009 --- MAJOR: Cloud-mode composition needs an explicit capability matrix

The same modular-monolith codebase is reused, but the exact Store-only,
Cloud-only and shared capabilities/workers are not enumerated, leaving
risk that cloud accidentally gains store posting authority.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MAJ-010 --- MAJOR: Reconciliation/rebuild ownership is not fully specified

Drift detection is mentioned, but the architecture does not define which
module owns each reconciliation, whether repair is rebuild-only or
compensating, and how repair is authorized/audited.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MIN-001 --- MINOR: API transport protocol naming is premature/inconsistent

The topology says HTTPS/LAN while deployment details do not define
certificate/discovery mechanics. Keep transport security mandatory but
defer concrete discovery/certificate profile to API/deployment contract.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MIN-002 --- MINOR: Monorepo package graph needs machine-enforceable boundary metadata

CI rules are described, but no concrete dependency tags/lint boundary
scheme is specified.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.

## ARCH-MIN-003 --- MINOR: Terminology for Customer & Credit package should be normalized

Documentation alternates between Customer & Credit and customer-credit;
this is understandable but should be normalized in the freeze candidate.

**Required remediation:** Add an explicit implementation architecture
contract and validation evidence without changing frozen domain/database
semantics or silently resolving an OPEN/VERIFY/DEFERRED/PROPOSED
decision.
