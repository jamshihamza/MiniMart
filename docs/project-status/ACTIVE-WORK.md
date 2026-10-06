# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: ACTIVE**

```text
Status: ACTIVE (workspace-host preview recorded as a WIP preservation checkpoint on
  wip/workspace-switch-adr; pushed to that branch only; owner visual approval of the switch PENDING)
Task: ADR 0009 (one application, separate POS and Back Office workspaces) and a bounded preview of
  the host, hash routes, workspace registry, a labelled host-level switch and a minimal Back Office
  placeholder. Preview only; no production behavior; not accepted.
Started From Commit: fcb253fa3e1624bd24fe980bc6c5f841cacda857 (tip of wip/visual-pos-ui, the pushed
  visual-only POS checkpoint)
Current Branch: wip/workspace-switch-adr (an isolated worktree in the original session). The
  checkpoint commit is the first commit after the base above and is not recorded here by SHA. It is
  pushed to origin/wip/workspace-switch-adr only. Nothing is merged into main.

Why this checkpoint exists: the owner authorized preserving all pending work on GitHub for a
  cross-PC handoff. That is preservation, not approval of quality, behavior or the switch design.
Active Agent / Machine: Claude Code, Office PC (informational, not a lock)

Owner review of the switch placement: the first candidate (floating at the bottom left) was
  rejected and is not recorded as approved. The replacement, a compact 32 px host header with the
  switch at the top right, is awaiting visual review and is not approved. While the header shows, POS
  has 32 px less height (host CSS, styles.css untouched); inspect=0 restores the full height.

Owner choices applied (2026-10-06): host-level menu outside the POS navigation (CR-0009-A stays
  unapplied); product name and bundle identifier unchanged; labelled preview-only workspace
  availability; Back Office-only counter identity and production unfinished-sale switching policy
  stay unresolved. Interpretations of the frozen wording are recorded in the ADR as not approved; a
  further change request, CR-0009-B, is proposed and not applied.

Required changes to bound POS files: apps/pos-terminal/src/App.tsx and flow.ts changed additively so
  the host can restore fictional POS state. The other 28 bound implementation files and the four
  preserved MM-008 files are byte-identical. provenance.json was not edited; the owner has not
  re-confirmed the two files. Hashes and the appearance evidence are in
  docs/phase-0/workspace-host-preview.md.

Files in the checkpoint: see "Changed files" in docs/phase-0/workspace-host-preview.md
  (the exact list, from git status). No frozen file, manifest, src-tauri file, scanner file or other
  worktree was touched.

Validation Already Run: POS suite 214 of 214 (177 unchanged plus 37 new host tests); header layout
  audit, 124 combinations, no overlap or page scroll, no newly clipped control; pnpm run ci;
  pnpm design:validate; Vite build; dependency-boundary check; 124 captures through the host
  compared with the unchanged POS server (122 identical, 2 differ by 2 to 3 pixels, noise); 93
  combination audit with 2,754 Tab stops, same findings as before. See the note for scope.

Not verified: native Tauri window, devices, assistive technology, remote CI, production security or
  runtime IPC isolation, production authorization, Back Office design approval.

Preview: pnpm --filter @minimart/pos-terminal exec vite --host 127.0.0.1 --port 1421 (from the mm-ws
  worktree root), then open http://127.0.0.1:1421/#/pos or http://127.0.0.1:1421/#/back-office.
  The original POS preview on port 1420 belongs to the mm-pos worktree.

Open for the owner: where production workspace availability is configured; counter identity for a
  Back Office-only installation; the switch's final visual design; unfinished-sale switching policy;
  re-confirmation of the two changed POS files; CR-0009-A and CR-0009-B; the Back Office visual-only
  exception (draft ADR 0007 on wip/visual-reporting-ui) and merge order. The Reporting WIP was not
  merged and ADR 0007 was not adopted.

Next Action: owner review of the preview and the ADR. A pull request, a merge and any further
  implementation each need separate owner authorization. Do not reset this file to Status: NONE until
  the record is closed.

Do Not Touch: docs/specifications, docs/backlog; the POS checkpoint branch and its worktree; the
  MM-008, MM-009 and MM-010 WIP branches and worktrees; the Reporting WIP worktree; the original
  checkout and its staged and untracked work; the paused Inventory worktree.

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
