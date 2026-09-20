# Core ERD --- Database Model v0.1

``` mermaid
erDiagram
  COMPANY ||--o{ STORE : owns
  STORE ||--o{ COUNTER : contains

  ITEM ||--o{ ITEM_BARCODE : has
  ITEM ||--o{ INVENTORY_POSITION : stocked_as
  STORE ||--o{ INVENTORY_POSITION : holds
  INVENTORY_POSITION ||--o{ STOCK_MOVEMENT : explained_by

  SUPPLIER ||--o{ PURCHASE_ORDER : receives
  PURCHASE_ORDER ||--|{ PURCHASE_ORDER_LINE : contains
  GOODS_RECEIPT ||--|{ GOODS_RECEIPT_LINE : contains

  SALE ||--|{ SALE_LINE : contains
  CHECKOUT_PAYMENT ||--o{ PAYMENT_ATTEMPT : attempts
  CHECKOUT_PAYMENT ||--o{ PAYMENT_COMMITMENT : commits
  CHECKOUT_PAYMENT ||--o{ POSTED_TENDER : materializes

  SALES_RETURN ||--|{ SALES_RETURN_LINE : contains
  SALES_RETURN ||--o| REFUND_OBLIGATION : creates
  REFUND_EXECUTION ||--o{ REFUND_ATTEMPT : attempts

  CUSTOMER ||--o| CREDIT_ACCOUNT : has
  CREDIT_ACCOUNT ||--o{ CREDIT_LEDGER_ENTRY : ledger
  CUSTOMER_COLLECTION ||--o{ COLLECTION_ALLOCATION : allocates

  CASHIER_SHIFT ||--o{ CASH_MOVEMENT : ledger
  STORE ||--o{ BUSINESS_DAY : operates

  FINANCIAL_ACCOUNT ||--o{ FINANCIAL_MOVEMENT : ledger
  SUPPLIER_PAYABLE ||--o{ SUPPLIER_PAYABLE_ALLOCATION : allocations
  RECONCILIATION_SESSION ||--o{ RECONCILIATION_MATCH : matches
```

Cross-context arrows represent stable identity references, not
permission for direct module-internal SQL access. \`\`\`
