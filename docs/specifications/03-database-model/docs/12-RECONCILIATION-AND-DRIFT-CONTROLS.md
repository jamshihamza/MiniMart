# Reconciliation and Drift Controls

## Inventory

For each Item × Store:

`InventoryPosition.on_hand_qty = SUM(effective StockMovement.quantity_delta)`

When disposition buckets are active:

`InventoryPosition.on_hand_qty = SUM(InventoryBucketPosition.quantity)`

and each bucket quantity is reproducible from bucket-affecting
StockMovements.

WAC is reproduced from ordered acquisition/cost movements using the
frozen moving-WAC algorithm and stored WAC evidence.

## Customer Credit

`CreditAccount.outstanding_amount = posted charges - effective credits - effective collections + approved debit adjustments`

Every maintained update has one immutable `CreditLedgerEntry` with
unique logical source identity.

## Cash Shift

`expected_cash = opening_float + cash_sales + cash_collections + approved_cash_in - cash_refunds - approved_cash_out`

Each non-opening term is backed by one immutable `CashMovement`.

`variance = actual_cash - expected_cash`

No reconciliation routine silently changes source
Sales/Returns/Collections.

## Financial Account

`current_balance = opening_balance + SUM(effective FinancialMovement.amount)`

Transfers produce two linked movements whose signed amounts balance
according to currency policy.

## Drift detection

Scheduled/diagnostic reconciliation runs compare maintained values to
immutable facts and record: - root identity; - expected recomputed
value; - stored value; - delta; - first detected time; - source
range/checkpoint; - diagnostic correlation ID.

Normal runtime does not auto-repair drift.

## Repair

Repair requires privileged maintenance mode, backup/restore point,
reviewed reconciliation evidence and an AuditEvent. Prefer rebuilding
maintained state from immutable facts. Historical immutable facts are
not rewritten to force a balance.

## Acceptance

Crash/retry tests must prove that ledger append and maintained-state
update either both commit or both roll back.
