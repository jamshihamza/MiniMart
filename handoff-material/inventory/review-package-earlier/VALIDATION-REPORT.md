# MiniMart Inventory visual candidate - validation report

Status: **review-ready, unapproved.** No owner visual approval. Nothing is committed or pushed.
Candidate worktree: `D:/mm-inv` (detached at `1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67`).
Upstream archive: `Incoming/MiniMart_Inventory_ClaudeDesign_Source.zip`, SHA-256 `f476c65607aae2507cf3fb9ada3b988915f35e627eecb5ae9e846cd17b998589`, 81,587 bytes.
Source of truth registered at `docs/design/inventory/source/MiniMartInventory.dc.html`, SHA-256 `a18dc6c21a64cfb77056d222fe948e55a67800122acf31469cd20f826ca76479`.
MM-007 physical validation remains PENDING. DEC-HW-001 remains OPEN. Software-only validation.

## 1. Archive and files

- `unzip -t`: no errors. 16 files = 15 payload files + the export manifest (counted separately).
- Payload: 1 source, 5 grouped pages, 1 index, 6 print variants (5 per-group + 1 combined 01-60), `support.js`, `doc-page.js`.
- All 15 declared SHA-256 hashes and byte sizes match the packaged bytes. Manifest SHA-256 `29dd19f3337218d0...` (full value in `provenance.json`).
- All 16 files were registered byte for byte; `cmp` against the upstream extraction shows no difference.
- `support.js` is byte-identical to the accepted copies in accounting, cash-shifts, customers, procurement and reports. `doc-page.js` exists in no other package; the print variants load `./doc-page.js` and use `<doc-page width="1366px" height="840px">`.
- `lang="en"` is present on all 13 `.dc.html` files.

## 2. Structure, links and grouped pages

- Screen IDs 01-60, 60 unique titles, the screen enum equals the registry, the source script parses.
- Grouped pages cover 01-07, 08-16, 17-29, 30-48, 49-60: 60 references, 60 unique, 0 duplicates, 0 gaps. They load in the real runtime with 7, 9, 13, 19 and 12 embedded screens and no page error.
- Six grouped-page titles differ from the source registry: 08, 09, 11, 25, 26, 60 (reworded or shortened).
- 51 local references resolve; 1 dangling: the index link `MiniMart Back Office Mockups.dc.html`. The repository copy is at `docs/design/back-office/source/`; the link was not changed.
- Remote hosts: Google Fonts and unpkg only. The only 404 seen is the browser's favicon request.

## 3. Render evidence

- 60/60 RUNTIME-COMPLETE on the real runtime (`support.js`) at 1366x768, and 60/60 at each of 1280x720, 1366x768, 1368x800 and 1920x1080 (240 renders). 0 known-missing assets.
- Renders: `docs/design/inventory/renders/` (gitignored), `D:/mm-inv-render-<size>/`. Representative PNGs are in this folder.

## 4. Print variants

- All six render with `doc-page.js` and import the single source. Printed to PDF with `preferCSSPageSize`: 7, 9, 13, 19 and 12 pages, and 60 for the combined set. These equal the section counts, so no screen spills onto a second page.
- One physical page size: 14.24 x 8.75 in (1366 x 840 CSS px). Print is not a frozen requirement; the size comes from `doc-page.js`.
- PDFs: `print/`.

## 5. Layout, accessibility, contrast, keyboard

- No page-level scroll and no console error at any of the four sizes.
- **Clipping:** tables are clipped or scroll horizontally on 8 screens at 1280x720, 1366x768 and 1368x800 (02, 03, 04, 06, 07, 16, 30, 49) and on screen 30 at 1920x1080. The Back Office target is 1366x768 and above (frozen UI doc 11), so this is inside the supported range. On screen 02 the "Negative (historical)" pill overflows into the next column.
- **Accessibility structure:** no screen has an h1. Across all 60 screens there is no `input`, `select` or `textarea`, no `table`, no heading, no live region and no dialog semantics. 206 focusable controls exist outside the sidebar. The structure audit passes trivially because nothing is present to check, so the absence is reported as a defect.
- **Keyboard** (02, 18, 20, 33, 22, 52): every tab stop that exists shows a visible outline; no page errors. Count entry (33) exposes one stop outside the sidebar and adjustment entry (18) only Increase, Decrease and Continue, so keyboard-only stock count posting (a critical workflow in the acceptance matrix) is not demonstrated.
- **Contrast:** 3,154 text elements checked, 13 colour pairs fail 4.5:1: sidebar footer note 3.15, sidebar group labels 4.07, search placeholder 2.54, muted headings 4.41, meta text 4.23 and 4.11, restricted-value text 2.54. The enabled "New Stock Count" button on 02, 03, 04, 06 and 49 renders white on light grey (1.14:1) because its background expression is not applied; on screen 30 it is blue.

## 6. Requirement traceability (integration-built)

The design carries no FR-INV, BR-INV, UI-INV, API-INV or DEC-INV identifier on any screen, and the export has no traceability file. 60 unique screens are not coverage. The mapping was built from the frozen authority by reading all 60 rendered screens (`TRACEABILITY.md`, `traceability.json`).

| Evidence | FR-INV count |
| --- | --- |
| DEMONSTRATED | 56 |
| PARTIAL | 24 |
| ANNOTATED only | 4 |
| GAP | 6 (FR-INV-009, 010, 011, 013, 044, 055) |
| LATER | 5 |
| NO-UI (domain or service) | 15 |
| Total | 110 |

UI-INV-001..005 are designed in whole or part; UI-INV-006 Reorder / Low Stock has no dedicated screen. Screen states: LOADING, EMPTY, CONFLICT and INCOMPATIBLE_CLIENT are not shown; VALIDATION_ERROR and PERMISSION_DENIED are partial.

## 7. Authority audit (no gap resolved, no rule invented)

- **Ledger immutability:** shown as text ("cannot be edited or deleted", "Append-only", posted count read-only) and by the absence of edit controls; corrections use a compensating adjustment (25) or a new count (46). Not a behaviour demonstration.
- **Posting and recovery:** screens 26 and 59 show an uncertain posting with safe retry that reuses the operation reference; 24 and 43 show posted results.
- **Negative stock:** the Phase-1 BLOCK is shown (20, 21). The ledger contradicts it (finding F1).
- **Quantity and money precision:** whole EACH quantities only; WAC shown to two decimals; no fractional-UoM example and no frozen display-rounding rule (F5).
- **Permissions:** the design draws approve, cancel, opening-stock and cost-visibility flows that have no frozen operation or permission code (F6).
- **Decisions:** DEC-INV-003, 004, 005, 007 stay OPEN; DEC-INV-008 stays PROPOSED. Screen 48 shows count concurrency as two labelled examples and chooses neither.

## 8. Findings

Type: D = design defect to return to Claude Design; A = authority gap or question for the owner; C = coverage gap; X = export or documentation claim; O = observation.

| ID | Type | Sev | Finding | Screens |
| --- | --- | --- | --- | --- |
| F1 | D | high | Ledger contradicts the Phase-1 negative-stock BLOCK: posted ADJ-2026-00030 (out 5, running -3); -3 EACH on hand; the "Negative (historical)" origin is asserted, not defined. | 16 17 02 20 21 53 |
| F2 | D | medium | "Counts In Progress 2" does not reconcile with the count list. | 01 30 |
| F3 | D | medium | Count variance references and amounts are inconsistent (ADJ-... vs CNT-...; +3/-2 vs "+5 net"; movement dated before the posting time). | 16 30 43 46 47 |
| F4 | D | low | Batch history (+3 on 21 Sep) does not match the ledger (ADJ-2026-00041 +6 on 23 Sep). | 11 12 16 |
| F5 | A | medium | Display precision for cost and quantity is not defined (FR-INV-007, FR-INV-093). | 02 08 15 |
| F6 | A | high | Approve/reject (22, 41), cancel count (45), opening stock (27-29, DEC-INV-008 PROPOSED) and cost visibility (07, 15, 58) have no frozen operation or permission code. | 22 41 45 27 28 29 58 07 15 |
| F7 | C | medium | UI-INV-006 Reorder / Low Stock is not designed. | 03 |
| F8 | C | medium | LOADING, EMPTY, CONFLICT, INCOMPATIBLE_CLIENT missing; VALIDATION_ERROR and PERMISSION_DENIED partial. | all |
| F9 | O | low | An all-expired item is counted as available (DEC-INV-005 OPEN). | 02 14 |
| F10 | D | high | Accessibility structure absent (no form controls, tables, headings, live regions, dialog semantics); keyboard-only count posting not demonstrable. | all |
| F11 | D | high | Tables clipped at supported viewports; the "1280x720" reference screen clips; pill overflow. | 02 03 04 06 07 16 30 49 |
| F12 | D | medium | Contrast failures; "New Stock Count" white on light grey. | 01-08 17 22 30 49 57 |
| F13 | D | low | Grouped-page titles differ from the source registry. | 08 09 11 25 26 60 |
| F14 | D | low | Index links to a Back Office index that is not in the package. | index |
| F15 | X | low | Export manifest places the documentation on screen 60; it is on the Design System & Docs page. | 60 |
| F16 | X | medium | The package claims to reuse an approved Back Office shell; `docs/design/back-office` is review-ready, not approved. | docs page |
| F17 | C | high | No requirement identifier appears anywhere in the design. | all |

Full finding text is in `TRACEABILITY.md` and `traceability.json`.

## 9. Design guidance located by content

No file is named "design guidelines". The guidance is in:

- `docs/specifications/06-ui-specification/docs/01-DESIGN-SYSTEM.md` (visual direction, spacing, type, targets, semantic status tokens, shared components, form and table behaviour)
- `.../11-RESPONSIVE-WINDOW-BEHAVIOR.md`, `17-SCREEN-STATE-CONTRACT.md`, `18-COMMAND-AND-RECOVERY-CONTRACT.md`, `20-MONEY-QUANTITY-CONTRACT.md`, `24-ACCESSIBILITY-ACCEPTANCE-MATRIX.md`, `25-DOCUMENT-LIFECYCLE-PATTERN.md`, `07-KEYBOARD-ACCESSIBILITY.md`
- `AGENTS.md` and `docs/design/README.md` (authority model, statuses, render contract)
- Approved visual references: accounting, cash-shifts, customers, procurement, reports. back-office and pos are review-ready.

Genuinely missing: frozen palette or token values (01 says the palette is chosen at design review), a print or paper guideline for review packs, a display-rounding rule for cost and quantity.

## 10. Repository gates (in `D:/mm-inv`, on the 23-path candidate)

`pnpm design:validate` valid (8 manifests); `pnpm test:design-render` 17/17; prettier clean on changed files; `pnpm run ci` exit 0; `git diff --check` clean; `docs/specifications` and `docs/backlog` diff 0. The fidelity report keeps unrelated package evidence and timestamps; only the Generated header and the old Inventory placeholder changed.

## 11. Limitations

Static renders and one scripted keyboard pass; no screen-reader test; first-screenful renders for long pages; print checked by PDF page count and size only; no comparison with the earlier Inventory PDFs staged in the original checkout (not read, not part of this candidate); contrast measured on rendered DOM colours, not images.
