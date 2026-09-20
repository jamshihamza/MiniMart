# MiniMart Hardware Functional Specification --- v0.6

**Document ID:** MM-FRS-HW-001\
**Requirement namespace:** `FR-HW-001`--`FR-HW-050`\
**Status:** Detailed Working Draft --- Batch 5

## Requirements

### FR-HW-001 --- Hardware abstraction

**Source:** BR-HW-001, BR-HW-008\
**Priority:** MUST\
**Phase:** 1

MiniMart shall isolate device-specific behavior behind approved hardware
capabilities so business modules are not hard-coded to one model/vendor.

**Acceptance:** Changing supported device does not rewrite sale rules.

### FR-HW-002 --- Device configuration

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

Authorized users shall configure supported device connection/settings
per counter/store.

**Acceptance:** Configuration is testable before live use.

### FR-HW-003 --- Device status

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall expose operational status for configured critical
peripherals where detectable.

**Acceptance:** User/support can distinguish unavailable/misconfigured.

### FR-HW-004 --- Hardware test action

**Source:** BR-SUPT-001\
**Priority:** MUST\
**Phase:** 1

Authorized user shall run safe device test such as test print/display
without creating a business transaction.

**Acceptance:** Test has no sale/stock/payment effect.

### FR-HW-005 --- Device failure isolation

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Non-critical peripheral failure shall not corrupt or duplicate completed
business transactions.

**Acceptance:** Failure is shown separately from transaction state.

### FR-HW-006 --- Hardware event logging

**Source:** BR-SUPT-003\
**Priority:** SHOULD\
**Phase:** 1

Material hardware errors should be logged with non-sensitive
diagnostics.

**Acceptance:** Support can investigate device failures.

### FR-HW-007 --- Barcode scanner support

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

POS shall support approved barcode scanners, including common
keyboard/HID-style input where applicable.

**Acceptance:** Valid scan reaches POS barcode workflow.

### FR-HW-008 --- Scanner terminator handling

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

Scanner input shall handle configured terminator/prefix/suffix safely
without treating arbitrary keyboard text as trusted product identity.

**Acceptance:** Scan parsing is deterministic.

### FR-HW-009 --- Rapid repeated scans

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

Scanner handling shall support retail scan cadence without dropping
valid scans under target conditions.

**Acceptance:** Test burst produces correct quantities.

### FR-HW-010 --- Unknown scan behavior

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

Unknown barcode shall follow POS unknown-barcode rule without
destabilizing scanner input.

**Acceptance:** Next valid scan still works.

### FR-HW-011 --- Manual fallback

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

Scanner failure shall allow permitted keyboard/product-search fallback.

**Acceptance:** Sale remains usable.

### FR-HW-012 --- Thermal receipt printer

**Source:** BR-HW-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support approved thermal receipt printing for posted
sales/returns/collections.

**Acceptance:** Printed totals match source document.

### FR-HW-013 --- Printer connection test

**Source:** BR-HW-002\
**Priority:** MUST\
**Phase:** 1

Configuration shall provide test print/status where supported.

**Acceptance:** Operator can verify before trading.

### FR-HW-014 --- Receipt width/profile

**Source:** BR-HW-002\
**Priority:** MUST\
**Phase:** 1

Receipt rendering shall use configured printer/paper profile.

**Acceptance:** Content is not clipped under supported profile.

### FR-HW-015 --- Unicode/script capability

**Source:** BR-LOC-005\
**Priority:** MUST\
**Phase:** 1

Receipt printing shall respect printer/font capability for required
scripts and expose unsupported capability during setup/testing.

**Acceptance:** Unsupported script is not discovered only after live
sale.

### FR-HW-016 --- Printer failure after posting

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Printer failure after posting shall preserve transaction and offer
reprint/recovery.

**Acceptance:** No duplicate sale is created.

### FR-HW-017 --- Printer offline before posting

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Printer unavailability shall be shown before/at checkout where
detectable but shall follow store policy on whether sale may proceed.

**Acceptance:** Policy is explicit.

### FR-HW-018 --- Reprint

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Authorized user shall reprint from posted document data after printer
recovery.

**Acceptance:** Reprint creates no new financial effect.

### FR-HW-019 --- Cash drawer support

**Source:** BR-HW-003\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support approved cash drawer triggering, commonly through
configured printer/interface.

**Acceptance:** Applicable cash workflow can request drawer open.

### FR-HW-020 --- Drawer trigger timing

**Source:** BR-HW-003\
**Priority:** MUST\
**Phase:** 1

Drawer trigger shall occur only at approved cash/refund/authorized
manual-open points.

**Acceptance:** Scanning/editing sale does not open drawer.

### FR-HW-021 --- Drawer failure

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Drawer-open failure shall not cause transaction reposting.

**Acceptance:** Cashier receives operational recovery guidance.

### FR-HW-022 --- Manual drawer open

**Source:** BR-HW-003\
**Priority:** MUST\
**Phase:** 1

Manual/no-sale drawer open shall require permission and audit/reason
according to policy.

**Acceptance:** Sensitive cash access is traceable.

### FR-HW-023 --- Customer display support

**Source:** BR-HW-004\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should support approved customer-facing display for sale
line/total/status information.

**Acceptance:** Display is optional to transaction validity.

### FR-HW-024 --- Customer display privacy

**Source:** BR-CUS-004\
**Priority:** MUST\
**Phase:** 1

Customer display shall not expose unnecessary customer/credit/internal
information.

**Acceptance:** Only approved customer-facing content appears.

### FR-HW-025 --- Display failure

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Customer-display failure shall not corrupt sale.

**Acceptance:** POS continues with visible operator warning as
appropriate.

### FR-HW-026 --- Label printer support

**Source:** BR-HW-005\
**Priority:** SHOULD\
**Phase:** 2

MiniMart should support approved label printers for product/price
labels.

**Acceptance:** Label printing does not change product price by itself.

### FR-HW-027 --- Label queue

**Source:** BR-PRI-006\
**Priority:** SHOULD\
**Phase:** 2

Price/product changes requiring labels should be printable through a
controlled queue.

**Acceptance:** Printed status is operationally visible.

### FR-HW-028 --- Label printer failure

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 2

Label-printer failure shall preserve pending label work.

**Acceptance:** User can retry without duplicating business changes.

### FR-HW-029 --- Scale support

**Source:** BR-HW-006\
**Priority:** SHOULD\
**Phase:** 2/3

MiniMart shall allow approved scale integration for weighted products
when enabled.

**Acceptance:** Captured weight respects item quantity precision.

### FR-HW-030 --- Scale zero/stable state

**Source:** BR-HW-006\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 2/3

Integrated scale workflow shall distinguish invalid/unstable readings
according to device capability.

**Acceptance:** Unstable weight is not silently accepted.

### FR-HW-031 --- Scale manual fallback

**Source:** BR-HW-006\
**Priority:** MUST

**Applicability:** Controlled workflow only

**Decision Status:** OPEN\
**Phase:** 2

Manual weight entry policy shall be explicit and permissioned where
scale is expected.

**Acceptance:** Agent does not assume fallback is allowed.

### FR-HW-032 --- Payment terminal boundary

**Source:** BR-HW-007\
**Priority:** MUST\
**Phase:** 1/3

Phase-1 external payment terminal and later integrated terminal shall
remain distinct operating modes.

**Acceptance:** Manual confirmation is not misrepresented as direct
integration.

### FR-HW-033 --- Integrated terminal identity

**Source:** BR-HW-007\
**Priority:** MUST

**Applicability:** When integrated\
**Phase:** 3

Configured payment terminal shall have stable device/provider identity
for status/reconciliation.

**Acceptance:** Payment attempt can be tied to terminal.

### FR-HW-034 --- Terminal timeout

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1/3

Terminal timeout shall follow payment uncertain/failure rules rather
than guessing success.

**Acceptance:** Duplicate charge is avoided.

### FR-HW-035 --- Terminal replacement

**Source:** BR-HW-007\
**Priority:** SHOULD\
**Phase:** 3

Replacing a terminal shall preserve historical payment references and
require controlled configuration.

**Acceptance:** Old transactions remain interpretable.

### FR-HW-036 --- Device driver/service restart

**Source:** BR-REL-005\
**Priority:** MUST\
**Phase:** 1

Recoverable hardware service/adapter restart shall not require reposting
completed transaction.

**Acceptance:** Device can recover independently.

### FR-HW-037 --- Device configuration audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Material peripheral configuration changes shall be audited.

**Acceptance:** Who changed active printer/terminal etc. is traceable.

### FR-HW-038 --- Per-counter hardware

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 1

Hardware configuration shall support different peripherals per counter
in a multi-counter store.

**Acceptance:** Counter A device does not accidentally serve Counter B
unless configured.

### FR-HW-039 --- Shared device boundary

**Source:** BR-OPS-002\
**Priority:** SHOULD\
**Phase:** 2

Shared devices such as back-office label printer shall be explicitly
configured and concurrency-safe.

**Acceptance:** Jobs are attributable and not interleaved incorrectly.

### FR-HW-040 --- Offline hardware operation

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Local peripherals required for local trading shall not depend on cloud
availability.

**Acceptance:** Internet loss does not disable scanner/printer/drawer.

### FR-HW-041 --- Hardware health summary

**Source:** BR-SUPT-003\
**Priority:** MUST\
**Phase:** 1/2

Diagnostics shall summarize configured devices and detectable status
without exposing secrets.

**Acceptance:** Support can see peripheral health.

### FR-HW-042 --- Hardware diagnostics export

**Source:** BR-SUPT-004\
**Priority:** SHOULD\
**Phase:** 2

Support bundle may include model/config/error metadata while minimizing
business/PII data.

**Acceptance:** Device issue can be investigated safely.

### FR-HW-043 --- Unsupported hardware

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

MiniMart shall clearly identify unsupported/unverified device
configuration rather than promising compatibility.

**Acceptance:** Setup communicates limitation.

### FR-HW-044 --- Hardware compatibility matrix

**Source:** BR-HW-001\
**Priority:** SHOULD\
**Phase:** 1

Release/support documentation should maintain tested device/interface
combinations.

**Acceptance:** Deployment can choose validated hardware.

### FR-HW-045 --- Windows device behavior

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 1

Supported hardware behavior shall be validated on the supported Windows
deployment baseline.

**Acceptance:** Release test covers target OS.

### FR-HW-046 --- Power reconnect

**Source:** BR-REL-005\
**Priority:** SHOULD\
**Phase:** 1

Peripheral disconnect/reconnect should recover without restarting entire
POS where feasible.

**Acceptance:** Device returns to usable state safely.

### FR-HW-047 --- Receipt test fixture

**Source:** BR-HW-002\
**Priority:** MUST\
**Phase:** 0/1

Engineering acceptance shall include representative receipt samples
including long names, discounts, totals and required scripts.

**Acceptance:** Layout regression is detectable.

### FR-HW-048 --- Scanner test fixture

**Source:** BR-HW-001\
**Priority:** MUST\
**Phase:** 0/1

Engineering acceptance shall include representative barcode
types/cadence.

**Acceptance:** Scanner regressions are detectable.

### FR-HW-049 --- Hardware failure acceptance

**Source:** BR-HW-008\
**Priority:** MUST\
**Phase:** 1

Tests shall simulate printer/scanner/drawer/display failures around
transaction boundaries.

**Acceptance:** No failure duplicates/corrupts transaction.

### FR-HW-050 --- Hardware acceptance suite

**Source:** BR-HW-001, BR-HW-008\
**Priority:** MUST\
**Phase:** 0/1

Release acceptance shall cover configured device tests, fallback,
offline operation, reconnect and multi-counter separation.

**Acceptance:** Hardware layer is regression-tested.

## Principle

Peripheral failure and business-transaction state are separate concerns.
A printer/drawer/display failure must never turn an already committed
sale into an ambiguous or duplicate sale.
