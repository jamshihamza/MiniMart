# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: NONE**

No implementation task is in flight. When a task starts, replace this block with the
record described in the template below. When the task is complete, return this file
to `Status: NONE`.

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
