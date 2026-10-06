// Scratch tool (outside the repo): capture reference screens from the approved Reporting source.
// Usage: node capture-ref.mjs <outDir> <width>x<height> <screen> [<screen> ...]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");

const [outDir, size, ...screens] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const context = await browser.newContext({ viewport: { width, height } });
const url = "http://127.0.0.1:8765/reports/source/MiniMartReports.dc.html";
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url, { waitUntil: "load" });
await page.waitForFunction(
  () => typeof window.__dcRootName === "function" && Boolean(window.__dcRootName()),
  null,
  { timeout: 60000 },
);
for (const screen of screens) {
  await page.evaluate((s) => {
    window.__dcSetProps(window.__dcRootName(), { screen: s, embedded: false });
  }, screen);
  await page.waitForFunction(
    (s) => {
      const el = document.querySelector("[data-screen-label]");
      return Boolean(el) && (el.getAttribute("data-screen-label") ?? "").startsWith(s + " ");
    },
    screen,
    { timeout: 30000 },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const file = `${outDir}/ref-${screen}-${width}x${height}.png`;
  await page.screenshot({ path: file });
  console.log("captured", file);
}
if (errors.length) console.log("pageerrors:", errors.slice(0, 3));
await browser.close();
