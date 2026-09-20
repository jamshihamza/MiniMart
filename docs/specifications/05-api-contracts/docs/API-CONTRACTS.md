# MiniMart API Contract Baseline

MiniMart has four contract surfaces: Store Node HTTP API, edge/cloud
Sync API, Tauri/Rust hardware ports, and provider-neutral payment/refund
adapter ports.

The Store API is local operational authority. Cloud mode does not
register Store checkout/posting handlers.

## Core rules

-   POS/Back Office call Store Node, never PostgreSQL.
-   `/api/v1` is the first Store API major path.
-   HTTPS transport resolves enrolled device/counter identity.
-   Protected business routes additionally require a Store Node user
    session.
-   Tenant/Company/Store/Counter/BusinessDate/CountryRuleSetVersion are
    server-resolved.
-   Retryable mutations require `X-MiniMart-Idempotency-Key`.
-   Mutable drafts/masters use ETag/`If-Match` where specified.
-   Posting commands always revalidate under the frozen database
    transaction/lock rules.
-   Money and quantity decimals are JSON strings.
-   Stable IDs are UUIDv7-compatible UUIDs; document numbers are not
    identity.
-   Provider-specific payloads never leak into core contracts.
-   Posted financial/stock documents have no ordinary edit/delete API.
-   Search/list operations are bounded and cursor-paged.
-   Uncertain external money remains explicit and recoverable.
-   Open/VERIFY/PROPOSED/DEFERRED policy seams remain unresolved.

## Caller non-authority

Tenant, Company, Store, Counter, BusinessDate and CountryRuleSetVersion
are resolved by Store Node. **Callers cannot override these values.**
