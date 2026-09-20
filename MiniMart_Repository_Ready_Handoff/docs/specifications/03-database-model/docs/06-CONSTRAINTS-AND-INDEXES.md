# Constraints and Indexes

## 1. Global rules

Every table: - primary key; - `tenant_id NOT NULL`; - required
scope/status fields; - timestamps; - CHECK constraints for obviously
invalid numeric/state combinations.

No business monetary column uses float.

## 2. Important unique constraints

-   `inventory.inventory_positions (tenant_id, store_id, item_id)`
-   `cash.business_days (tenant_id, store_id, business_date)`
-   `catalog.item_barcodes (tenant_id, company_id, normalized_barcode)`
    for active/effective barcode ownership
-   `integration.idempotency_records (tenant_id, operation_scope, idempotency_key)`
-   `integration.inbox_receipts (tenant_id, peer_id, message_id)`
-   `integration.outbox_messages (tenant_id, event_id)`
-   source-effect uniqueness on immutable ledgers where one logical
    source may produce only one movement type
-   `payments.posted_tenders` unique source commitment/materialization
    identity

## 3. Important CHECK constraints

Examples: - quantity precision/range appropriate to document type; -
currency length = 3; - posted documents require `posted_at`; - completed
Sale requires posted timestamp; - inventory position WAC cannot be
negative; - credit limit/outstanding stored exact, with policy
determining whether outstanding may exceed limit; - refund settled
amount cannot exceed obligation amount except explicit approved
correction path; - transfer source and destination accounts must
differ; - country-rule effective end must be after start.

Open policy decisions are not encoded as CHECK constraints prematurely.

## 4. Search indexes

Catalog: - normalized barcode exact B-tree; - normalized item code/name
search support; - optional `pg_trgm` GIN for item/customer/supplier text
search after extension approval.

Documents: - `(tenant_id, store_id, business_date DESC)` -
`(tenant_id, document_no)` - `(tenant_id, status, updated_at)` -
source-document/reference indexes for returns/payables/reconciliation.

## 5. Ledger indexes

Stock: -
`(tenant_id, store_id, item_id, occurred_at, stock_movement_id)` -
`(tenant_id, source_type, source_id)`

Credit: -
`(tenant_id, credit_account_id, occurred_at, credit_ledger_entry_id)` -
source reference index

Cash: - `(tenant_id, cashier_shift_id, occurred_at, cash_movement_id)`

Financial: -
`(tenant_id, financial_account_id, occurred_at, financial_movement_id)`

## 6. Outbox indexes

Partial index: - unpublished/retryable rows ordered by
`available_at, created_at`

Dedupe: - unique event ID.

Dead letters: - source/outbox message reference.

## 7. Foreign-key indexes

Every hard FK column set receives a matching index unless covered by an
existing leading index.

## 8. Index discipline

Do not index every column.

Each production index requires one of: - uniqueness/invariant; - known
lookup path; - posting lock path; - reporting/sync path proven
necessary.

Index cost is included in write-heavy POS performance tests.
