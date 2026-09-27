# Design render fidelity report

Generated 2026-09-27T14:26:37.684Z. This report reflects the most recent local run of `pnpm design:render` for each package below; it is not evidence of a check that has not actually been run.

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

Status: **UNVERIFIED** — not rendered in this workspace.

## reports

Status: **UNVERIFIED** — not rendered in this workspace.
