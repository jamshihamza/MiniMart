# MiniMart Database Model v1.2 --- FROZEN Amendment

PostgreSQL remains the Store authority. The model contains 15 schemas
and 79 logical tables.

Canonical authorities: - Item UoM roles:
`catalog.items.base_item_uom_id`, `sales_item_uom_id`,
`purchase_item_uom_id`; - stock-posting classification:
`catalog.items.stock_managed`; - batch/expiry: explicit Item booleans; -
repeatable Company/Supplier/Customer identifier child tables for new
writes.

Posted documents preserve historical Company/Store/Customer/Supplier
meaning in immutable snapshot JSON captured in the same Posting Envelope
transaction.

`integration.store_service_instances` is the durable technical source
for Store Node/service-instance association; it is not Store
business-master data.

Normative candidate DDL:
`schema/REFERENCE-DDL-v1.2-FROZEN.sql`.
