# Frozen Baseline → Architecture Traceability --- v0.3

  --------------------------------------------------------------------------------
  Frozen / approved invariant        v0.3 architecture realization
  ---------------------------------- ---------------------------------------------
  Store operates without internet    Store Node + local PostgreSQL is local
                                     transactional authority

  Store never waits for cloud        Outbox after local commit; cloud async

  13 bounded contexts                13 first-class business modules

  13 Posting Envelopes               13 named application coordinators

  Cross-context local atomicity      one opaque UnitOfWorkSession/shared
                                     PostgreSQL transaction

  Module owns data                   module-scoped repositories; **no cross-module
                                     internal-table reads on command or query
                                     side**

  Audit + Outbox same local          UnitOfWork participants
  transaction                        

  Posted docs/facts immutable        module repositories + frozen DB guards

  Item×Store inventory               Inventory public port + frozen consistency
                                     root/lock

  Moving WAC                         Inventory domain + exact-decimal frozen
                                     persistence

  PaymentAttempt/Commitment/Tender   provider choreography + Sale Posting
  split                              consumption

  RefundObligation Returns-owned     Returns public port

  RefundExecution Payments-owned     provider choreography +
                                     RefundSettlementCoordinator

  External provider outside DB       prepare/call/record/reconcile choreography
  transaction                        

  BusinessDate explicit              server-side BusinessContext resolution
                                     through Cash & Business Day

  Country rules versioned            Country Policy resolver + country-pack
                                     compatibility gate

  Inbox dedup atomic with effect     sync apply UnitOfWork

  Ownership-based sync               registered ownerClass/applyMode; no generic
                                     last-write-wins

  Cloud does not run billing         cloud capability set omits Store Posting
                                     coordinators

  60 Decision seams preserved        exact 60/60 Architecture Decision-Seam Matrix

  Security/manager override          enrolled device + Store Node session +
                                     IAM/override chain

  Reliability/recovery               compatibility write gates, idempotency,
                                     worker leases, reconciliation/rebuild
                                     controls

  Approved implementation stack      `docs/32-TECHNOLOGY-BASELINE.md`

  Same edge/cloud service runtime    shared `service-runtime`; thin edge/cloud
                                     launchers

  Phase-0 risk validation            `docs/33-ARCHITECTURE-VALIDATION-SPIKES.md`
  --------------------------------------------------------------------------------
