# Frozen Decision-Seam → Architecture Matrix --- v0.3

**Coverage:** **60 / 60** frozen non-resolved or verification Decision
IDs.

Architecture status for every row: **NOT RESOLVED BY ARCHITECTURE**
unless the row is already partly resolved upstream (for example
DEC-PUR-006 WAC formula) and only the remaining verification aspect is
shown.

  -----------------------------------------------------------------------------------------------------------------
  Decision ID      Frozen       Architecture seam/component   Deliberately not decided here  Activation /
                   status                                                                    verification point
  ---------------- ------------ ----------------------------- ------------------------------ ----------------------
  `DEC-AUD-001`    VERIFY       Audit subsystem policy/config audit retention period         Authoritative
                                seam                                                         verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-AUD-002`    OPEN         Audit subsystem policy/config audit tamper-evidence          Approved
                                seam                          mechanism                      product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-BR-001`     OPEN         Backup/Recovery operations    backup RPO/frequency           Approved
                                ports                                                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-BR-002`     OPEN         Backup/Recovery operations    recovery RTO                   Approved
                                ports                                                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-BR-003`     OPEN         Backup/Recovery operations    backup retention/rotation      Approved
                                ports                                                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-BR-004`     OPEN         Backup/Recovery operations    offsite backup provider        Approved
                                ports                                                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-COM-001`    OPEN         BusinessContext /             BusinessDate rollover rule     Approved
                                DocumentNumberPolicy                                         product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-COM-002`    OPEN         BusinessContext /             human document-number          Approved
                                DocumentNumberPolicy          company/store scope            product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CRD-001`    OPEN         Customer & Credit policy +    credit-limit block versus      Approved
                                sync extension seam           approval behavior              product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CRD-002`    OPEN         Customer & Credit policy +    collection allocation order    Approved
                                sync extension seam                                          product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CRD-003`    OPEN         Customer & Credit policy +    customer overpayment/advance   Approved
                                sync extension seam           acceptance                     product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CRD-004`    OPEN         Customer & Credit policy +    suspended-credit override      Approved
                                sync extension seam           behavior                       product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CRD-005`    OPEN         Customer & Credit policy +    held-sale credit reservation   Approved
                                sync extension seam           behavior                       product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CRD-006`    DEFERRED     Customer & Credit policy +    multi-branch offline credit    Later-phase approved
                                sync extension seam           exposure strategy              ADR/specification;
                                                                                             disabled/not assumed
                                                                                             until then.

  `DEC-CSH-001`    OPEN         Cash & Business Day policy    BusinessDate rollover rule     Approved
                                ports                                                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CSH-002`    OPEN         Cash & Business Day policy    business-day close with open   Approved
                                ports                         shifts                         product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CSH-003`    OPEN         Cash & Business Day policy    late-transaction behavior      Approved
                                ports                                                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CSH-004`    OPEN         Cash & Business Day policy    business-day reopen behavior   Approved
                                ports                                                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CSH-005`    OPEN         Cash & Business Day policy    simultaneous active-shift      Approved
                                ports                         scope                          product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-CTRY-001`   PROPOSED     Country Policy / Country-pack store-country migration policy Explicit upstream
                                release gate                                                 approval/promotion
                                                                                             before treated as
                                                                                             fixed.

  `DEC-CTRY-002`   VERIFY       Country Policy / Country-pack current Malaysia               Authoritative
                                release gate                  legal/compliance values        verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-CTRY-003`   VERIFY       Country Policy / Country-pack current India legal/compliance Authoritative
                                release gate                  values                         verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-CUS-002`    VERIFY       Customer & Credit             customer                       Authoritative
                                privacy/extension ports       retention/anonymization period verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-CUS-003`    DEFERRED     Customer & Credit             customer merge workflow        Later-phase approved
                                privacy/extension ports                                      ADR/specification;
                                                                                             disabled/not assumed
                                                                                             until then.

  `DEC-HW-001`     OPEN         Tauri/Rust hardware ports     printer command set/protocol   Approved
                                                                                             product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-HW-002`     OPEN         Tauri/Rust hardware ports     scale fallback behavior        Approved
                                                                                             product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-HW-003`     OPEN         Tauri/Rust hardware ports     customer-display               Approved
                                                              interface/protocol             product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-IMP-001`    PROPOSED     Import application service +  import commit policy details   Explicit upstream
                                go-live controls                                             approval/promotion
                                                                                             before treated as
                                                                                             fixed.

  `DEC-IMP-002`    OPEN         Import application service +  import-source retention period Approved
                                go-live controls                                             product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-IMP-003`    OPEN         Import application service +  opening-stock                  Approved
                                go-live controls              migration/go-live lock policy  product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-INV-003`    OPEN         Inventory policy ports +      stock-count lock versus        Approved
                                StockCount/Inventory services snapshot/reconciliation policy product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-INV-004`    OPEN         Inventory policy ports +      physical batch                 Approved
                                StockCount/Inventory services depletion/selection rule       product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-INV-005`    OPEN         Inventory policy ports +      FEFO/expiry depletion rule     Approved
                                StockCount/Inventory services                                product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-INV-007`    OPEN         Inventory policy ports +      reorder threshold/policy       Approved
                                StockCount/Inventory services ownership                      product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-INV-008`    PROPOSED     Inventory policy ports +      opening-stock posting/go-live  Explicit upstream
                                StockCount/Inventory services policy                         approval/promotion
                                                                                             before treated as
                                                                                             fixed.

  `DEC-PAY-001`    PROPOSED     Payments provider ports +     card                           Explicit upstream
                                Country Policy                provider/manual-confirmation   approval/promotion
                                                              mode                           before treated as
                                                                                             fixed.

  `DEC-PAY-002`    PROPOSED     Payments provider ports +     QR                             Explicit upstream
                                Country Policy                provider/manual-confirmation   approval/promotion
                                                              mode                           before treated as
                                                                                             fixed.

  `DEC-PAY-003`    VERIFY       Payments provider ports +     cash-rounding values/rules     Authoritative
                                Country Policy                                               verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-PAY-004`    VERIFY /     Payments provider ports +     surcharge enablement/rules     Authoritative
                   DEFERRED     Country Policy                                               verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-PAY-006`    DEFERRED     Payments provider ports +     integrated payment provider    Later-phase approved
                                Country Policy                binding                        ADR/specification;
                                                                                             disabled/not assumed
                                                                                             until then.

  `DEC-POS-001`    OPEN         Sales/POS policy ports +      held-sale preserve versus      Approved
                                Store availability gate       reprice behavior               product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-POS-002`    OPEN         Sales/POS policy ports +      active-sale repricing behavior Approved
                                Store availability gate                                      product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-POS-003`    VERIFY /     Sales/POS policy ports +      expired-stock sale allow/block Authoritative
                   OPEN         Store availability gate       behavior                       verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-POS-004`    DEFERRED     Sales/POS policy ports +      Phase-1 SQLite survival mode   Later-phase approved
                                Store availability gate                                      ADR/specification;
                                                                                             disabled/not assumed
                                                                                             until then.

  `DEC-PUR-001`    PROPOSED     Procurement policy ports +    whether PO is universally      Explicit upstream
                                GoodsReceipt/PurchaseReturn   required or optional           approval/promotion
                                coordinators                                                 before treated as
                                                                                             fixed.

  `DEC-PUR-002`    PROPOSED     Procurement policy ports +    whether direct GRN is allowed  Explicit upstream
                                GoodsReceipt/PurchaseReturn                                  approval/promotion
                                coordinators                                                 before treated as
                                                                                             fixed.

  `DEC-PUR-003`    PROPOSED     Procurement policy ports +    supplier-reference duplicate   Explicit upstream
                                GoodsReceipt/PurchaseReturn   block/warn/exception behavior  approval/promotion
                                coordinators                                                 before treated as
                                                                                             fixed.

  `DEC-PUR-006`    RESOLVED +   Procurement policy ports +    tax recoverability             Use frozen invariant;
                   VERIFY       GoodsReceipt/PurchaseReturn   classification                 verify remaining
                                coordinators                                                 compliance
                                                                                             classification before
                                                                                             release.

  `DEC-PUR-007`    PROPOSED     Procurement policy ports +    over-receipt                   Explicit upstream
                                GoodsReceipt/PurchaseReturn   block/warn/approval behavior   approval/promotion
                                coordinators                                                 before treated as
                                                                                             fixed.

  `DEC-PUR-008`    OPEN         Procurement policy ports +    whether PO approval is         Approved
                                GoodsReceipt/PurchaseReturn   required                       product/architecture
                                coordinators                                                 decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-RET-001`    OPEN         Returns/Refund policy ports   no-receipt return eligibility  Approved
                                                              default                        product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-RET-002`    PROPOSED     Returns/Refund policy ports   final stock-disposition        Explicit upstream
                                                              vocabulary/policy              approval/promotion
                                                                                             before treated as
                                                                                             fixed.

  `DEC-RET-003`    OPEN         Returns/Refund policy ports   refund allocation              Approved
                                                              order/pro-rata rule            product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-RET-004`    OPEN         Returns/Refund policy ports   refund-method substitution     Approved
                                                              rule                           product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-RET-006`    VERIFY       Returns/Refund policy ports   tax/discount reversal          Authoritative
                                                              treatment                      verification/release
                                                                                             gate before enabling
                                                                                             affected behavior.

  `DEC-RPT-001`    OPEN by      Read-only Query/Reporting     current versus historical      Approved
                   report       layer                         report grouping policy         product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-RPT-002`    PROPOSED     Read-only Query/Reporting     final reporting projection     Explicit upstream
                                layer                         baseline/shape                 approval/promotion
                                                                                             before treated as
                                                                                             fixed.

  `DEC-SUPT-001`   OPEN         SupportGateway / Diagnostics  remote-support                 Approved
                                policy                        provider/technology            product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-SUPT-002`   OPEN         SupportGateway / Diagnostics  operational-log retention      Approved
                                policy                                                       product/architecture
                                                                                             decision before
                                                                                             implementation chooses
                                                                                             behavior.

  `DEC-SUPT-003`   PROPOSED     SupportGateway / Diagnostics  diagnostic bundle              Explicit upstream
                                policy                        PII/business-data inclusion    approval/promotion
                                                              policy                         before treated as
                                                                                             fixed.
  -----------------------------------------------------------------------------------------------------------------

## Enforcement

A module, adapter, config default, worker, API handler or UI must not
silently select any unresolved behavior above. The architecture
component exists so the eventual approved policy can be plugged in
without changing frozen ownership/atomicity/history.

## Legacy unnumbered seams

Item-code generation; skeleton-item rules; UoM/weighted-barcode depth;
category hierarchy; credential/session values; delegated
permission/override authentication; supplier numbering/duplicate
heuristics; pricing minimum-margin/maker-checker; label
hardware/workflow; counter enrollment/licensing limits; later
multi-currency remain explicit seams and are not counted in the 60.
