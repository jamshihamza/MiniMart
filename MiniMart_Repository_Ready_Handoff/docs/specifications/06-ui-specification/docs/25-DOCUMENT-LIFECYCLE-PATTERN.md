# 25 --- Document Lifecycle UI Pattern

## Draft

Editable according to permission and server state. Show
Save/Preview/Post only when contracts/capabilities allow them.

## Posting

Lock duplicate submit, show deterministic progress, preserve command
identity.

## Posted

Read-only immutable document. Show posted number/id, business date,
historical party/store snapshot, country rule version and audit metadata
where authorized.

## Correction

Never reopen posted financial/stock facts as editable drafts. Offer
domain-approved follow-up actions: return, refund, reversal, adjustment,
reprint or new document.

## Recovery

If response is lost or external state is uncertain, open recovery using
the original identity. Do not offer a fresh duplicate action as the
primary path.
