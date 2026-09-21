import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface FixtureMigration {
  readonly id: string;
  readonly sql: string;
  readonly schemaVersion?: string;
  readonly minimumApplicationBuild?: string;
  readonly maximumApplicationBuild?: string;
  readonly resumable?: boolean;
}

export async function createMigrationFixture(
  migrations: readonly FixtureMigration[],
): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "minimart-migrations-"));
  const entries = [];
  for (const [index, migration] of migrations.entries()) {
    const file = `${String(index + 1).padStart(4, "0")}_${migration.id}.sql`;
    await writeFile(join(directory, file), migration.sql, "utf8");
    entries.push({
      id: migration.id,
      module: "test",
      schemaVersion: migration.schemaVersion ?? `0.0.${index + 1}`,
      minimumApplicationBuild: migration.minimumApplicationBuild ?? "0.0.0",
      maximumApplicationBuild: migration.maximumApplicationBuild ?? "0.99.99",
      resumable: migration.resumable ?? false,
      transactionSafe: true,
      file,
    });
  }
  await writeFile(
    join(directory, "manifest.json"),
    `${JSON.stringify({ formatVersion: 1, migrations: entries }, null, 2)}\n`,
    "utf8",
  );
  return directory;
}
