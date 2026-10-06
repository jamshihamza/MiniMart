// Audit every POS screen: names, headings, landmarks, overflow, keyboard focus, dialog containment.
import { createRequire } from "node:module";
const require = createRequire("D:/mm-vis/package.json");
const { chromium } = require("playwright");

const SCREENS = "01 02 02b 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30".split(" ");
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const problems = [];
let totalStops = 0;
for (const [w, h] of [[1366, 768], [1280, 720], [1920, 1080]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  for (const id of SCREENS) {
    await page.goto(`http://127.0.0.1:1420/?screen=${id}&inspect=0&node=online`, { waitUntil: "load" });
    await page.waitForSelector(".pos-app");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    const base = await page.evaluate(() => {
      const nameOf = (el) =>
        (el.getAttribute("aria-label") ||
          (el.getAttribute("aria-labelledby") && document.getElementById(el.getAttribute("aria-labelledby"))?.textContent) ||
          (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) ||
          el.getAttribute("title") ||
          el.textContent ||
          "").trim();
      const interactive = [...document.querySelectorAll("button, a[href], input, select, textarea")];
      const dialog = document.querySelector('[role="dialog"], [role="alertdialog"]');
      return {
        unnamed: interactive.filter((e) => nameOf(e) === "").map((e) => e.outerHTML.slice(0, 70)),
        h1: document.querySelectorAll("h1").length,
        main: document.querySelectorAll("main").length,
        status: document.querySelectorAll('[role="status"]').length,
        hscroll: document.documentElement.scrollWidth > innerWidth,
        dialogLabelled: dialog ? Boolean(dialog.getAttribute("aria-labelledby") || dialog.getAttribute("aria-label")) : null,
        dialogModal: dialog ? dialog.getAttribute("aria-modal") : null,
        focusInDialog: dialog ? dialog.contains(document.activeElement) : null,
        clipped: [...document.querySelectorAll(".pos-app *")]
          .filter((e) => {
            const s = getComputedStyle(e);
            return e.children.length === 0 && e.textContent.trim() && s.overflow === "visible" && s.display !== "inline" && e.scrollWidth > e.clientWidth + 1;
          })
          .slice(0, 3)
          .map((e) => e.className + ":" + e.textContent.trim().slice(0, 24)),
      };
    });
    const tag = `${id}@${w}x${h}`;
    if (base.unnamed.length) problems.push(`${tag} unnamed: ${base.unnamed.join(" | ")}`);
    if (base.h1 !== 1 && id !== "26") problems.push(`${tag} h1 count ${base.h1}`);
    if (base.main !== 1) problems.push(`${tag} main count ${base.main}`);
    if (base.status !== 1) problems.push(`${tag} status regions ${base.status}`);
    if (base.hscroll) problems.push(`${tag} horizontal page scroll`);
    if (base.dialogLabelled === false) problems.push(`${tag} dialog unlabelled`);
    if (base.dialogLabelled === true && base.dialogModal !== "true") problems.push(`${tag} dialog not aria-modal`);
    if (base.dialogLabelled === true && base.focusInDialog !== true) problems.push(`${tag} focus not moved into dialog`);
    if (base.clipped.length) problems.push(`${tag} clipped: ${base.clipped.join(" | ")}`);

    // keyboard: Tab through up to 30 stops
    const stops = [];
    for (let i = 0; i < 30; i += 1) {
      await page.keyboard.press("Tab");
      stops.push(
        await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          const dlg = document.querySelector('[role="dialog"], [role="alertdialog"]');
          const ring =
            (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 1.5) ||
            el.matches(".searchbar__input, .dlg-search__input, .findrow__input, .hsearch__input, .field__input");
          return {
            name: (el.getAttribute("aria-label") || el.textContent || el.placeholder || "").trim().slice(0, 24),
            ring,
            on: r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight,
            inDialog: dlg ? dlg.contains(el) : null,
            inert: Boolean(el.closest("[inert]")),
          };
        }),
      );
    }
    const real = stops.filter(Boolean);
    totalStops += real.length;
    const noRing = real.filter((s) => !s.ring).map((s) => s.name);
    const off = real.filter((s) => !s.on).map((s) => s.name);
    const escaped = real.filter((s) => s.inDialog === false).map((s) => s.name);
    const inert = real.filter((s) => s.inert).map((s) => s.name);
    if (noRing.length) problems.push(`${tag} stops without visible focus ring: ${[...new Set(noRing)].slice(0, 4).join(", ")}`);
    if (off.length) problems.push(`${tag} stops off screen: ${[...new Set(off)].slice(0, 4).join(", ")}`);
    if (escaped.length) problems.push(`${tag} Tab escaped the dialog: ${[...new Set(escaped)].slice(0, 4).join(", ")}`);
    if (inert.length) problems.push(`${tag} focused an inert element: ${[...new Set(inert)].slice(0, 4).join(", ")}`);
  }
  await ctx.close();
}
console.log(`screens x viewports audited: ${SCREENS.length * 3}, keyboard stops checked: ${totalStops}`);
console.log(problems.length === 0 ? "NO PROBLEMS" : problems.join("\n"));
await browser.close();
