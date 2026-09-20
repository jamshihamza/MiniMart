# Domain Design Decisions --- v0.2

## DM-DEC-001 --- Aggregate boundaries are smaller than posting envelopes

Separate module-owned aggregates may be coordinated in one local Unit of
Work. Atomicity does not justify a giant Sale aggregate.

## DM-DEC-002 --- Supplier belongs to Procurement

Supplier is a stable company-wide Procurement aggregate root.

## DM-DEC-003 --- Customer and Credit share a context but not an aggregate

Customer and CreditAccount remain separate roots.

## DM-DEC-004 --- InventoryPosition owns stock consistency

InventoryPosition Item × Store owns quantity/disposition/WAC;
StockMovement is immutable evidence.

## DM-DEC-005 --- Payments owns PostedTender

CheckoutPayment owns attempts, commitments and immutable PostedTender
facts. Sale retains settlement references/totals, not provider state.

## DM-DEC-006 --- Returns owns RefundObligation; Payments owns RefundExecution

Commercial refund liability and execution/provider state are separate
ownership concerns.

## DM-DEC-007 --- Reporting/import/hardware/backup/sync are cross-cutting

They are not transactional business aggregates unless later approved
requirements create independent business lifecycles.

## DM-DEC-008 --- CountryRuleSet is versioned policy

Country-specific behavior is version/effective aware and historical
outcomes remain stable.

## DM-DEC-009 --- Cash & Business Day owns BusinessDate lifecycle

Organization supplies timezone/configuration; BusinessDay resolves
operational BusinessDate.

## DM-DEC-010 --- Human document number is not identity

Stable aggregate identity is independent of open numbering-scope policy.

## DM-DEC-011 --- RefundExecution is a separate Payments aggregate

Refund attempts can outlive checkout and require independent
idempotency/uncertainty/reconciliation lifecycle.

## DM-DEC-012 --- Return status and refund status are orthogonal

A Return can be POSTED while RefundObligation is
OUTSTANDING/PENDING/FAILED/UNCERTAIN/SETTLED.

## DM-DEC-013 --- Application coordinators own Unit-of-Work composition

Coordinators invoke public module ports and never write another module's
internal tables.

## DM-DEC-014 --- Concurrency keys are domain requirements

Domain Model defines the business key that must be
serialized/revalidated; Database Model chooses PostgreSQL mechanics.

## DM-DEC-015 --- InventoryPosition contains disposition buckets

Item × Store remains the root; sellable/non-sellable/batch quantities
are sub-position facts and do not create a new costing method.

## DM-DEC-016 --- Accounting-Lite uses immutable FinancialMovement facts

FinancialAccount is a controlled master; money movement is source-linked
append-only fact. Generic non-sale receipt/payment uses
FinancialTransaction.

## DM-DEC-017 --- Domain events cannot repair local atomicity

Local invariants complete synchronously in the Posting Envelope. Outbox
events are for post-commit consumers.

## DM-DEC-018 --- Proposed/open/verify/deferred decisions remain non-final

The complete decision matrix is part of the Domain Model freeze
candidate and downstream agents must obey it.
