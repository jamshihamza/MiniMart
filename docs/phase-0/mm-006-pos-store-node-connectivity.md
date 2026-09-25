# MM-006 POS to Store Node connectivity

## Scope and authority

The POS checks API-SYS-001 and API-SYS-002 over HTTPS with `deviceMtls`. Store Node
exposes only these two system routes in this phase. The responses follow the frozen
OpenAPI schemas: health contains `status: "UP"` and `time`; readiness contains
`transactionalReady`, `databaseReady`, `schemaCompatible`, and `reasons`. Readiness
does not contain `status`. MM-004 remains the database and schema authority.

## Transport and identity

The Tauri Rust host owns the POS client certificate and uses Windows WinHTTP to send
the two fixed GET requests. The private key stays non-exportable in the Windows
CurrentUser certificate store. React receives response data through one narrow Tauri
command and never receives a certificate or private key. The native client requires
an HTTPS origin, validates the server with Windows certificate trust and hostname
checks, and does not permit a TLS validation bypass. The Store Node HTTPS server
requires a CA-validated client certificate and also requires its SHA-256 fingerprint
in the local enrollment registry with `revoked: false`. The registry is loaded at
server startup. There is no unauthenticated listener or HTTP fallback.

The Phase-0 provisioning script creates a separate development CA, a localhost
server certificate, and a POS client certificate. It places the POS private key in
the Windows CurrentUser certificate store and the development CA in CurrentUser
Root. The server PFX, encrypted PFX password, CA public certificate, and enrollment
registry remain under the Git-ignored `infra/mm-006/dev-certificates` directory.
The server PFX password is protected by Windows DPAPI for the provisioning user.
The script is development/test-only; it does not define production PKI, certificate
rotation, or general device enrollment administration.

## Local Windows demonstration

Run `infra/mm-006/Provision-DevelopmentCertificates.ps1` once. Windows may request
confirmation before trusting the development CA. Start PostgreSQL with the MM-004
schema, then run `infra/mm-006/Start-DevelopmentStoreNode.ps1 -DatabaseUrl <URL>`.
Set `MINIMART_STORE_NODE_HTTPS_URL=https://localhost:3443` and
`MINIMART_POS_DEVICE_CERT_SHA1` to the provisioning script's POS thumbprint in the
Tauri process environment, then launch the native POS with
`pnpm --filter @minimart/pos-terminal tauri dev`. The default Store Node bind address
is loopback; `-BindHost` can select a LAN interface for a controlled local test.
The URL host must match the server certificate SAN. Do not commit the generated
certificates, enrollment registry, PFX password, or database URL.

## Readiness and UI behavior

The POS probes at startup and every five seconds while mounted. It displays Online
only if health is a valid `status: "UP"` response and all three required readiness
booleans are true. It distinguishes Store Node unavailable, database unavailable,
schema incompatible, and otherwise not ready. Missing, non-200, malformed, or
extra-field responses fail closed. In-flight work is ignored after the view
unmounts, and the polling timer is cleared. A live Store Node readiness request
rechecks MM-004 database readiness with a bounded deadline; a stalled check
degrades the response without launching another query until the pending check
settles. HTTPS closes before database shutdown.

## Phase-0 validation

On Windows, PostgreSQL 17, the real HTTPS Store Node, and the native WebView2 POS
reached Online with valid client and server trust. No client certificate and an
untrusted client certificate were rejected. An untrusted server certificate caused
the native POS to show Unavailable. Pausing the disposable PostgreSQL container
made readiness report `databaseReady: false` and the POS show Database unavailable;
a disposable extra table made MM-004 report `schemaCompatible: false` and the POS
show Schema incompatible. Restoring the database returned the POS to Online.
