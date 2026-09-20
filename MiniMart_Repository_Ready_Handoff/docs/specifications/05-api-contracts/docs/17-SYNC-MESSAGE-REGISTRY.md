# Sync Message Registry v0.2

Every sync message includes `messageId`, `messageType`,
`contractVersion`, `ownerClass`, tenant/store scope, source
mode/identity, occurred time, payload and optional
PostingEnvelope/correlation/causation identities.

**Registered message types:** 20.

STORE_TRANSACTION_FACT is project-only at Cloud and cannot be rewritten
by incoming Cloud commands. CLOUD_MANAGED_CONFIGURATION is versioned and
applied only through its owning handler. EXPLICITLY_VERSIONED_MASTER
uses the registered owner/apply contract; generic last-write-wins is
forbidden.

Unknown message type/version or ownership mismatch is
rejected/quarantined before domain apply.
