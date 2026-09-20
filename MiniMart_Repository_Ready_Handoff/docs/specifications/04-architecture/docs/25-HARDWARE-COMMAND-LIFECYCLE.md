# Hardware Command Lifecycle

## Common adapter result

`SUCCESS | FAILED | TIMEOUT | CANCELLED | UNKNOWN`

Errors also carry stable category:
`NOT_CONNECTED, BUSY, UNSUPPORTED, DEVICE_ERROR, DRIVER_ERROR, INVALID_DATA, TIMEOUT, UNKNOWN`.

## Capability negotiation

At adapter startup/reconnect, expose: - port contract version; -
adapter/driver version; - device identity where available; - supported
capabilities; - health/connection state.

Unsupported capability fails explicitly; UI does not guess.

## Printer

Printing is post-commit. Each request carries stable document/print-job
identity. Timeout/UNKNOWN means physical output may have occurred; UI
offers controlled retry/reprint and warns about possible duplicate paper
output. It never reposts the Sale.

## Scanner

Reconnect is automatic where driver permits. Duplicate rapid scans are
input events, not database idempotency; POS interaction rules handle
them.

## Scale

Readings include timestamp/stability/unit metadata where supported.
DEC-HW-002 still decides fallback behavior; architecture does not
silently switch to manual weight.

## Customer display / cash drawer

They are side-effect devices behind ports. Failure does not rewrite
posted commercial facts. Exact interface/protocol remains
DEC-HW-003/related hardware seam.

## Cancellation

Cancellation stops waiting where adapter supports it; it cannot assert
that a physical command did not happen when outcome is UNKNOWN.
