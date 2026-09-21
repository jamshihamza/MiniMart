import { readFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { sha256Hex } from "./checksum.js";
import type { MigrationDefinition, MigrationManifestEntry } from "./types.js";

export const DEFAULT_MIGRATIONS_DIRECTORY = fileURLToPath(
  new URL("../../../../database/migrations/", import.meta.url),
);

function assertEntry(value: unknown, index: number): asserts value is MigrationManifestEntry {
  if (typeof value !== "object" || value === null) {
    throw new Error(`Migration manifest entry ${index} must be an object`);
  }
  const entry = value as Record<string, unknown>;
  for (const name of [
    "id",
    "module",
    "schemaVersion",
    "minimumApplicationBuild",
    "maximumApplicationBuild",
    "file",
  ]) {
    if (typeof entry[name] !== "string" || entry[name] === "") {
      throw new Error(`Migration manifest entry ${index} has invalid ${name}`);
    }
  }
  if (typeof entry["resumable"] !== "boolean" || typeof entry["transactionSafe"] !== "boolean") {
    throw new Error(`Migration manifest entry ${index} has invalid execution flags`);
  }
}

export async function discoverMigrations(
  migrationsDirectory: string = DEFAULT_MIGRATIONS_DIRECTORY,
): Promise<readonly MigrationDefinition[]> {
  const manifestPath = resolve(migrationsDirectory, "manifest.json");
  const parsed: unknown = JSON.parse(await readFile(manifestPath, "utf8"));
  if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid migration manifest");
  const manifest = parsed as { formatVersion?: unknown; migrations?: unknown };
  if (manifest.formatVersion !== 1 || !Array.isArray(manifest.migrations)) {
    throw new Error("Unsupported migration manifest format");
  }

  const seen = new Set<string>();
  const root = resolve(dirname(manifestPath));
  const definitions: MigrationDefinition[] = [];
  for (const [index, candidate] of manifest.migrations.entries()) {
    assertEntry(candidate, index);
    if (seen.has(candidate.id)) throw new Error(`Duplicate migration ID: ${candidate.id}`);
    seen.add(candidate.id);
    const migrationPath = resolve(root, candidate.file);
    if (migrationPath !== root && !migrationPath.startsWith(`${root}${sep}`)) {
      throw new Error(`Migration file escapes migration directory: ${candidate.file}`);
    }
    const bytes = await readFile(migrationPath);
    const sql = bytes.toString("utf8");
    if (/^\s*(BEGIN|COMMIT|ROLLBACK)\s*;/imu.test(sql)) {
      throw new Error(`Migration ${candidate.id} contains transaction control`);
    }
    definitions.push({ ...candidate, bytes, sql, checksumSha256: sha256Hex(bytes) });
  }
  return definitions;
}
