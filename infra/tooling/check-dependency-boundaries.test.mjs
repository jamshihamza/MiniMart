import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  loadPackages,
  validateDependencyRules,
  validatePackageMetadata,
} from "./check-dependency-boundaries.mjs";

function createPackage(root, directory, manifest, source = "export {};\n") {
  const packageDirectory = path.join(root, directory);
  fs.mkdirSync(path.join(packageDirectory, "src"), { recursive: true });
  fs.writeFileSync(path.join(packageDirectory, "package.json"), JSON.stringify(manifest));
  fs.writeFileSync(path.join(packageDirectory, "src", "index.ts"), source);
}

function manifest(name, layer, moduleName, dependencies = {}) {
  return {
    name,
    private: true,
    type: "module",
    dependencies,
    minimart: {
      layer,
      module: moduleName,
      capabilities: [moduleName + "-public"],
    },
  };
}

test("accepts a module importing another module public port", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "minimart-boundaries-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  createPackage(
    root,
    "packages/modules/catalog",
    manifest("@minimart/module-catalog", "domain", "catalog", {
      "@minimart/module-pricing": "workspace:*",
    }),
    'export * from "@minimart/module-pricing/public";\n',
  );
  createPackage(
    root,
    "packages/modules/pricing",
    manifest("@minimart/module-pricing", "domain", "pricing"),
  );
  const packages = loadPackages(root, ["packages/modules/catalog", "packages/modules/pricing"]);
  assert.deepEqual(validatePackageMetadata(packages), []);
  assert.deepEqual(validateDependencyRules(packages), []);
});

test("rejects cross-module internal imports", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "minimart-boundaries-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  createPackage(
    root,
    "packages/modules/catalog",
    manifest("@minimart/module-catalog", "domain", "catalog", {
      "@minimart/module-pricing": "workspace:*",
    }),
    'export * from "@minimart/module-pricing/internal";\n',
  );
  createPackage(
    root,
    "packages/modules/pricing",
    manifest("@minimart/module-pricing", "domain", "pricing"),
  );
  const packages = loadPackages(root, ["packages/modules/catalog", "packages/modules/pricing"]);
  assert.match(validateDependencyRules(packages).join("\n"), /cross-module internal import/);
});

test("rejects workspace dependency cycles", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "minimart-boundaries-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  createPackage(
    root,
    "packages/shared-kernel",
    manifest("@minimart/shared-kernel", "shared", "shared-kernel", {
      "@minimart/api-contract": "workspace:*",
    }),
  );
  createPackage(
    root,
    "packages/api-contract",
    manifest("@minimart/api-contract", "contract", "api", {
      "@minimart/shared-kernel": "workspace:*",
    }),
  );
  const packages = loadPackages(root, ["packages/shared-kernel", "packages/api-contract"]);
  assert.match(validateDependencyRules(packages).join("\n"), /dependency cycle/);
});

test("rejects packages importing application launchers", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "minimart-boundaries-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  createPackage(
    root,
    "packages/shared-kernel",
    manifest("@minimart/shared-kernel", "shared", "shared-kernel", {
      "@minimart/store-node": "workspace:*",
    }),
    'export * from "@minimart/store-node";\n',
  );
  createPackage(root, "apps/store-node", manifest("@minimart/store-node", "launcher", "system"));
  const packages = loadPackages(root, ["packages/shared-kernel", "apps/store-node"]);
  assert.match(validateDependencyRules(packages).join("\n"), /packages must not import apps/);
});

test("rejects domain dependencies on infrastructure", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "minimart-boundaries-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  createPackage(
    root,
    "packages/modules/catalog",
    manifest("@minimart/module-catalog", "domain", "catalog", {
      "@minimart/database": "workspace:*",
    }),
    'export * from "@minimart/database";\n',
  );
  createPackage(
    root,
    "packages/database",
    manifest("@minimart/database", "infrastructure", "database"),
  );
  const packages = loadPackages(root, ["packages/modules/catalog", "packages/database"]);
  assert.match(validateDependencyRules(packages).join("\n"), /domain package must not depend/);
});
