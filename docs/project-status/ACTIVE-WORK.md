# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: ACTIVE**

```text
Status: ACTIVE (MM-009 incomplete software-only checkpoint on a WIP branch; owner review pending)
Task: MM-009 non-Latin raster receipt spike, software part only. Acceptance is INCOMPLETE:
  the physical evidence Architecture 33 Spike C requires, on the exact pilot printer, does not
  exist.
Started From Commit: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 (origin/main at the last check)
Updated At HEAD: this record describes the tip of wip/mm-009-raster-spike (one checkpoint commit
  on top of 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 = origin/main at the last check); read the
  tip with git log
Current Branch: wip/mm-009-raster-spike (isolated worktree, a sibling of the other checkouts),
  pushed to origin/wip/mm-009-raster-spike; main was not updated
Active Agent / Machine: Claude Code, Office PC (informational, not a lock)

Goal: Prove in software that a pure, bounded Rust renderer can shape and rasterize Malayalam and
  Latin/Malay text with fallback fonts, using fictional fixtures. No printer, protocol, paper
  profile, production default, pilot language or renderPayload meaning is chosen (DEC-HW-001 stays
  OPEN).

Completed: ADR 0006 records the owner-approved stack (rustybuzz =0.20.1, ab_glyph_rasterizer
  =0.1.10, two unmodified Noto Regular fonts bound to SHA-256 hashes). Renderer in
  crates/hw-printer (raster module, heuristic wrap guard, 42 tests), font fixtures with OFL texts
  and provenance, third-party notices, both lockfiles, spike document. Committed and pushed to the
  WIP branch only (owner-authorized); nothing was merged to main.

Pending: owner review of the diff; any commit or push (not authorized); everything physical
  (readability, width, speed, feed/cut, failure behavior on the exact pilot printer); the
  unresolved licence questions in the spike document and ADR; DEC-HW-001.

Files Intentionally Changed (new files show as intent-to-add only; nothing is staged):
  docs/adr/0006-mm-009-raster-renderer-dependencies-and-fonts.md (new)
  docs/phase-0/mm-009-raster-receipt-spike.md (new)
  docs/project-status/ACTIVE-WORK.md (this record)
  crates/hw-printer/Cargo.toml, src/lib.rs
  crates/hw-printer/src/raster.rs, raster/guard.rs, raster/tests.rs (new)
  crates/hw-printer/THIRD-PARTY-NOTICES.md (new)
  crates/hw-printer/tests/fixtures/mm009/fonts/ (two TTFs, OFL texts, AUTHORS, CONTRIBUTORS,
    FONTS.md; new)
  Cargo.lock, apps/pos-terminal/src-tauri/Cargo.lock

Git Snapshot: one checkpoint commit of exactly 19 paths on wip/mm-009-raster-spike; the worktree is
  clean after it. Frozen docs/specifications and docs/backlog diff: 0. The MM-008 WIP branch (wip/mm-008-scanner-spike) and the original checkout's protected
  staged work were not touched by this task.

Validation Already Run (do not repeat unless code changes):
  - pnpm run check:rust exit 0: root and Tauri fmt, check, test and clippy (pedantic, warnings
    denied), all with --locked. hw-printer 46 tests (42 new, 4 existing), Tauri crate 4 tests. Rerun after the
    pre-checkpoint review fixes; pnpm run ci last ran before them.
  - Mutation checks on the renderer, each caught by the tests and reverted: guard off, ink check
    off, indivisible-unit check off, metrics from the first font only, left padding off, reversed
    fallback order, unchecked height multiplication, off-by-one memory and character limits,
    empty-input rule weakened, font-sequence rule off, bidi controls allowed, glyph and
    outline budgets off, glyph records dropped from the memory sum.
  - Software previews (scratch, outside the repository) checked by eye.
  - See the spike document for the pnpm run ci result.

Whitespace: three verbatim vendor files carry original whitespace that git diff --check reports and
  that was deliberately not edited: trailing whitespace on line 21 of both OFL text files, and a
  blank line at the end of AUTHORS.txt (all under crates/hw-printer/tests/fixtures/mm009/fonts/).
  Authored files are whitespace-clean. No repository-wide check was changed or weakened.

Known Gaps: no physical evidence; guard is a heuristic checked on a few fixtures; golden hashes
  recorded on one platform; Unicode-data and libm notice questions unresolved.

Approval-Gated Questions (owner; nothing here is decided): printer model and paper profile
  (DEC-HW-001); command protocol; pilot languages; renderPayload semantics; whether a printed
  raster of OFL fonts needs a notice; whether the notices file suffices for a distributed binary.

Do Not Touch: docs/specifications, docs/backlog; the MM-008 WIP branch and worktree; the original
  checkout and its staged and untracked work; the paused Inventory worktree; Tauri commands,
  spooler calls and printer bytes; MM-010 and Phase 1 work.

Exact Next Action: the owner reviews the WIP branch. No merge to main and no further commit or
  push without separate authorization.
  Do not reset this file to Status: NONE until the review closes.

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
