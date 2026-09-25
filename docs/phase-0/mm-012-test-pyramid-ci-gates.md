# MM-012 test pyramid and CI gates

## Scope and authority

MM-012 adds release-quality gates for the implemented Phase-0 foundation. It follows
the frozen backlog MM-012 acceptance, NFR-TEST-001 through NFR-TEST-004,
Architecture implementation governance, and the frozen API-SYS-001/002 contracts.
It does not implement domain, sync, hardware, installer, or business behavior.

## Inventory and pyramid

| Level                  | Existing evidence now gated                                                                                                                                    | Responsibility                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Fast/static/unit       | Prettier, ESLint, TypeScript, dependency-boundary checker and its tests, frozen-manifest check, test-ownership check                                           | Linux CI                                           |
| Module/service         | Store Node lifecycle, startup cleanup, readiness, HTTPS projection, enrollment checks; POS component, keyboard, connectivity and malformed-response tests      | Linux CI                                           |
| PostgreSQL integration | 29 real PostgreSQL tests: migration ledger/checksum/lock/recovery, compatibility, health, drift, schema equivalence, and CR-DB-002/003/004 effective authority | Linux CI                                           |
| Native/acceptance      | Root Rust hardware-port scaffolds and separate Tauri host format/check/Clippy; prior real Windows mTLS/native POS acceptance                                   | Windows CI compile gates; manual native acceptance |

Domain modules, application coordinators, and sync protocol remain scaffolds. They
have no executable business or sync simulation tests. The protected-test ownership
gate fails when implemented source appears in one of these packages without a
runnable package test script. This is a future-work guard, not a substitute for
domain, posting, or sync behavior tests. Those semantic gates become executable
when the corresponding approved backlog work implements the behavior. The UI
smoke gate is the existing POS component suite and production build; no GUI
automation framework is added.

## CI structure

The Linux job installs with `pnpm install --frozen-lockfile`, runs the static
aggregate, then names and runs the database, service-runtime, POS, and frontend
build gates separately. PostgreSQL 17 is supplied as a CI service through
`MINIMART_TEST_POSTGRES_URL`. Locally, MM-004 tests use that variable when set or
start isolated PostgreSQL 17 through the existing Testcontainers harness. Tests
continue to create and clean up their own databases.

The Windows job uses Rust 1.85.0 and runs rustfmt, locked `cargo check`, and
Clippy with warnings denied for both the root hardware-port workspace and the
separate POS Tauri host. The root workspace now has a lockfile; the Tauri host
retains its own accepted lockfile. These checks prove compilation, not WebView2
window behavior. Native Windows launch, visual review, and real certificate-store
mTLS acceptance remain the MM-005/MM-006 manual evidence. Headless CI does not
claim an equivalent native integration run.

## Authority, contract, and security protection

The authority check verifies SHA-256 hashes and byte counts for 419 files in the
seven adopted frozen specification/backlog manifests. It accepts Windows CRLF
checkout normalization while comparing canonical LF bytes. A controlled authority
update must update its manifest through the approved review process; an accidental
edit with an unchanged manifest fails clearly.

The service-runtime tests assert the exact API-SYS-001 and API-SYS-002 response
shapes, including the absence of readiness `status`, and test validated enrolled
device fingerprints. POS tests require valid liveness and all three readiness
gates before Online and reject malformed/non-200 responses. CI never disables TLS
verification or commits development certificates. Missing/untrusted client and
server trust failures were demonstrated on the actual Windows mTLS path in MM-006;
the headless CI suite uses lower-level security assertions without representing
them as a native certificate-store acceptance test.

## Local commands

From the repository root:

```text
pnpm run ci
pnpm run test:database
pnpm run test:service-runtime
pnpm run test:pos-shell
pnpm --filter @minimart/pos-terminal build
pnpm run check:rust
pnpm run validate:phase0
```

`pnpm run validate:phase0` runs the complete local sequence. Rust 1.85.0 and Cargo
must be on PATH for the Rust gate. Database tests require Docker/Testcontainers
or `MINIMART_TEST_POSTGRES_URL` pointing to a real PostgreSQL 17 instance.

## Deliberate limits and validation

No coverage percentage, SaaS service, browser E2E, GUI automation, or new test
framework was added. Domain, country-pack, posting, sync simulation, hardware
failure, payment uncertainty, and restore-drill semantic tests await their
approved implementations and acceptance programs. The workflow configuration
was checked locally; an actual GitHub Actions run requires a pushed branch and
has not been claimed for this uncommitted MM-012 change set.
