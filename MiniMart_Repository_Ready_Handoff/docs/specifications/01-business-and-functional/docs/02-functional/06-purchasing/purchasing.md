# MiniMart Purchasing Core Functional Specification --- v0.3

**Document ID:** MM-FRS-PUR-001\
**Requirement prefix:** `FR-PUR`\
**Status:** Detailed Working Draft --- Batch 2

## Purpose

Define common purchasing behaviour shared by Purchase Order, Goods
Receipt and Purchase Return.

## Purchasing Core Requirements

### FR-PUR-001 --- Purchasing supplier context

**Source:** BR-PUR-001, BR-SUP-001\
**Priority:** MUST\
**Phase:** 1

Every purchase transaction shall identify an eligible supplier before
posting.

**Acceptance:** A posted purchase can be traced to one supplier.

### FR-PUR-002 --- Purchase document identity

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

Each purchase business document shall have a stable identity independent
of editable display/reference fields.

**Acceptance:** Changing a supplier reference does not change document
identity.

### FR-PUR-003 --- Supplier document reference

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall capture applicable supplier invoice, delivery-note or
other external reference information.

**Acceptance:** The external reference is searchable.

### FR-PUR-004 --- Purchase document date

**Source:** BR-PUR-001\
**Priority:** MUST\
**Phase:** 1

A purchase document shall retain its applicable supplier/document date
and MiniMart posting/business date.

**Acceptance:** Users can distinguish supplier date from posting date.

### FR-PUR-005 --- Purchase line item

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Each purchase line shall identify item, purchase quantity, applicable
unit and purchase cost inputs.

**Acceptance:** Posting is blocked when required line information is
missing.

### FR-PUR-006 --- Purchase quantity validation

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Purchase quantities shall be validated against the item's allowed unit
and quantity precision.

**Acceptance:** Invalid precision/unit combinations are rejected.

### FR-PUR-007 --- Purchase unit conversion

**Source:** BR-PUR-003, BR-CAT-004\
**Priority:** MUST\
**Phase:** 1

When purchase unit differs from inventory base unit, MiniMart shall
apply an explicit configured conversion.

**Acceptance:** No implicit pack conversion is invented.

### FR-PUR-008 --- Purchase cost input

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall capture agreed purchase cost using exact monetary
semantics.

**Acceptance:** Posted document retains actual transaction cost inputs.

### FR-PUR-009 --- Line discount

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support purchase-line discounts where used by the
supplier document.

**Acceptance:** Net line amount is reproducible.

### FR-PUR-010 --- Document discount

**Source:** BR-PUR-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should support supplier-document-level discounts where
required, with defined allocation/accounting treatment before posting.

**Acceptance:** Document cannot post if required allocation treatment is
undefined.

### FR-PUR-011 --- Purchase tax inputs

**Source:** BR-PUR-003\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1/2

MiniMart shall capture/apply purchase tax information required by the
active country pack without embedding one country's tax model in core
purchasing.

**Acceptance:** Country-specific validation is delegated to the active
pack.

### FR-PUR-012 --- Free quantity

**Source:** BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish invoiced quantity from supplier free quantity
when both affect received stock.

**Acceptance:** Free units increase physical stock without being
silently treated as invoiced units.

### FR-PUR-013 --- Batch input

**Source:** BR-PUR-003, BR-INV-005\
**Priority:** MUST

**Applicability:** Where the item requires the capability\
**Phase:** 1

Batch-tracked items shall require applicable batch information during
receiving/posting.

**Acceptance:** Required batch data cannot be omitted.

### FR-PUR-014 --- Expiry input

**Source:** BR-PUR-003, BR-INV-005\
**Priority:** MUST

**Applicability:** Where the item requires the capability\
**Phase:** 1

Expiry-tracked items shall require applicable expiry information during
receiving/posting.

**Acceptance:** Required expiry data cannot be omitted.

### FR-PUR-015 --- Skeleton item during purchasing

**Source:** BR-CAT-007, BR-PUR-003\
**Priority:** MUST\
**Phase:** 1

Authorized purchasing/receiving users shall be able to invoke controlled
skeleton-item creation when an item is genuinely missing.

**Acceptance:** The item remains marked incomplete according to Catalog
rules.

### FR-PUR-016 --- Purchasing permission

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Create, approve, receive, return, cancel and post actions shall require
applicable purchasing permission.

**Acceptance:** A denied action creates no protected business effect.

### FR-PUR-017 --- Purchasing audit

**Source:** BR-AUD-001, BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Material purchasing actions shall be auditable, including posting,
cancellation/reversal, exceptional receipt and manager approval.

**Acceptance:** Audit identifies actor, document and action.

### FR-PUR-018 --- Offline purchasing

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Defined local purchasing/receiving operations shall continue when
internet/cloud is unavailable while Store Node and store database remain
operational.

**Acceptance:** Cloud loss alone does not block a valid local GRN.

### FR-PUR-019 --- Safe retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Retrying a purchase posting after timeout/restart shall not create
duplicate stock or financial effect.

**Acceptance:** Repeated submission results in one effective posting.

### FR-PUR-020 --- Posted purchase immutability

**Source:** BR-DATA-001, BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted stock/financial purchase document shall not be edited to
silently change its historical effect; corrections use an explicit
defined process.

**Acceptance:** Original and corrective records remain traceable.

## Cross-module rules

-   Purchase documents use Supplier and Catalog masters; they do not
    duplicate those masters.
-   Posted stock-affecting purchase documents are immutable in economic
    effect.
-   Stock changes are created only by defined posted business events.
-   Country-specific tax/e-invoice treatment is outside core purchasing
    until verified and specified.
-   Costing remains an explicit decision; purchasing provides inputs but
    does not invent valuation policy.

## Remaining decisions

-   Supplier invoice duplicate policy (`DEC-PUR-003`).
-   PO mandatory policy (`DEC-PUR-001`) and direct-GRN policy
    (`DEC-PUR-002`) remain proposed.
-   Purchase-document numbering scope (`DEC-COM-002`).
-   Country tax/compliance fields require verified country rules.
-   Approval thresholds / default PO approval (`DEC-PUR-008`).

**Resolved in v0.8/v0.9:** purchase document discount allocation and
acquisition-cost treatment are defined by the WAC baseline.
