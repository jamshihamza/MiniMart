# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: ACTIVE**

```text
Status: ACTIVE (WIP preservation checkpoint; incomplete; owner review not recorded)
Task: Reporting visual-only implementation, first representative slice, in apps/backoffice. Governed
  by ADR 0007 on this branch (bounded Phase-0 visual-only exception, owner
  approval stated in the working session). Software-only. NOT accepted.
Started From Commit: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 (origin/main at the time)
Current Branch: wip/visual-reporting-ui
Active Agent / Machine: Claude Code, Office PC (informational, not a lock)

Why this checkpoint exists: the owner authorized preserving all pending work on GitHub so it can
  continue on another PC. That is preservation, not approval of quality or behavior.

What exists: a React + Vite visual-only Back Office host in apps/backoffice with a hash router, an
  application shell, design primitives, a state inspector, a Reports Home screen and one report
  viewer (daily sales), all with fictional data. The dev server uses port 1430. A text search found no fetch, Tauri invoke,
  XMLHttpRequest or WebSocket use in apps/backoffice/src; no automated test enforces it.

Known gaps and failures, observed at checkpoint time (this record was written before the commit):
  - Prettier check FAILS on 5 files: apps/backoffice/src/App.tsx, components/Primitives.tsx,
    reports/ReportsHome.tsx, reports/ReportViewer.tsx and shell/AppShell.tsx. Not fixed here.
    pnpm run ci therefore exits 1 on this branch.
  - The apps/backoffice test script FAILS: no test file exists (only test/setup.ts), although ADR 0007
    describes component tests. No test was written or run for this slice.
  - Passing at checkpoint: tsc -b (apps/backoffice typecheck), ESLint on apps/backoffice, and the Vite
    production build.
  - docs/phase-0/visual-ui-reporting.md, which ADR 0007 names for fidelity evidence, was never
    written. No fidelity comparison or pixel diff against the Reporting reference was recorded for
    this slice, and no owner visual review of it is recorded.
  - Only the first slice exists. Reporting screens beyond Reports Home and the daily-sales viewer,
    and the other four approved packages named in ADR 0007, are not started.
  - This branch is based on origin/main, not on the POS or workspace-host work. The workspace-host
    branch (wip/workspace-switch-adr) also edits apps/backoffice/package.json, tsconfig.json and
    pnpm-lock.yaml, so combining them needs a deliberate merge. Nothing was merged or adopted.

Files intentionally changed (3 modified, 26 new; nothing is staged):
  modified apps/backoffice/package.json, apps/backoffice/tsconfig.json, pnpm-lock.yaml
  new      docs/adr/0007-bounded-phase-0-visual-only-ui-exception.md and the files under
           apps/backoffice (index.html, vite.config.ts, test/setup.ts, src/main.tsx, App.tsx,
           router.ts, resolve.ts, components/, preview/, reports/, shell/, styles/)
  modified docs/project-status/ACTIVE-WORK.md (this record)

Next Action: owner review of the Reporting slice in the browser (pnpm --filter @minimart/backoffice
  dev, port 1430). Then decide: fix formatting, add the component tests ADR 0007 describes, write the
  fidelity note and compare against the approved reference, and settle the merge order with the
  workspace-host branch. Commit to main, a pull request and further modules each need owner
  authorization. Do not reset this file to Status: NONE until the task closes.

Do Not Touch: docs/specifications, docs/backlog; design manifests and approval records; the POS,
  MM-008, MM-009 and MM-010 branches; the original checkout and its preservation branch.

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
