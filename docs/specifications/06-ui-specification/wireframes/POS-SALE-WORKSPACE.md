# POS Sale Workspace --- Structural Wireframe

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ MiniMart | Store / Counter | Business Date | Cashier | Local ● | Cloud ●    │
├───────────────────────────────────────────────────────────┬──────────────────┤
│ [ Scan barcode / Search item...                         ] │ CUSTOMER         │
│                                                           │ Walk-in          │
│ ITEM                    QTY      PRICE      DISC      TOTAL │ [Attach F4]      │
│ --------------------------------------------------------- │                  │
│ 890... Item A           2.000     5.00       —        10.00│ CREDIT / STATUS  │
│ 955... Item B           1.000    12.50      1.00      11.50│ ...              │
│                                                           │                  │
│                                                           ├──────────────────┤
│                                                           │ Subtotal   22.50 │
│                                                           │ Discount    1.00 │
│                                                           │ Tax          ... │
│                                                           │ TOTAL       21.50│
├───────────────────────────────────────────────────────────┼──────────────────┤
│ F2 Search  F4 Customer  F6 Hold  F8 Payment               │ [ PAYMENT F8 ]   │
└───────────────────────────────────────────────────────────┴──────────────────┘
```

The exact styling is not frozen in v0.1. The information hierarchy and
permanent visibility of cart, total, connectivity and payment action are
the baseline.
