# UI-POS-018 --- Printer / Scanner Status

**Surface:** POS\
**Area:** Hardware\
**Primary roles/personas:** Cashier, Manager\
**Offline behavior:** READ_WRITE_LOCAL

## Purpose

Non-blocking hardware health and test actions.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `hardware.read`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Printer / Scanner Status.
3.  Command region: only actions valid for current server
    state/capability.
4.  Status/audit/recovery region when applicable.
5.  Secondary detail is a drawer or routed detail; it must not hide the
    primary posting/recovery state.

## Screen states

LOADING → READY/EMPTY, with explicit VALIDATION_ERROR,
PERMISSION_DENIED, CONFLICT, LOCAL_CLOUD_OFFLINE, STORE_NODE_UNREACHABLE
and INCOMPATIBLE_CLIENT handling where applicable. Critical commands may
enter RECOVERY_REQUIRED.

## API contract

-   `API-HW-001` GET `/api/v1/receipts/{documentType}/{documentId}` ---
    Get immutable receipt/document render model
-   `API-HW-002` GET `/api/v1/hardware/requirements` --- Get required
    hardware capability descriptors; no driver control

## Mutation behavior

-   Read-only/no direct mutation on this screen.

## Data presentation

-   Money uses exact decimal-string UI boundary.
-   Quantity respects Item-UoM precision.
-   Dates show localized presentation while preserving
    BusinessDate/RFC3339 meaning.
-   Posted document identity/snapshots are read-only.
-   Country-specific fields appear only through verified
    capabilities/rule metadata.

## Accessibility / keyboard

Visible focus, logical order, text-plus-icon status, scalable layout and
keyboard access to primary commands. Function-key shortcuts, where
shown, are accelerators rather than the only control.
