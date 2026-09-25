import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { verifyManifest } from "./check-frozen-manifests.mjs";

test("frozen manifest gate rejects an accidental file edit", () => {
  const root = mkdtempSync(join(tmpdir(), "minimart-freeze-gate-"));
  try {
    const document = join(root, "authority.md");
    const manifest = join(root, "MANIFEST.json");
    writeFileSync(document, "frozen authority\n");
    const bytes = readFileSync(document);
    writeFileSync(
      manifest,
      JSON.stringify({
        files: [
          {
            path: "authority.md",
            bytes: bytes.length,
            sha256: createHash("sha256").update(bytes).digest("hex"),
          },
        ],
      }),
    );
    assert.equal(verifyManifest(manifest), 1);
    writeFileSync(document, "accidental edit\n");
    assert.throws(() => verifyManifest(manifest), /frozen file differs/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
