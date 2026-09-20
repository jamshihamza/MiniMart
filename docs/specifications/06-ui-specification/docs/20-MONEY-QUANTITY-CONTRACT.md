# 20 --- Money & Quantity UI Contract

`Money` and `Quantity` are shared components with canonical string
boundaries.

-   API decimal strings are parsed by decimal-safe libraries/logic,
    never JS binary float.
-   Input remains a validated decimal string until converted by
    exact-decimal domain utilities.
-   Money display uses currency/country formatting only after exact
    value is established.
-   Quantity display/input respects Item-UoM `quantityPrecision`.
-   Totals shown in the UI are server-authoritative for posting; client
    preview calculations are advisory and exact-decimal.
-   Rounding outcomes come from active country rules/contracts; the UI
    does not invent statutory rounding.
