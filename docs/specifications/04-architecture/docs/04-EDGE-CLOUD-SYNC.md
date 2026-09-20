# Edge / Cloud Sync Architecture --- v0.3

## Message contract

Every sync message carries:
`messageId/eventId, messageType, contractVersion, ownerClass, tenantId, storeId where applicable, aggregate/source identity, occurredAt, correlationId, causationId, postingEnvelopeId where applicable, payload`.

## Ownership classes

1.  **STORE_TRANSACTION_FACT** --- immutable Store-origin business fact.
    Cloud may deduplicate, validate, project and aggregate; it cannot
    command the Store to rewrite the fact.
2.  **CLOUD_MANAGED_CONFIGURATION** --- versioned configuration
    explicitly declared cloud-owned. Store applies only through the
    owning module/config handler and only if compatible.
3.  **STORE_MANAGED_CONFIGURATION** --- store-owned configuration
    replicated outward; cloud cannot overwrite it.
4.  **EXPLICITLY_VERSIONED_MASTER** --- company/master data whose write
    owner is defined by its message contract. If ownership/conflict
    policy is not approved, bidirectional write is disabled rather than
    resolved by last-write-wins.

## Incoming apply contract

For a cloud→store message: 1. authenticate peer and validate
tenant/store scope; 2. validate message type/version and ownership
class; 3. claim InboxReceipt; 4. invoke the declared module application
handler; 5. apply only permitted mutable/config/master state; 6. append
Audit and any resulting Outbox; 7. mark InboxReceipt applied; 8. commit
once.

A sync handler cannot update posted Sales, StockMovements,
PostedTenders, CreditLedgerEntries, CashMovements, FinancialMovements or
other immutable Store facts.

## Compatibility

Unknown breaking contract version is quarantined/dead-lettered and does
not partially apply. Additive compatible fields may be ignored by older
readers according to the contract version rules.

## Delivery

Outbox is at-least-once. Network publication occurs outside claim
transactions. Cloud/store consumers deduplicate by stable message
identity. Checkpoints optimize progress only.
