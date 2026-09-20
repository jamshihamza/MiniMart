# MiniMart Domain Model v1.0 --- FROZEN

**Document set:** MM-DM-001-FROZEN\
**Status:** **FROZEN BASELINE**\
**Source authority:** MiniMart FRS/NFRS v1.0 FROZEN\
**Freeze predecessor:** Domain Model v0.2 Freeze Candidate\
**Final freeze review:** MM-DM-FRZ-REV-001

## Frozen baseline

-   13 bounded contexts
-   35 aggregate roots
-   1,257 frozen FRs / 22 FRS namespaces traced
-   60/60 non-resolved or verification Decision Register seams preserved
-   0 remaining Domain Model freeze blockers
-   0 remaining major consistency findings

## What is frozen

The following are authoritative for downstream design:

-   bounded-context ownership;
-   aggregate-root boundaries;
-   company/store scope rules;
-   Sale/Payment and Return/Refund lifecycle separation;
-   local Posting Envelope semantics;
-   stock/WAC ownership;
-   immutable posted-history model;
-   business concurrency consistency keys;
-   event producer/causality rules;
-   cross-context orchestration boundaries;
-   Accounting-Lite ownership;
-   country-rule version/effective boundary;
-   unresolved decision seams.

## What is not frozen by this document

The Domain Model does not choose:

-   PostgreSQL tables/indexes/locks;
-   API endpoints/DTOs;
-   UI screens;
-   exact sync wire format;
-   exact provider/hardware products;
-   current legal/tax values still marked VERIFY;
-   OPEN/PROPOSED/DEFERRED business-policy decisions.

## Next stage

**MiniMart Database Model v0.1**

Database design must implement this frozen model without silently
changing its invariants.
