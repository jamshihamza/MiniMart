# MiniMart Split Tender and Credit Payment Functional Specification --- v0.4

**Document ID:** MM-FRS-PAY-SPLIT-001\
**Requirement namespace:** `FR-PAY-056`--`FR-PAY-075`\
**Status:** Detailed Working Draft --- Batch 3

## Canonical payment lifecycle

For MiniMart v0.8 the following concepts are distinct:

1.  **Payment Attempt** --- an attempt/request to collect money; may be
    pending, failed, successful or uncertain.
2.  **Payment Commitment** --- a confirmed monetary outcome that must be
    completed, allocated, reversed or refunded; it may exist before the
    Sale is finally posted.
3.  **Posted Tender** --- MiniMart's immutable settlement record
    created/associated during final Sale posting.
4.  **Sale** --- the posted commercial document. Its local document,
    stock, posted tenders, audit and outbox effects are committed
    atomically.

This distinction is mandatory for split tender, external terminal, QR
and future integrated payment recovery.

## Requirements

### FR-PAY-056 --- Split tender

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

Cashier shall be able to settle one sale using multiple permitted
tenders.

**Acceptance:** Combined validated payment components reconcile to
payable before final Sale posting.

### FR-PAY-057 --- Remaining due

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

During split payment, POS shall continuously show remaining amount due
after confirmed Payment Commitments and any immediately finalizable
payment components.

**Acceptance:** Remaining due cannot become ambiguous.

### FR-PAY-058 --- Partial cash in split

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

Cash may settle part of sale and leave remaining due for another tender.

**Acceptance:** Cash component is retained separately and becomes a
posted Tender only with final Sale posting.

### FR-PAY-059 --- Partial electronic tender

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

A confirmed card/QR Payment Commitment may settle part of the sale where
provider/store policy permits.

**Acceptance:** Remaining due is recalculated from confirmed payment
state without treating the Sale as posted.

### FR-PAY-060 --- Split tender order

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

MiniMart shall handle permitted tender sequence deterministically.

**Acceptance:** Tender order does not alter total due except defined
rounding rules.

### FR-PAY-061 --- Cash rounding with split tender

**Source:** BR-PAY-001, BR-PAY-005\
**Priority:** MUST

**Decision Status:** OPEN

**Verification Gate:** Country-specific verification required\
**Phase:** 1/2

The active country rule shall define when cash rounding applies to a
mixed-tender sale.

**Acceptance:** Implementation is blocked until rule is explicit for
affected country.

### FR-PAY-062 --- Partial payment commitment then later failure

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

If one split payment component becomes committed/confirmed and a later
component fails, the successful component shall remain represented as a
recoverable payment commitment and shall not be forgotten, duplicated or
prematurely treated as a posted sale Tender.

**Acceptance:** The sale remains in a controlled
partially-paid/payment-recovery state showing confirmed amount,
remaining due and recovery actions.

### FR-PAY-063 --- Abandon partially-paid sale

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

A sale with a committed/confirmed payment component shall not be simply
abandoned. MiniMart shall require completion of the sale or an approved
reversal/refund/recovery process for the committed money.

**Acceptance:** Confirmed money is either linked to the final posted
sale or explicitly reversed/refunded with audit evidence.

### FR-PAY-064 --- Partially-paid restart recovery

**Source:** BR-OPS-005\
**Priority:** MUST\
**Phase:** 1

After restart, MiniMart shall recover or identify confirmed payment
commitments, their provider/manual references and remaining due without
asking the customer to repay an already-confirmed amount.

**Acceptance:** Payment recovery reconstructs the state without creating
a duplicate charge or a duplicate posted Tender.

### FR-PAY-065 --- Partially-paid hold restriction

**Source:** BR-POS-006\
**Priority:** MUST\
**Phase:** 1

A sale with a confirmed payment commitment shall not enter the ordinary
held-sale workflow unless a specifically designed payment-recovery hold
state exists.

**Acceptance:** Confirmed money cannot become stranded inside an
ordinary unpaid held sale.

### FR-PAY-066 --- Overpayment across split tenders

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

POS shall prevent unintended overpayment across non-cash tenders and
apply defined cash-change behavior only where allowed.

**Acceptance:** Tender sum follows policy.

### FR-PAY-067 --- Tender removal before commitment

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

An uncommitted split-tender entry may be removed.

**Acceptance:** Remaining due recalculates.

### FR-PAY-068 --- Reversal after payment commitment

**Source:** BR-PAY-006\
**Priority:** MUST\
**Phase:** 1

A confirmed payment commitment or posted Tender cannot be removed as if
it never happened. Cancellation after confirmation requires an explicit
reversal/refund/recovery action appropriate to the payment method and
state.

**Acceptance:** Monetary history and audit trail remain intact.

### FR-PAY-069 --- Credit tender customer requirement

**Source:** BR-PAY-004, BR-CUS-003\
**Priority:** MUST\
**Phase:** 1

Customer credit tender shall require an eligible identified customer.

**Acceptance:** Anonymous sale cannot use customer credit.

### FR-PAY-070 --- Credit limit/terms delegation

**Source:** BR-PAY-004\
**Priority:** MUST\
**Phase:** 1/2

POS shall request approved customer-credit eligibility/limit/terms
decision from the Customer Credit module rather than inventing it.

**Acceptance:** Detailed credit policy is defined in Batch 4.

### FR-PAY-071 --- Credit override

**Source:** BR-PAY-004\
**Priority:** SHOULD\
**Phase:** 2

If credit policy allows override, approving manager and reason shall be
retained.

**Acceptance:** Override is auditable.

### FR-PAY-072 --- Credit as split tender

**Source:** BR-PAY-005\
**Priority:** SHOULD\
**Phase:** 2

Where policy permits, customer credit may settle part of a sale
alongside other tenders.

**Acceptance:** Outstanding amount reflects only credit portion.

### FR-PAY-073 --- Payment reconciliation before sale posting

**Source:** BR-PAY-007\
**Priority:** MUST\
**Phase:** 1

Before final sale posting, confirmed payment components, cash/change and
rounding shall reconcile to the sale payable according to approved
rules. Final posting shall convert/associate the validated components
into posted Tender records within the sale transaction.

**Acceptance:** An unreconciled sale cannot complete; a confirmed
external payment is not charged again merely because final local posting
must be retried.

### FR-PAY-074 --- Split-tender receipt

**Source:** BR-PAY-005\
**Priority:** MUST\
**Phase:** 1

Receipt shall show permitted summary of each tender used.

**Acceptance:** Receipt tender summary reconciles to posted tenders.

### FR-PAY-075 --- Payment acceptance suite

**Source:** BR-PAY-006, BR-DATA-004\
**Priority:** MUST\
**Phase:** 1

Automated/integration tests shall cover cash/change, failure,
timeout/uncertain, retry, split partial success, restart recovery and
duplicate-result handling.

**Acceptance:** Payment invariants are regression-tested.

## Critical scenario

``` text
Cash ₹/RM X succeeds
→ Card/QR attempt fails or becomes uncertain
→ MiniMart retains successful cash tender
→ Shows exact remaining due / unresolved tender
→ Does NOT restart the whole payment as unpaid
```

Detailed customer-credit account policy remains in Batch 4.
