# 00 --- UI Specification Baseline

## Product experience

MiniMart must feel like a commercial retail product, not an internal
admin panel.

The experience is divided into three shells:

1.  **POS Shell** --- high-speed cashier workflow, large targets,
    keyboard/scanner first, minimal navigation.
2.  **Back Office Shell** --- information-dense management workspace,
    sidebar navigation, searchable tables, split views and task-oriented
    forms.
3.  **Cloud Web Shell** --- management/sync/configuration views only.
    Cloud does not run store checkout.

## Non-negotiable UI principles

-   Store operation remains usable when internet/cloud is unavailable.
-   Cloud-offline is visible but must not block local billing.
-   Store Node/LAN failure is a different and more serious state than
    cloud-offline.
-   A posted document is shown as posted/immutable; correction actions
    create a reversal/return/adjustment rather than editing history.
-   Money is formatted from exact decimal strings; the UI must not
    calculate financial values with binary floating point.
-   Retry-safe commands keep their idempotency identity through
    retry/recovery.
-   Payment/refund uncertainty is represented explicitly; the UI must
    never silently convert UNKNOWN/PENDING into failed or successful.
-   Manager override is an explicit audited flow, not credential
    sharing.
-   Permission denial hides irrelevant navigation where appropriate but
    must still be enforced by the server.
-   UI does not invent values for OPEN/VERIFY/PROPOSED/DEFERRED decision
    seams.
-   Country-specific labels/fields are driven by active country
    capability/rule-set contracts.
