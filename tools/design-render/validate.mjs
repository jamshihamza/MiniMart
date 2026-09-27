import Ajv2020 from "ajv/dist/2020.js";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const designRoot = resolve(repositoryRoot, "docs/design");
export const schemaPath = resolve(designRoot, "design-manifest.schema.json");
export const renderReadyStatuses = new Set([
  "review-ready",
  "approved-visual-reference",
  "implementation-in-progress",
]);

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true, formats: { date: true } });
const validateSchema = ajv.compile(schema);

function inside(parent, child) {
  const path = relative(parent, child);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function formatSchemaErrors(errors = []) {
  return errors
    .map(({ instancePath, message, params }) => {
      const detail = params?.allowedValues ? ` (${params.allowedValues.join(", ")})` : "";
      return `${instancePath || "/"} ${message}${detail}`;
    })
    .join("; ");
}

export function validateManifestObject(manifest, manifestPath, options = {}) {
  const errors = [];
  const packageRoot = dirname(manifestPath);
  const expectedSlug = options.expectedSlug ?? packageRoot.split(/[\\/]/).at(-1);

  if (!validateSchema(manifest)) {
    errors.push(`schema: ${formatSchemaErrors(validateSchema.errors)}`);
  }

  if (manifest.slug && expectedSlug && manifest.slug !== expectedSlug) {
    errors.push(`slug must match package directory ${expectedSlug}`);
  }

  const screens = Array.isArray(manifest.screens) ? manifest.screens : [];
  const screenNumbers = new Set();
  const renderFiles = new Set();

  for (const screen of screens) {
    if (screen?.number !== undefined) {
      const match = /^(\d+)([a-zA-Z]?)$/.exec(String(screen.number));
      const normalized = match
        ? `${Number(match[1])}${match[2].toLowerCase()}`
        : String(screen.number).toLowerCase();
      if (screenNumbers.has(normalized)) {
        errors.push(`duplicate screen number: ${screen.number}`);
      }
      screenNumbers.add(normalized);
    }

    if (screen?.renderFile) {
      const normalized = screen.renderFile.toLowerCase();
      if (renderFiles.has(normalized)) {
        errors.push(`render filename collision: ${screen.renderFile}`);
      }
      renderFiles.add(normalized);
    }
  }

  if (Number.isInteger(manifest.screenCount) && manifest.screenCount !== screens.length) {
    errors.push(
      `screenCount ${manifest.screenCount} does not match ${screens.length} screen entries`,
    );
  }

  if (manifest.sourceFile) {
    const sourcePath = resolve(packageRoot, manifest.sourceFile);
    if (!inside(packageRoot, sourcePath)) {
      errors.push(`sourceFile escapes the package directory: ${manifest.sourceFile}`);
    } else if (
      options.checkSource !== false &&
      (!existsSync(sourcePath) || !statSync(sourcePath).isFile())
    ) {
      errors.push(`sourceFile does not exist: ${manifest.sourceFile}`);
    }
  }

  if (renderReadyStatuses.has(manifest.status)) {
    if (!manifest.sourceFile) errors.push(`status ${manifest.status} requires sourceFile`);
    if (screens.length === 0) errors.push(`status ${manifest.status} requires at least one screen`);
    for (const screen of screens) {
      if (!screen.renderFile) {
        errors.push(
          `screen ${screen.number ?? "<unknown>"} requires renderFile at status ${manifest.status}`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`${relative(repositoryRoot, manifestPath)}: ${errors.join("; ")}`);
  }
  return manifest;
}

export function loadAndValidateManifest(manifestPath, options = {}) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`${relative(repositoryRoot, manifestPath)}: malformed JSON: ${error.message}`, {
      cause: error,
    });
  }
  return validateManifestObject(manifest, manifestPath, options);
}

export function findManifestPaths(root = designRoot) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(root, entry.name, "design-manifest.json"))
    .filter(existsSync)
    .sort();
}

export function validateAllManifests(root = designRoot) {
  const manifests = findManifestPaths(root);
  for (const manifestPath of manifests) loadAndValidateManifest(manifestPath);
  return manifests;
}

function main() {
  const manifests = validateAllManifests();
  for (const manifestPath of manifests) {
    console.log(`Valid: ${relative(repositoryRoot, manifestPath)}`);
  }
  console.log(`Validated ${manifests.length} design manifests.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
