import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function sourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

const scaffold = new Set(["export {};", 'export * from "./public/index.js";']);

export function packageNeedsTests(packageDirectory) {
  return sourceFiles(join(packageDirectory, "src")).some(
    (path) => !scaffold.has(readFileSync(path, "utf8").trim()),
  );
}

export function requireTestScript(packageDirectory) {
  const metadata = JSON.parse(readFileSync(join(packageDirectory, "package.json"), "utf8"));
  if (
    typeof metadata.scripts?.test !== "string" ||
    !/^(?:vitest run|node --test)(?:\s|$)/.test(metadata.scripts.test)
  ) {
    throw new Error(`${metadata.name}: missing runnable test script`);
  }
  const tests = [
    ...sourceFiles(join(packageDirectory, "test")),
    ...sourceFiles(join(packageDirectory, "src")),
  ].filter((path) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path));
  if (tests.length === 0) throw new Error(`${metadata.name}: missing test file`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const relativePath of [
    "packages/database",
    "packages/service-runtime",
    "apps/pos-terminal",
  ]) {
    requireTestScript(join(repositoryRoot, relativePath));
  }
  const deferred = [
    ...readdirSync(join(repositoryRoot, "packages/modules"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(repositoryRoot, "packages/modules", entry.name)),
    join(repositoryRoot, "packages/application/coordinators"),
    join(repositoryRoot, "packages/sync-protocol"),
  ];
  for (const directory of deferred) {
    if (packageNeedsTests(directory)) requireTestScript(directory);
  }
  console.log(
    `Protected test ownership valid: database, service runtime, POS; ${deferred.length} domain/coordinator/sync scaffolds require tests when implemented.`,
  );
}
