# Frozen Domain → Database Traceability

  ---------------------------------------------------------------------------
  Frozen aggregate root               Primary persistence
  ----------------------------------- ---------------------------------------
  Company                             `org.companies`

  Store                               `org.stores`

  Counter                             `org.counters`

  UserAccount                         `iam.user_accounts`

  Role                                `iam.roles` + role membership tables

  OverrideAuthorization               `iam.override_authorizations`

  SupportSession                      `iam.support_sessions`

  Item                                `catalog.items`, `item_barcodes`,
                                      `item_uoms`, `item_categories`

  Category                            `catalog.categories`

  Brand                               `catalog.brands`

  ItemPriceSchedule                   `pricing.item_price_schedules`,
                                      `item_price_entries`

  Supplier                            `procurement.suppliers`,
                                      `supplier_items`

  PurchaseOrder                       `procurement.purchase_orders`,
                                      `purchase_order_lines`

  GoodsReceipt                        `procurement.goods_receipts`,
                                      `goods_receipt_lines`

  PurchaseReturn                      `procurement.purchase_returns`,
                                      `purchase_return_lines`

  InventoryPosition                   `inventory.inventory_positions`,
                                      bucket/batch tables

  StockCount                          `inventory.stock_counts`,
                                      `stock_count_lines`

  Sale                                `sales.sales`, `sale_lines`,
                                      `sale_state_history`

  CheckoutPayment                     `payments.checkout_payments`, attempts,
                                      commitments, posted_tenders

  RefundExecution                     `payments.refund_executions`,
                                      `refund_attempts`

  SalesReturn                         `returns.sales_returns`,
                                      `sales_return_lines`,
                                      `refund_obligations`

  Customer                            `customer.customers`

  CreditAccount                       `customer.credit_accounts`,
                                      `credit_ledger_entries`

  CustomerCollection                  `customer.customer_collections`,
                                      `collection_allocations`

  CashierShift                        `cash.cashier_shifts`,
                                      `cash_movements`,
                                      `shift_tender_summaries`

  BusinessDay                         `cash.business_days`

  SupplierPayable                     `accounting.supplier_payables`,
                                      `supplier_payable_allocations`

  SupplierPayment                     `accounting.supplier_payments`,
                                      `supplier_payment_allocations`

  FinancialAccount                    `accounting.financial_accounts`,
                                      `financial_movements`

  FinancialTransaction                `accounting.financial_transactions`,
                                      `financial_movements`

  AccountTransfer                     `accounting.account_transfers`,
                                      `financial_movements`

  ExpenseCategory                     `accounting.expense_categories`

  Expense                             `accounting.expenses`,
                                      `financial_movements`

  ReconciliationSession               `accounting.reconciliation_sessions`,
                                      `reconciliation_matches`

  CountryRuleSet                      `country.country_rule_sets`,
                                      `country_rule_values`
  ---------------------------------------------------------------------------

## Non-root immutable facts

  Domain fact           Persistence
  --------------------- ----------------------------------
  StockMovement         `inventory.stock_movements`
  PaymentAttempt        `payments.payment_attempts`
  PaymentCommitment     `payments.payment_commitments`
  PostedTender          `payments.posted_tenders`
  RefundObligation      `returns.refund_obligations`
  RefundAttempt         `payments.refund_attempts`
  CreditLedgerEntry     `customer.credit_ledger_entries`
  CashMovement          `cash.cash_movements`
  FinancialMovement     `accounting.financial_movements`
  AuditEvent            `audit.audit_events`
  Domain/outbox event   `integration.outbox_messages`

## Cross-cutting frozen invariants

  -----------------------------------------------------------------------
  Domain invariant                    Database mechanism
  ----------------------------------- -----------------------------------
  Item × Store inventory root         unique inventory-position key + row
                                      lock

  No duplicate logical command        idempotency unique key

  No duplicate incoming sync          inbox unique key

  Posted history immutable            append-only tables + status-aware
                                      updates/reversals

  Same-envelope atomicity             one PostgreSQL transaction

  Audit/outbox same transaction       inserts before commit

  Credit concurrency                  CreditAccount row lock/version +
                                      ledger

  Held Sale double completion         Sale row lock/version +
                                      posted/idempotency checks

  PO over-receipt race                PO/line row locks + posting-time
                                      policy validation

  Sales over-return                   original SaleLine consistency key +
                                      posted-return aggregate scan/guard

  Purchase over-return                source GRN line consistency key +
                                      posted-return scan/guard

  Country history                     rule-set reference + stored
                                      calculation snapshots
  -----------------------------------------------------------------------
