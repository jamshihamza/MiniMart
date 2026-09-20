# MiniMart API Contract Decisions v1.0 FROZEN

  --------------------------------------------------------------------------
  Decision                            Frozen v1.0 baseline
  ----------------------------------- --------------------------------------
  API-DEC-001                         Store API base path is `/api/v1`; Sync
                                      is `/sync/v1`; Cloud
                                      management/reporting is `/cloud/v1`.

  API-DEC-002                         Store business API uses authenticated
                                      encrypted device identity independent
                                      of user session; protected routes also
                                      require a Store Node user session.

  API-DEC-003                         Tenant, Company, Store, Counter,
                                      BusinessDate and CountryRuleSetVersion
                                      are server-resolved and cannot be
                                      caller-overridden.

  API-DEC-004                         Retryable mutations require
                                      `X-MiniMart-Idempotency-Key`;
                                      effective claim scope is trusted
                                      tenant + operation + key, with
                                      authenticated caller/device metadata
                                      retained for replay authorization.

  API-DEC-005                         Idempotency request fingerprint uses
                                      SHA-256 over route template,
                                      normalized path parameters and RFC
                                      8785 canonical JSON request body;
                                      authorization is rechecked on replay.

  API-DEC-006                         `X-Correlation-Id` is trace metadata
                                      only and never authorization
                                      authority.

  API-DEC-007                         Mutable masters/drafts expose strong
                                      ETag `"v<version>"`; material updates
                                      use `If-Match`; posting revalidates
                                      under frozen locks regardless of ETag.

  API-DEC-008                         Money, quantity and cost decimal
                                      values are JSON strings; domain
                                      floating-point JSON numbers are
                                      forbidden.

  API-DEC-009                         Stable IDs are UUIDv7-compatible
                                      UUIDs; human document numbers are
                                      attributes, not identity.

  API-DEC-010                         Timestamps are RFC 3339 instants;
                                      BusinessDate is an ISO date resolved
                                      by Store policy.

  API-DEC-011                         Errors use `application/problem+json`
                                      with a frozen MiniMart problem-code
                                      registry, category, correlation and
                                      recovery hint.

  API-DEC-012                         Search/list queries are bounded
                                      cursor-paged and declare
                                      operation-specific filter parameters.

  API-DEC-013                         Posted financial/stock documents have
                                      no ordinary edit/delete API;
                                      corrections use explicit compensating
                                      commands.

  API-DEC-014                         Provider-specific DTOs never leak into
                                      core Store API or domain-facing
                                      adapter contracts.

  API-DEC-015                         Provider timeout/lost response is
                                      PENDING/UNCERTAIN; `202 Accepted` is
                                      used where monetary outcome is not
                                      final.

  API-DEC-016                         Lost response after local commit is
                                      recovered by the same command and same
                                      idempotency key.

  API-DEC-017                         Incompatible write clients receive
                                      `426 Upgrade Required` and no
                                      mutation.

  API-DEC-018                         OpenAPI 3.1 is the canonical
                                      machine-readable API source.
                                      Implementation generates Zod
                                      validators/types from it; CI
                                      regenerates/check-diffs and validates
                                      examples/contracts.

  API-DEC-019                         Reporting/search composes public query
                                      contracts and creates no private-table
                                      read exception.

  API-DEC-020                         Counter hardware commands use typed
                                      Tauri/Rust port contract; Store HTTP
                                      supplies business/render models, not
                                      driver commands.

  API-DEC-021                         Open/VERIFY/PROPOSED/DEFERRED
                                      decisions remain policy/capability
                                      outcomes and are never silently
                                      resolved by API defaults.

  API-DEC-022                         PaymentCommitment recovery is
                                      explicit; ordinary Sale abandonment
                                      cannot strand confirmed money.

  API-DEC-023                         Credit tender is an explicit
                                      CheckoutPayment component and is
                                      revalidated at Sale posting.

  API-DEC-024                         Customer collection and
                                      Accounting-Lite corrections are
                                      explicit reversal commands using
                                      existing owning coordinators.

  API-DEC-025                         Manual inventory adjustment is an
                                      Inventory-module command that posts
                                      immutable StockMovement; it does not
                                      create a new cross-module coordinator
                                      or direct stock edit.

  API-DEC-026                         Sync messages carry ownerClass and
                                      must match the versioned registered
                                      message catalog before apply.

  API-DEC-027                         Device enrollment uses a typed
                                      deployment/bootstrap port; carrier,
                                      licensing limits and exact
                                      re-enrollment policy remain unresolved
                                      legacy seams.

  API-DEC-028                         Long-running jobs expose a common
                                      queryable OperationJob resource and
                                      safe cancellation only where the job
                                      declares support.

  API-DEC-029                         Cloud API exposes approved
                                      reporting/configuration/country-pack
                                      capabilities only; Store
                                      checkout/posting routes are absent.

  API-DEC-030                         Create commands returning a new
                                      resource use 201; mutation of an
                                      existing resource uses 200;
                                      unresolved/asynchronous outcome uses
                                      202.
  --------------------------------------------------------------------------

These are API-layer technical decisions. They do not promote unresolved
business/compliance policy decisions.
