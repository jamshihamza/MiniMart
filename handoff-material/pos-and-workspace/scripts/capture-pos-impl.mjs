// Scratch tool: capture the POS implementation and build side-by-side images with the reference.
// Usage: node capture-pos-impl.mjs <outDir> <width>x<height> <screen> [<screen> ...]
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, existsSync } from "node:fs";

const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");

const BASE = "http://127.0.0.1:1420/";
// node=online simulates the reference's online pill for parity (screen 26 shows it offline).
const route = (screen) => `?screen=${screen}&inspect=0${screen === "26" ? "" : "&node=online"}`;

const [outDir, size, ...screens] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const context = await browser.newContext({ viewport: { width, height } });
const page = await context.newPage();
const problems = [];
page.on("pageerror", (e) => problems.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") problems.push("console: " + m.text());
});
for (const screen of screens) {
  const url = `${BASE}${route(screen)}`;
  await page.goto("about:blank");
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector(".pos-app");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const impl = `${outDir}/posimpl-${screen}-${width}x${height}.png`;
  await page.screenshot({ path: impl });
  const ref = `${outDir}/posref-${screen}-${width}x${height}.png`;
  if (existsSync(ref)) {
    const b64 = (f) => readFileSync(f).toString("base64");
    const sbs = await context.newPage();
    await sbs.setViewportSize({ width: width * 2 + 24, height: height + 44 });
    await sbs.setContent(
      `<body style="margin:0;background:#888;font:600 14px system-ui;color:#fff"><div style="display:flex;gap:24px">` +
        `<div><div style="padding:6px 8px;background:#333">REFERENCE (approved MiniMartPOS.dc.html) · screen ${screen} · ${width}x${height}</div><img style="display:block" src="data:image/png;base64,${b64(ref)}"></div>` +
        `<div><div style="padding:6px 8px;background:#1b5fd1">IMPLEMENTATION (apps/pos-terminal) · screen ${screen} · ${width}x${height}</div><img style="display:block" src="data:image/png;base64,${b64(impl)}"></div>` +
        `</div></body>`,
    );
    await sbs.screenshot({ path: `${outDir}/possbs-${screen}-${width}x${height}.png` });
    await sbs.close();
  }
  console.log("done", screen, size);
}
if (problems.length) console.log("PROBLEMS:", [...new Set(problems)].slice(0, 8));
await browser.close();
