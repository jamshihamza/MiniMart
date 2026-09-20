# Keys, Relationships and Ownership

## 1. Primary keys

Every aggregate/document/fact row uses an application-generated UUIDv7.

Owned child rows also receive UUIDv7 identity rather than positional
composite primary keys. This simplifies offline creation, event
references and later sync.

## 2. Tenant isolation

Every business table includes `tenant_id`.

For stable organization tables, composite uniqueness such as
`(tenant_id, company_id)` and `(tenant_id, store_id)` is enforced.

Queries in repositories always include tenant scope.

## 3. Company-wide master uniqueness

### Item

Recommended race-safe constraints: - `(tenant_id, company_id, item_id)`
identity - optional item-code uniqueness only after the item-code policy
is approved - barcode uniqueness:
`(tenant_id, company_id, normalized_barcode)` for active/effective
barcode rows

### Supplier

Supplier code/reference uniqueness remains policy-driven where the
frozen decision is not final.

### Customer

No automatic duplicate merge. Search indexes support duplicate review
without defining merge policy.

## 4. Store-scoped roots

### InventoryPosition

Unique: `(tenant_id, store_id, item_id)`

Exactly one current root per Item × Store.

### Price schedule

Unique active/effective schedule semantics are implemented by date-range
overlap protection after pricing policy review; v0.1 stores all
schedule/entry facts without silently resolving overlapping-price
behavior.

### BusinessDay

Unique: `(tenant_id, store_id, business_date)`

Reopen/late-post behavior remains policy-driven.

## 5. Hard foreign keys

Hard FKs are used for: - owned children within a bounded context; -
tenant→company→store→counter organization hierarchy; - join tables
inside the same module; - line→header ownership; -
attempt→payment/refund-execution ownership; - allocation→payment/payable
ownership inside Accounting-Lite.

## 6. Cross-context references

Cross-context business references are generally UUID +
snapshot/reference fields, not direct SQL joins required for
correctness.

Examples: - `sales.sale_lines.item_id` - `sales.sales.customer_id` -
`inventory.stock_movements.source_document_id` -
`payments.posted_tenders.sale_id` -
`returns.sales_return_lines.original_sale_line_id` -
`accounting.supplier_payables.source_document_id`

Repositories must not use these references to bypass owning module
contracts.

## 7. Typed source references

Immutable ledgers use:

-   `source_context`
-   `source_type`
-   `source_id`
-   `source_line_id` where needed
-   `source_idempotency_key`

This avoids polymorphic cross-schema FK coupling while retaining
traceability.

## 8. Historical snapshots

Posted document lines preserve human/business meaning even if master
data changes.

Typical Sale line snapshot: - `item_id` - `item_code_snapshot` -
`item_name_snapshot` - `uom_code_snapshot` - quantity - unit price -
discount - tax - line total - unit cost snapshot/WAC - country rule-set
identity

## 9. Tenant-safe cross-module references

Where a hard cross-schema FK is later introduced for a stable root, it
must include tenant scope and must not allow cross-tenant references.

A direct `FOREIGN KEY (item_id)` without tenant isolation is not
acceptable.
