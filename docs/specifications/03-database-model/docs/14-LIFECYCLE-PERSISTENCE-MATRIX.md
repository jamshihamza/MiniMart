# Lifecycle Persistence Matrix

  -------------------------------------------------------------------------------------------------------------------------
  Aggregate/fact                          Stored states / persistence invariant                     Enforcement
  --------------------------------------- --------------------------------------------------------- -----------------------
  Sale                                    ACTIVE, HELD, PAYMENT, POSTING, COMPLETED, VOIDED,        application transition
                                          ABANDONED; COMPLETED requires `posted_at`; posted         guard + CHECK + row
                                          financial fields immutable                                lock/version

  CheckoutPayment                         open/resolving/completed/reconciliation-needed semantics; application + version
                                          commercial Sale frozen while payment resolving            

  PaymentAttempt                          pending/failed/cancelled/uncertain/committed-compatible   CHECK on stable
                                          outcomes                                                  states + ownership FK

  PaymentCommitment                       durable confirmed monetary outcome; reversal is           append/history + source
                                          new/effective state, not deletion                         uniqueness

  PostedTender                            no mutable lifecycle after insertion                      DB append-only

  SalesReturn                             draft/posting/posted/cancelled-before-post only; posted   application + CHECK
                                          requires `posted_at`                                      

  RefundObligation                        OPEN/PARTIALLY_SETTLED/SETTLED-compatible state;          CHECK + row
                                          `0 <= settled <= obligation`; SETTLED requires full       lock/version
                                          amount                                                    

  RefundExecution                         execution state independent of Return posting             application + version

  PurchaseOrder                           status stored; approval requirement remains DEC-PUR-008   application; no DB
                                                                                                    assumption that
                                                                                                    approval mandatory

  GoodsReceipt                            draft/posting/posted/reversed-by-new-doc; posted          application + CHECK
                                          immutable                                                 

  PurchaseReturn                          draft/posting/posted; posted immutable                    application + CHECK

  StockCount                              draft/counting/review/posting/posted-compatible;          application
                                          concurrency policy remains DEC-INV-003                    

  CashierShift                            open/closing/closed-compatible; simultaneous-shift policy application + version
                                          not constrained                                           

  BusinessDay                             open/closing/closed-compatible; reopen/late policy        application + version
                                          unresolved                                                

  CustomerCollection                      draft/posting/posted; allocations immutable after posting application

  SupplierPayment                         draft/posting/posted; allocations immutable after posting application

  Expense/Transfer/FinancialTransaction   draft/posting/posted; corrections by compensating         application + immutable
                                          transaction                                               movements
  -------------------------------------------------------------------------------------------------------------------------

Only lifecycle facts frozen upstream are CHECK-constrained. Open policy
transitions remain application policy seams.
