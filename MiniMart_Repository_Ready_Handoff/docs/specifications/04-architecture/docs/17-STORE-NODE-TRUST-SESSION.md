# Store Node Trust, Session and Replay Model

## Trust chain

`Enrolled device → Counter identity → User session → Authorization/override → BusinessContext → Command`

### Device

`CounterIdentityRegistry` binds an enrolled credential fingerprint/key
identity to `tenantId/storeId/counterId`. Client-provided store/counter
IDs cannot override this mapping.

### User session

Authentication occurs at Store Node. Session is bound to the
authenticated device/counter and user. Session expiry/re-authentication
values remain upstream policy seams.

### Authorization

Store Node resolves permissions from IAM. Manager override evidence is a
separate explicit authorization object with actor, approver, scope,
reason and expiry/status.

### Idempotency/replay

The idempotency key is scoped by trusted tenant + operation. Request
fingerprint covers the canonical command payload. Reuse with a different
fingerprint is rejected. API contracts may additionally bind high-risk
commands to actor/device context.

### BusinessContext

The client cannot authoritatively set Tenant, Company, Store, Counter,
BusinessDate or CountryRuleSetVersion. They are resolved server-side as
defined in the BusinessContext document.

## Revocation

Revoked device/user/session/support authorization fails closed.
Re-enrollment does not silently inherit a prior device secret.
