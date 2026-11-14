import { DomainError, uuidv7, type Sql, type StoreContext } from "@minimart/shared-kernel";

export interface ItemRecord {
  readonly itemId: string;
  readonly itemCode: string | null;
  readonly name: string;
  readonly categoryName: string | null;
  readonly uomCode: string;
  readonly quantityPrecision: number;
  readonly barcode: string | null;
  readonly sellable: boolean;
  readonly stockManaged: boolean;
  readonly fractionalQuantityAllowed: boolean;
}

export interface CreateItemInput {
  readonly itemCode: string;
  readonly name: string;
  readonly uomCode?: string;
  readonly barcode?: string;
  readonly categoryName?: string;
  readonly stockManaged?: boolean;
  readonly fractionalQuantityAllowed?: boolean;
}

type Scope = Pick<StoreContext, "tenantId" | "companyId">;

interface ItemRow {
  item_id: string;
  item_code: string | null;
  name: string;
  category_name: string | null;
  uom_code: string;
  quantity_precision: number;
  barcode: string | null;
  sellable: boolean;
  stock_managed: boolean;
  fractional_quantity_allowed: boolean;
}

const ITEM_SELECT = `SELECT i.item_id, i.item_code, i.name, i.sellable, i.stock_managed,
    i.fractional_quantity_allowed, u.uom_code, u.quantity_precision,
    (SELECT b.barcode FROM catalog.item_barcodes b
      WHERE b.tenant_id = i.tenant_id AND b.item_id = i.item_id AND b.status = 'ACTIVE'
      ORDER BY b.created_at LIMIT 1) AS barcode,
    (SELECT c.name FROM catalog.item_categories ic
      JOIN catalog.categories c ON c.tenant_id = ic.tenant_id AND c.category_id = ic.category_id
      WHERE ic.tenant_id = i.tenant_id AND ic.item_id = i.item_id
      ORDER BY ic.created_at LIMIT 1) AS category_name
  FROM catalog.items i
  JOIN catalog.item_uoms u ON u.tenant_id = i.tenant_id AND u.item_uom_id = i.sales_item_uom_id
  WHERE i.tenant_id = $1 AND i.company_id = $2 AND i.status = 'ACTIVE'`;

function toItem(row: ItemRow): ItemRecord {
  return {
    itemId: row.item_id,
    itemCode: row.item_code,
    name: row.name,
    categoryName: row.category_name,
    uomCode: row.uom_code,
    quantityPrecision: row.quantity_precision,
    barcode: row.barcode,
    sellable: row.sellable,
    stockManaged: row.stock_managed,
    fractionalQuantityAllowed: row.fractional_quantity_allowed,
  };
}

export function normalizeBarcode(barcode: string): string {
  return barcode.replace(/\s+/g, "").toUpperCase();
}

async function ensureCategory(sql: Sql, scope: Scope, name: string, now: Date): Promise<string> {
  const existing = await sql.query<{ category_id: string }>(
    `SELECT category_id FROM catalog.categories
     WHERE tenant_id = $1 AND company_id = $2 AND lower(name) = lower($3) AND status = 'ACTIVE'`,
    [scope.tenantId, scope.companyId, name],
  );
  const found = existing.rows[0];
  if (found !== undefined) return found.category_id;
  const categoryId = uuidv7(now);
  await sql.query(
    `INSERT INTO catalog.categories (category_id, tenant_id, company_id, name, status, created_at)
     VALUES ($1, $2, $3, $4, 'ACTIVE', $5)`,
    [categoryId, scope.tenantId, scope.companyId, name, now],
  );
  return categoryId;
}

/** Creates a complete, active, sellable item with one unit of measure. Run inside a transaction. */
export async function createItem(
  sql: Sql,
  context: Scope & Pick<StoreContext, "now">,
  input: CreateItemInput,
): Promise<ItemRecord> {
  const itemCode = input.itemCode.trim();
  const name = input.name.trim();
  const uomCode = (input.uomCode ?? "EACH").trim().toUpperCase();
  if (itemCode === "" || name === "" || uomCode === "") {
    throw new DomainError(
      "ITEM_FIELDS_REQUIRED",
      "Item code, name and unit are required",
      "VALIDATION",
    );
  }
  const duplicate = await sql.query(
    `SELECT 1 FROM catalog.items WHERE tenant_id = $1 AND company_id = $2
       AND lower(item_code) = lower($3) AND status = 'ACTIVE'`,
    [context.tenantId, context.companyId, itemCode],
  );
  if (duplicate.rows.length > 0) {
    throw new DomainError("ITEM_CODE_TAKEN", `Item code ${itemCode} already exists`, "CONFLICT");
  }
  const barcode = input.barcode === undefined ? "" : normalizeBarcode(input.barcode);
  if (barcode !== "" && (await findItemByBarcode(sql, context, barcode)) !== null) {
    throw new DomainError("BARCODE_TAKEN", `Barcode ${barcode} is already assigned`, "CONFLICT");
  }

  const fractional = input.fractionalQuantityAllowed ?? false;
  const itemId = uuidv7(context.now);
  const uomId = uuidv7(context.now);
  await sql.query(
    `INSERT INTO catalog.items (item_id, tenant_id, company_id, item_code, name, sellable, purchasable,
       stock_managed, fractional_quantity_allowed, weighed, batch_tracked, expiry_tracked,
       skeleton_status, status, created_at)
     VALUES ($1, $2, $3, $4, $5, true, true, $6, $7, false, false, false, 'SKELETON', 'ACTIVE', $8)`,
    [
      itemId,
      context.tenantId,
      context.companyId,
      itemCode,
      name,
      input.stockManaged ?? true,
      fractional,
      context.now,
    ],
  );
  await sql.query(
    `INSERT INTO catalog.item_uoms (item_uom_id, tenant_id, item_id, uom_code, conversion_factor,
       quantity_precision, status) VALUES ($1, $2, $3, $4, 1, $5, 'ACTIVE')`,
    [uomId, context.tenantId, itemId, uomCode, fractional ? 3 : 0],
  );
  await sql.query(
    `UPDATE catalog.items SET base_item_uom_id = $3, sales_item_uom_id = $3, purchase_item_uom_id = $3,
       skeleton_status = 'COMPLETE', updated_at = $4, version = version + 1
     WHERE tenant_id = $1 AND item_id = $2`,
    [context.tenantId, itemId, uomId, context.now],
  );
  if (barcode !== "") {
    await sql.query(
      `INSERT INTO catalog.item_barcodes (item_barcode_id, tenant_id, company_id, item_id, barcode,
         normalized_barcode, uom_code, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $5, $6, 'ACTIVE', $7)`,
      [
        uuidv7(context.now),
        context.tenantId,
        context.companyId,
        itemId,
        barcode,
        uomCode,
        context.now,
      ],
    );
  }
  const categoryName = input.categoryName?.trim() ?? "";
  if (categoryName !== "") {
    const categoryId = await ensureCategory(sql, context, categoryName, context.now);
    await sql.query(
      `INSERT INTO catalog.item_categories (item_category_id, tenant_id, item_id, category_id, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv7(context.now), context.tenantId, itemId, categoryId, context.now],
    );
  }
  const [item] = await getItems(sql, context, [itemId]);
  if (item === undefined) throw new Error("Created item could not be read back");
  return item;
}

export async function getItems(
  sql: Sql,
  scope: Scope,
  itemIds: readonly string[],
): Promise<ItemRecord[]> {
  if (itemIds.length === 0) return [];
  const { rows } = await sql.query<ItemRow>(`${ITEM_SELECT} AND i.item_id = ANY($3::uuid[])`, [
    scope.tenantId,
    scope.companyId,
    itemIds,
  ]);
  return rows.map(toItem);
}

/** Lists active items, optionally filtered by name, item code or barcode fragment. */
export async function searchItems(
  sql: Sql,
  scope: Scope,
  options: { readonly query?: string; readonly limit?: number } = {},
): Promise<ItemRecord[]> {
  const query = options.query?.trim() ?? "";
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 200);
  const { rows } = await sql.query<ItemRow>(
    `${ITEM_SELECT} AND ($3 = '' OR i.name ILIKE '%' || $3 || '%' OR i.item_code ILIKE '%' || $3 || '%'
       OR EXISTS (SELECT 1 FROM catalog.item_barcodes b WHERE b.tenant_id = i.tenant_id
         AND b.item_id = i.item_id AND b.status = 'ACTIVE' AND b.normalized_barcode = upper($3)))
     ORDER BY i.name, i.item_id LIMIT $4`,
    [scope.tenantId, scope.companyId, query.replace(/[%_\\]/g, "\\$&"), limit],
  );
  return rows.map(toItem);
}

export async function findItemByBarcode(
  sql: Sql,
  scope: Scope,
  barcode: string,
): Promise<ItemRecord | null> {
  const { rows } = await sql.query<ItemRow>(
    `${ITEM_SELECT} AND EXISTS (SELECT 1 FROM catalog.item_barcodes b
       WHERE b.tenant_id = i.tenant_id AND b.company_id = i.company_id AND b.item_id = i.item_id
         AND b.status = 'ACTIVE' AND b.normalized_barcode = $3)`,
    [scope.tenantId, scope.companyId, normalizeBarcode(barcode)],
  );
  const row = rows[0];
  return row === undefined ? null : toItem(row);
}
