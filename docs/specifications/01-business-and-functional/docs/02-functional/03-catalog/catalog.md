# MiniMart Product Catalog Functional Specification --- v0.2

**Document ID:** MM-FRS-CAT-001\
**Requirement prefix:** `FR-CAT`\
**Status:** Detailed Working Draft --- Batch 1\
**Parent:** `../FRS.md`\
**Primary BRD sources:** `BR-CAT-001` through `BR-CAT-008`,
`BR-DATA-007`, `BR-LOC-*`

## 1. Purpose

Define MiniMart product/item master behaviour required by purchasing,
inventory, pricing and POS.

The catalog describes sellable/purchasable business items. It does not
define stock ledger tables or POS screen layout.

## 2. Actors

-   `ACT-002` Administrator
-   `ACT-003` Store Manager
-   `ACT-006` Purchase Staff
-   `ACT-007` Inventory Staff
-   `ACT-005` Cashier --- lookup/use; restricted creation only where
    explicitly permitted

## 3. Functional Requirements

### FR-CAT-001 --- Create item

**Source:** BR-CAT-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create an item/product master record
with the minimum information required by current store/country policy.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to create an item/product master record
with the minimum information required by current store/country policy.

### FR-CAT-002 --- Stable company-wide item identity

**Source:** BR-CAT-001\
**Priority:** MUST\
**Phase:** 1

Each item shall have a stable identity unique within the company/tenant
catalog. The same Item identity shall be referenced by all stores;
store-specific assortment, stock, cost, reorder settings and price
assignments shall not require cloning the Item master.

**Acceptance:** Moving from one store to multiple stores does not
require creating a second Item identity for the same catalog item.

### FR-CAT-003 --- Internal item code

**Source:** BR-CAT-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support an internal item code/SKU suitable for
human/business reference.

The exact generation/manual-entry policy shall be configurable or
defined before baseline.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support an internal item code/SKU suitable for
human/business reference.

### FR-CAT-004 --- Item description

**Source:** BR-CAT-001\

**Priority:** MUST\
**Phase:** 1

Each active sellable item shall have a customer/operator-meaningful
description.

**Acceptance:** A functional test demonstrates the stated behavior: Each
active sellable item shall have a customer/operator-meaningful
description.

### FR-CAT-005 --- Short/receipt description

**Source:** BR-CAT-001\

**Priority:** SHOULD\
**Phase:** 1

MiniMart should support a shorter receipt/display description where
required by receipt width or business preference.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should support a shorter receipt/display description where
required by receipt width or business preference.

### FR-CAT-006 --- Item activation/deactivation

**Source:** BR-CAT-001\

**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to deactivate an item so it cannot be
used for new transactions where policy prohibits it.

Historical transactions shall retain the item's historical meaning.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to deactivate an item so it cannot be
used for new transactions where policy prohibits it.

### FR-CAT-007 --- Item reactivation

**Source:** BR-CAT-001\

**Priority:** SHOULD\
**Phase:** 1

Authorized users shall be able to reactivate an eligible deactivated
item.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to reactivate an eligible deactivated
item.

### FR-CAT-008 --- No destructive deletion of referenced item

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

An item referenced by posted business transactions shall not be
destructively deleted through ordinary catalog administration.

**Acceptance:** A functional test demonstrates the stated behavior: An
item referenced by posted business transactions shall not be
destructively deleted through ordinary catalog administration.

### FR-CAT-009 --- Primary barcode

**Source:** BR-CAT-002, BR-CAT-003\
**Priority:** MUST\
**Phase:** 1

An item may have a primary barcode used as its preferred
scanning/printing identifier.

**Acceptance:** A functional test demonstrates the stated behavior: An
item may have a primary barcode used as its preferred scanning/printing
identifier.

### FR-CAT-010 --- Multiple barcodes

**Source:** BR-CAT-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall allow multiple valid barcodes to resolve to the same
item.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall allow multiple valid barcodes to resolve to the same
item.

### FR-CAT-011 --- Barcode uniqueness

**Source:** BR-CAT-002\
**Priority:** MUST\
**Phase:** 1

A barcode/identifier governed as unique shall not resolve to more than
one active Item within the company/tenant catalog scope, except where an
explicitly approved barcode format defines a different namespace.

**Acceptance:** A normal scan has one deterministic active Item result
across the company catalog.

### FR-CAT-012 --- Alternate barcode

**Source:** BR-CAT-002\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to add/remove alternate barcodes subject
to uniqueness and audit rules.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to add/remove alternate barcodes subject
to uniqueness and audit rules.

### FR-CAT-013 --- Supplier barcode

**Source:** BR-CAT-002, BR-SUP-003\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support associating supplier-specific item/barcode
references with an item where required for receiving/import.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support associating supplier-specific item/barcode
references with an item where required for receiving/import.

### FR-CAT-014 --- PLU

**Source:** BR-CAT-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support a PLU or equivalent short lookup identifier for
applicable items.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support a PLU or equivalent short lookup identifier for
applicable items.

### FR-CAT-015 --- Internally generated barcode

**Source:** BR-CAT-002\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support generating/assigning an internal barcode for
products lacking a usable manufacturer barcode.

Barcode format/label design is specified later.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support generating/assigning an internal barcode for
products lacking a usable manufacturer barcode.

### FR-CAT-016 --- Barcode reassignment control

**Source:** BR-CAT-002, BR-DATA-007\

**Priority:** MUST\
**Phase:** 1

Reassigning an existing barcode from one item to another shall be a
controlled operation that prevents ambiguous scanning and is auditable
where material.

**Acceptance:** A functional test demonstrates the stated behavior:
Reassigning an existing barcode from one item to another shall be a
controlled operation that prevents ambiguous scanning and is auditable
where material.

### FR-CAT-017 --- Category

**Source:** BR-CAT-004\
**Priority:** MUST\
**Phase:** 1

Items shall support assignment to a category.

**Acceptance:** A functional test demonstrates the stated behavior:
Items shall support assignment to a category.

### FR-CAT-018 --- Subcategory

**Source:** BR-CAT-004\
**Priority:** SHOULD\
**Phase:** 1

Items should support subcategory classification where enabled.

**Acceptance:** A functional test demonstrates the stated behavior:
Items should support subcategory classification where enabled.

### FR-CAT-019 --- Brand

**Source:** BR-CAT-004\
**Priority:** SHOULD\
**Phase:** 1

Items shall support optional brand assignment.

**Acceptance:** A functional test demonstrates the stated behavior:
Items shall support optional brand assignment.

### FR-CAT-020 --- Category maintenance

**Source:** BR-CAT-003\

**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create, rename, deactivate and search
categories without corrupting historical item/transaction meaning.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to create, rename, deactivate and search
categories without corrupting historical item/transaction meaning.

### FR-CAT-021 --- Brand maintenance

**Source:** BR-CAT-003\

**Priority:** SHOULD\
**Phase:** 1

Authorized users shall be able to create, rename, deactivate and search
brands.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to create, rename, deactivate and search
brands.

### FR-CAT-022 --- Base unit of measure

**Source:** BR-CAT-004\
**Priority:** MUST\
**Phase:** 1

Each item shall have a defined base unit of measure appropriate to
inventory/quantity interpretation.

**Acceptance:** A functional test demonstrates the stated behavior: Each
item shall have a defined base unit of measure appropriate to
inventory/quantity interpretation.

### FR-CAT-023 --- Sales unit

**Source:** BR-CAT-003\

**Priority:** MUST\
**Phase:** 1

MiniMart shall define the unit/quantity interpretation used when an item
is sold.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall define the unit/quantity interpretation used when an item
is sold.

### FR-CAT-024 --- Purchase unit

**Source:** BR-CAT-003\

**Priority:** MUST\
**Phase:** 1

MiniMart shall support a purchase unit that may differ from the
base/sales unit when a defined conversion exists.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support a purchase unit that may differ from the
base/sales unit when a defined conversion exists.

### FR-CAT-025 --- Unit conversion

**Source:** BR-CAT-003\

**Priority:** MUST\
**Phase:** 1

Where purchase/sales units differ, MiniMart shall require an explicit
conversion relationship rather than infer one.

**Acceptance:** A functional test demonstrates the stated behavior:
Where purchase/sales units differ, MiniMart shall require an explicit
conversion relationship rather than infer one.

### FR-CAT-026 --- Fractional quantity

**Source:** BR-CAT-006\
**Priority:** MUST\
**Phase:** 1

An item shall be configurable to allow or disallow fractional
quantities.

**Acceptance:** A functional test demonstrates the stated behavior: An
item shall be configurable to allow or disallow fractional quantities.

### FR-CAT-027 --- Weighed item

**Source:** BR-CAT-006\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support items whose sold quantity may originate from
weight.

Scale/barcode encoding details belong to hardware/country configuration.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support items whose sold quantity may originate from
weight.

### FR-CAT-028 --- Quantity precision

**Source:** BR-CAT-005\

**Priority:** MUST\
**Phase:** 1

MiniMart shall enforce item/unit-appropriate quantity precision and
shall not silently round quantities in a way that changes business
meaning.

Exact precision limits are a data/domain decision.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall enforce item/unit-appropriate quantity precision and
shall not silently round quantities in a way that changes business
meaning.

### FR-CAT-029 --- Batch-tracked item

**Source:** BR-CAT-005, BR-INV-005\
**Priority:** MUST\
**Phase:** 1

An item shall be configurable as batch-tracked where required.

**Acceptance:** A functional test demonstrates the stated behavior: An
item shall be configurable as batch-tracked where required.

### FR-CAT-030 --- Expiry-tracked item

**Source:** BR-CAT-005, BR-INV-005\
**Priority:** MUST\
**Phase:** 1

An item shall be configurable as expiry-tracked where required.

**Acceptance:** A functional test demonstrates the stated behavior: An
item shall be configurable as expiry-tracked where required.

### FR-CAT-031 --- Tracking-rule change control

**Source:** BR-CAT-006, BR-DATA-007\

**Priority:** MUST\
**Phase:** 1

Changing batch/expiry tracking rules after transactions/stock exist
shall be controlled and must not silently invalidate existing inventory
history.

**Acceptance:** A functional test demonstrates the stated behavior:
Changing batch/expiry tracking rules after transactions/stock exist
shall be controlled and must not silently invalidate existing inventory
history.

### FR-CAT-032 --- Sellable flag

**Source:** BR-CAT-001\

**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish whether an item may be sold through POS.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall distinguish whether an item may be sold through POS.

### FR-CAT-033 --- Purchasable flag

**Source:** BR-CAT-001\

**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish whether an item may be purchased/received.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall distinguish whether an item may be purchased/received.

### FR-CAT-034 --- Skeleton item creation

**Source:** BR-CAT-007\
**Priority:** MUST\
**Phase:** 1

Authorized workflows shall allow rapid creation of a minimally defined
skeleton item when operationally necessary.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized workflows shall allow rapid creation of a minimally defined
skeleton item when operationally necessary.

### FR-CAT-035 --- Skeleton status

**Source:** BR-CAT-006\

**Priority:** MUST\
**Phase:** 1

A skeleton/incomplete item shall be visibly distinguishable from a fully
completed item master.

**Acceptance:** A functional test demonstrates the stated behavior: A
skeleton/incomplete item shall be visibly distinguishable from a fully
completed item master.

### FR-CAT-036 --- Skeleton minimum fields

**Source:** BR-CAT-006\

**Priority:** MUST\
**Phase:** 1

MiniMart shall enforce a minimum safe set of fields for skeleton
creation, sufficient to identify the item and prevent ambiguous use.

The exact minimum fields are to be finalized with Purchasing/POS
requirements.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall enforce a minimum safe set of fields for skeleton
creation, sufficient to identify the item and prevent ambiguous use.

### FR-CAT-037 --- Skeleton completion queue

**Source:** BR-CAT-006\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to find incomplete/skeleton items
requiring master-data completion.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to find incomplete/skeleton items
requiring master-data completion.

### FR-CAT-038 --- Skeleton restrictions

**Source:** BR-CAT-006\

**Priority:** MUST\
**Phase:** 1

MiniMart shall allow configured restrictions on selling or other use of
incomplete items until mandatory information is completed.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall allow configured restrictions on selling or other use of
incomplete items until mandatory information is completed.

### FR-CAT-039 --- Item search by barcode

**Source:** BR-CAT-005\
**Priority:** MUST\
**Phase:** 1

Users shall be able to locate an item using any active valid barcode.

**Acceptance:** A functional test demonstrates the stated behavior:
Users shall be able to locate an item using any active valid barcode.

### FR-CAT-040 --- Item search by code

**Source:** BR-CAT-007\

**Priority:** MUST\
**Phase:** 1

Users shall be able to locate an item by internal item code/SKU.

**Acceptance:** A functional test demonstrates the stated behavior:
Users shall be able to locate an item by internal item code/SKU.

### FR-CAT-041 --- Item search by description

**Source:** BR-CAT-007\

**Priority:** MUST\
**Phase:** 1

Users shall be able to search by item description with behaviour
practical for large catalogs.

**Acceptance:** A functional test demonstrates the stated behavior:
Users shall be able to search by item description with behaviour
practical for large catalogs.

### FR-CAT-042 --- Filter catalog

**Source:** BR-CAT-007\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to filter catalog results by status,
category, brand and other relevant master attributes.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to filter catalog results by status,
category, brand and other relevant master attributes.

### FR-CAT-043 --- Large catalog operation

**Source:** BR-CAT-005\
**Priority:** MUST\
**Phase:** 1

Catalog functions used during checkout and ordinary maintenance shall
remain practical at the Phase-1 target of 30,000--50,000+ items.

Performance gates are defined in NFRS.

**Acceptance:** A functional test demonstrates the stated behavior:
Catalog functions used during checkout and ordinary maintenance shall
remain practical at the Phase-1 target of 30,000--50,000+ items.

### FR-CAT-044 --- Duplicate detection

**Source:** BR-CAT-001, BR-CAT-002\

**Priority:** MUST\
**Phase:** 1

During item creation/import, MiniMart shall detect likely hard
duplicates based on unique identifiers such as barcode/item code and
shall not silently create conflicting identifiers.

**Acceptance:** A functional test demonstrates the stated behavior:
During item creation/import, MiniMart shall detect likely hard
duplicates based on unique identifiers such as barcode/item code and
shall not silently create conflicting identifiers.

### FR-CAT-045 --- Potential duplicate warning

**Source:** BR-CAT-001, BR-CAT-002\

**Priority:** SHOULD\
**Phase:** 1

MiniMart should warn about likely duplicate products based on configured
matching criteria while allowing an authorized user to distinguish
legitimate similar items.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should warn about likely duplicate products based on configured
matching criteria while allowing an authorized user to distinguish
legitimate similar items.

### FR-CAT-046 --- Bulk import

**Source:** BR-CAT-008\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to import product master data from
supported spreadsheet/CSV formats.

Detailed import workflow is defined in `15-import-export`.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to import product master data from
supported spreadsheet/CSV formats.

### FR-CAT-047 --- Import validation

**Source:** BR-CAT-008\

**Priority:** MUST\
**Phase:** 1

Catalog import shall validate mandatory fields, identifiers, units and
references before committing invalid data.

**Acceptance:** A functional test demonstrates the stated behavior:
Catalog import shall validate mandatory fields, identifiers, units and
references before committing invalid data.

### FR-CAT-048 --- Import error visibility

**Source:** BR-CAT-008\

**Priority:** MUST\
**Phase:** 1

Rejected/invalid import rows shall be reported with enough information
for correction; they shall not be silently discarded.

**Acceptance:** A functional test demonstrates the stated behavior:
Rejected/invalid import rows shall be reported with enough information
for correction; they shall not be silently discarded.

### FR-CAT-049 --- Bulk update

**Source:** BR-CAT-008\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to perform controlled bulk updates to
eligible catalog attributes.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to perform controlled bulk updates to
eligible catalog attributes.

### FR-CAT-050 --- Catalog change audit

**Source:** BR-AUD-001, BR-PRI-004\
**Priority:** MUST\
**Phase:** 1

Material item-master changes such as barcode reassignment, tracking-rule
change, activation status and key classification changes shall be
auditable according to policy.

**Acceptance:** A functional test demonstrates the stated behavior:
Material item-master changes such as barcode reassignment, tracking-rule
change, activation status and key classification changes shall be
auditable according to policy.

### FR-CAT-051 --- Historical item description/value preservation

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Later changes to item description, barcode, category or other master
data shall not make posted historical transactions misleading.

**Acceptance:** A functional test demonstrates the stated behavior:
Later changes to item description, barcode, category or other master
data shall not make posted historical transactions misleading.

### FR-CAT-052 --- Tax classification extension point

**Source:** BR-CAT-004\

**Priority:** MUST\
**Phase:** 1

The catalog shall support country-specific tax classification/reference
information without embedding one country's tax model as universal.

Detailed tax fields are country-spec requirements.

**Acceptance:** A functional test demonstrates the stated behavior: The
catalog shall support country-specific tax classification/reference
information without embedding one country's tax model as universal.

### FR-CAT-053 --- Regulatory product attributes extension point

**Source:** BR-CAT-004\

**Priority:** MUST\
**Phase:** 1

The item master shall permit country-specific product attributes such as
HSN/MRP or other required classifications through country behaviour
without forking the core catalog.

**Acceptance:** A functional test demonstrates the stated behavior: The
item master shall permit country-specific product attributes such as
HSN/MRP or other required classifications through country behaviour
without forking the core catalog.

### FR-CAT-054 --- Supplier association

**Source:** BR-SUP-003\
**Priority:** MUST\
**Phase:** 1

An item may be associated with one or more suppliers and
supplier-specific purchasing references.

**Acceptance:** A functional test demonstrates the stated behavior: An
item may be associated with one or more suppliers and supplier-specific
purchasing references.

### FR-CAT-055 --- Preferred supplier

**Source:** BR-SUP-004\

**Priority:** SHOULD\
**Phase:** 1

MiniMart should support designating a preferred/default supplier for an
item without preventing purchases from other authorized suppliers.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should support designating a preferred/default supplier for an
item without preventing purchases from other authorized suppliers.

### FR-CAT-056 --- Item notes

**Source:** BR-CAT-001\

**Priority:** COULD\
**Phase:** 1

Authorized users may record internal item notes that are not
automatically customer-facing.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users may record internal item notes that are not
automatically customer-facing.

### FR-CAT-057 --- Catalog availability offline

**Source:** BR-OPS-001, BR-POS-010\
**Priority:** MUST\
**Phase:** 1

Catalog information required for ordinary store POS/purchasing lookup
shall remain available when internet/cloud connectivity is unavailable.

**Acceptance:** A functional test demonstrates the stated behavior:
Catalog information required for ordinary store POS/purchasing lookup
shall remain available when internet/cloud connectivity is unavailable.

### FR-CAT-058 --- Unsupported/invalid item state

**Source:** BR-CAT-001\

**Priority:** MUST\
**Phase:** 1

If an item is inactive, incomplete beyond allowed policy, or otherwise
not eligible for the requested transaction, MiniMart shall explain the
restriction and shall not silently treat it as a normal eligible item.

**Acceptance:** A functional test demonstrates the stated behavior: If
an item is inactive, incomplete beyond allowed policy, or otherwise not
eligible for the requested transaction, MiniMart shall explain the
restriction and shall not silently treat it as a normal eligible item.

### FR-CAT-059 --- Catalog permission control

**Source:** BR-SEC-003\

**Priority:** MUST\
**Phase:** 1

Create/edit/deactivate/import/bulk-update operations shall require
appropriate catalog permissions.

**Acceptance:** A functional test demonstrates the stated behavior:
Create/edit/deactivate/import/bulk-update operations shall require
appropriate catalog permissions.

### FR-CAT-060 --- Catalog export

**Source:** BR-CAT-008\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to export catalog data in a practical
business format for review/maintenance, subject to access policy.

## 4. Main Workflows

### WF-CAT-001 --- Create normal item

1.  Authorized user starts item creation.
2.  Enters item code/description and required classification/unit data.
3.  Adds one or more barcodes as applicable.
4.  Configures sellable/purchasable, fractional, batch/expiry settings.
5.  System validates uniqueness and required fields.
6.  User saves item.
7.  Item becomes available to permitted downstream workflows.

### WF-CAT-002 --- Create skeleton item during receiving

1.  Purchase/receiving user cannot find an item.
2.  User invokes permitted quick-create.
3.  Enters minimum required identifying data.
4.  MiniMart validates identifiers.
5.  Skeleton item is created and visibly marked incomplete.
6.  Receiving continues if policy allows.
7.  Item appears in completion queue.

### WF-CAT-003 --- Add alternate barcode

1.  User locates item.
2.  Adds barcode.
3.  System checks uniqueness.
4.  If unique, barcode is assigned.
5.  Material change is audited.

## 5. Remaining Decisions

-   Item-code generation/manual-entry policy.
-   Exact minimum fields for skeleton items.
-   Whether skeleton items may be sold before completion.
-   Exact UoM conversion model and whether multi-level packs are Phase
    1.
-   Weighted-barcode formats.
-   Default item/category hierarchy depth.
-   Exact catalog bulk-update permissions.
-   Country-specific mandatory product fields require verified country
    rules.

**Resolved in v0.8/v0.9:** Item identity is company/tenant-wide;
store-specific stock/cost/price/assortment does not clone the Item.

## 6. Traceability Summary

`BR-CAT-001 → FR-CAT-001–008`\
`BR-CAT-002 → FR-CAT-003, 009, 012–015`\
`BR-CAT-003 → FR-CAT-009–016`\
`BR-CAT-004 → FR-CAT-017–025`\
`BR-CAT-005 → FR-CAT-029–031, 039–043`\
`BR-CAT-006 → FR-CAT-026–028`\
`BR-CAT-007 → FR-CAT-034–038`\
`BR-CAT-008 → FR-CAT-046–049`\
`BR-DATA-007 → FR-CAT-008, 031, 051`

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to export catalog data in a practical
business format for review/maintenance, subject to access policy.
