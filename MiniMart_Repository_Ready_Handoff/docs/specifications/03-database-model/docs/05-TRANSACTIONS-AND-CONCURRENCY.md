# Transactions and Concurrency

## 1. Baseline isolation

Default transaction isolation: PostgreSQL `READ COMMITTED`.

Correctness comes from: - explicit row locks; - version checks; -
uniqueness constraints; - deterministic lock ordering; -
idempotency/source keys.

Do not raise the whole application to SERIALIZABLE without measured
need.

## 2. Deterministic lock order

Within one Posting Envelope:

1.  lock the primary business document/root;
2.  collect all consistency-root UUIDs;
3.  sort each root set by stable UUID byte/text order;
4.  lock roots in documented module order;
5.  revalidate;
6.  append facts/update maintained roots;
7.  insert Audit + Outbox;
8.  commit.

Recommended module lock order:

`Sales/Procurement/Returns document → InventoryPosition → CreditAccount → CashierShift/BusinessDay → Accounting-Lite account/payable → payment settlement rows`

A coordinator must use one documented order to reduce deadlocks.

## 3. Sale posting

Inside one transaction:

1.  lock Sale by `sale_id`;
2.  reject if already posted unless same idempotent result;
3.  lock InventoryPosition rows for all stock lines in sorted ItemId
    order;
4.  revalidate sellable quantity and negative-stock rule;
5.  lock CreditAccount if credit tender is used and revalidate exposure;
6.  lock eligible CashierShift if cash effect applies;
7.  lock required FinancialAccount roots if Accounting-Lite movement is
    produced;
8.  persist Sale posted state/lines;
9.  append StockMovement(s), update InventoryPosition/buckets/WAC/COGS
    state;
10. insert PostedTender(s);
11. append CreditLedgerEntry/CashMovement/FinancialMovement as
    applicable;
12. insert AuditEvent(s) and OutboxMessage(s);
13. commit.

Payment provider calls occur before/after this transaction, never during
it.

## 4. Goods Receipt

PO-linked GRN: - lock GoodsReceipt; - lock PurchaseOrder and affected PO
lines; - revalidate remaining receivable quantity according to
still-open over-receipt policy; - lock affected InventoryPosition
rows; - append stock receipts/update WAC; - create SupplierPayable when
enabled; - audit/outbox; - commit.

Direct-GRN allowance remains a policy seam.

## 5. Sales Return

-   lock SalesReturn;
-   acquire original SaleLine return-consistency keys in stable order;
-   calculate already-effective returned quantity/value from posted
    return facts;
-   reject/route policy if requested return exceeds eligibility;
-   lock InventoryPosition rows;
-   apply disposition bucket movement exactly once;
-   apply credit effect if relevant;
-   create RefundObligation;
-   immediate cash settlement may also lock Shift/account roots;
-   audit/outbox;
-   commit.

The original posted Sale/SaleLine is not mutated.

## 6. Refund settlement

-   no provider call inside transaction;
-   after a confirmed/manual outcome exists, lock RefundExecution and
    RefundObligation;
-   ensure the execution result has not already settled the obligation;
-   append CashMovement/FinancialMovement where applicable;
-   mark obligation settled by exact effective amount/reference;
-   audit/outbox;
-   commit.

No stock movement occurs here.

## 7. Customer credit

`credit_accounts` is locked for posting-time exposure changes.

Ledger insert and maintained outstanding update occur atomically.

## 8. Stock Count

The database provides the required count-scope keys and movement
timestamps but does **not** choose `DEC-INV-003`
lock-vs-snapshot/reconciliation policy.

The final chosen policy must use the same immutable CountAdjustment
stock-movement path.

## 9. Idempotency

Every externally retryable command has a stable idempotency key.

`integration.idempotency_records` stores: - tenant; - operation scope; -
key; - request fingerprint; - status; - resulting aggregate/document
ID; - safe result summary; - timestamps.

Unique `(tenant_id, operation_scope, idempotency_key)` prevents
duplicate logical execution.

## 10. Retry after uncertain commit

If the client loses connection during commit: - retry with the same
idempotency key; - the server returns/reconstructs the already committed
result; - it never blindly repeats the business effect.
