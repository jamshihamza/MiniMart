/**
 * MM-010 TEST-ONLY: checks that the experiment cannot be imported or activated by production code.
 * No database needed. This does NOT ban production listeners (legitimate application servers exist);
 * it checks that production source, package exports, build configuration, launchers and migrations
 * have no path to the harness.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const packageRoot = path.join(repositoryRoot, "packages", "sync-protocol");

const FORBIDDEN_TOKENS = [
  "sync-protocol/test",
  "spike_mm010",
  "TestOnlyLoopbackIngestServer",
  "TestOnlyDispatcher",
  "TestOnlyCloudIngest",
  "FaultInjectingTransport",
  "x-minimart-test-only",
  "harness/",
];

function walk(
  directory: string,
  accept: (file: string) => boolean,
  found: string[] = [],
): string[] {
  for (const entry of readdirSync(directory)) {
    if (["node_modules", "dist", "target", ".git", "src-tauri"].includes(entry)) continue;
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) walk(full, accept, found);
    else if (accept(full)) found.push(full);
  }
  return found;
}

const isSourceFile = (file: string): boolean => /\.(?:[cm]?[jt]sx?)$/.test(file);

/** Production TypeScript and JavaScript: every `src` tree under packages and apps, except this package's tests. */
function productionSources(): string[] {
  const roots = ["packages", "apps"].map((name) => path.join(repositoryRoot, name));
  return roots
    .flatMap((root) => walk(root, isSourceFile))
    .filter((file) => {
      const relative = path.relative(repositoryRoot, file).replaceAll("\\", "/");
      if (relative.startsWith("packages/sync-protocol/test/")) return false;
      return /(^|\/)src\//.test(relative) && !/(^|\/)test\//.test(relative);
    });
}

describe("production code has no path to the MM-010 harness", () => {
  it("scans a meaningful set of production source files", () => {
    const files = productionSources();
    expect(files.length).toBeGreaterThan(10);
    expect(
      files.some((file) => file.replaceAll("\\", "/").endsWith("apps/cloud/src/index.ts")),
    ).toBe(true);
    expect(
      files.some((file) => file.replaceAll("\\", "/").endsWith("apps/store-node/src/index.ts")),
    ).toBe(true);
    expect(
      files.some((file) =>
        file.replaceAll("\\", "/").endsWith("packages/sync-protocol/src/index.ts"),
      ),
    ).toBe(true);
  });

  it("references no harness identifier, table or path from any production source file", () => {
    const offenders: string[] = [];
    for (const file of productionSources()) {
      const text = readFileSync(file, "utf8");
      for (const token of FORBIDDEN_TOKENS) {
        if (text.includes(token))
          offenders.push(`${path.relative(repositoryRoot, file)}: ${token}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("imports no workspace sync-protocol subpath and no test directory from production code", () => {
    const offenders: string[] = [];
    const importPattern = /(?:from\s+|import\s*\(|require\s*\()\s*["']([^"']+)["']/g;
    for (const file of productionSources()) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(importPattern)) {
        const specifier = match[1] ?? "";
        const reachesSubpath = specifier.startsWith("@minimart/sync-protocol/");
        const reachesTestTree = /(^|\/)test(\/|$)/.test(specifier);
        if (reachesSubpath || reachesTestTree)
          offenders.push(`${path.relative(repositoryRoot, file)}: ${specifier}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps the sync-protocol entry point free of any harness import", () => {
    const entry = readFileSync(path.join(packageRoot, "src", "index.ts"), "utf8");
    expect(entry).not.toMatch(/from\s+["'][^"']*test/);
    expect(entry).not.toMatch(/import\s*\(/);
  });
});

describe("package exports and build output do not include the harness", () => {
  const manifest = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8")) as {
    exports?: Record<string, unknown>;
    files?: string[];
    bin?: unknown;
    main?: unknown;
  };

  it("exports only the package root, from dist", () => {
    expect(Object.keys(manifest.exports ?? {})).toEqual(["."]);
    expect(JSON.stringify(manifest.exports)).not.toContain("test");
    expect(manifest.files).toEqual(["dist"]);
    expect(manifest.bin).toBeUndefined();
    expect(manifest.main).toBeUndefined();
  });

  it("cannot resolve a harness file through the package name", () => {
    const requireFromPackage = createRequire(pathToFileURL(path.join(packageRoot, "package.json")));
    expect(() =>
      requireFromPackage.resolve("@minimart/sync-protocol/test/harness/fixtures.js"),
    ).toThrow();
  });

  it("builds only src: the production tsconfig excludes tests and the harness config emits nothing", () => {
    const production = JSON.parse(
      readFileSync(path.join(packageRoot, "tsconfig.json"), "utf8"),
    ) as {
      include: string[];
      compilerOptions: Record<string, unknown>;
    };
    expect(production.include.every((pattern) => pattern.startsWith("src/"))).toBe(true);
    expect(production.compilerOptions["rootDir"]).toBe("./src");
    const harness = JSON.parse(
      readFileSync(path.join(packageRoot, "tsconfig.test.json"), "utf8"),
    ) as {
      include: string[];
      compilerOptions: Record<string, unknown>;
    };
    expect(harness.compilerOptions["noEmit"]).toBe(true);
    expect(harness.include).toEqual(["src/**/*.ts", "test/**/*.ts"]);
  });
});

describe("production migrations and launchers are untouched by the experiment", () => {
  it("has no harness table or schema in any migration file or manifest", () => {
    const migrations = walk(path.join(repositoryRoot, "database", "migrations"), () => true);
    expect(migrations.length).toBeGreaterThan(1);
    for (const file of migrations) {
      expect(readFileSync(file, "utf8")).not.toContain("spike_mm010");
    }
  });

  it("keeps both launchers free of any sync-protocol import, so they cannot activate the harness", () => {
    const cloud = readFileSync(
      path.join(repositoryRoot, "apps", "cloud", "src", "index.ts"),
      "utf8",
    );
    expect(cloud).not.toMatch(/sync-protocol/);
    const storeNode = readFileSync(
      path.join(repositoryRoot, "apps", "store-node", "src", "index.ts"),
      "utf8",
    );
    expect(storeNode).not.toMatch(/sync-protocol/);
  });
});
