# 01 --- MiniMart Design System

## Visual direction

MiniMart uses a clean professional retail aesthetic: calm surfaces,
strong hierarchy, compact business data, clear status, restrained
decoration and consistent spacing. POS is optimized for speed; Back
Office is optimized for scanability.

## Foundations

-   8px spacing system with 4px micro-spacing.
-   Desktop base typography 14px; data-dense tables may use 13px;
    primary POS totals 28--40px.
-   Minimum interactive target 40×40px; POS primary actions 48px+.
-   Border radius: modest and consistent; avoid oversized consumer-app
    cards.
-   Elevation is used only for dialogs, drawers, floating command
    surfaces and critical overlays.
-   Icons must have text/tooltip where meaning is not universal.
-   Never communicate state by color alone.

## Semantic status tokens

Use semantic tokens rather than hard-coded feature colors:

-   success / posted / settled
-   warning / pending / attention
-   danger / failed / destructive
-   info / processing / synchronized
-   neutral / draft / inactive
-   offline-local / cloud unavailable
-   recovery / uncertain external state

Exact palette is selected during visual design review; semantic meaning
is frozen before palette.

## Components

Required shared components include AppShell, POSShell, PageHeader,
CommandBar, DataGrid, SearchField, FilterBar, StatusBadge, Money,
Quantity, BusinessDate, EmptyState, ErrorState, OfflineBanner,
SyncIndicator, PermissionGuard, ManagerOverrideDialog, ConfirmDialog,
RecoveryPanel, AuditMeta, DocumentHeader, DocumentLines, TotalsPanel,
TenderPanel, ReceiptPreview, FormSection, FieldError, SideDrawer and
Toast.

## Form behavior

-   Labels remain visible; placeholders are examples, not labels.
-   Required/optional state is explicit.
-   Validation appears next to the field and in a top error summary for
    long forms.
-   Save Draft and Post are visually distinct.
-   Post actions require a final summary when the action creates
    immutable financial/stock effects.
-   Destructive/corrective actions state the resulting document, not
    "edit posted record".

## Table behavior

Back Office tables support keyboard focus, column resize, sorting,
filtering, saved view later if permitted, row selection and density
appropriate for retail operations. Monetary columns are right aligned;
IDs/codes are monospace-capable; dates use store locale but preserve
unambiguous values.
