# Deployment, Packaging and Updates --- v0.3

## Compatibility dimensions

-   Desktop client ↔ Store Node API
-   Store Node build ↔ PostgreSQL schema
-   Store Node ↔ sync protocol
-   Cloud build ↔ sync protocol
-   core ↔ country-pack contract
-   Tauri client ↔ hardware-port/adapter contract

Each build declares supported minimum/maximum ranges.

## Signed release artifacts

Production Store Node installers, Tauri desktop installers and update
artifacts are digitally signed. Update/install flow verifies the
expected signature before activation. Signing keys are held outside
source control and normal application configuration.

## Safe upgrade sequence

1.  Verify backup/recovery gate required by migration risk.
2.  Verify release artifact signature.
3.  Ensure cloud/sync supports overlapping protocol versions.
4.  Apply only compatible **expand** schema changes under migration
    lock.
5.  Deploy Store Node supporting old/new client contract during
    transition.
6.  Verify Store Node readiness/reconciliation.
7.  Upgrade desktop clients.
8.  Activate new configuration/country-pack version only when
    compatible.
9.  Contract old schema/API only in a later release after old
    clients/builds are outside support.

## Rollback

Application rollback is allowed only while the previous build still
supports the current schema/protocol. Otherwise use forward-fix or
approved restore/recovery. Destructive reverse migrations must not
rewrite immutable business history.

A failed/incomplete migration or unsupported schema version leaves Store
Node non-write-ready.

## Phase-0 packaging gate

Before feature-heavy implementation, the architecture spike in
`docs/33-ARCHITECTURE-VALIDATION-SPIKES.md` must prove Windows
installation/service registration, PostgreSQL lifecycle, upgrade and
rollback behavior on a representative target machine.

## Supported Store placement --- frozen carry-forward

**One-counter deployment:** POS, Store Node and PostgreSQL may be
colocated on the same supported Windows PC.

**Multi-counter deployment:** one designated Store Node/database host
runs Store Node + PostgreSQL; POS and Back Office clients connect to it
over the store LAN.

Placement changes process location only; it does not change domain
behavior, module ownership, Posting Envelope semantics, database
authority or sync rules.
