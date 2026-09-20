# Configuration Ownership, Precedence and Activation

MiniMart does not use an unrestricted "last value wins" configuration
merge.

## Configuration classes

1.  **Build technical defaults** --- safe non-business defaults only.
2.  **Machine-local technical config** --- DB endpoint, service ports,
    local paths; cannot set tax/stock/accounting policy.
3.  **Enrollment identity config** --- Store Node/counter identity and
    trust metadata.
4.  **Company/Store application config** --- versioned values owned by
    declared scope.
5.  **CountryRuleSetVersion** --- separate verified policy object; never
    overridden by generic config.
6.  **Secrets** --- referenced from OS/secret infrastructure, never
    merged into ordinary config.

## Descriptor

Each configurable key declares owner, allowed scopes, type/schema,
sensitivity, restart/activation behavior and whether a more-specific
scope may override a broader scope.

## Activation

Cloud-delivered config is staged, schema/version validated, then
activated atomically as a configuration snapshot. Invalid/incompatible
config remains unapplied with visible diagnostics.

No configuration key may resolve a frozen OPEN/VERIFY/DEFERRED Decision
unless that decision has been approved upstream.
