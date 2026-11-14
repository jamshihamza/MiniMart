# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

```text
Status: ACTIVE
Task: Inventory visual-reference acceptance (design handoff, revision v2 batch 4)
Started From Commit: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67
Updated At HEAD: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67
Current Branch: main
Active Agent / Machine: Claude (Cowork) / Office PC

Goal: register and validate the Inventory design source; approve only if every gate passes.

Completed:
- Archive MiniMart_Inventory_ClaudeDesign_Source_v2(batch4).zip verified; every packaged hash is in its manifest.
- Source registered byte-for-byte, SHA-256 48f47b59272038f50fabadca30d0863c823e21ff1564ca9dbfa75fb9ba397358; real support.js.
- Manifest set to review-ready, 67 screens (01-67).
- 67/67 RUNTIME-COMPLETE; four-viewport, clipping and contrast measurements recorded in RENDER-FIDELITY-REPORT.md.

Pending: a corrected Claude Design export. Not approved.

Files Intentionally Changed:
- docs/design/inventory/source/MiniMartInventory.dc.html (new)
- docs/design/inventory/source/support.js (new)
- docs/design/inventory/design-manifest.json
- docs/design/RENDER-FIDELITY-REPORT.md
- tools/design-render/report.mjs
- docs/project-status/ACTIVE-WORK.md
- docs/design/inventory/renders/* (gitignored)

Git Snapshot: the six files above unstaged/untracked; 27 pre-existing staged entries
(.design-package-index.json, Incoming/, Mockups/) and untracked Incoming/, output/, tmp/ left untouched.

Validation Already Run: design:validate (8 manifests) pass; design-render tests 17/17 pass and
render 67/67 (cloud workspace, pinned Chromium); frozen manifests 419 files, ownership, boundaries,
tsc pass; git diff --check pass.

Validation Remaining: FR-INV / UI-INV requirement audit; keyboard testing; re-run after a new export.

Known Failures / Blockers:
- `pnpm run ci` fails at Prettier and ESLint only on untracked output/pdf/ files that are not part of this task.
- New Stock Count button invisible on 02, 03, 04, 06, 49 (contrast 1.15:1).
- LAST MOVEMENT / REASON-REF columns clipped on 02-04, 06, 07, 16, 49 below 1920x1080.
- Accessibility structure still open per the export's own manifest.
- `pnpm design:report` on this PC drops the Reports table (no local reports diagnostics); the
  report was spliced by hand to keep it.

Approval-Gated Questions: none raised by this task.

Do Not Touch: staged Mockups/, Incoming/, .design-package-index.json; output/, tmp/.

Exact Next Action: send the three findings to Claude Design, then re-run this acceptance on the new export.

Last Updated: 2026-11-14

Handoff Notes: nothing committed or pushed.
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
