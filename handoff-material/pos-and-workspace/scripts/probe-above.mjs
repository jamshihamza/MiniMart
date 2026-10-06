import { createRequire } from "node:module";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");
const b = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage({ viewport: { width: 1366, height: 768 } });
await p.goto("http://127.0.0.1:1421/?screen=02&node=online#/pos"); await p.waitForSelector(".pos-app");
console.log(await p.evaluate(() => { const top = document.querySelector(".pos-app").getBoundingClientRect().top; return [...document.querySelectorAll(".pos-app *")].filter((e) => getComputedStyle(e).position !== "fixed" && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().top < top - 0.5).map((e) => e.tagName + "." + e.className + " top=" + e.getBoundingClientRect().top); }));
await b.close();
