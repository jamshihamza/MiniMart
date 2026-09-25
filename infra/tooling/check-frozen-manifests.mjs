import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const manifests = [
  "docs/specifications/01-business-and-functional/FREEZE-MANIFEST.json",
  "docs/specifications/02-domain-model/MANIFEST-v1.0-FROZEN.json",
  "docs/specifications/03-database-model/MANIFEST-v1.2-FROZEN.json",
  "docs/specifications/04-architecture/MANIFEST-v1.0-FROZEN.json",
  "docs/specifications/05-api-contracts/MANIFEST-v1.0-FROZEN.json",
  "docs/specifications/06-ui-specification/MANIFEST-v1.0-FROZEN.json",
  "docs/backlog/MANIFEST-v0.1.json",
];

export function verifyManifest(manifestPath) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error(`${manifestPath}: manifest has no files`);
  }
  if (manifest.file_count !== undefined && manifest.file_count !== manifest.files.length) {
    throw new Error(`${manifestPath}: file_count does not match files`);
  }
  const root = dirname(manifestPath);
  const seen = new Set();
  for (const entry of manifest.files) {
    if (
      typeof entry.path !== "string" ||
      isAbsolute(entry.path) ||
      typeof entry.sha256 !== "string" ||
      !/^[0-9a-f]{64}$/i.test(entry.sha256) ||
      !Number.isSafeInteger(entry.bytes) ||
      entry.bytes < 0
    ) {
      throw new Error(`${manifestPath}: invalid file entry`);
    }
    const target = resolve(root, entry.path);
    if (!target.startsWith(`${root}${sep}`) || seen.has(target)) {
      throw new Error(`${manifestPath}: unsafe or duplicate file path ${entry.path}`);
    }
    seen.add(target);
    const raw = readFileSync(target);
    const bytes = Buffer.from(raw.toString("utf8").replaceAll("\r\n", "\n"), "utf8");
    const hash = createHash("sha256").update(bytes).digest("hex");
    if (bytes.length !== entry.bytes || hash !== entry.sha256.toLowerCase()) {
      throw new Error(`${manifestPath}: frozen file differs from manifest: ${entry.path}`);
    }
  }
  return seen.size;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let count = 0;
  for (const relativePath of manifests) {
    const manifestPath = resolve(repositoryRoot, relativePath);
    count += verifyManifest(manifestPath);
    console.log(`Verified frozen manifest: ${relativePath}`);
  }
  console.log(`Verified ${count} frozen files across ${manifests.length} manifests.`);
}
