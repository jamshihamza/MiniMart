# Application Coordinators and UnitOfWork --- v0.3

## Coordinator catalog

1.  `SalePostingCoordinator`
2.  `GoodsReceiptPostingCoordinator`
3.  `PurchaseReturnPostingCoordinator`
4.  `SalesReturnPostingCoordinator`
5.  `RefundSettlementCoordinator`
6.  `StockCountPostingCoordinator`
7.  `CustomerCollectionPostingCoordinator`
8.  `SupplierPaymentPostingCoordinator`
9.  `FinancialTransactionPostingCoordinator`
10. `AccountTransferPostingCoordinator`
11. `ExpensePostingCoordinator`
12. `ManualCashInCoordinator`
13. `ManualCashOutCoordinator`

## Concrete UnitOfWork contract

``` text
UnitOfWork.execute(commandContext, work)
  begin transaction
  create opaque UnitOfWorkSession(transactionId)
  bind module repository factories to the same session
  invoke work(session)
  append/finalize required Audit + Outbox + idempotency result
  commit exactly once
  dispose session
```

`UnitOfWorkSession` exposes no raw pool and no public
`commit()`/`rollback()`.

A module application service receives a module-scoped
`RepositorySession` created from the UnitOfWorkSession. The module
session exposes only repositories owned by that module. Repository
adapters cannot open a nested independent transaction during a Posting
Envelope.

## Transaction capability rule

The transaction handle is opaque outside infrastructure. Coordinators
compose **public module application ports**, not repository
implementations. Domain objects never receive a DB transaction object.

## Locking

`ConsistencyLockService`, owned by database infrastructure, implements
the frozen deterministic lock order and the single canonical
advisory-lock key derivation for cumulative SaleLine/GRNLine return
eligibility.

## Failure

Any exception before commit rolls back the whole local envelope. If
commit outcome is uncertain to the caller, the same command idempotency
key is used to retrieve/reconstruct the committed result.
