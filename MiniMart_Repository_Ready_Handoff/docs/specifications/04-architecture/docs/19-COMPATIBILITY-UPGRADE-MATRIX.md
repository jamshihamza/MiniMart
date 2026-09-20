# Compatibility and Upgrade Matrix

  -----------------------------------------------------------------------
  Producer / dependency   Consumer                Gate
  ----------------------- ----------------------- -----------------------
  POS/Back Office client  Store Node API          client API version must
                                                  fall in Store Node
                                                  supported range

  Store Node              PostgreSQL schema       schema must fall in
                                                  build min/max range

  Store Node              Cloud sync              negotiated sync
                                                  contract overlap
                                                  required

  Cloud                   Store sync              negotiated sync
                                                  contract overlap
                                                  required

  Country pack            Core Country Policy     contract version
                          port                    compatible before
                                                  activation

  Hardware adapter        Tauri hardware port     port version/capability
                                                  compatible before use
  -----------------------------------------------------------------------

## Write gating

No compatibility overlap for a required write path = explicit
`UPGRADE_REQUIRED/INCOMPATIBLE` response and no business mutation.

## Rolling upgrade

Store Node is upgraded before clients when it provides an overlap
window. Cloud sync endpoints preserve at least the supported overlap
needed for stores not yet upgraded. Contract/schema removal happens only
after the old producer is outside the supported fleet.

## Schema expand/contract

Expand → compatible code → bounded backfill/reconcile → switch → later
contract.

## Failure

Interrupted migration leaves write readiness false until recovery/resume
succeeds. A newer client cannot force an older Store Node to accept
unknown command semantics.
