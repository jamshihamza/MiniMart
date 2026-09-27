# Design render fidelity report

Generated 2026-09-27T16:19:04.250Z. This report reflects the most recent local run of `pnpm design:render` for each package below; it is not evidence of a check that has not actually been run.

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

## Procurement viewport verification

`primaryViewport` (1366x768) is verified as part of the normal `pnpm design:render --package procurement` run (see the table below). The package's declared `supportedViewports` were additionally verified with a one-off, non-authoritative render pass (`renderPackage()` called directly with `viewportOverride`/`outputRoot`, screenshots kept outside the tracked tree) using the same strict renderer -- every check (unsupported primitive, pageerror, unresolved asset) still applied:

- **1280x720** (smallest supported): all 74 screens rendered without error. Representative dense screens inspected (Supplier List/Detail/Create, PO List/Detail, GRN entry/review, Batch Allocation, Purchase Return line entry, negative-stock-blocked state, component inventory) showed no clipping of primary actions, dialogs, or tables. One finding: the PO List's rightmost `APPROVAL` column falls outside the immediately visible area of its own scroll region at this width; inspection of computed styles confirmed the containing element has a genuine `overflow-x: auto` scroll container (`scrollWidth` 1134px vs `clientWidth` ~1028px) -- the same "horizontal scroll only where needed" pattern the design system page documents for dense tables -- so the column is reachable by scrolling, not lost. No hidden submit/post buttons were found at this viewport.
- **1368x800**: representative dense screens re-inspected; PO List's `APPROVAL` column is fully visible without scrolling at this width. No clipping or overlap found.
- **1920x1080**: representative dense screens re-inspected; layout stays left-aligned in its fixed-width column with no stretching artifacts, sidebar/top bar/content do not overlap. No clipping found.
- Screens 07/08 (`Create Supplier`) were re-checked at all four viewports: the mid-page tab bar and sparse-left layout is identical and usable at every size (tabs and the right-side summary panel stay fully visible and non-overlapping); retained as-is per instruction not to redesign a source layout choice.

## accounting

Status: **UNVERIFIED** — not rendered in this workspace.

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

Status: **UNVERIFIED** — not rendered in this workspace.

## customers

Status: **UNVERIFIED** — not rendered in this workspace.

## inventory

Status: **UNVERIFIED** — not rendered in this workspace.

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

Status: **UNVERIFIED** — not rendered in this workspace.
