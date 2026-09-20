# Final Architecture Freeze Findings

## AFR-BLK-001 --- BLOCKER: Cross-module query SQL contradicts the approved module-ownership rule

**Evidence:** v0.2 explicitly permits packages/query to execute approved
read-only SQL/views or joins across schemas. The approved Reference
Architecture states that modules communicate through typed
interfaces/event bus and that no module reads another module's tables.

**Impact:** Freezing v0.2 would create an architecture exception that
weakens a previously approved module boundary and can couple
reporting/search directly to internal schemas.

**Required remediation:** Remove direct cross-module internal-table
reads. Cross-module reporting/search must compose public module query
contracts or consume dedicated read models/projections built from public
events/contracts. A projection may own its own reporting tables, but it
must not treat another module's internal schema as its API.

## AFR-BLK-002 --- BLOCKER: Reference Architecture technology baseline is not freeze-traceable and one explicit choice is weakened

**Evidence:** The v0.2 upstream list omits the approved Reference
Architecture. Active v0.2 does not freeze Kysely/Drizzle, Vite/Tailwind,
TanStack Query/Zustand, AG Grid Community/TanStack Table or UUIDv7, and
changes the explicit pg-boss decision to 'pg-boss or equivalent'.
OpenAPI+Zod is retained.

**Impact:** A v1.0 architecture freeze would no longer be sufficient to
reconstruct the approved implementation stack, and coding agents could
legitimately choose incompatible alternatives.

**Required remediation:** Add an authoritative Technology
Baseline/traceability matrix and carry forward every non-superseded
approved choice: PostgreSQL; managed PostgreSQL; Node.js+TypeScript
modular monolith; SQL-first Kysely or Drizzle; pg-boss;
Tauri+React+Vite+Tailwind; TanStack Query+Zustand; AG Grid
Community/TanStack Table; client-generated UUIDv7; OpenAPI+Zod; custom
outbox/change-feed. Any intentional replacement requires an ADR.

## AFR-MAJ-001 --- MAJOR: Edge/cloud runtime packaging no longer clearly preserves the same-service mode decision

**Evidence:** The approved Reference Architecture says the same service
starts in edge or cloud mode and toggles modules/jobs. v0.2 presents
Store and Cloud as separate composition roots without explicitly
preserving one shared runtime service implementation.

**Impact:** The implementation could drift into two service applications
with duplicated bootstrap/runtime behavior.

**Required remediation:** State that edge and cloud use the same Node
service runtime/composition framework with explicit mode/capability
registration. Thin deployment launchers are acceptable; duplicated
business/runtime implementations are not. Preserve the rule that cloud
mode omits Store Posting authority.

## AFR-MAJ-002 --- MAJOR: Approved security implementation baseline is weakened or omitted

**Evidence:** v0.2 says passwords/PINs are hashed and secrets use
OS-protected storage, but does not retain the approved Argon2 choice,
BitLocker store-machine baseline, signed installers/updates, dependency
scanning or parameterized-SQL requirement.

**Impact:** Security-sensitive implementation choices would become
optional during coding even though they were already approved.

**Required remediation:** Restore these as explicit architecture
requirements, while keeping SQLite encryption deferred with survival
mode. Argon2 parameters/version must remain upgradeable rather than
inventing fixed cost values.

## AFR-MAJ-003 --- MAJOR: Phase-0 architecture risk gates are absent

**Evidence:** The approved architecture identifies Windows
packaging/service registration/upgrades/rollback as the biggest
technical risk and requires a Phase-0 spike; it also requires
exact-printer testing for non-Latin raster receipts. v0.2 has
deployment/hardware contracts but no explicit pre-feature architecture
spike gate.

**Impact:** Development could start feature implementation before
validating the highest-risk deployment and receipt/hardware assumptions.

**Required remediation:** Add Architecture Validation Spikes: Windows
installer/service/PostgreSQL upgrade+rollback; printer/scanner hardware;
non-Latin receipt raster test on target printer; and minimal Store
Node→Outbox→Cloud→Inbox/Dedup→ACK sync proof.

## AFR-MIN-001 --- MINOR: Provider arrow in dependency diagram is directionally misleading

**Evidence:** diagrams/REFINED-ARCHITECTURE.md shows External Providers
→ Infrastructure while the prose correctly says provider adapters depend
inward on MiniMart ports.

**Impact:** Documentation-only ambiguity.

**Required remediation:** Redraw the diagram so MiniMart adapter
invocation of an external provider is distinct from inward
code-dependency direction.
