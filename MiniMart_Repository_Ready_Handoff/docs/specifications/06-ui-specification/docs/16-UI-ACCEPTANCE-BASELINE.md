# 16 --- UI Acceptance Baseline

A UI implementation is not acceptable merely because the screen renders.

Minimum acceptance themes:

-   Cashier can complete a permitted cash sale while cloud is
    unavailable.
-   Cloud-offline is visible but does not obstruct scanning/payment.
-   Store Node loss prevents unsafe posting and preserves the active
    basket where possible.
-   Double-click/retry cannot create duplicate logical commands.
-   Committed/uncertain payment enters recovery instead of allowing an
    unsafe duplicate charge.
-   Printer failure after sale posting leaves sale completed and exposes
    reprint.
-   Posted sale/return/payment/stock facts cannot be edited as drafts.
-   Manager override records the approving identity without sharing
    credentials.
-   Back Office list filters survive detail navigation.
-   Exact-money values round-trip without float conversion.
-   Permission-hidden navigation cannot bypass server authorization.
-   1280×720 POS retains scan/cart/total/payment usability.
-   Keyboard-only cashier flow is viable.
-   Historical receipt/document view uses posted snapshots/rule version,
    not current master defaults.
