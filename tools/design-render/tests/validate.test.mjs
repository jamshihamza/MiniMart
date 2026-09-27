import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { validateManifestObject } from "../validate.mjs";

const manifestPath = resolve("docs/design/example/design-manifest.json");

function validManifest(overrides = {}) {
  return {
    package: "Example",
    slug: "example",
    status: "draft",
    sourceFile: null,
    sourceOfTruth: null,
    screenCount: 1,
    primaryViewport: "1366x768",
    supportedViewports: ["1280x720", "1920x1080"],
    screenGroups: ["Core"],
    screens: [
      {
        number: "01",
        name: "Example screen",
        group: "Core",
        routeOrState: "example",
        phaseLabel: "CURRENT FOUNDATION",
        renderFile: "01-example.png",
        notes: "Fixture only",
      },
    ],
    authorityDependent: false,
    openDecisions: [],
    laterPhase: false,
    changelog: [],
    lastReviewedCommit: null,
    notes: "Valid fixture manifest",
    ...overrides,
  };
}

test("schema accepts a valid manifest", () => {
  assert.equal(
    validateManifestObject(validManifest(), manifestPath, { checkSource: false }).slug,
    "example",
  );
});

test("duplicate screen numbers are rejected after numeric normalization", () => {
  const manifest = validManifest({
    screenCount: 2,
    screens: [
      { number: "01", name: "First", renderFile: "first.png" },
      { number: 1, name: "Duplicate", renderFile: "duplicate.png" },
    ],
  });
  assert.throws(
    () => validateManifestObject(manifest, manifestPath, { checkSource: false }),
    /duplicate screen number/,
  );
});

test("letter-suffixed screen numbers are supported and normalized", () => {
  const manifest = validManifest({
    screenCount: 2,
    screens: [
      { number: "02b", name: "Grid", renderFile: "grid.png" },
      { number: "2B", name: "Duplicate grid", renderFile: "duplicate-grid.png" },
    ],
  });
  assert.throws(
    () => validateManifestObject(manifest, manifestPath, { checkSource: false }),
    /duplicate screen number/,
  );
});

test("missing package and slug are rejected", () => {
  const manifest = validManifest();
  delete manifest.package;
  delete manifest.slug;
  assert.throws(
    () => validateManifestObject(manifest, manifestPath, { checkSource: false }),
    /must have required property 'package'.*must have required property 'slug'/,
  );
});

test("invalid phaseLabel is rejected", () => {
  const manifest = validManifest();
  manifest.screens[0].phaseLabel = "FUTURE MAYBE";
  assert.throws(
    () => validateManifestObject(manifest, manifestPath, { checkSource: false }),
    /phaseLabel.*must be equal to one of the allowed values/,
  );
});
