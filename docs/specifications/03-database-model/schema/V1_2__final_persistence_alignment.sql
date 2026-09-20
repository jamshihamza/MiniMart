-- MiniMart Database Model v1.2
-- MIGRATION DESIGN BLUEPRINT — NOT AN EXECUTABLE PRODUCTION MIGRATION.
--
-- Before any real installation upgrade, a concrete production migration must be generated
-- for the target supported baseline, reviewed by a human, executed against representative
-- restored data, rollback/restore tested, and schema-diff verified against
-- REFERENCE-DDL-v1.2-AMENDMENT-CANDIDATE.sql.
--
-- Commented backfill/retirement steps in this blueprint are REQUIRED design obligations.
-- They may not be treated as optional merely because they are comments here.
BEGIN;

ALTER TABLE catalog.items
  ADD COLUMN stock_managed boolean,
  ADD COLUMN base_item_uom_id uuid,
  ADD COLUMN sales_item_uom_id uuid,
  ADD COLUMN purchase_item_uom_id uuid;

ALTER TABLE catalog.item_uoms
  ADD CONSTRAINT uq_item_uom_same_item UNIQUE (tenant_id, item_id, item_uom_id);

ALTER TABLE catalog.items
  ADD CONSTRAINT fk_item_base_uom FOREIGN KEY (tenant_id,item_id,base_item_uom_id)
    REFERENCES catalog.item_uoms(tenant_id,item_id,item_uom_id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_item_sales_uom FOREIGN KEY (tenant_id,item_id,sales_item_uom_id)
    REFERENCES catalog.item_uoms(tenant_id,item_id,item_uom_id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_item_purchase_uom FOREIGN KEY (tenant_id,item_id,purchase_item_uom_id)
    REFERENCES catalog.item_uoms(tenant_id,item_id,item_uom_id) DEFERRABLE INITIALLY DEFERRED;

-- Backfill role UUIDs only from verified v1.1 role rows.
-- Backfill stock_managed only from authoritative operational configuration.
-- Never infer stock_managed from sellable/purchasable.
-- Abort if a COMPLETE ACTIVE Item cannot satisfy required role references.
-- After verification, drop v1.1 role booleans/indexes, base_uom_code and tracking_policy.

CREATE INDEX ix_company_identifiers_lookup
  ON org.company_identifiers(tenant_id, normalized_identifier_value, identifier_type_code);
CREATE INDEX ix_supplier_identifiers_lookup
  ON procurement.supplier_identifiers(tenant_id, normalized_identifier_value, identifier_type_code);
CREATE INDEX ix_customer_identifiers_lookup
  ON customer.customer_identifiers(tenant_id, normalized_identifier_value, identifier_type_code);

-- Migrate legacy supplier/customer tax_identity into canonical identifier child rows,
-- verify, then drop legacy tax_identity columns.

ALTER TABLE sales.sales
  ADD COLUMN company_snapshot_json jsonb,
  ADD COLUMN store_snapshot_json jsonb,
  ADD COLUMN customer_snapshot_json jsonb,
  ADD COLUMN snapshot_schema_version varchar(20);

ALTER TABLE procurement.purchase_orders
  ADD COLUMN company_snapshot_json jsonb,
  ADD COLUMN store_snapshot_json jsonb,
  ADD COLUMN supplier_snapshot_json jsonb,
  ADD COLUMN snapshot_schema_version varchar(20);
ALTER TABLE procurement.goods_receipts
  ADD COLUMN company_snapshot_json jsonb,
  ADD COLUMN store_snapshot_json jsonb,
  ADD COLUMN supplier_snapshot_json jsonb,
  ADD COLUMN snapshot_schema_version varchar(20);
ALTER TABLE procurement.purchase_returns
  ADD COLUMN company_snapshot_json jsonb,
  ADD COLUMN store_snapshot_json jsonb,
  ADD COLUMN supplier_snapshot_json jsonb,
  ADD COLUMN snapshot_schema_version varchar(20);

ALTER TABLE returns.sales_returns
  ADD COLUMN company_snapshot_json jsonb,
  ADD COLUMN store_snapshot_json jsonb,
  ADD COLUMN customer_snapshot_json jsonb,
  ADD COLUMN snapshot_schema_version varchar(20);

ALTER TABLE customer.customer_collections
  ADD COLUMN company_snapshot_json jsonb,
  ADD COLUMN store_snapshot_json jsonb,
  ADD COLUMN customer_snapshot_json jsonb,
  ADD COLUMN snapshot_schema_version varchar(20);

ALTER TABLE accounting.supplier_payments
  ADD COLUMN supplier_snapshot_json jsonb,
  ADD COLUMN snapshot_schema_version varchar(20),
  ADD CONSTRAINT ck_supplier_payment_source
    CHECK (financial_account_id IS NOT NULL OR payment_method_code IS NOT NULL);

-- New posting code captures snapshots atomically with document + audit + outbox.
-- Existing rows are backfilled only from authoritative immutable evidence.
-- Unknown historical values remain unknown; current master data must never be substituted.

CREATE TABLE integration.store_service_instances (
  store_service_instance_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  store_id uuid NOT NULL,
  instance_code text NOT NULL,
  host_fingerprint text NOT NULL,
  status varchar(40) NOT NULL,
  enrolled_at timestamptz NOT NULL,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL,
  updated_at timestamptz,
  version bigint NOT NULL DEFAULT 0,
  FOREIGN KEY (tenant_id, store_id) REFERENCES org.stores(tenant_id, store_id),
  UNIQUE (tenant_id, store_service_instance_id),
  UNIQUE (tenant_id, store_id, instance_code),
  UNIQUE (tenant_id, host_fingerprint)
);
CREATE INDEX ix_store_service_instances_store_status
  ON integration.store_service_instances(tenant_id, store_id, status);

COMMIT;


-- MIGRATION CONVERGENCE GATE (reviewed production migration requirement):
-- A production migration derived from this blueprint is acceptable only when its post-migration
-- schema matches REFERENCE-DDL-v1.2-AMENDMENT-CANDIDATE.sql for the amended objects.
-- The production script must execute the verified backfill and legacy-column retirement steps
-- that are comments in this design blueprint; those steps must not be skipped.


-- PRODUCTION MIGRATION ACCEPTANCE GATE
-- A generated production migration is acceptable only when ALL of the following pass:
-- 1. pre-migration backup/restore drill succeeds;
-- 2. authoritative backfill sources are identified and reviewed;
-- 3. canonical Item/UoM, stock-managed and identifier data are verified before legacy retirement;
-- 4. historical snapshot backfill uses only authoritative immutable evidence;
-- 5. required NOT NULL / FK / CHECK / uniqueness constraints are enabled after verified backfill;
-- 6. legacy duplicate write authorities are retired;
-- 7. the post-migration schema is schema-diff equivalent to the frozen v1.2 reference DDL
--    for every amended object;
-- 8. application compatibility, Posting Envelope, Audit + Outbox and sync tests pass;
-- 9. rollback or restore recovery is demonstrated;
-- 10. the migration receives explicit human approval.

