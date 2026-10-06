// Does the 32px header make any POS control or dialog newly clipped? Compare header vs inspect=0.
import { createRequire } from "node:module";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");
const ids = ["01","02","02b","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
const sizes = [[1280,520]];
const b = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const probe = () => {
  const app = document.querySelector(".pos-app").getBoundingClientRect();
  const out = [];
  const label = (el) => (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 28);
  // Visible-by-layout controls: not inside a scrolling ancestor that clips them intentionally.
  for (const el of document.querySelectorAll(".pos-app button, .pos-app a[href], .pos-app input, .pos-app [role=dialog]")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    let inScroller = false;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(a).overflowY)) { inScroller = true; break; }
    }
    if (inScroller) continue; // reachable by scrolling; the header only changes how much is visible
    const clippedByScroller = false;
    const outside = r.bottom > app.bottom + 0.5 || r.top < app.top - 0.5 || r.right > app.right + 0.5 || r.left < app.left - 0.5;
    if (outside || clippedByScroller) out.push((el.getAttribute("role") === "dialog" ? "DIALOG:" : "") + label(el) + (outside ? " [outside POS area]" : " [cut by its own scroller]"));
  }
  return out;
};
let newlyClipped = 0;
const report = [];
for (const [w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  for (const id of ids) {
    const get = async (extra) => {
      await p.goto("about:blank");
      await p.goto(`http://127.0.0.1:1421/?screen=${id}&node=online${extra}#/pos`, { waitUntil: "load" });
      await p.waitForSelector(".pos-app");
      await p.waitForTimeout(200);
      return p.evaluate(probe);
    };
    const withHeader = await get("");
    const without = await get("&inspect=0");
    const added = withHeader.filter((x) => !without.includes(x));
    if (added.length) { newlyClipped += added.length; report.push(`${id}@${w}x${h}: newly clipped with header: ${added.join(" | ")}`); }
  }
  await ctx.close();
}
console.log("newly clipped controls caused by the header:", newlyClipped);
console.log(report.slice(0, 20).join("\n"));
await b.close();
