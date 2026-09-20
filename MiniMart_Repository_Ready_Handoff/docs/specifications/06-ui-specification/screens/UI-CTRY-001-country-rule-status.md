# UI-CTRY-001 --- Country Rule Status

**Surface:** Back Office\
**Area:** Settings\
**Primary roles/personas:** Admin, Manager\
**Offline behavior:** READ_ONLY

## Purpose

Active country rule-set version and effective status.

## Authorization

Role labels guide navigation only. Actual action visibility follows API
permission/capability data. Relevant permission codes: `country.read`

## Layout / information hierarchy

1.  Context/header: Store/Counter/Business Date when relevant, user,
    local/cloud state.
2.  Primary task region: Country Rule Status.
3.  Command region: only actions valid for current server
    state/capability.
4.  Status/audit/recovery region when applicable.
5.  Secondary detail is a drawer or routed detail; it must not hide the
    primary posting/recovery state.

## Screen states

LOADING → READY/EMPTY, with explicit VALIDATION_ERROR,
PERMISSION_DENIED, CONFLICT, LOCAL_CLOUD_OFFLINE, STORE_NODE_UNREACHABLE
and INCOMPATIBLE_CLIENT handling where applicable. Critical commands may
enter RECOVERY_REQUIRED.

## API contract

-   `API-CTRY-001` GET `/api/v1/country/rule-set` --- Get active
    CountryRuleSet descriptor
-   `API-CTRY-002` GET `/api/v1/country/capabilities` --- Get verified
    country-pack capability descriptors
-   `API-CTRY-003` POST `/api/v1/country:validate-document` --- Validate
    draft document against active versioned country policy

## Mutation behavior

-   `API-CTRY-003`: disable duplicate submit; preserve idempotency
    identity; handle
    `AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT, PERMISSION_DENIED, RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE, VALIDATION_FAILED`.

## Data presentation

-   Money uses exact decimal-string UI boundary.
-   Quantity respects Item-UoM precision.
-   Dates show localized presentation while preserving
    BusinessDate/RFC3339 meaning.
-   Posted document identity/snapshots are read-only.
-   Country-specific fields appear only through verified
    capabilities/rule metadata.

## Accessibility / keyboard

Visible focus, logical order, text-plus-icon status, scalable layout and
keyboard access to primary commands. Function-key shortcuts, where
shown, are accelerators rather than the only control.
