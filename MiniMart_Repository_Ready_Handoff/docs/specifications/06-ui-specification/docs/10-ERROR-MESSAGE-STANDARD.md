# 10 --- Error & Message Standard

Every error presentation has: 1. short human-readable title; 2. what
happened; 3. whether the transaction changed anything; 4. safe next
action; 5. expandable technical/reference information.

Examples of categories: - validation: fix highlighted fields; -
permission: request authorized user/override; - conflict: refresh and
reapply draft changes; - idempotency conflict: do not retry with changed
payload under same command identity; - service unavailable: preserve
work and retry safely; - payment/refund uncertain: enter recovery, do
not duplicate; - incompatible client: stop mutation and update client.

Raw HTTP status codes are not the primary cashier message.
