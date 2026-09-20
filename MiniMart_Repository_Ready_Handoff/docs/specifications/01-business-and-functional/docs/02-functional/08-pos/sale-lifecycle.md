# MiniMart POS Sale Lifecycle Functional Specification --- v0.4

**Document ID:** MM-FRS-POS-LIFE-001\
**Requirement namespace:** `FR-POS-036`--`FR-POS-065`\
**Status:** Detailed Working Draft --- Batch 3

## Requirements

### FR-POS-036 --- Stock availability check

**Source:** BR-INV-002, BR-INV-004\
**Priority:** MUST\
**Phase:** 1

POS shall evaluate applicable stock availability and negative-stock
policy before completion.

**Acceptance:** Configured allow/warn/approval/block behavior is
enforced.

### FR-POS-037 --- Batch/expiry sale policy gate

**Source:** BR-INV-005\
**Priority:** MUST

**Applicability:** Where tracking is enabled/applicable\
**Phase:** 1

For batch/expiry-managed goods, POS shall use the approved physical
depletion/selection policy once defined.

**Acceptance:** Implementation does not invent FEFO/FIFO behavior.

### FR-POS-038 --- Expired stock sale policy

**Source:** BR-INV-005\
**Priority:** MUST\
**Phase:** 1

POS shall apply configured policy to sale of expired stock.

**Acceptance:** Expired condition cannot be silently ignored.

### FR-POS-039 --- Hold sale

**Source:** BR-POS-006\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to hold an active unposted sale without posting
stock/payment effects.

**Acceptance:** Held sale can be identified and retrieved.

### FR-POS-040 --- Hold sale persistence

**Source:** BR-POS-006\
**Priority:** MUST\
**Phase:** 1

A held sale shall survive POS application restart while local store
services/data remain intact.

**Acceptance:** Restart does not lose held sale.

### FR-POS-041 --- Held sale reference

**Source:** BR-POS-006\
**Priority:** MUST\
**Phase:** 1

Held sales shall have sufficient reference information to distinguish
them.

**Acceptance:** Cashier can identify intended held sale.

### FR-POS-042 --- Retrieve held sale

**Source:** BR-POS-006\
**Priority:** MUST\
**Phase:** 1

Authorized cashier shall be able to retrieve an eligible held sale.

**Acceptance:** Retrieved lines/totals/customer state are restored.

### FR-POS-043 --- Held sale concurrency

**Source:** BR-POS-007\
**Priority:** MUST\
**Phase:** 1

MiniMart shall prevent two counters/users from simultaneously completing
the same held sale.

**Acceptance:** At most one completion succeeds.

### FR-POS-044 --- Held sale revalidation

**Source:** BR-POS-007\
**Priority:** MUST\
**Phase:** 1

On retrieval/completion, POS shall revalidate mutable conditions such as
price policy, stock and permissions according to approved rules.

**Acceptance:** Stale held sale cannot bypass current controls.

### FR-POS-045 --- Cancel held sale

**Source:** BR-POS-008\
**Priority:** MUST\
**Phase:** 1

Authorized user shall be able to cancel an eligible held sale with
required reason/audit.

**Acceptance:** Cancellation creates no stock/payment effect.

### FR-POS-046 --- Void active sale

**Source:** BR-POS-008\
**Priority:** MUST\
**Phase:** 1

Authorized user shall be able to void/abandon an unposted active sale
according to policy.

**Acceptance:** Void is distinguishable from a posted return.

### FR-POS-047 --- No edit after posting

**Source:** BR-DATA-002\
**Priority:** MUST\
**Phase:** 1

A posted completed sale shall not be reopened and edited to change
financial/stock effect.

**Acceptance:** Correction uses return/reversal workflow.

### FR-POS-048 --- Initiate payment

**Source:** BR-POS-001, BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to enter payment stage only after sale validation
succeeds.

**Acceptance:** Payment due equals current validated payable.

### FR-POS-049 --- Freeze commercial state during payment

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

Once payment processing has materially begun, changes to sale
lines/prices/discounts shall be controlled so payment and sale totals
cannot diverge.

**Acceptance:** Any return to editing follows defined
cancellation/recalculation.

### FR-POS-050 --- Cancel payment stage before commitment

**Source:** BR-PAY-001\
**Priority:** MUST\
**Phase:** 1

Cashier may return from payment to sale editing only when payment state
safely permits it.

**Acceptance:** No confirmed Payment Commitment is lost, duplicated or
incorrectly converted into a posted Tender.

### FR-POS-051 --- Sale posting authorization

**Source:** BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Completion/posting shall require valid cashier permission and any
required overrides.

**Acceptance:** Unauthorized user cannot post.

### FR-POS-052 --- Atomic local sale posting

**Source:** BR-DATA-001\
**Priority:** MUST\
**Phase:** 1

Final local sale posting shall commit the Sale document, stock
movements, posted Tender records, audit records and
synchronization-intent/outbox records as one database transaction.

A successful external/manual payment outcome that occurs before final
sale posting is **not itself a posted Tender**. It shall be represented
as a recoverable payment commitment/attempt outcome until the sale posts
or the money is explicitly reversed/refunded.

**Acceptance:** A database failure cannot leave a Sale marked completed
while its required local stock/tender/audit/outbox effects are missing.
External money already confirmed before the failure remains discoverable
for recovery and is never silently forgotten or charged again.

### FR-POS-053 --- Stock reduction on sale

**Source:** BR-INV-001\
**Priority:** MUST\
**Phase:** 1

Successful sale posting shall create required negative stock movement
for stock-managed items.

**Acceptance:** Movement traces to sale.

### FR-POS-054 --- Posted tender association

**Source:** BR-PAY-007\
**Priority:** MUST\
**Phase:** 1

A successfully posted sale shall retain all posted Tender records that
settle it. Each posted Tender shall be derived from a validated payment
component and shall retain any applicable
payment-attempt/provider/manual-confirmation reference.

**Acceptance:** Tender totals reconcile to the sale payable according to
approved rounding/change rules, and an external payment reference can be
traced to the posted Tender without creating a second charge.

### FR-POS-055 --- Sale completion identity

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Completed sale shall receive stable identity/reference sufficient for
retrieval, receipt and retry protection.

**Acceptance:** Same logical completion is not duplicated.

### FR-POS-056 --- Sale completion audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Sale completion shall retain cashier, counter, store, time/business date
and applicable overrides.

**Acceptance:** Completed sale is attributable.

### FR-POS-057 --- Safe completion retry

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Retrying completion after timeout/restart shall not create duplicate
sale, stock or tender effects.

**Acceptance:** One effective sale remains.

### FR-POS-058 --- Concurrent stock revalidation

**Source:** BR-OPS-002\
**Priority:** MUST\
**Phase:** 1

Multi-counter completion shall revalidate stock/policy where required so
concurrent sales do not bypass configured controls.

**Acceptance:** Result follows negative-stock policy.

### FR-POS-059 --- Offline sale completion

**Source:** BR-POS-010, BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

A valid local sale shall complete while internet/cloud is unavailable if
Store Node/database and required local dependencies are operational.

**Acceptance:** Cloud loss alone does not block billing.

### FR-POS-060 --- Cloud-unavailable indication

**Source:** BR-POS-011\
**Priority:** MUST\
**Phase:** 1

POS shall visibly indicate cloud/offline state without unnecessarily
blocking local billing.

**Acceptance:** Cashier can distinguish offline operation.

### FR-POS-061 --- Store Node unavailable behavior

**Source:** BR-OPS-004\
**Priority:** MUST\
**Phase:** 1/3

POS shall follow the approved phase-specific survival policy when Store
Node is unreachable; it shall not pretend posting succeeded.

**Acceptance:** State is clearly WORKS WITH LIMITATION/BLOCKED/RECOVERY
as specified.

### FR-POS-062 --- Database unavailable behavior

**Source:** BR-OPS-004\
**Priority:** MUST\
**Phase:** 1

If the authoritative local database cannot safely accept posting, POS
shall block completion rather than fabricate success.

**Acceptance:** Active sale is preserved where feasible.

### FR-POS-063 --- App restart with active unposted sale

**Source:** BR-OPS-005\
**Priority:** SHOULD\
**Phase:** 1

MiniMart should recover or clearly identify recoverable active unposted
sale state after application restart.

**Acceptance:** Cashier is not invited to duplicate a possibly posted
sale.

### FR-POS-064 --- Power interruption during posting

**Source:** BR-OPS-005\
**Priority:** MUST\
**Phase:** 1

After power/service recovery, MiniMart shall determine whether sale
posting committed and present one unambiguous outcome.

**Acceptance:** No blind repost is required.

### FR-POS-065 --- Duplicate action protection

**Source:** BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Repeated Enter/click/scan actions during completion shall not create
duplicate sale postings.

**Acceptance:** Completion command is idempotent at business effect
level.

## Lifecycle

``` text
EMPTY → ACTIVE → HELD ↔ RETRIEVED
          ↓
       PAYMENT
          ↓
       POSTING
          ↓
      COMPLETED
```

`VOID/ABANDONED` applies only before posting. A completed sale is
corrected through a return/refund or explicit reversal process, not by
reopening it.

## Critical invariant

Sale + required stock movement + tenders + audit + synchronization
intent must form one logical posting outcome.
