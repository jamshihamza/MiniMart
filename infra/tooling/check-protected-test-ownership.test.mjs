import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { packageNeedsTests, requireTestScript } from "./check-protected-test-ownership.mjs";

test("implemented source requires a runnable package test script", () => {
  const root = mkdtempSync(join(tmpdir(), "minimart-test-ownership-"));
  try {
    mkdirSync(join(root, "src"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
    writeFileSync(join(root, "src/index.ts"), "export {};\n");
    assert.equal(packageNeedsTests(root), false);
    writeFileSync(join(root, "src/index.ts"), "export const implemented = true;\n");
    assert.equal(packageNeedsTests(root), true);
    assert.throws(() => requireTestScript(root), /missing runnable test script/);
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ name: "fixture", scripts: { test: "echo ok" } }),
    );
    assert.throws(() => requireTestScript(root), /missing runnable test script/);
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ name: "fixture", scripts: { test: "vitest run" } }),
    );
    assert.throws(() => requireTestScript(root), /missing test file/);
    mkdirSync(join(root, "test"));
    writeFileSync(join(root, "test/implemented.test.ts"), 'test("implemented", () => {});\n');
    assert.doesNotThrow(() => requireTestScript(root));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
