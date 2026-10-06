import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");
const b = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const img = (f) => "data:image/png;base64," + readFileSync("ws-review/" + f).toString("base64");
for (const [state, w, h] of [["pos", 1366, 768], ["menu", 1366, 768], ["pos", 1280, 720], ["menu", 1280, 720], ["bo", 1366, 768]]) {
  const p = await b.newPage({ viewport: { width: w * 2 + 24, height: h + 44 } });
  await p.setContent(`<body style="margin:0;background:#888;font:600 14px system-ui;color:#fff"><div style="display:flex;gap:24px"><div><div style="padding:6px 8px;background:#a4262c">BEFORE (rejected): floating bottom-left · ${state} · ${w}x${h}</div><img style="display:block" src="${img(`before-${state}-${w}.png`)}"></div><div><div style="padding:6px 8px;background:#1b5fd1">AFTER: top-right host header · ${state} · ${w}x${h}</div><img style="display:block" src="${img(`after-${state}-${w}.png`)}"></div></div></body>`);
  await p.screenshot({ path: `ws-review/compare-${state}-${w}x${h}.png` });
  await p.close();
}
await b.close();
