# Sync, Idempotency, Inbox and Outbox --- v1.2 Amendment Candidate

## Command idempotency state machine

`CLAIMED → COMPLETED` or `CLAIMED → FAILED_RETRYABLE/FAILED_FINAL`

Claim algorithm: 1. `INSERT ... ON CONFLICT DO NOTHING` on
`(tenant_id, operation_scope, idempotency_key)`. 2. If inserted, this
request owns the claim. 3. If existing, lock the record and compare
`request_fingerprint`. 4. Fingerprint mismatch = reject key reuse. 5.
`COMPLETED` = return stored safe result. 6. active `CLAIMED` =
return/await in-progress result according to command transport policy;
do not execute again. 7. retryable abandoned claim may be reclaimed only
by explicit lease/timeout rule.

The idempotency result and business transaction outcome are finalized
atomically where the command is local.

## Inbox atomicity

For an incoming sync command/message, **InboxReceipt + applied business
effect + resulting Audit + resulting Outbox** commit in one transaction.

Pattern: - attempt to insert `(tenant_id, peer_id, message_id)`; - if
duplicate and already applied, return prior result; - if newly claimed,
apply the incoming effect in the same transaction; - mark receipt
applied; - commit once.

A crash cannot durably record "applied" without the effect, or commit
the effect without durable dedup evidence.

## Outbox dispatch

Outbox is at-least-once.

Worker batch claim: `SELECT ... FOR UPDATE SKIP LOCKED` ordered by
`available_at, created_at`.

Within a short claim transaction, rows receive worker/lease metadata.
Network publication occurs outside the transaction. Successful publish
records `published_at`. Crash-after-publish may cause duplicate
delivery; consumers deduplicate by `event_id/message_id`.

## Dead letters

After bounded retry policy, preserve original identity/payload
hash/failure evidence in dead-letter state. Never delete the business
fact.

## Sync checkpoint

Checkpoint is progress optimization only; correctness relies on
immutable identity and inbox dedup.
