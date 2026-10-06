# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: ACTIVE**

```text
Status: ACTIVE (visual-only POS, 31 of 31 reference screens implemented; owner approved the visual
  implementation 2026-10-06; recorded as a WIP checkpoint commit on wip/visual-pos-ui, pushed to that
  branch only; not on main)
Task: Visual-only frontend implementation of the owner-approved POS reference. Governed by ADR 0008
  (bounded Phase-0 exception). Software-only. NOT accepted as product functionality. No PR exists and nothing is merged.

GIT STATE (verified when this record was written, 2026-10-06)
  Branch: wip/visual-pos-ui, in an isolated worktree that is a sibling directory named mm-pos.
  Base (started from): a30a1490b5d07e3c7ec45debd44bfa898421fb40 = tip of wip/mm-008-scanner-spike,
    itself on 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 (= origin/main).
  Checkpoint: a single WIP commit on top of the base, containing exactly the 38 paths below. This
    file is part of that commit, so it does not record the commit's own SHA; read it with git log
    on wip/visual-pos-ui (parent is the base above) and compare with origin/wip/visual-pos-ui.
  Pushed to origin wip/visual-pos-ui only. No pull request. Nothing merged into main.
  Paths in the checkpoint: exactly 38 (10 modified, 1 deleted, 27 new), listed below.

Paths in the checkpoint commit (as git status listed them before the commit):
    modified apps/pos-terminal/index.html
    modified apps/pos-terminal/src/App.tsx
    deleted  apps/pos-terminal/src/components/ShellControls.tsx
    new      apps/pos-terminal/src/components/StubButton.tsx
    new      apps/pos-terminal/src/dialogs/Dialog.tsx
    new      apps/pos-terminal/src/dialogs/DialogHost.tsx
    new      apps/pos-terminal/src/dialogs/PaymentDialogs.tsx
    new      apps/pos-terminal/src/dialogs/SaleDialogs.tsx
    new      apps/pos-terminal/src/fixtures-flow.ts
    modified apps/pos-terminal/src/fixtures.ts
    new      apps/pos-terminal/src/flow.ts
    new      apps/pos-terminal/src/pages/HistoryPage.tsx
    new      apps/pos-terminal/src/pages/ReturnsPage.tsx
    new      apps/pos-terminal/src/pages/ShiftPage.tsx
    new      apps/pos-terminal/src/preview.ts
    new      apps/pos-terminal/src/sale/CartPanel.tsx
    new      apps/pos-terminal/src/sale/ProductBrowser.tsx
    new      apps/pos-terminal/src/sale/SalePage.tsx
    new      apps/pos-terminal/src/sale/SearchResults.tsx
    new      apps/pos-terminal/src/screens.ts
    new      apps/pos-terminal/src/shell/PreviewInspector.tsx
    new      apps/pos-terminal/src/shell/Sidebar.tsx
    new      apps/pos-terminal/src/shell/TopBar.tsx
    modified apps/pos-terminal/src/styles.css
    modified apps/pos-terminal/test/App.test.tsx
    new      apps/pos-terminal/test/fixtures-flow.test.ts
    new      apps/pos-terminal/test/fixtures.test.ts
    new      apps/pos-terminal/test/flow.test.tsx
    new      apps/pos-terminal/test/preview.test.tsx
    modified apps/pos-terminal/test/scanner-shell.test.tsx
    new      apps/pos-terminal/test/screens.test.tsx
    new      docs/adr/0008-bounded-phase-0-visual-only-pos-ui-exception.md
    modified docs/design/RENDER-FIDELITY-REPORT.md
    modified docs/design/pos/design-manifest.json
    new      docs/design/pos/provenance.json
    new      docs/phase-0/visual-pos-screens.md
    modified docs/project-status/ACTIVE-WORK.md
    modified tools/design-render/report.mjs
  Unchanged and must stay so: apps/pos-terminal/src/scanner-input.ts, test/scanner-input.test.ts,
  test/scanner-fixtures.ts, src/connectivity.ts, docs/specifications, docs/backlog, pnpm-lock.yaml,
  every package.json. No dependency was added.

IMPLEMENTATION: 31 of 31 reference screens, ids 01 to 30 plus 02b
  Registry: apps/pos-terminal/src/screens.ts. The coverage list with the address for each screen is
  docs/phase-0/visual-pos-screens.md. test/screens.test.tsx reads
  docs/design/pos/design-manifest.json and fails if the registry differs in number, name or group,
  and renders every screen to check its content.
  Fictional data only. Buttons that open a reference dialog or swap a fictional state work locally;
  every other control is an identified stub (dashed outline, aria-disabled, "not implemented"
  notice). Totals, change, refunds and differences are fixed strings; nothing is calculated,
  posted, stored or sent. No device, printer, card terminal or provider is used.

APPROVAL, RUNTIME AND ADR
  Approved source: docs/design/pos/source/MiniMartPOS.dc.html, 117,821 bytes, SHA-256
    cdbcd1e0fc5d4d66da6fdac9101c7611fad327709443bbbc6bfec07389ab44e6 (recomputed at handoff; bytes
    unchanged). Owner visual approval recorded 2026-10-06 in docs/design/pos/design-manifest.json
    (status approved-visual-reference), docs/design/pos/provenance.json and a POS section in
    docs/design/RENDER-FIDELITY-REPORT.md and tools/design-render/report.mjs. Visual authority only.
    The supplementary POS files do not inherit it.
  Reference runtime used for comparison: docs/design/procurement/source/support.js, SHA-256
    8fe7df74405f3c55f49b7249c74ea1397e65d07dea2b1bd3b4a489bec2e28cbe, unchanged, used from a scratch
    copy outside the repository because the POS package does not ship support.js.
  ADR 0008 (docs/adr/0008-bounded-phase-0-visual-only-pos-ui-exception.md) records the exception
    and its limits. It is on this branch only. 0006 exists on wip/mm-009-raster-spike and a draft
    0007 on wip/visual-reporting-ui, so 0008 avoids a number clash.
  docs/project-status/CURRENT-STATE.md still lists POS as review-ready and is stale; not edited.

OWNER REVIEW STATUS (precise)
  The owner visually reviewed the EARLIER SALE PREVIEW (shell and Sale screen, empty and populated
  cart, list view, Store Node offline, cloud banner, loading) and said they were satisfied. That
  acceptance covers that preview only.
  UPDATE 2026-10-06: the owner then reviewed and approved all 31 implemented screens (01 to 30 plus
  02b). This is recorded separately from the design source approval in docs/design/pos/provenance.json
  (implementationApproval), bound to the reference source hash, the SHA-256 of the 30 implementation
  files (digest 14c2b703df41642a9b3e3fa77d933b3e848e029cd13b231e56a9527ad2f30108) and the exact
  38-path candidate list (digest 55a92b39afcc32f539a32e63d930afdfe1f6668bd5c1f089ec867145de6fc10f).
  Precisely: all 31 POS visual screens are owner-approved. Production and business functionality,
  MM-008 acceptance, native validation and remote CI remain incomplete. The approval does not accept
  any MM item. The owner later separately authorized the WIP checkpoint commit and a push of
  wip/visual-pos-ui only. No approved UI file was changed to record it; the candidate list is the
  same 38 paths.

OBSERVED VALIDATION (what was run, and its scope)
  - POS suite: 9 files, 177 of 177 tests passed (102 inherited from the MM-008 checkpoint plus 75
    new). jsdom component tests plus pure-module tests; no real browser, device or native window.
  - Checkpoint re-run 2026-10-06 on the bound bytes: POS suite 177 of 177, Vite build, pnpm run ci,
    pnpm design:validate (8 manifests), test:design-render with system Chrome 17 of 17, the 124 side-
    by-side captures, the pixel comparison (mean 1.09 percent) and the 93-combination, 2,754-stop
    browser audit. Reused earlier evidence: the reference-side PNGs and the design-render baseline
    comparison against the MM-008 worktree (reference source, runtime and tools/design-render are
    unchanged). At 1280x720 the audit also clips the CUSTOMER header on screens 17 and 28, the same
    History-detail overflow as STATUS.
  - Gates passed: tsc typecheck, ESLint, Prettier check, pnpm run ci, the Vite production build and
    pnpm design:validate (8 manifests). CI on GitHub has NOT run.
  - Reference comparison: 124 side-by-side screenshots (31 screens x 1366x768, 1280x720, 1368x800,
    1920x1080), reference vs implementation, captured with Playwright and system Chrome. No console
    or page errors. Content-area pixel diff (sidebar and top bar excluded): mean 1.09 percent,
    median 0.96, worst 2.87 percent (screen 17, from dashed stub outlines). This measures visual
    similarity of the captured pages only; it is not a fidelity certification.
  - Browser audit: 93 screen and viewport combinations (31 screens x 1366x768, 1280x720, 1920x1080)
    and 2,754 Tab stops: accessible names, one main and one status region, one h1 per screen, no
    horizontal page overflow, visible focus ring on every stop, dialogs labelled and aria-modal with
    focus inside, Tab never leaves a dialog or reaches an inert element. Automated DOM checks, not
    a screen-reader or assistive-technology test.

DESIGN-RENDER BASELINE COMPARISON
  Command: pnpm run test:design-render (18 tests).
  Without a browser path, 12 of 18 fail identically in the untouched MM-008 worktree and in this
  one, by test name, status and failure text (after normalizing the worktree name and one
  total-duration line). Cause: Playwright's bundled headless Chromium is not installed here
  ("Executable doesn't exist").
  With the environment variable MINIMART_DESIGN_BROWSER_PATH set to the system Chrome executable,
  both worktrees pass 17 of 17 and their outputs are identical.
  No test touches tools/design-render/report.mjs and it builds, so that change introduces no failure.

SCANNER PRESERVATION (MM-008 acceptance stays INCOMPLETE)
  scanner-input.ts, test/scanner-input.test.ts (52 tests) and test/scanner-fixtures.ts are
  unchanged. In src/App.tsx the scanner helpers, the Store Node probe effect, the capture-phase
  scanner effect, the F2 effect and showUnavailableSearch are byte-identical to a30a149 (checked by
  extraction and comparison). test/scanner-shell.test.tsx keeps all 42 tests and every behavioral
  assertion. Exactly two selectors changed because the approved design lacks the old controls:
    1. "stops a terminator from activating a focused button": the old "Search" submit button is now
       the "Note" button (same focus, key-event and Enter-consumption assertions).
    2. "does not resume a half-finished scan after leaving and returning to the Sale page": the old
       "Back to sale" button is now the "Sale" navigation entry (scan assertions unchanged).
  Inherited and still pending: native WebView2 and physical-scanner acceptance, the provisional
  50 ms burst threshold, browser F-key default-action isolation, MM-007 physical validation
  (DEC-HW-001 OPEN).

KNOWN LIMITATIONS
  - Everything is fictional presentation: no real sale, payment, card, QR, refund, receipt, shift
    close, calculation, persistence, API call or sync. Devices read "Not tested" on purpose.
  - Fonts load from the Google Fonts CDN, as the reference does. Bundling fonts for offline use is an
    open decision. The stylesheet no longer imports Tailwind; the Tailwind packages remain
    installed and unused.
  - No native Tauri window was launched for this work. No physical scanner, printer, drawer or card
    terminal was used. No remote CI has run.
  - Layout quirk inherited from the reference: with the History detail pane open the grid has a
    0 px tender track, so the STATUS header and status pills overflow it visibly (screens 17, 28).
    At 1280x720 the CUSTOMER header on those two screens is clipped as well. Accepted limitation.

PREVIEW AND EVIDENCE
  Start (from the mm-pos worktree root): pnpm --filter @minimart/pos-terminal dev
  URL: http://127.0.0.1:1420/ (port 1420 is strict; stop any other server on it first).
  At handoff the server was running and returned HTTP 200. It stops when the session ends.
  Parameters: ?screen=<id> opens a reference screen (01 to 30, and 02b). Add &node=online to show
  the reference's online pill (labelled simulated), &sync=down for the cloud banner variant,
  &inspect=0 to hide the preview control. Also ?cart=populated, ?view=grid, ?loading=1. The
  "Fictional data . Preview states" button at bottom right links to all 31 screens.
  Evidence files (NOT in the repository, not committed, may be lost): the scratch directory named
  mm-scratch next to the worktrees. posshots/ holds the captures (posref-*, posimpl-* and possbs-*
  files per screen and viewport, 372 files at handoff). Capture and audit scripts: capture-pos-ref.mjs,
  capture-pos-impl.mjs, pixdiff.mjs, pos-a11y-all.mjs, plus pos-ref/ (the scratch reference copy and
  runtime) and cols.mjs. They need the preview on port 1420 and a reference server on port 8766
  (python -m http.server 8766 --bind 127.0.0.1 --directory pos-ref). Regenerate them if missing.

PROTECTED STATE AND OTHER WORKTREES
  Original checkout: on main at 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 (= origin/main), 27 staged
    entries, protected digest c7ac91711283565abda6ba071962cc8dadcc5025e123ecd9984a4a8dc7c11b64
    (SHA-256 of path<TAB>index-blob<LF>, C-locale git diff --cached --name-only -z order),
    0 tracked changes, 12 untracked archives. Not touched.
  wip/mm-008-scanner-spike a30a1490b5d07e3c7ec45debd44bfa898421fb40, local = remote, worktree mm-impl
    clean.
  wip/mm-009-raster-spike 5f4cf1c0cd83de9e8e1a3125f59e6ca5f76eb7f8, local = remote.
  wip/mm-010-sync-proof 92421f0303718fe62adbb48297f1604e4288ad76, committed and pushed earlier at the
    owner's direction; local = remote; worktree mm-010 clean; acceptance INCOMPLETE.
  reports-visual-design 8e842678dd3482509aafd48106488408087daaf0, local = remote.
  wip/visual-reporting-ui (worktree mm-vis): separate Reporting visual-UI work, local only, 29 changed
    paths uncommitted, ADR 0007 draft there. Unrelated to this branch; its dev servers stopped when
    the earlier session ended. It was not touched by this task.
  Inventory stays paused and unapproved. POS and Back Office manifests other than the owner-approved
    POS record are unchanged.

OWNER DIRECTION RECEIVED, NOT implemented, NOT included in this checkpoint
  Direction given by the owner: one application with separate POS and Back Office workspaces and a
  toggle between them (POS and Back Office workspace switching). It has no ADR or change record and
  its implementation is pending.
  Record check: no ADR or change record exists for it. Searched docs/adr, docs/phase-0 and
  docs/project-status on every local and remote-tracking branch; the only ADRs are 0001 to 0005 on
  main, 0006 (MM-009 branch), 0007 (draft, Reporting WIP) and 0008 (this branch, about the visual
  exception only). Status: PENDING. It must go through the controlled ADR or change process first,
  because the frozen Architecture v1.0 structure names apps/pos-terminal and apps/backoffice as
  separate applications and AGENTS.md puts architecture decisions behind explicit owner direction.
  No consolidation work was started and no application code was changed for it.

Next Action:
  1. Verify against Git: branch wip/visual-pos-ui equals origin/wip/visual-pos-ui, its parent is the
     base above, the commit holds exactly the 38 paths, the worktree is clean, and the committed
     implementation blobs still match the digest in provenance.json.
  2. A pull request, a merge to main, any acceptance claim and the workspace-switching decision each
     need separate owner authorization. Workspace switching needs an ADR or change record first.
  3. Native Tauri validation, MM-008 acceptance work and remote CI remain open.
  Do not reset this file to Status: NONE until the checkpoint is closed.

Do Not Touch: docs/specifications, docs/backlog; the MM-008, MM-009 and MM-010 WIP branches and
  worktrees; the original checkout and its staged and untracked work; the paused Inventory
  worktree; the Reporting WIP worktree; production schema, migrations, sync, transport and launcher
  code.

Last Updated: 2026-10-06
```

## Rules

- **Verify against Git first.** Compare `Started From Commit` and `Updated At HEAD`
  with the real history, `Files Intentionally Changed` and `Git Snapshot` with the
  real `git status`, and the age in `Last Updated`. Any mismatch means the record is
  stale: report it to the owner instead of trusting it.
- **Update at useful milestones**, and before any long-running command or planned
  stop. Not after every edit. If an agent is cut off, the next agent works from Git;
  this file is only a hint.
- **Active Agent / Machine is informational. It is not a lock.** The actual rule is
  that only one agent may actively modify a logical task and working tree at a time.
- **Never resolve decisions here.** `Approval-Gated Questions` are pending questions
  for the owner. Answers belong in the proper authority (ADR, change request or
  Decision Register process), then the question is removed.
- **Same-PC agent switch:** this file may stay uncommitted. The incoming agent reads
  it from the working tree.
- **Cross-PC handoff of incomplete work:** this file must be included in the pushed
  `wip/<task>` handoff. See `AGENT-HANDOFF.md`.
- **Completion:** reset to `Status: NONE` in the same change that completes the task.
- No secrets, credentials, local absolute paths or conversation transcripts.

## Template

```text
Status: ACTIVE
Task:
Started From Commit:
Updated At HEAD:
Current Branch:
Active Agent / Machine:

Goal:

Completed:

Pending:

Files Intentionally Changed:

Git Snapshot:
  (staged / unstaged / untracked file list and counts at update time)

Validation Already Run:

Validation Remaining:

Known Failures / Blockers:

Approval-Gated Questions:

Do Not Touch:

Exact Next Action:

Last Updated:

Handoff Notes:
```
