# Complete Decision Seam Matrix --- v0.2

**Source:** frozen MiniMart Decision Register v1.0 companion.

This matrix covers every non-resolved decision entry from sections B--E
of the frozen register, plus the remaining verification aspect of
`DEC-PUR-006`.

  ---------------------------------------------------------------------------------------------------------------------
  Decision       Frozen status  Classification          v0.2 domain treatment                 Must not assume
  -------------- -------------- ----------------------- ------------------------------------- -------------------------
  DEC-PUR-006    RESOLVED +     COMPLIANCE VERIFY       WAC formula is frozen;                Do not invent tax
                 VERIFY                                 recoverable/non-recoverable tax       recoverability
                                                        classification comes from verified    
                                                        country/accounting policy             

  DEC-PUR-001    PROPOSED       APPLICATION POLICY      PurchaseOrderPolicy controls whether  Do not make PO
                                                        PO is required                        universally
                                                                                              mandatory/optional

  DEC-PUR-002    PROPOSED       APPLICATION POLICY      DirectGRNPolicy                       Do not assume direct GRN
                                                                                              always allowed

  DEC-PUR-003    PROPOSED       DOMAIN/APPLICATION      SupplierReferenceDuplicatePolicy +    Do not silently
                                POLICY                  race-safe scope                       hard-block/allow
                                                                                              exception

  DEC-PUR-007    PROPOSED       DOMAIN POLICY           OverReceiptPolicy evaluated against   Do not choose
                                                        PO line                               block/warn/approval

  DEC-PUR-008    OPEN           DOMAIN POLICY           POApprovalPolicy                      Do not assume approval is
                                                                                              required or absent

  DEC-INV-003    OPEN           DOMAIN/DB HANDOFF       StockCountConcurrencyPolicy; v0.2     Do not choose lock vs
                                                        preserves count scope consistency     snapshot reconciliation
                                                        boundary                              

  DEC-INV-004    OPEN           DOMAIN POLICY           BatchSelectionPolicy                  Do not choose physical
                                                                                              batch depletion rule

  DEC-INV-005    OPEN           DOMAIN POLICY           Expiry/FEFOPolicy                     Do not assume FEFO

  DEC-INV-007    OPEN           DOMAIN EXTENSION        ReorderPolicy boundary only           Do not assign threshold
                                                                                              ownership yet

  DEC-INV-008    PROPOSED       APPLICATION/DOMAIN      OpeningStockPostingPolicy             Do not bypass audited
                                POLICY                                                        stock movement

  DEC-COM-001    OPEN           DOMAIN POLICY           BusinessDatePolicy owned by Cash &    Do not use midnight
                                                        Business Day                          rollover

  DEC-COM-002    OPEN           DOMAIN POLICY           DocumentNumberPolicy; identity        Do not choose
                                                        remains UUID                          company/store numbering
                                                                                              scope

  DEC-POS-001    OPEN           DOMAIN POLICY           HeldSaleRepricingPolicy               Do not always
                                                                                              preserve/reprice

  DEC-POS-002    OPEN           DOMAIN POLICY           ActiveSalePricePolicy                 Do not auto-reprice
                                                                                              silently

  DEC-POS-003    VERIFY / OPEN  DOMAIN + COMPLIANCE     ExpirySalePolicy                      Do not choose allow/block
                                                                                              without verification

  DEC-POS-004    DEFERRED       ARCHITECTURE/INFRA      Phase 1 blocks safely if Store Node   Do not implement SQLite
                                                        unavailable; survival mode later      survival in Phase 1

  DEC-PAY-001    PROPOSED       APPLICATION/ADAPTER     CardTenderAdapter supports            Do not treat proposed
                                                        external/manual confirmation baseline provider mode as
                                                                                              permanent/frozen

  DEC-PAY-002    PROPOSED       APPLICATION/ADAPTER     QRTenderAdapter supports              Do not hard-code provider
                                                        external/manual confirmation baseline behavior

  DEC-PAY-003    VERIFY         COMPLIANCE POLICY       CountryRuleSet supplies cash rounding Do not invent rounding

  DEC-PAY-004    VERIFY /       COMPLIANCE/DEFERRED     SurchargePolicy absent until          Do not implement
                 DEFERRED                               verified/approved                     surcharge

  DEC-PAY-006    DEFERRED       ADAPTER                 Provider-independent integrated       Do not bind core to
                                                        payment port                          provider

  DEC-RET-001    OPEN           DOMAIN POLICY           NoReceiptReturnPolicy                 Do not choose default
                                                                                              eligibility

  DEC-RET-002    PROPOSED       DOMAIN POLICY           StockDispositionPolicy supports       Do not freeze exact
                                                        sellable/non-sellable buckets         vocabulary beyond
                                                                                              capability

  DEC-RET-003    OPEN           DOMAIN POLICY           RefundAllocationPolicy                Do not choose
                                                                                              pro-rata/original-order

  DEC-RET-004    OPEN           DOMAIN POLICY           RefundMethodPolicy                    Do not assume
                                                                                              substitution allowed

  DEC-RET-006    VERIFY         COMPLIANCE POLICY       CountryRuleSet supplies tax/discount  Do not invent reversal
                                                        reversal rules                        tax treatment

  DEC-CUS-002    VERIFY         COMPLIANCE/PRIVACY      CustomerRetentionPolicy               Do not invent
                                                                                              retention/anonymization
                                                                                              period

  DEC-CUS-003    DEFERRED       DOMAIN EXTENSION        No implicit merge; future             Do not auto-merge
                                                        CustomerMerge workflow                

  DEC-CRD-001    OPEN           DOMAIN POLICY           CreditLimitPolicy                     Do not choose block vs
                                                                                              manager approval

  DEC-CRD-002    OPEN           DOMAIN POLICY           CollectionAllocationPolicy            Do not choose
                                                                                              oldest-first

  DEC-CRD-003    OPEN           DOMAIN POLICY           CustomerAdvancePolicy                 Do not accept/reject
                                                                                              overpayment by assumption

  DEC-CRD-004    OPEN           DOMAIN POLICY           SuspendedCreditOverridePolicy         Do not invent override
                                                                                              behavior

  DEC-CRD-005    OPEN           DOMAIN POLICY           CreditReservationPolicy for held      Do not reserve exposure
                                                        sales                                 by assumption

  DEC-CRD-006    DEFERRED       SYNC/DOMAIN EXTENSION   Multi-branch offline credit exposure  Do not claim company-wide
                                                        strategy later                        real-time exposure
                                                                                              offline across branches

  DEC-CSH-001    OPEN           DOMAIN POLICY           BusinessDatePolicy                    Do not invent rollover

  DEC-CSH-002    OPEN           DOMAIN POLICY           BusinessDayClosePolicy                Do not choose open-shift
                                                                                              block/exception

  DEC-CSH-003    OPEN           DOMAIN POLICY           LateTransactionPolicy                 Do not post into closed
                                                                                              day by assumption

  DEC-CSH-004    OPEN           DOMAIN POLICY           BusinessDayReopenPolicy               Do not permit/forbid
                                                                                              exceptional reopen by
                                                                                              assumption

  DEC-CSH-005    OPEN           DOMAIN POLICY           ActiveShiftPolicy keyed by            Do not assume one/many
                                                        counter/drawer scope                  active shifts

  DEC-RPT-001    OPEN by report READ-MODEL POLICY       ReportGroupingPolicy per report       Do not silently use
                                                                                              current vs historical
                                                                                              master grouping

  DEC-RPT-002    PROPOSED       READ MODEL              Reporting FRS defines proposed        Do not make reporting
                                                        Phase-2 baseline                      projection a
                                                                                              transactional aggregate

  DEC-IMP-001    PROPOSED       APPLICATION POLICY      ImportCommitPolicy                    Do not let import bypass
                                                                                              domain commands

  DEC-IMP-002    OPEN           OPERATIONS/PRIVACY      ImportSourceRetentionPolicy           Do not invent retention

  DEC-IMP-003    OPEN           APPLICATION/GO-LIVE     OpeningStockMigrationPolicy/go-live   Do not allow uncontrolled
                                                        lock                                  opening-stock import

  DEC-AUD-001    VERIFY         COMPLIANCE/OPERATIONS   AuditRetentionPolicy                  Do not invent retention

  DEC-AUD-002    OPEN           SECURITY/INFRA          AuditTamperEvidencePolicy             Do not claim a mechanism
                                                                                              is approved

  DEC-HW-001     OPEN           ADAPTER                 PrinterPort                           Do not bind core to
                                                                                              command set

  DEC-HW-002     OPEN           ADAPTER/APPLICATION     ScaleFallbackPolicy                   Do not assume manual
                                                                                              fallback

  DEC-HW-003     OPEN           ADAPTER                 CustomerDisplayPort                   Do not bind core to
                                                                                              interface

  DEC-BR-001     OPEN           OPERATIONS              BackupPolicy.RPO                      Do not invent frequency

  DEC-BR-002     OPEN           OPERATIONS              RecoveryPolicy.RTO                    Do not invent RTO

  DEC-BR-003     OPEN           OPERATIONS              BackupRetentionPolicy                 Do not invent rotation

  DEC-BR-004     OPEN           INFRA                   OffsiteBackupProvider seam            Do not choose provider

  DEC-SUPT-001   OPEN           INFRA/SECURITY          RemoteSupportProvider seam            Do not choose
                                                                                              technology/provider

  DEC-SUPT-002   OPEN           OPERATIONS/PRIVACY      OperationalLogRetentionPolicy         Do not invent retention

  DEC-SUPT-003   PROPOSED       APPLICATION/PRIVACY     DiagnosticBundlePolicy                Do not include
                                                                                              PII/business data by
                                                                                              assumption

  DEC-CTRY-001   PROPOSED       DOMAIN/APPLICATION      StoreCountryMigrationPolicy           Do not allow casual
                                                                                              country change

  DEC-CTRY-002   VERIFY         COMPLIANCE              Malaysia CountryRuleSet release gate  Do not hard-code
                                                                                              unverified legal values

  DEC-CTRY-003   VERIFY         COMPLIANCE              India CountryRuleSet Phase-4 gate     Do not hard-code
                                                                                              unverified legal values
  ---------------------------------------------------------------------------------------------------------------------

## Legacy module decisions

The frozen register also lists legacy module-level decisions without
dedicated `DEC-*` IDs. v0.2 treats them as explicit policy seams until
dedicated IDs are created when implementation-critical:

-   item-code generation/manual entry;
-   skeleton-item minimum fields/sale restriction;
-   UoM pack depth and weighted-barcode formats;
-   category hierarchy depth;
-   PIN/password/session values;
-   delegated permission administration and override authentication
    method;
-   supplier-code numbering and duplicate-match heuristics;
-   minimum-price/negative-margin and maker-checker pricing;
-   price-label hardware/workflow;
-   counter enrollment/re-enrollment/licensing limits;
-   later multi-currency behavior.

No coding/database/API agent may silently select these values.
