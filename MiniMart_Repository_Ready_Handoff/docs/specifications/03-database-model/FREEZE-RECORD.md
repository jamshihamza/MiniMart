# MiniMart Database Model v1.2 --- Freeze Record

**Document ID:** MM-DB-FRZ-002\
**Status:** **FROZEN / ADOPTED PERSISTENCE AUTHORITY**\
**Supersedes for downstream persistence design:** MiniMart Database
Model v1.0 FROZEN\
**Controlled amendment lineage:** v1.1 Amendment Candidate → v1.1
Independent Consistency Review → v1.2 Amendment Candidate → v1.2
Independent Final Amendment Review → v1.2 Freeze-Ready → v1.2 FROZEN

## Freeze basis

The v1.2 amendment passed the Independent Final DB Amendment Review
with:

-   0 blockers;
-   0 major findings;
-   2 non-semantic documentation corrections;
-   10/10 prior v1.1 findings closed;
-   15/15 schemas preserved;
-   79/79 logical tables represented;
-   60/60 frozen decision seams preserved.

Both required documentation corrections were subsequently applied and
validated with zero semantic database changes.

## Frozen authority

From this freeze forward, `schema/REFERENCE-DDL-v1.2-FROZEN.sql` is the
database persistence authority for downstream MiniMart API Contracts, UI
Specification, backlog and implementation work.

The frozen v1.0 package remains historical evidence and lineage. Where
v1.2 intentionally amends v1.0 persistence, v1.2 governs.

## Invariants preserved

This freeze does not change the already-frozen business semantics for:

-   PostgreSQL Store authority;
-   modular schema ownership;
-   exact numeric money/quantity;
-   UUIDv7 application-generated identities;
-   immutable posted financial/stock facts;
-   reversal instead of destructive correction;
-   Item × Store moving weighted-average cost;
-   Posting Envelope atomicity;
-   Audit + Outbox in the same local transaction;
-   idempotency and sync ownership;
-   country-policy version preservation;
-   all 60 non-resolved/verification decision seams.

## Amendment additions now frozen

The adopted persistence model includes:

-   versioned historical Company/Store/Customer/Supplier snapshots on
    posted documents;
-   canonical Item-UoM role references;
-   explicit Item `stock_managed` authority;
-   canonical repeatable Company/Supplier/Customer identifier
    structures;
-   Supplier contacts and commercial terms;
-   Store receipt/contact/language persistence;
-   pricing reference/tax-context/change-reason persistence;
-   Customer/Credit additions required by frozen requirements;
-   Return reason/note persistence;
-   Supplier-payment source validation;
-   normalized identifier search indexes;
-   durable `integration.store_service_instances` technical persistence.

## Migration rule

`schema/V1_2__final_persistence_alignment.sql` remains a **migration
design blueprint**, not an executable production migration. Production
migrations must be separately generated, human-reviewed, tested against
representative restored data, restore/rollback tested, and schema-diff
verified against the frozen reference DDL.

## Change control

Any future semantic change to this frozen database authority requires
explicit controlled change review. Coding agents must not silently add,
remove, reinterpret or bypass frozen persistence structures or
invariants.
