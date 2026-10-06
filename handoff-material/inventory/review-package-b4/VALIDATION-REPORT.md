# MiniMart Inventory batch 4 revision - independent validation report

Status: **review-ready, unapproved.** No approval promoted, nothing committed or pushed. Software-only validation.
MM-007 physical validation remains PENDING. DEC-HW-001 remains OPEN.
Worktree: `D:/mm-inv` (detached at `1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67`).

## 1. Which archive

Exactly `MiniMart_Inventory_ClaudeDesign_Source_v2(batch4).zip` in `Incoming/`: SHA-256 `1d36c2559a8ecdf13cfb31baa8e1203dc1627765f3bc2429639cb16b2bb326f3`, 100,269 bytes, `unzip -t` clean. It was chosen over the first export (`f476c656...`), the v2 export (`b244655f...`) and the v2 batch 3 export (`b6ecf8a6...`), all of which are preserved unmodified in `Incoming/` and are not registered.

## 2. Exact inventory (the "17 files" claim)

The archive holds **18 files**: 16 payload, 1 documentation, 1 manifest.

| Group | Count | Files |
| --- | --- | --- |
| Source | 1 | `MiniMartInventory.dc.html` (97,722 bytes, SHA-256 `48f47b59...7358`) |
| Grouped pages | 5 | Foundation & List, Item & Movements, Adjustments & Opening Stock, Stock Count, Design System & Docs |
| Index | 1 | `MiniMart Inventory Mockups.dc.html` |
| Print variants | 7 | Foundation & List 01-07, Item & Movements 08-16, Adjustments & Opening Stock 17-29, Stock Count 30-48, Design System & Docs 49-60, New States 61-67, Combined 01-60 |
| Runtime | 2 | `support.js`, `doc-page.js` |
| Documentation | 1 | `TRACEABILITY-v2.md` (SHA-256 `fc666d9b...`, not hashed by the manifest) |
| Manifest | 1 | `INVENTORY-REVISION-MANIFEST.txt` (SHA-256 `2615142f...`) |

The manifest's "17 packaged files" = 14 `.dc.html` + 2 runtime + `TRACEABILITY-v2.md`. The manifest is cumulative and contradicts itself: older sections still say "15 + manifest = 16", "65 screens" and "print variants unchanged". Taking the last declaration for each file, all 16 payload hashes and byte sizes match the packaged bytes. `support.js` equals the accepted copies; `doc-page.js` equals the first export's. 17 files are registered byte for byte; `TRACEABILITY-v2.md` is **not** registered because it fails the repository prettier gate (`pnpm run ci`), is superseded by the integration traceability and stays in the archive (a one-line `.prettierignore` change would be needed to register it).

## 3. Structure, links, grouped coverage

- IDs 01-67 contiguous, 67 unique titles, screen enum equals the registry, script parses, `lang=en` on 14/14 documents.
- Grouped pages cover 01-07, 08-16, 17-29, 30-48, 49-67: 67 references, 67 unique, 0 duplicates, 0 gaps; they load with 7, 9, 13, 19, 19 embedded screens and no page error.
- 53 local references resolve, 0 dangling (the Back Office reference is now a plain label with no href). Remote hosts: Google Fonts, unpkg. Only 404: favicon.

## 4. Render, layout, print

- 67/67 RUNTIME-COMPLETE at 1366x768 and at each of 1280x720, 1366x768, 1368x800, 1920x1080 (268 renders), 0 known-missing assets.
- Clipping is **unchanged**: 02, 03, 04, 06, 07, 16, 30, 49 clip or scroll horizontally at 1280x720, 1366x768, 1368x800; 30 also at 1920x1080. No action button, input or link is clipped or off-viewport at any size (only table rows exceed the width, hiding MOVING WAC and LAST MOVEMENT). No page scroll, no console error.
- Print: the six per-group variants print 7, 9, 13, 19, 12, 7 pages = 67, covering 01-67 exactly once; Combined 01-60 prints 60. Together Combined 01-60 plus New States 61-67 cover all 67 screens. All pages are 14.24 x 8.75 in (1366 x 840 CSS px), one screen per page; New States headers read 61-67 with a "New in revision" label. Print headers of 08, 09, 11, 25, 26, 60 still carry the old shortened titles (19 header mismatches across five variants).

## 5. Accessibility, keyboard, contrast (all measured in a browser)

- h1 on 66 of 67 screens (05 none). Named ARIA `role=table` on 02, 03, 04, 06, 07, 13, 14, 16, 17, 49. No literal `<table>`/caption/th anywhere. Header-like grids without table roles on 09, 10, 11, 12, 30, 33-38, 44, 46, 50, 61. The manifest's claim that 09 and 11 were converted is false.
- Labelled controls: 18, 19 (number, select, textarea), 33, 34, 35, 50 (counted inputs), 66 (aria-invalid with a described error). No control or button without an accessible name. Live regions: 18, 19, 20, 62, 64, 65, 66, 67. No inputs on 27, 31, 36 or the approval note on 22. No dialog semantics anywhere.
- Row keyboard handlers (inventory list, movement history), driven with real key presses: Enter and Space on a focused row open it; Space does not scroll; other keys are ignored; a nested **input** keeps its own typing. A nested **button's** Enter or Space (and a mouse click) still opens the row, because the row's onClick is unguarded - the isolation is incomplete (no shipped row has a nested control today).
- Movement drawer: opens on Enter but focus stays on the row, no role=dialog, the next Tab goes to the next row, Escape does not close it.
- 17 screens tabbed: every tab stop shows a visible outline; no page errors. Controls are inert: adjustment quantity and Decrease do not change the preview; the Negative, Zero Stock, Low Stock chips do not filter; entered counts do not reach review; 66's error never changes.
- Contrast on 3,351 rendered text elements: one failing pair family: "New Stock Count" white on #f0f0f0 = 1.14:1 on 02, 03, 04, 06, 49. The claimed fix is ineffective: `newCountBg` is defined but never returned from `renderVals`. All earlier pairs (sidebar notes, placeholder, headings, meta, Restricted) now pass 4.5:1.

## 6. Negative stock and cross-screen reconciliation

- No negative balance appears. Laundry Detergent is 2 EACH; ADJ-2026-00030 runs to 2; 20 and 21 compute 2 - 5 = -3 and block (FR-INV-012, 085, 101; DEC-INV-006, 010). F1 verified fixed. The Negative chip is inert and no screen shows its result.
- "Counts In Progress or Review" = 2 equals CNT-2026-00015 + CNT-2026-00016 on screen 30 (F2 verified; the subset is the design's choice).
- Still inconsistent (F3): the ledger (16) shows CNT-2026-00012 as Teh Tarik Mix +5 while 30, 37 and 46 give +1; 43 references ADJ-2026-00050/51; the ledger row (16:10) precedes the posting time on 47 (18:40).
- Batch (F4 partial): the batch ledger now ends with ADJ-2026-00041 +6 and B-2609-01 = 23 (consistent on 11, 13, 36) but batch detail 12 still states 20 EACH (N3).

## 7. States 61-67, permissions, qualifiers

61 Reorder / Low Stock: example thresholds labelled, DEC-INV-007 OPEN stated, "no frozen reorder operation exists". 62 LOADING (polite live region), 63 EMPTY (action not wired), 64 CONFLICT (no refresh action), 65 INCOMPATIBLE_CLIENT, 66 VALIDATION_ERROR, 67 PERMISSION_DENIED. Qualifiers: 66 states a "greater than 0" rule that is not in the frozen FRS; 67 tells the user to ask "an Inventory Manager or Admin" (not frozen persona names; no permission code); number inputs are fixed at step 1 (FR-INV-007 asks for UoM precision). Approval, cancel, opening stock and cost visibility still have no frozen API operation or permission code (F6).

## 8. Finding-by-finding

| ID | Sev | Revision claim | Verified |
| --- | --- | --- | --- |
| F1 | high | fixed | **Fixed** |
| F2 | medium | fixed | **Fixed** (derivable subset) |
| F3 | medium | fixed (bounded) | **Not fixed** |
| F4 | low | fixed (bounded) | **Partial** (batch detail 20 vs 23) |
| F5 | medium | owner | Unchanged |
| F6 | high | owner | Unchanged (correctly labelled) |
| F7 | medium | fixed | **Fixed** (screen 61) |
| F8 | medium | fixed | **Mostly fixed** (qualifiers in section 7) |
| F9 | low | owner | Unchanged |
| F10 | high | partial | **Partial** (see section 5) |
| F11 | high | not fixed | **Not fixed** |
| F12 | medium | partial | **Partial** (one pair; fix ineffective) |
| F13 | low | fixed | **Partial** (print headers) |
| F14 | low | fixed | **Fixed** |
| F15 | low | fixed | **Partial** (manifest self-contradictory) |
| F16 | medium | fixed | **Fixed** |
| F17 | high | unresolved | **Not fixed** (see N1) |

New findings: N1 TRACEABILITY-v2.md rows do not match the screens (13 rows: 05, 06, 07, 15, 36, 39-45, 48; claims for 09 and 11 false); N2 New Stock Count fix ineffective; N3 batch detail 20 vs 23; N4 count variance chain (F3); N5 nested-control click; N6 drawers without dialog behaviour; N7 inert controls and filters; N8 remaining accessibility gaps; N9 print titles; N10 manifest inconsistency; N11 non-frozen wording on 66 and 67; N12 stale docs text ("historical/diagnostic status"). Full text: `TRACEABILITY.md`.

## 9. Requirement coverage (frozen FR-INV, integration-built)

110 FR-INV: 56 demonstrated, 24 partial, 4 annotated only, 6 gaps (FR-INV-009, 010, 011, 013, 044, 055), 5 later-phase, 15 domain/service. UI-INV-006 is partial (61); UI-INV-001..005 are covered in whole or part. `TRACEABILITY-v2.md` classifies by control type and was never checked against FR-INV, so it is not coverage evidence. Remaining requirement gaps and partials, with the screens: `TRACEABILITY.md`.

## 10. Repository gates (`D:/mm-inv`, 24-path candidate)

`pnpm design:validate` valid (8); `pnpm test:design-render` 17/17; prettier clean; `pnpm run ci` exit 0; frozen `docs/specifications` and `docs/backlog` diff 0. `git diff --check` reports one error: a blank line at EOF in the upstream `INVENTORY-REVISION-MANIFEST.txt` (preserved byte for byte, so left as is). The fidelity report keeps unrelated package evidence and timestamps.

## 11. Limitations

Static renders and scripted keyboard runs only; no screen reader; the row-handler nested-control test injects controls because none ship; contrast measured on rendered DOM colours; print checked by PDF page count and size.
