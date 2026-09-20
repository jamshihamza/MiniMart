# Immutability, Ledgers and Historical Meaning --- v1.2 Amendment Candidate

## Append-only protected tables

At minimum: - `inventory.stock_movements` - `payments.posted_tenders` -
`customer.credit_ledger_entries` - `cash.cash_movements` -
`accounting.financial_movements` - `audit.audit_events`

Normal application role receives INSERT/SELECT but no direct
UPDATE/DELETE on these tables.

A shared `integration.reject_immutable_change()` trigger is attached
`BEFORE UPDATE OR DELETE` as defense in depth.

## Controlled maintenance

Only a separately authorized maintenance/migration role may bypass
append-only protection, and only during: - reviewed migration; -
disaster recovery; - evidence-backed repair.

The operation requires backup/restore point and Audit/maintenance
evidence.

## Posted documents

Posted monetary/stock-bearing columns cannot be updated by normal
repositories. Corrections are reversal/return/credit documents and new
immutable facts.

## Historical snapshots

Posted documents retain item/party/price/tax/country-rule snapshots
required to interpret history after master changes.
