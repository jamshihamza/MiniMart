# MiniMart Domain Context Map --- Frozen v1.0

``` mermaid
flowchart TB
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

  ORG --> CAT
  ORG --> PUR
  ORG --> INV
  ORG --> SAL
  ORG --> CASH

  IAM -. authorization .-> PUR
  IAM -. authorization .-> SAL
  IAM -. authorization .-> RET
  IAM -. authorization .-> ACC

  CTRY -. policy .-> PRI
  CTRY -. policy .-> SAL
  CTRY -. policy .-> PAY
  CTRY -. policy .-> RET
  CTRY -. policy .-> ACC

  SPC[SalePostingCoordinator]
  RPC[ReturnPostingCoordinator]
  RSC[RefundSettlementCoordinator]

  SPC -. orchestrates .-> SAL
  SPC -. orchestrates .-> PAY
  SPC -. orchestrates .-> INV
  SPC -. orchestrates .-> CUS
  SPC -. orchestrates .-> CASH
  SPC -. orchestrates .-> ACC

  RPC -. orchestrates .-> RET
  RPC -. orchestrates .-> INV
  RPC -. orchestrates .-> CUS
  RPC -. orchestrates .-> CASH

  RSC -. orchestrates .-> RET
  RSC -. orchestrates .-> PAY
  RSC -. orchestrates .-> CASH
  RSC -. orchestrates .-> ACC
```

Direct Sales↔Payments or Returns↔Payments module coupling is not
permitted. Coordinators compose public ports under the local Unit of
Work.
