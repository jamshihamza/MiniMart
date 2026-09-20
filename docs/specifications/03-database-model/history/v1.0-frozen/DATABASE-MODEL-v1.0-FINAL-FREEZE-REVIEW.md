# MiniMart Database Model v1.0 --- Final Freeze Review

**Document ID:** MM-DB-FRZ-001\
**Reviewed candidate:** MiniMart Database Model v0.2 Freeze Candidate\
**Upstream authority:** MiniMart Domain Model v1.0 FROZEN\
**Verdict:** **PASS --- DATABASE MODEL MAY BE FROZEN**

## Independent final-gate findings

The final gate rechecked the physical model rather than relying only on
the v0.2 validation. It found five technical enforcement gaps that did
**not** require a business-policy decision:

1.  `RefundExecution` lacked a physical tenant-safe FK to its
    Return-owned `RefundObligation`.
2.  `RefundExecution.settlement_source_key` lacked a UNIQUE guard.
3.  `RefundAttempt` lacked execution-scoped idempotency uniqueness.
4.  `PaymentCommitment` and `PostedTender` lacked physical tenant-safe
    FKs to their optional Payment-owned parent facts.
5.  `SupplierPaymentAllocation` lacked a tenant-safe FK to
    `SupplierPayable`.

All five are corrected in `REFERENCE-DDL-v1.0-FROZEN.sql`.

## Final gate

  Gate                                                   Result
  ------------------------------------------------------ --------
  74/74 logical tables represented                       PASS
  15 schemas retained                                    PASS
  35/35 aggregate roots mapped                           PASS
  60/60 Decision seams preserved                         PASS
  13/13 Posting Envelopes specified                      PASS
  Tenant-safe owned relationships                        PASS
  Item×Store inventory consistency                       PASS
  PaymentCommitment / PostedTender ownership             PASS
  RefundObligation / RefundExecution split               PASS
  Settlement source uniqueness                           PASS
  Concurrent Sale/GRN return serialization               PASS
  Inventory/Credit/Cash/Financial reconciliation         PASS
  Moving-WAC reproducibility                             PASS
  Append-only fact protection                            PASS
  Command idempotency                                    PASS
  Inbox/effect/Audit/Outbox atomicity                    PASS
  Outbox at-least-once / SKIP LOCKED                     PASS
  Lifecycle persistence matrix                           PASS
  Query/index coverage                                   PASS
  Migration compatibility/recovery                       PASS
  External provider calls outside local DB transaction   PASS
  OPEN/PROPOSED/VERIFY/DEFERRED decisions preserved      PASS

## Conclusion

No remaining known database-model blocker requires an upstream policy
decision. MiniMart Database Model v1.0 is approved for **FROZEN**
status.

Production migrations may refine physical PostgreSQL mechanics only if
they preserve this baseline. Changes to business ownership, atomicity,
ledger truth, costing, settlement semantics, historical meaning or
decision seams require formal change control.
