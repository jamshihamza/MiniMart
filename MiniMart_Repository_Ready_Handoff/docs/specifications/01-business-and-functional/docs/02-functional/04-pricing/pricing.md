# MiniMart Pricing Functional Specification --- v0.2

**Document ID:** MM-FRS-PRI-001\
**Requirement prefix:** `FR-PRI`\
**Status:** Detailed Working Draft --- Batch 1\
**Parent:** `../FRS.md`\
**Primary BRD sources:** `BR-PRI-001` through `BR-PRI-006`,
`BR-POS-004`, `BR-POS-005`, `BR-AUD-*`, `BR-DATA-007`

## 1. Purpose

Define product price maintenance, effective pricing, price history, bulk
price changes, margin/markup information, POS price overrides and
price-label follow-up.

Promotion-engine behaviour is outside initial scope.

## 2. Actors

-   `ACT-001` Business Owner
-   `ACT-002` Administrator
-   `ACT-003` Store Manager
-   `ACT-004` Supervisor
-   `ACT-006` Purchase Staff --- cost information where permitted
-   `ACT-005` Cashier --- price use/authorized override

## 3. Functional Requirements

### FR-PRI-001 --- Selling price

**Source:** BR-PRI-001\
**Priority:** MUST\
**Phase:** 1

Each sellable item shall have an applicable selling price or an
explicitly defined price-required state before normal POS completion.

**Acceptance:** A functional test demonstrates the stated behavior: Each
sellable item shall have an applicable selling price or an explicitly
defined price-required state before normal POS completion.

### FR-PRI-002 --- Exact monetary handling

**Source:** BR-PRI-001, BR-DATA-001\

**Priority:** MUST\
**Phase:** 1

Price entry, display and calculation shall preserve exact monetary
meaning according to the configured currency precision and shall not
rely on user-visible floating-point approximations.

Implementation representation is defined later.

**Acceptance:** A functional test demonstrates the stated behavior:
Price entry, display and calculation shall preserve exact monetary
meaning according to the configured currency precision and shall not
rely on user-visible floating-point approximations.

### FR-PRI-003 --- Price effective date/time

**Source:** BR-PRI-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support a price becoming effective at a defined date/time
or business-effective point.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support a price becoming effective at a defined date/time
or business-effective point.

### FR-PRI-004 --- Future price

**Source:** BR-PRI-002\
**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to define a future selling price without
prematurely changing the current price.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to define a future selling price without
prematurely changing the current price.

### FR-PRI-005 --- Price history

**Source:** BR-PRI-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall retain a history sufficient to determine prior configured
selling prices and their effective periods.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall retain a history sufficient to determine prior configured
selling prices and their effective periods.

### FR-PRI-006 --- Historical sale price preservation

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Changing the current item price shall not alter the price recorded on
previously posted sales/purchases.

**Acceptance:** A functional test demonstrates the stated behavior:
Changing the current item price shall not alter the price recorded on
previously posted sales/purchases.

### FR-PRI-007 --- Cost information

**Source:** BR-PRI-003\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to view applicable cost information
needed for purchasing/pricing decisions.

Operational inventory cost uses the approved moving weighted-average
baseline per Item per Store; full statutory accounting treatment remains
outside this Pricing requirement.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to view applicable cost information
needed for purchasing/pricing decisions.

### FR-PRI-008 --- Margin information

**Source:** BR-PRI-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should calculate/display margin information from defined cost
and selling-price inputs for authorized users.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should calculate/display margin information from defined cost
and selling-price inputs for authorized users.

### FR-PRI-009 --- Markup information

**Source:** BR-PRI-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should calculate/display markup information for authorized
users.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should calculate/display markup information for authorized
users.

### FR-PRI-010 --- Maximum/recommended price

**Source:** BR-PRI-003\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1/4

MiniMart shall support country/product-specific maximum/recommended
retail price concepts where required, without making them universal for
all countries.

India MRP rules belong to the India country specification.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support country/product-specific maximum/recommended
retail price concepts where required, without making them universal for
all countries.

### FR-PRI-011 --- Tax-inclusive/exclusive price context

**Source:** BR-PRI-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support the applicable country/store policy for
tax-inclusive or tax-exclusive price interpretation.

Tax calculation details belong to country specifications.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support the applicable country/store policy for
tax-inclusive or tax-exclusive price interpretation.

### FR-PRI-012 --- Store-scoped selling price assignment

**Source:** BR-PRI-001\
**Priority:** MUST\
**Phase:** 1

Selling-price records shall support store scope from the initial domain
model. Phase 1 normally has one operational store, but price shall
remain a store-scoped assignment rather than an immutable attribute
embedded in company-wide Item identity.

Later company-default price lists or branch override/fallback rules may
be added without changing Item identity.

**Acceptance:** The same company-wide Item can have independently
identifiable store price assignments without cloning the Item.

### FR-PRI-013 --- Price edit permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Changing a master selling price shall require explicit pricing
permission.

**Acceptance:** A functional test demonstrates the stated behavior:
Changing a master selling price shall require explicit pricing
permission.

### FR-PRI-014 --- Price-change audit

**Source:** BR-PRI-004, BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Material price changes shall record actor, time, item, prior price, new
price and effective point where applicable.

**Acceptance:** A functional test demonstrates the stated behavior:
Material price changes shall record actor, time, item, prior price, new
price and effective point where applicable.

### FR-PRI-015 --- Price-change reason

**Source:** BR-PRI-004, BR-AUD-002\

**Priority:** SHOULD\
**Phase:** 1

MiniMart should support requiring a reason for configured price changes,
particularly exceptional/manual changes.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should support requiring a reason for configured price changes,
particularly exceptional/manual changes.

### FR-PRI-016 --- Bulk price update

**Source:** BR-PRI-005\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to prepare controlled bulk price changes
for multiple items.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to prepare controlled bulk price changes
for multiple items.

### FR-PRI-017 --- Bulk price preview

**Source:** BR-PRI-005\

**Priority:** MUST\
**Phase:** 1

Before applying a bulk price update, MiniMart shall present enough
information to review affected items and proposed prices.

**Acceptance:** A functional test demonstrates the stated behavior:
Before applying a bulk price update, MiniMart shall present enough
information to review affected items and proposed prices.

### FR-PRI-018 --- Bulk price validation

**Source:** BR-PRI-005\

**Priority:** MUST\
**Phase:** 1

Bulk price changes shall validate item eligibility, monetary format and
configured business constraints before application.

**Acceptance:** A functional test demonstrates the stated behavior: Bulk
price changes shall validate item eligibility, monetary format and
configured business constraints before application.

### FR-PRI-019 --- Bulk update error reporting

**Source:** BR-PRI-005\

**Priority:** MUST\
**Phase:** 1

Rows/items that cannot be updated shall be reported rather than silently
ignored.

**Acceptance:** A functional test demonstrates the stated behavior:
Rows/items that cannot be updated shall be reported rather than silently
ignored.

### FR-PRI-020 --- Effective price selection

**Source:** BR-PRI-002\

**Priority:** MUST\
**Phase:** 1

When a sale line is created, MiniMart shall determine the applicable
configured selling price for that item/store/time according to the
active pricing policy.

**Acceptance:** A functional test demonstrates the stated behavior: When
a sale line is created, MiniMart shall determine the applicable
configured selling price for that item/store/time according to the
active pricing policy.

### FR-PRI-021 --- Sale price snapshot

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

A sale shall retain the actual unit price used for the transaction
independent of later master-price changes.

**Acceptance:** A functional test demonstrates the stated behavior: A
sale shall retain the actual unit price used for the transaction
independent of later master-price changes.

### FR-PRI-022 --- POS price override request

**Source:** BR-POS-005\
**Priority:** MUST\
**Phase:** 1

Where permitted, POS shall allow a user to request a manual line-price
override.

**Acceptance:** A functional test demonstrates the stated behavior:
Where permitted, POS shall allow a user to request a manual line-price
override.

### FR-PRI-023 --- POS price override permission

**Source:** BR-POS-005, BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

A price override shall require the configured permission or manager
approval.

**Acceptance:** A functional test demonstrates the stated behavior: A
price override shall require the configured permission or manager
approval.

### FR-PRI-024 --- Price override audit

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

A completed sale containing an overridden price shall retain the
original/reference price, actual charged price, initiating user,
approver where required, and reason where policy requires.

**Acceptance:** A functional test demonstrates the stated behavior: A
completed sale containing an overridden price shall retain the
original/reference price, actual charged price, initiating user,
approver where required, and reason where policy requires.

### FR-PRI-025 --- Discount distinction

**Source:** BR-POS-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish a discount from a direct price override where
the business meaning differs.

Detailed discount rules are completed in the POS specification.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall distinguish a discount from a direct price override where
the business meaning differs.

### FR-PRI-026 --- Price below configured threshold

**Source:** BR-PRI-003, BR-POS-005\

**Priority:** MUST\
**Phase:** 1

MiniMart shall support a policy requiring warning, manager approval, or
blocking when a proposed selling price/override violates a configured
minimum/exception rule.

Exact threshold policy is open.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support a policy requiring warning, manager approval, or
blocking when a proposed selling price/override violates a configured
minimum/exception rule.

### FR-PRI-027 --- Missing price

**Source:** BR-PRI-001\

**Priority:** MUST\
**Phase:** 1

An item without a valid applicable selling price shall not be silently
sold at zero.

The system shall require authorized resolution according to policy.

**Acceptance:** A functional test demonstrates the stated behavior: An
item without a valid applicable selling price shall not be silently sold
at zero.

### FR-PRI-028 --- Zero-price item

**Source:** BR-PRI-001\

**Priority:** MUST\
**Phase:** 1

If a legitimate zero-price item/use case is supported, it shall be
explicitly configured/authorized rather than inferred from missing price
data.

**Acceptance:** A functional test demonstrates the stated behavior: If a
legitimate zero-price item/use case is supported, it shall be explicitly
configured/authorized rather than inferred from missing price data.

### FR-PRI-029 --- Price-label change queue

**Source:** BR-PRI-006\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall identify items whose relevant selling-price change
requires a new shelf/product price label according to configured policy.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall identify items whose relevant selling-price change
requires a new shelf/product price label according to configured policy.

### FR-PRI-030 --- Price-label completion

**Source:** BR-PRI-006\

**Priority:** COULD\
**Phase:** 1

Authorized users may mark label-change tasks as printed/completed.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users may mark label-change tasks as printed/completed.

### FR-PRI-031 --- Price lookup

**Source:** BR-PRI-001\

**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to view an item's current applicable
selling price and relevant price status.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to view an item's current applicable
selling price and relevant price status.

### FR-PRI-032 --- Future-price visibility

**Source:** BR-PRI-002\

**Priority:** SHOULD\
**Phase:** 1

Authorized pricing users should be able to see scheduled future prices
and effective dates.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized pricing users should be able to see scheduled future prices
and effective dates.

### FR-PRI-033 --- Price import

**Source:** BR-PRI-005\

**Priority:** SHOULD\
**Phase:** 1

MiniMart should support controlled import of price changes through the
common import workflow.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should support controlled import of price changes through the
common import workflow.

### FR-PRI-034 --- Price export

**Source:** BR-PRI-005\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to export relevant pricing data for
business review.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to export relevant pricing data for
business review.

### FR-PRI-035 --- Offline pricing availability

**Source:** BR-OPS-001, BR-POS-010\
**Priority:** MUST\
**Phase:** 1

Current pricing required for local store checkout shall remain available
when internet/cloud connectivity is unavailable.

**Acceptance:** A functional test demonstrates the stated behavior:
Current pricing required for local store checkout shall remain available
when internet/cloud connectivity is unavailable.

### FR-PRI-036 --- Country rule isolation

**Source:** BO-006\
**Priority:** MUST\
**Phase:** 1

Country-specific rounding, tax-price presentation, MRP or regulated
price behaviour shall be applied through country rules rather than
hardcoded as universal pricing behaviour.

## 4. Acceptance Scenarios

### AC-PRI-001 --- Future price

A future price is scheduled; before its effective point the old price is
used; after the effective point the new price is selected; historical
sales retain their charged price.

### AC-PRI-002 --- Unauthorized override

A cashier without override authority requests a lower price; MiniMart
requires authorized approval or denies according to policy; no silent
override occurs.

### AC-PRI-003 --- Missing price

A sellable item has no valid price; scanning it does not silently add a
zero-priced sale line.

### AC-PRI-004 --- Bulk update

A bulk file contains valid and invalid rows; MiniMart previews/validates
changes and reports invalid rows rather than silently discarding them.

## 5. Remaining Decisions

-   Minimum-price/negative-margin policy.
-   Whether price changes require maker-checker approval.
-   Discount hierarchy and interaction with overrides.
-   Country/payment rounding behavior requires verified country rules.
-   Price-label printer/workflow detail.
-   India MRP behavior and Malaysia tax-inclusive presentation require
    compliance verification.

**Resolved in v0.8/v0.9:** operational inventory costing uses moving
WAC; selling-price assignment is store-scoped from the initial model.

## 6. Traceability Summary

`BR-PRI-001 → FR-PRI-001, 020, 031`\
`BR-PRI-002 → FR-PRI-003–006, 032`\
`BR-PRI-003 → FR-PRI-007–012`\
`BR-PRI-004 → FR-PRI-013–015, 024`\
`BR-PRI-005 → FR-PRI-016–019, 033`\
`BR-PRI-006 → FR-PRI-029–030`\
`BR-POS-004/005 → FR-PRI-022–026`

**Acceptance:** A functional test demonstrates the stated behavior:
Country-specific rounding, tax-price presentation, MRP or regulated
price behaviour shall be applied through country rules rather than
hardcoded as universal pricing behaviour.
