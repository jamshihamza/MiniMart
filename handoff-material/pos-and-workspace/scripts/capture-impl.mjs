// Scratch tool (outside the repo): capture the implementation, then build side-by-side images.
// Usage: node capture-impl.mjs <outDir> <width>x<height> <refScreen> [<refScreen> ...]
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, existsSync } from "node:fs";

const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");

const BASE = "http://127.0.0.1:1430/#/reports";
const D = "/daily-sales-summary";
const ROUTES = {
  "01": `${"?state=ready"}`,
  "02": "?state=search&q=return",
  "04": "?state=loading",
  "05": "?state=empty",
  "06": "?state=denied",
  "07": "?state=local-scope",
  "08": "?state=node-unavailable",
  "09": "?state=incompatible",
  "10": "?state=central",
  "29": `${D}?state=ready`,
  "19": `${D}?state=loading`,
  "20": `${D}?state=empty`,
  "21": `${D}?state=invalid`,
  "22": `${D}?state=denied`,
  "23": `${D}?state=conflict`,
  "24": `${D}?state=failed`,
  "25": `${D}?state=offline`,
  "26": `${D}?state=node-unavailable`,
  "27": `${D}?state=incompatible`,
};

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
  const route = ROUTES[screen];
  if (route === undefined) throw new Error("no route for " + screen);
  const url = `${BASE}${route.startsWith("?") ? "" : ""}${route}${route.includes("?") ? "&" : "?"}inspect=0`;
  await page.goto("about:blank");
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector(".mm-app");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const impl = `${outDir}/impl-${screen}-${width}x${height}.png`;
  await page.screenshot({ path: impl });
  console.log("impl", impl);

  const ref = `${outDir}/ref-${screen}-${width}x${height}.png`;
  if (existsSync(ref)) {
    const b64 = (f) => readFileSync(f).toString("base64");
    const sbs = await context.newPage();
    await sbs.setViewport?.({ width: width * 2 + 24, height: height + 44 });
    await sbs.setViewportSize({ width: width * 2 + 24, height: height + 44 });
    await sbs.setContent(
      `<body style="margin:0;background:#888;font:600 14px system-ui;color:#fff">` +
        `<div style="display:flex;gap:24px;padding:0">` +
        `<div><div style="padding:6px 8px;background:#333">REFERENCE (approved source) · screen ${screen} · ${width}x${height}</div><img style="display:block" src="data:image/png;base64,${b64(ref)}"></div>` +
        `<div><div style="padding:6px 8px;background:#1b5fd1">IMPLEMENTATION (apps/backoffice) · screen ${screen} · ${width}x${height}</div><img style="display:block" src="data:image/png;base64,${b64(impl)}"></div>` +
        `</div></body>`,
    );
    const out = `${outDir}/sbs-${screen}-${width}x${height}.png`;
    await sbs.screenshot({ path: out });
    await sbs.close();
    console.log("sbs ", out);
  }
}
if (problems.length) console.log("PROBLEMS:", [...new Set(problems)].slice(0, 8));
await browser.close();
