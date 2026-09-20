# MiniMart Domain Ownership & Versioning Baseline --- v0.8

**Document ID:** MM-FRS-DOMAIN-BASELINE-001\
**Status:** Approved remediation baseline for FRS consistency\
**Purpose:** resolve ownership decisions that block the Domain Model
without defining database tables.

## DBL-001 --- Item identity ownership

The canonical Item identity is **company/tenant-wide**, not
counter-specific and not duplicated per store.

A store may have store-specific operational attributes such as
assortment/availability, stock, reorder settings, selling price
assignments and later local overrides where explicitly supported.

Barcode uniqueness is enforced within the company/tenant catalog scope
unless a future country/device format explicitly introduces a different
namespace.

**Reason:** a stable company-wide product identity prevents duplicate
masters when MiniMart grows from one store to multiple stores.

## DBL-002 --- Supplier identity ownership

Supplier identity is **company/tenant-wide**. Store-specific purchasing
activity, preferred relationship or operational configuration may
reference that supplier without cloning the supplier master.

## DBL-003 --- Customer identity ownership

Customer identity is **company/tenant-wide** (`DEC-CUS-001` baseline). A
customer may have originating/preferred store metadata, but the same
customer identity may be used across stores subject to
permissions/privacy rules.

Automatic duplicate merge remains later scope.

## DBL-004 --- Price ownership

The domain shall support **store-scoped selling-price assignments from
the first model**.

Phase 1 has one operational store, so one active store price is normally
used. The Item remains company-wide; the selling price is not embedded
as an immutable attribute of Item identity.

Later company-default price lists or branch overrides may be added
without changing Item identity.

## DBL-005 --- Inventory and cost ownership

On-hand inventory and moving weighted-average cost are **store-scoped
per Item**. Batch/expiry dimensions may further qualify physical stock
but do not redefine Item identity.

## DBL-006 --- Customer credit ownership

Customer credit account identity is company/tenant-wide, while Phase-1
authorization/exposure is based on the authoritative local-store data
available under the approved offline policy. Multi-branch offline
exposure coordination remains a later decision.

## DBL-007 --- Country context

Each Store has one active country context for ordinary trading. Country
change after go-live is not an ordinary edit; it requires a controlled
migration process.

## DBL-008 --- Country rule version/effective model

Country behavior shall be represented by a version/effective identity
such as a `CountryRuleSetVersion` concept.

A posted document shall preserve: - country code/context; - applicable
rule-set/version identity where relevant; - calculated
tax/rounding/compliance outcomes needed to preserve historical meaning.

A later country-pack update shall not recalculate or reinterpret a
posted document.

This baseline defines the **versioning model**, not current tax rates,
legal thresholds or filing rules.

## Domain-model consequence

The Domain Model may now safely distinguish: - company/tenant-wide
masters: Item, Supplier, Customer; - store-scoped operational facts:
Stock, Cost, Price Assignment, Counter/Shift; - company-wide Customer
Credit with later multi-branch coordination; - immutable posted-document
snapshots; - versioned country behavior.
