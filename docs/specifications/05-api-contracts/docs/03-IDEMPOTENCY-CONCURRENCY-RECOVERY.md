# Idempotency, Concurrency and Recovery v0.3

Every mutation command uses `Idempotency-Key`. The Store Node
fingerprints the trusted tenant + operation + normalized request. Same
key + same fingerprint replays the recorded result while retained; same
key + different fingerprint returns
`IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST`.

The server publishes `Idempotency-Expires-At` on successful idempotent
commands and publishes the current `retentionSeconds` through
`CapabilitiesResult.idempotencyPolicy`. No universal business-policy
duration is invented by this contract. Purging an idempotency record
must not disable independent domain duplicate guards such as stable
source identity, provider settlement identity, posted-document identity
or immutable source uniqueness.

After the published retention boundary, the transport key may be
accepted as new only subject to those domain duplicate guards. Provider
calls are never repeated merely because a DB retry or transport retry
occurred.

Mutable-resource commands use `If-Match` where required. A stale version
fails with `STALE_RESOURCE_VERSION`/precondition failure rather than
silently overwriting.

Provider uncertainty remains explicit: reconcile the same stable
provider request identity; do not blindly charge/refund again.
