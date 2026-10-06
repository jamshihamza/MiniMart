# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: ACTIVE**

```text
Status: ACTIVE (software checkpoint review in progress; do not reset to NONE yet)
Task: MM-008 barcode scanner keyboard-wedge spike (Phase 0). INCOMPLETE software-only
  checkpoint candidate for owner review. MM-008 acceptance is NOT complete: native WebView2
  and physical-scanner acceptance are pending.
Started From Commit: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67
Updated At HEAD: this record describes the review-fix checkpoint that follows fe20614 on
  wip/mm-008-scanner-spike (earlier checkpoint 6c48825, parent 1eb8e82 = origin/main at
  the last check, 2026-10-06). Read the branch tip with git log; the tip commit is the
  review fix.
Current Branch: wip/mm-008-scanner-spike (isolated MM-008 worktree, a sibling of the
  original checkout), pushed to origin/wip/mm-008-scanner-spike
Active Agent / Machine: Claude Code, Office PC (informational, not a lock)

Goal: Capture repeated keyboard-wedge scans in the POS shell without triggering global
  shortcuts (acceptance text of MM-008). Output is an untrusted candidate string; no
  item lookup, cart, price, barcode validity, device identity or business behaviour.

Completed: scanner-input capture module; shell integration (capture-phase listener, F2
  suppression, text restore, other-editable isolation, blur and page-leave resets, Space
  cancellation after scan keys); fixtures; 94 new tests; spike document. Checkpoints 6c48825 and fe20614 and the review fix
  were committed and pushed to the wip branch only (owner-authorized); main was not updated.
  Review fix: a confidently rejected scan (contaminated, overlength, prefix or
  suffix mismatch, at least the minimum length) now consumes its Enter or Tab, and restores
  the search text only when the burst began in that field. Short bursts, ordinary typing and
  lone Enter or Tab are untouched.

Pending: owner software-checkpoint review; physical scanner acceptance; native WebView2
  keyboard acceptance; validation of the 50 ms threshold (provisional); browser F-key
  default-action isolation (not independently verified); the unsupported leading-Space-on-a-
  focused-button mode; merge to main (not authorized).

Files Intentionally Changed (exactly seven paths):
  M apps/pos-terminal/src/App.tsx
  A apps/pos-terminal/src/scanner-input.ts
  A apps/pos-terminal/test/scanner-fixtures.ts
  A apps/pos-terminal/test/scanner-input.test.ts
  A apps/pos-terminal/test/scanner-shell.test.tsx
  A docs/phase-0/mm-008-scanner-spike.md
  M docs/project-status/ACTIVE-WORK.md (this record)

Git Snapshot (2026-10-06, isolated MM-008 worktree):
  Branch wip/mm-008-scanner-spike: 6c48825 (checkpoint), fe20614 (handoff), then the review
  fix commit (six paths: App.tsx, scanner-input.ts, scanner-input.test.ts,
  scanner-shell.test.tsx, the spike document and this file). origin/main is 1eb8e82 and was
  not updated. Frozen docs/specifications and docs/backlog diff: 0.
  Build output (target/, dist/, node_modules/) is ignored and not part of the change.
  Original checkout: HEAD 1eb8e82, 27 protected staged entries (digest of
  path<TAB>index-blob<LF> = c7ac91711283565abda6ba071962cc8dadcc5025e123ecd9984a4a8dc7c11b64),
  tracked diff 0, 12 untracked archives. Not touched by this task.
  No native app or dev server is running.

Validation Already Run (do not repeat unless code changes):
  - pos tests 102/102 (8 existing unchanged + 52 module + 42 shell), including the review-fix
    regression tests and the unsupported-context (leading Space on a button) regression.
  - tsc typecheck; pnpm run ci exit 0; git diff --check clean; frozen diff 0.
  - Mutation checks, each caught by the new tests and reverted: ignoring the suppression
    flag, disabling chord suppression, removing the text restore, claiming other
    editables, removing the blur and page-leave resets, lowering the burst threshold,
    ignoring Shift on terminators, removing the Space cancellation, not consuming a
    rejected scan's terminator, consuming a short contaminated burst's terminator, not
    restoring text after a rejected scan, and ignoring where the burst began.
  - Real Chrome (Playwright, browser input pipeline, Vite dev server): a Space inside or
    at the end of a scan does not press a focused button (keydown and keyup cancelled);
    control cases prove a press is detectable (plain page presses on Space anywhere;
    cancelling keydown or keyup blocks it); slow typing then Space still presses.
  - Real Chrome per focus context (barcode field, page, History button) with Space first,
    inside, last and absent: captured and nothing activated in the field and page contexts;
    on the button only the leading-Space case presses it.
  - Real Chrome for rejected scans (contaminated and overlength, Enter and Tab, History
    button and search field): before the fix Enter pressed the button or submitted the form,
    Tab moved focus and the rejected characters stayed in the field; after the fix none of
    that happens and the field text is restored. Controls (short burst, slow typing, lone
    Enter) still behave normally. Prefix and suffix rejection were run against the module
    in Chrome only; the app has no way to configure them.
  - Note: App.tsx contains a Space guard (spaceGuardRef, keyup handler). It is covered by
    tests and the real-Chrome check.

SUPPORTED CAPTURE MODE (narrowed, proposed for owner review, not accepted): a scan is
  supported when the barcode field has focus or focus is on a target with no default action for
  Space; a leading Space is captured whole there. UNSUPPORTED: a scan whose first key is Space
  while a button (or other Space-activated control) has focus: the button is pressed (real
  Chrome). Cancelling every Space or deferring clicks would change ordinary keyboard behaviour,
  so it was not done. Remedy for later POS sale work: keep focus in the barcode field. A Space
  after at least one fast scan key on a button is cancelled on key down and key up. A person
  typing one key then Space within 50 ms on a focused button is also blocked (accepted, rare).
  No claim of global scanning support is made.

NOT DONE / GAPS:
  - No physical scanner (only a generic HID keyboard is present); 50 ms threshold and
    FR-HW-009 cadence, vendor-utility and Windows conflict testing unverified.
  - Native WebView2 keyboard run NOT achieved. The native window launched and rendered
    (WebView2 runtime 154.0.4258.53, screenshot confirmed). The env-var debugging port did
    not open. OS-level key injection could not hold the POS window in the foreground.
    No native keyboard claim is made. The Tauri config was not changed.
  - F-key browser defaults (F5, F11) inside a scan were checked only through
    preventDefault in a simulated DOM.

OS KEY-INJECTION INCIDENT (disclosure, preserved): before a foreground guard existed,
  three PowerShell runs failed. The first sent no events (SendInput struct-size bug). The
  second and third showed no effect in the POS window and, in the third, a UI Automation
  focus query returned a control from a different application (the Claude desktop
  window). Keys from the second and third runs, including digits, Space and Enter, were
  probably delivered to that other foreground application; their effect there is
  UNVERIFIED. A later version refused to send any key or click unless the POS window was
  the foreground window and aborted before sending anything. DO NOT repeat OS-level key or
  mouse injection into any window unless the target is verified as the foreground window
  immediately before every event.

Approval-Gated Questions (owner; nothing here is decided):
  (1) Scanner placement. Frozen text points both ways (UI 22 lists "scanner input" under
      Tauri/Rust local ports; API 07 says "Scanner events remain interaction input").
      A DRAFT ADR with exact citations and the proposed boundary (DOM wedge capture is
      interaction handling; native scanner and device integration stays behind Tauri/Rust
      ports; absence of a scanner command is not proof native handling is unnecessary)
      is in a scratch folder outside the repository (the owner has the path; it is not
      recorded here). It stays DRAFT and states that this DOM spike does not satisfy
      Architecture 33 Spike B. Its shared
      ScanCandidate interface and any native scanner command or event stream are proposals,
      not approved contracts. No standing until the controlled ADR/change-request process.
  (2) Phase-0 sequencing is unchanged: MM-009, MM-010, MM-011 and the gates in
      Architecture 33 and 13 precede Phase 1. Any exception needs the controlled ADR or
      change-request process; owner wording alone does not reinterpret a frozen gate.

Do Not Touch: docs/specifications, docs/backlog; the original checkout and its staged and
  untracked work; the paused Inventory worktree; MM-007 printer code; architecture
  amendments; MM-010 and Phase 1 work; the implementation files of this task unless the
  owner asks for a change.

Exact Next Action: after context compaction, (1) re-read AGENTS.md and this file, (2)
  verify them against Git in the MM-008 worktree (branch wip/mm-008-scanner-spike,
  clean, no running dev processes) and in the original checkout (27 staged, digest
  above), (3) follow the next owner prompt. Do not re-run completed tests or uncertain
  operations (native key injection, dev servers) unless the owner asks. The owner reviews
  the wip branch as an incomplete software checkpoint. No merge to main and no further
  commit or push without separate authorization. Do not reset this file to Status: NONE until the review closes.

Last Updated: 2026-10-05

Handoff Notes: Session scratch (outside the repo) also holds the real-browser and native
  test scripts and their output. They are temporary and not part of the change.
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
