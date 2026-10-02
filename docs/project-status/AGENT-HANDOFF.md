# Agent and PC Handoff Procedures

> **Procedure aid only. Not product authority.** `AGENTS.md` is the common conduct
> contract for Claude Code and OpenAI Codex. Frozen specifications, the frozen
> backlog and Git state outrank this file. Conversation history is never authority.

This file holds the stable procedures for switching agent (Claude Code and Codex are
alternative implementers) and for switching PC (Office PC and Home PC). The project
state itself lives in Git, with `CURRENT-STATE.md` and `ACTIVE-WORK.md` as aids.

Operations that commit, push or create branches below are performed only when the
owner explicitly requests them (see Git safety in `AGENTS.md`).

## Core rules

- Exactly one agent actively modifies a logical task and working tree at a time.
  Another agent may only review, read-only. This matches
  `docs/backlog/docs/03-AI-AGENT-EXECUTION-RULES.md`.
- Same PC, different agent: **a commit is not required.** Preserve uncommitted work.
- Different PC: **GitHub is the synchronization point.** Never synchronize a Git
  working tree through OneDrive, Google Drive or similar.
- Validated project checkpoints go to `main`. Incomplete work that must move across
  PCs goes to `wip/<task>`.
- Machine-local items stay on their machine: credentials, secrets, `.env` files,
  development certificates, `node_modules`, `target`, generated caches and build
  output, and local databases (unless an explicitly approved workflow says otherwise).

## A. Claude Code bootstrap and B. Codex bootstrap

Both agents follow the same steps and must converge on the same state:

1. Read `AGENTS.md`. (Claude Code reaches it through `CLAUDE.md`; Codex reads it
   directly. No Codex-specific repository file is used.)
2. Read `docs/project-status/CURRENT-STATE.md`.
3. Run `git status`, and record the branch, HEAD and origin/main
   (`git ls-remote origin refs/heads/main` for the remote value).
4. Inspect staged, unstaged and untracked work. Treat it as protected.
5. If `ACTIVE-WORK.md` is not `Status: NONE`, verify it against Git (see its Rules).
6. Read the frozen authority and the exact backlog item for the task.
7. Decide what is complete or pending from repository evidence, not file names or
   chat claims.
8. Preserve existing work. Stop at approval gates.

## C. Same PC: Claude Code to Codex, and D. Codex to Claude Code

Outgoing agent:

1. Stop only the processes it started (dev servers, test runs, builds).
2. Update `ACTIVE-WORK.md` with the Git snapshot, completed and pending work, and the
   exact next action. Leave it uncommitted.
3. Do not commit, stash, reset or clean to "tidy up".

Incoming agent:

1. Run the bootstrap above before editing anything.
2. Verify `ACTIVE-WORK.md` against `git status` and history. A mismatch means stale.
3. Treat uncommitted changes as the owner's protected work. Do not rewrite them.
4. Re-run the relevant validation. Do not trust "tests passed" claims.
5. Only then take over as the single active writer.

## E. Office PC to Home PC, and F. Home PC to Office PC

Outgoing PC:

1. Run the applicable validation.
2. Validated work: make an isolated checkpoint commit to `main`.
   Incomplete work that must move: push a `wip/<task>` branch that includes
   `ACTIVE-WORK.md`. If unrelated staged work exists, build the commit with an
   isolated temporary index and push it to the `wip/<task>` ref without touching the
   shared index or the local branch.
3. Verify the remote with `git ls-remote origin <ref>`. Do not rely on the exit code.

Incoming PC:

1. `git fetch`, then confirm status, branch and the expected commit.
2. Fast-forward only, and only on a clean or understood working tree.
3. For a `wip/<task>` branch, use a clean clone or a separate worktree. Never check
   it out over uncommitted work.
4. Install per the lockfile, run the baseline validation, then read `ACTIVE-WORK.md`
   and verify it against Git before editing.

A `wip/<task>` branch is never merged as-is. Its content returns to `main` as a
validated checkpoint. The owner decides when the branch is deleted.

## G. Agent and PC changing together

Example: Office PC with Claude Code to Home PC with Codex. Use the cross-PC procedure
above; it is agent-neutral because the repository is the only authority. The incoming
agent runs the standard bootstrap and relies on nothing from the previous
conversation.

## H. Usage-limit handoff

An agent may be cut off without a chance to update `ACTIVE-WORK.md`. The incoming
agent therefore works from Git alone and treats `ACTIVE-WORK.md` as a hint.

Outgoing agent (when it can): update `ACTIVE-WORK.md` at milestones and before long
operations, so little is lost.

Incoming agent, Claude Code to Codex or Codex to Claude Code:

1. List running development processes (node, cargo, vite, tauri, pnpm, Docker,
   PostgreSQL). Do not kill unrelated processes. Ask the owner before stopping any.
2. Run `git status`, `git diff --stat`, `git stash list` and `git log -3`. Check for
   `.git/index.lock`. Do not delete it without owner approval.
3. Read `ACTIVE-WORK.md` and verify it against Git.
4. Assume tests are incomplete. Re-run the relevant gates.
5. Resolve unknown command outcomes first (section I).
6. Keep approval-gated questions pending. Never answer them yourself.
7. Only after verification, continue from the verified next action.

## I. Unknown command outcome recovery

Never blindly repeat a commit, push, migration, or any posting-like operation after an
interrupted or unclear result. Inspect the authoritative state first:

| Interrupted operation   | Inspect                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------- |
| commit                  | `git log`, `git status`, `git reflog`, presence of `.git/index.lock`                |
| push                    | `git ls-remote origin <ref>` compared with the local SHA                            |
| migration               | the database migration ledger and schema state                                      |
| posting-like operation  | the authoritative stored state and the idempotency identity; keep the same identity |
| print or device command | the physical result. Output may already exist, so never reprint blindly             |

If the state cannot be established, stop and report to the owner.

## Home PC toolchain note

The Home PC must use **Node 22**, consistent with the repository `engines` range and
CI. Do not use the Office PC's Node 25 installation as the standard. Other versions
are fixed by the repository (`packageManager`, `rust-toolchain.toml`). Home-PC setup
has not been performed. Development certificates are machine-local and are never
copied between PCs.
