# Background Worker Concurrency and Leasing --- v0.3

## Worker classes

-   Outbox dispatcher --- PostgreSQL `FOR UPDATE SKIP LOCKED`
    claim/lease.
-   Inbox receiver/apply --- unique InboxReceipt + transaction.
-   Reconciliation jobs --- one logical job lease per scope;
    module-specific read/recompute.
-   Scheduled operational jobs --- **pg-boss**, using stable job
    identity and bounded retry.
-   Backup/support tasks --- separate operational capability with
    authorization.

pg-boss is the approved Store Node job-queue baseline. Replacing it
requires an ADR; `Redis/BullMQ` is not introduced at the Store Node by
default.

## Duplicate safety

Workers assume at-least-once execution. Business effects require stable
source/idempotency uniqueness. A lease prevents normal duplicate work
but correctness never relies solely on a lease.

## Retry

Retry uses classified transient errors with bounded backoff/jitter.
Business validation/final failures are not endlessly retried. Exact
retry counts/intervals remain operational configuration unless frozen
elsewhere.

## Shutdown

On service stop: 1. stop claiming new work; 2. cancel/finish work at
safe boundaries; 3. commit or roll back current DB transaction; 4.
release lease or allow bounded expiry; 5. never acknowledge work whose
effect did not commit.
