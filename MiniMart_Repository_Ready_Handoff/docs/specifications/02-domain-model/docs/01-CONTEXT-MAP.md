# Context Map --- v0.2

## 1. Ownership map

``` mermaid
flowchart LR
  ORG[Organization]
  IAM[Identity & Access]
  CAT[Catalog]
  PRI[Pricing]
  PUR[Procurement]
  INV[Inventory]
  SAL[Sales]
  PAY[Payments]
  RET[Returns]
  CUS[Customer & Credit]
  CASH[Cash & Business Day]
  ACC[Accounting-Lite]
  CTRY[Country Policy]

  CAT --> PRI
  CAT --> PUR
  CAT --> INV
  CAT --> SAL
  PRI --> SAL
  PUR --> INV
  PUR --> ACC
  INV --> SAL
  CUS --> SAL
  CUS --> ACC
  SAL --> RET
  CASH --> ACC
  CTRY -. policy .-> PRI
  CTRY -. policy .-> SAL
  CTRY -. policy .-> PAY
  CTRY -. policy .-> RET
  CTRY -. policy .-> ACC
  ORG --> CAT
  ORG --> PUR
  ORG --> INV
  ORG --> SAL
  ORG --> CASH
```

The diagram shows ownership/use direction only. Checkout/refund
collaborations that would otherwise look bidirectional are mediated by
application coordinators, not direct cyclic module dependencies.

## 2. BusinessDate ownership

-   Organization owns Store timezone/configuration.
-   Cash & Business Day owns `BusinessDay` lifecycle and resolves
    current operational `BusinessDate`.
-   Commands that need BusinessDate receive it in `BusinessContext`.
-   A context may preserve BusinessDate but may not independently
    invent/roll it over.

## 3. Orchestrated collaborations

### SalePostingCoordinator

Coordinates Sales + Payments + Inventory + Customer Credit +
Cash/Shift + optional Accounting-Lite + Audit + Outbox.

### GoodsReceiptPostingCoordinator

Coordinates Procurement + linked PurchaseOrder receipt allocation +
Inventory + optional Accounting-Lite supplier liability + Audit +
Outbox.

### PurchaseReturnPostingCoordinator

Coordinates Procurement + source-return eligibility + Inventory +
Accounting-Lite supplier credit/liability adjustment where enabled +
Audit + Outbox.

### SalesReturnPostingCoordinator

Coordinates Returns + original-sale return eligibility + Inventory +
Customer Credit + immediate cash/financial refund effect where
applicable + Audit + Outbox.

### RefundSettlementCoordinator

Coordinates Returns RefundObligation + Payments RefundExecution +
Cash/FinancialAccount effect where applicable + Audit + Outbox.

### CustomerCollectionPostingCoordinator

Coordinates CustomerCollection + CreditAccount +
CashierShift/FinancialAccount effect + Audit + Outbox.

### SupplierPaymentPostingCoordinator

Coordinates SupplierPayment + one/more SupplierPayable allocations +
FinancialAccount movement + Audit + Outbox.

### StockCountPostingCoordinator

Coordinates StockCount + affected InventoryPosition(s) + CountAdjustment
StockMovements + Audit + Outbox.

### ExpensePostingCoordinator

Coordinates Expense + FinancialAccount and, if controlled drawer cash is
used, CashierShift + Audit + Outbox.

### AccountTransferPostingCoordinator

Coordinates AccountTransfer + source/destination FinancialMovement
facts + Audit + Outbox.

## 4. Anti-corruption boundaries

External payment/refund providers, e-invoice systems, hardware and cloud
synchronization are adapters. Provider-specific status is translated
into MiniMart-owned outcomes before it can affect domain state.

No provider object becomes a core aggregate and no adapter may mutate
another context's internal persistence directly.
