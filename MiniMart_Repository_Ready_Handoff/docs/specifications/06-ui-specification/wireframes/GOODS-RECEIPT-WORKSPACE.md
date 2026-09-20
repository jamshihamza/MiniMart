# Goods Receipt Workspace --- Refined Wireframe

``` text
┌─────────────────────────────────────────────────────────────────────┐
│ Goods Receipt · Draft                    [Save] [Preview] [Post]    │
├─────────────────────────────────────────────────────────────────────┤
│ Supplier [........]  PO [........]  Receipt Date [Business Date]   │
│ Supplier Ref [....................]                                │
├─────────────────────────────────────────────────────────────────────┤
│ Item / UoM        Ordered   Received   Free Qty   Cost   Tax Context│
│ ...                                                                  │
├─────────────────────────────────────────────────────────────────────┤
│ Validation / variance / policy messages                             │
│                                              Total Acquisition ...  │
└─────────────────────────────────────────────────────────────────────┘
```

Posting is a single GoodsReceiptPostingCoordinator action. The UI must
not separately "fix stock" after GRN posting.
