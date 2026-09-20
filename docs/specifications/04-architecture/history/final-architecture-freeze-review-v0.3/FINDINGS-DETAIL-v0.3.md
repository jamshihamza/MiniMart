# Residual Final-Review Corrections

## AFR3-MIN-001 --- MINOR / NON-SEMANTIC: One-counter co-location and multi-counter host placement are no longer stated explicitly

**Evidence:** Frozen NFR-DEP-002/003 requires one-counter deployment to
allow POS + Store Node + PostgreSQL on the same Windows PC and
multi-counter deployment to use counters over LAN to the designated
Store Node/database host. v0.1 stated this explicitly; v0.3 remains
compatible but no longer states it.

**Impact:** No architecture contradiction, but a deployment/coding agent
could miss a required supported placement.

**Correction for Architecture v1.0 frozen copy:** Restore explicit
placement wording in Architecture v1.0: one-counter may colocate POS,
Store Node and PostgreSQL on one Windows PC; multi-counter uses one
designated Store Node/database host; placement does not change domain
behavior.

## AFR3-MIN-002 --- MINOR / NON-SEMANTIC: AI-assisted development and release-quality guardrails are only partially explicit

**Evidence:** v0.3 preserves ADR triggers, migration checks and
protected-test checks, but does not explicitly carry forward frozen
NFR-TEST-002 or the approved reference guardrails for spec+acceptance
before agent coding and contract/sync-simulation/ledger CI gates.

**Impact:** No business/domain/database semantic change, but the
architecture package is less complete as the coding-agent handbook.

**Correction for Architecture v1.0 frozen copy:** Add implementation
governance: spec/acceptance first; AI agents may not weaken tests;
production migrations are human-reviewed; material architecture changes
require ADR; CI gates protected domain/ledger, contract and
sync-simulation tests.

## AFR3-MIN-003 --- MINOR / NON-SEMANTIC: Phase-0 carry-forward wording is slightly incomplete

**Evidence:** v0.3 includes packaging, hardware, multilingual
raster-receipt and real sync proof spikes, but the approved Reference
Architecture Phase-0 plan also names sync-engine evaluation and
specifically Malayalam/Malay receipt testing.

**Impact:** The current spikes are compatible and partly stronger, but
approved Phase-0 traceability is not exact.

**Correction for Architecture v1.0 frozen copy:** State that the sync
spike records sync-engine evaluation/decision evidence and that the
target-printer raster test includes Malayalam and Malay when those
scripts are in the pilot scope.
