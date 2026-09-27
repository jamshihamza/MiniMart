import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { renderClaudeDesignSource } from "./dc-runtime.mjs";
import {
  designRoot,
  findManifestPaths,
  loadAndValidateManifest,
  renderReadyStatuses,
  repositoryRoot,
} from "./validate.mjs";

// Claude Design sources reference the real IBM Plex webfonts and the real
// Lucide icon font from their actual CDNs -- this is genuine design-system
// runtime behaviour (icon glyphs, badge typography), not decoration. Do not
// approximate these with locally invented styles. The renderer fetches the
// real bytes from these specific hosts once and caches them on disk so
// later runs are deterministic and do not depend on network availability.
// Every other cross-origin host stays blocked and fails the render loudly,
// so an unexpected external dependency is never silently dropped.
const ALLOWED_ASSET_HOSTS = new Set(["fonts.googleapis.com", "fonts.gstatic.com", "unpkg.com"]);
const vendorCacheRoot = resolve(dirname(fileURLToPath(import.meta.url)), "vendor-cache");

// Claude Design's own editor harness (`support.js`) and the `image-slot.js`
// component runtime were never exported alongside the design source and do
// not exist anywhere in this repository (including the Mockups exports).
// `support.js` is not referenced by any inline template/script and has no
// effect on the rendered output -- its absence is a known, inert gap.
// `image-slot.js` is compensated for with a local emulation in
// dc-runtime.mjs. Both are recorded, not silently ignored: see
// RENDER-FIDELITY-REPORT.md.
const KNOWN_MISSING_LOCAL_ASSETS = new Set(["support.js", "image-slot.js"]);

const inflightFetches = new Map();

// Real fonts/icons are fetched from real CDNs, but a design package pulls in
// enough font-weight/unicode-range variants that the browser can issue
// dozens of these requests within milliseconds of each other; a single
// transient network hiccup under that burst must not fail an otherwise
// correct render. Dedupe concurrent requests for the same URL and retry
// briefly before giving up -- this is retry of a real fetch, never a
// fabricated fallback body.
async function fetchWithCache(url) {
  mkdirSync(vendorCacheRoot, { recursive: true });
  const digest = createHash("sha256").update(url).digest("hex");
  const bodyPath = resolve(vendorCacheRoot, `${digest}.body`);
  const metaPath = resolve(vendorCacheRoot, `${digest}.meta.json`);
  if (existsSync(bodyPath) && existsSync(metaPath)) {
    return {
      body: readFileSync(bodyPath),
      contentType: JSON.parse(readFileSync(metaPath, "utf8")).contentType,
    };
  }
  if (inflightFetches.has(url)) return inflightFetches.get(url);

  const attempt = async () => {
    let lastError;
    for (let retry = 0; retry < 4; retry += 1) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get("content-type") ?? "application/octet-stream";
        const body = Buffer.from(await response.arrayBuffer());
        writeFileSync(bodyPath, body);
        writeFileSync(metaPath, JSON.stringify({ url, contentType }));
        return { body, contentType };
      } catch (error) {
        lastError = error;
        await new Promise((done) => setTimeout(done, 250 * (retry + 1)));
      }
    }
    throw new Error(`vendor asset fetch failed for ${url}: ${lastError.message}`, {
      cause: lastError,
    });
  };

  const promise = attempt().finally(() => inflightFetches.delete(url));
  inflightFetches.set(url, promise);
  return promise;
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function inside(parent, child) {
  const path = relative(parent, child);
  return path === "" || (path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path));
}

function viewport(value) {
  const match = /^(\d+)x(\d+)$/.exec(value ?? "");
  if (!match) throw new Error(`Invalid or missing primaryViewport: ${value ?? "<missing>"}`);
  return { width: Number(match[1]), height: Number(match[2]) };
}

function startStaticServer(packageRoot) {
  const server = createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const target = resolve(packageRoot, pathname.replace(/^\/+/, ""));
      if (!inside(packageRoot, target) || !existsSync(target) || !statSync(target).isFile()) {
        response.writeHead(404).end("Not found");
        return;
      }
      response.writeHead(200, {
        "content-type":
          contentTypes.get(extname(target).toLowerCase()) ?? "application/octet-stream",
        "cache-control": "no-store",
      });
      response.end(readFileSync(target));
    } catch (error) {
      response.writeHead(500).end(error.message);
    }
  });
  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolveServer({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

function screenUrl(sourceUrl, screen) {
  if (screen.render?.url) return new URL(screen.render.url, sourceUrl).href;
  const url = new URL(sourceUrl);
  url.searchParams.set("screen", String(screen.number).padStart(2, "0"));
  return url.href;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function writePdf(browser, manifest, outputPaths, exportsRoot) {
  const page = await browser.newPage();
  const sections = outputPaths.map(({ screen, outputPath }) => {
    const image = readFileSync(outputPath).toString("base64");
    return `<section><h1>${escapeHtml(String(screen.number).padStart(2, "0"))} — ${escapeHtml(screen.name)}</h1><img src="data:image/png;base64,${image}"></section>`;
  });
  await page.setContent(
    `<style>@page{size:auto;margin:12mm}body{margin:0;font:14px sans-serif}section{break-after:page}section:last-child{break-after:auto}h1{font-size:16px}img{display:block;max-width:100%;height:auto}</style>${sections.join("")}`,
    { waitUntil: "load" },
  );
  mkdirSync(exportsRoot, { recursive: true });
  const pdfPath = resolve(exportsRoot, `${manifest.slug}.pdf`);
  await page.pdf({ path: pdfPath, printBackground: true, preferCSSPageSize: true });
  await page.close();
  return pdfPath;
}

export async function renderPackage(manifestPath, options = {}) {
  const manifest = loadAndValidateManifest(manifestPath);
  const packageRoot = dirname(manifestPath);
  if (!manifest.sourceFile) throw new Error(`${manifest.slug}: source file missing from manifest`);
  const sourcePath = resolve(packageRoot, manifest.sourceFile);
  if (!existsSync(sourcePath))
    throw new Error(`${manifest.slug}: source file missing: ${manifest.sourceFile}`);
  if (!Array.isArray(manifest.screens) || manifest.screens.length === 0) {
    throw new Error(`${manifest.slug}: no screens are defined`);
  }
  for (const screen of manifest.screens) {
    if (!screen.renderFile)
      throw new Error(`${manifest.slug}: screen ${screen.number} has no renderFile`);
  }

  const rendersRoot = resolve(packageRoot, "renders");
  const exportsRoot = resolve(packageRoot, "exports");
  mkdirSync(rendersRoot, { recursive: true });
  const { server, origin } = await startStaticServer(packageRoot);
  let browser;
  try {
    const executablePath = options.executablePath ?? process.env.MINIMART_DESIGN_BROWSER_PATH;
    browser = await (options.browserType ?? chromium).launch({
      headless: true,
      ...(executablePath ? { executablePath } : {}),
    });
    const context = await browser.newContext({ viewport: viewport(manifest.primaryViewport) });
    const screenDiagnostics = [];
    const outputPaths = [];

    for (const screen of manifest.screens) {
      const page = await context.newPage();
      const pageErrors = [];
      const blockedRequests = [];
      const knownMissingAssets = [];
      const badResponses = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("response", (candidate) => {
        if (candidate.status() < 400) return;
        const filename = new URL(candidate.url()).pathname.split("/").pop();
        if (candidate.status() === 404 && KNOWN_MISSING_LOCAL_ASSETS.has(filename)) {
          knownMissingAssets.push(filename);
          return;
        }
        badResponses.push({ url: candidate.url(), status: candidate.status() });
      });
      await page.route("**/*", async (route) => {
        const requestUrl = new URL(route.request().url());
        if (requestUrl.origin === origin || requestUrl.protocol === "data:") {
          await route.continue();
          return;
        }
        if (ALLOWED_ASSET_HOSTS.has(requestUrl.hostname)) {
          try {
            const cached = await fetchWithCache(requestUrl.href);
            await route.fulfill({
              status: 200,
              contentType: cached.contentType,
              body: cached.body,
            });
          } catch (error) {
            blockedRequests.push(`${requestUrl.href} (${error.message})`);
            await route.abort("failed");
          }
          return;
        }
        blockedRequests.push(requestUrl.href);
        await route.abort("blockedbyclient");
      });

      const sourceRelative = relative(packageRoot, sourcePath)
        .split(sep)
        .map(encodeURIComponent)
        .join("/");
      const sourceUrl = `${origin}/${sourceRelative}`;
      const response = await page.goto(screenUrl(sourceUrl, screen), { waitUntil: "load" });
      if (!response?.ok())
        throw new Error(
          `screen ${screen.number} returned HTTP ${response?.status() ?? "no response"}`,
        );
      let diagnostics = { primitivesEncountered: [], imageSlotsEmulated: 0 };
      if (manifest.sourceFile.toLowerCase().endsWith(".dc.html")) {
        diagnostics = await page.evaluate(renderClaudeDesignSource, {
          screen: String(screen.number),
        });
        await page.locator("body[data-design-render-ready='true']").waitFor();
      }
      if (screen.render?.readySelector) {
        await page.locator(screen.render.readySelector).waitFor({ state: "visible" });
      }
      await page.evaluate(() => globalThis.document.fonts?.ready);
      if (pageErrors.length > 0)
        throw new Error(`screen ${screen.number} failed: ${pageErrors.join("; ")}`);
      if (blockedRequests.length > 0)
        throw new Error(
          `screen ${screen.number} required an unresolved external resource: ${blockedRequests.join(", ")}`,
        );
      if (badResponses.length > 0)
        throw new Error(
          `screen ${screen.number} had a failed resource request: ${badResponses
            .map((entry) => `${entry.url} (HTTP ${entry.status})`)
            .join(", ")}`,
        );
      if ((await page.locator("body").innerText()).trim().length === 0) {
        throw new Error(`screen ${screen.number} rendered an empty document`);
      }

      const outputPath = resolve(rendersRoot, screen.renderFile);
      if (!inside(rendersRoot, outputPath))
        throw new Error(`unsafe renderFile for screen ${screen.number}`);
      const target = screen.render?.captureSelector
        ? page.locator(screen.render.captureSelector)
        : page;
      await target.screenshot({ path: outputPath, animations: "disabled" });
      if (!existsSync(outputPath))
        throw new Error(`screenshot generation failed for screen ${screen.number}`);
      screenDiagnostics.push({
        package: manifest.slug,
        screenNumber: screen.number,
        screenName: screen.name,
        primitivesEncountered: diagnostics.primitivesEncountered,
        imageSlotsEmulated: diagnostics.imageSlotsEmulated,
        knownMissingAssets,
        status: diagnostics.imageSlotsEmulated > 0 ? "KNOWN-DIFFERENCE" : "RUNTIME-COMPLETE",
      });
      outputPaths.push({ screen, outputPath });
      await page.close();
    }

    for (const screen of manifest.screens) {
      if (!existsSync(resolve(rendersRoot, screen.renderFile))) {
        throw new Error(`manifest references missing render output: ${screen.renderFile}`);
      }
    }

    let pdfPath = null;
    if (options.pdf) pdfPath = await writePdf(browser, manifest, outputPaths, exportsRoot);
    await context.close();
    writeFileSync(
      resolve(rendersRoot, "diagnostics.json"),
      JSON.stringify(
        {
          package: manifest.package,
          slug: manifest.slug,
          generatedAt: new Date().toISOString(),
          screenDiagnostics,
        },
        null,
        2,
      ),
    );
    return { manifest, outputPaths, pdfPath, screenDiagnostics };
  } catch (error) {
    throw new Error(`${manifest.slug}: render failed: ${error.message}`, { cause: error });
  } finally {
    if (browser) await browser.close();
    await new Promise((done) => server.close(done));
  }
}

function parseArgs(args) {
  const options = { pdf: false, allReady: false, packageSlug: null };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--pdf") options.pdf = true;
    else if (arg === "--all-ready") options.allReady = true;
    else if (arg === "--package") options.packageSlug = args[++index];
    else if (arg.startsWith("--package=")) options.packageSlug = arg.slice("--package=".length);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (options.allReady === Boolean(options.packageSlug)) {
    throw new Error("Specify exactly one of --package <slug> or --all-ready");
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  let manifestPaths;
  if (options.packageSlug) {
    manifestPaths = [resolve(designRoot, options.packageSlug, "design-manifest.json")];
    if (!existsSync(manifestPaths[0]))
      throw new Error(`Unknown design package: ${options.packageSlug}`);
  } else {
    manifestPaths = findManifestPaths().filter((manifestPath) => {
      const manifest = loadAndValidateManifest(manifestPath);
      return renderReadyStatuses.has(manifest.status) && Boolean(manifest.sourceFile);
    });
  }

  if (manifestPaths.length === 0) {
    console.log("No render-ready design packages with source files; nothing to render.");
    return;
  }
  for (const manifestPath of manifestPaths) {
    const result = await renderPackage(manifestPath, { pdf: options.pdf });
    console.log(`Rendered ${result.outputPaths.length} screens for ${result.manifest.slug}.`);
    if (result.pdfPath) console.log(`PDF: ${relative(repositoryRoot, result.pdfPath)}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
