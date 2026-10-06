import { createRequire } from "node:module";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");
const b = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } });
const probe = (labels) => (ls) => {
  const out = {};
  for (const l of ls) {
    const el = [...document.querySelectorAll("span")].find((e) => e.children.length === 0 && e.textContent.trim() === l && getComputedStyle(e).letterSpacing !== "normal");
    if (el) { const r = el.getBoundingClientRect(); out[l] = { x: Math.round(r.x * 10) / 10, w: Math.round(r.width * 10) / 10 }; }
  }
  const tbl = [...document.querySelectorAll("div")].find((d) => getComputedStyle(d).overflowY === "auto" && d.querySelector("span") && d.textContent.includes("RECEIPT"));
  if (tbl) out.container = { w: tbl.clientWidth, sw: tbl.offsetWidth - tbl.clientWidth };
  return out;
};
const ref = await ctx.newPage();
await ref.goto("http://127.0.0.1:8766/MiniMartPOS.dc.html");
await ref.waitForFunction(() => typeof window.__dcRootName === "function" && Boolean(window.__dcRootName()));
await ref.evaluate(() => window.__dcSetProps(window.__dcRootName(), { screen: "16", embedded: false }));
await ref.waitForTimeout(1200);
const labels = ["RECEIPT", "DATE / TIME", "CUSTOMER", "ITEMS", "TOTAL", "TENDER", "STATUS"];
console.log("REF ", JSON.stringify(await ref.evaluate(probe(labels), labels)));
const impl = await ctx.newPage();
await impl.goto("http://127.0.0.1:1420/?screen=16&inspect=0&node=online");
await impl.waitForSelector(".hrow--head");
await impl.waitForTimeout(800);
console.log("IMPL", JSON.stringify(await impl.evaluate(probe(labels), labels)));
await b.close();
