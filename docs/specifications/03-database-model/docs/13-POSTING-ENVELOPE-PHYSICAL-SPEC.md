# Posting Envelope Physical Specification

All envelopes use one PostgreSQL transaction for local effects,
deterministic locks, idempotency, Audit and Outbox. External
provider/network actions occur outside the transaction.

  ----------------------------------------------------------------------------------------------------------------------------------
  \#             Envelope          Lock / serialize         Revalidate                 Local writes before Audit + Outbox
  -------------- ----------------- ------------------------ -------------------------- ---------------------------------------------
  1              Sale Posting      Sale →                   sale not already posted;   Sale/lines posted; StockMovements +
                                   InventoryPositions       stock; credit; shift;      positions; PostedTenders; optional
                                   sorted ItemId →          commitments                CreditLedger/CashMovement/FinancialMovement
                                   CreditAccount if used →                             
                                   Shift → FinancialAccount                            

  2              Goods Receipt     GRN → PO/PO lines if     PO remaining qty under     GRN/lines; StockMovements; WAC/positions;
                                   linked →                 current policy; receipt    optional SupplierPayable
                                   InventoryPositions       idempotency                
                                   sorted ItemId →                                     
                                   SupplierPayable source                              
                                   key                                                 

  3              Purchase Return   PurchaseReturn →         cumulative effective       PurchaseReturn/lines; StockMovements at
                                   advisory lock per source purchase-return qty/value; current WAC; supplier credit/payable
                                   GRNLine →                stock                      allocation fact
                                   InventoryPositions →                                
                                   SupplierPayable if                                  
                                   affected                                            

  4              Sales Return      SalesReturn → advisory   cumulative effective       Return/lines; StockMovements/buckets; credit
                                   lock per original        returned qty/value;        effect; RefundObligation; optional immediate
                                   SaleLine →               disposition; credit/cash   cash settlement
                                   InventoryPositions →     eligibility                
                                   CreditAccount → Shift if                            
                                   immediate cash                                      

  5              Refund Settlement RefundExecution →        outcome confirmed/manual;  RefundAttempt/Execution state; obligation
                                   RefundObligation →       remaining obligation;      settlement; Cash/Financial movement
                                   Shift/FinancialAccount   source not already         
                                                            materialized               

  6              Stock Count       StockCount →             count status; observed vs  Count posted; CountAdjustment StockMovements;
                 Posting           policy-specific count    current according to       positions
                                   scope mutex →            unresolved count policy    
                                   InventoryPositions                                  

  7              Customer          CustomerCollection →     account/status; allocation Collection; allocations; CreditLedgerEntry;
                 Collection        CreditAccount →          policy result supplied by  Cash/Financial movement
                                   Shift/FinancialAccount   application                

  8              Supplier Payment  SupplierPayment →        payable outstanding;       Payment; allocations; FinancialMovement;
                                   SupplierPayables sorted  allocation result; source  payable maintained state
                                   ID → FinancialAccount    idempotency                

  9              Financial         FinancialTransaction →   account active;            transaction posted; FinancialMovement
                 Receipt/Payment   FinancialAccount         amount/source uniqueness   

  10             Account Transfer  AccountTransfer →        accounts active/different; transfer posted; two balanced
                                   FinancialAccounts sorted currency/policy            FinancialMovements
                                   ID                                                  

  11             Expense           Expense →                category/account/status;   expense posted; FinancialMovement and
                                   FinancialAccount and     approval supplied by       optional CashMovement
                                   Shift if cash drawer     policy                     
                                   source                                              

  12             Manual Cash-In    command idempotency →    shift eligible;            CashMovement; maintained expected cash
                                   Shift                    reason/authorization       

  13             Manual Cash-Out   command idempotency →    shift eligible;            CashMovement; maintained expected cash
                                   Shift                    reason/authorization;      
                                                            policy-supplied approval   
  ----------------------------------------------------------------------------------------------------------------------------------

## Deterministic lock order

`Primary document/root → source eligibility mutexes → InventoryPosition → CreditAccount → Shift/BusinessDay → SupplierPayable → FinancialAccount → settlement rows`

Within one root type, sort stable UUIDs before locking.

## Return eligibility serialization

Posted SaleLine and GRNLine values remain immutable. They are not
updated as counters.

For each original source line, the coordinator obtains a
transaction-scoped PostgreSQL advisory lock derived from a
collision-resistant 64-bit hash of:

`tenant_id | source_type | source_line_id`

Under that lock it calculates cumulative **effective posted** return
quantity/value, validates the requested return, posts the new return and
commits. Concurrent returns for the same source line therefore serialize
without mutating the source line.

The lock helper is centralized; callers cannot invent different key
derivations.

## Failure rule

Any local write failure rolls back the entire envelope. Provider success
already obtained externally is represented by durable
commitment/execution state and recovered/reconciled; the local
transaction is not partially committed.
