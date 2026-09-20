# MiniMart Database Model v1.1 --- Amendment Candidate Release Note

This candidate is a minimal controlled persistence amendment required to
unblock the API freeze.

It preserves: - PostgreSQL as Store authority; - 15 module schemas; -
UUIDv7 application-generated identities; - exact `numeric(24,8)`
money/quantity baseline; - immutable posted facts and reversal
semantics; - Item × Store WAC; - 13 Posting Envelope atomicity rules; -
Audit + Outbox in the same local transaction; - tenant-safe
relationships; - sync/idempotency ownership; - all 60 frozen
non-resolved/verification decision seams.

Logical table count changes from **74 to 78** through four master-detail
tables only: `org.company_identifiers`,
`procurement.supplier_identifiers`, `procurement.supplier_contacts`, and
`customer.customer_identifiers`.
