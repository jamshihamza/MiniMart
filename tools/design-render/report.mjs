import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { designRoot, repositoryRoot } from "./validate.mjs";

export const reportPath = resolve(designRoot, "RENDER-FIDELITY-REPORT.md");

// Packages without a rendered `diagnostics.json` yet are reported as
// UNVERIFIED rather than omitted, so the report always names every package
// slot instead of only the ones most recently rendered.
function listPackageSlugs() {
  return readdirSync(designRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function loadDiagnostics(slug) {
  const diagnosticsPath = resolve(designRoot, slug, "renders", "diagnostics.json");
  if (!existsSync(diagnosticsPath)) return null;
  return JSON.parse(readFileSync(diagnosticsPath, "utf8"));
}

function screenStatusLine(screen) {
  const notes = [];
  if (screen.realRuntime) {
    notes.push(
      "rendered by the real Claude Design runtime (support.js), not the compatible adapter",
    );
  }
  if (screen.imageSlotsEmulated > 0) {
    notes.push(
      `${screen.imageSlotsEmulated} \`image-slot\` element(s) emulated (no real dependency exists)`,
    );
  }
  if (screen.knownMissingAssets?.length > 0) {
    notes.push(`known-missing local asset(s): ${screen.knownMissingAssets.join(", ")}`);
  }
  const noteText = notes.length > 0 ? ` — ${notes.join("; ")}` : "";
  return `| ${screen.screenNumber} | ${screen.screenName} | ${screen.status} | ${noteText.replace(/^ — /, "")} |`;
}

export function buildReportMarkdown() {
  const slugs = listPackageSlugs();
  const generatedAt = new Date().toISOString();
  const lines = [
    "# Design render fidelity report",
    "",
    `Generated ${generatedAt}. This report reflects the most recent local run of \`pnpm design:render\` for` +
      " each package below; it is not evidence of a check that has not actually been run.",
    "",
    "Statuses:",
    "",
    "- `UNVERIFIED` — package has not been rendered with the fidelity-checking renderer in this workspace yet.",
    "- `RUNTIME-COMPLETE` — every Claude Design primitive on the screen was reproduced with its real runtime" +
      " behaviour (real fonts/icons fetched from their real CDN, real `sc-if`/`sc-for`/`x-dc` evaluation); no" +
      " emulation was needed.",
    "- `KNOWN-DIFFERENCE` — the screen rendered successfully but required an emulated primitive because a real" +
      " local dependency does not exist in this repository. The specific difference is named per screen.",
    "- `BLOCKED` — the screen could not be rendered at all (unsupported primitive, page error, unresolved" +
      " asset); rendering must have failed loudly rather than silently succeeding.",
    "",
    'This report never uses the word "MATCH" — a generated PNG existing is not evidence of visual fidelity' +
      " to the Claude Design source; only the primitive-by-primitive accounting below is.",
    "",
    "## Known runtime dependency gaps",
    "",
    '- `support.js` is referenced by every `.dc.html` source (`<script src="./support.js">`) but does not' +
      " exist anywhere in this repository, including the original `Mockups/` exports. It is Claude Design's" +
      " own editor-harness script. Neither `MiniMartBackOffice.dc.html` nor `MiniMartPOS.dc.html`'s inline" +
      " `data-dc-script` component calls anything from it (verified: no `window.*`/global helper calls outside" +
      " `DCLogic`/`React`, which this renderer supplies directly). Its 404 is expected and has no effect on the" +
      " rendered output.",
    "- `image-slot.js` defines the `<image-slot>` custom element used for product-packshot placeholders" +
      " (Back Office product form, Design System component inventory). It does not exist anywhere in this" +
      " repository or the `Mockups/` exports either — there is no real dependency to load. `dc-runtime.mjs`" +
      " emulates it with a static placeholder (icon + label, shape-aware). This is a real visual difference" +
      " from the authentic Claude Design output and is reported as `KNOWN-DIFFERENCE`, not hidden.",
    "- The real IBM Plex webfonts and the real Lucide icon font are fetched from their genuine CDNs" +
      " (`fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com`) and cached locally in" +
      " `tools/design-render/vendor-cache/` on first render. Earlier renders blocked all cross-origin requests," +
      " which silently produced blank icons and a fallback typeface across every screen despite a passing" +
      " render count — this was the primary root cause of the reported missing visual elements. Any other" +
      " cross-origin host stays blocked and fails the render loudly.",
    "- `procurement` ships a genuine `support.js` alongside its source — the real Claude Design `dc-runtime`" +
      " (fetches real React/ReactDOM UMD builds from `unpkg.com`, mounts the actual component via" +
      " `ReactDOM.createRoot`), not a reimplementation. `render.mjs` detects this and drives every screen" +
      " through the real runtime's `window.__dcSetProps` API instead of the compatible `dc-runtime.mjs`" +
      " adapter used by `pos`/`back-office` (which have no local `support.js`). This is a strictly higher-" +
      " fidelity path: every `procurement` primitive is the authentic renderer's own output.",
    "",
    "## Procurement visual review notes",
    "",
    "- Screens 07 and 08 (`Create Supplier`) place the tab bar mid-page with a right-side live-value summary" +
      " panel, leaving a large empty region on the left. This pattern is identical and reproducible across" +
      " both screens and is rendered by the authentic runtime (no adapter emulation involved), so it is the" +
      " design's own layout choice, not a rendering defect. Flagged for design review, not classified as a" +
      " pipeline issue.",
    "- No forbidden inventions (Purchase Requisition, RFQ, vendor scorecards, AI/auto-PO, editable WAC," +
      " editable posted GRN/Return, silent over-receipt, silent duplicate-invoice acceptance, etc.) were found" +
      " across the representative screens inspected. Every policy-sensitive point in the source (over-receipt," +
      " expired-goods handling, return-approval threshold, credit-limit semantics) is explicitly labelled as" +
      " policy-dependent/not decided by the design, matching the requirement that no unresolved policy be" +
      " silently selected.",
    "",
    "## Customers + Credit review notes",
    "",
    "Status: `approved-visual-reference` (2026-10-01). Source is the corrected v2 export, SHA-256" +
      " `593adaec60d84d384fdc2947a1ba7d169f8ec8eb21d34373fb814ee662259d7c` (replaces v1 `b7fb8c01…5819ff`)." +
      " The v2-fixed archive was verified 10/10 against its manifest; `support.js` is unchanged and identical to" +
      " Procurement's real runtime.",
    "",
    "- v2 change: exactly two source lines (274 and 279 of 331). Screen 60 (Customer Statement) drops" +
      " `maxWidth:640` from its wrapper and screen 61 (Customer Aging) drops `maxWidth:560`. No text, logic," +
      " screen ID, title, group or shared component changed, and all 74 screens render the same text as v1.",
    "- Original defect fixed: Date / Reference / Description / Debit / Credit / Running on screen 60 and every" +
      " aging bucket on screen 61 are visible at 1280x720, 1366x768, 1368x800 and 1920x1080, with no body-level" +
      " horizontal scroll and no clipped text. At 1280x720 the table keeps a 4px overflow contained inside its own" +
      " scroll box, the same as every other table screen in the package. The aging view has no totals row in the" +
      " source.",
    "- Render: 74/74 RUNTIME-COMPLETE on the real runtime, 0 BLOCKED, 0 KNOWN-DIFFERENCE, 0 page errors. Rendered" +
      " with Chromium 1194 in the cloud workspace because the pinned 1243 headless shell cannot be downloaded on" +
      " the local machine.",
    "- Four-viewport PASS: all 74 at 1280x720; screens 01, 13, 16, 21, 27, 28, 31, 46, 49, 51, 52, 60, 61 and 74" +
      " at the other three sizes. Minor, unchanged from v1: at 1280x720 the top bar wraps its labels onto two" +
      " lines without overlap.",
    "- Open decisions preserved: DEC-CRD-001 stays OPEN (screen 31 shows BLOCK / WARN / REQUIRE OVERRIDE, each" +
      " AUTHORITY-DEPENDENT, none selected). DEC-CRD-002 stays OPEN (screen 46 states FIFO, oldest-first," +
      " proportional or manual is not decided; its sample amounts are illustrative, not a rule). Held-sale" +
      " exposure (39) and over-collection handling (48) also stay open.",
    "- Semantics seen in render: exposure is a result of immutable ledger events with no editable balance (27, 37);" +
      " an unconfigured limit is not RM 0.00 (29); draft collection has no exposure effect (56); posted" +
      " collection is read-only (51); safe retry reuses one operation reference (52); Store Node outage and Cloud" +
      " Sync outage are separate states (05, 06, 59); the statement is operational, not a general ledger (60)." +
      " Forbidden terms appear only inside disclaimers. No screen has an editable input.",
    "- Documentation: the 43 numbered confirmations live in the grouped page `MiniMart CUS - Design System &" +
      " Docs.dc.html` from the same export, not in the registered source (screen 74 is the component inventory).",
    "",
    "## Cash / Shift / Business Day review notes",
    "",
    "Status: `approved-visual-reference`. v2 export verified by content: source `MiniMartCashBusinessDay.dc.html`," +
      " SHA-256 `a0d9df668213a9a562bd0fefec9198274c57931b7c6f79da59b87554aee55fee`, from" +
      " `MiniMart_Cash_Business_Day_ClaudeDesign_Source_v2.zip` (all 10 hashes in `CASH-BUSINESS-DAY-EXPORT-MANIFEST-v2.txt`" +
      " match the packaged bytes). `support.js` is byte-identical to the Procurement and Customers real runtime." +
      " The superseded 74-screen v1 source (SHA-256 `81218a8e...`) is no longer registered.",
    "",
    "- Structure: 77 screens, IDs 01-77 contiguous, 77 unique titles, 77 unique state mappings. The inline script" +
      " parses cleanly and all 77 states instantiate with no errors. The six grouped pages cover all 77 screens" +
      " exactly once (Cash Movements carries 13-28 and 75-77).",
    "- Render: 77/77 RUNTIME-COMPLETE on the real runtime, 0 BLOCKED, 0 KNOWN-DIFFERENCE.",
    "- v1 to v2 change set: Shift List screens 04-06 (compact 8-column layout; Business Date stacked under Shift" +
      " Ref, Opened/Closed stacked, Opening Cash moved to Shift Detail / Close Review, Expected / Counted /" +
      " Variance visible); new safe-retry screens 75 (Open Shift), 76 (Cash In), 77 (Cash Out); and the enum," +
      " name, state, screen-index and confirmation wiring for them. No other business semantics changed.",
    "- Safe retry: screens 75-77 say the outcome is unknown, the operation may already have committed, do not" +
      " submit again, authoritative local status is checked first, and retry cannot create a duplicate shift or" +
      " CashMovement. Check Status and Retry Safely are visible at every viewport. No rollback, force-post," +
      " delete or manual-cleanup action exists. Close Shift (38) and Close Business Day (57) keep their pattern.",
    "- Open decisions preserved: business-date rollover (51) shows midnight, first sale, manual, configured" +
      " cut-off and automatic-after-last-shift as unselected examples; exceptional day close (55) shows Manager" +
      " Override, Force Close and Carry Forward as UNRESOLVED slots. Blind count (31), variance tolerance and" +
      " approval threshold (32-36, 65) and open shifts during day close (54) stay authority-dependent.",
    "- Semantics seen in render: Expected Cash is derived with no editable input; non-cash tenders are labelled as" +
      " not in the drawer (01); posted CashMovements and closed Shifts / Business Days are read-only; reopen is" +
      " explicitly not invented (44, 60); Store Node outage (67) and Cloud Sync outage (68) are separate states;" +
      " Sales, Returns, Collections and supplier/expense cash are read-only traces (61-64). Forbidden terms appear" +
      " only inside disclaimers.",
    "- Viewports: screens 04-06 and 75-77 were rendered and checked at 1280x720, 1366x768, 1368x800 and" +
      " 1920x1080; all 77 screens were rendered at 1280x720, and a clipping scan of every screen at 1366x768 and" +
      " 1280x720 found no hidden table content. No page-level horizontal scroll at any size. The Shift List shows" +
      " Expected, Counted and Variance in full at every size; at 1280x720 its container overflows by 4px of empty" +
      " trailing space with no value clipped; at the other three sizes it does not scroll.",
    "- Cosmetic: at 1280x720 the top bar wraps its labels onto two lines because of the longer role label; nothing" +
      " overlaps.",
    "- Delivery note: the archive file `MiniMart Back Office Mockups.dc.html` is not a links-only index. It is a" +
      " later edited copy of the full interactive Back Office source (about 96 KB, 42 changed lines against the" +
      " approved source) and was not applied; the approved Back Office source is unchanged.",
    "",
    "## Accounting-Lite review notes",
    "",
    "Status: `approved-visual-reference`. Source `MiniMartAccountingLite.dc.html`, SHA-256" +
      " `ebe8ca7f38b9b9d5cd9c16fed421bfe5f5863653ec9478a081d368d2bb9df12e`, from" +
      " `Minimart_Accounting_Lite_ClaudeDesign_Source_v2-fixed.zip` (all 10 hashes in" +
      " `ACCOUNTING-LITE-EXPORT-MANIFEST-v2-fixed.txt` match the packaged bytes). `support.js` (SHA-256" +
      " `8fe7df74...cbe`) is byte-identical to the other real-runtime packages. Two earlier exports were rejected and" +
      " are no longer registered: the first export (SHA-256 `c5ae24c4...6ae0`) and v2 (SHA-256 `63fb4491...01a1`).",
    "",
    "- Structure: 88 screens, IDs 01-88 contiguous, 88 unique titles and state mappings; the inline script parses and all" +
      " 88 states instantiate with no errors. The seven grouped pages import the source and cover 01-12, 13-28, 29-50," +
      " 51-62, 63-72, 73-80 and 81-88, each screen exactly once. The package index is an Accounting-Lite links page.",
    "- Render: 88/88 RUNTIME-COMPLETE on the real runtime, 0 BLOCKED, 0 KNOWN-DIFFERENCE, 0 page errors.",
    "- Review history: the first export was rejected for a ten-times-wrong dashboard bank total, an allocation summary" +
      " that contradicted its rows, and an Opening Balance and Accountant Export workflow that presented unfrozen" +
      " behaviour as established. v2 fixed those and was rejected only because the Supplier Payment allocation grid" +
      " (20) still listed a fully paid payable as a candidate row. v2-fixed changes only that grid's eligibility" +
      " filter (supplier match and outstanding above zero) and adds the note that only eligible outstanding" +
      " payables are available for allocation. The grouped pages and `support.js` are byte-identical to v2.",
    "- Numeric corrections: the Bank Accounts card (01) shows RM 236,500.00 (184,200.00 + 52,300.00, matching" +
      " screens 05 and 33). The supplier payment (20, 23, 86) is RM 950.00 allocated in full to" +
      " SUP-PAY-2026-00142 (outstanding RM 950.00, remaining RM 0.00): Payment 950.00 = Allocated 950.00 +" +
      " Unallocated 0.00. SUP-PAY-2026-00104 (Paid, outstanding RM 0.00) appears only in the payable list" +
      " screens (13, 14) as a historical record, never in the allocation grid. No allocation order is introduced:" +
      " the note that order is not assumed is unchanged.",
    "- Payable creation basis: screen 13 and confirmation 22 state that the basis follows the configured" +
      " purchasing and payables workflow (posted purchase or receipt, or approved supplier invoice) and that the" +
      " Goods Receipt examples are illustrative, not a universal trigger.",
    "- Opening Balance authority correction: frozen authority (FR-ACC-044, FR-ACC-045) requires controlled" +
      " opening balances with an effective date and audit evidence and forbids direct balance overwrite, but does" +
      " not define an OpeningBalance aggregate, document, API, posting lifecycle or status contract. Screens 66, 70," +
      " 71 and 72 therefore show the required scope, an illustrative inputs example and a no-arbitrary-edit" +
      " boundary, and state the mechanism is pending an approved contract. Screen 66 has no Check Status or Retry" +
      " Safely action, and no Entry-Validate-Review-Post flow, post control or set-balance control exists.",
    '- Export ownership correction: screens 75-77 are Accounting-Lite dataset context and a handoff ("Continue in' +
      ' Export Center"). File generation, retention, delivery and any accounting-software integration are stated to' +
      " belong to Export Center and Reporting. No export job, artifact, queue, format policy or approval workflow" +
      " is shown. Screen 78 traces Accounting-Lite's own source rows.",
    "- Safe retry is a real operational state (outcome unknown, may already have committed, check status first, Check" +
      " Status and Retry Safely, no duplicate effect) on screens 26 (Supplier Payment), 44 (Financial Receipt and" +
      " Payment, one shared state), 48 (Account Transfer) and 55 (Expense; checks authoritative local status and" +
      " cannot duplicate the Expense, its Financial Movement or the CashierShift cash effect). They elaborate the" +
      " frozen idempotency and recovery contract and offer no Force Post, delete, roll back or balance editing." +
      " Reconciliation completion (69) records no financial movement.",
    "- Boundaries seen in render: Customer outstanding is a read-only view of Customer & Credit (29, 03); no balance" +
      " edit control exists (37, 67, 72); a drawer-funded expense links to the CashierShift effect and adds no" +
      " second Cash Out workflow (60); allocation order, unallocated payment, expense approval threshold, tax" +
      " treatment and reconciliation matching are labelled policy-controlled or not assumed (65 names no matching" +
      " rule); full-GL terms appear only in disclaimers (01, 08, 87, 88). Store Node and Cloud Sync outages are" +
      " separate states (79, 80). The receipt (FT-2026-00061, screens 40, 42, 43) and payment (FT-2026-00062," +
      " screen 41) are distinct transactions. Screen 88 numbers confirmations 1-52, all present once.",
    "- Viewports: all 88 screens were rendered through the real runtime at 1280x720, 1366x768, 1368x800 and" +
      " 1920x1080 (every one RUNTIME-COMPLETE) and scanned in-page for page-level scroll and for any text or button" +
      " that is clipped by its container. This is a live render result, not a width calculation. No page-level" +
      " scroll and no console error at any size. Outside the sidebar, only screen 88's documentation body is" +
      " flagged: it is an internal scroll container, so confirmations beyond the first screenful are reachable by" +
      " scrolling (the static render shows the first ones). Screen 20 was inspected at all four sizes (REMAINING header" +
      " readable, one eligible row, summary arithmetic and both notes visible), and the Posted pill on screens 38" +
      " and 52 is fully visible at 1280x720. The sidebar is also an internal scroll container (its lowest" +
      " Administration entries sit below the fold at the smaller heights).",
    "- Non-blocking observations: the Allocated and Unallocated figures on 20 and 23 are fixed values that agree with" +
      " the single eligible row; screen 71 lists no audit-evidence field although titled Effective Date & Evidence;" +
      " screen 77 shows an illustrative dataset-context reference and hand-off time that no frozen contract defines;" +
      " screens 64 and 67 show Recorded Movements RM 18,420.00, a period figure that is not the RM 184,200.00 account" +
      " balance.",
    "- Authority note: only UI-ACC-001 to 009 are frozen Accounting screens. The other screens in this package are" +
      " visual elaboration. Opening-balance mechanics, export contracts, payable creation basis, allocation order," +
      " matching policy, approval thresholds and expense tax remain open or policy-controlled and are not defined by" +
      " this design.",
    "",
    "## Reporting review notes",
    "",
    "Status: `review-ready`, **not** `approved-visual-reference`. Source `MiniMartReports.dc.html` (80 screens) was" +
      " authored in this repository by Claude Code, not exported from Claude Design, so it carries no export manifest or" +
      " archive hash. `support.js` (SHA-256 `8fe7df74...cbe`) is the real runtime, byte-identical to the other real-runtime" +
      " packages. Package files: `source/MiniMartReports.dc.html`, `source/support.js`, `design-manifest.json`," +
      " `traceability.json` and `TRACEABILITY.md`.",
    "",
    "- Authority used: FR-RPT-001..065 (`14-reporting/reporting.md`), UI-RPT-001..005 and UI-EXP-001, API-RPT-001..003 and" +
      " `06-READ-QUERY-REPORTING.md`, DEC-RPT-001 (OPEN) and DEC-RPT-002 (PROPOSED), backlog MM-079..083 and MM-097, the" +
      " read-query architecture and the UI state, money, responsive and accessibility contracts.",
    "- Coverage: 80 screens in 12 groups. All 65 FR-RPT requirements map to at least one screen (FR-RPT-063 and 065 point to" +
      " the decisions screen because they need data volumes and tests, not visuals). The five frozen UI-RPT screens map to" +
      " Reports Home (10), Sales (11), Inventory (8), Purchasing (4) and Credit / Collections (5), plus a shared viewer anatomy," +
      " rule and state set (18), cash and day-close reports (4), management summary (3), export and print (9), a later-phase central" +
      " report (1) and design system and documentation (7).",
    "- Required states are present for reports: loading, ready, empty, validation error, permission denied, definition" +
      " conflict, run failed with no partial totals, local scope when cloud sync is unavailable, Store Node unavailable and" +
      " incompatible client. Export covers the dialog, permission denied, QUEUED / RUNNING, COMPLETED hand-off, FAILED /" +
      " CANCELLED, outcome unknown (check status, retry safely with the same command identity), personal-data minimisation," +
      " print preview and the audit notice.",
    "- Illustrative versus live: every screen carries an ILLUSTRATIVE DATA ribbon, generated times say illustrative, and" +
      " design annotations are dashed and labelled not product UI. Money is a decimal string end to end, sums use exact" +
      " integer arithmetic (BigInt), and display is RM with two decimals in a MYR / MY context. No tax label is shown.",
    "- Computed, not typed: cash variance (actual minus expected, the frozen domain formula), customer statement closing" +
      " balance (the frozen AC-B4-020 formula), running stock balance, inventory value, aging row totals and every totals" +
      " row. Cross-report examples reconcile: cashier and counter totals equal the 26 Sep Daily Sales Summary row, the" +
      " category total equals the item total, purchases use the Accounting-Lite GRN references and customer outstanding" +
      " equals RM 2,145.00.",
    "- Nothing invented: gross, net, discount, return and tax definitions, aging buckets, low-stock thresholds, expiry windows," +
      " grouping basis, export contracts, retention, permissions beyond reporting.read and reporting.write, report codes and" +
      " filter field codes are all marked OPEN, VERIFY, PROPOSED or GAP and listed on the open-decisions screen. Cash and" +
      " day-close reports, the management summary and central reports have no frozen owner screen and are flagged as gaps." +
      " Export artifacts, retention and downloads are handed to Export Center and not owned by Reporting.",
    "- Render: 80/80 RUNTIME-COMPLETE on the real runtime at the primary viewport, 0 BLOCKED, 0 KNOWN-DIFFERENCE.",
    "- Actual viewport check: every screen was rendered through the real runtime at 1280x720, 1366x768, 1368x800 and" +
      " 1920x1080 (all RUNTIME-COMPLETE), and scanned in-page for page-level scroll and for any text or button clipped" +
      " horizontally by its container. Result: no page-level scroll, no console error, no clipped text or buttons and no" +
      " inner horizontal scroll container at any size. The scan deliberately skips the sidebar and visually hidden table" +
      " captions. Key screens were inspected by eye at 1280x720 and 1366x768.",
    "- Accessibility actually measured: contrast was computed for every text and background pair used (all at least 4.5:1)." +
      " An in-page audit of all 80 screens found no unlabelled form control, no unnamed button, no table without a caption and" +
      " column headers, no duplicate id and exactly one h1 per screen (534 focusable controls outside the sidebar).",
    "- Fidelity gaps: (1) Two tones differ from the approved packages: muted text #6b7585 became #5b6576 and sidebar group" +
      " labels #6f7c93 became #8c98ad, because the approved values measure 4.07 to 4.41:1 on tinted surfaces; the Cloud-sync pill" +
      " omits the invented queued count. (2) Keyboard behaviour (tab order, dialog focus trap and restore, Esc) is specified" +
      " and the structure is audited, but it was not exercised by a scripted keyboard run. (3) The export dialog is drawn" +
      " inline, not as an overlay. (4) Static renders show only the first screenful of long pages; the rest is reachable by" +
      " scrolling the page container. (5) The sidebar scrolls internally, so its lowest entries sit below the fold at 1280x720," +
      " as in the other packages. (6) The shell navigation is structural: only Reports is live. (7) No grouped canvas pages," +
      " PDF export or phase labels were produced. (8) Illustrative data was checked for cross-report consistency on the" +
      " cross-links listed above, not exhaustively.",
    "- Authority conflicts: none stopped the work. Two items need an owner decision before implementation: the page-limit" +
      " mismatch between ReportRunRequest (1 to 500) and PageInfo (at most 200), and which frozen screen owns the cash," +
      " day-close and management reports.",
    "",
    "## Procurement viewport verification",
    "",
    "`primaryViewport` (1366x768) is verified as part of the normal `pnpm design:render --package procurement`" +
      " run (see the table below). The package's declared `supportedViewports` were additionally verified with" +
      " a one-off, non-authoritative render pass (`renderPackage()` called directly with `viewportOverride`/" +
      "`outputRoot`, screenshots kept outside the tracked tree) using the same strict renderer -- every check" +
      " (unsupported primitive, pageerror, unresolved asset) still applied:",
    "",
    "- **1280x720** (smallest supported): all 74 screens rendered without error. Representative dense screens" +
      " inspected (Supplier List/Detail/Create, PO List/Detail, GRN entry/review, Batch Allocation, Purchase" +
      " Return line entry, negative-stock-blocked state, component inventory) showed no clipping of primary" +
      " actions, dialogs, or tables. One finding: the PO List's rightmost `APPROVAL` column falls outside the" +
      " immediately visible area of its own scroll region at this width; inspection of computed styles" +
      " confirmed the containing element has a genuine `overflow-x: auto` scroll container (`scrollWidth`" +
      ' 1134px vs `clientWidth` ~1028px) -- the same "horizontal scroll only where needed" pattern the' +
      " design system page documents for dense tables -- so the column is reachable by scrolling, not lost." +
      " No hidden submit/post buttons were found at this viewport.",
    "- **1368x800**: representative dense screens re-inspected; PO List's `APPROVAL` column is fully visible" +
      " without scrolling at this width. No clipping or overlap found.",
    "- **1920x1080**: representative dense screens re-inspected; layout stays left-aligned in its fixed-width" +
      " column with no stretching artifacts, sidebar/top bar/content do not overlap. No clipping found.",
    "- Screens 07/08 (`Create Supplier`) were re-checked at all four viewports: the mid-page tab bar and" +
      " sparse-left layout is identical and usable at every size (tabs and the right-side summary panel stay" +
      " fully visible and non-overlapping); retained as-is per instruction not to redesign a source layout" +
      " choice.",
    "",
  ];

  for (const slug of slugs) {
    const diagnostics = loadDiagnostics(slug);
    lines.push(`## ${slug}`, "");
    if (!diagnostics) {
      lines.push("Status: **UNVERIFIED** — not rendered in this workspace.", "");
      continue;
    }
    const anyKnownDifference = diagnostics.screenDiagnostics.some(
      (s) => s.status === "KNOWN-DIFFERENCE",
    );
    lines.push(
      `Package: ${diagnostics.package}. Rendered ${diagnostics.screenDiagnostics.length} screen(s) at` +
        ` ${diagnostics.generatedAt}. ${anyKnownDifference ? "Contains KNOWN-DIFFERENCE screens (see table)." : "All screens RUNTIME-COMPLETE."}`,
      "",
      "| Screen | Name | Status | Notes |",
      "| --- | --- | --- | --- |",
      ...diagnostics.screenDiagnostics.map(screenStatusLine),
      "",
    );
  }

  return lines.join("\n").replace(/\n+$/, "") + "\n";
}

async function main() {
  const markdown = buildReportMarkdown();
  writeFileSync(reportPath, markdown);
  console.log(
    `Wrote ${reportPath.replace(repositoryRoot + "\\", "").replace(repositoryRoot + "/", "")}`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
