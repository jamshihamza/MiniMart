import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");
const pairs = process.argv.slice(2).map((a) => a.split(","));
const b = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage();
await p.setContent("<canvas id=c></canvas>");
for (const [x, y] of pairs) {
  const r = await p.evaluate(async ([a, c]) => {
    const load = (s) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = "data:image/png;base64," + s; });
    const [ia, ic] = await Promise.all([load(a), load(c)]);
    const cv = document.getElementById("c"); cv.width = ia.width; cv.height = ia.height;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(ia, 0, 0); const da = ctx.getImageData(0, 0, ia.width, ia.height).data;
    ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(ic, 0, 0); const dc = ctx.getImageData(0, 0, ia.width, ia.height).data;
    let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let i = 0; i < da.length; i += 4) if (da[i] !== dc[i] || da[i+1] !== dc[i+1] || da[i+2] !== dc[i+2]) { n++; const px = (i / 4) % ia.width, py = Math.floor(i / 4 / ia.width); x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); }
    return { size: [ia.width, ia.height, ic.width, ic.height], differing: n, bbox: [x0, y0, x1, y1] };
  }, [readFileSync(x).toString("base64"), readFileSync(y).toString("base64")]);
  console.log(x, JSON.stringify(r));
}
await b.close();
