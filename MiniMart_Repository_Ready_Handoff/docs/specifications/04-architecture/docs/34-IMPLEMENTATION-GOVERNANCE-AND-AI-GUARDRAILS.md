# Implementation Governance and AI Guardrails --- v1.0 FROZEN

Before implementation, the relevant frozen specification and
architecture constraints are identified, concise acceptance criteria are
defined, affected invariants/Posting Envelopes/Decision seams/protected
tests are identified, and OPEN/VERIFY/PROPOSED/DEFERRED decisions are
not silently guessed.

AI coding agents and developers **must not delete, weaken, skip, bypass
or rewrite protected tests merely to make implementation pass**.
Protected suites include domain/ledger, money/costing, Posting Envelope
atomicity/idempotency, API/module contract,
sync-simulation/duplicate/lost-ACK/replay,
crash/retry/concurrency/offline, migration-compatibility and
restore/recovery tests.

Production migrations are explicit, versioned, **human-reviewed**,
automatically checked in CI, tested on supported upgrade paths and
prohibited from silently rewriting immutable history.

Material architecture changes require an ADR and human review.

CI blocks release when required protected domain/ledger tests,
API/module contract tests, sync-simulation tests, migration checks, type
checks or dependency/security scans fail.

AI agents implement approved scope; they are not the authority for
unresolved accounting, inventory, tax, compliance, payment or
synchronization policy.
