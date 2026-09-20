# 02 --- Information Architecture & Navigation

## Shells

### POS

The POS shell is not a miniature Back Office. The cashier lands directly
in Sale Workspace after authentication/shift checks. Navigation is
intentionally limited to Sale, History, Returns, Shift and authorized
cash actions.

### Back Office

Persistent left sidebar, top context bar and page command bar. Sidebar
groups are permission-filtered. The top bar always exposes current
Company/Store, Business Date, user, Store Node status and cloud sync
state.

### Cloud Web

Cross-store management/sync/configuration only. No
sale-posting/payment/return-posting UI is permitted in the cloud shell.

## Context

Company, Store, Counter and authenticated user context come from trusted
server/device/session context. The UI may display context but must not
let callers spoof BusinessContext in request bodies.

## Navigation behavior

-   Preserve list filters when opening a detail and returning.
-   Use routes for major screens and stable document/detail views.
-   Use drawers/dialogs for short subordinate tasks.
-   Warn before abandoning dirty drafts.
-   Posted-document detail defaults to read-only.
-   Deep links must still pass permission and context checks.
