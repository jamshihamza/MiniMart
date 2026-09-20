# Transaction Envelopes and Concurrency Matrix

## 1. Local posting envelopes

  -----------------------------------------------------------------------
  Operation                           Required local atomic effects
  ----------------------------------- -----------------------------------
  Sale posting                        Sale + Inventory
                                      StockMovement/WAC/COGS effects +
                                      PostedTender(s) + Credit effect if
                                      used + CashierShift effect if
                                      enabled + required Accounting-Lite
                                      effect if enabled + Audit + Outbox

  PO-linked Goods Receipt             GoodsReceipt + PO received
                                      allocation/status revalidation +
                                      Inventory receipt/WAC +
                                      SupplierPayable if enabled +
                                      Audit + Outbox

  Direct Goods Receipt                GoodsReceipt + Inventory
                                      receipt/WAC + SupplierPayable if
                                      enabled + Audit + Outbox

  Purchase Return                     PurchaseReturn + source eligibility
                                      revalidation + Inventory issue/WAC
                                      value effect + SupplierPayable
                                      credit/adjustment if enabled +
                                      Audit + Outbox

  Sales Return                        SalesReturn + original SaleLine
                                      eligibility revalidation +
                                      Inventory disposition effect +
                                      Credit effect if applicable +
                                      RefundObligation/immediate
                                      settlement fact + Cash effect if
                                      immediate cash refund + Audit +
                                      Outbox

  Refund settlement                   RefundExecution confirmed result +
                                      RefundObligation settlement +
                                      Cash/FinancialMovement where
                                      applicable + Audit + Outbox

  Stock Count completion              StockCount posting + affected
                                      InventoryPosition adjustment(s) +
                                      StockMovement(s) + Audit + Outbox

  Customer Collection                 CustomerCollection +
                                      CreditLedgerEntry/allocation +
                                      CashierShift effect if cash +
                                      FinancialMovement if enabled +
                                      Audit + Outbox

  Supplier Payment                    SupplierPayment + SupplierPayable
                                      allocation(s) + FinancialMovement +
                                      Audit + Outbox

  Financial receipt/payment           FinancialTransaction +
                                      FinancialMovement + Audit + Outbox

  Account Transfer                    AccountTransfer + source
                                      FinancialMovement + destination
                                      FinancialMovement + Audit + Outbox

  Expense                             Expense + FinancialMovement +
                                      CashierShift cash-out if
                                      drawer-funded + Audit + Outbox

  Manual cash-in/out                  CashMovement + CashierShift
                                      expected-cash effect +
                                      Accounting-Lite FinancialMovement
                                      where configured + Audit + Outbox
  -----------------------------------------------------------------------

External provider calls are never inside these database transactions.

## 2. Posting coordinator rule

An application coordinator owns the Unit of Work, not the business data.

It calls owning modules in deterministic order, receives validated state
changes/events, persists through module repositories in one local
transaction and writes Audit/Outbox before commit.

No coordinator contains country tax formulas, costing formulas or
provider-specific logic.

## 3. Concurrency consistency keys

  -----------------------------------------------------------------------------------------
  Race/invariant        Consistency key       Owner             Required posting-time
                                                                behavior
  --------------------- --------------------- ----------------- ---------------------------
  Same held Sale        SaleId                Sales             version/claim revalidation;
  completed twice                                               at most one completion

  Concurrent stock      ItemId + StoreId      Inventory         serialize/revalidate
  changes                                                       quantity/WAC; no lost
                                                                update

  PO over-receipt race  PurchaseOrderId +     Procurement       revalidate remaining
                        POLineId                                receivable before GRN
                                                                commit

  Duplicate logical GRN GoodsReceipt/source   Procurement       exactly one effective
                        idempotency +                           posting / policy-controlled
                        supplier-reference                      duplicate handling
                        policy scope                            

  Sales over-return     OriginalSaleId +      Returns/Sales     revalidate cumulative
                        SaleLineId            source guard      effective returned
                                                                qty/value before commit

  Purchase over-return  SourceGRNId +         Procurement       revalidate remaining
                        GRNLineId where                         returnable quantity
                        linked                                  

  Concurrent credit     CreditAccountId       Customer & Credit revalidate
  sales                                                         exposure/eligibility and
                                                                apply ledger effect
                                                                atomically

  Customer profile edit CustomerId            Customer & Credit optimistic/conflict-aware
                                                                material edit

  Supplier payable      SupplierPayableId     Accounting-Lite   revalidate unallocated
  allocation                                                    outstanding before
                                                                allocation

  Financial account     FinancialAccountId    Accounting-Lite   no lost/duplicate movement;
  movement ordering     where balance                           exact source identity
                        constraint requires                     

  Shift                 configured            Cash & Business   enforce approved
  open/close/movement   Counter/Drawer        Day               active-shift count and
                        scope +                                 close/movement ordering
                        CashierShiftId                          

  Business Day          BusinessDayId         Cash & Business   validate OPEN/CLOSE state
  close/late posting                          Day               according to policy

  Stock Count           Count scope +         Inventory         obey DEC-INV-003; never
                        affected Item/Store                     silent last-write-wins
                        keys                                    

  Item barcode          CompanyId +           Catalog           uniqueness check must be
  uniqueness            normalized Barcode                      race-safe

  Retry of posted       IdempotencyKey +      owning context    return/recover same
  business command      logical source                          effective outcome; no
                        identity                                duplicate effects
  -----------------------------------------------------------------------------------------

## 4. Deadlock/order design handoff

The Domain Model requires deterministic acquisition of multiple
consistency roots. The Database Model shall define concrete PostgreSQL
ordering/locking/version strategy.

A physical strategy is acceptable only if it preserves all business
invariants above.

## 5. Offline rule

All Phase-1 local consistency checks required for store trading use
Store Node/local PostgreSQL state. Cloud unavailability cannot be used
as a substitute consistency lock.
