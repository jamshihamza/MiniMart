# POS Payment + Recovery --- Refined Wireframe

``` text
┌─────────────────────────────────────────────────────────────────────┐
│ Payment · Sale S-…                    Due RM 21.50 · Local ● Cloud ○│
├───────────────────────────────┬─────────────────────────────────────┤
│ TENDERS                       │ CURRENT PAYMENT                     │
│ [Cash] [Card] [QR] [Other]   │ Attempt: PENDING / UNCERTAIN        │
│                               │ Amount: RM 21.50                    │
│ Cash received [          ]    │ Provider ref: ••••                 │
│ Quick: [Exact] [RM50] [RM100]│                                     │
│                               │ Do not retry as a new payment.      │
│                               │ [Check Status] [Recovery Details]   │
├───────────────────────────────┴─────────────────────────────────────┤
│ Remaining RM 21.50                      [Back] [Confirm when valid] │
└─────────────────────────────────────────────────────────────────────┘
```

When a durable commitment exists but sale completion is interrupted, the
primary action is **Recover Checkout**, not "Pay Again".
