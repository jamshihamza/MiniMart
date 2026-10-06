# Active Work

> **Handoff aid only. Not product authority.** It is not a specification, backlog,
> decision register or architecture record, and it never resolves a decision. Frozen
> repository authority and Git state outrank it. Always verify it against Git.

**Status: ACTIVE**

```text
Status: ACTIVE (MM-010 test-only sync harness validated against PostgreSQL 17 in Docker;
  acceptance INCOMPLETE; owner review pending)
Task: MM-010 minimal sync proof spike, test-only harness under packages/sync-protocol/test/.
  ACCEPTANCE IS INCOMPLETE. No SQL or runtime acceptance is claimed.
Started From Commit: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 (origin/main when the branch was cut)
Updated At HEAD: 1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67 is the parent of the WIP checkpoint commit.
  The checkpoint's own SHA is not written here; read it with git log -1 on the branch.
Current Branch: wip/mm-010-sync-proof, in an isolated worktree that is a sibling directory named
  mm-010 next to the original checkout. One software-only WIP checkpoint commit sits on top of
  1eb8e82 and the branch is pushed to origin. Nothing is merged, no pull request exists, and main
  is not updated.
Active Agent / Machine: Claude Code, Office PC (informational, not a lock)

Goal: Exercise the frozen Store to Cloud sync boundary (same-transaction outbox, dispatcher, Cloud
  inbox dedup, retry, lost ACK, outage, replay, incompatible-version quarantine) with a fictional
  BusinessDayStateChanged fixture, in a test-only harness. No production sync code, schema,
  migration, launcher or package export is added or changed.

Files Intentionally Changed: exactly 32 paths, all in the single WIP checkpoint commit on
  wip/mm-010-sync-proof (git diff 1eb8e82 HEAD --name-only lists them). The worktree is clean after
  the commit. WIP means software-only and not accepted; it is not a merge candidate yet.
  Modified (5):
    .github/workflows/ci.yml                      (one step: pnpm run test:sync-proof)
    package.json                                  (script test:sync-proof)
    packages/sync-protocol/package.json           (scripts typecheck:harness and test; devDependencies)
    pnpm-lock.yaml                                (packages/sync-protocol importer block only)
    docs/project-status/ACTIVE-WORK.md            (this record)
  New (27):
    docs/phase-0/mm-010-sync-proof-spike.md
    packages/sync-protocol/tsconfig.test.json
    packages/sync-protocol/test/checkpoint.test.ts
    packages/sync-protocol/test/contract-fixture.test.ts
    packages/sync-protocol/test/database-assumptions.test.ts
    packages/sync-protocol/test/delivery-recovery.test.ts
    packages/sync-protocol/test/harness-isolation.test.ts
    packages/sync-protocol/test/loopback-roundtrip.test.ts
    packages/sync-protocol/test/loopback-server.test.ts
    packages/sync-protocol/test/outage-replay.test.ts
    packages/sync-protocol/test/outbox-atomicity.test.ts
    packages/sync-protocol/test/quarantine.test.ts
    packages/sync-protocol/test/transport-faults.test.ts
    packages/sync-protocol/test/harness/checkpoint.ts
    packages/sync-protocol/test/harness/cloud-ingest.ts
    packages/sync-protocol/test/harness/database-pair.ts
    packages/sync-protocol/test/harness/direct-transport.ts
    packages/sync-protocol/test/harness/dispatcher.ts
    packages/sync-protocol/test/harness/envelope.ts
    packages/sync-protocol/test/harness/fixtures.ts
    packages/sync-protocol/test/harness/frozen-contract.ts
    packages/sync-protocol/test/harness/loopback-server.ts
    packages/sync-protocol/test/harness/postgres.ts
    packages/sync-protocol/test/harness/store-seed.ts
    packages/sync-protocol/test/harness/test-only-schema.ts
    packages/sync-protocol/test/harness/transport.ts
    packages/sync-protocol/test/harness/wiring.ts
  Unchanged and must stay so: packages/sync-protocol/src, apps/*, database/migrations,
  docs/specifications, docs/backlog.

Validation Already Run (do not repeat unless code changes):
  - Full pnpm run test:sync-proof against postgres:17-alpine through Testcontainers (Docker 29.8.0,
    image already local): 11 files, 90 tests PASSED, run twice in a row, exit 0 (after the
    pre-checkpoint review fixes). That is 39 database-free plus 51 PostgreSQL-dependent tests, all
    executed. Before the review it was 86 tests (38 plus 48), also twice.
  - Pre-checkpoint review fixes (test-only): wirePeerId tests; pg error handler records and checks
    errors; ROLLBACK no longer masks the original error; checkpoint lock test waits on pg_locks
    instead of a sleep (the negative control was already deterministic by barrier); test-only
    requeue plus replay-after-exhaustion tests; stronger durable-state assertions. Details in the
    spike document.
  - The first run had 2 failures (loopback peerId mismatch between dispatcher and test server) and an
    unhandled pg connection error in the pg_terminate_backend test. Both were harness or test defects,
    fixed inside packages/sync-protocol/test/ only. One container start failed once in setup
    (cause not captured, rerun passed); it is an environment error, not a test result.
  - Harness typecheck, ESLint on the package, Prettier check and pnpm run ci: passed (exit 0).
  - Mutation checks on the database-free tests, each caught and reverted (production file naming the
    harness, launcher importing a sync-protocol subpath, version check removed, loopback host widened).
  - Observed checkpoint results: unlocked negative control left duplicate first rows; the advisory
    lock left one; delivery was unaffected by disabled, deleted, stale, duplicate or failing
    checkpoints. Details in the spike document.
  - Evidence scope: one container per file, one PC, single worker, manual clock. Not CI, not
    production behavior.

Known Gaps: restart cases use abandoned leases, new dispatcher instances and pg_terminate_backend, not
  operating-system process restarts (real process-restart evidence is pending); no authentication,
  enrollment, mTLS or authorization tested; the pull, ack and compatibility routes are not
  implemented; the frozen conformance suite was not run; CI has not run (it triggers on pull
  requests and main pushes, not on wip/ pushes); the ten contract gaps below remain OPEN.

Contract gaps (all OPEN; nothing here is decided; details in docs/phase-0/mm-010-sync-proof-spike.md):
  1. domain event name to wire message type mapping; 2. event_version (integer) versus
  contractVersion (string); 3. outbox payload versus wire payload; 4. meaning and source of
  sourceIdentity, storeId and occurredAt (no outbox columns); 5. sync peerId string versus inbox
  peer_id uuid, and whether message ids are globally unique or per tenant and peer; 6. push, ack and
  checkpoint direction and ownership, and 409 versus per-message QUARANTINED; 7. no terminal marker on
  outbox rows, dead_letters without a unique key or peer, sync_checkpoints without a unique key on
  tenant, peer and stream; 8. inbox_receipts.status vocabulary; 9. which module owns integration.*
  SQL if any harness code is ever promoted into src; 10. generated validators and conformance suite.

Next Action: owner review of the validated harness and of the remaining acceptance gaps (real
  OS-process restart evidence, CI evidence, the ten contract gaps). Further commits, a pull
  request (which is also what triggers CI), a merge to main and MM-011 each need separate owner
  authorization. Do not reset this file to Status: NONE until the review closes.

How to resume (commands from the MM-010 worktree root):
  1. Verify against Git first: git status (expect branch wip/mm-010-sync-proof and a clean tree),
     git log --oneline -2 (expect the WIP checkpoint on top of 1eb8e82), git diff 1eb8e82 HEAD
     --name-only (expect the 32 paths above), git ls-remote --heads origin (expect
     wip/mm-010-sync-proof equal to the local HEAD, and main still at 1eb8e82 unless the owner
     moved it).
  2. If node_modules or dist are missing: pnpm install --frozen-lockfile, then pnpm exec tsc -b.
     @minimart/database needs its dist because the harness imports it by package name.
  3. Database-free re-check (no PostgreSQL needed):
       pnpm --filter @minimart/sync-protocol typecheck:harness
       pnpm --filter @minimart/sync-protocol exec vitest run --maxWorkers=1 --fileParallelism=false test/contract-fixture.test.ts test/harness-isolation.test.ts test/loopback-server.test.ts test/transport-faults.test.ts
  4. PostgreSQL 17 is needed for the rest (owner authorized Testcontainers once; ask again for a new run):
     a. an existing server: set MINIMART_TEST_POSTGRES_URL to an administrative URL for a role that can
        create databases, for example postgresql://postgres:postgres@localhost:5432/postgres.
        PowerShell: $env:MINIMART_TEST_POSTGRES_URL = "postgresql://..."   bash: export MINIMART_TEST_POSTGRES_URL=...
     b. Docker Desktop running with the variable unset: Testcontainers then runs postgres:17-alpine
        (the image the MM-004 helper uses). The first run downloads that image, which needs owner
        authorization. Each test file starts and stops its own container.
     Each test creates and drops uniquely named databases; it never touches an existing one.
  5. Run everything: pnpm run test:sync-proof (harness typecheck, then all 11 test files). Run one
     database file with: pnpm --filter @minimart/sync-protocol exec vitest run test/quarantine.test.ts
  6. When fixing, re-run pnpm exec prettier --write on changed files, eslint, pnpm run ci, and update
     the validation record in the spike document and here. Report any database test that still fails
     or is not executed as not passed. If a file fails in setup with PostgresUnavailableError, check
     Docker first and rerun the file; that is an environment error, not a result.

Preserved, unchanged by this task: the original checkout stays on main at 1eb8e82 with 27 staged
  entries and protected digest c7ac91711283565abda6ba071962cc8dadcc5025e123ecd9984a4a8dc7c11b64
  (SHA-256 of path<TAB>index-blob<LF>, entries in C-locale git diff --cached --name-only -z order),
  0 tracked changes and 12 untracked archives; wip/mm-008-scanner-spike (a30a1490) and
  wip/mm-009-raster-spike (5f4cf1c0) are unchanged and clean; Inventory stays paused.

Approval-Gated Questions (owner; nothing here is decided): the contract gaps above; whether any harness code is ever promoted into production src; a pull request,
  merge or further commit for this branch.

Do Not Touch: docs/specifications, docs/backlog; the MM-008 and MM-009 WIP branches and worktrees; the
  original checkout and its staged and untracked work; the paused Inventory worktree; production
  schema, migrations, sync, transport and launcher code.

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
