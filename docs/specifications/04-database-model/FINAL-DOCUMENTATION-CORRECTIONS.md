# MiniMart Database Model v1.2 --- Final Documentation Corrections

**Status:** APPLIED\
**Semantic database change:** NONE

## DBA-FRZ2-MIN-001 --- Snapshot schema version guidance

Applied. The active persistence-amendment and database-model documents
now state that:

-   `snapshot_schema_version` identifies the canonical snapshot schema
    used at posting time;
-   the owning posting module owns the versioned snapshot contract;
-   snapshot payload + version are committed atomically with the posted
    document;
-   historical snapshots are interpreted by their recorded version;
-   current master defaults/values must never be applied to reinterpret
    old snapshots;
-   later schema/master changes do not rewrite historical snapshots.

## DBA-FRZ2-MIN-002 --- Migration blueprint status

Applied. The v1.2 migration SQL is now explicitly labeled **MIGRATION
DESIGN BLUEPRINT --- NOT AN EXECUTABLE PRODUCTION MIGRATION**.

A production migration must be separately generated, human-reviewed,
tested on representative restored data, restore/rollback tested, and
schema-diff verified against the frozen reference DDL. Required backfill
and legacy-retirement obligations may not be skipped merely because they
are comments in the design blueprint.

## Result

Both non-semantic corrections from the Independent Final DB Amendment
Review are closed. No table, column, relationship, invariant, ownership
boundary, Posting Envelope, ledger, WAC, sync rule or decision seam was
changed by these corrections.


## Adoption

These corrections are incorporated into Database Model v1.2 FROZEN.
