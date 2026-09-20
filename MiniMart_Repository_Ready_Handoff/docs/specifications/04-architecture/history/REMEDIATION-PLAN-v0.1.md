# Architecture Remediation Plan

The v0.2 Freeze Candidate should remediate the review in this order:

1.  Create a **60/60 Architecture Decision-Seam Matrix** using the exact
    frozen Decision IDs and state how each seam is represented without
    selecting a policy.
2.  Define **external provider choreography** for payment/refund:
    durable attempt before/after call as appropriate, uncertainty,
    recovery, reconciliation, idempotency and crash points.
3.  Define a concrete **transaction-scoped repository session /
    UnitOfWork** pattern that preserves module ownership while
    guaranteeing one commit.
4.  Define **Store Node authentication/trust context**: device
    enrollment, counter identity, user session, permission/override
    resolution, idempotency binding and anti-impersonation.
5.  Define **sync ownership and apply contracts**, including message
    compatibility, store-owned facts, cloud-owned/configuration facts
    and atomic inbox application.
6.  Define the **client/Store Node/schema/sync compatibility matrix**
    and expand-contract upgrade choreography.
7.  Add query/read-model architecture and rebuild/freshness rules.
8.  Complete BusinessContext resolution authority and failure behavior.
9.  Specify worker leasing, retry/backoff and graceful shutdown.
10. Specify DB pool/timeout/retry/cancellation rules for Posting
    Envelopes.
11. Separate audit/security evidence from telemetry and add
    redaction/cardinality/retention boundaries.
12. Complete hardware lifecycle/error contracts.
13. Define configuration precedence/version/activation.
14. Harden support/diagnostics isolation.
15. Add Store-vs-Cloud capability matrix.
16. Define reconciliation/rebuild ownership and authorization.
17. Correct the three minor documentation/enforcement issues.

After remediation, rerun: - 13/13 module coverage; - 13/13 Posting
Envelope coverage; - 60/60 Decision seam coverage; - Store/Cloud
authority matrix; - provider crash-point matrix; - sync ownership
matrix; - compatibility/upgrade matrix; - dependency-cycle/static
boundary checks; - failure-mode completeness.
