# Open Decision Seams --- v0.2 Index

The authoritative complete mapping is `13-DECISION-SEAM-MATRIX.md`.

High-impact domain policy interfaces retained by v0.2 include:

-   BusinessDatePolicy
-   DocumentNumberPolicy
-   POApprovalPolicy / OverReceiptPolicy / DirectGRNPolicy
-   HeldSaleRepricingPolicy / ActiveSalePricePolicy
-   StockCountConcurrencyPolicy
-   BatchSelectionPolicy / ExpirySalePolicy
-   NoReceiptReturnPolicy
-   RefundAllocationPolicy / RefundMethodPolicy
-   CreditLimitPolicy / SuspendedCreditOverridePolicy /
    CreditReservationPolicy
-   CollectionAllocationPolicy / CustomerAdvancePolicy
-   ActiveShiftPolicy / BusinessDayClosePolicy / LateTransactionPolicy /
    BusinessDayReopenPolicy
-   Import/go-live opening-stock policy
-   CountryRuleSet verification gates

A policy seam may be a strategy interface, validated configuration,
later extension or verification gate. It must not become an accidental
hard-coded rule.
