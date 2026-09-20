# Store Node API Operation Catalog v0.2

**Operations:** 229.

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Contract       Method     Path                                                                           Module            Type              Purpose                                Guards
  -------------- ---------- ------------------------------------------------------------------------------ ----------------- ----------------- -------------------------------------- ----------------------------------------
  API-SYS-001    GET        `/api/v1/system/health`                                                        System            QUERY             Process liveness                       ---

  API-SYS-002    GET        `/api/v1/system/readiness`                                                     System            QUERY             Transactional readiness and dependency ---
                                                                                                                                               gates                                  

  API-SYS-003    GET        `/api/v1/system/version`                                                       System            QUERY             Build/API/schema/sync compatibility    ---
                                                                                                                                               versions                               

  API-SYS-004    POST       `/api/v1/system/compatibility:check`                                           System            QUERY             Check client/API compatibility before  ---
                                                                                                                                               writes                                 

  API-SYS-005    GET        `/api/v1/system/context`                                                       System            QUERY             Get trusted resolved operational       ---
                                                                                                                                               context                                

  API-SYS-006    GET        `/api/v1/system/capabilities`                                                  System            QUERY             Get enabled edge capabilities and      ---
                                                                                                                                               policy-neutral feature flags           

  API-IAM-001    POST       `/api/v1/auth/login`                                                           Identity & Access AUTH              Authenticate user on enrolled device   ---

  API-IAM-002    POST       `/api/v1/auth/pin-login`                                                       Identity & Access AUTH              Authenticate by PIN where configured   ---

  API-IAM-003    POST       `/api/v1/auth/logout`                                                          Identity & Access COMMAND           End current user session               Idempotency

  API-IAM-004    GET        `/api/v1/auth/session`                                                         Identity & Access QUERY             Get current session and authorization  ---
                                                                                                                                               summary                                

  API-IAM-005    POST       `/api/v1/auth/reauthenticate`                                                  Identity & Access COMMAND           Reauthenticate for protected action    Idempotency

  API-IAM-006    GET        `/api/v1/iam/users`                                                            Identity & Access QUERY             Search/list users                      ---

  API-IAM-007    POST       `/api/v1/iam/users`                                                            Identity & Access COMMAND           Create user account                    Idempotency

  API-IAM-008    GET        `/api/v1/iam/users/{userId}`                                                   Identity & Access QUERY             Get user account                       ---

  API-IAM-009    PATCH      `/api/v1/iam/users/{userId}`                                                   Identity & Access COMMAND           Update mutable user                    Idempotency, If-Match
                                                                                                                                               profile/assignments                    

  API-IAM-010    POST       `/api/v1/iam/users/{userId}:activate`                                          Identity & Access COMMAND           Activate user                          Idempotency

  API-IAM-011    POST       `/api/v1/iam/users/{userId}:deactivate`                                        Identity & Access COMMAND           Deactivate user without deleting       Idempotency
                                                                                                                                               history                                

  API-IAM-012    GET        `/api/v1/iam/roles`                                                            Identity & Access QUERY             List roles and permission summaries    ---

  API-IAM-013    POST       `/api/v1/iam/roles`                                                            Identity & Access COMMAND           Create role                            Idempotency

  API-IAM-014    PATCH      `/api/v1/iam/roles/{roleId}`                                                   Identity & Access COMMAND           Update role permissions                Idempotency, If-Match

  API-IAM-015    POST       `/api/v1/iam/overrides`                                                        Identity & Access COMMAND           Create scoped manager override         Idempotency
                                                                                                                                               authorization                          

  API-IAM-016    GET        `/api/v1/iam/overrides/{overrideId}`                                           Identity & Access QUERY             Get override state/evidence            ---

  API-IAM-017    POST       `/api/v1/iam/support-sessions`                                                 Identity & Access COMMAND           Create time-limited support            Idempotency
                                                                                                                                               authorization                          

  API-IAM-018    POST       `/api/v1/iam/support-sessions/{supportSessionId}:revoke`                       Identity & Access COMMAND           Revoke support authorization           Idempotency

  API-ORG-001    GET        `/api/v1/organization/company`                                                 Organization      QUERY             Get company profile                    ---

  API-ORG-002    PATCH      `/api/v1/organization/company`                                                 Organization      COMMAND           Update company profile                 Idempotency, If-Match

  API-ORG-003    GET        `/api/v1/organization/stores`                                                  Organization      QUERY             List stores                            ---

  API-ORG-004    POST       `/api/v1/organization/stores`                                                  Organization      COMMAND           Create store                           Idempotency

  API-ORG-005    GET        `/api/v1/organization/stores/{storeId}`                                        Organization      QUERY             Get store                              ---

  API-ORG-006    PATCH      `/api/v1/organization/stores/{storeId}`                                        Organization      COMMAND           Update store profile/configuration     Idempotency, If-Match

  API-ORG-007    POST       `/api/v1/organization/stores/{storeId}:activate`                               Organization      COMMAND           Activate store                         Idempotency

  API-ORG-008    POST       `/api/v1/organization/stores/{storeId}:deactivate`                             Organization      COMMAND           Deactivate store without deleting      Idempotency
                                                                                                                                               history                                

  API-ORG-009    GET        `/api/v1/organization/counters`                                                Organization      QUERY             List counters                          ---

  API-ORG-010    POST       `/api/v1/organization/counters`                                                Organization      COMMAND           Register counter identity record       Idempotency

  API-ORG-011    GET        `/api/v1/organization/counters/{counterId}`                                    Organization      QUERY             Get counter                            ---

  API-ORG-012    PATCH      `/api/v1/organization/counters/{counterId}`                                    Organization      COMMAND           Update counter profile                 Idempotency, If-Match

  API-ORG-013    POST       `/api/v1/organization/counters/{counterId}:activate`                           Organization      COMMAND           Activate counter                       Idempotency

  API-ORG-014    POST       `/api/v1/organization/counters/{counterId}:deactivate`                         Organization      COMMAND           Deactivate counter                     Idempotency

  API-CAT-001    GET        `/api/v1/catalog/items`                                                        Catalog           QUERY             Search/list items                      ---

  API-CAT-002    POST       `/api/v1/catalog/items`                                                        Catalog           COMMAND           Create item                            Idempotency

  API-CAT-003    GET        `/api/v1/catalog/items/{itemId}`                                               Catalog           QUERY             Get item                               ---

  API-CAT-004    PATCH      `/api/v1/catalog/items/{itemId}`                                               Catalog           COMMAND           Update mutable item master data        Idempotency, If-Match

  API-CAT-005    POST       `/api/v1/catalog/items/{itemId}:activate`                                      Catalog           COMMAND           Activate item                          Idempotency

  API-CAT-006    POST       `/api/v1/catalog/items/{itemId}:deactivate`                                    Catalog           COMMAND           Deactivate item without deleting       Idempotency
                                                                                                                                               history                                

  API-CAT-007    GET        `/api/v1/catalog/barcodes/{barcode}:resolve`                                   Catalog           QUERY             Resolve active barcode to sellable     ---
                                                                                                                                               item snapshot                          

  API-CAT-008    POST       `/api/v1/catalog/items/{itemId}/barcodes`                                      Catalog           COMMAND           Add barcode                            Idempotency

  API-CAT-009    DELETE     `/api/v1/catalog/items/{itemId}/barcodes/{barcodeId}`                          Catalog           COMMAND           Remove barcode association where       Idempotency
                                                                                                                                               allowed                                

  API-CAT-010    POST       `/api/v1/catalog/items/{itemId}/uoms`                                          Catalog           COMMAND           Add item UoM/pack definition           Idempotency

  API-CAT-011    PATCH      `/api/v1/catalog/items/{itemId}/uoms/{uomId}`                                  Catalog           COMMAND           Update mutable UoM definition          Idempotency, If-Match

  API-CAT-012    GET        `/api/v1/catalog/categories`                                                   Catalog           QUERY             List/search categories                 ---

  API-CAT-013    POST       `/api/v1/catalog/categories`                                                   Catalog           COMMAND           Create category                        Idempotency

  API-CAT-014    PATCH      `/api/v1/catalog/categories/{categoryId}`                                      Catalog           COMMAND           Update category                        Idempotency, If-Match

  API-CAT-015    GET        `/api/v1/catalog/brands`                                                       Catalog           QUERY             List/search brands                     ---

  API-CAT-016    POST       `/api/v1/catalog/brands`                                                       Catalog           COMMAND           Create brand                           Idempotency

  API-CAT-017    PATCH      `/api/v1/catalog/brands/{brandId}`                                             Catalog           COMMAND           Update brand                           Idempotency, If-Match

  API-PRI-001    POST       `/api/v1/pricing:quote`                                                        Pricing           QUERY             Quote applicable selling price         ---

  API-PRI-002    GET        `/api/v1/pricing/schedules`                                                    Pricing           QUERY             List/search item price schedules       ---

  API-PRI-003    POST       `/api/v1/pricing/schedules`                                                    Pricing           COMMAND           Create price schedule/draft            Idempotency

  API-PRI-004    GET        `/api/v1/pricing/schedules/{priceScheduleId}`                                  Pricing           QUERY             Get price schedule                     ---

  API-PRI-005    PATCH      `/api/v1/pricing/schedules/{priceScheduleId}`                                  Pricing           COMMAND           Update mutable price schedule          Idempotency, If-Match

  API-PRI-006    POST       `/api/v1/pricing/schedules/{priceScheduleId}:activate`                         Pricing           COMMAND           Activate/publish schedule when policy  Idempotency
                                                                                                                                               permits                                

  API-PRI-007    POST       `/api/v1/pricing/schedules/{priceScheduleId}:deactivate`                       Pricing           COMMAND           Deactivate schedule where allowed      Idempotency

  API-PRI-008    GET        `/api/v1/pricing/items/{itemId}/current`                                       Pricing           QUERY             Get current store price snapshot       ---

  API-SUP-001    GET        `/api/v1/suppliers`                                                            Procurement       QUERY             Search/list suppliers                  ---

  API-SUP-002    POST       `/api/v1/suppliers`                                                            Procurement       COMMAND           Create supplier                        Idempotency

  API-SUP-003    GET        `/api/v1/suppliers/{supplierId}`                                               Procurement       QUERY             Get supplier                           ---

  API-SUP-004    PATCH      `/api/v1/suppliers/{supplierId}`                                               Procurement       COMMAND           Update supplier                        Idempotency, If-Match

  API-SUP-005    POST       `/api/v1/suppliers/{supplierId}:activate`                                      Procurement       COMMAND           Activate supplier                      Idempotency

  API-SUP-006    POST       `/api/v1/suppliers/{supplierId}:deactivate`                                    Procurement       COMMAND           Deactivate supplier without deleting   Idempotency
                                                                                                                                               history                                

  API-SUP-007    GET        `/api/v1/suppliers/{supplierId}/items`                                         Procurement       QUERY             List supplier-item associations        ---

  API-SUP-008    PUT        `/api/v1/suppliers/{supplierId}/items/{itemId}`                                Procurement       COMMAND           Create/update supplier-item            Idempotency
                                                                                                                                               association                            

  API-SUP-009    DELETE     `/api/v1/suppliers/{supplierId}/items/{itemId}`                                Procurement       COMMAND           Remove supplier-item association where Idempotency
                                                                                                                                               allowed                                

  API-PUR-001    GET        `/api/v1/procurement/purchase-orders`                                          Procurement       QUERY             Search/list purchase orders            ---

  API-PUR-002    POST       `/api/v1/procurement/purchase-orders`                                          Procurement       COMMAND           Create purchase-order draft            Idempotency

  API-PUR-003    GET        `/api/v1/procurement/purchase-orders/{purchaseOrderId}`                        Procurement       QUERY             Get purchase order                     ---

  API-PUR-004    PATCH      `/api/v1/procurement/purchase-orders/{purchaseOrderId}`                        Procurement       COMMAND           Update mutable purchase-order draft    Idempotency, If-Match

  API-PUR-005    POST       `/api/v1/procurement/purchase-orders/{purchaseOrderId}:transition`             Procurement       COMMAND           Request server-advertised allowed PO   Idempotency
                                                                                                                                               transition                             

  API-PUR-006    GET        `/api/v1/procurement/goods-receipts`                                           Procurement       QUERY             Search/list goods receipts             ---

  API-PUR-007    POST       `/api/v1/procurement/goods-receipts`                                           Procurement       COMMAND           Create GRN draft with optional PO      Idempotency
                                                                                                                                               source                                 

  API-PUR-008    GET        `/api/v1/procurement/goods-receipts/{goodsReceiptId}`                          Procurement       QUERY             Get GRN                                ---

  API-PUR-009    PATCH      `/api/v1/procurement/goods-receipts/{goodsReceiptId}`                          Procurement       COMMAND           Update mutable GRN draft               Idempotency, If-Match

  API-PUR-010    POST       `/api/v1/procurement/goods-receipts/{goodsReceiptId}:post`                     Procurement       POSTING_COMMAND   Post PO-linked or direct GRN through   Idempotency,
                                                                                                                                               policy-selected envelope               GoodsReceiptPostingCoordinator

  API-PUR-011    GET        `/api/v1/procurement/purchase-returns`                                         Procurement       QUERY             Search/list purchase returns           ---

  API-PUR-012    POST       `/api/v1/procurement/purchase-returns`                                         Procurement       COMMAND           Create purchase-return draft           Idempotency

  API-PUR-013    GET        `/api/v1/procurement/purchase-returns/{purchaseReturnId}`                      Procurement       QUERY             Get purchase return                    ---

  API-PUR-014    PATCH      `/api/v1/procurement/purchase-returns/{purchaseReturnId}`                      Procurement       COMMAND           Update mutable purchase-return draft   Idempotency, If-Match

  API-PUR-015    POST       `/api/v1/procurement/purchase-returns/{purchaseReturnId}:post`                 Procurement       POSTING_COMMAND   Post purchase return atomically        Idempotency,
                                                                                                                                                                                      PurchaseReturnPostingCoordinator

  API-INV-001    GET        `/api/v1/inventory/positions`                                                  Inventory         QUERY             Search current Item×Store inventory    ---
                                                                                                                                               positions                              

  API-INV-002    GET        `/api/v1/inventory/positions/{itemId}`                                         Inventory         QUERY             Get current inventory position for     ---
                                                                                                                                               current Store                          

  API-INV-003    GET        `/api/v1/inventory/movements`                                                  Inventory         QUERY             Search immutable stock movements       ---

  API-INV-004    GET        `/api/v1/inventory/availability/{itemId}`                                      Inventory         QUERY             Get policy-neutral sale availability   ---
                                                                                                                                               snapshot                               

  API-INV-005    GET        `/api/v1/inventory/stock-counts`                                               Inventory         QUERY             Search/list stock counts               ---

  API-INV-006    POST       `/api/v1/inventory/stock-counts`                                               Inventory         COMMAND           Create stock-count session             Idempotency

  API-INV-007    GET        `/api/v1/inventory/stock-counts/{stockCountId}`                                Inventory         QUERY             Get stock count                        ---

  API-INV-008    PATCH      `/api/v1/inventory/stock-counts/{stockCountId}`                                Inventory         COMMAND           Update count observations while        Idempotency, If-Match
                                                                                                                                               mutable                                

  API-INV-009    POST       `/api/v1/inventory/stock-counts/{stockCountId}:post`                           Inventory         POSTING_COMMAND   Complete stock count through explicit  Idempotency,
                                                                                                                                               adjustment movements                   StockCountPostingCoordinator

  API-INV-010    POST       `/api/v1/inventory/adjustments`                                                Inventory         COMMAND           Create controlled manual               Idempotency
                                                                                                                                               inventory-adjustment draft             

  API-POS-001    POST       `/api/v1/sales`                                                                Sales             COMMAND           Start new sale draft                   Idempotency

  API-POS-002    GET        `/api/v1/sales/{saleId}`                                                       Sales             QUERY             Get sale/held/recovery state           ---

  API-POS-003    GET        `/api/v1/sales`                                                                Sales             QUERY             Search sales and held sales            ---

  API-POS-004    POST       `/api/v1/sales/{saleId}/lines`                                                 Sales             COMMAND           Add sale line                          Idempotency

  API-POS-005    PATCH      `/api/v1/sales/{saleId}/lines/{saleLineId}`                                    Sales             COMMAND           Change mutable sale-line fields        Idempotency, If-Match

  API-POS-006    DELETE     `/api/v1/sales/{saleId}/lines/{saleLineId}`                                    Sales             COMMAND           Remove unposted line                   Idempotency

  API-POS-007    PATCH      `/api/v1/sales/{saleId}/customer`                                              Sales             COMMAND           Attach/change/remove customer before   Idempotency, If-Match
                                                                                                                                               posting                                

  API-POS-008    POST       `/api/v1/sales/{saleId}:hold`                                                  Sales             COMMAND           Hold active unposted sale              Idempotency

  API-POS-009    POST       `/api/v1/sales/{saleId}:retrieve`                                              Sales             COMMAND           Claim/retrieve held sale               Idempotency

  API-POS-010    POST       `/api/v1/sales/{saleId}:abandon`                                               Sales             COMMAND           Abandon/void unposted sale             Idempotency

  API-POS-011    POST       `/api/v1/sales/{saleId}:begin-payment`                                         Sales             COMMAND           Freeze validated commercial state and  Idempotency
                                                                                                                                               create/resolve checkout payment        

  API-POS-012    POST       `/api/v1/sales/{saleId}:post`                                                  Sales             POSTING_COMMAND   Atomically post Sale and required      Idempotency, SalePostingCoordinator
                                                                                                                                               local effects                          

  API-POS-013    GET        `/api/v1/sales/{saleId}/receipt`                                               Sales             QUERY             Build receipt model from posted sale   ---
                                                                                                                                               data                                   

  API-POS-014    POST       `/api/v1/sales/{saleId}/receipt:mark-print-attempt`                            Sales             COMMAND           Record print/reprint audit evidence    Idempotency
                                                                                                                                               without changing sale                  

  API-PAY-001    GET        `/api/v1/checkout-payments/{checkoutPaymentId}`                                Payments          QUERY             Get checkout payment and remaining due ---

  API-PAY-002    POST       `/api/v1/checkout-payments/{checkoutPaymentId}/cash-components`                Payments          COMMAND           Add/confirm local cash component       Idempotency

  API-PAY-003    POST       `/api/v1/checkout-payments/{checkoutPaymentId}/manual-confirmations`           Payments          COMMAND           Record authorized provider-neutral     Idempotency
                                                                                                                                               manual/external success                

  API-PAY-004    POST       `/api/v1/checkout-payments/{checkoutPaymentId}/attempts`                       Payments          COMMAND           Start provider-neutral integrated      Idempotency
                                                                                                                                               payment attempt                        

  API-PAY-005    GET        `/api/v1/payment-attempts/{paymentAttemptId}`                                  Payments          QUERY             Get payment attempt state              ---

  API-PAY-006    POST       `/api/v1/payment-attempts/{paymentAttemptId}:reconcile`                        Payments          COMMAND           Reconcile original provider request    Idempotency
                                                                                                                                               identity                               

  API-PAY-007    POST       `/api/v1/checkout-payments/{checkoutPaymentId}:cancel-uncommitted`             Payments          COMMAND           Cancel safely uncommitted payment      Idempotency
                                                                                                                                               components                             

  API-PAY-008    GET        `/api/v1/payment-commitments/{paymentCommitmentId}`                            Payments          QUERY             Get durable confirmed pre-posting      ---
                                                                                                                                               commitment                             

  API-PAY-009    GET        `/api/v1/posted-tenders`                                                       Payments          QUERY             Search immutable posted tenders        ---

  API-PAY-010    GET        `/api/v1/refund-executions/{refundExecutionId}`                                Payments          QUERY             Get refund execution/recovery state    ---

  API-PAY-011    POST       `/api/v1/refund-obligations/{refundObligationId}/executions`                   Payments          COMMAND           Start provider-neutral refund          Idempotency
                                                                                                                                               execution                              

  API-PAY-012    POST       `/api/v1/refund-executions/{refundExecutionId}:reconcile`                      Payments          COMMAND           Reconcile uncertain/pending refund     Idempotency
                                                                                                                                               outcome                                

  API-PAY-013    POST       `/api/v1/refund-executions/{refundExecutionId}:settle`                         Payments          POSTING_COMMAND   Apply confirmed/manual refund          Idempotency, RefundSettlementCoordinator
                                                                                                                                               execution to obligation once           

  API-RET-001    GET        `/api/v1/returns`                                                              Returns           QUERY             Search/list sales returns              ---

  API-RET-002    POST       `/api/v1/returns`                                                              Returns           COMMAND           Create return draft                    Idempotency

  API-RET-003    GET        `/api/v1/returns/{salesReturnId}`                                              Returns           QUERY             Get return and refund-obligation state ---

  API-RET-004    PATCH      `/api/v1/returns/{salesReturnId}`                                              Returns           COMMAND           Update mutable return draft            Idempotency, If-Match

  API-RET-005    POST       `/api/v1/returns/{salesReturnId}:preview`                                      Returns           QUERY             Recalculate                            ---
                                                                                                                                               eligibility/value/disposition/refund   
                                                                                                                                               plan                                   

  API-RET-006    POST       `/api/v1/returns/{salesReturnId}:post`                                         Returns           POSTING_COMMAND   Post Return + stock disposition +      Idempotency,
                                                                                                                                               Refund Obligation/immediate settlement SalesReturnPostingCoordinator

  API-RET-007    GET        `/api/v1/refund-obligations/{refundObligationId}`                              Returns           QUERY             Get outstanding refund obligation      ---

  API-RET-008    GET        `/api/v1/sales/{saleId}/return-eligibility`                                    Returns           QUERY             Get current remaining return           ---
                                                                                                                                               eligibility snapshot                   

  API-CUS-001    GET        `/api/v1/customers`                                                            Customer & Credit QUERY             Search/list customers                  ---

  API-CUS-002    POST       `/api/v1/customers`                                                            Customer & Credit COMMAND           Create customer                        Idempotency

  API-CUS-003    GET        `/api/v1/customers/{customerId}`                                               Customer & Credit QUERY             Get customer                           ---

  API-CUS-004    PATCH      `/api/v1/customers/{customerId}`                                               Customer & Credit COMMAND           Update customer with conflict-aware    Idempotency, If-Match
                                                                                                                                               version check                          

  API-CUS-005    POST       `/api/v1/customers/{customerId}:activate`                                      Customer & Credit COMMAND           Activate customer                      Idempotency

  API-CUS-006    POST       `/api/v1/customers/{customerId}:deactivate`                                    Customer & Credit COMMAND           Deactivate customer without deleting   Idempotency
                                                                                                                                               history                                

  API-CRD-001    GET        `/api/v1/credit/accounts/{customerId}`                                         Customer & Credit QUERY             Get authoritative local credit         ---
                                                                                                                                               account/exposure                       

  API-CRD-002    POST       `/api/v1/credit/accounts/{customerId}:evaluate`                                Customer & Credit QUERY             Evaluate requested credit use          ---

  API-CRD-003    PATCH      `/api/v1/credit/accounts/{customerId}`                                         Customer & Credit COMMAND           Update credit terms/status subject to  Idempotency, If-Match
                                                                                                                                               policy                                 

  API-CRD-004    GET        `/api/v1/credit/accounts/{customerId}/ledger`                                  Customer & Credit QUERY             Search immutable credit ledger entries ---

  API-CRD-005    GET        `/api/v1/customer-collections`                                                 Customer & Credit QUERY             Search customer collections            ---

  API-CRD-006    POST       `/api/v1/customer-collections`                                                 Customer & Credit COMMAND           Create customer collection draft       Idempotency

  API-CRD-007    GET        `/api/v1/customer-collections/{collectionId}`                                  Customer & Credit QUERY             Get customer collection                ---

  API-CRD-008    POST       `/api/v1/customer-collections/{collectionId}:post`                             Customer & Credit POSTING_COMMAND   Post collection + credit ledger +      Idempotency,
                                                                                                                                               cash/financial effect                  CustomerCollectionPostingCoordinator

  API-CSH-001    GET        `/api/v1/cash/shifts/current`                                                  Cash & Business   QUERY             Get current eligible shift             ---
                                                                                                           Day                                                                        

  API-CSH-002    GET        `/api/v1/cash/shifts`                                                          Cash & Business   QUERY             Search shifts                          ---
                                                                                                           Day                                                                        

  API-CSH-003    POST       `/api/v1/cash/shifts`                                                          Cash & Business   COMMAND           Open cashier shift                     Idempotency
                                                                                                           Day                                                                        

  API-CSH-004    POST       `/api/v1/cash/shifts/{shiftId}:close`                                          Cash & Business   COMMAND           Close shift with declared cash/tender  Idempotency
                                                                                                           Day                                 summary                                

  API-CSH-005    GET        `/api/v1/cash/shifts/{shiftId}/movements`                                      Cash & Business   QUERY             Search immutable cash movements        ---
                                                                                                           Day                                                                        

  API-CSH-006    POST       `/api/v1/cash/shifts/{shiftId}/cash-in`                                        Cash & Business   POSTING_COMMAND   Post manual cash-in                    Idempotency, ManualCashInCoordinator
                                                                                                           Day                                                                        

  API-CSH-007    POST       `/api/v1/cash/shifts/{shiftId}/cash-out`                                       Cash & Business   POSTING_COMMAND   Post manual cash-out                   Idempotency, ManualCashOutCoordinator
                                                                                                           Day                                                                        

  API-CSH-008    GET        `/api/v1/business-days/current`                                                Cash & Business   QUERY             Get current BusinessDate and           ---
                                                                                                           Day                                 BusinessDay state                      

  API-CSH-009    GET        `/api/v1/business-days`                                                        Cash & Business   QUERY             Search business days                   ---
                                                                                                           Day                                                                        

  API-CSH-010    POST       `/api/v1/business-days/{businessDayId}:transition`                             Cash & Business   COMMAND           Request server-advertised business-day Idempotency
                                                                                                           Day                                 transition                             

  API-ACC-001    GET        `/api/v1/accounting/supplier-payables`                                         Accounting-Lite   QUERY             Search supplier payables               ---

  API-ACC-002    GET        `/api/v1/accounting/supplier-payables/{supplierPayableId}`                     Accounting-Lite   QUERY             Get supplier payable and allocation    ---
                                                                                                                                               state                                  

  API-ACC-003    GET        `/api/v1/accounting/supplier-payments`                                         Accounting-Lite   QUERY             Search supplier payments               ---

  API-ACC-004    POST       `/api/v1/accounting/supplier-payments`                                         Accounting-Lite   COMMAND           Create supplier payment draft          Idempotency

  API-ACC-005    GET        `/api/v1/accounting/supplier-payments/{supplierPaymentId}`                     Accounting-Lite   QUERY             Get supplier payment                   ---

  API-ACC-006    POST       `/api/v1/accounting/supplier-payments/{supplierPaymentId}:post`                Accounting-Lite   POSTING_COMMAND   Post supplier payment + allocations +  Idempotency,
                                                                                                                                               financial movement                     SupplierPaymentPostingCoordinator

  API-ACC-007    GET        `/api/v1/accounting/financial-accounts`                                        Accounting-Lite   QUERY             List/search financial accounts         ---

  API-ACC-008    POST       `/api/v1/accounting/financial-accounts`                                        Accounting-Lite   COMMAND           Create financial account master        Idempotency

  API-ACC-009    PATCH      `/api/v1/accounting/financial-accounts/{financialAccountId}`                   Accounting-Lite   COMMAND           Update financial account master        Idempotency, If-Match

  API-ACC-010    GET        `/api/v1/accounting/financial-movements`                                       Accounting-Lite   QUERY             Search immutable financial movements   ---

  API-ACC-011    POST       `/api/v1/accounting/financial-transactions`                                    Accounting-Lite   COMMAND           Create generic receipt/payment draft   Idempotency

  API-ACC-012    POST       `/api/v1/accounting/financial-transactions/{financialTransactionId}:post`      Accounting-Lite   POSTING_COMMAND   Post generic financial receipt/payment Idempotency,
                                                                                                                                                                                      FinancialTransactionPostingCoordinator

  API-ACC-013    POST       `/api/v1/accounting/transfers`                                                 Accounting-Lite   COMMAND           Create account transfer draft          Idempotency

  API-ACC-014    POST       `/api/v1/accounting/transfers/{accountTransferId}:post`                        Accounting-Lite   POSTING_COMMAND   Post balanced account transfer         Idempotency,
                                                                                                                                                                                      AccountTransferPostingCoordinator

  API-ACC-015    GET        `/api/v1/accounting/expense-categories`                                        Accounting-Lite   QUERY             List/search expense categories         ---

  API-ACC-016    POST       `/api/v1/accounting/expense-categories`                                        Accounting-Lite   COMMAND           Create expense category                Idempotency

  API-ACC-017    PATCH      `/api/v1/accounting/expense-categories/{expenseCategoryId}`                    Accounting-Lite   COMMAND           Update expense category                Idempotency, If-Match

  API-ACC-018    GET        `/api/v1/accounting/expenses`                                                  Accounting-Lite   QUERY             Search expenses                        ---

  API-ACC-019    POST       `/api/v1/accounting/expenses`                                                  Accounting-Lite   COMMAND           Create expense draft                   Idempotency

  API-ACC-020    POST       `/api/v1/accounting/expenses/{expenseId}:post`                                 Accounting-Lite   POSTING_COMMAND   Post expense + financial/drawer effect Idempotency, ExpensePostingCoordinator

  API-ACC-021    GET        `/api/v1/accounting/reconciliations`                                           Accounting-Lite   QUERY             Search reconciliation sessions         ---

  API-ACC-022    POST       `/api/v1/accounting/reconciliations`                                           Accounting-Lite   COMMAND           Create reconciliation session          Idempotency

  API-ACC-023    PATCH      `/api/v1/accounting/reconciliations/{reconciliationId}`                        Accounting-Lite   COMMAND           Update matches/differences while open  Idempotency, If-Match

  API-ACC-024    POST       `/api/v1/accounting/reconciliations/{reconciliationId}:complete`               Accounting-Lite   COMMAND           Complete reconciliation without        Idempotency
                                                                                                                                               rewriting source movements             

  API-RPT-001    GET        `/api/v1/reports/definitions`                                                  Reporting         QUERY             List report definitions and supported  ---
                                                                                                                                               filters/grouping modes                 

  API-RPT-002    POST       `/api/v1/reports/{reportCode}:run`                                             Reporting         QUERY             Run bounded report query               ---

  API-RPT-003    POST       `/api/v1/reports/{reportCode}:export`                                          Reporting         COMMAND           Create report export job               Idempotency

  API-IMP-001    POST       `/api/v1/imports`                                                              Import / Export   COMMAND           Create validated import job from       Idempotency
                                                                                                                                               source token                           

  API-IMP-002    GET        `/api/v1/imports/{importJobId}`                                                Import / Export   QUERY             Get import validation/commit status    ---

  API-IMP-003    POST       `/api/v1/imports/{importJobId}:validate`                                       Import / Export   COMMAND           Validate import without bypassing      Idempotency
                                                                                                                                               domain rules                           

  API-IMP-004    POST       `/api/v1/imports/{importJobId}:commit`                                         Import / Export   COMMAND           Commit approved import through normal  Idempotency
                                                                                                                                               domain commands                        

  API-IMP-005    GET        `/api/v1/exports/{exportJobId}`                                                Import / Export   QUERY             Get export job/status                  ---

  API-AUD-001    GET        `/api/v1/audit/events`                                                         Audit             QUERY             Permission-controlled search of audit  ---
                                                                                                                                               events                                 

  API-AUD-002    GET        `/api/v1/audit/events/{auditEventId}`                                          Audit             QUERY             Get audit event                        ---

  API-BR-001     GET        `/api/v1/operations/backups/status`                                            Backup / Recovery QUERY             Get backup/restore-test status without ---
                                                                                                                                               inventing RPO/RTO                      

  API-BR-002     POST       `/api/v1/operations/backups:run`                                               Backup / Recovery COMMAND           Request approved local backup          Idempotency
                                                                                                                                               operation                              

  API-BR-003     POST       `/api/v1/operations/restore-tests`                                             Backup / Recovery COMMAND           Start controlled restore-test job      Idempotency

  API-SUPT-001   GET        `/api/v1/support/health-summary`                                               Support /         QUERY             Get allow-listed support health        ---
                                                                                                           Diagnostics                         summary                                

  API-SUPT-002   POST       `/api/v1/support/diagnostic-bundles`                                           Support /         COMMAND           Create approved diagnostic bundle      Idempotency
                                                                                                           Diagnostics                                                                

  API-SUPT-003   GET        `/api/v1/support/sync-summary`                                                 Support /         QUERY             Get outbox/inbox/dead-letter summary   ---
                                                                                                           Diagnostics                                                                

  API-CTRY-001   GET        `/api/v1/country/rule-set`                                                     Country Policy    QUERY             Get active CountryRuleSet descriptor   ---

  API-CTRY-002   GET        `/api/v1/country/capabilities`                                                 Country Policy    QUERY             Get verified country-pack capability   ---
                                                                                                                                               descriptors                            

  API-CTRY-003   POST       `/api/v1/country:validate-document`                                            Country Policy    QUERY             Validate draft document against active ---
                                                                                                                                               versioned country policy               

  API-HW-001     GET        `/api/v1/receipts/{documentType}/{documentId}`                                 Hardware /        QUERY             Get immutable receipt/document render  ---
                                                                                                           Receipt                             model                                  

  API-HW-002     GET        `/api/v1/hardware/requirements`                                                Hardware /        QUERY             Get required hardware capability       ---
                                                                                                           Receipt                             descriptors; no driver control         

  API-IAM-021    POST       `/api/v1/auth/session:lock`                                                    IAM               COMMAND           Lock active user session without       Idempotency
                                                                                                                                               discarding protected work              

  API-IAM-022    POST       `/api/v1/auth/session:unlock`                                                  IAM               COMMAND           Unlock/re-authenticate locked session  Idempotency

  API-IAM-023    POST       `/api/v1/users/{userId}:reset-credential`                                      IAM               COMMAND           Authorized credential reset without    Idempotency
                                                                                                                                               universal password                     

  API-PAY-014    POST       `/api/v1/checkout-payments/{checkoutPaymentId}/credit-components`              Payments          COMMAND           Add customer-credit component subject  Idempotency
                                                                                                                                               to authoritative credit evaluation     

  API-PAY-015    POST       `/api/v1/payment-commitments/{paymentCommitmentId}:reverse`                    Payments          COMMAND           Start approved                         Idempotency
                                                                                                                                               reversal/refund/recovery of a pre-sale 
                                                                                                                                               payment commitment                     

  API-PAY-016    GET        `/api/v1/payment-commitments/{paymentCommitmentId}/recovery`                   Payments          QUERY             Get commitment recovery/reversal       ---
                                                                                                                                               status                                 

  API-CRD-009    POST       `/api/v1/customer-collections/{collectionId}:reverse`                          Customer & Credit POSTING_COMMAND   Post compensating reversal for posted  Idempotency,
                                                                                                                                               customer collection                    CustomerCollectionPostingCoordinator

  API-ACC-025    POST       `/api/v1/accounting/supplier-payments/{supplierPaymentId}:reverse`             Accounting-Lite   POSTING_COMMAND   Post compensating supplier-payment     Idempotency,
                                                                                                                                               reversal                               SupplierPaymentPostingCoordinator

  API-ACC-026    POST       `/api/v1/accounting/financial-transactions/{financialTransactionId}:reverse`   Accounting-Lite   POSTING_COMMAND   Post compensating                      Idempotency,
                                                                                                                                               financial-transaction reversal         FinancialTransactionPostingCoordinator

  API-ACC-027    POST       `/api/v1/accounting/transfers/{accountTransferId}:reverse`                     Accounting-Lite   POSTING_COMMAND   Post compensating account-transfer     Idempotency,
                                                                                                                                               reversal                               AccountTransferPostingCoordinator

  API-ACC-028    POST       `/api/v1/accounting/expenses/{expenseId}:reverse`                              Accounting-Lite   POSTING_COMMAND   Post compensating expense reversal     Idempotency, ExpensePostingCoordinator

  API-INV-011    GET        `/api/v1/inventory/adjustments`                                                Inventory         QUERY             Search manual inventory-adjustment     ---
                                                                                                                                               command history                        

  API-INV-012    GET        `/api/v1/inventory/adjustments/{adjustmentId}`                                 Inventory         QUERY             Get manual inventory-adjustment        ---
                                                                                                                                               command                                

  API-INV-013    PATCH      `/api/v1/inventory/adjustments/{adjustmentId}`                                 Inventory         COMMAND           Update mutable inventory-adjustment    Idempotency, If-Match
                                                                                                                                               command                                

  API-INV-014    POST       `/api/v1/inventory/adjustments/{adjustmentId}:post`                            Inventory         COMMAND           Post adjustment as immutable           Idempotency
                                                                                                                                               StockMovement under Inventory module   
                                                                                                                                               UoW                                    

  API-INV-015    POST       `/api/v1/inventory/adjustments/{adjustmentId}:correct`                         Inventory         COMMAND           Post compensating correction movement  Idempotency
                                                                                                                                               for a posted adjustment                

  API-IMP-006    GET        `/api/v1/imports/templates`                                                    Import / Export   QUERY             List supported import                  ---
                                                                                                                                               templates/formats and required columns 

  API-IMP-007    POST       `/api/v1/imports/sources`                                                      Import / Export   COMMAND           Register local import source artifact  Idempotency
                                                                                                                                               and checksum                           

  API-IMP-008    POST       `/api/v1/imports/{importJobId}:cancel`                                         Import / Export   COMMAND           Safely cancel import at an allowed     Idempotency
                                                                                                                                               boundary                               

  API-IMP-009    GET        `/api/v1/imports/{importJobId}/errors`                                         Import / Export   QUERY             Get bounded validation/error artifact  ---

  API-IMP-010    GET        `/api/v1/exports/{exportJobId}/artifact`                                       Import / Export   QUERY             Get export artifact                    ---
                                                                                                                                               descriptor/download handle             

  API-SYS-007    POST       `/api/v1/operations/{operationJobId}:cancel`                                   System            COMMAND           Request safe cancellation where job    Idempotency
                                                                                                                                               type supports it                       

  API-SYS-008    GET        `/api/v1/operations/{operationJobId}`                                          System            QUERY             Get long-running operation job         ---
                                                                                                                                               status/result                          

  API-ACC-029    GET        `/api/v1/accounting/financial-transactions`                                    Accounting-Lite   QUERY             Search generic financial               ---
                                                                                                                                               receipt/payment transactions           

  API-ACC-030    GET        `/api/v1/accounting/financial-transactions/{financialTransactionId}`           Accounting-Lite   QUERY             Get financial transaction and source   ---
                                                                                                                                               linkage                                

  API-ACC-031    GET        `/api/v1/accounting/transfers`                                                 Accounting-Lite   QUERY             Search account transfers               ---

  API-ACC-032    GET        `/api/v1/accounting/transfers/{accountTransferId}`                             Accounting-Lite   QUERY             Get account transfer and source        ---
                                                                                                                                               linkage                                

  API-ACC-033    GET        `/api/v1/accounting/expenses/{expenseId}`                                      Accounting-Lite   QUERY             Get expense and source linkage         ---
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


## v0.4 addition
- `API-IMP-013 DELETE /api/v1/artifacts/{artifactId}` — abort/remove unconsumed import artifact.
