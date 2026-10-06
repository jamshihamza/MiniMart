import { createRequire } from "node:module";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");
const b = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const errs = [];
for (const [w, h] of [[1366, 768], [1280, 720]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("http://127.0.0.1:1421/?screen=02&node=online"); await p.waitForSelector(".pos-app"); await p.waitForTimeout(700);
  await p.screenshot({ path: `ws-pos-${w}.png` });
  await p.click(".ws-switch__button"); await p.waitForTimeout(200);
  await p.screenshot({ path: `ws-menu-${w}.png` });
  const box = await p.evaluate(() => { const r = document.querySelector(".ws-switch__button").getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
  console.log(w, "button box", box.map(Math.round).join(","), "hash", await p.evaluate(() => location.hash));
  await p.click("a.ws-switch__link:has-text('Back Office')"); await p.waitForTimeout(400);
  await p.screenshot({ path: `ws-bo-${w}.png` });
  console.log(w, "hash after", await p.evaluate(() => location.hash), "focus", await p.evaluate(() => document.activeElement && document.activeElement.id));
  await p.click(".ws-switch__button"); await p.click("a.ws-switch__link:has-text('POS')"); await p.waitForTimeout(500);
  console.log(w, "back in POS, cart items text:", await p.evaluate(() => document.body.innerText.match(/\d+ items?/)?.[0]));
  await ctx.close();
}
console.log("errors:", [...new Set(errs)]);
await b.close();
