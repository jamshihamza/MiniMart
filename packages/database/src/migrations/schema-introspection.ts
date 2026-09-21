import type { Pool } from "pg";

export const MIGRATION_LEDGER_EXCLUSION = "integration.schema_migrations";

export interface NormalizedPostgresCatalog {
  readonly schemas: readonly string[];
  readonly tables: readonly Record<string, unknown>[];
  readonly columns: readonly Record<string, unknown>[];
  readonly constraints: readonly Record<string, unknown>[];
  readonly indexes: readonly Record<string, unknown>[];
  readonly routines: readonly Record<string, unknown>[];
  readonly triggers: readonly Record<string, unknown>[];
}

const USER_SCHEMA_PREDICATE = `
  n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname NOT LIKE 'pg_toast%'
  AND n.nspname NOT LIKE 'pg_temp_%'
`;

async function rows(pool: Pool, query: string): Promise<readonly Record<string, unknown>[]> {
  const result = await pool.query<Record<string, unknown>>(query);
  return result.rows;
}

export async function introspectPostgresCatalog(pool: Pool): Promise<NormalizedPostgresCatalog> {
  const schemaResult = await rows(
    pool,
    `SELECT nspname AS schema_name FROM pg_namespace n
      WHERE ${USER_SCHEMA_PREDICATE}
      ORDER BY nspname`,
  );
  const schemas = schemaResult.map((row) => String(row["schema_name"]));

  const tables = await rows(
    pool,
    `SELECT n.nspname AS schema_name, c.relname AS table_name,
            c.relpersistence AS persistence
       FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind IN ('r', 'p') AND ${USER_SCHEMA_PREDICATE}
        AND (n.nspname || '.' || c.relname) <> '${MIGRATION_LEDGER_EXCLUSION}'
      ORDER BY n.nspname, c.relname`,
  );
  const columns = await rows(
    pool,
    `SELECT n.nspname AS schema_name, c.relname AS table_name, a.attnum AS ordinal_position,
            a.attname AS column_name, pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
            a.attnotnull AS not_null,
            pg_get_expr(d.adbin, d.adrelid) AS column_default
       FROM pg_attribute a
       JOIN pg_class c ON c.oid = a.attrelid
       JOIN pg_namespace n ON n.oid = c.relnamespace
       LEFT JOIN pg_attrdef d ON d.adrelid = c.oid AND d.adnum = a.attnum
      WHERE c.relkind IN ('r', 'p') AND a.attnum > 0 AND NOT a.attisdropped
        AND ${USER_SCHEMA_PREDICATE}
        AND (n.nspname || '.' || c.relname) <> '${MIGRATION_LEDGER_EXCLUSION}'
      ORDER BY n.nspname, c.relname, a.attnum`,
  );
  const constraints = await rows(
    pool,
    `SELECT n.nspname AS schema_name, c.relname AS table_name,
            con.contype AS constraint_type,
            pg_get_constraintdef(con.oid, true) AS definition,
            con.condeferrable AS deferrable, con.condeferred AS initially_deferred,
            rn.nspname AS referenced_schema, rc.relname AS referenced_table,
            ARRAY(
              SELECT a.attname
                FROM unnest(con.conkey) WITH ORDINALITY AS key(attnum, position)
                JOIN pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = key.attnum
               ORDER BY key.position
            ) AS source_columns,
            ARRAY(
              SELECT a.attname
                FROM unnest(con.confkey) WITH ORDINALITY AS key(attnum, position)
                JOIN pg_attribute a ON a.attrelid = con.confrelid AND a.attnum = key.attnum
               ORDER BY key.position
            ) AS referenced_columns,
            con.confupdtype AS update_action, con.confdeltype AS delete_action,
            con.confmatchtype AS match_type
       FROM pg_constraint con
       JOIN pg_class c ON c.oid = con.conrelid
       JOIN pg_namespace n ON n.oid = c.relnamespace
       LEFT JOIN pg_class rc ON rc.oid = con.confrelid
       LEFT JOIN pg_namespace rn ON rn.oid = rc.relnamespace
      WHERE ${USER_SCHEMA_PREDICATE}
        AND (n.nspname || '.' || c.relname) <> '${MIGRATION_LEDGER_EXCLUSION}'
      ORDER BY n.nspname, c.relname, con.contype, pg_get_constraintdef(con.oid, true)`,
  );
  const indexes = await rows(
    pool,
    `SELECT schemaname AS schema_name, tablename AS table_name, indexname AS index_name,
            regexp_replace(indexdef, '\\s+', ' ', 'g') AS definition
       FROM pg_indexes
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        AND schemaname NOT LIKE 'pg_toast%'
        AND (schemaname || '.' || tablename) <> '${MIGRATION_LEDGER_EXCLUSION}'
      ORDER BY schemaname, tablename, indexname`,
  );
  const routines = await rows(
    pool,
    `SELECT n.nspname AS schema_name, p.proname AS routine_name,
            pg_get_function_identity_arguments(p.oid) AS identity_arguments,
            p.prokind AS routine_kind, p.provolatile AS volatility,
            regexp_replace(pg_get_functiondef(p.oid), '\\s+', ' ', 'g') AS definition
       FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE ${USER_SCHEMA_PREDICATE}
      ORDER BY n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)`,
  );
  const triggers = await rows(
    pool,
    `SELECT n.nspname AS schema_name, c.relname AS table_name, t.tgname AS trigger_name,
            regexp_replace(pg_get_triggerdef(t.oid, true), '\\s+', ' ', 'g') AS definition
       FROM pg_trigger t
       JOIN pg_class c ON c.oid = t.tgrelid
       JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE NOT t.tgisinternal AND ${USER_SCHEMA_PREDICATE}
        AND (n.nspname || '.' || c.relname) <> '${MIGRATION_LEDGER_EXCLUSION}'
      ORDER BY n.nspname, c.relname, t.tgname`,
  );

  return { schemas, tables, columns, constraints, indexes, routines, triggers };
}
