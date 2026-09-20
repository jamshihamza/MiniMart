# MiniMart POS Core Functional Specification --- v0.4

**Document ID:** MM-FRS-POS-001\
**Requirement namespace:** `FR-POS-001`--`FR-POS-035`\
**Status:** Detailed Working Draft --- Batch 3

## Purpose

Define cashier-facing sale construction, product entry, quantities,
customer attachment, pricing, discount and override behavior.

## Requirements

### FR-POS-001 --- Open POS terminal

**Source:** BR-POS-009\
**Priority:** MUST\
**Phase:** 1

An authorized cashier shall be able to open the POS workspace for the
configured store and counter.

**Acceptance:** POS identifies store, counter and signed-in user before
a sale starts.

### FR-POS-002 --- Counter configuration validation

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

POS shall verify that required local store/counter configuration is
valid before allowing posting.

**Acceptance:** Invalid configuration blocks posting with a clear
recovery message.

### FR-POS-003 --- Cashier authentication

**Source:** BR-SEC-001\
**Priority:** MUST\
**Phase:** 1

POS shall require an identifiable authenticated user for protected sale
actions.

**Acceptance:** Completed sale is attributable to a user.

### FR-POS-004 --- Start new sale

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to start a new sale when the counter is
operational.

**Acceptance:** A new sale starts empty and unposted.

### FR-POS-005 --- Single active sale context

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

The terminal shall maintain a clear active-sale context and prevent
accidental mixing of lines from different sales.

**Acceptance:** Lines added to one active sale do not appear in another.

### FR-POS-006 --- Scan active barcode

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

Scanning a valid active barcode shall add the corresponding sellable
item to the active sale.

**Acceptance:** Correct item and current applicable selling information
are shown.

### FR-POS-007 --- Repeated barcode scan

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

Repeated scanning shall follow a defined line-merging policy without
losing quantity accuracy.

**Acceptance:** Configured merge/separate-line behavior is
deterministic.

### FR-POS-008 --- Unknown barcode

**Source:** BR-POS-002\
**Priority:** MUST\
**Phase:** 1

An unknown barcode shall notify the cashier without clearing or
corrupting the active sale.

**Acceptance:** Existing sale lines remain intact.

### FR-POS-009 --- Inactive/non-sellable barcode

**Source:** BR-CAT-001\
**Priority:** MUST\
**Phase:** 1

A barcode resolving to an inactive or non-sellable item shall not be
silently sold.

**Acceptance:** POS blocks or applies an explicitly authorized
exception.

### FR-POS-010 --- Product search

**Source:** BR-POS-002\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to search sellable products by permitted
identifiers and description.

**Acceptance:** Search result can be added without leaving the sale.

### FR-POS-011 --- Search performance feedback

**Source:** BR-POS-002\
**Priority:** SHOULD\
**Phase:** 1

If product search is delayed, POS shall preserve cashier input and show
non-destructive progress/error feedback.

**Acceptance:** Sale remains usable after search failure.

### FR-POS-012 --- Add non-barcoded item

**Source:** BR-POS-002\
**Priority:** MUST\
**Phase:** 1

Authorized sale of a non-barcoded item shall be possible through product
search/PLU where configured.

**Acceptance:** Stable item identity is added.

### FR-POS-013 --- Quantity change

**Source:** BR-POS-003\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to change sale-line quantity within item precision
and permission rules.

**Acceptance:** Totals and stock checks recalculate correctly.

### FR-POS-014 --- Fractional quantity

**Source:** BR-CAT-006, BR-POS-003\
**Priority:** MUST\
**Phase:** 1

Items configured for fractional sale shall accept permitted decimal
quantities.

**Acceptance:** Invalid precision is rejected.

### FR-POS-015 --- Zero/negative sale quantity prevention

**Source:** BR-POS-003\
**Priority:** MUST\
**Phase:** 1

Ordinary sale lines shall not accept zero or negative quantities as a
substitute for returns.

**Acceptance:** Returns use the return workflow.

### FR-POS-016 --- Remove line

**Source:** BR-POS-008\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to remove an unposted sale line subject to
configured permission/audit rules.

**Acceptance:** Removal does not create stock movement before posting.

### FR-POS-017 --- Clear sale

**Source:** BR-POS-008\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to abandon/clear an unposted sale subject to
permission and reason rules.

**Acceptance:** No posted stock/payment effect remains.

### FR-POS-018 --- Line note

**Source:** BR-POS-001\
**Priority:** COULD\
**Phase:** 1

POS may support a non-financial line note where operationally useful.

**Acceptance:** Note does not alter item identity or pricing rules.

### FR-POS-019 --- Sale note

**Source:** BR-POS-001\
**Priority:** COULD\
**Phase:** 1

POS may support an internal sale note with appropriate visibility.

**Acceptance:** Note is retained without changing financial totals.

### FR-POS-020 --- Customer attachment

**Source:** BR-CUS-001, BR-CUS-002\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to attach an eligible customer when required,
while ordinary cash sale need not require customer registration.

**Acceptance:** Anonymous cash sale remains possible.

### FR-POS-021 --- Remove/change customer before posting

**Source:** BR-CUS-002\
**Priority:** MUST\
**Phase:** 1

Attached customer may be changed before posting subject to
credit/compliance constraints.

**Acceptance:** Final sale retains the customer actually used.

### FR-POS-022 --- Display running totals

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

POS shall continuously show
quantity/subtotal/discount/tax/rounding/payable totals applicable to the
active sale.

**Acceptance:** Displayed payable matches payment request.

### FR-POS-023 --- Exact money handling

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

POS monetary calculations shall use exact approved money/rounding rules
rather than binary floating-point behavior.

**Acceptance:** Test examples reproduce expected totals.

### FR-POS-024 --- Tax calculation delegation

**Source:** BR-POS-001\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1/2

POS shall obtain applicable tax behavior from approved pricing/country
rules rather than inventing tax treatment.

**Acceptance:** Core POS remains country-neutral.

### FR-POS-025 --- Item price selection

**Source:** BR-PRI-001, BR-POS-001\
**Priority:** MUST\
**Phase:** 1

When an item is added, POS shall select the applicable approved selling
price for store/date/context.

**Acceptance:** Displayed line price is traceable to pricing rules.

### FR-POS-026 --- Effective price changes during active sale

**Source:** BR-PRI-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall define whether already-added lines retain their selected
price when master price changes during an active sale; the chosen
behavior shall be deterministic.

**Acceptance:** A concurrent price update cannot silently produce mixed
unexplained totals.

### FR-POS-027 --- Line discount

**Source:** BR-POS-004\
**Priority:** MUST\
**Phase:** 1

Authorized cashier shall be able to apply permitted line discount
according to pricing/permission rules.

**Acceptance:** Discount amount/rate and actor are retained.

### FR-POS-028 --- Sale discount

**Source:** BR-POS-004\
**Priority:** MUST\
**Phase:** 1

Authorized user shall be able to apply permitted transaction-level
discount according to defined allocation rules.

**Acceptance:** Final line/document totals reconcile.

### FR-POS-029 --- Discount limit

**Source:** BR-POS-004\
**Priority:** MUST\
**Phase:** 1

POS shall enforce role/store/item discount limits.

**Acceptance:** Excess discount is blocked or requires manager override.

### FR-POS-030 --- Discount reason

**Source:** BR-AUD-004\
**Priority:** SHOULD\
**Phase:** 1

Configured discount types/thresholds shall require a reason.

**Acceptance:** Required reason is retained before completion.

### FR-POS-031 --- Price override

**Source:** BR-POS-005\
**Priority:** MUST\
**Phase:** 1

POS shall support controlled manual price override only for authorized
users or manager override.

**Acceptance:** Original and overridden price are retained.

### FR-POS-032 --- Price override floor/ceiling

**Source:** BR-POS-005\
**Priority:** MUST\
**Phase:** 1

Configured price-override limits shall be enforced.

**Acceptance:** Out-of-policy price cannot be posted without defined
approval.

### FR-POS-033 --- Price override reason

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Manual price override shall require a reason according to policy.

**Acceptance:** Reason and actor are auditable.

### FR-POS-034 --- Manager override identity

**Source:** BR-SEC-004\
**Priority:** MUST\
**Phase:** 1

A manager override shall identify the approving manager separately from
the cashier.

**Acceptance:** Sale audit shows both actors.

### FR-POS-035 --- Recalculate after commercial change

**Source:** BR-POS-004, BR-POS-005\
**Priority:** MUST\
**Phase:** 1

Quantity, price, discount or customer changes shall recalculate all
dependent totals before payment.

**Acceptance:** Payment cannot use stale totals.

## Core checkout principle

A cashier may build and edit an **unposted** sale. Once a sale is
posted, its economic effect is immutable and correction moves to the
Sales Return/Refund workflow.
