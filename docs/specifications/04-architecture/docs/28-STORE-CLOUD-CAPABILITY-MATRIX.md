# Store / Cloud Capability Matrix

  -------------------------------------------------------------------------
  Capability                Store mode           Cloud mode
  ------------------------- -------------------- --------------------------
  Sale Posting coordinator  ENABLED              DISABLED

  GRN/Purchase Return       ENABLED              DISABLED as Store
  posting                                        transaction authority

  Sales Return / Refund     ENABLED              DISABLED as Store
  settlement against Store                       transaction authority
  facts                                          

  Stock Count posting       ENABLED              DISABLED

  Cash shift/business-day   ENABLED              DISABLED
  posting                                        

  Store Accounting-Lite     ENABLED              DISABLED as Store
  posting                                        authority

  Local PostgreSQL          ENABLED              separate cloud
  transactional                                  repositories/projections
  repositories                                   

  Outbox publish            ENABLED              ENABLED for cloud-owned
                                                 messages

  Inbox apply               ENABLED              ENABLED

  Store fact                local source         ENABLED
  ingestion/projection                           

  Cross-store               limited operational  ENABLED
  reporting/aggregation                          

  Approved configuration    consume/apply by     ENABLED
  distribution              ownership            

  Country-pack              consume/activate     ENABLED
  validation/distribution   compatible version   

  Store checkout API        ENABLED              NOT REGISTERED
  -------------------------------------------------------------------------

The cloud composition root physically omits Store Posting command
handlers/coordinators. Reusing module code does not grant cloud
authority to post Store transactions.
