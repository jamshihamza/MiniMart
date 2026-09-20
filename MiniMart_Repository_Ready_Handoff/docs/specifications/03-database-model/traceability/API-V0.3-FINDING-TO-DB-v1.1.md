# API v0.3 Final-Review Finding → Database v1.1 Amendment

  -------------------------------------------------------------------------------------------------------------
  API v0.3 concern                    Database v1.1 treatment
  ----------------------------------- -------------------------------------------------------------------------
  Company business registration/tax   `org.company_identifiers`
  identifiers                         

  Company contact/default             Not added; API over-scoped versus frozen FRS
  language/receipt identity           

  Store language/receipt/contact      Explicit Store columns

  Store Node association              Not added; infrastructure boundary

  Item short description / sellable / Explicit Item columns
  purchasable / fractional / weighed  
  / batch / expiry / skeleton / notes 

  Item base/sales/purchase UoM UUIDs  Derived from `catalog.item_uoms` role rows

  Item quantity precision             `catalog.item_uoms.quantity_precision`

  Item stock-managed                  Not added; not a frozen universal Item requirement

  Supplier contacts                   `procurement.supplier_contacts`

  Supplier tax/registration           `procurement.supplier_identifiers`
  identifiers                         

  Supplier payment/credit terms,      Supplier columns
  country, notes                      

  Customer type/contact/address/notes Customer columns

  Customer multiple tax/business      `customer.customer_identifiers`
  identifiers                         

  Customer communication consent      Not added; LATER/verification-gated

  Pricing reference/max/recommended   `pricing.item_price_entries.reference_price/reference_price_kind`
  price                               

  Pricing tax-inclusive/exclusive     `tax_price_context_code`
  context                             

  Price-change reason                 `change_reason`

  Credit terms                        `customer.credit_accounts.terms_code/due_date_basis_code`

  Credit pending exposure             Not added; OPEN decision seam

  Return reason/note                  Return header/line columns

  GRN supplier invoice date           `procurement.goods_receipts.supplier_invoice_date`

  Customer Collection tender          `customer.customer_collections.tender_method_code`

  Supplier Payment source             `accounting.supplier_payments.financial_account_id/payment_method_code`
  account/method                      
  -------------------------------------------------------------------------------------------------------------
