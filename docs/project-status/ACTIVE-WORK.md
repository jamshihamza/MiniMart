# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

```text
Status: NONE
Task: none in progress

Last completed: working demonstration slice (`pnpm demo`), provisional decisions in
docs/adr/0006-working-demonstration-slice.md. Committed locally on main; pushing is the owner's step.

Open follow-ups (not active work):
- Owner review of ADR 0006 (every row is provisional).
- Inventory design package is review-ready, not approved: New Stock Count button invisible on
  02, 03, 04, 06, 49; LAST MOVEMENT / REASON-REF columns clipped on 02-04, 06, 07, 16, 49;
  accessibility structure open. Needs a corrected Claude Design export.
- Office PC: `pnpm run ci` fails at Prettier/ESLint only on untracked output/pdf/ files.

Do Not Touch: staged Mockups/, Incoming/, .design-package-index.json; output/, tmp/.

Last Updated: 2026-11-14
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
