import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { designRoot, repositoryRoot } from "./validate.mjs";

export const reportPath = resolve(designRoot, "RENDER-FIDELITY-REPORT.md");

// Packages without a rendered `diagnostics.json` yet are reported as
// UNVERIFIED rather than omitted, so the report always names every package
// slot instead of only the ones most recently rendered.
function listPackageSlugs() {
  return readdirSync(designRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function loadDiagnostics(slug) {
  const diagnosticsPath = resolve(designRoot, slug, "renders", "diagnostics.json");
  if (!existsSync(diagnosticsPath)) return null;
  return JSON.parse(readFileSync(diagnosticsPath, "utf8"));
}

function screenStatusLine(screen) {
  const notes = [];
  if (screen.imageSlotsEmulated > 0) {
    notes.push(
      `${screen.imageSlotsEmulated} \`image-slot\` element(s) emulated (no real dependency exists)`,
    );
  }
  if (screen.knownMissingAssets?.length > 0) {
    notes.push(`known-missing local asset(s): ${screen.knownMissingAssets.join(", ")}`);
  }
  const noteText = notes.length > 0 ? ` — ${notes.join("; ")}` : "";
  return `| ${screen.screenNumber} | ${screen.screenName} | ${screen.status} | ${noteText.replace(/^ — /, "")} |`;
}

export function buildReportMarkdown() {
  const slugs = listPackageSlugs();
  const generatedAt = new Date().toISOString();
  const lines = [
    "# Design render fidelity report",
    "",
    `Generated ${generatedAt}. This report reflects the most recent local run of \`pnpm design:render\` for` +
      " each package below; it is not evidence of a check that has not actually been run.",
    "",
    "Statuses:",
    "",
    "- `UNVERIFIED` — package has not been rendered with the fidelity-checking renderer in this workspace yet.",
    "- `RUNTIME-COMPLETE` — every Claude Design primitive on the screen was reproduced with its real runtime" +
      " behaviour (real fonts/icons fetched from their real CDN, real `sc-if`/`sc-for`/`x-dc` evaluation); no" +
      " emulation was needed.",
    "- `KNOWN-DIFFERENCE` — the screen rendered successfully but required an emulated primitive because a real" +
      " local dependency does not exist in this repository. The specific difference is named per screen.",
    "- `BLOCKED` — the screen could not be rendered at all (unsupported primitive, page error, unresolved" +
      " asset); rendering must have failed loudly rather than silently succeeding.",
    "",
    'This report never uses the word "MATCH" — a generated PNG existing is not evidence of visual fidelity' +
      " to the Claude Design source; only the primitive-by-primitive accounting below is.",
    "",
    "## Known runtime dependency gaps",
    "",
    '- `support.js` is referenced by every `.dc.html` source (`<script src="./support.js">`) but does not' +
      " exist anywhere in this repository, including the original `Mockups/` exports. It is Claude Design's" +
      " own editor-harness script. Neither `MiniMartBackOffice.dc.html` nor `MiniMartPOS.dc.html`'s inline" +
      " `data-dc-script` component calls anything from it (verified: no `window.*`/global helper calls outside" +
      " `DCLogic`/`React`, which this renderer supplies directly). Its 404 is expected and has no effect on the" +
      " rendered output.",
    "- `image-slot.js` defines the `<image-slot>` custom element used for product-packshot placeholders" +
      " (Back Office product form, Design System component inventory). It does not exist anywhere in this" +
      " repository or the `Mockups/` exports either — there is no real dependency to load. `dc-runtime.mjs`" +
      " emulates it with a static placeholder (icon + label, shape-aware). This is a real visual difference" +
      " from the authentic Claude Design output and is reported as `KNOWN-DIFFERENCE`, not hidden.",
    "- The real IBM Plex webfonts and the real Lucide icon font are fetched from their genuine CDNs" +
      " (`fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com`) and cached locally in" +
      " `tools/design-render/vendor-cache/` on first render. Earlier renders blocked all cross-origin requests," +
      " which silently produced blank icons and a fallback typeface across every screen despite a passing" +
      " render count — this was the primary root cause of the reported missing visual elements. Any other" +
      " cross-origin host stays blocked and fails the render loudly.",
    "",
  ];

  for (const slug of slugs) {
    const diagnostics = loadDiagnostics(slug);
    lines.push(`## ${slug}`, "");
    if (!diagnostics) {
      lines.push("Status: **UNVERIFIED** — not rendered in this workspace.", "");
      continue;
    }
    const anyKnownDifference = diagnostics.screenDiagnostics.some(
      (s) => s.status === "KNOWN-DIFFERENCE",
    );
    lines.push(
      `Package: ${diagnostics.package}. Rendered ${diagnostics.screenDiagnostics.length} screen(s) at` +
        ` ${diagnostics.generatedAt}. ${anyKnownDifference ? "Contains KNOWN-DIFFERENCE screens (see table)." : "All screens RUNTIME-COMPLETE."}`,
      "",
      "| Screen | Name | Status | Notes |",
      "| --- | --- | --- | --- |",
      ...diagnostics.screenDiagnostics.map(screenStatusLine),
      "",
    );
  }

  return lines.join("\n") + "\n";
}

async function main() {
  const markdown = buildReportMarkdown();
  writeFileSync(reportPath, markdown);
  console.log(
    `Wrote ${reportPath.replace(repositoryRoot + "\\", "").replace(repositoryRoot + "/", "")}`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
