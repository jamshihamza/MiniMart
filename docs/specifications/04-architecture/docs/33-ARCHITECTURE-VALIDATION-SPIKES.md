# Architecture Validation Spikes --- Phase 0

These are architecture-risk gates, not optional feature work. They must
be completed before feature-heavy Phase 1 implementation.

## Spike A --- Windows packaging, service and rollback

**Goal:** prove the highest-risk deployment path.

Build a minimal signed development/pilot package containing: - Tauri
desktop shell; - Node.js Store Node Windows Service; - PostgreSQL
installation/connection/bootstrap path; - service
registration/start/stop/restart; - schema migration execution under
migration lock; - application upgrade; - supported rollback/forward-fix
path.

**Pass evidence:** - clean install succeeds on representative supported
Windows hardware; - Store Node starts automatically and reconnects to
PostgreSQL; - upgrade preserves data; - failed/unsupported migration
leaves Store Node non-write-ready; - rollback is demonstrated only
within declared compatibility range; - uninstall/repair behavior is
documented; - no business data is silently deleted.

## Spike B --- printer/scanner/hardware boundary

**Goal:** validate the Rust/Tauri hardware abstraction on real target
hardware.

Test: - barcode scanner input path; - receipt printer status and
print; - cash-drawer trigger where supported; - hardware
disconnect/reconnect/error reporting.

**Pass evidence:** hardware command outcomes map to the frozen hardware
lifecycle and do not require POS business code to import device-specific
SDK logic.

## Spike C --- non-Latin receipt raster test

**Goal:** prove receipt output for scripts not supported by the
printer's built-in fonts.

Render a representative multilingual receipt to bitmap/raster in the
Rust printing path and print it on the exact pilot printer model.

**Pass evidence:** readable output, acceptable speed, correct width/cut
behavior and a documented fallback/error state.

## Spike D --- minimal real sync proof

**Goal:** validate the frozen sync boundary before large-scale cloud
work.

Implement the smallest end-to-end path:

`Store Node → same-transaction Outbox → dispatcher → Cloud ingest → Inbox dedup → cloud projection/effect → ACK/checkpoint`

Test: - duplicate delivery; - lost ACK; - Store restart; - Cloud
outage; - replay after reconnect; - incompatible contract version
quarantine.

**Pass evidence:** no duplicate business effect, no Store posting
dependency on cloud, stable event/message identity, and observable
retry/backlog state.

## Gate output

Each spike produces: - short runbook; - captured test evidence; -
discovered constraints; - ADR only if an approved architecture decision
must change; - backlog items for production hardening.

A failed spike blocks architecture-dependent feature work until the risk
is remediated or an explicit ADR is approved.

## Exact Phase-0 traceability

The sync proof also records sync engine evaluation evidence against the
approved custom Outbox/Inbox change-feed design. Any replacement
requires an ADR.

Where in pilot scope, the exact target receipt printer is tested with
rasterized Malayalam and Malay receipt content, including readability,
width/layout, speed, cut behavior and fallback/error handling.
