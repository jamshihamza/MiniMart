# MiniMart Freeze-Blocker Remediation Acceptance --- v0.8

**Document ID:** MM-FRS-REM-ACCEPT-001\
**Status:** Working baseline

## AC-REM-001 --- External payment succeeds, local sale posting initially fails

Provider/manual confirmation is retained as a Payment Commitment.
Retrying local posting does not recharge the customer. The final Sale
creates/associates one posted Tender.

## AC-REM-002 --- Split payment first component succeeds, second fails

The first confirmed component remains recoverable, remaining due is
correct, and the sale cannot be abandoned as unpaid.

## AC-REM-003 --- Restart after confirmed payment before sale posting

MiniMart reconstructs the payment commitment from stable
identity/reference and offers completion or explicit reversal/refund
without duplicate charge.

## AC-REM-004 --- Sale local atomicity

Final Sale, stock movements, posted Tenders, audit and outbox either
commit together or none of those local posted effects commit.

## AC-REM-005 --- Return posted, electronic refund uncertain

Return and stock disposition post once; an outstanding Refund Obligation
remains visible. Later settlement does not repost stock.

## AC-REM-006 --- Refund retry

Retry of an uncertain refund uses stable identity/status
inquiry/reconciliation and cannot create two refunds for one obligation.

## AC-REM-007 --- Weighted-average receipt

Two receipts at different acquisition costs produce the exact expected
moving WAC at store/item scope.

## AC-REM-008 --- Free quantity

A paid quantity plus supplier free quantity spreads the same net
acquisition value across total accepted quantity.

## AC-REM-009 --- Purchase discount and tax classification

Purchase discounts reduce acquisition value; verified recoverable tax is
excluded and non-recoverable attributable tax is included.

## AC-REM-010 --- Negative stock Phase 1

An issue/sale that would take stock below zero is blocked under the
initial WAC baseline.

## AC-REM-011 --- Company-wide item identity

Two stores reference one Item identity while retaining separate stock,
cost and store price assignments.

## AC-REM-012 --- Company-wide customer

The same Customer can transact in two stores without cloning identity;
store metadata remains attributable.

## AC-REM-013 --- Phase-1 basic credit

An eligible identified customer can complete a credit sale, outstanding
increases exactly once, and a later collection reduces it exactly once.

## AC-REM-014 --- Country rule version history

A country-pack update affects future applicable transactions but does
not recalculate a previously posted document.

## AC-REM-015 --- Supplier payable and payment

A posted purchase creates supplier outstanding; a supplier payment
reduces it exactly once and creates a traceable cash/bank movement.

## AC-REM-016 --- Expense from store cash

Posting an approved expense paid from controlled store cash creates one
expense and linked drawer/cash movement without unexplained shift
variance.

## AC-REM-017 --- Accountant export

Operational supplier/customer/cash-bank/expense export reconciles to
MiniMart source entries and contains stable source references.
