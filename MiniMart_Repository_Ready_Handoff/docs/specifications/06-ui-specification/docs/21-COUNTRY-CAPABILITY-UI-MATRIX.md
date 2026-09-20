# 21 --- Country Capability UI Matrix

Country-specific UI is capability/rule-set driven.

  -----------------------------------------------------------------------
  Concern                             UI behavior
  ----------------------------------- -----------------------------------
  Currency formatting                 From active store/country context

  Tax labels/fields                   Render only from verified country
                                      capability/rule metadata

  Cash rounding                       Show server-provided rounding
                                      outcome/rule identity

  Fiscal/e-invoice fields             Show only when verified capability
                                      exists

  MRP/reference price                 Render when active country/item
                                      contract exposes it

  Payment method labels               Provider-neutral core; localized
                                      labels from configured capabilities

  Historical documents                Use posted snapshots + posted
                                      country rule-set version

  Unknown/unverified capability       Do not guess; hide/disable with
                                      configuration/verification message
  -----------------------------------------------------------------------

Malaysia and India use the same core screens. No country fork is
permitted.
