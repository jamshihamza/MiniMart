# Country Pack Architecture

Country behavior is a policy plugin selected from the Store's active
country context and exact CountryRuleSetVersion.

## Country pack interfaces

A country pack may provide: - tax classification/calculation policy; -
document/receipt presentation rules; - rounding policy; - regulated
field validation; - invoice/export/e-invoice adapter contracts; -
localization defaults; - payment-method metadata where country-specific.

It may not fork Sales/Inventory/Payments source modules.

## Historical rule

Posting resolves an exact rule-set version and stores calculated
outcomes plus rule reference. Reprints/reports interpret the posted
snapshot; they do not recalculate historical documents using today's
rules.

## Malaysia and India

Architecture supports Malaysia first and India next, but current legal
rates, thresholds, e-invoice requirements and other compliance values
are not embedded in this architecture document. They remain versioned
policy/configuration that must be verified from authoritative sources
before implementation/release.
