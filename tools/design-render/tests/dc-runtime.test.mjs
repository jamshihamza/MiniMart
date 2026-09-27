import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { renderClaudeDesignSource } from "../dc-runtime.mjs";

const fixturesRoot = resolve(dirname(fileURLToPath(import.meta.url)), "fixtures");
const executablePath = process.env.MINIMART_DESIGN_BROWSER_PATH;

let browser;
before(async () => {
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
});
after(async () => {
  await browser.close();
});

async function openFixture(name) {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve(fixturesRoot, name)).href, { waitUntil: "load" });
  return page;
}

test("sc-if renders the true branch and omits the false branch", async () => {
  const page = await openFixture("dc-fidelity.dc.html");
  try {
    await page.evaluate(renderClaudeDesignSource, { screen: "01" });
    assert.equal(await page.locator('[data-test="if-true"]').count(), 1);
    assert.equal(await page.locator('[data-test="if-false"]').count(), 0);
  } finally {
    await page.close();
  }
});

test("sc-if flips branches when the underlying expression flips", async () => {
  const page = await openFixture("dc-fidelity.dc.html");
  try {
    await page.evaluate(renderClaudeDesignSource, { screen: "99" });
    assert.equal(await page.locator('[data-test="if-true"]').count(), 0);
    assert.equal(await page.locator('[data-test="if-false"]').count(), 1);
  } finally {
    await page.close();
  }
});

test("sc-for renders one row per list item", async () => {
  const page = await openFixture("dc-fidelity.dc.html");
  try {
    await page.evaluate(renderClaudeDesignSource, { screen: "02" });
    const rows = await page.locator(".row").allTextContents();
    assert.deepEqual(rows, ["a", "b", "c"]);
  } finally {
    await page.close();
  }
});

test("image-slot is emulated with a visible placeholder when its real runtime is unavailable", async () => {
  const page = await openFixture("dc-fidelity.dc.html");
  try {
    // The final DOM flush (moving processed nodes through a detached
    // fragment) disconnects and reconnects the tree once, so a custom
    // element's connectedCallback legitimately fires more than once per
    // element; assert it ran, not an exact count.
    const diagnostics = await page.evaluate(renderClaudeDesignSource, { screen: "01" });
    assert.ok(diagnostics.imageSlotsEmulated >= 1);
    assert.ok(diagnostics.primitivesEncountered.includes("image-slot"));
    const text = await page.locator("image-slot").innerText();
    assert.match(text, /Drop packshot/);
  } finally {
    await page.close();
  }
});

test("an unsupported Claude Design primitive fails the render instead of disappearing silently", async () => {
  const page = await openFixture("dc-unsupported-primitive.dc.html");
  try {
    await assert.rejects(
      () => page.evaluate(renderClaudeDesignSource, { screen: "01" }),
      /Unsupported Claude Design primitive: <mystery-widget>/,
    );
  } finally {
    await page.close();
  }
});
