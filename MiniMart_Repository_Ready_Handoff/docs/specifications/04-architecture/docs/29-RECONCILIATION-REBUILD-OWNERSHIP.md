# Reconciliation and Rebuild Ownership

  --------------------------------------------------------------------------
  Maintained state         Reconciliation owner Immutable evidence
  ------------------------ -------------------- ----------------------------
  InventoryPosition /      Inventory            StockMovement + stored cost
  buckets / WAC                                 evidence

  CreditAccount            Customer & Credit    CreditLedgerEntry
  outstanding                                   

  CashierShift expected    Cash & Business Day  CashMovement + opening float
  cash                                          

  FinancialAccount current Accounting-Lite      FinancialMovement
  balance                                       

  Supplier payable         Accounting-Lite      payable/payment/allocation
  allocation/outstanding                        facts

  PO received/remaining    Procurement          posted GRN/return facts
  state                                         

  Outbox/inbox progress    Integration          message/inbox/outbox
  integrity                                     identities
  --------------------------------------------------------------------------

## Detection

Scheduled or support-invoked reconciliation is read/recompute first.
Drift creates diagnostic evidence and alert; it does not auto-edit
history.

## Repair

A `MaintenanceRebuildCoordinator` may invoke a module's explicit rebuild
port only under privileged maintenance authorization, with
backup/recovery gate where material and append-only Audit evidence.

Preferred repair is rebuilding maintained state from immutable facts. If
immutable evidence itself is inconsistent, normal support tooling stops
and escalates to reviewed recovery/change control.

No support job writes another module's tables directly.
