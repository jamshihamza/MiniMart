# MiniMart Current Project State

> **Navigation aid only. This file is not product authority.**
>
> - The frozen specifications remain authoritative.
> - `AGENTS.md` is the common conduct contract for Claude Code and Codex.
> - If this file conflicts with frozen repository authority, frozen authority wins.
> - It records pointers and verified status. It defines no requirements, makes no
>   architectural decisions and resolves no OPEN decision.
> - Git is the actual state. Verify everything here against Git.

## Authority

Read these instead of relying on this file or on any AI conversation summary.

| Need                                                    | Where                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Agent conduct (Claude Code and Codex)                   | `AGENTS.md`                                                                                            |
| Claude Code bootstrap                                   | `CLAUDE.md` (thin tracked companion; adds no product rules)                                            |
| Frozen AI-agent execution rules                         | `docs/backlog/docs/03-AI-AGENT-EXECUTION-RULES.md`                                                     |
| Active-work record and agent/PC handoff procedures      | `docs/project-status/ACTIVE-WORK.md`, `docs/project-status/AGENT-HANDOFF.md`                           |
| Which document answers what                             | `SPECIFICATION-INDEX.md` (repository root)                                                             |
| Product context                                         | `PROJECT-CONTEXT.md`                                                                                   |
| BRD, FRS, NFRS, Decision Register                       | `docs/specifications/01-business-and-functional/` (v1.0 FROZEN)                                        |
| Domain model, seam matrix, transaction rules            | `docs/specifications/02-domain-model/` (v1.0 FROZEN)                                                   |
| Database                                                | `docs/specifications/03-database-model/` (v1.2 FROZEN)                                                 |
| Architecture                                            | `docs/specifications/04-architecture/` (v1.0 FROZEN)                                                   |
| API contracts                                           | `docs/specifications/05-api-contracts/` (v1.0 FROZEN)                                                  |
| UI specification                                        | `docs/specifications/06-ui-specification/` (v1.0 FROZEN)                                               |
| Implementation order                                    | `docs/backlog/` (v0.1 baseline)                                                                        |
| Phase-0 implementation notes and ADRs                   | `docs/phase-0/`, `docs/adr/`                                                                           |
| Design handoff rules, manifests, renders, fidelity data | `docs/design/README.md`, `docs/design/*/design-manifest.json`, `docs/design/RENDER-FIDELITY-REPORT.md` |

Design never overrides frozen authority. A design package is visual authority only
when its manifest status is `approved-visual-reference`.

`docs/specifications/` also contains duplicate or stub directories not named in the
index (`01-brd`, `02-frs-nfrs`, `03-domain-model`, `04-database-model`,
`05-architecture`, `06-api-contracts`, `07-ui-specification`). They are not
authoritative; use the index.

## Agent Model

- Claude Code and OpenAI Codex are **alternative implementation agents**. The user may
  switch between them, and between the Office PC and the Home PC.
- Conversation history is **never** project authority. Authority is the repository:
  product authority (frozen specifications and Decision Register, frozen backlog,
  approved ADRs), agent conduct (`AGENTS.md`) and actual state (Git).
- This file and `ACTIVE-WORK.md` are navigation and handoff aids only.
- One agent actively modifies a logical task and working tree at a time. Others
  review read-only.
- Same-PC agent switch: no commit required; inspect Git, verify `ACTIVE-WORK.md`,
  preserve uncommitted work.
- Cross-PC: GitHub is the synchronization point. Validated checkpoints go to `main`;
  incomplete work that must move goes to `wip/<task>`.
- Procedures: `docs/project-status/AGENT-HANDOFF.md`.

## Current Git State

This file deliberately records no current HEAD or origin/main SHA, because it is itself
committed on `main` and any recorded SHA would be stale. Establish them with git at the
start of every session:

- Branch: `main`.
- HEAD: `git rev-parse HEAD`.
- origin/main: `git ls-remote origin refs/heads/main`.
- Compare the two before editing.

Last reviewed: 2026-10-02 (Office PC). Last known approved visual-reference checkpoint:
`abc04045260fea5e478ffb52bcf8ff7deb52f90c` (Accounting-Lite).

## Visual Packages

Status as recorded in each `docs/design/<package>/design-manifest.json` at HEAD.

| Package             | Manifest status             | Screens | Authoritative source SHA-256                                       |
| ------------------- | --------------------------- | ------- | ------------------------------------------------------------------ |
| Procurement         | `approved-visual-reference` | 74      | `0bf23d77e0d404c99c146b78eba3141de8bc47cc21e9cc8835ffa6091e21951d` |
| Customers + Credit  | `approved-visual-reference` | 74      | `593adaec60d84d384fdc2947a1ba7d169f8ec8eb21d34373fb814ee662259d7c` |
| Cash / Business Day | `approved-visual-reference` | 77      | `a0d9df668213a9a562bd0fefec9198274c57931b7c6f79da59b87554aee55fee` |
| Accounting-Lite     | `approved-visual-reference` | 88      | `ebe8ca7f38b9b9d5cd9c16fed421bfe5f5863653ec9478a081d368d2bb9df12e` |
| POS                 | `review-ready`              | 31      | not approved                                                       |
| Back Office         | `review-ready`              | 60      | not approved                                                       |
| Inventory           | `draft`                     | none    | no source registered                                               |
| Reports             | no manifest                 | none    | not started                                                        |
| Administration      | no manifest                 | none    | not started                                                        |

Accounting-Lite was approved and pushed in commit
`abc04045260fea5e478ffb52bcf8ff7deb52f90c`. The design visual packages beyond the
frozen UI screens are visual elaboration; mechanisms that frozen authority leaves
open (for example opening-balance mechanics and accountant-export contracts) remain
undefined. See the Accounting section of `docs/design/RENDER-FIDELITY-REPORT.md`.

## Development State

From repository history and `docs/phase-0/`:

- Phase-0 items with completion commits on `main`: MM-003 (Store Node service),
  MM-004 (PostgreSQL migration foundation), MM-005 (POS shell, native Tauri
  validation), MM-006 (POS to Store Node connectivity) and MM-012 (test pyramid and
  CI gates). Foundation tooling (MM-001, MM-002) is present per `README.md`.
- MM-007 (printer spike): not on `main`. Its code and `docs/phase-0/mm-007-printer-spike.md`
  exist only as local staged work on the Office PC. Its own document states that no
  receipt printer was detected, no physical job was submitted and physical output is
  unverified. Do not describe it as hardware-validated.
- MM-008 to MM-011: no evidence in the repository of implementation.
- The business-module packages under `packages/modules/` exist as boundary skeletons
  (index files only). No Accounting-Lite or Reports application code was found; for
  those areas only visual packages exist.

## Local Work Warning (Office PC)

The Office PC holds a protected local work set that is **not** represented by
`origin/main`:

- **Staged entries** that are not in `origin/main`, in these broad categories: MM-007
  printer spike (`crates/hw-printer`, `apps/pos-terminal` native and front-end changes,
  `docs/phase-0/mm-007-printer-spike.md`); POS shell and demo assets; workspace,
  lockfile and CI workflow changes; `.design-package-index.json`; `Mockups/` and some
  `Incoming/` archive files. The count changes as items are checkpointed, so inspect
  it with `git status` rather than trusting a number here.
- **5 untracked files** in `Incoming/` (design source archives).

Rules for this work:

- Do not reset, restore, clean, stash, discard or casually commit it.
- A fresh clone on another PC will **not** contain any of it.
- Its contents and blob hashes are deliberately not recorded here because they are
  machine-local and transient.
- Classifying it, and deciding what to checkpoint, is the next step (see below).

## Current Module

Accounting-Lite visual reference: **CLOSED / APPROVED / PUSHED**, checkpoint commit
`abc04045260fea5e478ffb52bcf8ff7deb52f90c`.

## Next Authorized Work

**Two-PC and multi-agent development workflow preparation**, before starting the
Reporting visual-design module.

The next action is to decide what protected Office-PC local work (see the warning
above) must be checkpointed before the Home PC becomes an active development machine.

Reporting is **not started**. The Home PC is **not yet configured**; when it is set
up it must use Node 22 (see `AGENT-HANDOFF.md`).

## Two-PC Working Rule

- GitHub is the synchronization point.
- Before working on either PC: check `git status`, fetch, update safely from origin
  and confirm the expected branch and HEAD.
- Before switching PCs: push a validated checkpoint to `main`, or push incomplete
  transferable work to `wip/<task>` including `ACTIVE-WORK.md`. Do not leave the same
  logical work being edited independently on both PCs.
- Switching agent on the **same** PC does not require a commit.
- Do not synchronize the Git working tree through OneDrive, Google Drive or similar.
- Never sync secrets, `.env` files, databases, build outputs or credentials through Git.

## Agent Resume Procedure

For Claude Code, Codex and other agents, at the start of every session:

1. Read `AGENTS.md`.
2. Read this file.
3. Verify `git status`, the branch, HEAD and origin/main; inspect staged, unstaged and
   untracked work.
4. If `ACTIVE-WORK.md` is not `Status: NONE`, verify it against Git.
5. Read the authoritative documents relevant to the requested module.
6. Treat frozen repository authority and Git state as higher priority than any AI
   conversation summary.
7. Do not alter protected local work without explicit authorization.
