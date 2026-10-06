// Scratch audit of the POS preview: focus order/visibility, accessible names, clipping, scrolling.
import { createRequire } from "node:module";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const results = {};
for (const [name, query, w, h] of [
  ["empty 1366x768", "?node=online&inspect=0", 1366, 768],
  ["populated 1280x720", "?node=online&cart=populated&inspect=0", 1280, 720],
  ["populated 1920x1080", "?node=online&cart=populated&inspect=0", 1920, 1080],
  ["grid 1366x768", "?node=online&cart=populated&view=grid&inspect=0", 1366, 768],
]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.goto("http://127.0.0.1:1420/" + query, { waitUntil: "load" });
  await page.waitForSelector(".pos-app");
  await page.evaluate(() => document.fonts.ready);

  const audit = await page.evaluate(() => {
    const out = {};
    const interactive = [...document.querySelectorAll("button, a[href], input, select, textarea")];
    const nameOf = (el) =>
      (el.getAttribute("aria-label") ||
        (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) ||
        el.getAttribute("title") ||
        el.textContent ||
        "").trim();
    out.interactiveCount = interactive.length;
    out.unnamed = interactive.filter((el) => nameOf(el) === "").map((el) => el.outerHTML.slice(0, 80));
    out.landmarks = {
      main: document.querySelectorAll("main").length,
      nav: document.querySelectorAll("nav").length,
      header: document.querySelectorAll("header").length,
      h1: [...document.querySelectorAll("h1")].map((e) => e.textContent),
      statusRegions: document.querySelectorAll('[role="status"]').length,
    };
    out.htmlLang = document.documentElement.lang;
    const app = document.querySelector(".pos-app");
    out.pageHScroll = document.documentElement.scrollWidth > window.innerWidth;
    out.appOverflowX = app.scrollWidth > app.clientWidth;
    // text clipped by its own box (excluding intentional ellipsis)
    out.clippedText = [...document.querySelectorAll(".pos-app *")]
      .filter((el) => {
        const s = getComputedStyle(el);
        return (
          el.children.length === 0 &&
          el.textContent.trim() !== "" &&
          s.overflow === "visible" &&
          el.scrollWidth > el.clientWidth + 1 &&
          s.display !== "inline"
        );
      })
      .slice(0, 5)
      .map((el) => el.className + ":" + el.textContent.trim().slice(0, 30));
    out.scrollRegions = [...document.querySelectorAll(".tiles, .ptable, .cart__lines")]
      .map((el) => ({
        cls: el.className,
        scrolls: el.scrollHeight > el.clientHeight,
        focusableInside: el.querySelectorAll("button, a[href], input").length,
      }));
    return out;
  });

  // keyboard: Tab through the first 40 stops, record names and whether a focus ring shows
  const stops = [];
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        name: (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || "").trim().slice(0, 28),
        outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 1.5,
        // the search input draws its focus ring on its container instead
        containerRing: el.matches(".searchbar__input") && getComputedStyle(el.closest(".searchbar")).borderColor !== "",
        onScreen: r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight,
      };
    });
    stops.push(info);
  }
  const real = stops.filter(Boolean);
  audit.keyboard = {
    stops: real.length,
    withoutVisibleFocus: real.filter((s) => !s.outline && !s.containerRing).map((s) => s.name),
    offScreenAfterFocus: real.filter((s) => !s.onScreen).map((s) => s.name),
    first: real.slice(0, 6).map((s) => s.name),
  };
  // F2 focuses search; Escape clears
  await page.goto("http://127.0.0.1:1420/" + query);
  await page.waitForSelector(".pos-app");
  await page.keyboard.press("F2");
  audit.f2FocusesSearch = await page.evaluate(() => document.activeElement?.id === "item-search");
  results[name] = audit;
  await page.context().close();
}
console.log(JSON.stringify(results, null, 1));
await browser.close();
