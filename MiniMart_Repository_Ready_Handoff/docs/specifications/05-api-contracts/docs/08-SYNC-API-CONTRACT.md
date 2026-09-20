# Edge / Cloud Sync Contract

Sync uses `/sync/v1` with authenticated peer identity.

Routes: push, pull, ack and compatibility. Delivery is at least once.
Duplicate delivery is expected and deduplicated by stable message
identity.

Message envelope carries message type/version, tenant/store scope,
source mode/identity, timestamp, payload and optional
PostingEnvelope/correlation/causation identity.

Transport does not decide ownership. The frozen registry decides
PROJECT_ONLY, MUTABLE_CONFIG or MASTER_COMMAND behavior. Store-origin
posted facts cannot be rewritten by incoming cloud sync.

`InboxReceipt + allowed effect + Audit + resulting Outbox` commit
atomically. Unknown breaking versions are quarantined/dead-lettered.
