# CLAUDE.md — Claude Code bootstrap for MiniMart

This is a thin Claude Code bootstrap. It adds no product rules and does not
override `AGENTS.md`, which is the common conduct contract for Claude Code and
OpenAI Codex. If anything here appears to conflict with `AGENTS.md` or with frozen
repository authority, those win and the conflict must be reported.

## Start of every session

1. Read `AGENTS.md` first.
2. Read `docs/project-status/CURRENT-STATE.md`.
3. Check `git status`, the branch, HEAD and origin/main. Inspect staged, unstaged and
   untracked work before editing anything.
4. If `docs/project-status/ACTIVE-WORK.md` shows active work, verify it against Git
   before relying on it. Switching agent or PC: follow
   `docs/project-status/AGENT-HANDOFF.md`.
5. Read the frozen authority and the exact backlog item for the task before any
   implementation.

Conversation history, including earlier Claude sessions, is not project authority.
Frozen repository authority and Git state outrank any AI summary.

## Collaboration language

Use Malayalam for conversational explanations and status updates where practical,
while keeping technical terms, code, commands, paths, identifiers, and exact
repository terminology in English. This is the same preference as in `AGENTS.md`.

## Reporting

When reporting back, state the exact files changed, the exact validation performed
and its real outcome, known limitations or open items, and what unrelated
pre-existing work was left untouched.
