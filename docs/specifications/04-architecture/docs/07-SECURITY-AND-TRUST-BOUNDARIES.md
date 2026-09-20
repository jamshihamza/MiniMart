# Security and Trust Boundaries --- v0.3

## Authentication

Passwords and cashier PINs are stored only as **Argon2** hashes. Hash
records include algorithm/parameter/version metadata so security
parameters can be upgraded without inventing a permanent fixed cost in
architecture.

Lockout, idle timeout and server-side authorization remain required.

## Device trust

Every POS/Back Office installation must be enrolled before privileged
Store API use. The client holds device credential material in
OS-protected storage. Store Node resolves the credential to a registered
Store/Counter identity through `CounterIdentityRegistry`.

Architecture requires: - encrypted authenticated transport; -
protected/non-exportable client credential where the platform permits; -
server-side binding to `tenantId/storeId/counterId`; -
revocation/re-enrollment capability; - no trust in caller-supplied
counter/store IDs.

The exact certificate/token mechanism remains a deployment-contract
choice.

## User and request trust

A Store Node session is bound to authenticated device/counter,
tenant/store, user identity, authorization snapshot/version and
issue/expiry metadata.

Permissions and manager overrides are enforced server-side. No universal
support credential exists.

Store Node derives trusted BusinessContext. Request-body identity fields
are references only and must match trusted context when present.

Idempotency scope includes trusted tenant + operation scope. High-risk
operations additionally bind actor/device context as defined by the API
contract.

## Data at rest and secrets

-   Production Store Node and counter Windows machines use **BitLocker
    full-disk encryption** as the approved baseline where the Windows
    edition/platform supports it.
-   A deployment without BitLocker requires an explicitly approved
    equivalent full-disk-encryption exception; silent downgrade is not
    allowed.
-   Provider/device secrets live in the OS credential store or approved
    secret infrastructure.
-   Survival-mode SQLite remains deferred; its encryption design is not
    activated by this architecture stage.

## Application and supply-chain security

-   SQL is parameterized; business input is never concatenated into
    executable SQL.
-   Dependency/security scanning runs in CI and release pipelines.
-   Store Node/Tauri installers and update artifacts are **digitally
    signed**.
-   Update verification rejects unsigned or invalidly signed release
    artifacts.
-   Shared OpenAPI/Zod validation is used at API boundaries.
-   PAN/card numbers are not stored; only approved non-sensitive
    references such as provider transaction reference, brand/last-four
    where allowed by the payment design.
-   Support/diagnostic export excludes secrets by default.

These requirements complement, not replace, the frozen IAM, audit,
support-session and transport controls.
