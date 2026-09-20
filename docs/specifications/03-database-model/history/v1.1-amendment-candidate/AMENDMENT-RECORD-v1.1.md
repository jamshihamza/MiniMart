# MiniMart Database Model v1.1 --- Controlled Amendment Candidate

**Status:** AMENDMENT CANDIDATE --- NOT FROZEN\
**Parent baseline:** MiniMart Database Model v1.0 FROZEN\
**Trigger:** API Contracts v0.3 Independent Final Freeze Review,
`API-FRZ3-BLK-001`.

This amendment does not reopen the frozen business semantics. It adds
persistence for requirements already frozen in FRS v1.0 and already
represented in the Domain Model, while explicitly rejecting API-only
fields that would promote deferred/open/infrastructure concerns.

## Scope added

-   company registration/tax identifiers;
-   Store default language, receipt identity and contact/address data;
-   Item short description, sellable/purchasable, fractional/weighed,
    batch/expiry and skeleton state;
-   explicit Item-UoM default roles and quantity precision;
-   price reference/tax-context/change-reason metadata;
-   Supplier contacts, identifiers, commercial terms, country and notes;
-   GRN supplier invoice date;
-   Return reason/note at header/line level;
-   Customer type/contact/address/notes and multiple identifiers;
-   Credit terms/due-date basis and explicit limit mode;
-   Customer Collection tender method;
-   Supplier Payment source financial account/payment method.

## Deliberately not added

-   `Store.storeNodeAssociation`: enrollment/runtime infrastructure
    concern, not Store business persistence.
-   `Customer.communicationConsent`: FRS marks communication consent as
    LATER / Phase 3+ with verification gate.
-   `CreditAccount.pendingExposure`: held-sale credit exposure remains
    an OPEN decision seam.
-   `Item.stockManaged`: no frozen Catalog requirement establishes this
    as a universal Item-master field.
-   Company contact/default language/receipt identity: frozen
    Organization requirements place these at Store scope, not Company
    scope.

These fields must be removed or reshaped in API Contracts v0.4 rather
than silently persisted here.
