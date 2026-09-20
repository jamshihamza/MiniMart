# MiniMart Architecture Refinement v0.1 --- Deep Consistency Review

**Document ID:** MM-ARCH-REV-001\
**Reviewed baseline:** MiniMart Architecture Refinement v0.1\
**Upstream authorities:** MiniMart Domain Model v1.0 FROZEN; MiniMart
Database Model v1.0 FROZEN\
**Verdict:** **NOT READY TO FREEZE**

## Executive result

The v0.1 refinement is directionally consistent with the frozen MiniMart
model, but the deep review found **6 blockers, 10 major findings and 3
minor findings**.

The principal problem is not the chosen stack or topology. It is that
several high-risk runtime contracts are still expressed as principles
rather than enforceable architecture: payment/refund provider
choreography, transaction-scoped repository composition, Store Node
trust/session propagation, sync ownership/application, compatibility
during upgrades, and explicit 60/60 Decision-seam traceability.

No frozen business/domain/database rule should be changed to fix these
findings.

## Confirmed consistency

  ------------------------------------------------------------------------
  Area                     Result                  Review conclusion
  ------------------------ ----------------------- -----------------------
  Frozen topology          PASS                    Store Node + local
  preserved                                        PostgreSQL remains the
                                                   store transactional
                                                   authority; cloud is
                                                   asynchronous.

  Bounded-context/module   PASS                    13/13 business contexts
  count                                            are represented as
                                                   modules.

  Posting-envelope         PASS                    13/13 frozen Posting
  coverage                                         Envelopes have
                                                   coordinator names.

  Database ownership       PASS                    Architecture forbids
                                                   cross-module
                                                   internal-table writes
                                                   and preserves
                                                   module-private
                                                   persistence.

  Atomicity                PASS                    Audit + Outbox remain
                                                   participants in the
                                                   same local Posting
                                                   Envelope transaction.

  Provider isolation       PASS                    Architecture explicitly
                                                   prohibits external
                                                   network/provider calls
                                                   while the local DB
                                                   transaction is open.

  Offline-first behavior   PASS                    Cloud outage does not
                                                   block store posting.

  Hardware isolation       PASS                    Counter hardware is
                                                   behind Tauri/Rust ports
                                                   rather than embedded in
                                                   business modules.

  Country isolation        PASS                    Country packs are
                                                   policy plugins rather
                                                   than country source
                                                   forks.

  SQLite survival mode     PASS                    Correctly remains
                                                   deferred rather than
                                                   silently introduced.

  Microservices            PASS                    Correctly not
                                                   introduced.

  Frozen DB physical       PASS                    Architecture does not
  baseline                                         replace PostgreSQL,
                                                   immutable ledgers,
                                                   Item×Store inventory or
                                                   moving WAC.
  ------------------------------------------------------------------------

## Findings

  ------------------------------------------------------------------------
  ID                      Severity                Finding
  ----------------------- ----------------------- ------------------------
  ARCH-BLK-001            BLOCKER                 Decision-seam
                                                  traceability is not
                                                  explicit

  ARCH-BLK-002            BLOCKER                 External-provider
                                                  transaction choreography
                                                  is ambiguous

  ARCH-BLK-003            BLOCKER                 Shared UnitOfWork
                                                  boundary lacks a
                                                  concrete module-safe
                                                  persistence contract

  ARCH-BLK-004            BLOCKER                 Store Node API
                                                  trust/session model is
                                                  incomplete

  ARCH-BLK-005            BLOCKER                 Sync ownership/apply
                                                  contract is
                                                  under-specified

  ARCH-BLK-006            BLOCKER                 Upgrade compatibility
                                                  gate is not
                                                  operationally complete

  ARCH-MAJ-001            MAJOR                   Read/query architecture
                                                  is under-defined

  ARCH-MAJ-002            MAJOR                   BusinessContext
                                                  resolution order and
                                                  authority are incomplete

  ARCH-MAJ-003            MAJOR                   Background worker
                                                  concurrency/leadership
                                                  is unspecified

  ARCH-MAJ-004            MAJOR                   Database connection and
                                                  transaction policy is
                                                  incomplete

  ARCH-MAJ-005            MAJOR                   Observability lacks
                                                  audit/telemetry
                                                  separation and
                                                  cardinality controls

  ARCH-MAJ-006            MAJOR                   Hardware command
                                                  lifecycle is incomplete

  ARCH-MAJ-007            MAJOR                   Configuration ownership
                                                  and precedence are not
                                                  specified

  ARCH-MAJ-008            MAJOR                   Support/diagnostics
                                                  architecture needs
                                                  stronger isolation

  ARCH-MAJ-009            MAJOR                   Cloud-mode composition
                                                  needs an explicit
                                                  capability matrix

  ARCH-MAJ-010            MAJOR                   Reconciliation/rebuild
                                                  ownership is not fully
                                                  specified

  ARCH-MIN-001            MINOR                   API transport protocol
                                                  naming is
                                                  premature/inconsistent

  ARCH-MIN-002            MINOR                   Monorepo package graph
                                                  needs
                                                  machine-enforceable
                                                  boundary metadata

  ARCH-MIN-003            MINOR                   Terminology for Customer
                                                  & Credit package should
                                                  be normalized
  ------------------------------------------------------------------------

## Freeze verdict

Architecture v0.1 must **not** be frozen. Remediate all BLOCKER and
MAJOR findings into **MiniMart Architecture Refinement v0.2 Freeze
Candidate**, then perform a final Architecture Freeze Review.

Minor findings should also be corrected where they do not require an
unresolved product-policy decision.
