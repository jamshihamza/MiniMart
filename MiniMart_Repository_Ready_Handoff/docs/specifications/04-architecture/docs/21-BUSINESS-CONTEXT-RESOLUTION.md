# BusinessContext Resolution

## Resolution order and authority

1.  **Tenant/Store/Counter** --- authenticated device enrollment /
    CounterIdentityRegistry.
2.  **User** --- Store Node authenticated session bound to that device.
3.  **Company** --- Organization module from the resolved Store.
4.  **Permissions/override** --- IAM for resolved user + explicit
    override evidence.
5.  **BusinessDate** --- Cash & Business Day public resolver for the
    Store.
6.  **CountryRuleSetVersion** --- Country Policy resolver using Store
    country context and effective/explicit policy version.
7.  **Correlation/causation/idempotency** --- validated
    request/application metadata, never authorization authority.

The result is an immutable `BusinessContextSnapshot` for the command.

## Failure

Missing, inactive, contradictory or incompatible context fails closed
before mutation. The server never falls back to calendar date, current
country rules or caller-supplied Store/Counter to "make the command
work."

## Posting

The exact resolved BusinessDate and CountryRuleSetVersion needed for
historical meaning are persisted with the document/facts according to
the frozen Database Model.
