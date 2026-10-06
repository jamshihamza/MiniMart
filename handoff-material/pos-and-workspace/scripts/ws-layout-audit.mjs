// Layout audit for the host header: no overlap, no page scroll, explicit POS height accounting.
import { createRequire } from "node:module";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");
const ids = ["01","02","02b","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
const sizes = [[1366,768],[1280,720],[1368,800],[1920,1080]];
const b = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const problems = [];
let combos = 0;
const heights = new Set();
for (const [w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => problems.push("pageerror " + e.message));
  p.on("console", (m) => { if (m.type() === "error") problems.push("console " + m.text()); });
  for (const id of ids) {
    await p.goto("about:blank");
    await p.goto(`http://127.0.0.1:1421/?screen=${id}&node=online#/pos`, { waitUntil: "load" });
    await p.waitForSelector(".pos-app");
    await p.waitForTimeout(250);
    const m = await p.evaluate(() => {
      const r = (el) => { const x = el.getBoundingClientRect(); return { x: x.x, y: x.y, w: x.width, h: x.height, b: x.bottom, r: x.right }; };
      const header = r(document.querySelector(".ws-header"));
      const app = r(document.querySelector(".pos-app"));
      const btn = r(document.querySelector(".ws-switch__button"));
      const de = document.documentElement;
      return {
        header, app, btn,
        vw: innerWidth, vh: innerHeight,
        scrollH: de.scrollHeight, scrollW: de.scrollWidth,
        labelClipped: (() => { const l = document.querySelector(".ws-header__label"); return l.scrollWidth > l.clientWidth; })(),
        // anything in the app positioned above the app top or below the window bottom
        belowFold: [...document.querySelectorAll(".pos-app *")].filter((el) => {
          const s = getComputedStyle(el); if (s.position === "fixed" || el.classList.contains("skip-link")) return false;
          const q = el.getBoundingClientRect(); return q.height > 0 && q.top < app_top() - 0.5;
          function app_top() { return document.querySelector(".pos-app").getBoundingClientRect().top; }
        }).length,
      };
    });
    combos++;
    heights.add(`${w}x${h}: header ${m.header.h}px, POS ${m.app.h}px`);
    const tag = `${id}@${w}x${h}`;
    if (m.header.h !== 32) problems.push(`${tag} header height ${m.header.h}`);
    if (Math.abs(m.header.b - m.app.y) > 0.5) problems.push(`${tag} header bottom ${m.header.b} != POS top ${m.app.y}`);
    if (Math.abs(m.app.h - (m.vh - 32)) > 0.5) problems.push(`${tag} POS height ${m.app.h} != ${m.vh - 32}`);
    if (m.app.b > m.vh + 0.5) problems.push(`${tag} POS bottom ${m.app.b} beyond window ${m.vh}`);
    if (m.scrollH > m.vh) problems.push(`${tag} page scrolls vertically (${m.scrollH} > ${m.vh})`);
    if (m.scrollW > m.vw) problems.push(`${tag} page scrolls horizontally (${m.scrollW} > ${m.vw})`);
    if (m.btn.r > m.vw - 4 || m.btn.y < 0 || m.btn.b > 32) problems.push(`${tag} switch outside header: ${JSON.stringify(m.btn)}`);
    if (m.btn.x < m.vw / 2) problems.push(`${tag} switch not at right: x=${m.btn.x}`);
    if (m.labelClipped) problems.push(`${tag} header label clipped`);
    if (m.belowFold > 0) problems.push(`${tag} ${m.belowFold} POS elements above the POS top`);
  }
  await ctx.close();
}
// Menu open: it must stay inside the window and not push layout.
for (const [w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:1421/?screen=02&node=online#/pos`, { waitUntil: "load" });
  await p.waitForSelector(".pos-app");
  const before = await p.evaluate(() => document.querySelector(".pos-app").getBoundingClientRect().height);
  await p.click(".ws-switch__button");
  const r = await p.evaluate(() => { const x = document.querySelector(".ws-switch__menu").getBoundingClientRect(); return { r: x.right, b: x.bottom, l: x.left, t: x.top, vw: innerWidth, vh: innerHeight, app: document.querySelector(".pos-app").getBoundingClientRect().height, scrollH: document.documentElement.scrollHeight }; });
  if (r.r > r.vw || r.l < 0 || r.b > r.vh || r.t < 0) problems.push(`menu outside window at ${w}x${h}: ${JSON.stringify(r)}`);
  if (r.app !== before || r.scrollH > r.vh) problems.push(`menu changed layout at ${w}x${h}`);
  await ctx.close();
}
// Back Office placeholder under the header.
for (const [w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:1421/#/back-office`, { waitUntil: "load" });
  await p.waitForSelector(".bo-workspace");
  const r = await p.evaluate(() => ({ bo: document.querySelector(".bo-workspace").getBoundingClientRect().height, vh: innerHeight, scrollH: document.documentElement.scrollHeight }));
  if (Math.abs(r.bo - (r.vh - 32)) > 0.5 || r.scrollH > r.vh) problems.push(`Back Office height at ${w}x${h}: ${JSON.stringify(r)}`);
  await ctx.close();
}
console.log("POS screen x viewport combinations with the header:", combos);
console.log([...heights].join("\n"));
console.log(problems.length ? "PROBLEMS:\n" + [...new Set(problems)].slice(0, 20).join("\n") : "no problems");
await b.close();
