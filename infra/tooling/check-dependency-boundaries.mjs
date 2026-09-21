import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const requiredPackageDirectories = [
  "apps/backoffice",
  "apps/cloud",
  "apps/pos-terminal",
  "apps/store-node",
  "packages/api-contract",
  "packages/application/coordinators",
  "packages/country-packs",
  "packages/database",
  "packages/observability",
  "packages/query",
  "packages/service-runtime",
  "packages/shared-kernel",
  "packages/sync-protocol",
  "packages/test-support",
  "packages/modules/accounting-lite",
  "packages/modules/cash-business-day",
  "packages/modules/catalog",
  "packages/modules/country-policy",
  "packages/modules/customer-and-credit",
  "packages/modules/iam",
  "packages/modules/inventory",
  "packages/modules/organization",
  "packages/modules/payments",
  "packages/modules/pricing",
  "packages/modules/procurement",
  "packages/modules/returns",
  "packages/modules/sales",
];

const forbiddenLegacyDirectories = [
  "apps/pos",
  "packages/contracts",
  "packages/domain",
  "packages/shared",
  "packages/ui",
];

const forbiddenDomainTargets = new Set([
  "application",
  "infrastructure",
  "launcher",
  "query",
  "ui",
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function allDependencies(manifest) {
  return new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}),
    ...Object.keys(manifest.optionalDependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
  ]);
}

function walkSourceFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (["dist", "node_modules", "target"].includes(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkSourceFiles(entryPath));
    } else if (/\.[cm]?[jt]sx?$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function importedSpecifiers(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const imports = [];
  const expression = /(?:from\s+|import\s*\(|require\s*\()\s*["'](@minimart\/[^"']+)["']/g;
  for (const match of source.matchAll(expression)) {
    imports.push(match[1]);
  }
  return imports;
}

function findTargetPackage(specifier, packagesByName) {
  return [...packagesByName.keys()]
    .sort((left, right) => right.length - left.length)
    .find((name) => specifier === name || specifier.startsWith(name + "/"));
}

export function loadPackages(rootDirectory, packageDirectories = requiredPackageDirectories) {
  return packageDirectories.map((relativeDirectory) => {
    const directory = path.join(rootDirectory, relativeDirectory);
    const manifestPath = path.join(directory, "package.json");
    if (!fs.existsSync(manifestPath)) {
      throw new Error("Missing package manifest: " + relativeDirectory + "/package.json");
    }
    return {
      relativeDirectory: relativeDirectory.replaceAll("\\", "/"),
      directory,
      manifest: readJson(manifestPath),
    };
  });
}

export function validatePackageMetadata(packages) {
  const errors = [];
  const names = new Set();
  for (const workspacePackage of packages) {
    const { manifest, relativeDirectory } = workspacePackage;
    if (typeof manifest.name !== "string" || !manifest.name.startsWith("@minimart/")) {
      errors.push(relativeDirectory + ": package name must use the @minimart scope");
    } else if (names.has(manifest.name)) {
      errors.push(relativeDirectory + ": duplicate package name " + manifest.name);
    } else {
      names.add(manifest.name);
    }

    const metadata = manifest.minimart;
    if (
      metadata === null ||
      typeof metadata !== "object" ||
      typeof metadata.layer !== "string" ||
      typeof metadata.module !== "string" ||
      !Array.isArray(metadata.capabilities) ||
      metadata.capabilities.length === 0
    ) {
      errors.push(
        relativeDirectory +
          ": minimart.layer, minimart.module, and non-empty minimart.capabilities are required",
      );
    }
  }
  return errors;
}

export function validateDependencyRules(packages) {
  const errors = [];
  const packagesByName = new Map(packages.map((entry) => [entry.manifest.name, entry]));
  const graph = new Map(packages.map((entry) => [entry.manifest.name, new Set()]));

  for (const sourcePackage of packages) {
    const declaredDependencies = allDependencies(sourcePackage.manifest);
    for (const dependencyName of declaredDependencies) {
      if (packagesByName.has(dependencyName))
        graph.get(sourcePackage.manifest.name).add(dependencyName);
    }

    for (const sourceFile of walkSourceFiles(path.join(sourcePackage.directory, "src"))) {
      for (const specifier of importedSpecifiers(sourceFile)) {
        const targetName = findTargetPackage(specifier, packagesByName);
        if (targetName === undefined || targetName === sourcePackage.manifest.name) continue;
        const targetPackage = packagesByName.get(targetName);
        const sourceMetadata = sourcePackage.manifest.minimart;
        const targetMetadata = targetPackage.manifest.minimart;
        const location =
          sourcePackage.relativeDirectory +
          "/" +
          path.relative(sourcePackage.directory, sourceFile).replaceAll("\\", "/");

        if (!declaredDependencies.has(targetName)) {
          errors.push(location + ": imports undeclared workspace dependency " + targetName);
        }

        if (
          sourcePackage.relativeDirectory.startsWith("packages/") &&
          targetPackage.relativeDirectory.startsWith("apps/")
        ) {
          errors.push(location + ": packages must not import apps");
        }

        if (sourceMetadata.layer === "domain" && forbiddenDomainTargets.has(targetMetadata.layer)) {
          errors.push(
            location +
              ": domain package must not depend on " +
              targetMetadata.layer +
              " package " +
              targetName,
          );
        }

        const crossesModule =
          sourceMetadata.module !== targetMetadata.module &&
          targetPackage.relativeDirectory.startsWith("packages/modules/");
        if (crossesModule && specifier.startsWith(targetName + "/internal")) {
          errors.push(location + ": cross-module internal import is forbidden: " + specifier);
        }

        if (
          sourceMetadata.layer === "query" &&
          targetPackage.relativeDirectory.startsWith("packages/modules/") &&
          specifier.startsWith(targetName + "/internal")
        ) {
          errors.push(location + ": query package must use module public query ports");
        }
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(name, trail) {
    if (visiting.has(name)) {
      errors.push("Workspace dependency cycle: " + [...trail, name].join(" -> "));
      return;
    }
    if (visited.has(name)) return;
    visiting.add(name);
    for (const target of graph.get(name) ?? []) visit(target, [...trail, name]);
    visiting.delete(name);
    visited.add(name);
  }
  for (const name of graph.keys()) visit(name, []);

  return errors;
}

export function validateRepository(rootDirectory) {
  const errors = [];
  for (const relativeDirectory of forbiddenLegacyDirectories) {
    if (fs.existsSync(path.join(rootDirectory, relativeDirectory))) {
      errors.push("Forbidden legacy directory exists: " + relativeDirectory);
    }
  }

  let packages;
  try {
    packages = loadPackages(rootDirectory);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return errors;
  }
  errors.push(...validatePackageMetadata(packages));
  errors.push(...validateDependencyRules(packages));
  return errors;
}

const invokedPath = process.argv[1] === undefined ? "" : path.resolve(process.argv[1]);
if (invokedPath === fileURLToPath(import.meta.url)) {
  const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const errors = validateRepository(rootDirectory);
  if (errors.length > 0) {
    console.error(errors.map((error) => "- " + error).join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      "Dependency boundaries valid for " +
        requiredPackageDirectories.length +
        " frozen workspace packages.",
    );
  }
}
