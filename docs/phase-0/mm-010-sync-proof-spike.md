# MM-010 minimal sync proof spike (test-only harness)

## Authority and scope

MM-010 in the frozen Phase-0 backlog requires "One safe message round-trips with retry/dedupe
evidence." Architecture `33`, Spike D, requires the smallest end-to-end path
`Store Node → same-transaction Outbox → dispatcher → Cloud ingest → Inbox dedup → cloud projection/effect → ACK/checkpoint`
and tests duplicate delivery, lost ACK, Store restart, Cloud outage, replay after reconnect and
incompatible contract version quarantine. Pass evidence is no duplicate business effect, no Store
posting dependency on cloud, stable event/message identity, and observable retry/backlog state.
Architecture `35` also asks the spike to record sync engine evaluation evidence against the approved
custom Outbox/Inbox design; any replacement would need an ADR.

**Status: test-only harness written and partly checked. MM-010 acceptance is INCOMPLETE.** The
database-dependent evidence does not exist yet, because PostgreSQL was not available where this work
was done. Nothing here changes a Phase-0 gate, MM-007, MM-008 or MM-009 acceptance, or any frozen text.

## What this is and is not

Everything lives under `packages/sync-protocol/test/`. It is a test harness, not a sync
implementation. No production source, package export, launcher, migration or schema changed.

| Harness only (never production)                                                                | Follows the frozen pattern, but is still harness code                                 |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Test-only tables in schema `spike_mm010` (facts, envelope side, terminal, effects, quarantine) | The outbox claim query (`FOR UPDATE SKIP LOCKED`, lease, publish outside transaction) |
| The synthetic "posting" that writes a fact, an outbox row and a side row in one transaction    | The inbox claim, effect and applied-mark in one transaction                           |
| Fault-injecting, gated, reversing and recording transports                                     | Rejecting incompatible or unregistered messages before an inbox claim                 |
| The loopback HTTP server and client, with a fixed test identity                                | Bounded retry with backoff                                                            |
| The checkpoint writer and its advisory-lock experiment                                         |                                                                                       |
| Fixture envelope values, the frozen-contract checker and all retry and backoff values          |                                                                                       |

The harness is not exported, not built into `dist`, and not reachable from any launcher. Any
promotion of this code into `src` needs its own decision (see the open questions).

## Files

All new files are under `packages/sync-protocol/test/` unless noted. Changed: `.github/workflows/ci.yml`
(one step), root `package.json` (`test:sync-proof`), `packages/sync-protocol/package.json` (scripts and
devDependencies), `pnpm-lock.yaml` (the `packages/sync-protocol` importer only),
`packages/sync-protocol/tsconfig.test.json` (new), and this document.

- Harness: `harness/fixtures.ts`, `frozen-contract.ts`, `envelope.ts`, `transport.ts`,
  `direct-transport.ts`, `dispatcher.ts`, `cloud-ingest.ts`, `checkpoint.ts`, `store-seed.ts`,
  `test-only-schema.ts`, `database-pair.ts`, `postgres.ts`, `loopback-server.ts`, `wiring.ts`.
- Tests that need no database: `contract-fixture.test.ts`, `harness-isolation.test.ts`,
  `loopback-server.test.ts`, `transport-faults.test.ts`.
- Tests that need PostgreSQL: `database-assumptions.test.ts`, `outbox-atomicity.test.ts`,
  `delivery-recovery.test.ts`, `outage-replay.test.ts`, `quarantine.test.ts`, `checkpoint.test.ts`,
  `loopback-roundtrip.test.ts`.

New devDependencies of `@minimart/sync-protocol` (all at versions already locked in the repository):
`@minimart/database` (workspace), `@testcontainers/postgresql`, `@types/pg`, `ajv`, `pg`, `vitest`,
`yaml`. `ajv` and `yaml` were already in the lockfile as transitive dependencies; they are now
declared. The lockfile change is the single importer block.

## Fixture and envelope choices (C1 and C3)

The only message type is the registered `BusinessDayStateChanged` (Store fact, Edge to Cloud,
project-only, version 1.0), used as a fictional wire fixture. `status` is an opaque string. No Business
Day behavior exists, and the open decisions DEC-CSH-001 to DEC-CSH-005 are untouched.

The fixture is validated against the real `SyncMessage_BusinessDayStateChanged` component of
`docs/specifications/05-api-contracts/openapi/minimart-sync-v1.yaml` and the real registry file, read
at run time, using `yaml` and `ajv`. ajv format checking is off, so uuid, date and date-time formats
are asserted separately. This is not the frozen generated validator and not the frozen conformance
suite, and nothing here is a conformance claim.

How each envelope field is handled. The production outbox has no column for several of them, so the
harness keeps explicit fixture values in a test-only side table written in the same transaction. It
asserts no production mapping.

| Field                                               | Source in the harness                                                            | Frozen evidence and status                                                                                   |
| --------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `messageId`                                         | outbox `event_id`                                                                | Architecture 04 "messageId/eventId"; database 07 dedups by "event_id/message_id". Supported.                 |
| `messageType`                                       | outbox `event_type`, set by the fixture to the wire type                         | Domain events (BusinessDayOpened, BusinessDayClosed) differ from the wire type; no mapping frozen. **Open.** |
| `contractVersion`                                   | side table text, fixture `"1.0"`                                                 | Outbox `event_version` is an integer; no conversion frozen. **Open.**                                        |
| `ownerClass`, `sourceMode`                          | derived from the frozen registry only                                            | Strong evidence.                                                                                             |
| `tenantId`                                          | outbox `tenant_id`                                                               | Direct.                                                                                                      |
| `storeId`                                           | side table, fixture value                                                        | Required key, uuid or null; no outbox column. Fixture-supplied.                                              |
| `sourceIdentity`                                    | side table, opaque fixture string                                                | Frozen text says only "non-empty string", and Architecture 04 says "aggregate/source identity". **Open.**    |
| `occurredAt`                                        | side table, explicit fixture time, different from the outbox `created_at`        | `occurred_at` belongs to immutable facts; no outbox column. Never equated with `created_at`.                 |
| `correlationId`, `causationId`, `postingEnvelopeId` | outbox columns, passed through (`postingEnvelopeId` is null: no posting happens) | Direct.                                                                                                      |
| `payload`                                           | outbox `payload`, assumed to be the wire payload verbatim                        | Frozen text does not say the outbox payload is the wire payload. **Open.**                                   |
| `peerId`                                            | a fixed test uuid                                                                | The sync request `peerId` is a string and the inbox `peer_id` is a uuid. **Open.**                           |

## Terminal state, quarantine and checkpoints (C4)

- The frozen outbox row has no column for a terminal or dead-letter state. The harness keeps terminal
  outcomes (`QUARANTINED`, `REJECTED`, `RETRIES_EXHAUSTED`) in a test-only table keyed by tenant,
  remote peer and outbox message. The dispatcher claim query excludes those rows. `published_at` is set
  only when a message was delivered (APPLIED or DUPLICATE). No production column, including
  `available_at`, encodes a terminal state.
- The frozen `dead_letters` table has no unique key. The harness writes its `dead_letters` row only
  when the insert into the test-only table that does have a key actually wins, so a repeated
  quarantine does not duplicate it.
- Every deduplication key in the harness includes the tenant and the remote peer: the frozen inbox
  unique index is (tenant, peer, message id), and the test-only effect, quarantine and terminal tables
  use the same scope. The harness does not assume message ids are globally unique. Whether global
  uniqueness is intended is not stated in the frozen text.
- The frozen `sync_checkpoints` table has no unique key on (tenant, peer, stream). `ON CONFLICT`
  cannot work, and `SELECT ... FOR UPDATE` on a missing row locks nothing, so two concurrent first
  inserts can both succeed and duplicate the row. The harness writer can take a transaction-scoped
  advisory lock on that triple first. This is a **harness choice, not a production solution**. A test
  keeps the unlocked path to show the duplicates. Delivery does not depend on a checkpoint: tests also
  run with checkpoints disabled, deleted, stale, duplicated and failing.
- The `inbox_receipts.status` vocabulary is not frozen; the harness uses `CLAIMED` (never visible
  after commit) and `APPLIED`, as its own labels.

## Push direction, acknowledgement and durability (C5)

```text
Store (EDGE producer)                                Cloud (CLOUD consumer)
 T0  one transaction: fact + outbox + side row, COMMIT
     (the business fact is durable; delivery is not)
 T1  claim transaction: lease, attempt + 1, COMMIT
 T2  POST /sync/v1/messages:push { peerId, messages[] } ------------->
                                         T3  one transaction: inbox receipt + effect, COMMIT
 <----------- 200 { results[ { messageId, outcome } ] }   (APPLIED | DUPLICATE | QUARANTINED | REJECTED)
 T5  transaction: published_at = now (then a checkpoint, optional), COMMIT
     (local delivery is durable; retries stop)
```

This experiment exercises Store-to-Cloud `push` only. The frozen text defines `push`, `pull`, `ack` and
`compatibility`, but does not say which side calls `ack` or in which direction. `pull` takes a
checkpoint and returns messages and a new checkpoint, and `ack` takes message ids and a checkpoint, so
this document reads them as the Cloud-to-Store direction. That is an interpretation, not frozen text.
For this experiment only, an APPLIED or DUPLICATE result is treated as the delivery
acknowledgement. `pull`, `ack` and `compatibility` are not implemented and no acceptance of those
routes is claimed.

Which losses cause a retry: a lost request (before T3) retries and the Cloud answers APPLIED; a lost
response (after T3, before T5) retries and the Cloud answers DUPLICATE; a Store crash between receiving
the response and T5 retries and the Cloud answers DUPLICATE; a Cloud failure inside T3 rolls back and
the retry answers APPLIED. After T5 there is nothing to retry.

Open: the frozen `push` route lists a 409 "Ownership/compatibility conflict" response and also a
per-message `QUARANTINED` outcome, and does not say when each applies. The harness answers 200 with a
per-message outcome and treats any non-200 reply as a transport failure to retry. That is a harness
choice, not a resolution.

## Loopback experiment (C6)

`TestOnlyLoopbackIngestServer` has no host option, binds `127.0.0.1` on an ephemeral port, checks the
bound address, marks every response `x-minimart-test-only: true`, and serves only `POST
/sync/v1/messages:push`. Its identity is a fixed server-side test constant; a body with a different
`peerId` is refused. There is no mTLS, no enrollment lookup and no authorization, so **no
authentication, enrollment, mTLS or authorization claim is made** and none of these are tested.

## Database foreign keys (item 10)

Reading `database/migrations/0001_v1_2_frozen_baseline.sql`: none of the five frozen sync tables
(`outbox_messages`, `inbox_receipts`, `idempotency_records`, `sync_checkpoints`, `dead_letters`)
declares a foreign key, nothing references them, and the immutable-row triggers are on other tables.
So the harness needs no `org.*` or peer seed rows for those tables. The only foreign key in the
integration schema is on `store_service_instances`, which the harness does not use. This was first
read statically, and `database-assumptions.test.ts` then confirmed it against the real catalog of a
PostgreSQL 17 container (11 tests passed).

## How to run the database-dependent checks

Needed: PostgreSQL 17 with a role that can create databases, Node 22, and the workspace built
(`pnpm install --frozen-lockfile` then `pnpm exec tsc -b`, so `@minimart/database` has its `dist`).
Each test creates and drops uniquely named databases and never touches an existing one.

1. Existing server: set `MINIMART_TEST_POSTGRES_URL` to an administrative URL, for example
   `postgresql://postgres:postgres@localhost:5432/postgres`, then run `pnpm run test:sync-proof`.
2. Docker: start Docker Desktop and run `pnpm run test:sync-proof` with the variable unset. The
   Testcontainers helper then runs `postgres:17-alpine` (the same image the MM-004 helper uses); the
   first run downloads that image. Each test file starts and stops its own container.
3. CI: `.github/workflows/ci.yml` provides a PostgreSQL service and now has a step for
   `pnpm run test:sync-proof`. That workflow runs on pull requests and on pushes to `main`, not on
   pushes to a `wip/` branch, so CI evidence needs a pull request.

Without a reachable PostgreSQL the seven database-dependent files **fail in setup** with
`PostgresUnavailableError` and its instructions. They are never skipped by design; vitest reports
their 48 tests as "skipped" only because the setup hook failed. That outcome is not a pass. A
container start can also fail transiently in setup (seen once, see below); that is an environment
error, not a test result, and the file must be rerun.

## Validation actually run

Run on a development PC in an isolated worktree from `origin/main`:

- `pnpm exec tsc -p tsconfig.test.json --noEmit` (the new harness typecheck, covering `src` and every
  file under `test/`): clean. The production `tsc -b` build is unchanged: it still emits only
  `index.js` and its declaration files, and test files are not part of it.
- ESLint on `packages/sync-protocol`: clean. `pnpm run ci` (Prettier, ESLint, frozen-manifest and
  ownership checks, dependency-boundary checks and `tsc -b`): passed (exit 0).
- The four database-free test files: 4 files, 38 tests passed.
- Mutation checks on those tests, each caught and reverted: a production file referencing the harness,
  a launcher importing a sync-protocol subpath, the contract-version check removed, and the loopback
  host changed to all interfaces.
- First attempt, no PostgreSQL: the 4 database-free files passed and the 7 database-dependent files
  failed in setup with `PostgresUnavailableError` (Docker daemon not running). Exit code 1. Nothing
  from that attempt is a pass.
- Second attempt, after the owner authorized `postgres:17-alpine` through the existing Testcontainers
  setup (Docker 29.8.0; the image was already local, so nothing was pulled). Observed, against a real
  PostgreSQL 17 container per test file, one isolated database pair per file:
  - First run: 84 of 86 passed. Two loopback tests failed: the dispatcher sends the remote peer id in
    the request body, while the test-only server checks for its fixed test identity and answered 400,
    so every push was retried and nothing reached the Cloud database.
  - Defect 1 (harness, fixed): `HttpPushTransport` now puts the fixed test identity on the wire; the
    constructor option `wirePeerId` (null sends the request's own `peerId`) keeps the refusal test
    meaningful. Which peer the frozen `peerId` names stays an OPEN gap.
  - Defect 2 (test, fixed): terminating a worker's backends with `pg_terminate_backend` raised an
    unhandled "Connection terminated unexpectedly" on a checked-out client, which made vitest exit 1
    although the 13 tests passed. The worker pool in that test now listens for client errors.
  - Defect 3 (environment, not a code defect): one container start failed in setup in one full run
    (`PostgresUnavailableError` from `checkpoint.test.ts`, cause not captured). The file passed when
    rerun alone and in the later full runs. Ryuk removed the leftover containers; none remain.
  - After the fixes, the full `pnpm run test:sync-proof` (harness typecheck, then all 11 files) was
    run twice in a row: 11 of 11 files and 86 of 86 tests passed both times, exit 0.
  - Observed checkpoint results (not intentions): the unlocked negative control left two rows for one
    key; the advisory-lock run left one row; delivery completed with checkpoints disabled, with the
    checkpoint deleted or stale between batches, with duplicate checkpoint rows already present, and
    when the checkpoint write itself failed (the failure was reported, delivery was unaffected).
    The negative control is deterministic by construction: a barrier holds both writers after their
    "no row" read until both have arrived, so the duplicate does not depend on scheduling. (An earlier
    note here called it a real race; that was wrong.)
- Pre-checkpoint review (software only), then the full suite again, twice: 11 of 11 files and 90 of
  90 tests passed both times, exit 0. Findings and fixes, all under `packages/sync-protocol/test/`:
  - `wirePeerId`: added database-free tests for both client modes and a database assertion that the
    Cloud stores the server's fixed test peer. The meaning of the frozen `peerId` is still OPEN; the
    tests pin only the harness choice.
  - pg error handling: the worker-pool handlers now record every error, and the test fails unless
    each is the expected termination (message contains "terminat" or code 57P01), so other failures
    are not swallowed. Each `ROLLBACK` in a catch block no longer replaces the original error when
    the connection is already dead.
  - Checkpoint lock test: the 200 ms sleep was replaced by waiting until `pg_locks` shows writer B
    blocked on the advisory lock, then releasing writer A. B's value must win, as an update of A's row.
  - Retry exhaustion: added a test-only `requeueExhausted` helper (a harness choice; the frozen text
    defines no operator procedure for dead letters) and tests for replay after an outage, for replay
    after every response was lost (answered DUPLICATE, one effect), and for a quarantined message
    that is not requeued. Dead-letter rows stay as history.
  - Durable-state assertions added: after a lost response (receipt APPLIED, outbox row released,
    backed off by one base delay, error kept, nothing terminal); after a crash before the send (claim
    held by the abandoned worker, attempt count 1, no receipt); after a Cloud failure part-way through
    a batch (6 receipts for 6 effects, every outbox row unclaimed, undelivered, error recorded).
  - Mutation checks on the new tests, each caught and reverted: requeue made a no-op, writer B
    without the lock, default wire peer changed, termination matcher disabled.

## Not verified, and still pending

- **Database-dependent results are limited to what ran:** one PostgreSQL 17 Alpine container per file
  on one development PC, single worker, a manual clock. They show the harness choices behave as
  described there. They do not show production behavior, because no production sync code exists, and
  they are not CI evidence.
- **Restart evidence:** the "crash" and "restart" cases use abandoned leases, new dispatcher instances
  and `pg_terminate_backend` of the dispatcher's database connections. These are not operating-system
  process restarts. Real process-restart acceptance stays pending unless it is exercised separately,
  which would need a way to run and kill the harness as a separate process (for example a compiled
  entry point or a TypeScript runner).
- Authentication, enrollment, mTLS and authorization; the `pull`, `ack` and `compatibility` routes; the
  frozen conformance suite; real cloud composition; multi-store and multi-tenant operation beyond the
  dedup-scope tests; performance.
- Whether CI passes: not observed (no pull request was created).

## Unresolved contract gaps

1. Domain event name to wire message type mapping (BusinessDayOpened and BusinessDayClosed versus
   BusinessDayStateChanged).
2. `event_version` (integer) versus `contractVersion` (string "1.0").
3. Whether the outbox payload is the wire payload.
4. The meaning and source of `sourceIdentity`, and the source of `storeId` and `occurredAt`, which have
   no outbox column.
5. The sync request `peerId` string versus the inbox `peer_id` uuid, and whether message ids are
   globally unique or only per tenant and peer.
6. Push, ack and checkpoint direction and ownership; 409 versus per-message QUARANTINED.
7. No terminal or dead-letter marker on the outbox row; `dead_letters` has no unique key and no peer;
   `sync_checkpoints` has no unique key on tenant, peer and stream.
8. The `inbox_receipts.status` vocabulary and whether the quarantine of an unknown type needs an
   inbox receipt.
9. Which module owns the SQL for the `integration.*` tables, if any code is later promoted into
   `packages/sync-protocol/src`.
10. Generated validators: the frozen contract wants generated Zod validators with a conformance suite;
    the harness checker is neither.

## Sync engine evaluation (Architecture 35)

No sync engine was evaluated or replaced, and no ADR is needed for this harness. The evidence that
would support the "custom outbox/inbox" design (no duplicate business effect, replay and lost-ACK
recovery, quarantine) comes from the database-dependent tests, which have not run. The schema gaps in
the list above are the constraints discovered so far.

## Suggested production-hardening items (not new backlog)

For MM-113 and the Phase 3 sync work to consider: configurable lease and retry policy, dead-letter
operations, the pull and ack direction, mTLS and enrollment, real cloud projections with their own
reviewed schema, generated validators, observability beyond the backlog snapshot, and a decision on the
terminal-state and checkpoint-uniqueness gaps.

## Status

MM-010 software harness written; non-database checks pass; database-dependent evidence pending.
**MM-010 acceptance is INCOMPLETE.** No Phase-0 gate is waived.
