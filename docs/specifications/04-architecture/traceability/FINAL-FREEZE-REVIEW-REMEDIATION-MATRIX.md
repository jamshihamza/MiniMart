# v0.2 Final Architecture Freeze Review → v0.3 Remediation Matrix

  -------------------------------------------------------------------------------------------------------------------------
  Finding       Severity   v0.3 status  Evidence                                                      Remediation
  ------------- ---------- ------------ ------------------------------------------------------------- ---------------------
  AFR-BLK-001   BLOCKER    REMEDIATED   `docs/01-MODULE-BOUNDARIES.md`;                               Removed cross-module
                                        `docs/20-READ-QUERY-ARCHITECTURE.md`;                         schema-read
                                        `docs/31-DEPENDENCY-BOUNDARY-ENFORCEMENT.md`; ARCH-007/024    exception.
                                                                                                      Query/reporting
                                                                                                      composes public ports
                                                                                                      or owns approved
                                                                                                      projections.

  AFR-BLK-002   BLOCKER    REMEDIATED   `docs/32-TECHNOLOGY-BASELINE.md`;                             Restored all
                                        `traceability/REFERENCE-ARCHITECTURE-TECHNOLOGY-MATRIX.md`;   non-superseded
                                        ARCH-034                                                      approved technology
                                                                                                      choices. pg-boss is
                                                                                                      exact; Kysely/Drizzle
                                                                                                      is the allowed
                                                                                                      selection set.

  AFR-MAJ-001   MAJOR      REMEDIATED   `docs/03-STORE-NODE-RUNTIME.md`;                              One shared Node
                                        `diagrams/STORE-CLOUD-COMPOSITION.md`; ARCH-035               service
                                                                                                      runtime/composition
                                                                                                      framework with thin
                                                                                                      edge/cloud launchers
                                                                                                      and mode-specific
                                                                                                      capabilities.

  AFR-MAJ-002   MAJOR      REMEDIATED   `docs/07-SECURITY-AND-TRUST-BOUNDARIES.md`;                   Restored Argon2,
                                        `docs/13-DEPLOYMENT-PACKAGING-AND-UPDATES.md`; ARCH-036       BitLocker, OS secret
                                                                                                      store, parameterized
                                                                                                      SQL, dependency
                                                                                                      scanning and signed
                                                                                                      installers/updates.

  AFR-MAJ-003   MAJOR      REMEDIATED   `docs/33-ARCHITECTURE-VALIDATION-SPIKES.md`; deployment doc;  Restored Phase-0
                                        ARCH-037                                                      Windows
                                                                                                      packaging/rollback,
                                                                                                      hardware/non-Latin
                                                                                                      receipt and minimal
                                                                                                      sync proof gates.

  AFR-MIN-001   MINOR      CORRECTED    `diagrams/REFINED-ARCHITECTURE.md`                            Separated inward code
                                                                                                      dependency from
                                                                                                      outbound runtime
                                                                                                      provider invocation.
  -------------------------------------------------------------------------------------------------------------------------

## Result

-   Final-review blockers: **2 / 2 remediated**
-   Final-review major findings: **3 / 3 remediated**
-   Final-review minor findings: **1 / 1 corrected**
-   Frozen Domain/Database semantics changed: **0**
