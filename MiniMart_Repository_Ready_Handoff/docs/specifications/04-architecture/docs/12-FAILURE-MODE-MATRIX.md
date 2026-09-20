# Failure Mode Matrix --- v0.3

  ---------------------------------------------------------------------
  Failure point                      Required architecture behavior
  ---------------------------------- ----------------------------------
  Cloud unavailable                  local store posting continues;
                                     outbox accumulates

  Store Node unavailable             client shows Store Node
                                     unavailable; no pretend success

  PostgreSQL unavailable             transactional readiness false

  crash during local transaction     PostgreSQL rollback; same
                                     idempotency key safe

  crash after commit before response retry returns/reconstructs
                                     committed result

  crash after outbox commit before   dispatcher retries
  publish                            

  cloud apply succeeds but ACK lost  sender retries; InboxReceipt
                                     deduplicates

  provider call not yet made         durable attempt identity permits
                                     safe resume/cancel according to
                                     adapter contract

  provider succeeds but response is  local state becomes/remaining
  lost                               UNCERTAIN; reconcile using same
                                     provider request identity

  provider succeeds, process crashes reconciliation retrieves provider
  before local confirmation          outcome then records
                                     commitment/execution result;
                                     provider call is not blindly
                                     repeated

  local PaymentCommitment exists but Sale enters recovery-capable
  Sale not completed                 payment state; confirmed money is
                                     retained

  refund provider succeeds before    reconciliation confirms same
  local settlement transaction       RefundExecution; Refund Settlement
                                     envelope settles obligation once

  duplicate worker execution         lease/SKIP LOCKED/unique source
                                     identity prevents duplicate effect

  client/Store Node version          write command refused with
  incompatible                       upgrade-required result

  Store Node/schema incompatible     write readiness refused

  sync contract version incompatible message quarantined/dead-lettered;
                                     no partial apply

  printer timeout after Sale commit  Sale remains posted; print
                                     status/retry visible

  ledger/current-state drift         alert/reconciliation; no silent
                                     history rewrite
  ---------------------------------------------------------------------
