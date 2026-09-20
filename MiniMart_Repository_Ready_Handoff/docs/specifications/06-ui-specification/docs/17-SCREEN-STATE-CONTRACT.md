# 17 --- Screen State Contract v0.2

Every screen implements the same explicit state vocabulary where
applicable:

-   **LOADING** --- initial or deliberate refresh; preserve layout
    skeleton.
-   **READY** --- authoritative local response available.
-   **EMPTY** --- valid zero-result state with relevant next action.
-   **VALIDATION_ERROR** --- field and summary errors; draft remains
    editable.
-   **PERMISSION_DENIED** --- no implication that hidden UI grants
    authority.
-   **CONFLICT** --- stale ETag/version or business conflict; explain
    refresh/reapply.
-   **LOCAL_CLOUD_OFFLINE** --- Store Node works; cloud-dependent
    information may be stale; local operations continue.
-   **STORE_NODE_UNREACHABLE** --- posting/mutations requiring Store
    Node are blocked; preserve local UI work where safe.
-   **INCOMPATIBLE_CLIENT** --- mutation blocked until compatible client
    is installed.
-   **RECOVERY_REQUIRED** --- durable command/provider state requires
    recovery rather than a new logical command.

A screen may omit states that are structurally impossible, but critical
posting/payment/refund screens may not omit recovery behavior.
