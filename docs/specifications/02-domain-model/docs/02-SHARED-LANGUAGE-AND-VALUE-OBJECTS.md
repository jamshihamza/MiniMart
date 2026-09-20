# Shared Language and Value Objects --- v0.2

## Ubiquitous language

  -----------------------------------------------------------------------
  Term                                Domain meaning
  ----------------------------------- -----------------------------------
  Posted                              Business document crossed its
                                      irreversible posting boundary

  Payment Attempt                     One attempt to obtain/record a
                                      tender outcome

  Payment Commitment                  Durable confirmed monetary
                                      commitment before/independent of
                                      final Sale posting

  Posted Tender                       Payments-owned immutable MiniMart
                                      settlement fact linked to a posted
                                      Sale

  Refund Obligation                   Return-owned responsibility to
                                      settle a refund amount/method

  Refund Execution                    Payments-owned
                                      execution/reconciliation process
                                      for an intended refund

  Stock Movement                      Immutable fact explaining a stock
                                      quantity/disposition change

  Inventory Position                  Item × Store stock/disposition/WAC
                                      consistency root

  Stock Bucket                        Policy-defined inventory
                                      disposition such as
                                      sellable/non-sellable category

  Business Date                       Explicit Store operating date
                                      resolved by Cash & Business Day

  Posting Envelope                    One coordinated local Unit of Work
                                      spanning required module-owned
                                      effects

  Country Rule Set                    Version/effective policy context
                                      for country-specific behavior
  -----------------------------------------------------------------------

## Identity value objects

Opaque stable identities include:

`CompanyId`, `StoreId`, `CounterId`, `UserId`, `ItemId`, `SupplierId`,
`CustomerId`, `SaleId`, `SaleLineId`, `CheckoutPaymentId`,
`PaymentAttemptId`, `PaymentCommitmentId`, `PostedTenderId`,
`SalesReturnId`, `RefundObligationId`, `RefundExecutionId`,
`GoodsReceiptId`, `PurchaseOrderId`, `PurchaseOrderLineId`,
`PurchaseReturnId`, `InventoryPositionId`, `StockMovementId`,
`StockCountId`, `CreditAccountId`, `CustomerCollectionId`, `ShiftId`,
`BusinessDayId`, `SupplierPayableId`, `SupplierPaymentId`,
`FinancialAccountId`, `FinancialTransactionId`, `AccountTransferId`,
`ExpenseId`, `ReconciliationSessionId`, `CountryRuleSetId`.

Human display codes/document numbers are attributes, not identity.

## Money

`Money(amount, currency)`

Rules: - exact decimal/minor-unit semantics; - no binary floating-point
authority; - compatible currency required for arithmetic; - rounding is
explicit policy; - posted snapshots retain exact applied monetary
values.

## Quantity

`Quantity(value, unit, precision)`

Rules: - UoM conversion is explicit; - whole-only/fractional precision
is enforced; - stock movement direction/reason is explicit.

## BusinessDate

A Store operating-date value. It is resolved by BusinessDay policy/state
and may differ from wall-clock calendar date.

## BusinessContext

`BusinessContext(companyId, storeId, counterId?, businessDate, timezone, actorId, countryRuleSetRef)`

Commands/postings preserve the resolved operational context. A consuming
module does not independently roll BusinessDate.

## PostingEnvelopeId

Identity grouping all local business facts committed in one coordinated
transaction. It is not a business-document identity.

## CorrelationId / CausationId

Correlation groups a wider business flow. Causation identifies the
direct triggering command/event.

## CountryRuleSetRef

`CountryRuleSetRef(countryCode, ruleSetVersion, effectiveIdentity)`

Preserves applicable rule context without reinterpreting history after
rule updates.

## ItemSnapshot / PartySnapshot / PriceSnapshot / TaxSnapshot

Historical document-safe snapshots preserve business meaning without
cloning master aggregates.

## StockBucket

Policy-defined inventory disposition identity. The domain supports
separate sellable/non-sellable quantities without freezing the final
vocabulary while `DEC-RET-002` remains proposed.

## ReasonCode

Controlled reason identity used for overrides, adjustments, returns,
cash movements and corrections.

## ExternalReference

Provider/external reference with safe masked display where needed. It
never replaces MiniMart identity and never contains prohibited
payment-card data.

## IdempotencyKey

Stable retry identity ensuring one intended logical command/effect.

## DocumentNumber

Human-facing business reference governed by `DEC-COM-002`; never the
aggregate identity.
