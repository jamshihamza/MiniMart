# Database Runtime Policy

## Pool

One Store Node pool serves transactional and bounded query work. Pool
capacity is configured from expected store concurrency and PostgreSQL
resources; architecture does not hard-code an arbitrary connection
count.

## Posting Envelope transaction policy

-   PostgreSQL READ COMMITTED baseline.
-   bounded transaction deadline;
-   bounded statement timeout;
-   bounded lock timeout;
-   cancellation propagated from application deadline where safe;
-   deterministic lock order and sorted IDs;
-   no network/provider wait inside transaction.

Exact timeout values are operational tuning parameters validated under
multi-counter load.

## Retry classification

Automatic retry is allowed only for explicitly classified transient
database failures and only when the command is protected by the same
idempotency key. Validation, authorization, unique business conflict and
policy failures are not blind-retried.

A provider side effect is never repeated because of a database retry.

## Connection loss

Before commit: outcome is rollback/unknown until DB confirms; retry
through idempotency.\
After commit but response lost: idempotency returns/reconstructs
committed result.

## Long reads

Reporting/search must be bounded/paged and must not keep write locks
open. Heavy cloud analytics do not run against the Store Node
transaction path.
