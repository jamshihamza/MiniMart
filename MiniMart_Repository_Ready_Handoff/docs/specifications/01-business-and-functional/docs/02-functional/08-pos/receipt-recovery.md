# MiniMart POS Receipt, Hardware and Recovery Functional Specification --- v0.4

**Document ID:** MM-FRS-POS-REC-001\
**Requirement namespace:** `FR-POS-066`--`FR-POS-090`\
**Status:** Detailed Working Draft --- Batch 3

## Requirements

### FR-POS-066 --- Receipt generation

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

After successful sale completion, MiniMart shall generate a receipt
representation from posted sale data.

**Acceptance:** Receipt totals match posted sale.

### FR-POS-067 --- Receipt numbering/reference

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

Receipt shall display approved sale/document reference information.

**Acceptance:** Reference identifies the posted transaction.

### FR-POS-068 --- Receipt item detail

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

Receipt shall show required sold item/quantity/price/discount/tax
information according to configured country/store format.

**Acceptance:** Printed representation reconciles to sale.

### FR-POS-069 --- Receipt tender detail

**Source:** BR-PAY-007\
**Priority:** MUST\
**Phase:** 1

Receipt shall show permitted tender summary, tendered amount/change
where applicable, without exposing prohibited sensitive payment data.

**Acceptance:** Receipt reconciles to tender records.

### FR-POS-070 --- Receipt localization

**Source:** BR-LOC-005\
**Priority:** MUST\
**Phase:** 1

Receipt shall support configured language/script/currency/date
formatting required by active store/country pack.

**Acceptance:** Configured non-Latin content renders correctly when
supported.

### FR-POS-071 --- Receipt print

**Source:** BR-HW-002\
**Priority:** MUST\
**Phase:** 1

POS shall be able to send a completed sale receipt to configured receipt
printer.

**Acceptance:** Successful print does not alter posted sale.

### FR-POS-072 --- Printer unavailable after sale

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Printer failure after a sale is posted shall not reverse or duplicate
the sale.

**Acceptance:** POS clearly offers recovery/reprint path.

### FR-POS-073 --- Reprint receipt

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

Authorized user shall be able to reprint a receipt for a posted sale.

**Acceptance:** Reprint is visibly/operationally distinguishable where
required and creates no new sale.

### FR-POS-074 --- Reprint permission/audit

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Receipt reprint shall follow configured permission/audit policy.

**Acceptance:** Actor and sale reference are traceable.

### FR-POS-075 --- Cash drawer trigger

**Source:** BR-HW-003, BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

POS shall trigger configured cash drawer event for applicable cash
transactions without making drawer success a condition for
already-posted sale validity.

**Acceptance:** Drawer failure does not duplicate sale.

### FR-POS-076 --- Customer display

**Source:** BR-HW-004\
**Priority:** SHOULD\
**Phase:** 1

When configured, POS should present approved current sale/total
information to customer display.

**Acceptance:** Display failure does not corrupt active sale.

### FR-POS-077 --- Scanner failure

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

Scanner failure shall not destroy the sale; cashier may use permitted
manual search/entry alternatives.

**Acceptance:** Existing sale remains intact.

### FR-POS-078 --- Payment device failure feedback

**Source:** BR-POS-011\
**Priority:** MUST\
**Phase:** 1

POS shall show actionable payment-device state and shall not mark sale
paid merely because a device call failed.

**Acceptance:** Payment state remains explicit.

### FR-POS-079 --- External dependency timeout

**Source:** BR-POS-011\
**Priority:** MUST\
**Phase:** 1

Timeouts at external boundaries shall produce an explicit
recoverable/uncertain state rather than an assumed success.

**Acceptance:** Cashier is guided to safe next action.

### FR-POS-080 --- Keyboard-first checkout

**Source:** BR-POS-009\
**Priority:** MUST\
**Phase:** 1

Core checkout actions shall support efficient keyboard/scanner operation
appropriate for retail counters.

**Acceptance:** Routine sale can be completed without mandatory mouse
use.

### FR-POS-081 --- Focus preservation

**Source:** BR-POS-009\
**Priority:** SHOULD\
**Phase:** 1

After common POS actions/errors, input focus should return to the
appropriate scan/search control where safe.

**Acceptance:** Cashier can continue scanning efficiently.

### FR-POS-082 --- Clear error messages

**Source:** BR-POS-011\
**Priority:** MUST\
**Phase:** 1

POS errors shall state what failed and whether sale/payment is safe to
retry, pending, or blocked.

**Acceptance:** Cashier is not asked to guess transaction state.

### FR-POS-083 --- No sensitive technical detail to cashier

**Source:** BR-SEC-006\
**Priority:** MUST\
**Phase:** 1

Routine POS error messages shall avoid exposing secrets or unnecessary
internal technical data.

**Acceptance:** Diagnostics remain available to authorized support
separately.

### FR-POS-084 --- Sale lookup

**Source:** BR-POS-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall be able to find posted sales by
receipt/reference, date and permitted contextual identifiers.

**Acceptance:** Transaction can be located for reprint/return.

### FR-POS-085 --- Sale lookup by barcode/item

**Source:** BR-POS-002\
**Priority:** SHOULD\
**Phase:** 2

Authorized back-office users should be able to locate sales containing
an item/barcode for investigation.

**Acceptance:** Search does not alter sale.

### FR-POS-086 --- Sale history values preserved

**Source:** BR-DATA-007\
**Priority:** MUST\
**Phase:** 1

Later product/price/customer master changes shall not rewrite historical
sale meaning.

**Acceptance:** Posted sale remains understandable.

### FR-POS-087 --- POS close/logout protection

**Source:** BR-SEC-001\
**Priority:** MUST\
**Phase:** 1

Logout/terminal close shall not silently discard a sale in a state
requiring recovery or payment resolution.

**Acceptance:** User receives safe resolution path.

### FR-POS-088 --- Business-date awareness

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

POS shall associate sale with applicable business date as well as actual
timestamps according to approved rollover rules.

**Acceptance:** Day-close reporting can use defined business date.

### FR-POS-089 --- Counter attribution

**Source:** BR-OPS-003\
**Priority:** MUST\
**Phase:** 1

Every completed sale shall identify the counter/device context that
posted it.

**Acceptance:** Multi-counter reports/audit can distinguish origin.

### FR-POS-090 --- POS acceptance suite

**Source:** BR-POS-010, BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Automated/integration acceptance tests shall cover normal sale, offline
sale, restart/retry, concurrent counters, unknown barcode, insufficient
stock, discount/override and printer failure.

**Acceptance:** Critical checkout invariants are regression-tested.

## Recovery classification

-   Internet/cloud unavailable: **WORKS NORMALLY locally**, sync later.
-   Printer unavailable: **WORKS WITH LIMITATION**, sale remains valid,
    reprint later.
-   Scanner unavailable: **WORKS WITH LIMITATION**, use permitted
    search/manual entry.
-   Store Node unavailable: phase-specific survival decision applies.
-   Authoritative store database unavailable: **BLOCK POSTING SAFELY**.
-   Payment result uncertain: do not guess; follow Payment
    uncertain-state rules.
