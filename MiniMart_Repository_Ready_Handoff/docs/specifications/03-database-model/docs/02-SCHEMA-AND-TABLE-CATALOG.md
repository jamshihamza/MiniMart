# Schema and Table Catalog v1.2

**Logical tables:** 79

## accounting

-   `accounting.supplier_payables`
-   `accounting.supplier_payable_allocations`
-   `accounting.supplier_payments`
-   `accounting.supplier_payment_allocations`
-   `accounting.financial_accounts`
-   `accounting.financial_transactions`
-   `accounting.financial_movements`
-   `accounting.account_transfers`
-   `accounting.expense_categories`
-   `accounting.expenses`
-   `accounting.reconciliation_sessions`
-   `accounting.reconciliation_matches`

## audit

-   `audit.audit_events`

## cash

-   `cash.business_days`
-   `cash.cashier_shifts`
-   `cash.cash_movements`
-   `cash.shift_tender_summaries`

## catalog

-   `catalog.items`
-   `catalog.item_barcodes`
-   `catalog.item_uoms`
-   `catalog.categories`
-   `catalog.brands`
-   `catalog.item_categories`

## country

-   `country.country_rule_sets`
-   `country.country_rule_values`

## customer

-   `customer.customers`
-   `customer.customer_identifiers`
-   `customer.credit_accounts`
-   `customer.credit_ledger_entries`
-   `customer.customer_collections`
-   `customer.collection_allocations`

## iam

-   `iam.user_accounts`
-   `iam.roles`
-   `iam.permissions`
-   `iam.role_permissions`
-   `iam.user_roles`
-   `iam.override_authorizations`
-   `iam.support_sessions`

## integration

-   `integration.store_service_instances`
-   `integration.outbox_messages`
-   `integration.inbox_receipts`
-   `integration.idempotency_records`
-   `integration.sync_checkpoints`
-   `integration.dead_letters`

## inventory

-   `inventory.inventory_positions`
-   `inventory.inventory_bucket_positions`
-   `inventory.inventory_batches`
-   `inventory.stock_movements`
-   `inventory.stock_counts`
-   `inventory.stock_count_lines`

## org

-   `org.tenants`
-   `org.companies`
-   `org.company_identifiers`
-   `org.stores`
-   `org.counters`

## payments

-   `payments.checkout_payments`
-   `payments.payment_attempts`
-   `payments.payment_commitments`
-   `payments.posted_tenders`
-   `payments.refund_executions`
-   `payments.refund_attempts`

## pricing

-   `pricing.item_price_schedules`
-   `pricing.item_price_entries`

## procurement

-   `procurement.suppliers`
-   `procurement.supplier_identifiers`
-   `procurement.supplier_contacts`
-   `procurement.supplier_items`
-   `procurement.purchase_orders`
-   `procurement.purchase_order_lines`
-   `procurement.goods_receipts`
-   `procurement.goods_receipt_lines`
-   `procurement.purchase_returns`
-   `procurement.purchase_return_lines`

## returns

-   `returns.sales_returns`
-   `returns.sales_return_lines`
-   `returns.refund_obligations`

## sales

-   `sales.sales`
-   `sales.sale_lines`
-   `sales.sale_state_history`
