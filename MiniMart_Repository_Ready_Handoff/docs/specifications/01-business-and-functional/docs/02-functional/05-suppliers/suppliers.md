# MiniMart Supplier Management Functional Specification --- v0.2

**Document ID:** MM-FRS-SUP-001\
**Requirement prefix:** `FR-SUP`\
**Status:** Detailed Working Draft --- Batch 1\
**Parent:** `../FRS.md`\
**Primary BRD sources:** `BR-SUP-001` through `BR-SUP-005`, `BR-PUR-*`,
`BR-ACC-002`, `BR-DATA-007`

## 1. Purpose

Define supplier master, supplier contacts, commercial terms, item
relationships, supplier search/history and supplier status behaviour
used by purchasing and payables.

This document does not define purchase posting, supplier-ledger tables,
or payment accounting.

## 2. Actors

-   `ACT-001` Business Owner
-   `ACT-002` Administrator
-   `ACT-003` Store Manager
-   `ACT-006` Purchase Staff
-   `ACT-008` Accountant / Bookkeeper

## 3. Functional Requirements

### FR-SUP-001 --- Create supplier

**Source:** BR-SUP-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to create a supplier master record.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to create a supplier master record.

### FR-SUP-002 --- Stable company-wide supplier identity

**Source:** BR-SUP-001\
**Priority:** MUST\
**Phase:** 1

Each supplier shall have a stable company/tenant-wide identity
independent of supplier name, contact details, store purchasing activity
or later commercial changes. Store-specific purchasing relationships
shall reference the same Supplier identity rather than clone it.

**Acceptance:** The same supplier can serve multiple stores while
retaining one canonical supplier identity.

### FR-SUP-003 --- Supplier code

**Source:** BR-SUP-001\

**Priority:** MUST\
**Phase:** 1

MiniMart shall support a human/business supplier code or equivalent
reference.

Exact manual/automatic numbering policy is open.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support a human/business supplier code or equivalent
reference.

### FR-SUP-004 --- Supplier name

**Source:** BR-SUP-001\
**Priority:** MUST\
**Phase:** 1

Each active supplier shall have a meaningful supplier/business name.

**Acceptance:** A functional test demonstrates the stated behavior: Each
active supplier shall have a meaningful supplier/business name.

### FR-SUP-005 --- Legal/trading identity

**Source:** BR-SUP-002\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support legal/trading identity information appropriate to
the supplier relationship.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support legal/trading identity information appropriate to
the supplier relationship.

### FR-SUP-006 --- Contact information

**Source:** BR-SUP-002\
**Priority:** MUST\
**Phase:** 1

Supplier records shall support practical contact information such as
phone, email and address.

**Acceptance:** A functional test demonstrates the stated behavior:
Supplier records shall support practical contact information such as
phone, email and address.

### FR-SUP-007 --- Multiple contacts

**Source:** BR-SUP-001\

**Priority:** SHOULD\
**Phase:** 1

A supplier should support multiple named contacts or contact purposes
where required.

**Acceptance:** A functional test demonstrates the stated behavior: A
supplier should support multiple named contacts or contact purposes
where required.

### FR-SUP-008 --- Tax/registration information

**Source:** BR-SUP-002\
**Priority:** MUST

**Applicability:** Where applicable\
**Phase:** 1

MiniMart shall support supplier tax/registration identifiers required by
the applicable country/business process.

Country-specific mandatory fields belong to country specifications.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support supplier tax/registration identifiers required by
the applicable country/business process.

### FR-SUP-009 --- Payment terms

**Source:** BR-SUP-002\
**Priority:** MUST\
**Phase:** 1

Supplier records shall support configured/default payment terms for
purchasing/payables workflows.

**Acceptance:** A functional test demonstrates the stated behavior:
Supplier records shall support configured/default payment terms for
purchasing/payables workflows.

### FR-SUP-010 --- Credit terms

**Source:** BR-SUP-002\
**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support relevant supplier credit terms/credit-period
information.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support relevant supplier credit terms/credit-period
information.

### FR-SUP-011 --- Supplier status

**Source:** BR-SUP-001\

**Priority:** MUST\
**Phase:** 1

MiniMart shall distinguish active and inactive suppliers.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall distinguish active and inactive suppliers.

### FR-SUP-012 --- Deactivate supplier

**Source:** BR-SUP-001\

**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to deactivate a supplier to prevent new
purchasing where policy prohibits it.

Historical transactions shall remain linked to the supplier.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to deactivate a supplier to prevent new
purchasing where policy prohibits it.

### FR-SUP-013 --- Reactivate supplier

**Source:** BR-SUP-001\

**Priority:** SHOULD\
**Phase:** 1

Authorized users shall be able to reactivate an eligible supplier.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to reactivate an eligible supplier.

### FR-SUP-014 --- No destructive deletion of referenced supplier

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

A supplier referenced by posted transactions shall not be destructively
deleted through ordinary administration.

**Acceptance:** A functional test demonstrates the stated behavior: A
supplier referenced by posted transactions shall not be destructively
deleted through ordinary administration.

### FR-SUP-015 --- Supplier search by name

**Source:** BR-SUP-001\

**Priority:** MUST\
**Phase:** 1

Users shall be able to search suppliers by name.

**Acceptance:** A functional test demonstrates the stated behavior:
Users shall be able to search suppliers by name.

### FR-SUP-016 --- Supplier search by code

**Source:** BR-SUP-001\

**Priority:** MUST\
**Phase:** 1

Users shall be able to search suppliers by supplier code/reference.

**Acceptance:** A functional test demonstrates the stated behavior:
Users shall be able to search suppliers by supplier code/reference.

### FR-SUP-017 --- Supplier search by tax/registration identifier

**Source:** BR-SUP-001\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to search by configured registration/tax
identifier where appropriate.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to search by configured registration/tax
identifier where appropriate.

### FR-SUP-018 --- Duplicate supplier detection

**Source:** BR-SUP-001\

**Priority:** MUST\
**Phase:** 1

MiniMart shall detect hard conflicts in unique supplier identifiers and
should warn about likely duplicate supplier records.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall detect hard conflicts in unique supplier identifiers and
should warn about likely duplicate supplier records.

### FR-SUP-019 --- Supplier-item association

**Source:** BR-SUP-003\
**Priority:** MUST\
**Phase:** 1

A supplier may be associated with multiple items and an item may be
associated with multiple suppliers.

**Acceptance:** A functional test demonstrates the stated behavior: A
supplier may be associated with multiple items and an item may be
associated with multiple suppliers.

### FR-SUP-020 --- Supplier item reference

**Source:** BR-SUP-004\

**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support supplier-specific item code/barcode/reference
where useful for ordering/receiving/import.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support supplier-specific item code/barcode/reference
where useful for ordering/receiving/import.

### FR-SUP-021 --- Preferred supplier

**Source:** BR-SUP-004\

**Priority:** SHOULD\
**Phase:** 1

An item may have a preferred/default supplier while remaining
purchasable from other eligible suppliers.

**Acceptance:** A functional test demonstrates the stated behavior: An
item may have a preferred/default supplier while remaining purchasable
from other eligible suppliers.

### FR-SUP-022 --- Last purchase information

**Source:** BR-SUP-004\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to view relevant recent purchase history
for a supplier/item relationship, including historical purchase price
where available.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to view relevant recent purchase history
for a supplier/item relationship, including historical purchase price
where available.

### FR-SUP-023 --- Purchase-price history

**Source:** BR-SUP-004\
**Priority:** MUST\
**Phase:** 1

MiniMart shall preserve sufficient supplier/item purchase history to
understand prior purchase prices without rewriting posted purchase
documents.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall preserve sufficient supplier/item purchase history to
understand prior purchase prices without rewriting posted purchase
documents.

### FR-SUP-024 --- Supplier transaction history

**Source:** BR-SUP-004\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to view supplier-related purchasing
transactions according to permissions.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users shall be able to view supplier-related purchasing
transactions according to permissions.

### FR-SUP-025 --- Supplier balance extension

**Source:** BR-ACC-002\
**Priority:** MUST\
**Phase:** 2

Supplier master shall support linkage to supplier liability/payables
information without mixing editable master data with posted financial
history.

Detailed payable behaviour is specified later.

**Acceptance:** A functional test demonstrates the stated behavior:
Supplier master shall support linkage to supplier liability/payables
information without mixing editable master data with posted financial
history.

### FR-SUP-026 --- Supplier notes

**Source:** BR-SUP-001\

**Priority:** SHOULD\
**Phase:** 1

Authorized users may record internal supplier notes that are not
automatically exposed on supplier/customer-facing documents.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users may record internal supplier notes that are not
automatically exposed on supplier/customer-facing documents.

### FR-SUP-027 --- Supplier document references

**Source:** BR-SUP-003\

**Priority:** SHOULD\
**Phase:** 1

Supplier records/workflows should support relevant external references
used by purchasing, such as supplier invoice/order references, in the
appropriate transaction modules.

**Acceptance:** A functional test demonstrates the stated behavior:
Supplier records/workflows should support relevant external references
used by purchasing, such as supplier invoice/order references, in the
appropriate transaction modules.

### FR-SUP-028 --- Supplier edit permission

**Source:** BR-SEC-003\

**Priority:** MUST\
**Phase:** 1

Creating, editing, deactivating or reactivating suppliers shall require
appropriate supplier-master permissions.

**Acceptance:** A functional test demonstrates the stated behavior:
Creating, editing, deactivating or reactivating suppliers shall require
appropriate supplier-master permissions.

### FR-SUP-029 --- Supplier change audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Material supplier-master changes such as tax identifiers, payment terms
and activation status shall be auditable according to policy.

**Acceptance:** A functional test demonstrates the stated behavior:
Material supplier-master changes such as tax identifiers, payment terms
and activation status shall be auditable according to policy.

### FR-SUP-030 --- Historical supplier meaning

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Later changes to supplier name, address, tax identifier or payment terms
shall not make historical posted purchase documents misleading.

**Acceptance:** A functional test demonstrates the stated behavior:
Later changes to supplier name, address, tax identifier or payment terms
shall not make historical posted purchase documents misleading.

### FR-SUP-031 --- Supplier availability offline

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Supplier master information required for local store
purchasing/receiving shall remain available when internet/cloud
connectivity is unavailable.

**Acceptance:** A functional test demonstrates the stated behavior:
Supplier master information required for local store
purchasing/receiving shall remain available when internet/cloud
connectivity is unavailable.

### FR-SUP-032 --- Supplier import

**Source:** BR-SUP-001, BR-PUR-005\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to import supplier master data through
the common controlled import process.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to import supplier master data through
the common controlled import process.

### FR-SUP-033 --- Supplier export

**Source:** BR-SUP-005\

**Priority:** SHOULD\
**Phase:** 1

Authorized users should be able to export supplier master information
for legitimate business review, subject to permissions/privacy policy.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized users should be able to export supplier master information
for legitimate business review, subject to permissions/privacy policy.

### FR-SUP-034 --- Supplier country

**Source:** BR-SUP-001\

**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support supplier country/location information where
required for tax, purchasing or contact purposes.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support supplier country/location information where
required for tax, purchasing or contact purposes.

### FR-SUP-035 --- Supplier currency extension

**Source:** BR-SUP-002\

**Priority:** LATER\
**Phase:** 3+

The model shall not prevent future supplier-specific purchasing currency
support, but multi-currency purchasing is not assumed to be Phase 1.

**Acceptance:** A functional test demonstrates the stated behavior: The
model shall not prevent future supplier-specific purchasing currency
support, but multi-currency purchasing is not assumed to be Phase 1.

### FR-SUP-036 --- Advanced supplier performance extension

**Source:** BR-SUP-005\
**Priority:** LATER\
**Phase:** 5

The supplier master shall be extendable for future supplier performance
metrics without replacing the core supplier identity/history.

## 4. Acceptance Scenarios

### AC-SUP-001 --- Create and use supplier

Authorized Purchase Staff creates an active supplier with required
information; supplier becomes selectable for permitted purchasing
workflows.

### AC-SUP-002 --- Deactivate supplier

A supplier with historical purchases is deactivated; new purchases are
blocked/warned according to policy; historical purchases remain visible.

### AC-SUP-003 --- Multiple suppliers per item

One item is linked to Supplier A and Supplier B; purchasing can identify
both relationships; a preferred supplier may be set without deleting the
alternative.

### AC-SUP-004 --- Historical price

A supplier's current terms/name are changed; prior posted purchase
records retain their original transaction values and remain
understandable.

## 5. Remaining Decisions

-   Supplier-code numbering policy.
-   Mandatory supplier fields for Malaysia require verified compliance
    rules.
-   Whether supplier credit limit is needed in Phase 1.
-   Multi-currency supplier purchasing phase.
-   Whether supplier-item associations include default pack/UoM and lead
    time in Phase 1.
-   Duplicate matching criteria beyond unique identifiers.

**Resolved in v0.8/v0.9:** Supplier identity is company/tenant-wide and
Accounting-Lite defines supplier payable/payment scope.

## 6. Traceability Summary

`BR-SUP-001 → FR-SUP-001–004, 011–018`\
`BR-SUP-002 → FR-SUP-005–010`\
`BR-SUP-003 → FR-SUP-019–021`\
`BR-SUP-004 → FR-SUP-022–024`\
`BR-SUP-005 → FR-SUP-036`\
`BR-ACC-002 → FR-SUP-025`

**Acceptance:** A functional test demonstrates the stated behavior: The
supplier master shall be extendable for future supplier performance
metrics without replacing the core supplier identity/history.
