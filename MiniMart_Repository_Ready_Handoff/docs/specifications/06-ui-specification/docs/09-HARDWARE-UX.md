# 09 --- Hardware UX

Hardware is surfaced through Tauri/Rust ports.

## Receipt printer

-   status: ready/unavailable/error;
-   test print;
-   receipt print/reprint;
-   post-sale print failure is recoverable and never reverses the sale.

## Barcode scanner

Keyboard-wedge scanning must work without modal interruption. Scanner
input must not trigger global shortcuts.

## Cash drawer

Drawer open is tied to authorized tender/cash movement behavior. Manual
open, if supported later, requires explicit permission/audit.

Hardware setup is separated from cashier runtime status.
