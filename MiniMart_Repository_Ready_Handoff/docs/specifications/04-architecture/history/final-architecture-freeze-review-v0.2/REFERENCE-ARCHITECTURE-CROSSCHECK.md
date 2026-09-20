# Approved Reference Architecture → v0.2 Cross-check

The final freeze review explicitly reintroduced the earlier approved
Reference Architecture as an upstream technical authority. Legacy
product naming and business rules superseded by frozen
FRS/Domain/Database artifacts are excluded; non-superseded technical
decisions remain authoritative.

  -------------------------------------------------------------------------
  Reference Architecture  v0.2 state                Review
  baseline                                          
  ----------------------- ------------------------- -----------------------
  No module reads another v0.2 permits cross-module **CONFLICT ---
  module's tables         query SQL/views/joins     AFR-BLK-001**

  SQL-first Kysely or     absent                    **MISSING ---
  Drizzle                                           AFR-BLK-002**

  pg-boss                 broadened to              **WEAKENED ---
                          `pg-boss or equivalent`   AFR-BLK-002**

  Tauri + React + Vite +  Tauri + React retained;   **PARTIAL ---
  Tailwind                Vite/Tailwind absent      AFR-BLK-002**

  TanStack Query +        absent                    **MISSING ---
  Zustand                                           AFR-BLK-002**

  AG Grid Community +     absent                    **MISSING ---
  TanStack Table                                    AFR-BLK-002**

  client-generated UUIDv7 absent from active        **MISSING ---
                          architecture package      AFR-BLK-002**

  OpenAPI + Zod           retained                  PASS

  custom                  outbox/sync retained;     PARTIAL
  outbox/change-feed      `change-feed` not         
                          explicit                  

  same service starts     separate composition      **AMBIGUOUS ---
  edge/cloud mode         roots; same-runtime rule  AFR-MAJ-001**
                          not explicit              

  Argon2                  generic hashing only      **WEAKENED ---
                                                    AFR-MAJ-002**

  BitLocker store-machine absent                    **MISSING ---
  baseline                                          AFR-MAJ-002**

  OS secret store         retained conceptually     PASS

  signed                  absent                    **MISSING ---
  installers/updates                                AFR-MAJ-002**

  packaging/rollback      absent                    **MISSING ---
  Phase-0 spike                                     AFR-MAJ-003**

  non-Latin receipt       absent                    **MISSING ---
  target-printer Phase-0                            AFR-MAJ-003**
  test                                              
  -------------------------------------------------------------------------

## Source evidence used

-   Technology table: Reference Architecture v2 lines 112--134.
-   No-cross-table-read rule: line 219.
-   Edge/cloud same-service mode: line 246.
-   Security baseline: lines 441--450.
-   Packaging and non-Latin receipt risk/spike requirements: lines 128,
    159, 738--742.
