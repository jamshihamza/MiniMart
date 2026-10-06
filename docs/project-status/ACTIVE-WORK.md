# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: PAUSED**

```text
Status: PAUSED (owner-directed pause; no implementation task; design integration only; recorded
  as a WIP preservation checkpoint on wip/inventory-visual-candidate-paused)
Task: Inventory visual candidate integration and independent validation (batch 4,
  67 screens). Visual design review only. Not approved. No implementation started.
Started From Commit: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 (origin/main at start)
Updated At HEAD: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 (detached, isolated worktree)
Current Branch: wip/inventory-visual-candidate-paused. It was created at the detached HEAD above
  on 2026-10-06 to hold this candidate. The checkpoint commit is the first commit after the
  base and is not recorded here by SHA. It is pushed to that branch only. Nothing is merged into
  main, no design manifest is promoted, and the candidate stays unapproved.
Why this checkpoint exists: the owner authorized preserving all pending work on GitHub for a
  cross-PC handoff. That is preservation, not approval of the Inventory design, its quality or
  any implementation. The owner-directed pause still stands.
Active Agent / Machine: Claude Code, Office PC (informational, not a lock)

Goal: Register the Claude Design Inventory export as a review-ready, unapproved visual
  candidate, validate it independently against frozen authority, and return the
  results. Status stays review-ready; no approval promotion.

Completed:
  - Located and verified the exact archive MiniMart_Inventory_ClaudeDesign_Source_v2(batch4).zip
    (in Incoming/, SHA-256 1d36c2559a8ecdf13cfb31baa8e1203dc1627765f3bc2429639cb16b2bb326f3,
    100,269 bytes). Earlier exports (first, v2, v2 batch 3) preserved, not registered.
  - Registered 17 of its 18 files byte for byte under docs/design/inventory/source/.
    TRACEABILITY-v2.md deliberately not registered (fails the prettier gate).
  - Created docs/design/inventory/ design-manifest.json (review-ready, 67 screens),
    provenance.json, traceability.json, TRACEABILITY.md; added an Inventory section to
    the fidelity report generator and regenerated the report.
  - Validated: 67/67 RUNTIME-COMPLETE at all four viewports, grouped pages, links,
    print split (Combined 01-60 + New States 61-67), layout, accessibility structure,
    keyboard (row handlers, drawer), contrast, negative-stock blocking, cross-screen
    reconciliation, states 61-67, FR-INV traceability (110 requirements).
  - Gates: design:validate, test:design-render 17/17, pnpm run ci exit 0, frozen diff 0.
    git diff --check reports one error: blank line at EOF of the preserved upstream
    INVENTORY-REVISION-MANIFEST.txt. All four were re-run on 2026-10-06 before this checkpoint
    (test:design-render with the system Chrome path set) and gave the same results.

Pending:
  - Owner review of the validation results and the 24-path candidate allowlist.
  - Defects to return to Claude Design (see Known Failures) and a later revision.
  - Owner decisions on authority gaps (see Approval-Gated Questions).
  - A pull request or any merge to main (not authorized). Approval or promotion of the manifest
    status (not authorized).

Files Intentionally Changed (24-path candidate, plus this file):
  M docs/design/RENDER-FIDELITY-REPORT.md
  M docs/design/inventory/design-manifest.json
  M tools/design-render/report.mjs
  D docs/design/inventory/source/.gitkeep
  A docs/design/inventory/TRACEABILITY.md, provenance.json, traceability.json
  A docs/design/inventory/source/ : 17 files (14 .dc.html, support.js, doc-page.js,
    INVENTORY-REVISION-MANIFEST.txt)
  M docs/project-status/ACTIVE-WORK.md (this pause record; the 25th path)

Git Snapshot (isolated worktree, before the checkpoint commit):
  24 candidate paths: 20 added, 3 modified, 1 deleted, plus this file as the 25th. They were
  uncommitted (intent-to-add state in this worktree's own index) until the checkpoint. Rendered PNGs under docs/design/*/renders/ are
  gitignored and not part of the candidate.
  Original checkout: HEAD 1eb8e82, 27 protected staged entries (digest of
  path<TAB>index-blob<LF> = c7ac91711283565abda6ba071962cc8dadcc5025e123ecd9984a4a8dc7c11b64),
  tracked diff 0, 12 untracked archives in Incoming/. Not touched by this work.

Validation Already Run: see Completed.

Validation Remaining: re-run design:validate, test:design-render and pnpm run ci after
  any further edit; re-verify the source hashes in provenance.json against the
  registered bytes before any commit.

Known Failures / Blockers (design defects, to return to Claude Design):
  - Clipped tables on 02, 03, 04, 06, 07, 16, 30, 49 at 1280x720, 1366x768, 1368x800
    (30 also at 1920x1080).
  - "New Stock Count" button 1.14:1 (newCountBg never returned from renderVals).
  - Count variance chain inconsistent (ledger +5 vs list +1; ADJ-2026-00050/51); batch
    detail 12 shows 20 EACH vs 23.
  - Accessibility: no literal tables; untagged grids on 09-12, 30, 33-38, 44, 46, 50,
    61; no dialog/focus handling for drawers; inert controls and filter chips;
    nested-control click still opens rows; screen 05 has no h1.
  - Print headers of 08, 09, 11, 25, 26, 60 keep old titles; TRACEABILITY-v2.md does
    not match the screens (13 rows); revision manifest is cumulative and stale.

Approval-Gated Questions (owner only; not resolved here):
  - Approve/reject, cancel-count, opening-stock and cost-visibility flows have no
    frozen API operation or permission code.
  - Display precision for cost and quantity (FR-INV-007, FR-INV-093).
  - DEC-INV-003, 004, 005, 007 OPEN; DEC-INV-008 PROPOSED.
  - FR-INV-009/010/011/013 versus DEC-INV-002/010 (Phase 1 BLOCK).
  - Whether to register TRACEABILITY-v2.md (needs a .prettierignore change).
  MM-007 physical validation remains PENDING; DEC-HW-001 remains OPEN.

Do Not Touch: docs/specifications, docs/backlog; the original checkout, its 27 staged
  entries and untracked archives; the preserved upstream bytes in the candidate
  source folder and Incoming/; unrelated MM-007 / POS / Rust / printer work.

Exact Next Action: when resumed, read this file, verify it against Git on the branch above (parent
  1eb8e82, 24 candidate paths plus this file in the checkpoint), then ask the owner whether to
  (a) send the defect list to Claude Design for a revision, (b) accept the candidate as is for a
  validated checkpoint to main (needs explicit authorization), or (c) drop it. Do not promote,
  approve or merge without that instruction.

Last Updated: 2026-10-06

Handoff Notes: The review package (report, traceability, previews, print PDFs, allowlist) was
  saved outside the repository on the Office PC. A copy of it, and the other review packages and
  analysis files, is preserved on the handoff branch wip/cross-pc-handoff-2026-10-06 under
  handoff-material/inventory, with a provenance index. Scratch scripts were session-only.
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
