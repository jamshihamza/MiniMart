import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { after, before, test } from "node:test";
import { mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderPackage } from "../render.mjs";

const fixturesDir = resolve(dirname(fileURLToPath(import.meta.url)), "fixtures");
const fixtureRoot = mkdtempSync(resolve(tmpdir(), "minimart-design-render-"));
const packageRoot = resolve(fixtureRoot, "fixture");
const manifestPath = resolve(packageRoot, "design-manifest.json");
const fixtureHtml = resolve(fixturesDir, "screen-query.html");

function manifest(sourceFile, overrides = {}) {
  return {
    package: "Fixture",
    slug: "fixture",
    status: "draft",
    sourceFile,
    screenCount: 1,
    primaryViewport: "320x200",
    supportedViewports: ["320x200"],
    screens: [
      {
        number: "01",
        name: "Fixture screen",
        phaseLabel: "DESIGN CONCEPT",
        renderFile: "01-fixture.png",
        render: { readySelector: "[data-ready]" },
      },
    ],
    ...overrides,
  };
}

function dcManifest(sourceFile, screens) {
  return {
    package: "Fixture",
    slug: "fixture",
    status: "draft",
    sourceFile,
    screenCount: screens.length,
    primaryViewport: "320x200",
    supportedViewports: ["320x200"],
    screens,
  };
}

before(() => {
  mkdirSync(resolve(packageRoot, "source"), { recursive: true });
  copyFileSync(fixtureHtml, resolve(packageRoot, "source/fixture.html"));
  for (const name of [
    "dc-fidelity.dc.html",
    "dc-unsupported-primitive.dc.html",
    "dc-pageerror.dc.html",
    "dc-missing-dependency.dc.html",
    "dc-blocked-asset.dc.html",
  ]) {
    copyFileSync(resolve(fixturesDir, name), resolve(packageRoot, "source", name));
  }
});

after(() => rmSync(fixtureRoot, { recursive: true, force: true }));

test("renderer fails clearly when the source file is missing", async () => {
  writeFileSync(manifestPath, JSON.stringify(manifest("source/missing.html")));
  await assert.rejects(() => renderPackage(manifestPath), /sourceFile does not exist/);
});

test("renderer produces a PNG from the local fixture page", async () => {
  writeFileSync(manifestPath, JSON.stringify(manifest("source/fixture.html")));
  const result = await renderPackage(manifestPath);
  const pngPath = resolve(packageRoot, "renders/01-fixture.png");
  assert.equal(result.outputPaths.length, 1);
  assert.equal(existsSync(pngPath), true);
  assert.deepEqual([...readFileSync(pngPath).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});

test("a letter-suffixed screen number still renders through the full pipeline", async () => {
  writeFileSync(
    manifestPath,
    JSON.stringify(
      dcManifest("source/dc-fidelity.dc.html", [
        { number: "02b", name: "Fixture 02b", renderFile: "02b-fixture.png" },
      ]),
    ),
  );
  const result = await renderPackage(manifestPath);
  assert.equal(result.outputPaths.length, 1);
  assert.equal(existsSync(resolve(packageRoot, "renders/02b-fixture.png")), true);
});

test("an unsupported primitive fails the full render pipeline, not just the unit-level check", async () => {
  writeFileSync(
    manifestPath,
    JSON.stringify(
      dcManifest("source/dc-unsupported-primitive.dc.html", [
        { number: "01", name: "Unsupported", renderFile: "01-unsupported.png" },
      ]),
    ),
  );
  await assert.rejects(() => renderPackage(manifestPath), /Unsupported Claude Design primitive/);
});

test("an uncaught page error fails the render", async () => {
  writeFileSync(
    manifestPath,
    JSON.stringify(
      dcManifest("source/dc-pageerror.dc.html", [
        { number: "01", name: "Page error", renderFile: "01-pageerror.png" },
      ]),
    ),
  );
  await assert.rejects(() => renderPackage(manifestPath), /fixture pageerror/);
});

test("a missing local dependency that is not a known-inert asset fails the render", async () => {
  writeFileSync(
    manifestPath,
    JSON.stringify(
      dcManifest("source/dc-missing-dependency.dc.html", [
        { number: "01", name: "Missing dependency", renderFile: "01-missing-dependency.png" },
      ]),
    ),
  );
  await assert.rejects(() => renderPackage(manifestPath), /failed resource request/);
});

test("an unresolved external asset from a non-allowlisted host fails the render", async () => {
  writeFileSync(
    manifestPath,
    JSON.stringify(
      dcManifest("source/dc-blocked-asset.dc.html", [
        { number: "01", name: "Blocked asset", renderFile: "01-blocked-asset.png" },
      ]),
    ),
  );
  await assert.rejects(() => renderPackage(manifestPath), /unresolved external resource/);
});
