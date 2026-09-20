# Posting Envelope → API Map

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                     \# Coordinator                                Contract         Route
  --------------------- ------------------------------------------ ---------------- --------------------------------------------------------------------------------
                      1 `SalePostingCoordinator`                   API-POS-012      `POST /api/v1/sales/{saleId}:post`

                      2 `GoodsReceiptPostingCoordinator`           API-PUR-010      `POST /api/v1/procurement/goods-receipts/{goodsReceiptId}:post`

                      3 `PurchaseReturnPostingCoordinator`         API-PUR-015      `POST /api/v1/procurement/purchase-returns/{purchaseReturnId}:post`

                      4 `SalesReturnPostingCoordinator`            API-RET-006      `POST /api/v1/returns/{salesReturnId}:post`

                      5 `RefundSettlementCoordinator`              API-PAY-013      `POST /api/v1/refund-executions/{refundExecutionId}:settle`

                      6 `StockCountPostingCoordinator`             API-INV-009      `POST /api/v1/inventory/stock-counts/{stockCountId}:post`

                      7 `CustomerCollectionPostingCoordinator`     API-CRD-008      `POST /api/v1/customer-collections/{collectionId}:post`

                      8 `SupplierPaymentPostingCoordinator`        API-ACC-006      `POST /api/v1/accounting/supplier-payments/{supplierPaymentId}:post`

                      9 `FinancialTransactionPostingCoordinator`   API-ACC-012      `POST /api/v1/accounting/financial-transactions/{financialTransactionId}:post`

                     10 `AccountTransferPostingCoordinator`        API-ACC-014      `POST /api/v1/accounting/transfers/{accountTransferId}:post`

                     11 `ExpensePostingCoordinator`                API-ACC-020      `POST /api/v1/accounting/expenses/{expenseId}:post`

                     12 `ManualCashInCoordinator`                  API-CSH-006      `POST /api/v1/cash/shifts/{shiftId}/cash-in`

                     13 `ManualCashOutCoordinator`                 API-CSH-007      `POST /api/v1/cash/shifts/{shiftId}/cash-out`
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------

All 13 commands require idempotency, server-resolved BusinessContext,
one local PostgreSQL Posting Envelope transaction, and no external
provider call inside that transaction.
