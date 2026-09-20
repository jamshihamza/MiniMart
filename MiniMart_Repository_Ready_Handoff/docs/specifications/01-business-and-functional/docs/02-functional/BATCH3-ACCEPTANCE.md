# MiniMart FRS Batch 3 --- Cross-Module Acceptance Scenarios v0.4

**Document ID:** MM-FRS-B3-ACCEPT-001\
**Status:** Working Draft

These scenarios test POS, Payments, Inventory and Returns together. They
are requirements-level acceptance scenarios, not implementation tests
yet.

## AC-B3-001 --- Normal cash sale

**Given** a configured store/counter, authenticated cashier, active
item, valid price and sufficient stock\
**When** cashier scans item, enters cash tender and completes sale\
**Then** exactly one sale is posted, cash tender is recorded, stock is
reduced, receipt data is available and audit identifies cashier/counter.

## AC-B3-002 --- Offline cash sale

**Given** internet/cloud is disconnected but Store Node and store
PostgreSQL are healthy\
**When** cashier completes a valid cash sale\
**Then** sale completes locally, stock reduces, receipt can be produced,
offline state is visible and later synchronization must not duplicate
the sale.

## AC-B3-003 --- Unknown barcode

**Given** an active sale with existing lines\
**When** cashier scans an unknown barcode\
**Then** POS reports unknown barcode and preserves every existing
line/total.

## AC-B3-004 --- Negative-stock block

**Given** store policy is BLOCK and available stock is insufficient\
**When** cashier attempts completion\
**Then** sale is not posted and no tender/stock effect is committed.

## AC-B3-005 --- Negative-stock manager approval

**Given** policy requires approval\
**When** sale would create negative stock and authorized manager
approves\
**Then** sale may continue, approval identity/reason is audited and
negative stock is visible/reportable.

## AC-B3-006 --- Held sale concurrency

**Given** one held sale is visible to two authorized counters\
**When** both retrieve and attempt completion\
**Then** at most one completion succeeds and the other receives a clear
stale/already-completed result.

## AC-B3-007 --- Printer failure after posting

**Given** a valid sale and printer becomes unavailable at receipt time\
**When** sale posting succeeds but printing fails\
**Then** sale remains completed exactly once and authorized reprint is
available later.

## AC-B3-008 --- Restart during posting

**Given** cashier initiates completion\
**When** POS/Store Node restarts at an ambiguous point\
**Then** recovery determines committed/not-committed state and does not
create a duplicate sale, stock movement or tender.

## AC-B3-009 --- External card failure

**Given** Phase-1 external card terminal workflow\
**When** terminal reports failure\
**Then** MiniMart does not record successful card tender and sale
remains unpaid for that amount.

## AC-B3-010 --- Payment uncertain

**Given** a future integrated electronic payment\
**When** provider response is lost after request\
**Then** payment enters uncertain/pending resolution and MiniMart does
not blindly retry or mark sale paid.

## AC-B3-011 --- Split tender partial success

**Given** a sale uses two tenders\
**When** first tender succeeds and second fails\
**Then** successful tender remains recorded, remaining due is exact and
sale cannot be casually abandoned.

## AC-B3-012 --- Partial return

**Given** a posted sale of quantity 5 with no prior returns\
**When** authorized user returns quantity 2\
**Then** remaining eligible return quantity becomes 3, approved stock
disposition occurs and refund follows approved method.

## AC-B3-013 --- Repeat over-return attempt

**Given** original quantity 5 and effective prior return quantity 3\
**When** two counters concurrently attempt to return 3 each\
**Then** MiniMart prevents total effective returned quantity from
exceeding remaining eligible quantity 2.

## AC-B3-014 --- Damaged return

**Given** customer returns an item classified damaged\
**When** return posts\
**Then** item is not silently added to ordinary sellable stock; approved
damaged/quarantine disposition is recorded.

## AC-B3-015 --- Refund uncertainty

**Given** a future integrated electronic refund\
**When** provider result is ambiguous\
**Then** refund remains unresolved/pending, no duplicate refund is
issued and outstanding obligation is visible.

## AC-B3-016 --- Historical price change

**Given** a posted sale and later product price changes\
**When** the old sale is viewed or returned\
**Then** historical sale/refund basis remains based on posted historical
values rather than current price.

## AC-B3-017 --- Database unavailable

**Given** authoritative store database is unavailable\
**When** cashier attempts sale posting\
**Then** POS blocks completion safely and never displays a false
success.

## AC-B3-018 --- Cash drawer failure

**Given** a cash sale posts successfully\
**When** drawer hardware fails to open\
**Then** sale remains valid and no duplicate tender/sale is created;
cashier receives operational recovery guidance.
