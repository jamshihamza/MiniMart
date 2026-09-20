# MiniMart Functional Decision Register --- v0.6

**Document ID:** MM-DEC-001\
**Purpose:** Prevent unresolved business rules from being silently
invented during domain/data/API/UI design or AI-assisted implementation.

  ---------------------------------------------------------------------------------------------------------
  ID            Decision            Current status       Proposed direction            Must be resolved
                                                                                       before
  ------------- ------------------- -------------------- ----------------------------- --------------------
  DEC-PUR-001   Is Purchase Order   Proposed             PO optional                   Purchasing v1.0
                mandatory?                                                             

  DEC-PUR-002   Is direct GRN       Proposed             Yes, unless store policy      Purchasing v1.0
                allowed?                                 requires PO                   

  DEC-PUR-003   Duplicate supplier  Proposed             Block by default; authorized  GRN implementation
                invoice/reference                        exception may be allowed      

  DEC-PUR-004   Supplier free       Open                 Evaluate within selected      Costing/domain
                quantity costing                         costing method                baseline

  DEC-PUR-005   Purchase            Open                 Define deterministic          Costing/domain
                document-level                           allocation                    baseline
                discount allocation                                                    

  DEC-PUR-006   Purchase tax        Country/accounting   Country pack + accounting     Country/accounting
                treatment           dependent            validation                    baseline

  DEC-PUR-007   Over-receipt policy Proposed             Block / warn / approval       GRN implementation
                                    configurable                                       

  DEC-PUR-008   PO approval         Open                 Configurable                  PO implementation
                required by                                                            
                default?                                                               

  DEC-INV-001   Initial inventory   Open                 **Weighted average proposed** Domain Model costing
                costing method                                                         baseline

  DEC-INV-002   Negative stock      Open                 Configurable:                 POS/Inventory
                default                                  allow/warn/approval/block     implementation

  DEC-INV-003   Stock-count         Open                 Evaluate scope lock vs        Count implementation
                concurrency                              snapshot+movement             
                                                         reconciliation                

  DEC-INV-004   Batch physical      Open                 Define before batch-aware POS POS Batch 3
                depletion policy                                                       

  DEC-INV-005   Expiry/FEFO         Open                 FEFO candidate; not approved  POS Batch 3
                behaviour                                                              

  DEC-INV-006   Negative-stock      Open                 Must follow approved costing  Costing baseline
                costing                                  method                        

  DEC-INV-007   Low-stock/reorder   Open                 Item/store-level candidate    Inventory UI/domain
                threshold ownership                                                    

  DEC-INV-008   Opening stock       Proposed             Controlled posting with       Inventory
                process                                  audit, not direct edit        implementation

  DEC-INV-009   Inventory valuation Proposed             Phase 2                       Reporting FRS
                report phase                                                           

  DEC-COM-001   Business-date       Open                 Coordinate with shift/day     Batch 4
                rollover                                 close                         

  DEC-COM-002   Human document      Open                 Company/store/document-type   Domain/API baseline
                numbering scope                          rules to evaluate             
  ---------------------------------------------------------------------------------------------------------

## Decision rules

1.  `Open` decisions are not permission for an implementation agent to
    choose behaviour.
2.  A `Proposed` decision may be used for design discussion but is not
    frozen until approved.
3.  When approved, record date, rationale, affected requirements and
    ADR/domain-rule follow-up.
4.  Country/legal/accounting decisions requiring external validation
    must not be approved solely from an AI-generated assumption.

## Batch 3 decision additions

  ----------------------------------------------------------------------------------------------------------
  ID            Decision                      Current status       Proposed direction      Must be resolved
                                                                                           before
  ------------- ----------------------------- -------------------- ----------------------- -----------------
  DEC-POS-001   Price behavior when held sale Open                 Revalidate and show     POS
                is retrieved after price                           variance; exact         implementation
                change                                             retain/reprice policy   
                                                                   to approve              

  DEC-POS-002   Active-sale price change      Open                 Preserve selected line  POS
                after line added                                   price unless explicit   implementation
                                                                   reprice event; review   

  DEC-POS-003   Sale of expired stock         Open                 Block by default;       Batch-aware POS
                                                                   authorized exception    
                                                                   only if                 
                                                                   legally/operationally   
                                                                   valid                   

  DEC-POS-004   Store Node survival mode      Open by phase        Phase 1 block safely;   Survival-mode
                                                                   later SQLite survival   implementation
                                                                   mode per architecture   

  DEC-PAY-001   Phase-1 card model            Proposed             External terminal +     POS Phase 1
                                                                   explicit manual         
                                                                   confirmation            

  DEC-PAY-002   Phase-1 QR model              Proposed             External/manual         POS Phase 1
                                                                   confirmation where      
                                                                   applicable              

  DEC-PAY-003   Cash rounding in mixed/split  Country dependent    Define in each country  Country/payment
                tender                                             pack from verified      baseline
                                                                   rules                   

  DEC-PAY-004   Tender surcharge/fee          Country/legal        Do not implement until  Any surcharge
                                              dependent            explicitly              feature
                                                                   verified/approved       

  DEC-PAY-005   Partially-paid sale           Open                 Preserve committed      Payment
                recovery/void policy                               tender; explicit        implementation
                                                                   refund/recovery, never  
                                                                   ordinary abandon        

  DEC-PAY-006   Direct payment providers      Open/Later           Provider adapters       Phase 3
                                                                   behind                  integration
                                                                   provider-independent    
                                                                   tender contract         

  DEC-RET-001   No-receipt/no-original-sale   Open                 Configurable,           Return
                return                                             manager-controlled      implementation
                                                                   exceptional workflow    

  DEC-RET-002   Return stock disposition set  Proposed             Sellable /              Return
                                                                   damaged-quarantine /    implementation
                                                                   other policy-defined    

  DEC-RET-003   Mixed-tender refund           Open                 Prefer original tender  Split-tender
                allocation                                         where possible; exact   refund
                                                                   allocation to approve   

  DEC-RET-004   Refund method substitution    Open                 Restrict by             Return
                                                                   policy/approval; do not implementation
                                                                   freely convert          
                                                                   electronic tender to    
                                                                   cash                    

  DEC-RET-005   Return accepted but           Open                 Explicit refund-pending Integrated
                electronic refund unresolved                       exception state         refunds

  DEC-RET-006   Original tax/discount         Country/accounting   Country pack +          Country return
                reversal rules                dependent            accounting validation   baseline
  ----------------------------------------------------------------------------------------------------------

## Batch 4 decision additions

  ---------------------------------------------------------------------------------------------
  ID            Decision                  Current     Proposed direction      Must be resolved
                                          status                              before
  ------------- ------------------------- ----------- ----------------------- -----------------
  DEC-CUS-001   Customer identity scope   Proposed    Company-wide customer   Domain Model
                                                      identity with           
                                                      controlled store access 

  DEC-CUS-002   Customer                  Open /      Define with             Production
                retention/anonymization   legal       country/accounting      privacy baseline
                                          dependent   retention requirements  

  DEC-CUS-003   Customer duplicate merge  Later       No implicit merge in    Merge feature
                                                      initial release         

  DEC-CRD-001   Credit-limit default      Open        Support BLOCK or        Credit
                behavior                              manager-approval        implementation
                                                      policy; choose business 
                                                      default                 

  DEC-CRD-002   Automatic collection      Open        Evaluate                Credit
                allocation                            oldest-due-first vs     implementation
                                                      manual allocation       

  DEC-CRD-003   Customer                  Open        Explicit                Collections
                overpayment/advance                   advance/block/refund    implementation
                                                      policy required         

  DEC-CRD-004   Suspended-credit override Open        High-control or         Credit
                                                      blocked; requires       implementation
                                                      approval decision       

  DEC-CRD-005   Held-sale credit          Open        Decide whether held     POS/Credit
                reservation                           credit-intended sale    integration
                                                      reserves exposure       

  DEC-CRD-006   Multi-branch offline      Open /      Define                  Multi-branch
                credit exposure           Phase 3     stale-central-balance   credit
                                                      risk policy             

  DEC-CSH-001   Business-date rollover    Open        Explicit store          Shift/Day-close
                                                      business-day rollover,  implementation
                                                      not automatic midnight  
                                                      assumption              

  DEC-CSH-002   Open shift at day close   Open        Block by default;       Day-close
                                                      controlled exception    implementation
                                                      only if approved        

  DEC-CSH-003   Late transaction after    Open        Explicit next-day       Day-close
                day close                             adjustment/recovery     implementation
                                                      policy                  

  DEC-CSH-004   Reopen closed business    Open        Prefer no casual        Day-close
                day                                   reopen; define          implementation
                                                      exceptional controlled  
                                                      process if needed       

  DEC-CSH-005   Simultaneous active       Open        One accountable active  Shift
                shifts per counter/drawer             shift per               implementation
                                                      drawer/counter          
                                                      candidate               

  DEC-RPT-001   Historical vs current     Open by     Financial history       Reporting
                master grouping           report      should preserve posted  implementation
                                                      meaning; operational    
                                                      regrouping may use      
                                                      current master only     
                                                      when clearly labelled   

  DEC-RPT-002   Phase-2 report baseline   Proposed    Daily sales, tender,    Reporting v1.0
                                                      returns, stock,         
                                                      purchase, customer      
                                                      outstanding, shift/day  
                                                      close, exceptions       
  ---------------------------------------------------------------------------------------------

## Batch 5 decision additions

  -----------------------------------------------------------------------------------------------
  ID             Decision              Current status Proposed direction       Must be resolved
                                                                               before
  -------------- --------------------- -------------- ------------------------ ------------------
  DEC-IMP-001    Master import commit  Proposed       Preview + valid-row mode Import v1.0
                 mode                                 for master data; atomic  
                                                      for business documents   

  DEC-IMP-002    Source-file retention Open           Retain                   Production import
                                                      metadata/hash/errors;    
                                                      retain original file     
                                                      only by explicit policy  

  DEC-IMP-003    Opening-stock         Open           Controlled               Store go-live
                 migration window                     setup/migration          
                                                      workflow, disabled after 
                                                      go-live unless approved  

  DEC-AUD-001    Audit retention       Open / legal   Country/deployment       Production
                 period                dependent      retention policy; no     baseline
                                                      ordinary deletion        

  DEC-AUD-002    Audit tamper-evidence Open           Evaluate append-only DB  Security hardening
                 mechanism                            controls plus integrity  
                                                      monitoring               

  DEC-HW-001     Supported printer     Open           Validate target          Hardware baseline
                 command/interface                    ESC/POS-compatible       
                 baseline                             models during Phase 0    
                                                      spike                    

  DEC-HW-002     Scale manual-entry    Open           Permissioned fallback    Scale integration
                 fallback                             only if business process 
                                                      approves                 

  DEC-HW-003     Customer display      Open           Select supported         Hardware baseline
                 interface baseline                   USB/serial/display       
                                                      profiles from target     
                                                      hardware                 

  DEC-BR-001     Store backup          Open           Set from measured        Production
                 frequency/RPO                        business tolerance       deployment
                                                      before production        

  DEC-BR-002     Store recovery RTO    Open           Set and test before      Production
                                                      production               deployment

  DEC-BR-003     Backup                Open           Multiple recovery        Production
                 retention/rotation                   points + off-device      deployment
                                                      copy; exact periods to   
                                                      approve                  

  DEC-BR-004     Offsite backup        Open           Provider-independent     Cloud/operations
                 provider                             requirement; select      setup
                                                      during infrastructure    
                                                      design                   

  DEC-SUPT-001   Remote support        Open           Time-limited,            Remote support
                 technology/provider                  identity-based, audited  rollout
                                                      access; no universal     
                                                      credential               

  DEC-SUPT-002   Operational log       Open           Bounded configurable     Production support
                 retention                            retention with privacy   
                                                      controls                 

  DEC-SUPT-003   Diagnostic bundle     Proposed       Health/config metadata + Support v1.0
                 default contents                     bounded logs;            
                                                      business/PII data        
                                                      excluded by default      

  DEC-CTRY-001   Country-pack          Proposed       Country fixed at store   Country v1.0
                 activation/change                    go-live; later change    
                 after trading                        requires migration       
                                                      process                  

  DEC-CTRY-002   Malaysia compliance   Verification   Create dated             Malaysia
                 baseline              required       official-source          compliance release
                                                      compliance specification 
                                                      before implementation    

  DEC-CTRY-003   India compliance      Verification   Create dated             India Phase 4
                 baseline              required       official-source          
                                                      compliance specification 
                                                      before implementation    

  DEC-CTRY-004   Country-rule          Open           Version/effective-date   Domain/Data model
                 effective/version                    rules without rewriting  
                 model                                posted history           
  -----------------------------------------------------------------------------------------------

## v0.8 freeze-blocker resolution overlay

This section is authoritative where it conflicts with an older
open/proposed status above. These are **MiniMart v0.8 working baselines
for freeze remediation** and are subject to final v1.0 freeze review,
not silent implementation-agent choice.

  -----------------------------------------------------------------------
  Decision / topic                    v0.8 resolution
  ----------------------------------- -----------------------------------
  `DEC-INV-001` Initial inventory     **Resolved baseline:** moving
  costing                             weighted-average cost per Item per
                                      Store.

  `DEC-PUR-004` Supplier free         **Resolved baseline:** free
  quantity                            quantity adds quantity; approved
                                      net acquisition value is spread
                                      across total accepted quantity
                                      including free quantity.

  `DEC-PUR-005` Purchase document     **Resolved baseline:** line
  discount                            discount and deterministic
                                      allocated document discount reduce
                                      acquisition value.

  `DEC-PUR-006` Purchase tax          **Partially resolved:** recoverable
  treatment                           tax excluded from acquisition cost;
                                      non-recoverable directly
                                      attributable tax capitalized.
                                      Classification remains
                                      country/accounting-rule input.

  `DEC-INV-006` Negative-stock        **Resolved for initial baseline:**
  costing                             Phase-1 negative stock is blocked;
                                      any later negative-stock valuation
                                      requires a separate approved
                                      extension.

  `DEC-PAY-005` Partially-paid        **Resolved baseline:** Payment
  recovery                            Attempt/Commitment is distinct from
                                      posted Tender; confirmed money must
                                      complete into a Sale or be
                                      explicitly reversed/refunded.

  `DEC-RET-005` Return accepted /     **Resolved baseline:** posted
  refund unresolved                   Return may own an outstanding
                                      Refund Obligation; refund
                                      settlement is a separate
                                      recoverable lifecycle.

  `DEC-CUS-001` Customer identity     **Resolved baseline:**
  scope                               company/tenant-wide Customer
                                      identity.

  Item master ownership               **New resolved baseline:**
                                      company/tenant-wide Item identity;
                                      store-scoped
                                      assortment/stock/cost/price
                                      assignment.

  Supplier identity scope             **New resolved baseline:**
                                      company/tenant-wide Supplier
                                      identity.

  Phase-1 price scope                 **Resolved baseline:**
                                      selling-price assignment is
                                      store-scoped from the initial
                                      model.

  Phase-1 customer credit             **Resolved baseline:** minimum
                                      operational credit capability is
                                      Phase 1/2; advanced
                                      aging/write-off/multi-branch policy
                                      remains later.

  `DEC-CTRY-004` Country-rule version **Resolved baseline:**
  model                               version/effective country-rule
                                      identity plus immutable
                                      posted-document
                                      country/rule/outcome context.

  Accounting-Lite scope               **Resolved baseline:** operational
                                      supplier liabilities/payments,
                                      customer-receivable linkage,
                                      cash/bank movements, expenses,
                                      reconciliation and accountant
                                      export; no full GL claim.
  -----------------------------------------------------------------------

### Still intentionally open

Provider selection, exact hardware models, current Malaysia/India legal
values, full Phase-3 synchronization algorithm, advanced credit
aging/write-off/interest, remote-support provider and exact production
RPO/RTO values remain outside this remediation baseline unless
separately approved.
