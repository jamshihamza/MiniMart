-- MiniMart Database Model v1.1 controlled amendment candidate.
-- This is a design/reference migration. Production execution requires reviewed backfill values.
BEGIN;

CREATE TABLE org.company_identifiers (
  company_identifier_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  company_id uuid NOT NULL,
  identifier_type_code varchar(40) NOT NULL,
  identifier_value text NOT NULL,
  normalized_identifier_value text NOT NULL,
  country_code varchar(2),
  status varchar(40) NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz,
  version bigint NOT NULL DEFAULT 0,
  FOREIGN KEY (tenant_id, company_id) REFERENCES org.companies(tenant_id, company_id),
  UNIQUE (tenant_id, company_identifier_id),
  UNIQUE (tenant_id, company_id, identifier_type_code, normalized_identifier_value)
);

ALTER TABLE org.stores
  ADD COLUMN default_language_code text,
  ADD COLUMN receipt_display_name text,
  ADD COLUMN receipt_header_text text,
  ADD COLUMN receipt_footer_text text,
  ADD COLUMN contact_phone text,
  ADD COLUMN contact_email text,
  ADD COLUMN address_line1 text,
  ADD COLUMN address_line2 text,
  ADD COLUMN address_city text,
  ADD COLUMN address_region text,
  ADD COLUMN address_postal_code text,
  ADD COLUMN address_country_code varchar(2),
  ADD COLUMN address_freeform text;

ALTER TABLE catalog.items
  ADD COLUMN short_description text,
  ADD COLUMN sellable boolean,
  ADD COLUMN purchasable boolean,
  ADD COLUMN fractional_quantity_allowed boolean,
  ADD COLUMN weighed boolean,
  ADD COLUMN batch_tracked boolean,
  ADD COLUMN expiry_tracked boolean,
  ADD COLUMN skeleton_status varchar(40),
  ADD COLUMN notes text;

ALTER TABLE catalog.item_uoms
  ADD COLUMN quantity_precision smallint,
  ADD COLUMN is_base boolean NOT NULL DEFAULT false,
  ADD COLUMN is_sales_default boolean NOT NULL DEFAULT false,
  ADD COLUMN is_purchase_default boolean NOT NULL DEFAULT false,
  ADD CONSTRAINT ck_item_uom_quantity_precision CHECK(quantity_precision IS NULL OR quantity_precision BETWEEN 0 AND 8),
  ADD CONSTRAINT uq_item_uom_code UNIQUE (tenant_id, item_id, uom_code);

CREATE UNIQUE INDEX ux_item_uoms_one_base
  ON catalog.item_uoms(tenant_id, item_id) WHERE is_base;
CREATE UNIQUE INDEX ux_item_uoms_one_sales_default
  ON catalog.item_uoms(tenant_id, item_id) WHERE is_sales_default;
CREATE UNIQUE INDEX ux_item_uoms_one_purchase_default
  ON catalog.item_uoms(tenant_id, item_id) WHERE is_purchase_default;

ALTER TABLE pricing.item_price_entries
  ADD COLUMN reference_price numeric(24,8),
  ADD COLUMN reference_price_kind varchar(40),
  ADD COLUMN tax_price_context_code varchar(40),
  ADD COLUMN change_reason text,
  ADD CONSTRAINT ck_price_reference_nonnegative CHECK(reference_price IS NULL OR reference_price >= 0);

ALTER TABLE procurement.suppliers
  ADD COLUMN payment_terms_code text,
  ADD COLUMN credit_terms_code text,
  ADD COLUMN credit_period_days integer,
  ADD COLUMN country_code varchar(2),
  ADD COLUMN notes text,
  ADD CONSTRAINT ck_supplier_credit_period CHECK(credit_period_days IS NULL OR credit_period_days >= 0);

CREATE TABLE procurement.supplier_identifiers (
  supplier_identifier_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  supplier_id uuid NOT NULL,
  identifier_type_code varchar(40) NOT NULL,
  identifier_value text NOT NULL,
  normalized_identifier_value text NOT NULL,
  country_code varchar(2),
  status varchar(40) NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz,
  version bigint NOT NULL DEFAULT 0,
  FOREIGN KEY (tenant_id, supplier_id) REFERENCES procurement.suppliers(tenant_id, supplier_id),
  UNIQUE (tenant_id, supplier_identifier_id),
  UNIQUE (tenant_id, supplier_id, identifier_type_code, normalized_identifier_value)
);

CREATE TABLE procurement.supplier_contacts (
  supplier_contact_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  supplier_id uuid NOT NULL,
  contact_name text NOT NULL,
  purpose_code text,
  phone text,
  email text,
  address_line1 text,
  address_line2 text,
  address_city text,
  address_region text,
  address_postal_code text,
  address_country_code varchar(2),
  address_freeform text,
  status varchar(40) NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz,
  version bigint NOT NULL DEFAULT 0,
  FOREIGN KEY (tenant_id, supplier_id) REFERENCES procurement.suppliers(tenant_id, supplier_id),
  UNIQUE (tenant_id, supplier_contact_id)
);

ALTER TABLE procurement.goods_receipts
  ADD COLUMN supplier_invoice_date date;

ALTER TABLE returns.sales_returns
  ADD COLUMN reason_code text,
  ADD COLUMN return_note text;

ALTER TABLE returns.sales_return_lines
  ADD COLUMN reason_code text,
  ADD COLUMN return_note text;

ALTER TABLE customer.customers
  ADD COLUMN customer_type_code varchar(40),
  ADD COLUMN phone text,
  ADD COLUMN email text,
  ADD COLUMN address_line1 text,
  ADD COLUMN address_line2 text,
  ADD COLUMN address_city text,
  ADD COLUMN address_region text,
  ADD COLUMN address_postal_code text,
  ADD COLUMN address_country_code varchar(2),
  ADD COLUMN address_freeform text,
  ADD COLUMN notes text;

CREATE TABLE customer.customer_identifiers (
  customer_identifier_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  identifier_type_code varchar(40) NOT NULL,
  identifier_value text NOT NULL,
  normalized_identifier_value text NOT NULL,
  country_code varchar(2),
  status varchar(40) NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz,
  version bigint NOT NULL DEFAULT 0,
  FOREIGN KEY (tenant_id, customer_id) REFERENCES customer.customers(tenant_id, customer_id),
  UNIQUE (tenant_id, customer_identifier_id),
  UNIQUE (tenant_id, customer_id, identifier_type_code, normalized_identifier_value)
);

ALTER TABLE customer.credit_accounts
  ADD COLUMN credit_limit_mode varchar(40),
  ADD COLUMN terms_code text,
  ADD COLUMN due_date_basis_code text;

ALTER TABLE customer.customer_collections
  ADD COLUMN tender_method_code varchar(40);

ALTER TABLE accounting.supplier_payments
  ADD COLUMN financial_account_id uuid,
  ADD COLUMN payment_method_code varchar(40),
  ADD CONSTRAINT fk_supplier_payment_financial_account
    FOREIGN KEY (tenant_id, financial_account_id)
    REFERENCES accounting.financial_accounts(tenant_id, financial_account_id);

-- BACKFILL GATE:
-- 1. Populate store default_language_code from approved installed-language configuration.
-- 2. Populate item sellable/purchasable/fractional/weighed/batch/expiry/skeleton state from authoritative master data.
-- 3. Populate item_uoms quantity_precision and exactly one base/sales/purchase default as applicable.
-- 4. Populate credit_limit_mode for existing accounts from explicit migration rule.
-- 5. Populate collection tender_method_code for existing collections from immutable source/tender facts.
-- 6. Only after verified backfill may the candidate NOT NULL constraints in the v1.1 reference DDL be enforced.
-- No OPEN/VERIFY/DEFERRED business policy may be guessed during backfill.

COMMIT;
