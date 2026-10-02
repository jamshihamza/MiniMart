# MiniMart --- Agent Operating Rules

Read `SPECIFICATION-INDEX.md` before implementation.

This file is the common conduct contract for every implementation agent
(Claude Code and OpenAI Codex are alternative implementers). No agent's
conversation history is project authority.

## Authority model

Three separate axes. Do not mix them.

-   Product/technical authority: the frozen specifications and Decision
    Register, then the frozen backlog, then approved ADRs/change
    requests. An `approved-visual-reference` design package is visual
    authority only and never overrides these.
-   Agent conduct: this file. It adds no product rules. If it ever
    conflicts with frozen authority, frozen authority wins and the
    conflict is reported, not silently resolved.
-   Current state: Git (HEAD, origin, index, working tree) is the actual
    state. `docs/project-status/CURRENT-STATE.md` and
    `docs/project-status/ACTIVE-WORK.md` are navigation/handoff aids and
    must always be verified against Git.

## Startup

1.  Read this file, then `docs/project-status/CURRENT-STATE.md`.
2.  Check git status, branch, HEAD and origin/main. Inspect staged,
    unstaged and untracked work.
3.  If `docs/project-status/ACTIVE-WORK.md` shows active work, verify it
    against Git before relying on it.
4.  Read the frozen authority and exact backlog item for the task.
5.  Stop at approval gates. Switching agent or PC: follow
    `docs/project-status/AGENT-HANDOFF.md`.

## Frozen authority

The frozen specifications in `docs/specifications/` are authoritative.
Do not silently redesign or weaken them.

## Architecture guardrails

-   Offline-first: local store work does not wait for cloud.
-   `apps/store-node` and `apps/cloud` are thin launchers over shared
    service runtime.
-   Frozen monorepo names/structure in Architecture v1.0 take precedence
    over convenience renaming.
-   POS terminal: Tauri + React + TypeScript.
-   Store Node: Node.js + TypeScript modular monolith, Windows service.
-   Store DB: PostgreSQL.
-   Hardware integration: Tauri/Rust ports.
-   No microservices initially.
-   Country packs; no country forks.
-   Module owns internal tables/repositories/private SQL; no
    cross-module private access.

## Domain/data guardrails

-   Posted financial documents are immutable.
-   Inventory effects use the immutable stock ledger.
-   Posting envelopes commit local effects + audit + outbox atomically.
-   External provider money is outside the local PostgreSQL transaction.
-   No JavaScript binary float for money.
-   Preserve exact decimal-string API boundaries.
-   UUIDv7-compatible stable identifiers.
-   Retry/recovery preserves idempotency identity.
-   PENDING/UNCERTAIN payment/refund states must remain explicit.

## Agent behavior

Before coding: 1. identify the exact frozen contracts involved; 2. state
files/modules to change; 3. implement only the approved issue; 4. add
tests without weakening existing tests; 5. run
formatter/typecheck/tests; 6. summarize changes and unresolved
questions.

If specifications conflict, stop and identify the exact files/IDs. Do
not invent a resolution.

## Approval gates

Stop and get explicit owner direction before any decision touching:
architecture; database authority/schema; domain or business-rule
semantics; money/WAC/stock-ledger/tax; posting/payment/refund/sync;
security; a significant migration; major infrastructure.

Decisions that the Decision Register marks OPEN, VERIFY, DEFERRED or
PROPOSED must never be self-resolved. State the options and stop. See
also `docs/backlog/docs/03-AI-AGENT-EXECUTION-RULES.md`.

Within an approved task, work autonomously through ordinary
implementation and test failures.

## Git safety

-   Do not commit, push, reset, restore, clean, stash, rebase or
    force-push unless that exact operation is explicitly requested.
-   Preserve unrelated dirty, staged and untracked work exactly. Never
    stage, revert or rewrite files outside the assigned task.
-   When unrelated staged work exists, never run a plain commit against
    the shared index. Use an isolated temporary index or equivalent Git
    plumbing, then verify the commit's changed-file list.
-   After a push, verify the remote SHA. Do not assume success from an
    exit code.
-   Frozen specifications and the frozen backlog must show an empty diff
    unless a specific change was explicitly approved.
-   Do not edit old handoff manifests to hide a changed hash. Record the
    difference as evidence instead.

## Validation honesty

-   Run the task's applicable gates (format, lint, typecheck, tests).
    Never weaken, skip or narrow a test to make it pass.
-   Never report a check as passed unless it was run and its output
    observed in this session.
-   Software-only validation is reported as software-only. Never claim
    physical hardware validation (printer, scanner, other device)
    without running it on real target hardware.

## Handoff and working-tree ownership

-   Exactly one agent actively modifies a logical task and working tree
    at a time. Other agents are read-only reviewers.
-   The "Active Agent / Machine" field in `ACTIVE-WORK.md` is
    informational, not a lock.
-   Same-PC agent switch: no commit is required; inspect Git and verify
    `ACTIVE-WORK.md` first, and preserve uncommitted work.
-   Cross-PC: GitHub is the synchronization point. Validated
    checkpoints go to `main`; incomplete transferable work goes to
    `wip/<task>`. Never synchronize a Git working tree through a cloud
    drive.
-   Procedures: `docs/project-status/AGENT-HANDOFF.md`.

## Secrets and machine-local state

Never commit secrets, credentials, `.env` files, development
certificates, local databases, `node_modules`, `target`, or generated
caches/build output. They stay on the machine that owns them.

## Collaboration language

Use Malayalam for conversational explanations and status updates where
practical, while keeping technical terms, code, commands, paths,
identifiers, and exact repository terminology in English.
