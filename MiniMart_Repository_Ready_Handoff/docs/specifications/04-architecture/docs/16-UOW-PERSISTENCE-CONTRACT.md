# UnitOfWork and Module-Safe Persistence Contract

## Types

`UnitOfWork` --- infrastructure owner of begin/commit/rollback.\
`UnitOfWorkSession` --- opaque transaction capability valid only inside
one callback.\
`ModuleRepositorySession` --- module-scoped repository factory bound to
that UnitOfWorkSession.\
`TransactionContext` --- non-SQL metadata: transaction ID,
BusinessContext, cancellation/deadline.

## Invariants

-   only UnitOfWork can commit/rollback;
-   repositories cannot obtain the global pool while participating in an
    envelope;
-   one Posting Envelope = one UnitOfWorkSession;
-   module A cannot resolve module B's repositories;
-   coordinators call public module application ports;
-   domain objects never see SQL/transaction handles;
-   Audit/Outbox/idempotency participants bind to the same session;
-   nested Posting Envelopes are rejected; an inner operation must join
    the existing session through an approved public port.

## Query separation

Read-only query services outside a Posting Envelope may use independent
read sessions. They cannot be used to make a posting decision that
requires the transaction's locked/revalidated state.

## Test contract

Architecture tests must prove: - an injected repository cannot
independently commit; - rollback removes every same-envelope local
effect; - Audit/Outbox do not survive a failed envelope; - no module
imports another module's repository adapter.
