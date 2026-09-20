# MiniMart API Contracts v1.0 --- Freeze Record

**Document ID:** MM-API-FRZ-001\
**Status:** **FROZEN / ADOPTED API CONTRACT AUTHORITY**

The v0.4 candidate passed the Independent Final API Freeze Review with
**0 blockers**, **0 major findings** and **2 non-semantic
freeze-packaging corrections**.

Freeze metrics: - Store operations: 234 - Sync operations: 4 - Cloud
operations: 5 - Posting Envelope coordinators: 13/13 - Decision seams:
60/60 - Functional requirements: 1,257/1,257 - Acceptance scenarios:
102/102 - NFRs: 84/84 - v0.3 final-review findings closed: 8/8

Both packaging corrections are now applied. No request/response
semantics, permissions, errors, Posting Envelope behavior, sync
ownership, persistence treatment or open decision seam changed during
final packaging.

Upstream authorities are BRD v1.0 FROZEN, FRS/NFRS v1.0 FROZEN, Domain
Model v1.0 FROZEN, Database Model v1.2 FROZEN and Architecture v1.0
FROZEN.

The OpenAPI 3.1 files under `openapi/` are the normative HTTP source.
The JSON Schemas under `contracts/` remain normative for Hardware,
Provider Adapter and Device Enrollment ports. Any future semantic change
requires controlled change review.
