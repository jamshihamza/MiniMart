# Security, Trust and BusinessContext

Plain unauthenticated LAN requests cannot invoke business commands.

Trust chain: enrolled device → counter identity → user session →
authorization/override → BusinessContext → command.

Support endpoints additionally require a scoped SupportSession. Revoked
device/user/session/support authorization fails closed.

Client-supplied Tenant/Store/Counter/BusinessDate/CountryRuleSetVersion
values are never authoritative. Password/PIN material, secrets, PAN and
prohibited payment credentials are not returned or logged.
