# 03 --- POS Experience

## Layout

Desktop POS uses three zones:

**Top:** store/counter, cashier, business date, offline/sync/hardware
status.\
**Main left:** scan/search input and cart lines.\
**Main right:** customer/credit context, totals and primary payment
action.\
**Bottom:** keyboard hints and contextual quick actions.

## Sale workflow

1.  Cashier scans barcode or searches item.
2.  Item/UoM/price resolves locally through Store Node.
3.  Cart line is added with exact quantity/price values.
4.  Optional customer is attached.
5.  Guarded actions show permission/override flow.
6.  Payment opens dedicated Payment Workspace.
7.  Payment commitment is durable before final sale posting where
    required.
8.  Sale posting returns immutable posted identity.
9.  Receipt printing is post-commit. Printer failure must not unpost the
    sale.
10. Cashier immediately starts the next sale.

## Keyboard baseline

-   F2 item search
-   F4 customer
-   F6 hold/recall
-   F8 payment
-   F9 cash tender shortcut when permitted
-   F10 complete/confirm contextual action
-   Esc close current drawer/dialog
-   Ctrl+K command/search in Back Office, not while barcode field owns
    focus

Exact final shortcut set will be tested against Windows/POS hardware
before freeze.

## Payment uncertainty

The UI has distinct states for STARTED, PENDING, FAILED, UNCERTAIN and
COMMITTED. UNCERTAIN displays a recovery screen and disables unsafe
duplicate initiation. Recovery uses the same durable command/payment
identity.

## Offline

Cloud offline shows a compact persistent indicator and allows local
checkout. Store Node unreachable blocks posting and enters connection
recovery; it is never mislabeled as ordinary "offline mode".
