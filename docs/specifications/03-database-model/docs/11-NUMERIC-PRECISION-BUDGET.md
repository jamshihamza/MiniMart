# Numeric Precision Budget

Storage baseline: `numeric(24,8)` = up to 16 integer digits and 8
fractional digits.

  ---------------------------------------------------------------------------
  Value class               Application operating limit Storage
                                    for v1.2 amendment validation 
  ------------------------ ---------------------------- ---------------------
  Quantity per line                    \< 1,000,000,000 numeric(24,8)

  On-hand quantity per            \< 10,000,000,000,000 numeric(24,8)
  Item×Store                                            

  Unit price / unit cost           \< 1,000,000,000,000 numeric(24,8)

  Document line/total             \< 10,000,000,000,000 numeric(24,8)

  Credit/payable/account      \< 10,000,000,000,000,000 numeric(24,8)
  balance                                               

  Tax/discount/rounding            same bound as owning numeric(24,8)
  amount                                       document 
  ---------------------------------------------------------------------------

The limits are technical capacity guards, not commercial/legal limits.

## Intermediate arithmetic

Application decimal context must carry at least 34 significant digits
for multiplication/division such as `qty × unit_cost` and WAC numerator
calculations. Persist only after explicit quantization to the storage
scale.

## WAC

For a receipt:

`new_qty = old_qty + accepted_qty`

`acquisition_value = net attributable acquisition value after frozen discount/tax classification`

If `new_qty > 0`:

`new_wac = (old_qty × old_wac + acquisition_value) / new_qty`

Store WAC evidence on the receipt/stock-cost fact: - prior qty; - prior
WAC; - accepted paid qty; - free qty; - allocated discount; -
recoverable tax excluded; - non-recoverable attributable tax included; -
acquisition value; - resulting qty; - resulting WAC.

Purchase Return uses current Store WAC at posting.

## Boundary tests

Automated DB/application tests cover maximum accepted values, one unit
beyond the application limit, fractional quantity precision, repeated
WAC calculations and rounding at country/document boundaries.
