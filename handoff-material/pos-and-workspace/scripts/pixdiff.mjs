// Content-area pixel diff between reference and implementation captures (sidebar and top bar excluded).
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");

const dir = "D:/mm-scratch/posshots";
const viewports = ["1366x768", "1280x720", "1368x800", "1920x1080"];
const screens = "01 02 02b 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30".split(" ");
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage();
await page.goto("about:blank");
const rows = [];
for (const v of viewports) {
  for (const s of screens) {
    const a = `${dir}/posref-${s}-${v}.png`;
    const b = `${dir}/posimpl-${s}-${v}.png`;
    if (!existsSync(a) || !existsSync(b)) continue;
    const pct = await page.evaluate(
      async ({ a64, b64 }) => {
        const load = (u) =>
          new Promise((res) => {
            const i = new Image();
            i.onload = () => res(i);
            i.src = u;
          });
        const [ia, ib] = await Promise.all([load(a64), load(b64)]);
        const w = ia.width, h = ia.height;
        const get = (img) => {
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          const x = c.getContext("2d");
          x.drawImage(img, 0, 0);
          return x.getImageData(0, 0, w, h).data;
        };
        const da = get(ia), db = get(ib);
        // content area: right of the 208px sidebar column, below the 57px top bar, above the bottom-right fixed items
        let diff = 0, total = 0;
        for (let y = 57; y < h; y += 1) {
          for (let x = 208; x < w; x += 1) {
            const i = (y * w + x) * 4;
            const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
            total += 1;
            if (d > 60) diff += 1;
          }
        }
        return (100 * diff) / total;
      },
      { a64: "data:image/png;base64," + readFileSync(a).toString("base64"), b64: "data:image/png;base64," + readFileSync(b).toString("base64") },
    );
    rows.push({ v, s, pct });
  }
}
rows.sort((x, y) => y.pct - x.pct);
console.log("worst 14:");
for (const r of rows.slice(0, 14)) console.log(`${r.pct.toFixed(2)}%  screen ${r.s} @ ${r.v}`);
const mean = rows.reduce((t, r) => t + r.pct, 0) / rows.length;
console.log(`comparisons: ${rows.length}, mean differing pixels: ${mean.toFixed(2)}%, median: ${rows[Math.floor(rows.length / 2)].pct.toFixed(2)}%`);
await browser.close();
