# Hardware Port Contract v0.2

Normative machine contract: `contracts/hardware-port-v1.schema.json`.

Capabilities are PRINTER, SCANNER, SCALE, CUSTOMER_DISPLAY and
CASH_DRAWER. Common result is SUCCESS/FAILED/TIMEOUT/CANCELLED/UNKNOWN
with stable device error categories.

Receipt printing is post-commit and uses stable print-job identity.
TIMEOUT/UNKNOWN never implies the paper definitely did not print.
Reprint cannot repost Sale.

Scanner events remain interaction input. Scale fallback policy is not
chosen here (DEC-HW-002). Protocol/driver choice remains adapter-owned.
