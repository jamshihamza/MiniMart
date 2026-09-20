# MiniMart FRS v1.0 --- Final Freeze Review

**Document ID:** MM-FRS-FREEZE-001\
**Status:** APPROVED/FROZEN BASELINE\
**Freeze date:** 2026-09-20\
**Successor stage:** Domain Model v0.1

## 1. Freeze decision

The MiniMart FRS/NFRS package has completed its final freeze review.

**Result: PASS --- FRS v1.0 is frozen and may be used as the
authoritative source for the Domain Model.**

This freeze does not mean every deployment, country, hardware or
later-phase policy has been decided. It means the functional semantics
required to begin domain modeling are sufficiently defined, internally
consistent and governed.

## 2. Frozen scope

The frozen baseline contains:

-   1,257 functional requirements;
-   22 functional namespaces;
-   84 non-functional requirements;
-   102 acceptance scenarios;
-   BRD traceability;
-   consolidated decision governance;
-   Accounting-Lite boundary;
-   country-behavior boundary;
-   freeze/remediation audit history.

## 3. Final validation result

  Validation                                        Result
  ----------------------------------------------- --------
  Duplicate FR IDs                                       0
  FR numbering gaps                                      0
  Invalid explicit BRD references                        0
  Missing direct Source metadata                         0
  Missing requirement-level Acceptance metadata          0
  Non-standard Priority values                           0
  Non-standard Phase values                              0
  Duplicate NFR IDs                                      0
  Duplicate acceptance scenario IDs                      0
  Prior-product-name references                          0

## 4. Frozen domain-semantic invariants

The Domain Model shall preserve these v1.0 invariants unless an approved
post-freeze change explicitly supersedes them:

1.  Store trading is offline-first; cloud is not in the checkout
    critical path.
2.  Item, Supplier and Customer identities are company/tenant-wide.
3.  Stock, moving WAC and selling-price assignment are store-scoped.
4.  Initial operational inventory costing is moving weighted-average
    cost per Item per Store.
5.  Phase-1 negative stock is blocked.
6.  Payment Attempt/Payment Commitment is distinct from Posted Tender.
7.  Final local Sale posting atomically commits the required local Sale,
    stock, posted Tender, audit and outbox effects.
8.  Confirmed external money that precedes local Sale posting must
    remain recoverable and must never be silently charged again.
9.  A posted Return may own an outstanding Refund Obligation; later
    refund settlement cannot repost inventory.
10. Posted financial/stock history is immutable and corrected by
    explicit reversal/correction.
11. Basic Customer Credit belongs to the Phase-1/2 baseline.
12. Accounting-Lite is an operational financial layer, not a claim of
    full statutory/general-ledger accounting.
13. Country behavior is isolated behind country packs and has
    version/effective historical identity.
14. Current legal/compliance values require authoritative verification
    before production implementation.
15. Retry/recovery must be idempotent for money, stock, accounting and
    synchronization effects.

## 5. Open decisions accepted at freeze

The following categories may remain open because they are bounded
policies, implementation choices, later-phase capabilities or
verification gates rather than missing core domain semantics:

-   business-date rollover and exceptional day-close policies;
-   human document-number scope;
-   held-sale repricing;
-   stock-count concurrency;
-   batch depletion / FEFO behavior;
-   no-receipt return policy;
-   mixed-tender refund allocation;
-   credit-limit violation/override policy;
-   hardware models/interfaces;
-   integrated payment/provider selection;
-   remote-support provider;
-   backup RPO/RTO/retention values;
-   current Malaysia/India legal/tax/e-invoice values.

The Domain Model must expose appropriate policy boundaries and must not
invent these values.

## 6. Post-freeze change control

After this freeze, changes fall into four classes:

### Editorial

Typographical/clarity changes with no semantic effect. May be
incorporated with traceability.

### Decision resolution

Resolution of an existing `OPEN`/`VERIFY` decision. Update the Decision
Register and affected downstream artifacts.

### Functional change

New/changed behavior. Requires impact analysis across FRS, Domain Model,
database/API/UI/backlog and tests.

### Architectural invariant change

Any change to ownership, immutability, costing, posting atomicity,
payment/refund recovery, offline-first operation or country-pack
isolation requires an ADR plus explicit FRS version change.

No coding agent may silently modify the frozen semantics.

## 7. Domain Model handoff

The Domain Model shall now derive from FRS v1.0 in this order:

1.  bounded contexts / module boundaries;
2.  aggregates and aggregate roots;
3.  entities and stable identities;
4.  value objects;
5.  lifecycle/state machines;
6.  domain invariants;
7.  domain services/policies;
8.  domain events;
9.  cross-module contracts;
10. unresolved decision seams.

Database tables, ORM entities and API DTOs must **not** be treated as
the Domain Model itself.

## 8. Final gate

**FRS v1.0: FROZEN.**\
**Domain Model v0.1: AUTHORIZED TO START.**
