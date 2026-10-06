# Visual-only POS screens (owner visual approval recorded; software-only checkpoint candidate)

Status: software-only work on `wip/visual-pos-ui`. The owner approved the visual implementation of
all 31 screens on 2026-10-06 (see "Implementation approval"). That is a visual approval only. Nothing
here is accepted as a product feature, committed to `main` or pushed. It is governed by [ADR 0008](../adr/0008-bounded-phase-0-visual-only-pos-ui-exception.md).

## Authority and scope

- Visual authority: `docs/design/pos/source/MiniMartPOS.dc.html`, SHA-256
  `cdbcd1e0fc5d4d66da6fdac9101c7611fad327709443bbbc6bfec07389ab44e6`, 117,821 bytes, owner-approved
  as a visual reference on 2026-10-06. Approval is recorded in `docs/design/pos/provenance.json`
  and the manifest. The source bytes are unchanged. It is visual authority only; frozen
  specifications and the Decision Register win on any conflict.
- Exception: ADR 0008 permits a frontend-only visual implementation with fictional fixtures. It does
  not permit real sales, posting, payment or card processing, business calculations, persistence,
  API calls, sync, authentication, authorization or hardware operations.
- All 31 screens of the approved reference are implemented (list below). The shared shell and the
  main Sale screen were reviewed and approved by the owner first and keep their approved appearance.
  The owner later reviewed and approved all 31 screens.

## Implementation approval

Recorded in `docs/design/pos/provenance.json` under `implementationApproval`, separately from the
Claude Design source approval (`approval`).

- Owner wording, 2026-10-06: visually reviewed and approved all 31 implemented POS visual screens
  (01 to 30 plus 02b); prepare the checkpoint. The approval itself does not authorize a commit or a
  push; the owner authorized the WIP checkpoint commit and a push of `wip/visual-pos-ui` separately.
- Bound to: the reference source hash above, the SHA-256 of each of the 30 implementation files under
  `apps/pos-terminal` (digest `14c2b703df41642a9b3e3fa77d933b3e848e029cd13b231e56a9527ad2f30108`),
  the removal of `ShellControls.tsx`, the hashes of the four preserved MM-008 files, and the exact
  38-path candidate list (digest `55a92b39afcc32f539a32e63d930afdfe1f6668bd5c1f089ec867145de6fc10f`).
  The seven documentation and tooling paths are bound by path only, because they carry these hashes.
- Scope: fictional-only visual behavior under ADR 0008. The intentional differences from the
  reference are the table below.
- Meaning: all 31 POS visual screens are owner-approved. Production and business functionality,
  MM-008 acceptance, native validation and remote CI remain incomplete.
- Not covered, and still pending: MM-008 acceptance (this branch inherits the incomplete MM-008
  software checkpoint), MM-007 physical validation, native Tauri and device evidence, remote CI, and
  the POS and Back Office workspace switching. The owner has given that direction, but it has no ADR
  or change record, is not implemented and is not part of this checkpoint.
- The approval approved the code as it was; no approved UI file was changed to record it.

## Branch base and inherited status

This branch starts at the MM-008 WIP checkpoint commit `a30a1490b5d07e3c7ec45debd44bfa898421fb40`
(`wip/mm-008-scanner-spike`) so that the scanner behavior and its regression tests are carried in
explicitly. It was created with `git worktree add -b`; the MM-008 branch was not modified, and
nothing was merged into it, into this branch from elsewhere, or into `main`.

It therefore **inherits MM-008's incomplete acceptance**: native WebView2 and physical-scanner
acceptance are pending, the 50 ms burst threshold is provisional, and browser F-key default-action
isolation is not independently verified (see `docs/phase-0/mm-008-scanner-spike.md`). Nothing in
this branch changes that or claims scanner acceptance. MM-007: the software checkpoint is on `main`
(`dfc7cb4`), physical validation is pending and DEC-HW-001 is open.

## Reference-screen coverage

The registry `apps/pos-terminal/src/screens.ts` lists every reference screen and the preview state
that reproduces it. `test/screens.test.tsx` reads `docs/design/pos/design-manifest.json` and fails if
the registry differs from it in number, name or group, and renders each screen to check its content.
Run the preview and open `?screen=<id>`, or use the "Preview states" control.

| Ref | Reference name             | Group               | Implemented as                                                    | Address       |
| --- | -------------------------- | ------------------- | ----------------------------------------------------------------- | ------------- |
| 01  | Sale — empty cart          | Checkout            | Sale screen, empty cart                                           | `?screen=01`  |
| 02  | Sale — populated cart      | Checkout            | Sale screen, fictional populated cart                             | `?screen=02`  |
| 02b | Sale — Grid view (concept) | Checkout            | List view of the product browser                                  | `?screen=02b` |
| 03  | Product search results     | Checkout            | Fixed fictional result list while the field holds the preset text | `?screen=03`  |
| 04  | Product not found          | Checkout            | Not-found card for the preset barcode                             | `?screen=04`  |
| 05  | Customer selection         | Checkout            | Customer dialog                                                   | `?screen=05`  |
| 06  | Identified customer        | Checkout            | Customer attached in the Current Sale panel                       | `?screen=06`  |
| 07  | Hold sale                  | Checkout            | Hold dialog                                                       | `?screen=07`  |
| 08  | Held sales                 | Checkout            | Held-sales dialog                                                 | `?screen=08`  |
| 09  | Payment selection          | Payment             | Payment-selection dialog                                          | `?screen=09`  |
| 10  | Cash payment               | Payment             | Cash dialog                                                       | `?screen=10`  |
| 11  | Card — waiting             | Payment             | Card dialog, waiting                                              | `?screen=11`  |
| 12  | Card — failed              | Payment             | Card dialog, declined                                             | `?screen=12`  |
| 13  | Card — uncertain           | Payment             | Card dialog, unconfirmed                                          | `?screen=13`  |
| 14  | DuitNow QR                 | Payment             | DuitNow QR dialog                                                 | `?screen=14`  |
| 15  | Sale completed             | Payment             | Sale-completed dialog                                             | `?screen=15`  |
| 16  | Sale history               | History and returns | History page                                                      | `?screen=16`  |
| 17  | Sale detail                | History and returns | History page with the detail pane                                 | `?screen=17`  |
| 18  | Return — locate sale       | History and returns | Returns step 1                                                    | `?screen=18`  |
| 19  | Return — select items      | History and returns | Returns step 2                                                    | `?screen=19`  |
| 20  | Return confirmation        | History and returns | Return-confirmation dialog                                        | `?screen=20`  |
| 21  | Refund unconfirmed         | History and returns | Returns step 3 (refund unconfirmed)                               | `?screen=21`  |
| 22  | Shift open                 | Shift               | Shift page, open                                                  | `?screen=22`  |
| 23  | Shift close                | Shift               | Shift page, close-shift count                                     | `?screen=23`  |
| 24  | Manager override           | History and returns | Manager-override dialog                                           | `?screen=24`  |
| 25  | Printer unavailable        | Payment             | Sale-completed dialog with the printer-unavailable state          | `?screen=25`  |
| 26  | Store Node unavailable     | Operational states  | Simulated Store Node offline overlay and locked navigation        | `?screen=26`  |
| 27  | Cloud sync unavailable     | Operational states  | Simulated cloud-sync banner                                       | `?screen=27`  |
| 28  | Permission denied          | History and returns | History detail with the permission dialog                         | `?screen=28`  |
| 29  | Loading                    | Operational states  | Loading state of the product browser                              | `?screen=29`  |
| 30  | Empty history              | Operational states  | History page, empty                                               | `?screen=30`  |

31 of 31 reference screens are covered; none is omitted.

## What is implemented

`apps/pos-terminal` (existing application, no new package or framework):

- Shell: sidebar (Sale, History, Returns, Shift), Devices panel, operator block, top bar with store,
  register, business date, status pills, notification and user controls.
- Sale: search bar, category chips, tile and list product views, loading state, search-result and
  not-found presentations, Current Sale panel, customer attached state.
- Dialogs (modal, focus trapped, Escape closes, focus returns to the opener, page behind is inert):
  customer, hold, held sales, payment selection, cash, card (three outcomes), DuitNow QR, sale
  completed, manager override, permission, return confirmation.
- Pages: History with detail pane and empty state, Returns (three steps), Shift (open and close).
- Visual flow: buttons that open a reference dialog or swap one fictional state for another work
  locally (select customer, hold, recall, discount, complete sale, payment method, simulated card
  result, new sale, view sale, start return, review and confirm return, close shift, back). They only
  change which fixture is drawn. Nothing is calculated, posted, stored or sent.
- Real behavior kept: the MM-006 Store Node status probe drives the pill, and the MM-008 scanner
  capture, F2 shortcut and search isolation are unchanged.

## Not implemented, and how it is identified

Every other control is a stub: it keeps the reference look, is drawn with a dashed outline, is
`aria-disabled` with the title "Not implemented in this visual-only preview.", and writes
"“<name>” is not implemented in this visual-only preview." to the single status region when
activated. Examples: product tiles, quantity steppers, Note, Cash in, Cash out, Print Receipt, the
final Close shift, Check terminal result. Controls the reference itself shows as disabled stay
`disabled`. Totals, line totals, counts, change, refunds and differences are fixed fictional strings;
the product code adds, multiplies and rounds nothing. `test/fixtures.test.ts` and
`test/fixtures-flow.test.ts` recompute them in the tests only and check they equal the reference.

The whole screen carries a permanent "FICTIONAL VISUAL PREVIEW" note in the sidebar. Open dialogs
add a caption under the dialog saying nothing is recorded, and the preview control names the data as
fictional.

## Differences from the approved reference

| Area                      | Reference                                                   | Here                                                                                 | Why                                                                                                             |
| ------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Devices panel             | Scanner and Printer "Ready", Drawer "Closed"                | All "Not tested"                                                                     | No device is connected or tested here; MM-007 and MM-008 hardware acceptance are pending.                       |
| Payment tiles             | "Drawer ready", "Terminal T-01 ready", "Provider connected" | "Cash drawer · not tested", "Card terminal · not tested", "Provider · not connected" | Same reason: no device or provider is connected.                                                                |
| Sale-completed print note | "Receipt printed. Printer POS-01-P1"                        | "Receipt not printed. Printing is not implemented."                                  | No printer is used. Screen 25 keeps the reference's printer-unavailable state.                                  |
| Cloud pill                | "Sync healthy"                                              | "Cloud · Not checked"                                                                | No sync exists. The reference variant is reachable with `&sync=down`.                                           |
| Store Node pill           | "Store Node online"                                         | Real MM-006 result, "Store Node · Unavailable" in a browser                          | Existing connectivity behavior is kept. `&node=online` simulates the reference pill and is titled as simulated. |
| Store Node offline        | Overlay and locked navigation                               | Only in the simulated screen 26                                                      | The real unavailable status does not block the shell, as before.                                                |
| Controls                  | Active                                                      | Stubs have a dashed outline and announce "not implemented"                           | Required by ADR 0008.                                                                                           |
| Cart behavior             | Adds, steps, removes, recalculates                          | Fixed fictional lines and totals                                                     | No business calculation is allowed.                                                                             |
| Search                    | Live results while typing                                   | Result list and not-found card only for the preset text of screens 03 and 04         | A live lookup is not allowed; Enter keeps showing "Item lookup is unavailable" (MM-008 contract).               |
| Terminal outcome links    | "PROTOTYPE · simulate terminal"                             | "PREVIEW ONLY · simulate terminal"                                                   | Same control, labelled as preview.                                                                              |
| Dialog focus              | none                                                        | Dialog takes focus (or its primary action), Tab is trapped, Escape closes            | Accessibility.                                                                                                  |
| Extra labels              | none                                                        | Permanent fictional-preview note, dialog caption                                     | Required by ADR 0008.                                                                                           |
| Page structure            | none                                                        | Visually hidden `h1`, skip link, single `role="status"`, headings on each page       | Accessibility and the MM-008 tests.                                                                             |
| Fonts and icons           | IBM Plex from Google Fonts, Lucide font                     | IBM Plex from the same link, locked `lucide-react`                                   | Bundling fonts needs a separate decision. Icon shapes can differ slightly between Lucide versions.              |
| Business date and time    | Fixed fixture                                               | Fixed fixture                                                                        | Same; it is not the real clock.                                                                                 |
| Product images            | Static TEMP placeholders                                    | Same                                                                                 | No real imagery exists.                                                                                         |

Inherited from the reference: while the History detail pane is open, the grid has a 0 px tender
track, so the "STATUS" header and status pills overflow it visually (the text stays visible). At
1280x720 the "CUSTOMER" header on screens 17 and 28 is clipped as well. This is a documented,
accepted limitation.

The stylesheet does not import Tailwind. Its preflight and global `box-sizing: border-box` would
distort a faithful port because the reference uses browser defaults. The Tailwind packages stay
installed and unused; removing them is left to a later cleanup.

## MM-008 regression tests

`scanner-input.ts`, `scanner-input.test.ts` (52 tests) and `scanner-fixtures.ts` are unchanged. In
`App.tsx` the scanner helpers, the Store Node probe effect, the capture-phase scanner effect, the F2
effect and `showUnavailableSearch` are byte-identical to the MM-008 checkpoint (checked by
extracting and comparing them). `scanner-shell.test.tsx` keeps all 42 tests and every behavioral
assertion. Exactly two navigation or focus selectors changed, because the approved design no longer
has the controls they named:

1. "stops a terminator from activating a focused button" focused the old "Search" submit button. It
   now focuses the always-focusable "Note" button and runs the identical focus, key-event and
   Enter-consumption assertions.
2. "does not resume a half-finished scan after leaving and returning to the Sale page" returned
   through a "Back to sale" button. It now clicks the "Sale" navigation entry. The scan assertions
   are unchanged. The Space tests still use the History button.

`test/App.test.tsx` was rewritten and `test/preview.test.tsx` updated for the new screens.

## Validation run (software only)

- POS suite: 9 files, 177 of 177 tests pass (102 inherited before this work, 75 added). Type check,
  ESLint, Prettier, `pnpm run ci`, the Vite production build and `pnpm design:validate` pass.
- Checkpoint re-run (2026-10-06, after the approval): the POS suite (177 of 177) and the Vite build
  were re-run, and the 124 side-by-side captures, the pixel comparison and the 93-combination browser
  audit were repeated against the implementation bytes bound in `provenance.json` (hashes taken
  before and after the runs were identical). The gates listed under "Checkpoint gates" below were
  run again as well. Results are the same as above. The reference-side PNGs and the design-render
  baseline comparison are earlier evidence, reused because the reference source, the runtime and
  `tools/design-render` are unchanged since they were produced.
- Reference rendered with the real Claude Design runtime, taken unchanged from
  `docs/design/procurement/source/support.js` (SHA-256
  `8fe7df74405f3c55f49b7249c74ea1397e65d07dea2b1bd3b4a489bec2e28cbe`) in a scratch copy outside the
  repository, because `support.js` is not shipped with the POS package. Playwright with system
  Chrome captured all 31 screens at 1366x768, 1280x720, 1368x800 and 1920x1080 (124 comparisons)
  with no console or page errors. The PNGs are not committed.
- Content-area pixel diff (sidebar and top bar excluded, so the intentional differences there do not
  count): mean 1.09 percent of pixels, median 0.96, worst 2.87 percent (screen 17, from the dashed
  stub outlines). The History column positions were checked against the reference to the pixel.
- Browser audit (repeated at the checkpoint with the same 93 combinations and 2,754 Tab stops; the
  only clipped text found is the STATUS header on screens 17 and 28 at every viewport and, at
  1280x720 only, the CUSTOMER header on the same two screens, the same History-detail overflow) of 93 screen and viewport combinations (31 screens at 1366x768, 1280x720 and
  1920x1080) and 2,754 Tab stops: every control has an accessible name, exactly one `main` and one
  status region, one `h1` per screen, no horizontal page overflow, a visible focus ring on every
  stop, nothing off screen, dialogs are labelled and `aria-modal` with focus inside, Tab never
  leaves a dialog and never reaches an inert element.
- `pnpm run test:design-render`: compared with the untouched MM-008 worktree by test name, status
  and failure text, the two runs are identical after normalizing the worktree name and one
  total-duration line. 12 of 18 fail in both, all with "Executable doesn't exist" for Playwright's
  bundled headless Chromium, which is not installed here. With `MINIMART_DESIGN_BROWSER_PATH`
  pointing at system Chrome, both worktrees pass 17 of 17 and the outputs are again identical. No
  test touches `tools/design-render/report.mjs`, and the report builds. The change to it introduces
  no failure.

## Checkpoint gates (run 2026-10-06 on the implementation bytes bound in `provenance.json`)

- `pnpm run ci` (Prettier, ESLint, frozen-manifest, protected-test and boundary checks, `tsc -b`):
  exit 0.
- `pnpm design:validate`: 8 manifests valid.
- POS suite 177 of 177, `tsc -b` and the Vite production build: pass.
- `pnpm run test:design-render` with `MINIMART_DESIGN_BROWSER_PATH` set to system Chrome: 17 of 17.
  Without it, the 12 browser tests fail for the missing bundled Chromium, as in the baseline.
- `git diff --check` clean. Frozen `docs/specifications` and `docs/backlog` show an empty diff.
  Nothing is staged.

## Not verified

- The native Tauri window was not launched for this work.
- No physical scanner, printer, drawer or card terminal was used. WebView2 behavior is untested.
- Every OPEN business decision (rounding, hold policy, returns, payments, shift rules) is untouched.
  The screens only draw the reference's fictional states.
- CI has not run: nothing is pushed and no pull request exists.
