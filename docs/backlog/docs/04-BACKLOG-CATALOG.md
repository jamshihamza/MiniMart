# Development Backlog v0.1

## EPIC-00 --- Phase 0 --- Technical Foundation

Repo, CI, Store Node, PostgreSQL, Tauri shell, hardware and sync proof.

-   **MM-001 \[P0\]** ('Initialize MiniMart monorepo and protected
    branch/CI conventions', 'Architecture/repo structure exists and
    formatter/typecheck/test commands run.')
-   **MM-002 \[P0\]** ('Configure shared TypeScript, lint, formatting
    and package boundaries', 'Module-boundary checks can fail CI.')
-   **MM-003 \[P0\]** ('Create Store Node Windows service skeleton',
    'Service starts/stops cleanly and exposes local process health.')
-   **MM-004 \[P0\]** ('Provision local PostgreSQL migration harness',
    'Fresh database can be created and schema migration lifecycle is
    testable.')
-   **MM-005 \[P0\]** ('Create Tauri + React POS desktop shell',
    'Windows desktop app launches and renders frozen POS shell.')
-   **MM-006 \[P0\]** ('Implement POS → Store Node GET /health
    connectivity', 'POS visibly shows Store Node Online from real local
    API.')
-   **MM-007 \[P0\]** ('Implement printer hardware spike through
    Tauri/Rust port', 'Test receipt prints without coupling printer
    driver to business module.')
-   **MM-008 \[P0\]** ('Implement barcode scanner keyboard-wedge spike',
    'Repeated scans are captured without triggering global shortcuts.')
-   **MM-009 \[P0\]** ('Implement non-Latin raster receipt spike',
    'Receipt test proves selected rendering path for required scripts.')
-   **MM-010 \[P0\]** ('Implement minimal real sync proof Store
    Node→Outbox→Cloud→Inbox/Dedup→ACK', 'One safe message round-trips
    with retry/dedupe evidence.')
-   **MM-011 \[P0\]** ('Validate Windows installer/service/PostgreSQL
    upgrade and rollback spike', 'Install, upgrade and rollback
    procedure is documented and repeatable.')
-   **MM-012 \[P0\]** ('Establish test pyramid and CI release gates',
    'Contract, domain, DB, sync and UI smoke gates are represented.')

## EPIC-01 --- Phase 1A --- Platform & Security

Enrollment, authentication, authorization, context, compatibility and
audit foundation.

-   **MM-013 \[P0\]** Implement Sign in --- UI UI-SYS-001; 10 API ops
-   **MM-014 \[P0\]** Implement Unlock with PIN --- UI UI-SYS-002; 7 API
    ops
-   **MM-015 \[P0\]** Implement Home / Role Dashboard --- UI UI-SYS-003;
    8 API ops
-   **MM-016 \[P0\]** Implement Offline & Sync Center --- UI UI-SYS-004;
    8 API ops
-   **MM-017 \[P0\]** Implement Notifications & Tasks --- UI UI-SYS-005;
    6 API ops
-   **MM-018 \[P0\]** Implement Global Search --- UI UI-SYS-006; 6 API
    ops
-   **MM-019 \[P0\]** Implement User Profile & Session --- UI
    UI-SYS-007; 6 API ops
-   **MM-020 \[P0\]** Implement About / Version / Compatibility --- UI
    UI-SYS-008; 6 API ops
-   **MM-037 \[P0\]** Implement Manager Override Dialog --- UI
    UI-POS-017; 6 API ops
-   **MM-085 \[P0\]** Implement Users --- UI UI-IAM-001; 13 API ops
-   **MM-086 \[P0\]** Implement Roles & Permissions --- UI UI-IAM-002; 9
    API ops
-   **MM-087 \[P0\]** Implement Override History --- UI UI-IAM-003; 6
    API ops

## EPIC-02 --- Phase 1B --- Catalog & Pricing

Items, UoM, barcode, category, brand, assortment and price schedules.

-   **MM-039 \[P0\]** Implement Item List --- UI UI-CAT-001; 7 API ops
-   **MM-040 \[P0\]** Implement Item Editor --- UI UI-CAT-002; 6 API ops
-   **MM-041 \[P0\]** Implement Barcode Manager --- UI UI-CAT-003; 9 API
    ops
-   **MM-042 \[P0\]** Implement UoM Manager --- UI UI-CAT-004; 8 API ops
-   **MM-043 \[P0\]** Implement Category Manager --- UI UI-CAT-005; 8
    API ops
-   **MM-044 \[P0\]** Implement Brand Manager --- UI UI-CAT-006; 9 API
    ops
-   **MM-045 \[P0\]** Implement Price Schedule List --- UI UI-PRI-001; 8
    API ops
-   **MM-046 \[P0\]** Implement Price Schedule Editor --- UI UI-PRI-002;
    6 API ops
-   **MM-047 \[P0\]** Implement Price Lookup --- UI UI-PRI-003; 6 API
    ops

## EPIC-03 --- Phase 1C --- Procurement & Inventory

Suppliers, PO, GRN, purchase returns, stock ledger, counts and
availability.

-   **MM-048 \[P0\]** Implement Supplier List --- UI UI-SUP-001; 14 API
    ops
-   **MM-049 \[P0\]** Implement Supplier Editor --- UI UI-SUP-002; 15
    API ops
-   **MM-050 \[P0\]** Implement Purchase Order List --- UI UI-PUR-001; 6
    API ops
-   **MM-051 \[P0\]** Implement Purchase Order Editor --- UI UI-PUR-002;
    6 API ops
-   **MM-052 \[P0\]** Implement Goods Receipt List --- UI UI-PUR-003; 6
    API ops
-   **MM-053 \[P0\]** Implement Goods Receipt Workspace --- UI
    UI-PUR-004; 6 API ops
-   **MM-054 \[P0\]** Implement Purchase Return List --- UI UI-PUR-005;
    6 API ops
-   **MM-055 \[P0\]** Implement Purchase Return Workspace --- UI
    UI-PUR-006; 9 API ops
-   **MM-056 \[P0\]** Implement Inventory Overview --- UI UI-INV-001; 10
    API ops
-   **MM-057 \[P0\]** Implement Item Stock Detail --- UI UI-INV-002; 6
    API ops
-   **MM-058 \[P0\]** Implement Stock Movement Explorer --- UI
    UI-INV-003; 8 API ops
-   **MM-059 \[P0\]** Implement Stock Count List --- UI UI-INV-004; 6
    API ops
-   **MM-060 \[P0\]** Implement Stock Count Workspace --- UI UI-INV-005;
    9 API ops
-   **MM-061 \[P0\]** Implement Reorder / Low Stock --- UI UI-INV-006; 6
    API ops

## EPIC-04 --- Phase 1D --- POS Sales & Payments

Cashier workspace, sale lifecycle, tenders, receipt and recovery.

-   **MM-021 \[P0\]** Implement POS Sale Workspace --- UI UI-POS-001; 13
    API ops
-   **MM-022 \[P0\]** Implement Item Search / Scan Resolution --- UI
    UI-POS-002; 6 API ops
-   **MM-023 \[P0\]** Implement Line Edit Drawer --- UI UI-POS-003; 6
    API ops
-   **MM-024 \[P0\]** Implement Customer Attach / Quick Search --- UI
    UI-POS-004; 6 API ops
-   **MM-025 \[P0\]** Implement Hold / Recall Sale --- UI UI-POS-005; 7
    API ops
-   **MM-026 \[P0\]** Implement Payment Workspace --- UI UI-POS-006; 11
    API ops
-   **MM-027 \[P0\]** Implement Payment Recovery --- UI UI-POS-007; 6
    API ops
-   **MM-028 \[P0\]** Implement Sale Completion / Receipt --- UI
    UI-POS-008; 6 API ops
-   **MM-029 \[P0\]** Implement Sale History --- UI UI-POS-009; 6 API
    ops
-   **MM-030 \[P0\]** Implement Receipt Reprint --- UI UI-POS-010; 2 API
    ops
-   **MM-038 \[P0\]** Implement Printer / Scanner Status --- UI
    UI-POS-018; 2 API ops

## EPIC-05 --- Phase 1E --- Returns, Credit & Cash

Returns/refunds, customer credit, collections, shifts and business day.

-   **MM-031 \[P0\]** Implement Return / Refund Workspace --- UI
    UI-POS-011; 7 API ops
-   **MM-032 \[P0\]** Implement Refund Recovery --- UI UI-POS-012; 15
    API ops
-   **MM-033 \[P0\]** Implement Credit Sale Review --- UI UI-POS-013; 6
    API ops
-   **MM-034 \[P0\]** Implement Cash In / Cash Out --- UI UI-POS-014; 8
    API ops
-   **MM-035 \[P0\]** Implement Open Shift --- UI UI-POS-015; 6 API ops
-   **MM-036 \[P0\]** Implement Shift Summary / Close --- UI UI-POS-016;
    6 API ops
-   **MM-062 \[P0\]** Implement Customer List --- UI UI-CUS-001; 6 API
    ops
-   **MM-063 \[P0\]** Implement Customer Editor --- UI UI-CUS-002; 12
    API ops
-   **MM-064 \[P0\]** Implement Credit Account --- UI UI-CRD-001; 7 API
    ops
-   **MM-065 \[P0\]** Implement Customer Collection --- UI UI-CRD-002; 8
    API ops
-   **MM-066 \[P0\]** Implement Credit Ledger --- UI UI-CRD-003; 6 API
    ops
-   **MM-067 \[P0\]** Implement Business Day --- UI UI-CSH-001; 7 API
    ops
-   **MM-068 \[P0\]** Implement Shift Monitor --- UI UI-CSH-002; 7 API
    ops
-   **MM-069 \[P0\]** Implement Cash Movement Ledger --- UI UI-CSH-003;
    6 API ops

## EPIC-06 --- Phase 2 --- Accounting-Lite

Payables, supplier payments, accounts, transfers, expenses and
reconciliation.

-   **MM-070 \[P1\]** Implement Accounting Dashboard --- UI UI-ACC-001;
    12 API ops
-   **MM-071 \[P1\]** Implement Supplier Payables --- UI UI-ACC-002; 6
    API ops
-   **MM-072 \[P1\]** Implement Supplier Payment --- UI UI-ACC-003; 6
    API ops
-   **MM-073 \[P1\]** Implement Financial Accounts --- UI UI-ACC-004; 9
    API ops
-   **MM-074 \[P1\]** Implement Financial Transactions --- UI
    UI-ACC-005; 7 API ops
-   **MM-075 \[P1\]** Implement Account Transfer --- UI UI-ACC-006; 11
    API ops
-   **MM-076 \[P1\]** Implement Expense Categories --- UI UI-ACC-007; 9
    API ops
-   **MM-077 \[P1\]** Implement Expense Entry --- UI UI-ACC-008; 11 API
    ops
-   **MM-078 \[P1\]** Implement Reconciliation --- UI UI-ACC-009; 10 API
    ops

## EPIC-07 --- Phase 2 --- Reports, Import/Export & Operations

Reports, import/export, backup, diagnostics and audit tooling.

-   **MM-079 \[P1\]** Implement Reports Home --- UI UI-RPT-001; 3 API
    ops
-   **MM-080 \[P1\]** Implement Sales Report --- UI UI-RPT-002; 3 API
    ops
-   **MM-081 \[P1\]** Implement Inventory Report --- UI UI-RPT-003; 3
    API ops
-   **MM-082 \[P1\]** Implement Purchase / Supplier Report --- UI
    UI-RPT-004; 3 API ops
-   **MM-083 \[P1\]** Implement Credit / Collection Report --- UI
    UI-RPT-005; 3 API ops
-   **MM-084 \[P1\]** Implement Audit Explorer --- UI UI-AUD-001; 2 API
    ops
-   **MM-088 \[P1\]** Implement Company Settings --- UI UI-ORG-001; 6
    API ops
-   **MM-089 \[P1\]** Implement Stores --- UI UI-ORG-002; 8 API ops
-   **MM-090 \[P1\]** Implement Counters --- UI UI-ORG-003; 12 API ops
-   **MM-093 \[P1\]** Implement Hardware Setup --- UI UI-HW-001; 2 API
    ops
-   **MM-094 \[P1\]** Implement Backup & Restore Center --- UI
    UI-BAK-001; 3 API ops
-   **MM-095 \[P1\]** Implement Support & Diagnostics --- UI
    UI-SUPT-001; 3 API ops
-   **MM-096 \[P1\]** Implement Import Center --- UI UI-IMP-001; 13 API
    ops
-   **MM-097 \[P1\]** Implement Export Center --- UI UI-EXP-001; 6 API
    ops

## EPIC-08 --- Phase 2 --- Country Pack Foundation

Versioned country capabilities and Malaysia-first verified
configuration.

-   **MM-091 \[P1\]** Implement Country Rule Status --- UI UI-CTRY-001;
    3 API ops
-   **MM-092 \[P1\]** Implement Country Rule Draft / Validation --- UI
    UI-CTRY-002; 3 API ops
-   **MM-111 \[P1\]** Implement versioned CountryRuleSet capability
    client
-   **MM-112 \[P1\]** Verify and configure Malaysia country behavior
    from official sources

## EPIC-09 --- Phase 3 --- Cloud & Full Sync

Cloud management, full sync, multi-branch and recovery hardening.

-   **MM-098 \[P1\]** Implement Cloud Organization Dashboard --- UI
    UI-CLD-001; 6 API ops
-   **MM-099 \[P1\]** Implement Store Sync Health --- UI UI-CLD-002; 6
    API ops
-   **MM-100 \[P1\]** Implement Cloud Configuration Distribution --- UI
    UI-CLD-003; 6 API ops
-   **MM-113 \[P1\]** Implement full outbox/inbox retry, ACK and
    dead-letter operations
-   **MM-114 \[P1\]** Implement cloud management shell without
    checkout/posting coordinators

## EPIC-10 --- Phase 4 --- India Country Pack

India-specific verified country behavior on the same core.

-   **MM-115 \[P2\]** Verify and configure India country behavior from
    official sources

## EPIC-11 --- Quality, UX & Release Engineering

Accessibility, performance, packaging, security, restore drills and
release gates.

-   **MM-101 \[P0\]** Implement shared Money and Quantity exact-decimal
    components
-   **MM-102 \[P0\]** Implement standard screen-state and ProblemCode
    presentation
-   **MM-103 \[P0\]** Implement permission/capability UI guards and
    manager override component
-   **MM-104 \[P0\]** Implement immutable posted-document viewer pattern
-   **MM-105 \[P0\]** Implement command idempotency/lost-response
    recovery client layer
-   **MM-106 \[P0\]** Run 1280×720 and Windows scaling UI acceptance
    suite
-   **MM-107 \[P0\]** Run keyboard-only critical workflow acceptance
    suite
-   **MM-108 \[P1\]** Run accessibility focus/status/error acceptance
    suite
-   **MM-109 \[P0\]** Establish signed installer and update
    compatibility gate
-   **MM-110 \[P0\]** Run backup restore drill and publish recovery
    evidence
