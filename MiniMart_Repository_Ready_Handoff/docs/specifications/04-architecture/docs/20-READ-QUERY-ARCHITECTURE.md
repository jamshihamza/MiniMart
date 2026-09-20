# Read and Query Architecture --- v0.3

## Class A --- authoritative operational queries

Used for command preparation and current operational screens. They are
served by the owning module's public query port.

Examples: - item/barcode lookup; - current Item×Store stock; - current
customer credit account; - open cashier shift.

If the result participates in a posting invariant, the Posting Envelope
revalidates it under the frozen lock/transaction rules.

## Class B --- cross-module reporting/search

Cross-module reporting, drill-down and search use `packages/query` as an
application-level composition layer.

The layer may: 1. call public query ports exposed by the owning modules;
2. compose returned public DTOs in memory or through bounded application
orchestration; 3. query a dedicated reporting/read-model schema **only
when that schema is owned by the reporting/query subsystem and has been
introduced by an approved Database Model change**.

The layer **must not** read a business module's private PostgreSQL
schema, repository, ORM/table object or internal view.

## Projections

A persistent projection introduced later must: - be explicitly
non-authoritative; - be populated from published events/contracts or
other public interfaces; - have source event/version/checkpoint
identity; - be replay/idempotency safe; - be rebuildable; - expose
freshness where material; - receive Database Model and migration review
before storage is added.

A projection owns its own tables. It does not make another module's
tables public.

## Performance

Barcode and catalog search use the frozen database index paths through
the owning module query ports. Reporting queries are paged/bounded and
must not hold locks needed by Posting Envelopes.

If a report cannot meet its NFR through public query composition, the
remedy is an approved reporting projection/read model---not a direct
cross-module SQL exception.
