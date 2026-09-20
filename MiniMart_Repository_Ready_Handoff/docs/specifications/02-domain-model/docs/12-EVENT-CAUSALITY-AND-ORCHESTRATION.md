# Event Causality and Orchestration

## 1. Event ownership

Each domain event has exactly one owning producer.

Representative ownership:

  -----------------------------------------------------------------------
  Event                               Producer
  ----------------------------------- -----------------------------------
  SalePosted                          Sales

  PaymentCommitted                    Payments / CheckoutPayment

  TenderPosted                        Payments / CheckoutPayment

  StockIssued / StockReceived /       Inventory
  StockAdjusted                       

  SalesReturnPosted                   Returns

  RefundObligationCreated /           Returns
  RefundObligationSettled             

  RefundExecutionStarted /            Payments / RefundExecution
  RefundExecutionConfirmed /          
  RefundExecutionFailed /             
  RefundExecutionUncertain            

  CreditChargePosted / CreditApplied  Customer & Credit
  / CustomerCollectionPosted          

  CashMovementPosted /                Cash & Business Day
  CashierShiftClosed /                
  BusinessDayClosed                   

  SupplierPayableCreated /            Accounting-Lite
  SupplierPaymentPosted /             
  FinancialMovementPosted /           
  ExpensePosted                       
  -----------------------------------------------------------------------

## 2. Same-envelope events

One Posting Envelope may produce several events from different owning
contexts.

Example Sale posting: - Sales → `SalePosted` - Payments →
`TenderPosted` - Inventory → `StockIssued` - Customer & Credit →
`CreditChargePosted` if applicable - Cash & Business Day →
`CashMovementPosted` if applicable

They share: - `PostingEnvelopeId`; - correlation identity; - source
command/idempotency identity; - BusinessContext.

No event is considered committed until the shared local transaction
commits.

## 3. Causation

`causationId` identifies the command/event that directly caused the
fact.\
`correlationId` groups the wider business flow.\
`PostingEnvelopeId` groups facts committed in one local transaction.

Example refund: 1. Returns creates RefundObligation. 2. Payments creates
RefundExecution/attempt. 3. provider/manual result confirms settlement.
4. RefundSettlementCoordinator atomically records Payments result +
Returns obligation settlement + money movement. 5. Payments emits
`RefundExecutionConfirmed`; Returns emits `RefundObligationSettled`.

These are related but not duplicate ownership claims.

## 4. Local invariants are synchronous

Outbox/event consumption must **not** be used to eventually repair: -
missing stock from a posted Sale; - missing PostedTender from a
completed Sale; - missing credit effect; - missing Return inventory
effect; - missing supplier liability where required in the same local
boundary.

Those effects belong inside the local Posting Envelope.

## 5. Events suitable for asynchronous consumers

After commit, outbox events may drive: - cloud synchronization; -
reporting projections; - notifications; - integrations; -
diagnostics/monitoring; - later e-invoice/export workflows.

Consumers must be idempotent.

## 6. Avoiding cyclic module dependencies

Sales does not call Payments internals and Payments does not call Sales
internals. `SalePostingCoordinator` composes both public ports.

Returns/Payments use the same pattern through `ReturnPostingCoordinator`
and `RefundSettlementCoordinator`.

This preserves a modular monolith without hidden bidirectional table
coupling.
