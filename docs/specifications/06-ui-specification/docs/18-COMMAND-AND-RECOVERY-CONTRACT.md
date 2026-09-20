# 18 --- Command & Recovery Contract

For every API mutation: 1. generate/preserve one logical command
identity; 2. disable accidental duplicate submission while response is
pending; 3. on lost response, query/retry using the same idempotency
identity; 4. treat validation/permission/conflict as explicit outcomes;
5. never create a new payment/refund attempt merely because the client
timed out; 6. show posted identity only after authoritative success; 7.
post-commit print/sync failure is shown as a follow-up problem, not
transaction rollback.

External provider states STARTED/PENDING/FAILED/UNCERTAIN/COMMITTED
remain distinct.
