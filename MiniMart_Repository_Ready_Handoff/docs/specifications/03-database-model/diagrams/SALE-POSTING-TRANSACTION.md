# Sale Posting --- Physical Transaction View

``` mermaid
flowchart TD
  C[SalePostingCoordinator] --> TX[BEGIN PostgreSQL transaction]
  TX --> S[Lock sales.sales]
  S --> I[Lock inventory_positions in stable ItemId order]
  I --> CR{Credit used?}
  CR -->|yes| CA[Lock credit_accounts]
  CR -->|no| SH
  CA --> SH{Cash effect?}
  SH -->|yes| CS[Lock cashier_shifts]
  SH -->|no| FA
  CS --> FA{Financial movement required?}
  FA -->|yes| F[Lock financial_accounts]
  FA -->|no| W
  F --> W[Revalidate all invariants]
  W --> P[Persist Sale + StockMovement + PostedTender + optional Credit/Cash/Financial facts]
  P --> A[Insert audit_events]
  A --> O[Insert outbox_messages]
  O --> COMMIT[COMMIT]
```

No external payment-provider call occurs between BEGIN and COMMIT.
