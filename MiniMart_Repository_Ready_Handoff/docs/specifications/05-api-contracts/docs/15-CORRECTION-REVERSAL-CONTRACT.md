# Correction and Reversal Contract

Posted source documents/facts are immutable. API correction is
compensating, source-linked and audited.

Explicit commands exist for CustomerCollection, SupplierPayment,
FinancialTransaction, AccountTransfer and Expense. Manual inventory
adjustment correction creates a compensating StockMovement rather than
editing the original movement.

Each reversal requires stable source identity, reason, authorization,
idempotency and the owning coordinator/module UnitOfWork. The original
posted resource remains queryable.
