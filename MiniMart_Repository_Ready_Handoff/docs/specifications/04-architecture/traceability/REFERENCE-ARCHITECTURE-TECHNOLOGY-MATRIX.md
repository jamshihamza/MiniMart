# Reference Architecture Technology Traceability --- v0.3

**Source:** Approved Reference Architecture v2, especially Technology
Decisions, modular-monolith rules, security baseline and Phase-0 risk
guidance.

  ----------------------------------------------------------------------------
  Approved technical   v0.3 realization                    Status
  decision                                                 
  -------------------- ----------------------------------- -------------------
  PostgreSQL on Store  `docs/32-TECHNOLOGY-BASELINE.md`;   PRESERVED
  Node                 frozen DB model                     

  Managed PostgreSQL   technology baseline                 PRESERVED
  cloud                                                    

  Node.js + TypeScript technology baseline + shared        PRESERVED
  modular monolith     service runtime                     

  SQL-first Kysely or  technology baseline; ADR chooses    PRESERVED
  Drizzle              one                                 

  pg-boss              technology baseline + worker        PRESERVED
                       architecture                        

  Tauri + React +      technology baseline                 PRESERVED
  Vite + Tailwind                                          

  TanStack Query +     technology baseline                 PRESERVED
  Zustand                                                  

  AG Grid Community +  technology baseline                 PRESERVED
  TanStack Table                                           

  client-generated     technology baseline + frozen DB     PRESERVED
  UUIDv7               UUID storage                        

  OpenAPI + Zod        technology baseline + API boundary  PRESERVED
                       preparation                         

  custom               technology baseline + sync          PRESERVED
  outbox/change-feed   architecture                        

  no module reads      strict module/query rules           PRESERVED
  another module's                                         
  tables                                                   

  same service runtime shared service runtime + thin       PRESERVED
  supports edge/cloud  launchers                           
  modes                                                    

  Argon2, BitLocker,   security/deployment baseline        PRESERVED
  OS secret store,                                         
  signed artifacts                                         

  Phase-0 packaging    architecture validation spikes      PRESERVED
  and non-Latin                                            
  receipt validation                                       
  ----------------------------------------------------------------------------

Any future intentional deviation requires an ADR and must not weaken
frozen Domain/Database invariants.
