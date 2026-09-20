# Sync Ownership and Apply Contract

## Rule

Every sync message type is registered with: - owner class; - producer
mode(s); - consumer mode(s); - contract version; - allowed target
module; - apply mode (`PROJECT_ONLY`, `MUTABLE_CONFIG`,
`MASTER_COMMAND`); - idempotency key/source identity; - whether a
resulting Outbox event is permitted.

Unregistered message types are rejected/quarantined.

## Store transactional facts

SalePosted, TenderPosted, Stock*, SalesReturnPosted, Refund settlement
facts, Credit*, CashMovement\*, Supplier/Financial posting facts
produced by Store Posting Envelopes are Store-origin facts. Cloud can
project/aggregate them; it cannot issue an incoming sync message that
rewrites the posted Store fact.

## Configuration/master data

Cloud-origin changes are accepted only where the message registry
declares cloud ownership and the target module exposes a compatible
command. Bidirectional master editing is not enabled by default; it
requires an explicit conflict/ownership decision.

## Apply atomicity

`InboxReceipt + allowed applied effect + Audit + resulting Outbox`
commit once.

## Compatibility

Message readers support declared compatible versions. Unknown breaking
versions are dead-lettered/quarantined. No partial field application is
allowed when required semantics are unknown.

## Security

Peer identity is authenticated. Tenant/store scope is verified against
enrollment and message authorization before Inbox claim.
