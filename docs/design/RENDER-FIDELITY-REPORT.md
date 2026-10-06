# Design render fidelity report

Generated 2026-10-04T08:39:22.175Z. This report reflects the most recent local run of `pnpm design:render` for each package below; it is not evidence of a check that has not actually been run.

Statuses:

- `UNVERIFIED` — package has not been rendered with the fidelity-checking renderer in this workspace yet.
- `RUNTIME-COMPLETE` — every Claude Design primitive on the screen was reproduced with its real runtime behaviour (real fonts/icons fetched from their real CDN, real `sc-if`/`sc-for`/`x-dc` evaluation); no emulation was needed.
- `KNOWN-DIFFERENCE` — the screen rendered successfully but required an emulated primitive because a real local dependency does not exist in this repository. The specific difference is named per screen.
- `BLOCKED` — the screen could not be rendered at all (unsupported primitive, page error, unresolved asset); rendering must have failed loudly rather than silently succeeding.

This report never uses the word "MATCH" — a generated PNG existing is not evidence of visual fidelity to the Claude Design source; only the primitive-by-primitive accounting below is.

## Known runtime dependency gaps

- `support.js` is referenced by every `.dc.html` source (`<script src="./support.js">`) but does not exist anywhere in this repository, including the original `Mockups/` exports. It is Claude Design's own editor-harness script. Neither `MiniMartBackOffice.dc.html` nor `MiniMartPOS.dc.html`'s inline `data-dc-script` component calls anything from it (verified: no `window.*`/global helper calls outside `DCLogic`/`React`, which this renderer supplies directly). Its 404 is expected and has no effect on the rendered output.
- `image-slot.js` defines the `<image-slot>` custom element used for product-packshot placeholders (Back Office product form, Design System component inventory). It does not exist anywhere in this repository or the `Mockups/` exports either — there is no real dependency to load. `dc-runtime.mjs` emulates it with a static placeholder (icon + label, shape-aware). This is a real visual difference from the authentic Claude Design output and is reported as `KNOWN-DIFFERENCE`, not hidden.
- The real IBM Plex webfonts and the real Lucide icon font are fetched from their genuine CDNs (`fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com`) and cached locally in `tools/design-render/vendor-cache/` on first render. Earlier renders blocked all cross-origin requests, which silently produced blank icons and a fallback typeface across every screen despite a passing render count — this was the primary root cause of the reported missing visual elements. Any other cross-origin host stays blocked and fails the render loudly.
- `procurement` ships a genuine `support.js` alongside its source — the real Claude Design `dc-runtime` (fetches real React/ReactDOM UMD builds from `unpkg.com`, mounts the actual component via `ReactDOM.createRoot`), not a reimplementation. `render.mjs` detects this and drives every screen through the real runtime's `window.__dcSetProps` API instead of the compatible `dc-runtime.mjs` adapter used by `pos`/`back-office` (which have no local `support.js`). This is a strictly higher- fidelity path: every `procurement` primitive is the authentic renderer's own output.

## Procurement visual review notes

- Screens 07 and 08 (`Create Supplier`) place the tab bar mid-page with a right-side live-value summary panel, leaving a large empty region on the left. This pattern is identical and reproducible across both screens and is rendered by the authentic runtime (no adapter emulation involved), so it is the design's own layout choice, not a rendering defect. Flagged for design review, not classified as a pipeline issue.
- No forbidden inventions (Purchase Requisition, RFQ, vendor scorecards, AI/auto-PO, editable WAC, editable posted GRN/Return, silent over-receipt, silent duplicate-invoice acceptance, etc.) were found across the representative screens inspected. Every policy-sensitive point in the source (over-receipt, expired-goods handling, return-approval threshold, credit-limit semantics) is explicitly labelled as policy-dependent/not decided by the design, matching the requirement that no unresolved policy be silently selected.

## Customers + Credit review notes

Status: `approved-visual-reference` (2026-10-01). Source is the corrected v2 export, SHA-256 `593adaec60d84d384fdc2947a1ba7d169f8ec8eb21d34373fb814ee662259d7c` (replaces v1 `b7fb8c01…5819ff`). The v2-fixed archive was verified 10/10 against its manifest; `support.js` is unchanged and identical to Procurement's real runtime.

- v2 change: exactly two source lines (274 and 279 of 331). Screen 60 (Customer Statement) drops `maxWidth:640` from its wrapper and screen 61 (Customer Aging) drops `maxWidth:560`. No text, logic, screen ID, title, group or shared component changed, and all 74 screens render the same text as v1.
- Original defect fixed: Date / Reference / Description / Debit / Credit / Running on screen 60 and every aging bucket on screen 61 are visible at 1280x720, 1366x768, 1368x800 and 1920x1080, with no body-level horizontal scroll and no clipped text. At 1280x720 the table keeps a 4px overflow contained inside its own scroll box, the same as every other table screen in the package. The aging view has no totals row in the source.
- Render: 74/74 RUNTIME-COMPLETE on the real runtime, 0 BLOCKED, 0 KNOWN-DIFFERENCE, 0 page errors. Rendered with Chromium 1194 in the cloud workspace because the pinned 1243 headless shell cannot be downloaded on the local machine.
- Four-viewport PASS: all 74 at 1280x720; screens 01, 13, 16, 21, 27, 28, 31, 46, 49, 51, 52, 60, 61 and 74 at the other three sizes. Minor, unchanged from v1: at 1280x720 the top bar wraps its labels onto two lines without overlap.
- Open decisions preserved: DEC-CRD-001 stays OPEN (screen 31 shows BLOCK / WARN / REQUIRE OVERRIDE, each AUTHORITY-DEPENDENT, none selected). DEC-CRD-002 stays OPEN (screen 46 states FIFO, oldest-first, proportional or manual is not decided; its sample amounts are illustrative, not a rule). Held-sale exposure (39) and over-collection handling (48) also stay open.
- Semantics seen in render: exposure is a result of immutable ledger events with no editable balance (27, 37); an unconfigured limit is not RM 0.00 (29); draft collection has no exposure effect (56); posted collection is read-only (51); safe retry reuses one operation reference (52); Store Node outage and Cloud Sync outage are separate states (05, 06, 59); the statement is operational, not a general ledger (60). Forbidden terms appear only inside disclaimers. No screen has an editable input.
- Documentation: the 43 numbered confirmations live in the grouped page `MiniMart CUS - Design System & Docs.dc.html` from the same export, not in the registered source (screen 74 is the component inventory).

## Cash / Shift / Business Day review notes

Status: `approved-visual-reference`. v2 export verified by content: source `MiniMartCashBusinessDay.dc.html`, SHA-256 `a0d9df668213a9a562bd0fefec9198274c57931b7c6f79da59b87554aee55fee`, from `MiniMart_Cash_Business_Day_ClaudeDesign_Source_v2.zip` (all 10 hashes in `CASH-BUSINESS-DAY-EXPORT-MANIFEST-v2.txt` match the packaged bytes). `support.js` is byte-identical to the Procurement and Customers real runtime. The superseded 74-screen v1 source (SHA-256 `81218a8e...`) is no longer registered.

- Structure: 77 screens, IDs 01-77 contiguous, 77 unique titles, 77 unique state mappings. The inline script parses cleanly and all 77 states instantiate with no errors. The six grouped pages cover all 77 screens exactly once (Cash Movements carries 13-28 and 75-77).
- Render: 77/77 RUNTIME-COMPLETE on the real runtime, 0 BLOCKED, 0 KNOWN-DIFFERENCE.
- v1 to v2 change set: Shift List screens 04-06 (compact 8-column layout; Business Date stacked under Shift Ref, Opened/Closed stacked, Opening Cash moved to Shift Detail / Close Review, Expected / Counted / Variance visible); new safe-retry screens 75 (Open Shift), 76 (Cash In), 77 (Cash Out); and the enum, name, state, screen-index and confirmation wiring for them. No other business semantics changed.
- Safe retry: screens 75-77 say the outcome is unknown, the operation may already have committed, do not submit again, authoritative local status is checked first, and retry cannot create a duplicate shift or CashMovement. Check Status and Retry Safely are visible at every viewport. No rollback, force-post, delete or manual-cleanup action exists. Close Shift (38) and Close Business Day (57) keep their pattern.
- Open decisions preserved: business-date rollover (51) shows midnight, first sale, manual, configured cut-off and automatic-after-last-shift as unselected examples; exceptional day close (55) shows Manager Override, Force Close and Carry Forward as UNRESOLVED slots. Blind count (31), variance tolerance and approval threshold (32-36, 65) and open shifts during day close (54) stay authority-dependent.
- Semantics seen in render: Expected Cash is derived with no editable input; non-cash tenders are labelled as not in the drawer (01); posted CashMovements and closed Shifts / Business Days are read-only; reopen is explicitly not invented (44, 60); Store Node outage (67) and Cloud Sync outage (68) are separate states; Sales, Returns, Collections and supplier/expense cash are read-only traces (61-64). Forbidden terms appear only inside disclaimers.
- Viewports: screens 04-06 and 75-77 were rendered and checked at 1280x720, 1366x768, 1368x800 and 1920x1080; all 77 screens were rendered at 1280x720, and a clipping scan of every screen at 1366x768 and 1280x720 found no hidden table content. No page-level horizontal scroll at any size. The Shift List shows Expected, Counted and Variance in full at every size; at 1280x720 its container overflows by 4px of empty trailing space with no value clipped; at the other three sizes it does not scroll.
- Cosmetic: at 1280x720 the top bar wraps its labels onto two lines because of the longer role label; nothing overlaps.
- Delivery note: the archive file `MiniMart Back Office Mockups.dc.html` is not a links-only index. It is a later edited copy of the full interactive Back Office source (about 96 KB, 42 changed lines against the approved source) and was not applied; the approved Back Office source is unchanged.

## Accounting-Lite review notes

Status: `approved-visual-reference`. Source `MiniMartAccountingLite.dc.html`, SHA-256 `ebe8ca7f38b9b9d5cd9c16fed421bfe5f5863653ec9478a081d368d2bb9df12e`, from `Minimart_Accounting_Lite_ClaudeDesign_Source_v2-fixed.zip` (all 10 hashes in `ACCOUNTING-LITE-EXPORT-MANIFEST-v2-fixed.txt` match the packaged bytes). `support.js` (SHA-256 `8fe7df74...cbe`) is byte-identical to the other real-runtime packages. Two earlier exports were rejected and are no longer registered: the first export (SHA-256 `c5ae24c4...6ae0`) and v2 (SHA-256 `63fb4491...01a1`).

- Structure: 88 screens, IDs 01-88 contiguous, 88 unique titles and state mappings; the inline script parses and all 88 states instantiate with no errors. The seven grouped pages import the source and cover 01-12, 13-28, 29-50, 51-62, 63-72, 73-80 and 81-88, each screen exactly once. The package index is an Accounting-Lite links page.
- Render: 88/88 RUNTIME-COMPLETE on the real runtime, 0 BLOCKED, 0 KNOWN-DIFFERENCE, 0 page errors.
- Review history: the first export was rejected for a ten-times-wrong dashboard bank total, an allocation summary that contradicted its rows, and an Opening Balance and Accountant Export workflow that presented unfrozen behaviour as established. v2 fixed those and was rejected only because the Supplier Payment allocation grid (20) still listed a fully paid payable as a candidate row. v2-fixed changes only that grid's eligibility filter (supplier match and outstanding above zero) and adds the note that only eligible outstanding payables are available for allocation. The grouped pages and `support.js` are byte-identical to v2.
- Numeric corrections: the Bank Accounts card (01) shows RM 236,500.00 (184,200.00 + 52,300.00, matching screens 05 and 33). The supplier payment (20, 23, 86) is RM 950.00 allocated in full to SUP-PAY-2026-00142 (outstanding RM 950.00, remaining RM 0.00): Payment 950.00 = Allocated 950.00 + Unallocated 0.00. SUP-PAY-2026-00104 (Paid, outstanding RM 0.00) appears only in the payable list screens (13, 14) as a historical record, never in the allocation grid. No allocation order is introduced: the note that order is not assumed is unchanged.
- Payable creation basis: screen 13 and confirmation 22 state that the basis follows the configured purchasing and payables workflow (posted purchase or receipt, or approved supplier invoice) and that the Goods Receipt examples are illustrative, not a universal trigger.
- Opening Balance authority correction: frozen authority (FR-ACC-044, FR-ACC-045) requires controlled opening balances with an effective date and audit evidence and forbids direct balance overwrite, but does not define an OpeningBalance aggregate, document, API, posting lifecycle or status contract. Screens 66, 70, 71 and 72 therefore show the required scope, an illustrative inputs example and a no-arbitrary-edit boundary, and state the mechanism is pending an approved contract. Screen 66 has no Check Status or Retry Safely action, and no Entry-Validate-Review-Post flow, post control or set-balance control exists.
- Export ownership correction: screens 75-77 are Accounting-Lite dataset context and a handoff ("Continue in Export Center"). File generation, retention, delivery and any accounting-software integration are stated to belong to Export Center and Reporting. No export job, artifact, queue, format policy or approval workflow is shown. Screen 78 traces Accounting-Lite's own source rows.
- Safe retry is a real operational state (outcome unknown, may already have committed, check status first, Check Status and Retry Safely, no duplicate effect) on screens 26 (Supplier Payment), 44 (Financial Receipt and Payment, one shared state), 48 (Account Transfer) and 55 (Expense; checks authoritative local status and cannot duplicate the Expense, its Financial Movement or the CashierShift cash effect). They elaborate the frozen idempotency and recovery contract and offer no Force Post, delete, roll back or balance editing. Reconciliation completion (69) records no financial movement.
- Boundaries seen in render: Customer outstanding is a read-only view of Customer & Credit (29, 03); no balance edit control exists (37, 67, 72); a drawer-funded expense links to the CashierShift effect and adds no second Cash Out workflow (60); allocation order, unallocated payment, expense approval threshold, tax treatment and reconciliation matching are labelled policy-controlled or not assumed (65 names no matching rule); full-GL terms appear only in disclaimers (01, 08, 87, 88). Store Node and Cloud Sync outages are separate states (79, 80). The receipt (FT-2026-00061, screens 40, 42, 43) and payment (FT-2026-00062, screen 41) are distinct transactions. Screen 88 numbers confirmations 1-52, all present once.
- Viewports: all 88 screens were rendered through the real runtime at 1280x720, 1366x768, 1368x800 and 1920x1080 (every one RUNTIME-COMPLETE) and scanned in-page for page-level scroll and for any text or button that is clipped by its container. This is a live render result, not a width calculation. No page-level scroll and no console error at any size. Outside the sidebar, only screen 88's documentation body is flagged: it is an internal scroll container, so confirmations beyond the first screenful are reachable by scrolling (the static render shows the first ones). Screen 20 was inspected at all four sizes (REMAINING header readable, one eligible row, summary arithmetic and both notes visible), and the Posted pill on screens 38 and 52 is fully visible at 1280x720. The sidebar is also an internal scroll container (its lowest Administration entries sit below the fold at the smaller heights).
- Non-blocking observations: the Allocated and Unallocated figures on 20 and 23 are fixed values that agree with the single eligible row; screen 71 lists no audit-evidence field although titled Effective Date & Evidence; screen 77 shows an illustrative dataset-context reference and hand-off time that no frozen contract defines; screens 64 and 67 show Recorded Movements RM 18,420.00, a period figure that is not the RM 184,200.00 account balance.
- Authority note: only UI-ACC-001 to 009 are frozen Accounting screens. The other screens in this package are visual elaboration. Opening-balance mechanics, export contracts, payable creation basis, allocation order, matching policy, approval thresholds and expense tax remain open or policy-controlled and are not defined by this design.

## Reporting review notes

Status: `approved-visual-reference` (owner visual approval recorded 2026-10-04; visual authority only). Approval is bound to the integrated source hashes below and in `provenance.json`. Integrated source `MiniMartReports.dc.html` (SHA-256 `8a921966...`, 80 screens; upstream V2 export bytes `11376926...76db`) is revision **V2** of a **Claude Design adaptation of the Claude Code candidate** (SHA-256 `ac24dc44...eb7`, kept as history on branch `reports-visual-design`). It comes from `MiniMart_Reporting_ClaudeDesign_Source-V2.zip` (SHA-256 `7fdd150f...a774`, 90,367 bytes). The earlier V1 archive (`MiniMart_Reporting_ClaudeDesign_Source.zip`, SHA-256 `0a9b9610...7ad1`, 89,911 bytes) is retained unmodified as upstream history. See `provenance.json` for every hash.

**Approval record:** the owner approved Reporting V2 as a visual reference on 2026-10-04, accepting the documented static-dialog and grouped-canvas limitations. Approval is bound to the integrated bytes recorded in `provenance.json` (`approval.boundTo`); the upstream V2 export manifest stays unmodified and declares the upstream hashes, which differ for the three adjusted files. It does not approve implementation and does not resolve any business, API, data or security decision; frozen authority wins on any conflict. Retained limitations: the export dialogs are static illustrations; the grouped pages are 1366 px canvases; 30 of 146 requirement claims are mapped by design intent only; the unresolved decisions on screen 78 (DEC-RPT-001 OPEN, DEC-RPT-002 PROPOSED, the page-limit mismatch, the unmasked-customer-data permission and the owner screen for cash, day-close and management reports) stay open; A later owner-authorized status-text correction replaced the stale review-time wording ('review-ready - NOT an approved visual reference') in the index, the source comment and documentation screen 80 with the approved-visual-reference wording, and the hashes above were recomputed from the actual bytes; only screen 80 renders different text. Render evidence below is reused unchanged because approval metadata and that correction do not alter any other rendered screen. MM-007 physical validation remains PENDING and DEC-HW-001 remains OPEN.

**New V2 checks (run on the registered V2 bytes):**

- Archive and hashes: `unzip -t` reports no errors; all 11 hashes declared in the V2 export manifest match the actual upstream bytes, and all 12 files were first registered byte for byte. `support.js`, `traceability.json` and `TRACEABILITY.md` are identical to V1 (`support.js` also to the accepted Accounting-Lite copy). The export manifest is kept intact; its hashes are the upstream hashes.
- Repository integration adjustments (authorized, local): 9 of 12 files stay byte-identical to upstream V2; three were adjusted and recorded in `provenance.json` with both upstream and integrated hashes: `MiniMartReports.dc.html` (`8a921966...`), `MiniMart Reporting Mockups.dc.html` (`d9471351...`) and `MiniMart RPT - Sales Reports.dc.html` (`ac55d071...`). Changes: index range badges and Sales Reports pills use nowrap and flex-shrink:0; the index Back Office link points to the repository target; the V1-only diff statement is replaced by the verified V2 comparison. Rendered text changes only on screen 80 (checked against the upstream V2 text of all 80 screens). The upstream archive and its extraction are unmodified.
- Provenance recalculated for V2. Upstream V2 versus the candidate: 31 changed source lines, and 8 screens (36, 38, 39, 52, 60, 64, 65, 80) render different text in the real runtime; the other 72 are identical apart from the sidebar footer note colour. The integrated copy gives the same figures (31 lines, the same 8 screens). Upstream V2 versus V1: 22 changed source lines, the same 8 screens. The '79 of 80 identical, 15 changed lines' statement describes V1 versus the candidate only; the integrated index and screen 80 now say so.
- Decision statuses: all four corrected chips now render the frozen register status (DEC-RET-002 PROPOSED on 36, DEC-PAY-001 PROPOSED on 38 and 39, DEC-PUR-001 PROPOSED on 52, DEC-CUS-002 VERIFY on 60), and every other decision chip on the 80 screens also matches the register.
- `lang="en"` is present on all 8 top-level documents (source, six grouped pages, index).
- Sidebar footer note: rendered contrast measured on all 80 screens at 5.89:1 (previously 3.15:1). Across all rendered text elements (5,974) no colour pair fails 4.5:1. The note still sits below the fold at 1366x768 because the sidebar scrolls internally.
- Export dialog limitation: screens 64 and 65 now show an explicit design-time note that focus entry, trap, Escape and focus return are not implemented. A scripted keyboard run confirms it: Tab leaves the dialog and Escape does not close it. No behaviour is claimed.
- Badge wrapping, fixed in the integrated copy: the index range badges and the six Sales Reports pills carry nowrap and flex-shrink:0, like the other five grouped pages. Measured: 0 of 6 badges wrap at 1366, 768 and 390 px on the index, and 0 of 6 pills on Sales Reports. At 390 px the index scrolls horizontally, as the upstream V2 export did.
- Back Office link, repaired: the index now links `../../back-office/source/MiniMart Back Office Mockups.dc.html`. Served from `docs/design`, clicking the link from the index loads that page (HTTP 200, no page error), and all 7 index links return 200. Link check on the source folder: 57 local references resolve, 0 dangling. The page is a cross-package link and is not bundled in the Reporting package.
- Coverage: IDs 01-80 contiguous, 80 unique titles; the six grouped pages cover each screen exactly once (0 gaps, 0 duplicates) and load in the real runtime with 28, 11, 12, 9, 12 and 8 embedded screens and no page error. 57 local references resolve and none is dangling. Traceability files unchanged: 0 mismatches against the registry, all 65 FR-RPT requirements mapped.
- Render: 80/80 RUNTIME-COMPLETE on the real runtime at the primary viewport, and 80/80 at each of 1280x720, 1366x768, 1368x800 and 1920x1080 (320 renders). Layout rescanned at all four sizes: no page scroll, no console error, no clipped text or button, no inner horizontal scroll. Accessibility structure audit: 0 issues, 534 focusable controls. Keyboard run (screens 01, 21, 29, 64, 65): every stop shows a visible outline and no page error. 35 of 80 screens scroll inside the page container at 1366x768. Scope note: after the integration adjustments and the owner-authorized status-text correction, all 80 screens were re-rendered at the primary viewport and at 1280x720, 1366x768, 1368x800 and 1920x1080 (80/80 RUNTIME-COMPLETE each, 0 known-missing assets), and the layout scan, accessibility structure, contrast and grouped-page load checks were re-run; screen 80 is the only screen whose rendered text differs from the upstream V2 export (full height 1074 px at 1366x768, no clipping).

**Prior V1 evidence reused only where V2 content is unchanged:** the frozen-rule formula reconciliation (cashier, counter, category, outstanding, aging, valuation, variance and totals examples), the ILLUSTRATIVE DATA ribbon on every content screen, the full-content captures of long screens and the requirement mapping (116 of 146 claims show the ID on screen, 30 rest on design intent) come from the V1 full pass. V2 changed only the 8 screens above plus the sidebar note colour, none of which touches those figures, but the reconciliation was not re-executed against V2 text. The V1 render PNGs were overwritten by the V2 renders.

- Remaining defects: (1) the export dialog is still a static mock (documented, not interactive); (2) the grouped pages are 1366 px canvases and scroll horizontally on narrow windows, and the index scrolls horizontally at 390 px (upstream behaviour); (3) the upstream V2 manifest text is retained as exported and still says the Back Office target was verified in the Claude Design project and repeats the V1 diff statement.
- Remaining limitations: the export dialog is drawn inline, not as an overlay; static renders show only the first screenful of long pages; the sidebar scrolls internally; shell navigation is structural and only Reports is live; no PDF export or phase labels were produced; the ReportRunRequest (1-500) versus PageInfo (max 200) limit mismatch and the owner screen for cash, day-close and management reports stay open and are listed on screen 78.

## Inventory review notes

Status: `review-ready`, **not** `approved-visual-reference`. No owner visual approval has been given. This is the batch 4 revision: `MiniMart_Inventory_ClaudeDesign_Source_v2(batch4).zip` (SHA-256 `1d36c255...26f3`, 100,269 bytes), registered byte for byte; source `MiniMartInventory.dc.html` SHA-256 `48f47b59...7358`, 67 screens. The first export (60 screens), the v2 export and the v2 batch 3 export are preserved in `Incoming/` and are not registered. Earlier statements that an approved Inventory source existed are historical. See `provenance.json`, `traceability.json` and `TRACEABILITY.md`. Earlier fixes are treated as claims, not evidence; each was re-verified.

- Archive and inventory: `unzip -t` is clean. The archive has 18 files: 16 payload files (1 source, 5 grouped pages, 1 index, 7 print variants, `support.js`, `doc-page.js`), the design's `TRACEABILITY-v2.md`, and the cumulative revision manifest. The manifest's '17 packaged files' means 14 `.dc.html` + 2 runtime files + `TRACEABILITY-v2.md`; its older sections still say 15, 16 and 65 screens. Taking the last declaration for each file, all 16 payload hashes and sizes match; `TRACEABILITY-v2.md` is not hashed by the manifest (actual SHA-256 in `provenance.json`) and is not registered: it fails the repository prettier gate, is superseded by the integration traceability and stays in the archive. `support.js` equals the accepted copies; `doc-page.js` equals the first export's. No upstream byte was changed.
- Structure: IDs 01-67 are contiguous with 67 unique titles; the script parses; `lang=en` is on all 14 documents. The five grouped pages cover 01-07, 08-16, 17-29, 30-48 and 49-67, each screen exactly once, and load with 7, 9, 13, 19 and 19 embedded screens and no page error. 53 local references resolve; none is dangling (the Back Office reference is now a plain label).
- Render: 67/67 RUNTIME-COMPLETE on the real runtime at the primary viewport and at each of 1280x720, 1366x768, 1368x800 and 1920x1080 (268 renders), 0 known-missing assets.
- Print split: the seven variants render with `doc-page.js`. Printed to PDF they give 7, 9, 13, 19, 12 and 7 pages for the six per-group variants, which cover 01-67 exactly once, and 60 pages for the legacy Combined 01-60; every page is 14.24 x 8.75 in (1366 x 840 CSS px) and carries one screen. Combined 01-60 plus New States 61-67 together cover all 67 screens; New States headers read 61-67 with a 'New in revision' label. The print headers of 08, 09, 11, 25, 26 and 60 still carry the old shortened titles.
- Layout: no page-level scroll or console error. Tables are clipped or scroll horizontally on the same 8 screens as the first export (02, 03, 04, 06, 07, 16, 30, 49) at 1280x720, 1366x768 and 1368x800, and on 30 at 1920x1080. No action button, input or link is clipped or off-viewport at any of the four sizes; only table rows exceed the width, hiding the MOVING WAC and LAST MOVEMENT columns. The Back Office target is 1366x768 and above.
- Accessibility structure: an h1 exists on 66 of 67 screens (05 has none); named ARIA tables exist on 02, 03, 04, 06, 07, 13, 14, 16, 17 and 49 (not literal tables); labelled number, select and textarea controls exist on 18, 19, 33, 34, 35, 50 and 66; live regions exist on 18, 19, 20, 62, 64, 65, 66 and 67; no control or button lacks an accessible name. Still open: no literal table, caption or th; header-like grids without table roles on 09, 10, 11, 12, 30, 33-38, 44, 46, 50 and 61; no dialog role, focus movement or focus return for the movement and batch drawers; no inputs on 27, 31, 36 or the approval note on 22. The manifest's claim that 09 and 11 were converted is false.
- Keyboard (driven in a browser): on the inventory list and movement history, Enter and Space on a focused row open it, Space does not scroll the page, other keys are ignored and a nested input keeps its own typing. A nested button's Enter or Space still triggers the row (its click bubbles to the unguarded onClick), so the nested-control isolation is incomplete; no shipped row contains a nested control. The movement drawer takes no focus, has no dialog semantics and does not close on Escape. 17 screens were tabbed: every tab stop shows a visible outline and there were no page errors. Controls are inert: typing into the adjustment quantity changes nothing, the Negative, Zero Stock and Low Stock chips on 02 do not filter, entered counts do not reach review.
- Contrast: 3,351 rendered text elements, one failing pair family remains: 'New Stock Count' white on #f0f0f0 (1.14:1) on 02, 03, 04, 06 and 49. The claimed fix does not work because `newCountBg` is defined but never returned from `renderVals`. Every earlier pair (sidebar notes, placeholder, headings, meta text, Restricted) now passes 4.5:1.
- Negative stock and reconciliation: no screen shows a negative balance; 20 and 21 compute 2 - 5 = -3 and block (FR-INV-012, DEC-INV-010). The 'Counts In Progress or Review' tile equals the list on 30. Count data still disagrees (the ledger shows CNT-2026-00012 as +5 on Teh Tarik Mix while 30, 37 and 46 give +1; 43 references ADJ-2026-00050/51; 47 and the ledger times differ), and batch detail 12 shows 20 EACH where the table and ledger give 23.
- States 61-67 and qualifiers: reorder decision support (61, thresholds labelled as examples, DEC-INV-007 OPEN), LOADING, EMPTY, CONFLICT, INCOMPATIBLE_CLIENT, VALIDATION_ERROR and PERMISSION_DENIED exist as static screens. Qualifiers: 66 states a 'greater than 0' rule that is not in the frozen FRS; 67 names an 'Inventory Manager' role that is not a frozen persona and no permission code; 63's action and 64's refresh are not wired. Approval, cancel, opening stock and cost visibility still have no frozen operation or permission code; DEC-INV-003, 004, 005, 007 stay OPEN and DEC-INV-008 PROPOSED.
- Requirement traceability (integration-built): of 110 FR-INV, 56 demonstrated, 24 partial, 4 annotated only, 6 gaps (FR-INV-009, 010, 011, 013, 044, 055), 5 later-phase, 15 domain or service requirements. UI-INV-006 is now partial (screen 61). The design's `TRACEABILITY-v2.md` classifies screens by control type, was never checked against FR-INV, and 13 single-screen rows describe a different screen from the registry (05, 06, 07, 15, 36, 39-45, 48).
- Earlier findings, verified: fixed F1, F2, F7, F14, F16; partial F4, F8, F10, F12, F13, F15; not fixed F3, F11, F17; owner questions unchanged F5, F6, F9. New findings N1-N12 are in `traceability.json`.
- Design guidance: unchanged from the first review (`docs/specifications/06-ui-specification/docs/01-DESIGN-SYSTEM.md` with docs 07, 11, 17, 18, 20, 24, 25, AGENTS.md and `docs/design/README.md`); missing: frozen palette values, a print guideline and a display-rounding rule.

## Procurement viewport verification

`primaryViewport` (1366x768) is verified as part of the normal `pnpm design:render --package procurement` run (see the table below). The package's declared `supportedViewports` were additionally verified with a one-off, non-authoritative render pass (`renderPackage()` called directly with `viewportOverride`/`outputRoot`, screenshots kept outside the tracked tree) using the same strict renderer -- every check (unsupported primitive, pageerror, unresolved asset) still applied:

- **1280x720** (smallest supported): all 74 screens rendered without error. Representative dense screens inspected (Supplier List/Detail/Create, PO List/Detail, GRN entry/review, Batch Allocation, Purchase Return line entry, negative-stock-blocked state, component inventory) showed no clipping of primary actions, dialogs, or tables. One finding: the PO List's rightmost `APPROVAL` column falls outside the immediately visible area of its own scroll region at this width; inspection of computed styles confirmed the containing element has a genuine `overflow-x: auto` scroll container (`scrollWidth` 1134px vs `clientWidth` ~1028px) -- the same "horizontal scroll only where needed" pattern the design system page documents for dense tables -- so the column is reachable by scrolling, not lost. No hidden submit/post buttons were found at this viewport.
- **1368x800**: representative dense screens re-inspected; PO List's `APPROVAL` column is fully visible without scrolling at this width. No clipping or overlap found.
- **1920x1080**: representative dense screens re-inspected; layout stays left-aligned in its fixed-width column with no stretching artifacts, sidebar/top bar/content do not overlap. No clipping found.
- Screens 07/08 (`Create Supplier`) were re-checked at all four viewports: the mid-page tab bar and sparse-left layout is identical and usable at every size (tabs and the right-side summary panel stay fully visible and non-overlapping); retained as-is per instruction not to redesign a source layout choice.

## accounting

Package: MiniMart Accounting-Lite. Rendered 88 screen(s) at 2026-10-02T09:11:36.009Z. All screens RUNTIME-COMPLETE.

| Screen | Name                                                                     | Status           | Notes                                                                               |
| ------ | ------------------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------- |
| 01     | Accounting Dashboard — overview                                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 02     | Dashboard — Supplier Outstanding card                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 03     | Dashboard — Customer Outstanding card (read-only)                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 04     | Dashboard — Cash Accounts card                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 05     | Dashboard — Bank Accounts card                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 06     | Dashboard — Expenses card                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 07     | Dashboard — Unreconciled Bank Movements card                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 08     | Operational Financial Summary (period)                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 09     | Period Filtering panel                                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 10     | Source Reconciliation Checks — overview                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 11     | Mismatch state — detail                                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 12     | Connectivity — Online + Sync Healthy                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 13     | Supplier Payables — list                                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 14     | Supplier Payables — list filtered                                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 15     | Supplier Payable — detail                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 16     | Payable source trace — Goods Receipt                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 17     | Payable source trace — Purchase Return / Supplier Credit                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 18     | Supplier Payment — entry form                                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 19     | Supplier Payment — account / method                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 20     | Supplier Payment — allocation table                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 21     | Supplier Payment — unallocated (policy-controlled)                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 22     | Supplier Payment — part payment                                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 23     | Supplier Payment — Review                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 24     | Supplier Payment — Posted                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 25     | Supplier Payment — Reversal / Correction                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 26     | Supplier Payment — Posting / Safe Retry                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 27     | Supplier Statement                                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 28     | Supplier Aging (illustrative buckets)                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 29     | Customer Outstanding — read-only Accounting view                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 30     | Customer Collection — linkage (read-only trace)                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 31     | Customer Return / Credit — linkage (read-only trace)                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 32     | Financial Accounts — workspace intro                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 33     | Financial Accounts — list                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 34     | Cash Account — detail                                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 35     | Bank Account — detail (no credentials stored)                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 36     | Account Activation — Active / Inactive                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 37     | Account Balance — derived, no edit                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 38     | Financial Movement — history                                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 39     | Financial Movement — detail                                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 40     | Non-Sale Receipt — entry form                                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 41     | Non-Purchase Payment — entry form                                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 42     | Financial Transaction — Draft / Review                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 43     | Financial Transaction — Posted                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 44     | Financial Transaction — Posting / Safe Retry                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 45     | Account Transfer — entry form                                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 46     | Account Transfer — value rule validation                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 47     | Account Transfer — Posted (linked pair)                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 48     | Account Transfer — Posting / Safe Retry                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 49     | Transfer — linked movement detail                                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 50     | Financial Transaction & Transfer — audit trail                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 51     | Expense Category — workspace                                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 52     | Expense — list                                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 53     | New Expense — entry form                                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 54     | Expense — tax treatment boundary                                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 55     | Expense — Posting / Safe Retry                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 56     | Expense Approval (policy-controlled)                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 57     | Expense — Review                                                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 58     | Posted Expense                                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 59     | Expense — Reversal / Correction                                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 60     | Drawer-Funded Expense — linked to CashierShift                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 61     | Cash Drawer boundary — documentation note                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 62     | Expense — audit timeline                                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 63     | Reconciliation — sessions list                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 64     | Reconciliation Session — detail                                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 65     | Reconciliation — Match / Unmatch                                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 66     | Opening Balance — Mechanism Pending Contract                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 67     | Reconciliation Difference — explicit                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 68     | Reconciliation Adjustment — traceable correction                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 69     | Reconciliation — Complete                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 70     | Opening Balance — Required Scope (Controlled Migration)                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 71     | Opening Balance — Effective Date & Evidence (illustrative)               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 72     | Opening Balance — No Arbitrary Balance Edit (boundary)                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 73     | Source Reconciliation Checks — mismatch drilldown                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 74     | Operational Financial Summary — drilldown                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 75     | Accounting Export — choose period / datasets (context for Export Center) | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 76     | Accounting Export — review totals (context for Export Center)            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 77     | Accounting Export — handoff to Export Center                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 78     | Export traceability — row-level detail                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 79     | Connectivity — Cloud Sync unavailable (local posting continues)          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 80     | Connectivity — Store Node unavailable (posting blocked)                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 81     | Permission-aware UI states                                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 82     | Audit timeline — global pattern                                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 83     | Historical master change — non-destructive                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 84     | Cross-module ownership map                                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 85     | Design System — table / status / stepper components                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 86     | Design System — form / allocation components                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 87     | Boundary documentation — forbidden inventions                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 88     | Documentation confirmations + screen index                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |

## administration

Status: **UNVERIFIED** — not rendered in this workspace.

## back-office

Package: MiniMart Back Office + Catalog + Pricing. Rendered 60 screen(s) at 2026-09-27T14:26:34.352Z. Contains KNOWN-DIFFERENCE screens (see table).

| Screen | Name                                         | Status           | Notes                                                                                                                   |
| ------ | -------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 01     | Dashboard — normal                           | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 02     | Dashboard — attention states                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 03     | Back Office — Store Node unavailable         | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 04     | Back Office — cloud sync unavailable         | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 05     | Back Office — permission-limited / read-only | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 06     | Products — populated                         | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 07     | Products — loading                           | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 08     | Products — empty (first run)                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 09     | Products — no search results                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 10     | Products — filtered                          | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 11     | Product quick-detail drawer                  | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 12     | Product Detail — Overview                    | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 13     | Product Detail — Identifiers                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 14     | Product Detail — Units                       | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 15     | Product Detail — Tracking                    | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 16     | Product Detail — Suppliers                   | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 17     | Product Detail — Store Availability          | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 18     | Product Detail — History / Audit             | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 19     | New Product — Basic                          | KNOWN-DIFFERENCE | 2 `image-slot` element(s) emulated (no real dependency exists); known-missing local asset(s): support.js, image-slot.js |
| 20     | New Product — Identifiers                    | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 21     | New Product — Units                          | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 22     | New Product — Tracking                       | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 23     | New Product — Supplier Associations          | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 24     | Edit Product                                 | KNOWN-DIFFERENCE | 2 `image-slot` element(s) emulated (no real dependency exists); known-missing local asset(s): support.js, image-slot.js |
| 25     | Product validation errors                    | KNOWN-DIFFERENCE | 2 `image-slot` element(s) emulated (no real dependency exists); known-missing local asset(s): support.js, image-slot.js |
| 26     | Duplicate identifier conflict                | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 27     | Potential duplicate warning                  | KNOWN-DIFFERENCE | 2 `image-slot` element(s) emulated (no real dependency exists); known-missing local asset(s): support.js, image-slot.js |
| 28     | Deactivate Product                           | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 29     | Reactivate Product                           | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 30     | Quick Create Skeleton Item                   | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 31     | Incomplete Item Detail                       | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 32     | Skeleton Completion Queue                    | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 33     | Complete Item                                | KNOWN-DIFFERENCE | 2 `image-slot` element(s) emulated (no real dependency exists); known-missing local asset(s): support.js, image-slot.js |
| 34     | Categories                                   | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 35     | Category edit                                | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 36     | Brands                                       | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 37     | Product Import — upload                      | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 38     | Product Import — validation                  | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 39     | Product Import — duplicate/error review      | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 40     | Product Import — confirmation/result         | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 41     | Pricing — master list                        | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 42     | Pricing — missing-price filter               | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 43     | Item Pricing Detail                          | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 44     | Price History                                | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 45     | Schedule Future Price                        | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 46     | Price Change confirmation                    | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 47     | Price Validation warning                     | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 48     | Bulk Price Change — selection                | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 49     | Bulk Price Change — edit                     | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 50     | Bulk Price Change — validation/preview       | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 51     | Bulk Price Change — result                   | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 52     | Price Import                                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 53     | Price Label Queue                            | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 54     | Unauthorized Price Edit                      | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 55     | Product list — 1280×720                      | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 56     | Product form — 1280×720                      | KNOWN-DIFFERENCE | 2 `image-slot` element(s) emulated (no real dependency exists); known-missing local asset(s): support.js, image-slot.js |
| 57     | DataTable design system                      | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 58     | Form design system                           | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 59     | Status/Validation/Permission design system   | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |
| 60     | Product/Pricing component inventory          | RUNTIME-COMPLETE | known-missing local asset(s): support.js, image-slot.js                                                                 |

## cash-shifts

Package: MiniMart Cash / Shift / Business Day. Rendered 77 screen(s) at 2026-10-02T07:29:41.441Z. All screens RUNTIME-COMPLETE.

| Screen | Name                                                            | Status           | Notes                                                                               |
| ------ | --------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| 01     | Current Shift Workspace — Open                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 02     | Current Shift Workspace — Closing                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 03     | Current Shift Workspace — No Open Shift                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 04     | Shift List — populated                                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 05     | Shift List — filtered by Business Date                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 06     | Shift List — filtered Closed                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 07     | Shift List — empty                                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 08     | Shift List — Store Node unavailable                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 09     | Shift Monitor (manager)                                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 10     | Cash Movement Monitor (store-level)                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 11     | Multi-Counter Store view                                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 12     | Business Date vs Calendar Timestamp strip                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 13     | Open Shift — entry form                                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 14     | Open Shift — Opening Cash (not fixed default)                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 15     | Open Shift — Note field                                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 16     | Open Shift — eligibility conflict: cashier already open         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 17     | Open Shift — eligibility conflict: register already open        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 18     | Open Shift Confirmation / Review                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 19     | Open Shift — Posted / Shift Open                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 20     | Cash In — entry form                                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 21     | Cash In — Reason / Reference / Note                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 22     | Cash In — Authorization required                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 23     | Cash In — Draft (no effect yet)                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 24     | Cash In — Posted                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 25     | Cash Out — entry form                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 26     | Cash Out — example (Ice delivery, ownership preserved)          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 27     | Cash Out — Posted                                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 28     | Shift → Cash Movements tab                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 29     | Shift Close — Review Shift                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 30     | Shift Close — Count Cash                                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 31     | Shift Close — Blind Count policy (open)                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 32     | Shift Close — Review Variance                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 33     | Variance — Over                                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 34     | Variance — Short                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 35     | Variance — Exact                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 36     | Variance Note — policy-driven                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 37     | Shift Close — Confirm Close                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 38     | Shift Close — Posting / Safe Retry                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 39     | Shift Close — Conflict (changed since loaded)                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 40     | Closed Shift — read-only detail                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 41     | Closed Shift — Tender summary                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 42     | Closed Shift — Cash Movement history                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 43     | Closed Shift — Audit timeline                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 44     | Shift Reopen — not invented                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 45     | Business Day List — populated                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 46     | Business Day List — filtered                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 47     | Business Day List — empty                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 48     | Business Day Detail — Open                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 49     | Business Day Detail — Closing                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 50     | Cross-Midnight Operations illustration                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 51     | Business Date Rollover — OPEN decision                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 52     | Business Day Open — state                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 53     | Business Day Close — Readiness workspace                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 54     | Business Day Close — Open Shifts blocking (authority-dependent) | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 55     | Exceptional Day Close — OPEN decision                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 56     | Business Day Close Review                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 57     | Business Day — Safe Retry                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 58     | Closed Business Day — read-only                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 59     | Closed Business Day — Audit                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 60     | Business Day Reopen — not invented                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 61     | Cross-module: Shift → Source Sale trace                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 62     | Cross-module: Cash Refund trace (Returns)                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 63     | Cross-module: Customer Collection cash source                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 64     | Cross-module: Supplier/Expense cash-out source                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 65     | Variance Review / work queue                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 66     | Cash Difference Reporting (Over/Short/Exact)                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 67     | Store Node unavailable (Cash & Business Day)                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 68     | Cloud Sync unavailable (local-first posting continues)          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 69     | Cross-module Map                                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 70     | Design System — Table / Status components                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 71     | Design System — Form / Movement components                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 72     | Permission / Audit components                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 73     | Empty & Validation states gallery                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 74     | Component inventory + documentation                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 75     | Open Shift — Posting / Safe Retry                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 76     | Cash In — Posting / Safe Retry                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 77     | Cash Out — Posting / Safe Retry                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |

## customers

Package: MiniMart Customers + Credit. Rendered 74 screen(s) at 2026-10-01T07:17:23.485Z. All screens RUNTIME-COMPLETE.

| Screen | Name                                                          | Status           | Notes                                                                               |
| ------ | ------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| 01     | Customer List — populated                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 02     | Customer List — filtered Credit Enabled                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 03     | Customer List — With Overdue                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 04     | Customer List — empty / no results                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 05     | Customer List — Store Node unavailable                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 06     | Customer List — Cloud Sync unavailable                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 07     | Customer List — read-only / permission-limited                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 08     | Customer Search at POS (cross-module example)                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 09     | Walk-in vs Identified Customer                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 10     | Customer Summary cards                                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 11     | Customer Import — upload/validate/review (if included)        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 12     | Potential Duplicate Customer                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 13     | Create Customer — Basic Info                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 14     | Create Customer — Contact / Address                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 15     | Create Customer — Identifiers                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 16     | Customer Detail — Overview                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 17     | Customer Detail — Contact / Address                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 18     | Customer Detail — Identifiers                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 19     | Customer Detail — Sales History                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 20     | Customer Detail — Returns                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 21     | Customer Detail — Credit                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 22     | Customer Detail — Collections                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 23     | Customer Detail — Statement                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 24     | Customer Detail — History / Audit                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 25     | Customer Deactivate / Reactivate confirmation                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 26     | Credit Enablement — enable credit                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 27     | Credit Account Overview — cards                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 28     | Credit Ledger / Exposure History                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 29     | Credit Limit — No Fixed Limit / Policy-defined                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 30     | Credit Limit — Configured Limit                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 31     | Credit Limit Violation — authority-dependent                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 32     | Credit Eligibility at Checkout — states gallery               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 33     | Overdue Credit view                                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 34     | Due-Date Basis — documentation note                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 35     | Customer Credit Sales list                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 36     | Credit Ledger Entry detail drawer                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 37     | Credit Ledger immutability note                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 38     | Credit Sale connection — cross-module map                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 39     | Held-Sale Pending Credit Exposure — open decision             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 40     | Credit Correction / Reversal                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 41     | Credit Restricted state                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 42     | Credit Not Enabled state                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 43     | Concurrent Credit-Limit Check — conflict                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 44     | New Customer Collection — entry                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 45     | Collection — Select Customer                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 46     | Collection Allocation — table                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 47     | Partial Collection example                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 48     | Collection exceeds outstanding — validation                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 49     | Collection Review                                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 50     | Collection Posted                                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 51     | Posted Collection — read-only                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 52     | Collection Safe Retry / uncertain                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 53     | Collection posting envelope note                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 54     | Collection validation — missing fields                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 55     | Collection — payment/financial context link                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 56     | Draft Collection — no exposure effect                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 57     | Collections list — populated                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 58     | Collections list — filtered Draft                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 59     | Collection Store Node unavailable                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 60     | Customer Statement                                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 61     | Customer Aging — restrained read-only view                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 62     | Credit Dashboard / Work Queue                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 63     | Accounting-Lite Receivables link                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 64     | Statement Print / Export                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 65     | POS Credit Sale flow (cross-module example)                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 66     | Sale Detail → View Customer (cross-module example)            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 67     | Sales Return → resulting credit effect (cross-module example) | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 68     | Aging bucket note — configured/reporting policy               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 69     | Cross-module Map                                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 70     | Design System — Table / Status components                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 71     | Design System — Form / Ledger components                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 72     | Permission / Audit components                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 73     | Empty & Validation states gallery                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 74     | Component inventory + documentation                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |

## inventory

Package: Inventory. Rendered 67 screen(s) at 2026-10-04T08:38:27.088Z. All screens RUNTIME-COMPLETE.

| Screen | Name                                             | Status           | Notes                                                                               |
| ------ | ------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------- |
| 01     | Inventory Summary                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 02     | Inventory — populated list                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 03     | Inventory — filtered Low Stock                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 04     | Inventory — Zero Stock                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 05     | Inventory — Store Node unavailable               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 06     | Inventory — Cloud Sync unavailable               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 07     | Inventory — read-only / permission-limited       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 08     | Inventory Item Detail — Overview                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 09     | Inventory Item Detail — Movement History         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 10     | Movement Detail Drawer                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 11     | Inventory Item Detail — Batch / Expiry           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 12     | Batch Detail                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 13     | Near Expiry list                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 14     | Expired Stock list                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 15     | Moving WAC — authorized view                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 16     | Movement History — store-wide                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 17     | Adjustment History                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 18     | New Adjustment                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 19     | Adjustment — batch tracked                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 20     | Adjustment — validation                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 21     | Negative Stock Blocked                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 22     | Adjustment — approval required                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 23     | Adjustment — review                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 24     | Adjustment — posted                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 25     | Adjustment — correction / compensating action    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 26     | Adjustment — safe retry / uncertain state        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 27     | Opening Stock — entry                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 28     | Opening Stock — review                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 29     | Opening Stock — posted                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 30     | Stock Counts — master list                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 31     | Create Stock Count                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 32     | Count Scope                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 33     | Count Entry — standard                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 34     | Count Entry — blind                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 35     | Count Entry — barcode/search                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 36     | Batch Count                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 37     | Count Review                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 38     | Variance Review                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 39     | Recount Requested                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 40     | Recount Completed                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 41     | Count Approval Required                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 42     | Count Ready to Post                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 43     | Count Posted                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 44     | Zero Variance Count                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 45     | Cancel Count                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 46     | Posted Count — read-only                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 47     | Count Audit / Timeline                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 48     | Count Concurrency — authority-dependent          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 49     | Inventory list — 1280×720                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 50     | Count entry — 1280×720                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 51     | Adjustment — 1280×720                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 52     | Inventory DataTable components                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 53     | Quantity / Stock status components               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 54     | Movement components                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 55     | Batch / Expiry components                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 56     | Adjustment components                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 57     | Count components                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 58     | Permission / Approval components                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 59     | Offline / Error states                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 60     | Inventory component inventory + documentation    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 61     | Reorder / Low Stock — decision support           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 62     | Inventory — LOADING state                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 63     | Inventory — EMPTY state                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 64     | Inventory — CONFLICT (stale version) state       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 65     | Inventory — INCOMPATIBLE_CLIENT state            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 66     | Inventory — VALIDATION_ERROR (field-level) state | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 67     | Inventory — PERMISSION_DENIED (posting) state    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |

## pos

Package: MiniMart POS. Rendered 31 screen(s) at 2026-09-27T14:26:08.929Z. All screens RUNTIME-COMPLETE.

| Screen | Name                       | Status           | Notes                                    |
| ------ | -------------------------- | ---------------- | ---------------------------------------- |
| 01     | Sale — empty cart          | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 02     | Sale — populated cart      | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 02b    | Sale — Grid view (concept) | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 03     | Product search results     | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 04     | Product not found          | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 05     | Customer selection         | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 06     | Identified customer        | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 07     | Hold sale                  | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 08     | Held sales                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 09     | Payment selection          | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 10     | Cash payment               | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 11     | Card — waiting             | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 12     | Card — failed              | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 13     | Card — uncertain           | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 14     | DuitNow QR                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 15     | Sale completed             | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 16     | Sale history               | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 17     | Sale detail                | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 18     | Return — locate sale       | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 19     | Return — select items      | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 20     | Return confirmation        | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 21     | Refund unconfirmed         | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 22     | Shift open                 | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 23     | Shift close                | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 24     | Manager override           | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 25     | Printer unavailable        | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 26     | Store Node unavailable     | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 27     | Cloud sync unavailable     | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 28     | Permission denied          | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 29     | Loading                    | RUNTIME-COMPLETE | known-missing local asset(s): support.js |
| 30     | Empty history              | RUNTIME-COMPLETE | known-missing local asset(s): support.js |

## procurement

Package: MiniMart Suppliers + Procurement. Rendered 74 screen(s) at 2026-09-27T16:19:03.755Z. All screens RUNTIME-COMPLETE.

| Screen | Name                                               | Status           | Notes                                                                               |
| ------ | -------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| 01     | Supplier List — populated                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 02     | Supplier List — filtered                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 03     | Supplier List — empty / no results                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 04     | Supplier List — Store Node unavailable             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 05     | Supplier List — Cloud Sync unavailable             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 06     | Supplier List — read-only / permission-limited     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 07     | Create Supplier — Basic Info & Identifiers         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 08     | Create Supplier — Contact / Address / Terms        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 09     | Supplier Detail — Overview                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 10     | Supplier Detail — Identifiers                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 11     | Supplier Detail — Contacts / Address               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 12     | Supplier Detail — Items                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 13     | Supplier Detail — Purchase Orders                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 14     | Supplier Detail — Goods Receipts                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 15     | Supplier Detail — Purchase Returns                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 16     | Supplier Detail — Transactions / Financial Context | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 17     | Supplier Detail — History / Audit                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 18     | Supplier Deactivate confirmation                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 19     | Supplier Reactivate confirmation                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 20     | Duplicate Identifier detection                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 21     | Purchases workspace — summary                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 22     | PO List — populated                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 23     | PO List — filtered Awaiting Approval               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 24     | Create PO — header & lines                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 25     | PO Draft — no stock effect                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 26     | PO Approval states gallery                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 27     | PO Detail — Overview & receipt progress            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 28     | PO Detail — Partial receipt history                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 29     | PO Concurrent receiving conflict                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 30     | Over-receipt — policy-dependent examples           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 31     | Close With Unreceived Remainder                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 32     | PO Cancellation                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 33     | PO Detail — Fully Received / Closed                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 34     | Receive Goods — entry choice                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 35     | PO-based GRN — select & lines                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 36     | PO-based GRN — receiving now / after receipt       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 37     | Direct GRN — header (no PO linked)                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 38     | Duplicate Supplier Document warning                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 39     | GRN Item Entry — lookup / table                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 40     | Unknown Item During Receipt                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 41     | Quick Create Skeleton Item (from GRN)              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 42     | Inactive / Non-purchasable Item block              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 43     | Purchase UoM conversion context                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 44     | Received + Free Quantity                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 45     | GRN Commercial Inputs                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 46     | Batch Split allocation                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 47     | Expiry capture — valid / near / expired            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 48     | Expired Goods warning / block                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 49     | PO Quantity & Price Variance                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 50     | Supplier Total Comparison                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 51     | GRN Review (before posting)                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 52     | GRN Validation errors                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 53     | GRN Posted confirmation                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 54     | Posted GRN — read-only                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 55     | GRN Safe Retry / uncertain                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 56     | GRN Offline (Store Node up, Cloud down)            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 57     | Purchase Return List — populated                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 58     | New Purchase Return — select Supplier/GRN          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 59     | Return Without Original GRN — exceptional          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 60     | Purchase Return Line — returnable quantity         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 61     | Over Return — blocked                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 62     | Current Stock Check — negative stock blocked       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 63     | Return Reason                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 64     | Purchase Return Commercial Values                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 65     | Purchase Return Approval                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 66     | Purchase Return Review                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 67     | Purchase Return Posted                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 68     | Posted Purchase Return — read-only                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 69     | Purchase Return Safe Retry                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 70     | Cross-module Map                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 71     | Design System — Table / Status components          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 72     | Design System — Form / Approval components         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 73     | Permission / Audit components                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 74     | Component inventory + documentation                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |

## reports

Package: MiniMart Reporting. Rendered 80 screen(s) at 2026-10-04T04:44:56.088Z. All screens RUNTIME-COMPLETE.

| Screen | Name                                                | Status           | Notes                                                                               |
| ------ | --------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| 01     | Reports Home — authorized catalog                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 02     | Reports Home — search and family filter applied     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 03     | Report definition — supported filters and grouping  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 04     | Reports Home — loading                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 05     | Reports Home — empty (no authorized reports)        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 06     | Reports Home — permission denied                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 07     | Reports Home — local scope (cloud sync unavailable) | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 08     | Reports Home — Store Node unavailable               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 09     | Reports Home — incompatible client                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 10     | Reports Home — later-phase central reports          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 11     | Report viewer — anatomy                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 12     | Filter bar — filters and applicability              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 13     | Business date versus timestamp                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 14     | Totals definitions — status of each term            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 15     | Grouping basis — historical or current master       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 16     | As-of reporting                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 17     | Pagination and bounded results                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 18     | Drill-down — source reference (read-only)           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 19     | Report — loading                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 20     | Report — empty result                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 21     | Report — validation error                           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 22     | Report — permission denied                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 23     | Report — definition conflict                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 24     | Report — run failed (no partial totals)             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 25     | Report — local scope (cloud sync unavailable)       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 26     | Report — Store Node unavailable                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 27     | Report — incompatible client                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 28     | Read-only guarantee and operational scope           | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 29     | Daily Sales Summary                                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 30     | Sales by Item                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 31     | Sales by Category                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 32     | Sales by Cashier                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 33     | Sales by Counter                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 34     | Discount Report                                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 35     | Price Override Report                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 36     | Returns Report                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 37     | No-Receipt Return Report                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 38     | Tender Summary                                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 39     | Payment Exception Report                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 40     | Cash Movement Report                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 41     | Cash Variance Report                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 42     | Shift Close Report                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 43     | Day Close Report                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 44     | Current Stock                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 45     | Low Stock Report — threshold ownership undefined    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 46     | Negative Stock Report — normally empty              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 47     | Stock Movement Report                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 48     | Batch / Expiry Report                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 49     | Inventory Valuation Report                          | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 50     | Stock Count Variance Report                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 51     | Stock Adjustment Report                             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 52     | Purchase Summary                                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 53     | Purchase by Supplier                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 54     | Purchase Return Report                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 55     | Purchase Price History — cost-sensitive             | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 56     | Customer Outstanding Report                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 57     | Customer Aging Report                               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 58     | Customer Statement                                  | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 59     | Credit Override Report                              | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 60     | Customer data — masked by default                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 61     | Management Daily Summary                            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 62     | Exception Highlights                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 63     | Comparative Periods — optional                      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 64     | Export dialog — format and scope                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 65     | Export — permission required                        | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 66     | Export job — queued and running                     | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 67     | Export job — completed, hand off to Export Center   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 68     | Export job — failed and cancelled                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 69     | Export — outcome unknown (recovery)                 | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 70     | Export — personal data minimised                    | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 71     | Print preview                                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 72     | Report access and export audit notice               | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 73     | Central report — incomplete sync warning            | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 74     | Report components                                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 75     | Accessibility and keyboard behaviour                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 76     | Responsive behaviour                                | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 77     | Requirement to screen index                         | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 78     | Open decisions and authority gaps                   | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 79     | Boundaries — what this package does not define      | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
| 80     | Documentation — confirmations                       | RUNTIME-COMPLETE | rendered by the real Claude Design runtime (support.js), not the compatible adapter |
