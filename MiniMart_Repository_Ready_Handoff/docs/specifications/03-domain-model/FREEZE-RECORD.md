# MiniMart Domain Model v1.0 --- Freeze Record

**Status:** FROZEN\
**Frozen artifact:** MiniMart Domain Model v1.0\
**Upstream authority:** MiniMart FRS/NFRS v1.0 FROZEN\
**Freeze candidate:** Domain Model v0.2\
**Final review:** MM-DM-FRZ-REV-001

## Freeze statement

This baseline freezes the domain structure for the next design stages.

Downstream work may elaborate persistence, APIs and UI, but may not
silently change:

-   bounded-context ownership;
-   aggregate-root boundaries;
-   posting-envelope atomicity;
-   immutable posted-history behavior;
-   PaymentCommitment vs PostedTender separation;
-   SalesReturn vs RefundObligation/RefundExecution separation;
-   Item × Store inventory/WAC consistency;
-   explicit BusinessDate ownership;
-   concurrency consistency keys;
-   event producer/causality rules;
-   country-rule historical versioning;
-   Decision Register seams.

## Change control

If Database/API/UI implementation reveals a genuine domain
contradiction, create a proposed Domain Model amendment and trace it
back to the frozen FRS/Decision Register. Do not patch the invariant
only in code or schema.

OPEN, PROPOSED, VERIFY and DEFERRED decisions remain exactly that;
freezing the model does not approve them.
