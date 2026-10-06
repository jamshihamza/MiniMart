# Handoff material (scratch evidence, preserved verbatim)

> **Preservation only. Not product authority and not accepted evidence.** Files here were copied from
> the Office PC's scratch locations on 2026-10-06 so they survive a PC switch. They are working
> notes, drafts, logs, scripts and review evidence with no standing in the frozen authority model.
> Do not merge this branch. Read `docs/project-status/CROSS-PC-HANDOFF-2026-10-06.md` first.

Files were copied unchanged (binary files byte for byte; Git normalizes line endings of text files to LF). Scripts, logs and some JSON contain local absolute paths from the
Office PC (drive letters, sibling worktree names). Edit the path constants before reusing a script
on another PC. Nothing was sanitized except by exclusion: no secrets, credentials, `.env` files,
certificates, local databases, dependency trees, build caches or bulk render output were copied.
Every file was scanned for secret patterns and unsafe file names before the commit. The one scan hit
is the public placeholder URL `postgresql://postgres:postgres@...` in an error message
(`mm008-mm009-mm010/verification/sync-proof-full-run.log`), which is the same placeholder as in
`.github/workflows/ci.yml`.

## Map (source on the Office PC, destination, what it is)

"Scratch" is the scratch directory named `mm-scratch`. "Root" is the root of the data drive. Names
below are the folder or file names there.

| Destination | Source | What it is and how to read it |
| --- | --- | --- |
| `pos-and-workspace/scripts/` | scratch `*.mjs`, `*.py`, `dr-tests.sh` | Playwright capture, pixel-diff, browser audit and layout-audit scripts, the implementation-hash and secret-scan tools. They need Playwright with system Chrome. Hard-coded paths and ports (1420 original POS preview, 1421 workspace preview, 8766 reference server) must be adapted. |
| `pos-and-workspace/evidence/ws-header-before-after/` | scratch `ws-review/` | Before (rejected bottom-left switch) and after (top-right host header) screenshots at 1366x768 and 1280x720, plus side-by-side composites. The owner rejected the bottom-left candidate. The header candidate is not approved. |
| `pos-and-workspace/evidence/pos-side-by-side-1366x768/` | scratch `posshots/possbs-*-1366x768.png` | Reference vs implementation side by side for the 31 POS screens at 1366x768. The other 93 captures per set are reproducible with the scripts and were not copied. |
| `pos-and-workspace/evidence/earlier-sale-preview/` | scratch `shots/` | Early Sale-screen reference and implementation screenshots from the preview the owner first reviewed. |
| `pos-and-workspace/lists/` | scratch `paths38.txt`, `allow.txt`, `ws-files.txt`, `impl-pre.json`, `orig-inventory.json` | The 38-path POS candidate allowlist, the 20-path workspace allowlist, the implementation hash record taken before the host change, and the inventory of the original checkout's pending files (size, SHA-256, blob id, duplicates). |
| `pos-and-workspace/messages/` | scratch `*-commit-msg.txt` | The commit messages used for the POS, workspace, Reporting, Inventory, original-checkout and MM-010 checkpoints. |
| `pos-and-workspace/design-render-baseline/` | scratch `dr-*` | Outputs of the design-render baseline comparison between the untouched MM-008 worktree and the POS worktree (test names, TAP output, normalized text, diffs). |
| `mm008-mm009-mm010/drafts/` | scratch `DRAFT-ADR-*.md` | Two draft ADRs that were never proposed: the scanner input boundary (MM-008) and the MM-009 raster dependencies and fonts. Drafts only. They do not resolve any decision. |
| `mm008-mm009-mm010/verification/` | scratch `MM009-verification-package.md`, `check-rust-009*.log`, `ci-009.log`, `ci-010.log`, `pnpm-install-*.log`, `sync-proof-full-run.log`, `vis-ci.log`, `inv-ci-now.log`; root `mm-impl-*.log` | Verification notes and raw command output. `sync-proof-full-run.log` is a run made before Docker was available: every PostgreSQL test was skipped, so it is NOT validation evidence. `vis-ci.log` records the Reporting branch failing the Prettier check. `inv-ci-now.log` is the Inventory candidate's passing CI run. `mm-impl-tauri.log` is a `tauri dev` run in the MM-008 worktree: it compiled and started the native executable and ended with exit code -1 (the process was stopped); it records no scanner or WebView2 acceptance. `mm-impl-vite.log` shows a second Vite start failing because port 1420 was already in use. |
| `mm008-mm009-mm010/previews/` | scratch `mm009-previews/` | MM-009 raster output samples (PBM and PNG) from fictional text. |
| `inventory/review-package-b4/`, `review-package-earlier/` | root `mm-inv-review-package-b4`, `mm-inv-review-package` | The Inventory validation report, traceability, allowlist, page previews and print PDFs for batch 4, and an earlier package. Read `VALIDATION-REPORT.md` first. Status: review-ready candidate, unapproved, paused. |
| `inventory/analysis/`, `inventory/logs/`, `inventory/mm-inv-allowlist2.txt` | root `mm-inv-*.json`, `mm-inv-*.log`, `mm-inv-allowlist2.txt` | Raw analysis (text, DOM, layout, FR-INV mapping, screen notes, open decisions) and command logs behind the validation report. |
| `inventory/v1-integration-attempt/` | root `mm-inv-v1-integration` | An earlier integration attempt's manifest, provenance and traceability files. |
| `inventory/MiniMart_Inventory_Revision_Handoff.zip` | root of the same name | A revision handoff archive for Inventory sent to or received from Claude Design. |
| `reporting/review-package-v1/`, `-v2/`, `-v3/`, `v4-index.png` | root `mm-rpt2-review-package*` | Review packages for the Reporting V2 design validation (the approved Reporting package is on `main`). |
| `reporting/*.json`, `reporting/logs/` | root `mm-rpt*-layout.json`, `mm-rpt*-ci.log`, `-install.log`, `-render-all.log` | Layout data and command logs for the Reporting validation. |
| `claude-design-handoffs/` | root `mm-claude-design-handoff.zip`, `mm-cd-export`, `mm-cd-export-v2` | The first design handoff package sent to Claude Design and the first raw Reporting exports. |
| `original-checkout-protection/` | root `mm-preserve/` | Lists, hashes and status snapshots taken while the original checkout's staged work was first protected (2026-10-04). |

## Not copied (still only on the Office PC, reproducible or out of scope)

- Font files (`fonts/`, about 136 MB), MM-009 experiment and solo output trees (`mm009-exp`, `mm009-solo`,
  about 550 MB): bulk, reproducible, and font redistribution needs a licence decision.
- The other POS capture sets (`posshots` beyond the 1366x768 side-by-sides, `posbase`, `posws`,
  `posws2`, `posrerun`): reproducible with the scripts.
- Per-viewport design renders (`mm-inv-render-*`, `mm-rpt-render-*`, `mm-rpt2-render-*`), extracted
  archives (`mm-inv-export*`, `mm-inv-handoff`, `mm-cd-handoff`, `mm-claude-design-handoff`,
  `mm-rpt2-pages`, `mm-rpt2-long`, `mm-inv-pages`, `mm-inv-print*`): generated or extractions of files that
  are preserved elsewhere.
- One-off edit scripts (`aw-*.py`, `doc-*.py`, `fix9.py`, `header-docs.py`, ...), template and block
  files used to write handoffs, intermediate JSON duplicates, extracted reference scripts
  (`pos-script.js`, `rpt-script.js`, `*-template.html`, `flow.css`), `*.bak` copies and the temporary
  index used for the original-checkout commit.
- Local dependency trees, build output, Rust `target` directories, the ignored design renders and PDF
  exports under `docs/design/*`, and `infra/mm-006/dev-certificates/` (development certificates, kept
  local on purpose).
