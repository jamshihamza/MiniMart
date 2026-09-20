-- MiniMart Database Model v0.2 Freeze Candidate
-- COMPLETE REFERENCE DDL: 74/74 logical tables. Not yet production migrations.
BEGIN;

CREATE SCHEMA IF NOT EXISTS org;
CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS pricing;
CREATE SCHEMA IF NOT EXISTS procurement;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS sales;
CREATE SCHEMA IF NOT EXISTS payments;
CREATE SCHEMA IF NOT EXISTS returns;
CREATE SCHEMA IF NOT EXISTS customer;
CREATE SCHEMA IF NOT EXISTS cash;
CREATE SCHEMA IF NOT EXISTS accounting;
CREATE SCHEMA IF NOT EXISTS country;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS integration;

CREATE OR REPLACE FUNCTION integration.reject_immutable_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'immutable table % does not permit %', TG_TABLE_NAME, TG_OP;
END $$;


CREATE TABLE org.tenants (
tenant_id uuid PRIMARY KEY,
name text NOT NULL,
status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, tenant_id)
);

CREATE TABLE org.companies (
company_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL REFERENCES org.tenants(tenant_id),
legal_name text NOT NULL, display_name text NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL, updated_at timestamptz, version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, company_id)
);

CREATE TABLE org.stores (
store_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, company_id uuid NOT NULL,
store_code text NOT NULL, display_name text NOT NULL, timezone_name text NOT NULL,
currency_code varchar(3) NOT NULL, active_country_code varchar(2) NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL, updated_at timestamptz, version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, company_id) REFERENCES org.companies(tenant_id, company_id),
UNIQUE (tenant_id, store_id), UNIQUE (tenant_id, company_id, store_code)
);

CREATE TABLE org.counters (
counter_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, store_id uuid NOT NULL,
counter_code text NOT NULL, display_name text NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL, updated_at timestamptz, version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, store_id) REFERENCES org.stores(tenant_id, store_id),
UNIQUE (tenant_id, counter_id), UNIQUE (tenant_id, store_id, counter_code)
);

CREATE TABLE iam.user_accounts (
user_account_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
username text NOT NULL, password_hash text, pin_hash text, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, user_account_id)
);

CREATE TABLE iam.roles (
role_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
name text NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, role_id)
);

CREATE TABLE iam.permissions (
permission_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
permission_code text NOT NULL, description text,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, permission_id)
);

CREATE TABLE iam.role_permissions (
role_permission_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
role_id uuid NOT NULL,
permission_id uuid NOT NULL, created_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, role_id) REFERENCES iam.roles(tenant_id, role_id),
UNIQUE (tenant_id, role_permission_id)
);

CREATE TABLE iam.user_roles (
user_role_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
role_id uuid NOT NULL,
user_account_id uuid NOT NULL, scope_type varchar(40), scope_id uuid, created_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, role_id) REFERENCES iam.roles(tenant_id, role_id),
UNIQUE (tenant_id, user_role_id)
);

CREATE TABLE iam.override_authorizations (
override_authorization_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
actor_id uuid NOT NULL, approver_id uuid NOT NULL, scope_code text NOT NULL, reason_code text, expires_at timestamptz, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, override_authorization_id)
);

CREATE TABLE iam.support_sessions (
support_session_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
authorized_by uuid NOT NULL, scope_code text NOT NULL, reason text, starts_at timestamptz NOT NULL, expires_at timestamptz NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, support_session_id)
);

CREATE TABLE catalog.items (
item_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, company_id uuid NOT NULL,
item_code text, name text NOT NULL, base_uom_code text NOT NULL, tracking_policy varchar(40) NOT NULL,
status varchar(40) NOT NULL, created_at timestamptz NOT NULL, updated_at timestamptz,
version bigint NOT NULL DEFAULT 0, UNIQUE (tenant_id, item_id)
);

CREATE TABLE catalog.item_barcodes (
item_barcode_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, company_id uuid NOT NULL,
item_id uuid NOT NULL, barcode text NOT NULL, normalized_barcode text NOT NULL, uom_code text,
status varchar(40) NOT NULL, created_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, item_id) REFERENCES catalog.items(tenant_id, item_id),
UNIQUE (tenant_id, item_barcode_id)
);

CREATE TABLE catalog.item_uoms (
item_uom_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
item_id uuid NOT NULL,
uom_code text NOT NULL, conversion_factor numeric(24,8) NOT NULL, status varchar(40) NOT NULL,
FOREIGN KEY (tenant_id, item_id) REFERENCES catalog.items(tenant_id, item_id),
UNIQUE (tenant_id, item_uom_id)
);

CREATE TABLE catalog.categories (
category_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, parent_category_id uuid, name text NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, category_id)
);

CREATE TABLE catalog.brands (
brand_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, name text NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, brand_id)
);

CREATE TABLE catalog.item_categories (
item_category_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
item_id uuid NOT NULL,
category_id uuid NOT NULL, created_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, item_id) REFERENCES catalog.items(tenant_id, item_id),
UNIQUE (tenant_id, item_category_id)
);

CREATE TABLE pricing.item_price_schedules (
item_price_schedule_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid NOT NULL, item_id uuid NOT NULL, status varchar(40) NOT NULL, effective_from timestamptz, effective_to timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, item_price_schedule_id)
);

CREATE TABLE pricing.item_price_entries (
item_price_entry_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
item_price_schedule_id uuid NOT NULL,
price numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, effective_from timestamptz NOT NULL, effective_to timestamptz,
FOREIGN KEY (tenant_id, item_price_schedule_id) REFERENCES pricing.item_price_schedules(tenant_id, item_price_schedule_id),
UNIQUE (tenant_id, item_price_entry_id)
);

CREATE TABLE procurement.suppliers (
supplier_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, supplier_code text, name text NOT NULL, status varchar(40) NOT NULL, tax_identity text,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, supplier_id)
);

CREATE TABLE procurement.supplier_items (
supplier_item_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
supplier_id uuid NOT NULL, item_id uuid NOT NULL, supplier_sku text, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, supplier_item_id)
);

CREATE TABLE procurement.purchase_orders (
purchase_order_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid NOT NULL, supplier_id uuid NOT NULL, document_no text, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, purchase_order_id)
);

CREATE TABLE procurement.purchase_order_lines (
purchase_order_line_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
purchase_order_id uuid NOT NULL,
line_no integer NOT NULL, item_id uuid NOT NULL, ordered_qty numeric(24,8) NOT NULL, received_qty numeric(24,8) NOT NULL DEFAULT 0, unit_cost numeric(24,8) NOT NULL, tax_snapshot jsonb,
FOREIGN KEY (tenant_id, purchase_order_id) REFERENCES procurement.purchase_orders(tenant_id, purchase_order_id),
UNIQUE (tenant_id, purchase_order_line_id)
);

CREATE TABLE procurement.goods_receipts (
goods_receipt_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid NOT NULL, supplier_id uuid NOT NULL, purchase_order_id uuid, document_no text, supplier_reference text, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posting_envelope_id uuid, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, goods_receipt_id)
);

CREATE TABLE procurement.goods_receipt_lines (
goods_receipt_line_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
goods_receipt_id uuid NOT NULL,
line_no integer NOT NULL, purchase_order_line_id uuid, item_id uuid NOT NULL, accepted_qty numeric(24,8) NOT NULL, free_qty numeric(24,8) NOT NULL DEFAULT 0, acquisition_value numeric(24,8) NOT NULL, cost_evidence jsonb,
FOREIGN KEY (tenant_id, goods_receipt_id) REFERENCES procurement.goods_receipts(tenant_id, goods_receipt_id),
UNIQUE (tenant_id, goods_receipt_line_id)
);

CREATE TABLE procurement.purchase_returns (
purchase_return_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid NOT NULL, supplier_id uuid NOT NULL, document_no text, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posting_envelope_id uuid, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, purchase_return_id)
);

CREATE TABLE procurement.purchase_return_lines (
purchase_return_line_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
purchase_return_id uuid NOT NULL,
line_no integer NOT NULL, original_goods_receipt_line_id uuid NOT NULL, item_id uuid NOT NULL, quantity numeric(24,8) NOT NULL, unit_wac numeric(24,8) NOT NULL, value_amount numeric(24,8) NOT NULL,
FOREIGN KEY (tenant_id, purchase_return_id) REFERENCES procurement.purchase_returns(tenant_id, purchase_return_id),
UNIQUE (tenant_id, purchase_return_line_id)
);

CREATE TABLE inventory.inventory_positions (
inventory_position_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, store_id uuid NOT NULL, item_id uuid NOT NULL,
on_hand_qty numeric(24,8) NOT NULL DEFAULT 0, moving_wac numeric(24,8) NOT NULL DEFAULT 0 CHECK (moving_wac >= 0),
currency_code varchar(3) NOT NULL, updated_at timestamptz NOT NULL, version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, inventory_position_id), UNIQUE (tenant_id, store_id, item_id)
);

CREATE TABLE inventory.inventory_bucket_positions (
inventory_bucket_position_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, inventory_position_id uuid NOT NULL,
bucket_code varchar(40) NOT NULL, quantity numeric(24,8) NOT NULL DEFAULT 0,
updated_at timestamptz NOT NULL, version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, inventory_position_id) REFERENCES inventory.inventory_positions(tenant_id, inventory_position_id),
UNIQUE (tenant_id, inventory_bucket_position_id), UNIQUE (tenant_id, inventory_position_id, bucket_code)
);

CREATE TABLE inventory.inventory_batches (
inventory_batch_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
inventory_position_id uuid NOT NULL, batch_code text, expiry_date date, bucket_code varchar(40) NOT NULL, quantity numeric(24,8) NOT NULL DEFAULT 0, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, inventory_batch_id)
);

CREATE TABLE inventory.stock_movements (
stock_movement_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, store_id uuid NOT NULL, item_id uuid NOT NULL,
inventory_position_id uuid NOT NULL, quantity_delta numeric(24,8) NOT NULL CHECK (quantity_delta <> 0),
from_bucket_code varchar(40), to_bucket_code varchar(40), unit_cost numeric(24,8) NOT NULL CHECK (unit_cost >= 0),
value_delta numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, movement_type varchar(40) NOT NULL,
source_context varchar(40) NOT NULL, source_type varchar(60) NOT NULL, source_id uuid NOT NULL, source_line_id uuid,
source_effect_key text NOT NULL, posting_envelope_id uuid NOT NULL, business_date date NOT NULL,
occurred_at timestamptz NOT NULL, cost_evidence jsonb,
FOREIGN KEY (tenant_id, inventory_position_id) REFERENCES inventory.inventory_positions(tenant_id, inventory_position_id),
UNIQUE (tenant_id, stock_movement_id), UNIQUE (tenant_id, source_effect_key)
);

CREATE TABLE inventory.stock_counts (
stock_count_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
store_id uuid NOT NULL, document_no text, status varchar(40) NOT NULL, business_date date NOT NULL, started_at timestamptz, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, stock_count_id)
);

CREATE TABLE inventory.stock_count_lines (
stock_count_line_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
stock_count_id uuid NOT NULL,
item_id uuid NOT NULL, observed_qty numeric(24,8) NOT NULL, system_qty_snapshot numeric(24,8), variance_qty numeric(24,8), bucket_code varchar(40),
FOREIGN KEY (tenant_id, stock_count_id) REFERENCES inventory.stock_counts(tenant_id, stock_count_id),
UNIQUE (tenant_id, stock_count_line_id)
);

CREATE TABLE sales.sales (
sale_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, company_id uuid NOT NULL, store_id uuid NOT NULL, counter_id uuid,
customer_id uuid, document_no text, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL,
subtotal numeric(24,8) NOT NULL DEFAULT 0, discount_total numeric(24,8) NOT NULL DEFAULT 0,
tax_total numeric(24,8) NOT NULL DEFAULT 0, rounding_total numeric(24,8) NOT NULL DEFAULT 0,
grand_total numeric(24,8) NOT NULL DEFAULT 0, business_date date NOT NULL,
country_rule_set_id uuid, country_rule_version text, posting_envelope_id uuid,
created_at timestamptz NOT NULL, updated_at timestamptz, posted_at timestamptz,
version bigint NOT NULL DEFAULT 0, UNIQUE (tenant_id, sale_id),
CHECK ((status='COMPLETED' AND posted_at IS NOT NULL) OR status<>'COMPLETED')
);

CREATE TABLE sales.sale_lines (
sale_line_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, sale_id uuid NOT NULL, line_no integer NOT NULL CHECK(line_no>0),
item_id uuid NOT NULL, item_code_snapshot text, item_name_snapshot text NOT NULL, uom_code_snapshot text NOT NULL,
quantity numeric(24,8) NOT NULL CHECK(quantity>0), unit_price numeric(24,8) NOT NULL,
discount_amount numeric(24,8) NOT NULL DEFAULT 0, tax_amount numeric(24,8) NOT NULL DEFAULT 0,
line_total numeric(24,8) NOT NULL, unit_cost_snapshot numeric(24,8) NOT NULL DEFAULT 0 CHECK(unit_cost_snapshot>=0),
tax_snapshot jsonb,
FOREIGN KEY (tenant_id, sale_id) REFERENCES sales.sales(tenant_id, sale_id),
UNIQUE (tenant_id, sale_line_id), UNIQUE (tenant_id, sale_id, line_no)
);

CREATE TABLE sales.sale_state_history (
sale_state_history_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
sale_id uuid NOT NULL,
from_status varchar(40), to_status varchar(40) NOT NULL, changed_at timestamptz NOT NULL, actor_id uuid, reason_code text,
FOREIGN KEY (tenant_id, sale_id) REFERENCES sales.sales(tenant_id, sale_id),
UNIQUE (tenant_id, sale_state_history_id)
);

CREATE TABLE payments.checkout_payments (
checkout_payment_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, sale_id uuid NOT NULL, status varchar(40) NOT NULL,
currency_code varchar(3) NOT NULL, payable_amount numeric(24,8) NOT NULL, committed_amount numeric(24,8) NOT NULL DEFAULT 0,
remaining_amount numeric(24,8) NOT NULL, created_at timestamptz NOT NULL, updated_at timestamptz,
version bigint NOT NULL DEFAULT 0, UNIQUE (tenant_id, checkout_payment_id)
);

CREATE TABLE payments.payment_attempts (
payment_attempt_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, checkout_payment_id uuid NOT NULL,
method_code varchar(40) NOT NULL, provider_code varchar(80), amount numeric(24,8) NOT NULL CHECK(amount>0),
currency_code varchar(3) NOT NULL, status varchar(40) NOT NULL, external_reference text,
idempotency_key text NOT NULL, started_at timestamptz NOT NULL, resolved_at timestamptz,
FOREIGN KEY (tenant_id, checkout_payment_id) REFERENCES payments.checkout_payments(tenant_id, checkout_payment_id),
UNIQUE (tenant_id, payment_attempt_id), UNIQUE (tenant_id, checkout_payment_id, idempotency_key)
);

CREATE TABLE payments.payment_commitments (
payment_commitment_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, checkout_payment_id uuid NOT NULL,
payment_attempt_id uuid, method_code varchar(40) NOT NULL, amount numeric(24,8) NOT NULL CHECK(amount>0),
currency_code varchar(3) NOT NULL, external_reference text, status varchar(40) NOT NULL,
committed_at timestamptz NOT NULL, reversed_at timestamptz, settlement_source_key text NOT NULL,
FOREIGN KEY (tenant_id, checkout_payment_id) REFERENCES payments.checkout_payments(tenant_id, checkout_payment_id),
FOREIGN KEY (tenant_id, payment_attempt_id) REFERENCES payments.payment_attempts(tenant_id, payment_attempt_id),
UNIQUE (tenant_id, payment_commitment_id), UNIQUE (tenant_id, settlement_source_key)
);

CREATE TABLE payments.posted_tenders (
posted_tender_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, sale_id uuid NOT NULL, checkout_payment_id uuid NOT NULL,
payment_commitment_id uuid, method_code varchar(40) NOT NULL, amount numeric(24,8) NOT NULL CHECK(amount>0),
currency_code varchar(3) NOT NULL, external_reference text, settlement_source_key text NOT NULL,
posting_envelope_id uuid NOT NULL, posted_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, checkout_payment_id) REFERENCES payments.checkout_payments(tenant_id, checkout_payment_id),
FOREIGN KEY (tenant_id, payment_commitment_id) REFERENCES payments.payment_commitments(tenant_id, payment_commitment_id),
UNIQUE (tenant_id, posted_tender_id), UNIQUE (tenant_id, settlement_source_key)
);

CREATE TABLE payments.refund_executions (
refund_execution_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
refund_obligation_id uuid NOT NULL, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL, amount numeric(24,8) NOT NULL, settlement_source_key text NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, refund_obligation_id) REFERENCES returns.refund_obligations(tenant_id, refund_obligation_id),
UNIQUE (tenant_id, refund_execution_id),
UNIQUE (tenant_id, settlement_source_key)
);

CREATE TABLE payments.refund_attempts (
refund_attempt_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
refund_execution_id uuid NOT NULL,
method_code varchar(40) NOT NULL, provider_code varchar(80), amount numeric(24,8) NOT NULL, status varchar(40) NOT NULL, external_reference text, idempotency_key text NOT NULL, started_at timestamptz NOT NULL, resolved_at timestamptz,
FOREIGN KEY (tenant_id, refund_execution_id) REFERENCES payments.refund_executions(tenant_id, refund_execution_id),
UNIQUE (tenant_id, refund_attempt_id),
UNIQUE (tenant_id, refund_execution_id, idempotency_key)
);

CREATE TABLE returns.sales_returns (
sales_return_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, company_id uuid NOT NULL, store_id uuid NOT NULL,
customer_id uuid, original_sale_id uuid, document_no text, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL,
return_total numeric(24,8) NOT NULL, business_date date NOT NULL, country_rule_set_id uuid, country_rule_version text,
posting_envelope_id uuid, created_at timestamptz NOT NULL, posted_at timestamptz, version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, sales_return_id)
);

CREATE TABLE returns.sales_return_lines (
sales_return_line_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, sales_return_id uuid NOT NULL,
original_sale_line_id uuid, item_id uuid NOT NULL, quantity numeric(24,8) NOT NULL CHECK(quantity>0),
disposition_code varchar(40) NOT NULL, refund_value numeric(24,8) NOT NULL, tax_reversal_amount numeric(24,8) NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, sales_return_id) REFERENCES returns.sales_returns(tenant_id, sales_return_id),
UNIQUE (tenant_id, sales_return_line_id)
);

CREATE TABLE returns.refund_obligations (
refund_obligation_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, sales_return_id uuid NOT NULL,
status varchar(40) NOT NULL, obligation_amount numeric(24,8) NOT NULL CHECK(obligation_amount>=0),
settled_amount numeric(24,8) NOT NULL DEFAULT 0 CHECK(settled_amount>=0),
currency_code varchar(3) NOT NULL, requested_method_code varchar(40), created_at timestamptz NOT NULL,
settled_at timestamptz, version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, sales_return_id) REFERENCES returns.sales_returns(tenant_id, sales_return_id),
UNIQUE (tenant_id, refund_obligation_id), CHECK(settled_amount<=obligation_amount)
);

CREATE TABLE customer.customers (
customer_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, customer_code text, name text NOT NULL, status varchar(40) NOT NULL, tax_identity text, pii_updated_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, customer_id)
);

CREATE TABLE customer.credit_accounts (
credit_account_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, company_id uuid NOT NULL, customer_id uuid NOT NULL,
status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL, credit_limit numeric(24,8) NOT NULL DEFAULT 0 CHECK(credit_limit>=0),
outstanding_amount numeric(24,8) NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL, version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, credit_account_id), UNIQUE (tenant_id, company_id, customer_id)
);

CREATE TABLE customer.credit_ledger_entries (
credit_ledger_entry_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, credit_account_id uuid NOT NULL,
entry_type varchar(40) NOT NULL, amount numeric(24,8) NOT NULL CHECK(amount<>0), currency_code varchar(3) NOT NULL,
source_context varchar(40) NOT NULL, source_type varchar(60) NOT NULL, source_id uuid NOT NULL,
source_effect_key text NOT NULL, posting_envelope_id uuid NOT NULL, business_date date NOT NULL, occurred_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, credit_account_id) REFERENCES customer.credit_accounts(tenant_id, credit_account_id),
UNIQUE (tenant_id, credit_ledger_entry_id), UNIQUE (tenant_id, source_effect_key)
);

CREATE TABLE customer.customer_collections (
customer_collection_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid NOT NULL, customer_id uuid NOT NULL, credit_account_id uuid NOT NULL, document_no text, status varchar(40) NOT NULL, amount numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posting_envelope_id uuid, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, customer_collection_id)
);

CREATE TABLE customer.collection_allocations (
collection_allocation_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
customer_collection_id uuid NOT NULL,
target_type varchar(60) NOT NULL, target_id uuid NOT NULL, amount numeric(24,8) NOT NULL,
FOREIGN KEY (tenant_id, customer_collection_id) REFERENCES customer.customer_collections(tenant_id, customer_collection_id),
UNIQUE (tenant_id, collection_allocation_id)
);

CREATE TABLE cash.business_days (
business_day_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, store_id uuid NOT NULL, business_date date NOT NULL,
status varchar(40) NOT NULL, opened_at timestamptz, closed_at timestamptz, version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, business_day_id), UNIQUE (tenant_id, store_id, business_date)
);

CREATE TABLE cash.cashier_shifts (
cashier_shift_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, store_id uuid NOT NULL, counter_id uuid, user_id uuid NOT NULL,
business_day_id uuid NOT NULL, status varchar(40) NOT NULL, currency_code varchar(3) NOT NULL,
opening_float numeric(24,8) NOT NULL DEFAULT 0, expected_cash numeric(24,8) NOT NULL DEFAULT 0,
actual_cash numeric(24,8), variance_amount numeric(24,8), opened_at timestamptz NOT NULL, closed_at timestamptz,
version bigint NOT NULL DEFAULT 0,
FOREIGN KEY (tenant_id, business_day_id) REFERENCES cash.business_days(tenant_id, business_day_id),
UNIQUE (tenant_id, cashier_shift_id)
);

CREATE TABLE cash.cash_movements (
cash_movement_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, cashier_shift_id uuid NOT NULL,
movement_type varchar(40) NOT NULL, amount numeric(24,8) NOT NULL CHECK(amount<>0), currency_code varchar(3) NOT NULL,
source_context varchar(40) NOT NULL, source_type varchar(60) NOT NULL, source_id uuid NOT NULL,
source_effect_key text NOT NULL, reason_code text, posting_envelope_id uuid NOT NULL,
business_date date NOT NULL, occurred_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, cashier_shift_id) REFERENCES cash.cashier_shifts(tenant_id, cashier_shift_id),
UNIQUE (tenant_id, cash_movement_id), UNIQUE (tenant_id, source_effect_key)
);

CREATE TABLE cash.shift_tender_summaries (
shift_tender_summary_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
cashier_shift_id uuid NOT NULL,
method_code varchar(40) NOT NULL, amount numeric(24,8) NOT NULL, updated_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, cashier_shift_id) REFERENCES cash.cashier_shifts(tenant_id, cashier_shift_id),
UNIQUE (tenant_id, shift_tender_summary_id)
);

CREATE TABLE accounting.supplier_payables (
supplier_payable_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid, supplier_id uuid NOT NULL, source_document_id uuid NOT NULL, status varchar(40) NOT NULL, original_amount numeric(24,8) NOT NULL, outstanding_amount numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, due_date date,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, supplier_payable_id)
);

CREATE TABLE accounting.supplier_payable_allocations (
supplier_payable_allocation_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
supplier_payable_id uuid NOT NULL,
source_type varchar(60) NOT NULL, source_id uuid NOT NULL, amount numeric(24,8) NOT NULL, allocated_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, supplier_payable_id) REFERENCES accounting.supplier_payables(tenant_id, supplier_payable_id),
UNIQUE (tenant_id, supplier_payable_allocation_id)
);

CREATE TABLE accounting.supplier_payments (
supplier_payment_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid, supplier_id uuid NOT NULL, document_no text, status varchar(40) NOT NULL, amount numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posting_envelope_id uuid, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, supplier_payment_id)
);

CREATE TABLE accounting.supplier_payment_allocations (
supplier_payment_allocation_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
supplier_payment_id uuid NOT NULL,
supplier_payable_id uuid NOT NULL, amount numeric(24,8) NOT NULL, allocated_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, supplier_payment_id) REFERENCES accounting.supplier_payments(tenant_id, supplier_payment_id),
FOREIGN KEY (tenant_id, supplier_payable_id) REFERENCES accounting.supplier_payables(tenant_id, supplier_payable_id),
UNIQUE (tenant_id, supplier_payment_allocation_id)
);

CREATE TABLE accounting.financial_accounts (
financial_account_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, company_id uuid NOT NULL, store_id uuid,
account_type varchar(40) NOT NULL, name text NOT NULL, currency_code varchar(3) NOT NULL,
opening_balance numeric(24,8) NOT NULL DEFAULT 0, current_balance numeric(24,8) NOT NULL DEFAULT 0,
status varchar(40) NOT NULL, updated_at timestamptz NOT NULL, version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, financial_account_id)
);

CREATE TABLE accounting.financial_transactions (
financial_transaction_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid, financial_account_id uuid NOT NULL, transaction_type varchar(40) NOT NULL, status varchar(40) NOT NULL, amount numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posting_envelope_id uuid, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, financial_transaction_id)
);

CREATE TABLE accounting.financial_movements (
financial_movement_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, financial_account_id uuid NOT NULL,
movement_type varchar(40) NOT NULL, amount numeric(24,8) NOT NULL CHECK(amount<>0), currency_code varchar(3) NOT NULL,
source_context varchar(40) NOT NULL, source_type varchar(60) NOT NULL, source_id uuid NOT NULL,
source_effect_key text NOT NULL, posting_envelope_id uuid NOT NULL, business_date date NOT NULL, occurred_at timestamptz NOT NULL,
FOREIGN KEY (tenant_id, financial_account_id) REFERENCES accounting.financial_accounts(tenant_id, financial_account_id),
UNIQUE (tenant_id, financial_movement_id), UNIQUE (tenant_id, source_effect_key)
);

CREATE TABLE accounting.account_transfers (
account_transfer_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid, source_account_id uuid NOT NULL, destination_account_id uuid NOT NULL, status varchar(40) NOT NULL, amount numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posting_envelope_id uuid, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, account_transfer_id)
);

CREATE TABLE accounting.expense_categories (
expense_category_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, name text NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, expense_category_id)
);

CREATE TABLE accounting.expenses (
expense_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, store_id uuid, expense_category_id uuid NOT NULL, financial_account_id uuid, status varchar(40) NOT NULL, amount numeric(24,8) NOT NULL, currency_code varchar(3) NOT NULL, business_date date NOT NULL, posting_envelope_id uuid, posted_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, expense_id)
);

CREATE TABLE accounting.reconciliation_sessions (
reconciliation_session_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid NOT NULL, financial_account_id uuid NOT NULL, status varchar(40) NOT NULL, statement_from date, statement_to date, opened_at timestamptz NOT NULL, closed_at timestamptz,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, reconciliation_session_id)
);

CREATE TABLE accounting.reconciliation_matches (
reconciliation_match_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
reconciliation_session_id uuid NOT NULL,
financial_movement_id uuid, external_reference text, amount numeric(24,8) NOT NULL, status varchar(40) NOT NULL,
FOREIGN KEY (tenant_id, reconciliation_session_id) REFERENCES accounting.reconciliation_sessions(tenant_id, reconciliation_session_id),
UNIQUE (tenant_id, reconciliation_match_id)
);

CREATE TABLE country.country_rule_sets (
country_rule_set_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
country_code varchar(2) NOT NULL, rule_set_version text NOT NULL, effective_from date NOT NULL, effective_to date, status varchar(40) NOT NULL, verified_source_ref text,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, country_rule_set_id)
);

CREATE TABLE country.country_rule_values (
country_rule_value_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
country_rule_set_id uuid NOT NULL,
rule_key text NOT NULL, value_json jsonb NOT NULL, verified_source_ref text,
FOREIGN KEY (tenant_id, country_rule_set_id) REFERENCES country.country_rule_sets(tenant_id, country_rule_set_id),
UNIQUE (tenant_id, country_rule_value_id)
);

CREATE TABLE audit.audit_events (
audit_event_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
company_id uuid, store_id uuid, actor_id uuid, action_code text NOT NULL, target_context varchar(40) NOT NULL, target_type varchar(60) NOT NULL, target_id uuid, reason_code text, posting_envelope_id uuid, correlation_id uuid, occurred_at timestamptz NOT NULL, evidence jsonb,
created_at timestamptz NOT NULL,
UNIQUE (tenant_id, audit_event_id)
);

CREATE TABLE integration.outbox_messages (
outbox_message_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, event_id uuid NOT NULL, producer_context varchar(40) NOT NULL,
aggregate_type varchar(60) NOT NULL, aggregate_id uuid NOT NULL, event_type varchar(80) NOT NULL, event_version integer NOT NULL,
posting_envelope_id uuid, correlation_id uuid, causation_id uuid, payload jsonb NOT NULL,
created_at timestamptz NOT NULL, available_at timestamptz NOT NULL, claim_owner text, claim_expires_at timestamptz,
published_at timestamptz, attempt_count integer NOT NULL DEFAULT 0 CHECK(attempt_count>=0), last_error text,
UNIQUE (tenant_id, outbox_message_id), UNIQUE (tenant_id, event_id)
);

CREATE TABLE integration.inbox_receipts (
inbox_receipt_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, peer_id uuid NOT NULL, message_id uuid NOT NULL,
status varchar(40) NOT NULL, received_at timestamptz NOT NULL, applied_at timestamptz, result_ref jsonb,
UNIQUE (tenant_id, inbox_receipt_id), UNIQUE (tenant_id, peer_id, message_id)
);

CREATE TABLE integration.idempotency_records (
idempotency_record_id uuid PRIMARY KEY, tenant_id uuid NOT NULL, operation_scope varchar(80) NOT NULL,
idempotency_key text NOT NULL, request_fingerprint text NOT NULL, status varchar(40) NOT NULL,
claim_owner text, claim_expires_at timestamptz, result_type varchar(60), result_id uuid, result_summary jsonb,
created_at timestamptz NOT NULL, completed_at timestamptz,
UNIQUE (tenant_id, idempotency_record_id), UNIQUE (tenant_id, operation_scope, idempotency_key)
);

CREATE TABLE integration.sync_checkpoints (
sync_checkpoint_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
peer_id uuid NOT NULL, stream_code text NOT NULL, checkpoint_value text, updated_at timestamptz NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, sync_checkpoint_id)
);

CREATE TABLE integration.dead_letters (
dead_letter_id uuid PRIMARY KEY,
tenant_id uuid NOT NULL,
source_message_id uuid NOT NULL, failure_class varchar(80) NOT NULL, payload_hash text, retry_count integer NOT NULL DEFAULT 0, first_failed_at timestamptz NOT NULL, last_failed_at timestamptz NOT NULL, status varchar(40) NOT NULL,
created_at timestamptz NOT NULL,
updated_at timestamptz,
version bigint NOT NULL DEFAULT 0,
UNIQUE (tenant_id, dead_letter_id)
);

CREATE UNIQUE INDEX uq_item_barcode_company
ON catalog.item_barcodes(tenant_id, company_id, normalized_barcode)
WHERE status='ACTIVE';

CREATE INDEX ix_stock_movement_item_time
ON inventory.stock_movements(tenant_id, store_id, item_id, occurred_at, stock_movement_id);

CREATE INDEX ix_sale_store_business_date
ON sales.sales(tenant_id, store_id, business_date DESC, sale_id);

CREATE INDEX ix_sales_return_original_line
ON returns.sales_return_lines(tenant_id, original_sale_line_id)
WHERE original_sale_line_id IS NOT NULL;

CREATE INDEX ix_purchase_return_original_grn_line
ON procurement.purchase_return_lines(tenant_id, original_goods_receipt_line_id);

CREATE INDEX ix_credit_ledger_account_time
ON customer.credit_ledger_entries(tenant_id, credit_account_id, occurred_at, credit_ledger_entry_id);

CREATE INDEX ix_cash_movement_shift_time
ON cash.cash_movements(tenant_id, cashier_shift_id, occurred_at, cash_movement_id);

CREATE INDEX ix_financial_movement_account_time
ON accounting.financial_movements(tenant_id, financial_account_id, occurred_at, financial_movement_id);

CREATE INDEX ix_outbox_pending
ON integration.outbox_messages(available_at, created_at)
WHERE published_at IS NULL;

CREATE TRIGGER trg_stock_movements_immutable BEFORE UPDATE OR DELETE ON inventory.stock_movements
FOR EACH ROW EXECUTE FUNCTION integration.reject_immutable_change();
CREATE TRIGGER trg_posted_tenders_immutable BEFORE UPDATE OR DELETE ON payments.posted_tenders
FOR EACH ROW EXECUTE FUNCTION integration.reject_immutable_change();
CREATE TRIGGER trg_credit_ledger_immutable BEFORE UPDATE OR DELETE ON customer.credit_ledger_entries
FOR EACH ROW EXECUTE FUNCTION integration.reject_immutable_change();
CREATE TRIGGER trg_cash_movements_immutable BEFORE UPDATE OR DELETE ON cash.cash_movements
FOR EACH ROW EXECUTE FUNCTION integration.reject_immutable_change();
CREATE TRIGGER trg_financial_movements_immutable BEFORE UPDATE OR DELETE ON accounting.financial_movements
FOR EACH ROW EXECUTE FUNCTION integration.reject_immutable_change();
CREATE TRIGGER trg_audit_events_immutable BEFORE UPDATE OR DELETE ON audit.audit_events
FOR EACH ROW EXECUTE FUNCTION integration.reject_immutable_change();

COMMIT;
