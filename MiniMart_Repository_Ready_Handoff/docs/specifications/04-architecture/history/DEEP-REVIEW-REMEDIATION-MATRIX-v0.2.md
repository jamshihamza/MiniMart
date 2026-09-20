# Deep Architecture Review → v0.2 Remediation Matrix

  -------------------------------------------------------------------------------------------------------------------------------
  Finding        Severity       v0.2 status    Evidence                                            Remediation
  -------------- -------------- -------------- --------------------------------------------------- ------------------------------
  ARCH-BLK-001   BLOCKER        REMEDIATED     traceability/DECISION-SEAM-ARCHITECTURE-MATRIX.md   Exact 60/60 Decision-ID matrix
                                                                                                   added; every row states the
                                                                                                   architecture seam and what
                                                                                                   remains undecided.

  ARCH-BLK-002   BLOCKER        REMEDIATED     docs/15-PROVIDER-CHOREOGRAPHY.md                    Durable attempt/execution
                                                                                                   identity, pre-call
                                                                                                   transaction, external call,
                                                                                                   success/failure/uncertain
                                                                                                   recording, crash recovery and
                                                                                                   reconciliation specified.

  ARCH-BLK-003   BLOCKER        REMEDIATED     docs/16-UOW-PERSISTENCE-CONTRACT.md                 Opaque UnitOfWorkSession and
                                                                                                   module-scoped repository
                                                                                                   sessions prohibit independent
                                                                                                   commit and cross-module
                                                                                                   repository access.

  ARCH-BLK-004   BLOCKER        REMEDIATED     docs/17-STORE-NODE-TRUST-SESSION.md;                Enrolled device → counter →
                                               docs/21-BUSINESS-CONTEXT-RESOLUTION.md              user session → authorization →
                                                                                                   server-resolved
                                                                                                   BusinessContext trust chain
                                                                                                   specified.

  ARCH-BLK-005   BLOCKER        REMEDIATED     docs/18-SYNC-OWNERSHIP-APPLY-CONTRACT.md            Message ownership classes,
                                                                                                   registry, allowed apply modes,
                                                                                                   immutable Store-fact
                                                                                                   protection and atomic inbox
                                                                                                   apply specified.

  ARCH-BLK-006   BLOCKER        REMEDIATED     docs/19-COMPATIBILITY-UPGRADE-MATRIX.md;            Compatibility ranges, write
                                               docs/13-DEPLOYMENT-PACKAGING-AND-UPDATES.md         gates, rolling upgrade,
                                                                                                   expand/contract and rollback
                                                                                                   constraints specified.

  ARCH-MAJ-001   MAJOR          REMEDIATED     docs/20-READ-QUERY-ARCHITECTURE.md                  Operational module queries
                                                                                                   separated from read-only
                                                                                                   cross-module reporting/search;
                                                                                                   projection authority/rebuild
                                                                                                   rules specified.

  ARCH-MAJ-002   MAJOR          REMEDIATED     docs/21-BUSINESS-CONTEXT-RESOLUTION.md              Resolution order/authority and
                                                                                                   fail-closed behavior
                                                                                                   specified.

  ARCH-MAJ-003   MAJOR          REMEDIATED     docs/22-WORKER-CONCURRENCY-AND-LEASING.md           Worker classes, leases,
                                                                                                   at-least-once/idempotency,
                                                                                                   retries and graceful shutdown
                                                                                                   specified.

  ARCH-MAJ-004   MAJOR          REMEDIATED     docs/23-DATABASE-RUNTIME-POLICY.md                  Pool principle, bounded
                                                                                                   transaction/statement/lock
                                                                                                   deadlines, cancellation and
                                                                                                   retry classification
                                                                                                   specified.

  ARCH-MAJ-005   MAJOR          REMEDIATED     docs/24-OBSERVABILITY-AUDIT-TELEMETRY.md            Audit/log/trace/metric
                                                                                                   channels separated; redaction,
                                                                                                   cardinality and retention
                                                                                                   seams specified.

  ARCH-MAJ-006   MAJOR          REMEDIATED     docs/25-HARDWARE-COMMAND-LIFECYCLE.md               Outcome/error taxonomy,
                                                                                                   timeout/unknown semantics,
                                                                                                   reconnect/capability/version
                                                                                                   and duplicate-print risk
                                                                                                   specified.

  ARCH-MAJ-007   MAJOR          REMEDIATED     docs/26-CONFIGURATION-OWNERSHIP-PRECEDENCE.md       Configuration classes, key
                                                                                                   ownership/scope descriptors
                                                                                                   and safe staged activation
                                                                                                   specified.

  ARCH-MAJ-008   MAJOR          REMEDIATED     docs/27-SUPPORT-DIAGNOSTICS-ISOLATION.md            Allow-listed SupportGateway,
                                                                                                   authorization, prohibited
                                                                                                   operations and offline
                                                                                                   behavior specified.

  ARCH-MAJ-009   MAJOR          REMEDIATED     docs/28-STORE-CLOUD-CAPABILITY-MATRIX.md            Store-only, cloud-only and
                                                                                                   shared capabilities explicitly
                                                                                                   enumerated; cloud Store
                                                                                                   Posting coordinators disabled.

  ARCH-MAJ-010   MAJOR          REMEDIATED     docs/29-RECONCILIATION-REBUILD-OWNERSHIP.md         Per-state reconciliation
                                                                                                   owner, immutable evidence and
                                                                                                   privileged rebuild path
                                                                                                   specified.

  ARCH-MIN-001   MINOR          REMEDIATED     docs/30-TRANSPORT-SECURITY-BOUNDARY.md;             Premature HTTPS/LAN wording
                                               docs/ARCHITECTURE-REFINEMENT.md                     replaced by authenticated
                                                                                                   encrypted Store API boundary;
                                                                                                   concrete discovery/certificate
                                                                                                   profile deferred.

  ARCH-MIN-002   MINOR          REMEDIATED     docs/31-DEPENDENCY-BOUNDARY-ENFORCEMENT.md          Package metadata and
                                                                                                   machine-enforced CI dependency
                                                                                                   graph rules specified.

  ARCH-MIN-003   MINOR          REMEDIATED     docs/01-MODULE-BOUNDARIES.md;                       Terminology normalized to
                                               docs/09-MONOREPO-AND-PACKAGE-STRUCTURE.md           Customer & Credit; filesystem
                                                                                                   package normalized to
                                                                                                   customer-and-credit.
  -------------------------------------------------------------------------------------------------------------------------------

## Result

-   Blockers: **6 / 6 remediated**
-   Major findings: **10 / 10 remediated**
-   Minor findings: **3 / 3 corrected**
-   Remaining known findings from MM-ARCH-REV-001: **0**
