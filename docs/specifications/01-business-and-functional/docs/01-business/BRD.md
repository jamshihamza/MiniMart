# MiniMart Business Requirements Document --- BRD v0.1

**Document ID:** MM-BRD-001\
**Product:** MiniMart\
**Document Type:** Business Requirements Document\
**Version:** 0.1 --- Working Draft\
**Status:** Requirements Baseline\
**Primary Market:** Malaysia\
**Next Market:** India\
**Product Category:** Offline-first Retail POS & Retail Management
Platform

> This BRD deliberately stays at the business-requirement level.
> Database tables, APIs, React/Tauri implementation, detailed
> architecture, and UI component design will be specified in later
> documents.

------------------------------------------------------------------------

## 1. Purpose

MiniMart is intended to provide minimarts, supermarkets, grocery stores,
and similar retailers with a reliable retail operating system covering
point-of-sale, purchasing, inventory, payments, store operations,
reporting, compliance, and selected accounting functions.

The system must support businesses ranging from a **single-counter store
to multi-counter and eventually multi-branch operations**, while
maintaining a common product rather than separate software products for
each store size.

The fundamental business requirement is:

> **A MiniMart store must be able to continue normal retail operations
> even when internet connectivity is unavailable.**

Cloud services enhance MiniMart but must not become a prerequisite for
ordinary store billing.

## 2. Product Vision

MiniMart will provide a retailer with one integrated platform for the
operational lifecycle:

``` text
Product Setup → Supplier → Purchasing → Goods Receiving → Inventory → Pricing
→ Point of Sale → Payment → Receipt → Stock Reduction → Returns / Adjustments
→ Cash & Day Closing → Reporting → Accounting / Compliance → Central Management
```

The long-term product should support:

**POS + Inventory + Purchasing + Supplier Management + Customer
Management + Payments + Cash Management + Reporting + Accounting
Support + Compliance + Multi-Branch Management**

Optional later modules include CRM, loyalty, promotions, HR/payroll,
supplier portals and AI-assisted operations.

## 3. Business Objectives

### BO-001 --- Fast retail checkout

Cashiers must be able to process transactions rapidly with minimal mouse
interaction. Barcode-driven checkout and keyboard shortcuts should
support efficient operation.

### BO-002 --- Operate without internet

A store must continue selling during an internet outage. Loss of
internet connectivity must not prevent normal local billing.

### BO-003 --- Protect transactional integrity

MiniMart must prevent silent loss, duplication or alteration of
financial and inventory transactions. Posted financial documents should
be permanent business records; corrections should use
reversal/correction transactions.

### BO-004 --- Maintain accurate inventory

Purchasing, receiving, sales, returns, wastage, damage, transfers and
stock adjustments must produce a traceable inventory history. The
business must be able to determine both current quantity and why that
quantity exists.

### BO-005 --- Support real retail environments

MiniMart must support large catalogs, multiple barcodes, weighed
products, batches/expiry, rapid product creation, supplier invoices,
returns, negative-stock policies, multiple payment methods, multiple
counters, hardware failures and intermittent connectivity.

### BO-006 --- Support different countries without separate products

MiniMart should have one common retail core. Country-specific
differences should be configurable extensions rather than product forks.
Malaysia is first; India is second.

### BO-007 --- Reduce dependency on separate software

MiniMart should provide enough operational and financial information for
daily management while supporting exports for accountants or external
accounting systems.

### BO-008 --- Be supportable in the field

A non-developer support partner should be capable of diagnosing and
resolving common store problems, escalating software/data/deployment
issues when necessary.

### BO-009 --- Scale without replacing the product

A business beginning with one counter should not need a different
MiniMart product when it grows to multiple counters or branches.

### BO-010 --- Become commercially deployable

MiniMart should eventually support multiple independent customers
through tenant-aware configuration, licensing, updates, country editions
and support tooling.

## 4. Target Businesses

### BR-BIZ-001

MiniMart shall initially target minimarts, supermarkets, grocery stores,
convenience stores, general retail stores and similar barcode-intensive
retailers.

### BR-BIZ-002

The system shall accommodate single-counter stores, multi-counter stores
and multi-branch businesses. Multi-branch functionality may be delivered
later, but the core business model must not prevent expansion.

## 5. Primary Stakeholders

  Stakeholder                  Primary concern
  ---------------------------- ----------------------------------------------
  Business Owner               Sales, profitability, control and visibility
  Store Manager                Daily store operation
  Cashier                      Fast and reliable billing
  Purchasing Staff             Purchasing and supplier transactions
  Inventory Staff              Stock receiving, counting and adjustment
  Accountant/Bookkeeper        Financial and tax information
  Administrator                Configuration, users and permissions
  Support Partner              First-line store support
  MiniMart Technical Support   Software and escalation support
  Customer                     Accurate billing, payment and receipts
  Supplier                     Purchase and settlement relationship
  Regulatory Authorities       Applicable statutory/tax requirements

## 6. Store Operations

**BR-OPS-001:** A store shall continue core business operations during
internet outages.\
**BR-OPS-002:** Multiple counters within a store must participate in the
same store operation.\
**BR-OPS-003:** Transactions must be attributable to company,
branch/store, counter, user and business date/time.\
**BR-OPS-004:** MiniMart should provide recovery procedures for
internet, printer, application, counter, store-server, power and
synchronization failures.\
**BR-OPS-005:** A completed transaction must not disappear because of
application restart or power interruption.

## 7. Product and Item Management

**BR-CAT-001:** MiniMart shall maintain a centralized item/product
master.\
**BR-CAT-002:** A product may have internal item code, manufacturer
barcode, supplier barcode, alternate barcode, PLU and internally
generated barcode.\
**BR-CAT-003:** Multiple barcodes may resolve to the same sellable
item.\
**BR-CAT-004:** Products shall support category, subcategory, brand and
unit-of-measure classification.\
**BR-CAT-005:** MiniMart shall support at least 30,000--50,000+ items,
with room for substantially larger deployments.\
**BR-CAT-006:** Fractional quantities and weighed products shall be
supported where appropriate.\
**BR-CAT-007:** Rapid creation of minimally defined/skeleton items shall
be supported, with later completion.\
**BR-CAT-008:** Bulk product import from Excel/CSV shall be supported.

## 8. Pricing

**BR-PRI-001:** MiniMart shall maintain selling prices.\
**BR-PRI-002:** Pricing must support effective dates and price history.\
**BR-PRI-003:** Support cost price, selling price, recommended/maximum
price where applicable, margin, markup, discount and
tax-inclusive/exclusive pricing.\
**BR-PRI-004:** Price changes must be auditable.\
**BR-PRI-005:** Bulk price changes shall be supported.\
**BR-PRI-006:** Products requiring new price labels after relevant price
changes should be identifiable.

## 9. Supplier Management

**BR-SUP-001:** Maintain supplier records.\
**BR-SUP-002:** Support contact, tax/registration, payment terms, credit
terms and purchasing history.\
**BR-SUP-003:** A product may be purchased from one or more suppliers.\
**BR-SUP-004:** Supplier transaction history should expose historical
purchase prices.\
**BR-SUP-005:** Advanced supplier performance management may be
introduced later without replacing the supplier master.

## 10. Purchasing

Business flow:

``` text
Supplier → Purchase → Goods Receipt → Purchase Invoice → Inventory → Supplier Liability
```

**BR-PUR-001:** Users shall be able to record purchases.\
**BR-PUR-002:** Goods received shall increase inventory appropriately.\
**BR-PUR-003:** Purchase transactions shall support quantity, unit,
cost, discount, applicable tax, batch, expiry and free quantity where
applicable.\
**BR-PUR-004:** Purchase returns shall be supported.\
**BR-PUR-005:** Supplier invoice data should be importable from
Excel/CSV where practical.\
**BR-PUR-006:** Imports must identify invalid or ambiguous data rather
than silently creating incorrect transactions.

## 11. Inventory Management

**BR-INV-001:** Every stock-affecting operation shall be traceable,
including opening stock, goods receipt, sale, sale return, purchase
return, damage, wastage, adjustment, transfer and stock-count
correction.\
**BR-INV-002:** MiniMart shall maintain current available stock.\
**BR-INV-003:** Sufficient history shall exist to explain current
stock.\
**BR-INV-004:** Negative-stock policy shall be configurable: block,
manager-approved soft block, or allow.\
**BR-INV-005:** Batch and expiry information shall be supported where
applicable.\
**BR-INV-006:** Physical stock counting shall be supported.\
**BR-INV-007:** Stock differences shall require a reason and appropriate
authorization.\
**BR-INV-008:** Inter-branch stock transfers shall be supported when
multi-branch functionality is introduced.\
**BR-INV-009:** Current stock, low stock, negative stock, stock
movement, expiring products and stock valuation shall be reportable.

## 12. Point of Sale

**BR-POS-001:** Cashiers shall create sales by scanning barcodes.\
**BR-POS-002:** Products shall also be searchable without barcode
scanning.\
**BR-POS-003:** Cashiers shall modify quantity.\
**BR-POS-004:** Authorized users shall apply discounts according to
permissions.\
**BR-POS-005:** Price overrides shall require appropriate
authorization.\
**BR-POS-006:** Incomplete bills may be held and retrieved.\
**BR-POS-007:** Held transactions must be protected from simultaneous
processing by multiple counters.\
**BR-POS-008:** Cancel/void operations shall be permissioned and
audited.\
**BR-POS-009:** POS shall be optimized for keyboard and barcode-scanner
operation.\
**BR-POS-010:** Checkout shall continue without internet connectivity.\
**BR-POS-011:** External dependency failures shall be clearly shown
without unnecessarily blocking sales.

## 13. Payments

MiniMart shall initially support cash, card terminal, QR/digital
payments and credit sales.

**BR-PAY-001 --- Cash:** Support amount tendered, change, applicable
cash rounding and drawer operation.\
**BR-PAY-002 --- Card:** Support external card-terminal payments; direct
integration may come later.\
**BR-PAY-003 --- QR/Digital:** Support country-appropriate methods such
as DuitNow/e-wallets in Malaysia and UPI in India.\
**BR-PAY-004 --- Credit:** Authorized customers may purchase on account
according to credit policies.\
**BR-PAY-005 --- Split tender:** A transaction may use more than one
payment method.\
**BR-PAY-006:** Payment failures or uncertain states must not silently
create duplicate charges or completed sales.\
**BR-PAY-007:** Payment totals shall support reconciliation.

## 14. Sales Returns and Refunds

**BR-RET-001:** Sales returns shall be supported.\
**BR-RET-002:** Returns should reference the original sale where
possible.\
**BR-RET-003:** Original completed transactions shall not be silently
rewritten.\
**BR-RET-004:** Returns must create the appropriate inventory effect.\
**BR-RET-005:** Refunds should use the relevant payment method where
appropriate.\
**BR-RET-006:** Return reasons shall be recorded.\
**BR-RET-007:** High-risk returns may require manager/supervisor
approval.

## 15. Cashier and Day-End Operations

**BR-CASH-001:** Support cashier/store opening and closing processes.\
**BR-CASH-002:** Track expected and actual counted cash.\
**BR-CASH-003:** Differences must be visible.\
**BR-CASH-004:** Daily totals shall be available by tender type.\
**BR-CASH-005:** Management shall review sales, returns, cash, cards,
QR/digital, credit, expected cash, actual cash and variance.

## 16. Customer Management

**BR-CUS-001:** Customer records shall be supported where identification
is required.\
**BR-CUS-002:** Normal cash sales should not unnecessarily require
customer registration.\
**BR-CUS-003:** Customer identification may be required for credit
sales, requested e-invoices, statements and future loyalty.\
**BR-CUS-004:** Unnecessary personal data collection shall be
minimized.\
**BR-CUS-005:** CRM/loyalty may later extend the customer master without
redesigning sales.

## 17. User Access and Business Control

**BR-SEC-001:** Every user shall operate using an identifiable account
or approved authentication mechanism.\
**BR-SEC-002:** Access shall be role/permission based. Roles may include
Administrator, Store Manager, Supervisor, Cashier, Purchase Staff,
Inventory Staff, Accountant and Support Technician.\
**BR-SEC-003:** Sensitive operations such as price override, discount
override, void, refund, stock adjustment, manual drawer opening and
permission changes require specific permissions.\
**BR-SEC-004:** Manager overrides shall identify the approving manager.\
**BR-SEC-005:** MiniMart shall not rely on an undocumented/hardcoded
universal master-admin credential.\
**BR-SEC-006:** Privileged actions must be auditable.

## 18. Auditability

**BR-AUD-001:** Maintain an audit trail for important business actions.\
**BR-AUD-002:** Audit records shall identify who, what, when,
device/location, affected record and relevant before/after information
where applicable.\
**BR-AUD-003:** Audit records must not be casually editable by ordinary
users.\
**BR-AUD-004:** Auditable operations include price changes, discounts,
overrides, voids, returns, stock adjustments, permission changes, manual
drawer openings and sensitive support actions.

## 19. Hardware Requirements

MiniMart shall support:

-   **BR-HW-001:** Barcode scanner.
-   **BR-HW-002:** Thermal receipt printer.
-   **BR-HW-003:** Cash drawer.
-   **BR-HW-004:** Customer display.
-   **BR-HW-005:** Label printer.
-   **BR-HW-006:** Weighing scale where required.
-   **BR-HW-007:** Payment terminal where applicable.
-   **BR-HW-008:** Failure of non-critical hardware should not
    unnecessarily invalidate a completed transaction; receipt reprinting
    should be possible after printer recovery.

## 20. Reporting Requirements

### Sales

Daily sales; sales by item, category, cashier and payment method; sales
returns; discounts; voids.

### Inventory

Current stock; stock movement; low stock; negative stock; stock
valuation; batch/expiry information.

### Purchasing

Purchases; goods receipts; purchases by supplier/item; purchase returns.

### Cash/Payments

Cashier closing; payment summary; cash variance; card/QR reconciliation
information.

### Management

Gross profit information; expenses; supplier balances; customer
receivables; operational KPIs.

## 21. Accounting Requirements

**BR-ACC-001:** Provide sufficient operational financial records for
daily retail management.\
**BR-ACC-002:** Supplier liabilities shall be trackable.\
**BR-ACC-003:** Customer credit balances shall be trackable.\
**BR-ACC-004:** Relevant cash and bank movements shall be recordable.\
**BR-ACC-005:** Business expenses shall be recordable.\
**BR-ACC-006:** Provide accountant/bookkeeper data exports.\
**BR-ACC-007:** Full double-entry accounting may be introduced later
after professional validation.

## 22. Country Editions

MiniMart shall use a common business core with country-specific
behavior.

### Malaysia Edition

Expected concerns include Malaysian currency/formatting, applicable tax
treatment, MyInvois/e-invoicing, cash rounding, DuitNow/QR/e-wallet
payments, local receipt requirements and relevant languages.

### India Edition

Expected concerns include GST, HSN, MRP, UPI, Indian currency/number
formatting, GST reporting/export and optional accounting-system exports.

> **Important:** These are product requirements, not final legal
> specifications. Regulatory rules must be independently verified before
> implementation.

## 23. Localization

**BR-LOC-001:** Support multiple UI languages.\
**BR-LOC-002:** Malaysia should initially support English and Bahasa
Malaysia, with Chinese/Tamil as required.\
**BR-LOC-003:** India should support English and appropriate regional
languages; Malayalam is anticipated.\
**BR-LOC-004:** Currency, number and date formats shall follow
country/store configuration.\
**BR-LOC-005:** Receipts must support required customer-facing scripts
where hardware permits.

## 24. Reliability and Business Continuity

**BR-REL-001:** A committed sale shall not be silently lost.\
**BR-REL-002:** MiniMart shall maintain backups.\
**BR-REL-003:** Backups must be restorable.\
**BR-REL-004:** Backup/restore procedures shall be tested.\
**BR-REL-005:** A recovery procedure shall exist for store-system
failure.\
**BR-REL-006:** Updates should minimize trading interruption.\
**BR-REL-007:** Updates must not put historical transactions at
unreasonable risk.

## 25. Support Requirements

Support model:

``` text
Store Staff → L1 Support Partner → L2 MiniMart Technical Support → External Vendor
```

**BR-SUPT-001:** Store staff should resolve simple operational
problems.\
**BR-SUPT-002:** Support partners should have diagnostic capabilities
without unnecessary business privileges.\
**BR-SUPT-003:** MiniMart should provide store/system health
information.\
**BR-SUPT-004:** Diagnostic data should avoid unnecessary
personal/customer information.\
**BR-SUPT-005:** Support actions shall be audited where appropriate.\
**BR-SUPT-006:** Remote support access shall be controlled.

## 26. Performance Business Expectations

Current engineering targets:

-   scan-to-line under 100 ms;
-   product search under 50 ms at 50,000 items;
-   payment-to-receipt under 1.5 seconds.

These are **performance targets requiring measurement**, not guaranteed
production performance.

Business requirement:

> Routine POS actions must not create noticeable delays that materially
> slow customer checkout.

## 27. Data Integrity Principles

**BR-DATA-001:** Completed financial documents must remain historically
traceable.\
**BR-DATA-002:** Corrections to posted financial transactions shall use
documented correction/reversal mechanisms.\
**BR-DATA-003:** Inventory changes must have identifiable business
causes.\
**BR-DATA-004:** Duplicate processing must not create duplicate
financial transactions.\
**BR-DATA-005:** Business-critical operations must not silently fail.\
**BR-DATA-006:** Synchronization failures must be visible and
recoverable.\
**BR-DATA-007:** Historical transactions must remain understandable
after master-data changes.

## 28. Privacy and Security Business Requirements

MiniMart shall collect only required information, protect
business/customer information, restrict sensitive operations, protect
credentials, avoid storing unnecessary payment-card data, provide
auditability and support applicable privacy obligations.

## 29. Scope by Business Phase

### Phase 0 --- Product Foundation

Prove that MiniMart can be reliably installed, operated and supported on
actual store hardware.

### Phase 1 --- Retail Core

**Product → Supplier → Purchase → Goods Receipt → Inventory → POS →
Payment → Receipt → Return**

Plus users/roles, audit, hardware, import, backup, single/multi-counter
support, basic credit sales and health/diagnostics.

### Phase 2 --- Store Operations & Compliance

Cashier shift, day closing, operational reports, accounting-lite,
accountant exports, Malaysia compliance/e-invoicing and initial cloud
services.

### Phase 2B --- Optional Accounting Ledger

Automatic double-entry, trial balance, profit and loss and balance
sheet, subject to accounting validation.

### Phase 3 --- Centralization & Scale

Multi-branch, central management, robust store/cloud synchronization,
advanced resilience and integrated payments where appropriate.

### Phase 4 --- India Edition

India country pack, GST, HSN, MRP, UPI, India-specific
reporting/localization.

### Phase 5 --- Optional Expansion

CRM, loyalty, promotions, HR/payroll, supplier/vendor portal, advanced
analytics and AI.

## 30. Explicitly Out of Initial Scope

The following should not block the first working MiniMart release:

-   HR/payroll;
-   advanced CRM;
-   advanced loyalty;
-   sophisticated promotion engine;
-   supplier portal;
-   autonomous AI purchasing;
-   demand forecasting;
-   full enterprise accounting;
-   advanced BI/data warehouse;
-   e-commerce;
-   unnecessary microservices.

## 31. Key Business Success Scenario

> A retailer can create a product, purchase and receive stock, verify
> the stock, scan and sell the product at a counter, accept payment,
> issue a receipt, reduce inventory correctly, process an appropriate
> return if required, close operations correctly, and retain a complete
> auditable record---even if internet connectivity is temporarily
> unavailable.

For a multi-counter store:

> Multiple counters can operate against the same store business state
> without silently corrupting sales, payments or inventory.

## 32. Business Success Criteria

**SC-001** --- A real store can complete a full trading day using
MiniMart.\
**SC-002** --- Internet failure does not stop ordinary checkout.\
**SC-003** --- Completed sales are not lost.\
**SC-004** --- Repeated/retried processing does not silently duplicate
transactions.\
**SC-005** --- Inventory movements can be traced to their causes.\
**SC-006** --- Cash/payment totals can be reconciled.\
**SC-007** --- Managers can identify unusual voids, returns, discounts
and stock adjustments.\
**SC-008** --- A non-developer support partner can diagnose common
operational failures.\
**SC-009** --- A second counter can be introduced without replacing the
product.\
**SC-010** --- A second branch can eventually be introduced without
redesigning the retail core.\
**SC-011** --- A country edition can change compliance/tax behavior
without forking the entire application.

## 33. Open Business Decisions

Before this BRD reaches **v1.0 Approved**, resolve or formally defer:

1.  First Malaysian customer's exact store/counter/branch profile.
2.  Customer's applicable tax/e-invoicing status.
3.  Required Malaysia UI and receipt languages.
4.  Actual receipt printer/scanner/scale models.
5.  Payment providers/acquirers.
6.  Exact credit-sales policy.
7.  Required inventory costing policy.
8.  Negative-stock policy.
9.  Whether purchase orders are mandatory or direct GRN/purchase
    receiving is sufficient.
10. Accountant/bookkeeper workflow and required exports.
11. Exact Phase-1 reporting requirements.
12. Multi-counter recovery expectations.
13. Initial cloud deployment expectations.
14. Commercial licensing model.
15. Data-retention requirements.
16. India-edition timing and first-customer profile.

## 34. Requirements Traceability Standard

Requirements should not live only in conversations.

MiniMart will use identifiers such as:

``` text
BR-POS-001
BR-INV-004
BR-PAY-005
BR-SEC-003
```

The Functional Requirements Specification will translate them into
functional requirements:

``` text
BR-POS-001
    ↓
FR-POS-001
FR-POS-002
FR-POS-003
```

Full traceability chain:

``` text
Business Requirement
        ↓
Functional Requirement
        ↓
Domain Rule
        ↓
Database Requirement
        ↓
API Contract
        ↓
UI Requirement
        ↓
GitHub Issue
        ↓
Implementation
        ↓
Automated Test
```

## 35. Documentation Pipeline Status

  Stage                                            Status
  ------------------------------------------------ --------------
  01 --- Business Requirements Document            v0.1 drafted
  02 --- Functional Requirements                   Not started
  03 --- Domain Model                              Not started
  04 --- Database Model + ERD                      Not started
  05 --- Technical Architecture                    Not started
  06 --- API Contracts                             Not started
  07 --- UI/UX Specification                       Not started
  08 --- Development Backlog                       Not started
  09 --- Codex/Claude/Antigravity Implementation   Not started

## Source Basis

This working BRD was derived from the MiniMart requirements discussed in
the project conversations and the uploaded **Reference Architecture
v2**. Regulatory requirements for Malaysia and India remain subject to
independent verification before implementation.

------------------------------------------------------------------------

**Next planned document:** MiniMart Functional Requirements
Specification (FRS).
