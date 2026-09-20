# MiniMart Functional Decision Register --- v0.9 Consolidated

**Document ID:** MM-DEC-001\
**Status:** FROZEN governance companion to FRS v1.0\
**Rule:** An implementation agent must not silently choose an `OPEN`,
`VERIFY`, or `DEFERRED` decision.

## Status vocabulary

-   **RESOLVED** --- approved working baseline for the FRS/domain
    baseline.
-   **OPEN** --- business/product decision still required before the
    named implementation area.
-   **VERIFY** --- requires authoritative
    country/legal/accounting/operational verification.
-   **DEFERRED** --- intentionally later phase; does not block the
    initial Domain Model.
-   **PROPOSED** --- direction is documented but not yet frozen; does
    not block the Domain Model unless specifically marked.

## A. Resolved freeze baselines

  ----------------------------------------------------------------------
  ID / topic             Status                 v0.9 baseline
  ---------------------- ---------------------- ------------------------
  `DEC-INV-001`          RESOLVED               Moving weighted-average
                                                cost per Item per Store.

  `DEC-PUR-004`          RESOLVED               Free quantity adds
                                                quantity; net
                                                acquisition value is
                                                spread across total
                                                accepted quantity.

  `DEC-PUR-005`          RESOLVED               Purchase line/document
                                                discounts reduce
                                                acquisition value using
                                                deterministic
                                                allocation.

  `DEC-PUR-006`          RESOLVED + VERIFY      Recoverable tax excluded
                                                from acquisition cost;
                                                non-recoverable directly
                                                attributable tax
                                                included. Tax
                                                classification comes
                                                from verified
                                                country/accounting
                                                rules.

  `DEC-INV-006`          RESOLVED               Phase-1 negative stock
                                                blocked; later
                                                negative-stock costing
                                                requires separate
                                                extension.

  `DEC-PAY-005`          RESOLVED               Payment
                                                Attempt/Commitment is
                                                distinct from posted
                                                Tender; confirmed money
                                                must complete into Sale
                                                or explicit
                                                reversal/refund.

  `DEC-RET-005`          RESOLVED               Posted Return may own an
                                                outstanding Refund
                                                Obligation; settlement
                                                is separate and
                                                recoverable.

  `DEC-CUS-001`          RESOLVED               Customer identity is
                                                company/tenant-wide.

  `DEC-CTRY-004`         RESOLVED               Country behavior uses
                                                version/effective
                                                identity; posted history
                                                preserves applicable
                                                context/outcomes.

  `DEC-DOM-001`          RESOLVED               Item identity
                                                company-wide;
                                                stock/cost/store-price
                                                assignment store-scoped.

  `DEC-DOM-002`          RESOLVED               Supplier identity
                                                company-wide.

  `DEC-PRI-001`          RESOLVED               Selling-price assignment
                                                is store-scoped from the
                                                initial model.

  `DEC-CRD-000`          RESOLVED               Minimum customer-credit
                                                capability is Phase 1/2;
                                                advanced credit policy
                                                remains later.

  `DEC-ACC-000`          RESOLVED               Accounting-Lite covers
                                                supplier
                                                liabilities/payments,
                                                customer-receivable
                                                linkage, cash/bank
                                                movement, expenses,
                                                reconciliation and
                                                export; no full-GL
                                                claim.

  `DEC-INV-010`          RESOLVED               Phase-1 default
                                                negative-stock behavior
                                                is BLOCK under the
                                                initial WAC baseline.
  ----------------------------------------------------------------------

## B. Purchasing / Inventory decisions

  --------------------------------------------------------------------------
  ID              Status          Decision / direction   Needed before
  --------------- --------------- ---------------------- -------------------
  `DEC-PUR-001`   PROPOSED        PO optional; direct    Purchasing
                                  GRN allowed unless     implementation
                                  policy requires PO.    

  `DEC-PUR-002`   PROPOSED        Direct GRN allowed     Purchasing
                                  unless store policy    implementation
                                  requires PO.           

  `DEC-PUR-003`   PROPOSED        Duplicate supplier     GRN implementation
                                  invoice/reference      
                                  blocked by default;    
                                  controlled exception   
                                  may be allowed.        

  `DEC-PUR-007`   PROPOSED        Over-receipt           GRN implementation
                                  configurable           
                                  block/warn/approval.   

  `DEC-PUR-008`   OPEN            Whether PO approval is PO approval
                                  required by default.   workflow

  `DEC-INV-002`   RESOLVED for    Negative stock blocked Later
                  Phase 1         initially; later       negative-stock
                                  configurable modes     feature
                                  require separate       
                                  approval.              

  `DEC-INV-003`   OPEN            Stock-count            Count
                                  concurrency: scope     implementation
                                  lock vs                
                                  snapshot/movement      
                                  reconciliation.        

  `DEC-INV-004`   OPEN            Batch physical         Batch-aware POS
                                  depletion policy.      

  `DEC-INV-005`   OPEN            Expiry/FEFO behavior.  Batch-aware POS

  `DEC-INV-007`   OPEN            Low-stock/reorder      Inventory UI/domain
                                  threshold ownership.   extension

  `DEC-INV-008`   PROPOSED        Opening stock through  Store
                                  controlled audited     migration/go-live
                                  posting.               

  `DEC-INV-009`   RESOLVED        Inventory valuation    Reporting
                                  report belongs in      implementation
                                  Phase 2 reporting.     
  --------------------------------------------------------------------------

## C. Common / POS / Payment / Return decisions

  --------------------------------------------------------------------------
  ID              Status          Decision / direction     Needed before
  --------------- --------------- ------------------------ -----------------
  `DEC-COM-001`   OPEN            Explicit business-date   Day-close
                                  rollover coordinated     implementation
                                  with Shift/Day Close.    

  `DEC-COM-002`   OPEN            Human document-number    Domain/API
                                  scope by                 numbering
                                  company/store/document   
                                  type.                    

  `DEC-POS-001`   OPEN            Held-sale repricing      POS
                                  after price change.      implementation

  `DEC-POS-002`   OPEN            Active-sale price        POS
                                  behavior after line is   implementation
                                  added.                   

  `DEC-POS-003`   VERIFY / OPEN   Expired-stock sale       Batch-aware POS
                                  default/exception        
                                  requires                 
                                  operational/legal        
                                  validation.              

  `DEC-POS-004`   DEFERRED        Phase 1 blocks safely if Survival-mode
                                  Store Node unavailable;  phase
                                  SQLite survival mode is  
                                  later.                   

  `DEC-PAY-001`   PROPOSED        Phase-1 card = external  POS Phase 1
                                  terminal + explicit      
                                  manual confirmation.     

  `DEC-PAY-002`   PROPOSED        Phase-1 QR =             POS Phase 1
                                  external/manual          
                                  confirmation where       
                                  applicable.              

  `DEC-PAY-003`   VERIFY          Cash rounding in         Country/payment
                                  mixed/split tender comes release
                                  from verified country    
                                  rules.                   

  `DEC-PAY-004`   VERIFY /        Tender surcharge/fee not Surcharge feature
                  DEFERRED        implemented until        
                                  verified/approved.       

  `DEC-PAY-006`   DEFERRED        Direct providers via     Phase 3
                                  provider-independent     
                                  adapters.                

  `DEC-RET-001`   OPEN            No-receipt return        Return
                                  policy.                  implementation

  `DEC-RET-002`   PROPOSED        Sellable /               Return
                                  damaged-quarantine /     implementation
                                  other policy-defined     
                                  dispositions.            

  `DEC-RET-003`   OPEN            Mixed-tender refund      Split-tender
                                  allocation.              refund

  `DEC-RET-004`   OPEN            Refund-method            Return
                                  substitution             implementation
                                  restrictions.            

  `DEC-RET-006`   VERIFY          Original tax/discount    Country return
                                  reversal rules from      baseline
                                  country/accounting       
                                  rules.                   
  --------------------------------------------------------------------------

## D. Customer / Credit / Shift / Reporting decisions

  -----------------------------------------------------------------------------
  ID              Status          Decision / direction         Needed before
  --------------- --------------- ---------------------------- ----------------
  `DEC-CUS-002`   VERIFY          Customer                     Production
                                  retention/anonymization      privacy baseline
                                  depends on                   
                                  country/accounting/privacy   
                                  rules.                       

  `DEC-CUS-003`   DEFERRED        No implicit duplicate merge  Merge feature
                                  initially.                   

  `DEC-CRD-001`   OPEN            Credit-limit violation mode: Credit policy
                                  block vs manager approval.   implementation

  `DEC-CRD-002`   OPEN            Automatic collection         Collections
                                  allocation: oldest-due-first 
                                  vs manual/default.           

  `DEC-CRD-003`   OPEN            Customer overpayment/advance Collections
                                  policy.                      

  `DEC-CRD-004`   OPEN            Suspended-credit override    Credit
                                  policy.                      implementation

  `DEC-CRD-005`   OPEN            Whether held credit-intended POS/Credit
                                  sale reserves exposure.      integration

  `DEC-CRD-006`   DEFERRED        Multi-branch offline credit  Phase 3
                                  exposure policy.             

  `DEC-CSH-001`   OPEN            Business-date rollover rule. Shift/Day Close

  `DEC-CSH-002`   OPEN            Open shift at day close:     Day Close
                                  block default vs controlled  
                                  exception.                   

  `DEC-CSH-003`   OPEN            Late transaction after day   Day Close
                                  close.                       

  `DEC-CSH-004`   OPEN            Exceptional reopen of closed Day Close
                                  business day.                

  `DEC-CSH-005`   OPEN            Simultaneous active shifts   Shift
                                  per counter/drawer.          implementation

  `DEC-RPT-001`   OPEN by report  Historical vs current master Reporting
                                  grouping.                    implementation

  `DEC-RPT-002`   PROPOSED        Phase-2 baseline reports as  Reporting v1.0
                                  defined in Reporting FRS.    
  -----------------------------------------------------------------------------

## E. Import / Audit / Hardware / Recovery / Support / Country decisions

  -------------------------------------------------------------------------
  ID               Status           Decision / direction   Needed before
  ---------------- ---------------- ---------------------- ----------------
  `DEC-IMP-001`    PROPOSED         Preview + valid-row    Import v1.0
                                    mode for master data;  
                                    atomic for business    
                                    documents.             

  `DEC-IMP-002`    OPEN             Original source-file   Production
                                    retention policy.      import

  `DEC-IMP-003`    OPEN             Opening-stock          Store go-live
                                    migration              
                                    window/go-live lock.   

  `DEC-AUD-001`    VERIFY           Audit retention        Production
                                    period.                baseline

  `DEC-AUD-002`    OPEN             Audit tamper-evidence  Security
                                    mechanism.             hardening

  `DEC-HW-001`     OPEN             Supported printer      Hardware
                                    command/interface      baseline
                                    baseline.              

  `DEC-HW-002`     OPEN             Scale manual-entry     Scale
                                    fallback.              integration

  `DEC-HW-003`     OPEN             Customer-display       Hardware
                                    interface baseline.    baseline

  `DEC-BR-001`     OPEN             Store backup           Production
                                    frequency/RPO.         deployment

  `DEC-BR-002`     OPEN             Store recovery RTO.    Production
                                                           deployment

  `DEC-BR-003`     OPEN             Backup                 Production
                                    retention/rotation.    deployment

  `DEC-BR-004`     OPEN             Offsite backup         Operations setup
                                    provider.              

  `DEC-SUPT-001`   OPEN             Remote-support         Remote support
                                    technology/provider.   rollout

  `DEC-SUPT-002`   OPEN             Operational log        Production
                                    retention.             support

  `DEC-SUPT-003`   PROPOSED         Diagnostic bundle      Support v1.0
                                    defaults to            
                                    health/config +        
                                    bounded logs;          
                                    PII/business data      
                                    excluded by default.   

  `DEC-CTRY-001`   PROPOSED         Store country fixed at Country v1.0
                                    go-live; later change  
                                    requires controlled    
                                    migration.             

  `DEC-CTRY-002`   VERIFY           Malaysia compliance    Malaysia
                                    baseline from dated    compliance
                                    official sources.      release

  `DEC-CTRY-003`   VERIFY           India compliance       India Phase 4
                                    baseline from dated    
                                    official sources.      
  -------------------------------------------------------------------------

## F. Additional legacy module decisions not blocking Domain Model

These remain implementation/configuration decisions and are
intentionally not treated as Domain Model blockers:

-   item-code generation/manual-entry policy;
-   skeleton-item minimum fields/sale restrictions;
-   exact UoM pack-depth and weighted-barcode formats;
-   category hierarchy depth;
-   PIN/password/session policy values;
-   delegated permission-administration and manager-override
    authentication method;
-   supplier-code numbering and duplicate-match heuristics;
-   minimum-price/negative-margin and maker-checker pricing policy;
-   price-label hardware/workflow detail;
-   counter enrollment/re-enrollment and licensing limits;
-   multi-currency supplier/store behavior in later phases.

When one becomes implementation-critical, create a dedicated `DEC-*`
entry rather than letting an agent choose silently.

## Decision governance

1.  `RESOLVED` decisions may be used by the Domain Model and downstream
    specifications.
2.  `OPEN` decisions must not be guessed; downstream design must either
    avoid depending on them or stop at the decision boundary.
3.  `VERIFY` decisions require authoritative evidence appropriate to the
    subject.
4.  `DEFERRED` decisions must not be accidentally pulled into earlier
    phases.
5.  Every newly resolved decision records rationale, affected
    requirements and any ADR/domain-rule consequence.
