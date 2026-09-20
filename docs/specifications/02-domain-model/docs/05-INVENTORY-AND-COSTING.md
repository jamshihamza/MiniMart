# Inventory and Costing Domain --- v0.2

## 1. Consistency root

`InventoryPosition = ItemId × StoreId`

It is the authoritative local consistency boundary for
quantity/disposition and operational moving WAC.

## 2. Quantity by disposition

InventoryPosition distinguishes policy-defined `StockBucket/Disposition`
quantities, including at minimum the capability to represent sellable
and non-sellable states such as damaged/quarantine/other configured
buckets.

`OnHandTotal` is not automatically equal to `SellableAvailable`.

Sales availability consumes only policy-eligible sellable quantity.

The exact approved disposition vocabulary remains governed by
Return/Inventory policy; v0.2 does not hard-code a country-specific set.

## 3. Batch/expiry sub-position

Where tracking applies, bucket quantity can be further identified by
batch/expiry sub-position.

Batch physical depletion and FEFO selection remain `DEC-INV-004/005`
seams. They do not change the Item × Store root identity.

## 4. StockMovement

Every accepted stock change creates one or more immutable StockMovement
facts with: - StockMovementId; - ItemId/StoreId; -
quantity/UoM-normalized quantity; - source and destination bucket where
relevant; - movement reason/type; - source document identity; -
BusinessDate/time/actor context; - batch/expiry reference where
applicable; - cost context required to reproduce the operational value
effect; - idempotency/source identity.

No arbitrary quantity/WAC overwrite is permitted.

## 5. Moving WAC

For accepted acquisition receipt:

`newWac = (oldQty × oldWac + acquisitionValue) / (oldQty + acceptedAcquisitionQty)`

using exact decimal semantics and approved zero/opening behavior.

Frozen baseline: - free quantity contributes quantity; - deterministic
purchase discount allocation reduces acquisition value; - recoverable
tax excluded; - non-recoverable directly attributable tax included; -
ancillary landed cost remains an extension seam; - Purchase Return uses
current WAC at posting; - Sale COGS snapshot uses current operational
WAC at Sale posting; - Phase-1 negative stock is blocked.

Disposition buckets do not silently create independent costing methods.
WAC remains Item × Store unless a future approved decision changes the
costing model.

## 6. Concurrency

All stock-affecting envelopes revalidate/serialize against
`ItemId + StoreId` consistency roots. Multi-line documents may touch
multiple InventoryPosition roots under one local transaction.

Physical locking/order strategy is deferred to Database Model, but
implementation must prevent lost updates/deadlocks through deterministic
acquisition/order policy.

## 7. Stock Count

StockCount does not overwrite InventoryPosition. Completion produces
explicit CountAdjustment movements.

`DEC-INV-003` remains open: scope lock vs snapshot/movement
reconciliation. Database/UI design must stop at this policy boundary
until resolved.
