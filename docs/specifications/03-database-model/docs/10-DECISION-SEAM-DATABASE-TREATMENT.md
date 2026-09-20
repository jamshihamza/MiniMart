# Decision Seam Database Treatment --- v1.2 Amendment Candidate

**Coverage:** 60 / 60 frozen non-resolved or verification Decision IDs.

A row marked `NOT RESOLVED HERE` means the database supports the
necessary facts without choosing the policy/compliance result.

  ---------------------------------------------------------------------------------------------------
  Decision ID             v1.2 database treatment                             Freeze status
  ----------------------- --------------------------------------------------- -----------------------
  `DEC-AUD-001`           Append-only audit evidence is stored;               NOT RESOLVED HERE
                          retention/tamper-evidence product choice remains    
                          unresolved.                                         

  `DEC-AUD-002`           Append-only audit evidence is stored;               NOT RESOLVED HERE
                          retention/tamper-evidence product choice remains    
                          unresolved.                                         

  `DEC-BR-001`            No RPO/RTO/retention/provider value is stored as a  NOT RESOLVED HERE
                          hard-coded database default.                        

  `DEC-BR-002`            No RPO/RTO/retention/provider value is stored as a  NOT RESOLVED HERE
                          hard-coded database default.                        

  `DEC-BR-003`            No RPO/RTO/retention/provider value is stored as a  NOT RESOLVED HERE
                          hard-coded database default.                        

  `DEC-BR-004`            No RPO/RTO/retention/provider value is stored as a  NOT RESOLVED HERE
                          hard-coded database default.                        

  `DEC-COM-001`           Persist explicit BusinessDate and non-key document  NOT RESOLVED HERE
                          number; no midnight rollover or numbering scope is  
                          selected.                                           

  `DEC-COM-002`           Persist explicit BusinessDate and non-key document  NOT RESOLVED HERE
                          number; no midnight rollover or numbering scope is  
                          selected.                                           

  `DEC-CRD-001`           Persist                                             NOT RESOLVED HERE
                          limit/outstanding/status/override/allocation facts; 
                          no                                                  
                          block/approval/allocation/overpayment/reservation   
                          policy is selected.                                 

  `DEC-CRD-002`           Persist                                             NOT RESOLVED HERE
                          limit/outstanding/status/override/allocation facts; 
                          no                                                  
                          block/approval/allocation/overpayment/reservation   
                          policy is selected.                                 

  `DEC-CRD-003`           Persist                                             NOT RESOLVED HERE
                          limit/outstanding/status/override/allocation facts; 
                          no                                                  
                          block/approval/allocation/overpayment/reservation   
                          policy is selected.                                 

  `DEC-CRD-004`           Persist                                             NOT RESOLVED HERE
                          limit/outstanding/status/override/allocation facts; 
                          no                                                  
                          block/approval/allocation/overpayment/reservation   
                          policy is selected.                                 

  `DEC-CRD-005`           Persist                                             NOT RESOLVED HERE
                          limit/outstanding/status/override/allocation facts; 
                          no                                                  
                          block/approval/allocation/overpayment/reservation   
                          policy is selected.                                 

  `DEC-CRD-006`           Persist                                             NOT RESOLVED HERE
                          limit/outstanding/status/override/allocation facts; 
                          no                                                  
                          block/approval/allocation/overpayment/reservation   
                          policy is selected.                                 

  `DEC-CSH-001`           Persist BusinessDay/Shift states and explicit       NOT RESOLVED HERE
                          BusinessDate; no                                    
                          close/reopen/late/simultaneous-shift rule is        
                          selected.                                           

  `DEC-CSH-002`           Persist BusinessDay/Shift states and explicit       NOT RESOLVED HERE
                          BusinessDate; no                                    
                          close/reopen/late/simultaneous-shift rule is        
                          selected.                                           

  `DEC-CSH-003`           Persist BusinessDay/Shift states and explicit       NOT RESOLVED HERE
                          BusinessDate; no                                    
                          close/reopen/late/simultaneous-shift rule is        
                          selected.                                           

  `DEC-CSH-004`           Persist BusinessDay/Shift states and explicit       NOT RESOLVED HERE
                          BusinessDate; no                                    
                          close/reopen/late/simultaneous-shift rule is        
                          selected.                                           

  `DEC-CSH-005`           Persist BusinessDay/Shift states and explicit       NOT RESOLVED HERE
                          BusinessDate; no                                    
                          close/reopen/late/simultaneous-shift rule is        
                          selected.                                           

  `DEC-CTRY-001`          Store and posted documents retain CountryRuleSet    NOT RESOLVED HERE
                          identity/version; country migration and legal       
                          values require explicit verified policy.            

  `DEC-CTRY-002`          Store and posted documents retain CountryRuleSet    NOT RESOLVED HERE
                          identity/version; country migration and legal       
                          values require explicit verified policy.            

  `DEC-CTRY-003`          Store and posted documents retain CountryRuleSet    NOT RESOLVED HERE
                          identity/version; country migration and legal       
                          values require explicit verified policy.            

  `DEC-CUS-002`           Persist customer status/PII timestamps; no          NOT RESOLVED HERE
                          retention period or automatic merge is encoded.     

  `DEC-CUS-003`           Persist customer status/PII timestamps; no          NOT RESOLVED HERE
                          retention period or automatic merge is encoded.     

  `DEC-HW-001`            No hardware protocol/interface choice is encoded in NOT RESOLVED HERE
                          business tables.                                    

  `DEC-HW-002`            No hardware protocol/interface choice is encoded in NOT RESOLVED HERE
                          business tables.                                    

  `DEC-HW-003`            No hardware protocol/interface choice is encoded in NOT RESOLVED HERE
                          business tables.                                    

  `DEC-IMP-001`           Imports must invoke normal domain posting paths;    NOT RESOLVED HERE
                          source retention/opening-stock go-live policy is    
                          not selected.                                       

  `DEC-IMP-002`           Imports must invoke normal domain posting paths;    NOT RESOLVED HERE
                          source retention/opening-stock go-live policy is    
                          not selected.                                       

  `DEC-IMP-003`           Imports must invoke normal domain posting paths;    NOT RESOLVED HERE
                          source retention/opening-stock go-live policy is    
                          not selected.                                       

  `DEC-INV-003`           Persist stock/batch/expiry/count/opening facts and  NOT RESOLVED HERE
                          immutable movements; selection/concurrency/reorder  
                          policy remains application policy.                  

  `DEC-INV-004`           Persist stock/batch/expiry/count/opening facts and  NOT RESOLVED HERE
                          immutable movements; selection/concurrency/reorder  
                          policy remains application policy.                  

  `DEC-INV-005`           Persist stock/batch/expiry/count/opening facts and  NOT RESOLVED HERE
                          immutable movements; selection/concurrency/reorder  
                          policy remains application policy.                  

  `DEC-INV-007`           Persist stock/batch/expiry/count/opening facts and  NOT RESOLVED HERE
                          immutable movements; selection/concurrency/reorder  
                          policy remains application policy.                  

  `DEC-INV-008`           Persist stock/batch/expiry/count/opening facts and  NOT RESOLVED HERE
                          immutable movements; selection/concurrency/reorder  
                          policy remains application policy.                  

  `DEC-PAY-001`           Persist provider-neutral                            NOT RESOLVED HERE
                          method/attempt/rounding/surcharge-capable facts; no 
                          provider, rounding or surcharge rule is hard-coded. 

  `DEC-PAY-002`           Persist provider-neutral                            NOT RESOLVED HERE
                          method/attempt/rounding/surcharge-capable facts; no 
                          provider, rounding or surcharge rule is hard-coded. 

  `DEC-PAY-003`           Persist provider-neutral                            NOT RESOLVED HERE
                          method/attempt/rounding/surcharge-capable facts; no 
                          provider, rounding or surcharge rule is hard-coded. 

  `DEC-PAY-004`           Persist provider-neutral                            NOT RESOLVED HERE
                          method/attempt/rounding/surcharge-capable facts; no 
                          provider, rounding or surcharge rule is hard-coded. 

  `DEC-PAY-006`           Persist provider-neutral                            NOT RESOLVED HERE
                          method/attempt/rounding/surcharge-capable facts; no 
                          provider, rounding or surcharge rule is hard-coded. 

  `DEC-POS-001`           Persist sale price snapshots/status/source          NOT RESOLVED HERE
                          versions; no automatic held/active repricing or     
                          expiry decision is selected.                        

  `DEC-POS-002`           Persist sale price snapshots/status/source          NOT RESOLVED HERE
                          versions; no automatic held/active repricing or     
                          expiry decision is selected.                        

  `DEC-POS-003`           Persist sale price snapshots/status/source          NOT RESOLVED HERE
                          versions; no automatic held/active repricing or     
                          expiry decision is selected.                        

  `DEC-POS-004`           Persist sale price snapshots/status/source          NOT RESOLVED HERE
                          versions; no automatic held/active repricing or     
                          expiry decision is selected.                        

  `DEC-PUR-001`           Persist neutral PO/GRN/reference/approval/quantity  NOT RESOLVED HERE
                          facts; enforce no block/warn/mandatory behavior     
                          unless resolved.                                    

  `DEC-PUR-002`           Persist neutral PO/GRN/reference/approval/quantity  NOT RESOLVED HERE
                          facts; enforce no block/warn/mandatory behavior     
                          unless resolved.                                    

  `DEC-PUR-003`           Persist neutral PO/GRN/reference/approval/quantity  NOT RESOLVED HERE
                          facts; enforce no block/warn/mandatory behavior     
                          unless resolved.                                    

  `DEC-PUR-006`           Persist neutral PO/GRN/reference/approval/quantity  NOT RESOLVED HERE
                          facts; enforce no block/warn/mandatory behavior     
                          unless resolved.                                    

  `DEC-PUR-007`           Persist neutral PO/GRN/reference/approval/quantity  NOT RESOLVED HERE
                          facts; enforce no block/warn/mandatory behavior     
                          unless resolved.                                    

  `DEC-PUR-008`           Persist neutral PO/GRN/reference/approval/quantity  NOT RESOLVED HERE
                          facts; enforce no block/warn/mandatory behavior     
                          unless resolved.                                    

  `DEC-RET-001`           Persist optional source reference, disposition      NOT RESOLVED HERE
                          code, explicit refund allocation/method and         
                          original snapshots;                                 
                          eligibility/allocation/substitution policy remains  
                          open.                                               

  `DEC-RET-002`           Persist optional source reference, disposition      NOT RESOLVED HERE
                          code, explicit refund allocation/method and         
                          original snapshots;                                 
                          eligibility/allocation/substitution policy remains  
                          open.                                               

  `DEC-RET-003`           Persist optional source reference, disposition      NOT RESOLVED HERE
                          code, explicit refund allocation/method and         
                          original snapshots;                                 
                          eligibility/allocation/substitution policy remains  
                          open.                                               

  `DEC-RET-004`           Persist optional source reference, disposition      NOT RESOLVED HERE
                          code, explicit refund allocation/method and         
                          original snapshots;                                 
                          eligibility/allocation/substitution policy remains  
                          open.                                               

  `DEC-RET-006`           Persist optional source reference, disposition      NOT RESOLVED HERE
                          code, explicit refund allocation/method and         
                          original snapshots;                                 
                          eligibility/allocation/substitution policy remains  
                          open.                                               

  `DEC-RPT-001`           Transactional schema preserves historical           NOT RESOLVED HERE
                          snapshots/source IDs; report grouping/projection    
                          policy is not encoded as transactional ownership.   

  `DEC-RPT-002`           Transactional schema preserves historical           NOT RESOLVED HERE
                          snapshots/source IDs; report grouping/projection    
                          policy is not encoded as transactional ownership.   

  `DEC-SUPT-001`          Support/diagnostic storage is provider-neutral and  NOT RESOLVED HERE
                          avoids assumed retention/PII inclusion.             

  `DEC-SUPT-002`          Support/diagnostic storage is provider-neutral and  NOT RESOLVED HERE
                          avoids assumed retention/PII inclusion.             

  `DEC-SUPT-003`          Support/diagnostic storage is provider-neutral and  NOT RESOLVED HERE
                          avoids assumed retention/PII inclusion.             
  ---------------------------------------------------------------------------------------------------

## Enforcement rule

A migration, CHECK, UNIQUE constraint, trigger, default or index may
enforce a frozen invariant. It may **not** turn any row above into a
product-policy decision without approved upstream change control.
