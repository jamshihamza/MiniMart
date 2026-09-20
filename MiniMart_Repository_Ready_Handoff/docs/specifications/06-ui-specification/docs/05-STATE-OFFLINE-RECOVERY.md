# 05 --- State, Offline & Recovery UX

## Connectivity states

MiniMart distinguishes:

-   **LOCAL ONLINE / CLOUD ONLINE**
-   **LOCAL ONLINE / CLOUD OFFLINE**
-   **LOCAL ONLINE / SYNC DEGRADED**
-   **STORE NODE UNREACHABLE**
-   **CLIENT INCOMPATIBLE**
-   **DEVICE NOT ENROLLED**
-   **RECOVERY REQUIRED**

Cloud-offline never blocks local sale posting.

## Mutation UX

Every important mutation has visible progress and a deterministic
completion state. If the client loses the response after submission, it
must retry/recover using the same idempotency identity rather than
starting a logically new command.

## Recovery center

Recovery surfaces group: - payment uncertainty; - refund uncertainty; -
sync dead-letter/attention items where user action is allowed; -
interrupted imports; - incompatible client; - Store Node connectivity.

Technical detail is expandable; the primary message uses business
language.
