# Deep Review Matrix

**Verdict:** remediation required before v0.2 Freeze Candidate. \| ID \|
Severity \| Area \| Finding \| Required outcome \|
\|---\|---\|---\|---\|---\| \| DBR-BLK-001 \| BLOCKER \| Physical
completeness \| Reference physical schema covers only 30 of 74 catalog
tables \| Produce complete v0.2 reference DDL/logical column model for
all 74 tables, even if production migrations remain later. \| \|
DBR-BLK-002 \| BLOCKER \| Tenant isolation / referential integrity \|
Owned-child foreign keys do not consistently enforce tenant agreement \|
For every tenant-bearing owned relationship, either use composite
tenant-scoped FK `(tenant_id,parent_id)` to a matching UNIQUE key, or
remove redundant child tenant_id and derive tenant through the parent.
Document one consistent rule. \| \| DBR-BLK-003 \| BLOCKER \| Decision
governance \| Database decision-seam treatment is not traceable to all
60 frozen Decision IDs \| Create a 60/60 Decision-ID matrix with
database columns/constraints/indexes/migrations affected and an explicit
'not resolved here' treatment. \| \| DBR-BLK-004 \| BLOCKER \|
Transaction envelopes \| Physical transaction specification is
incomplete versus the frozen posting-envelope matrix \| Define all 13
frozen local posting envelopes with exact lock roots/order,
revalidation, immutable facts, maintained balances, Audit, Outbox and
idempotency behavior. \| \| DBR-BLK-005 \| BLOCKER \| Concurrency \|
Cumulative Sales/Purchase return eligibility has no concrete PostgreSQL
serialization mechanism \| Choose a physical serialization strategy that
does not change business policy: e.g. `SELECT ... FOR UPDATE` on
immutable source line solely as a mutex, or transaction-scoped advisory
lock derived from tenant+source-line identity; then query cumulative
effective returns under that lock. \| \| DBR-BLK-006 \| BLOCKER \|
Ledger/current-state reconciliation \| Maintained balances lack complete
database reconciliation invariants \| Define invariant equations, update
source identity, reconciliation queries, repair policy and acceptance
tests for Inventory, Credit, Cash and Financial balances. Explicitly
define `on_hand = Σ bucket quantities` where buckets are active. \| \|
DBR-BLK-007 \| BLOCKER \| Idempotency / inbox atomicity \| Idempotency
and inbox deduplication transaction semantics are not sufficiently
precise \| Specify idempotency state machine and
locking/insert-on-conflict behavior; require inbox receipt + incoming
business effect + resulting outbox/audit to commit in the same
transaction. \| \| DBR-MAJ-001 \| MAJOR \| Numeric precision \|
`numeric(24,8)` is selected without documented capacity proof \| Create
a precision budget per value class and boundary tests; widen types if
necessary. Legal/display rounding remains CountryRuleSet policy. \| \|
DBR-MAJ-002 \| MAJOR \| Immutability \| Append-only protection is
described but not physically specified \| Specify DB role privileges
and/or immutable triggers for high-risk ledger/fact tables, with an
explicit controlled migration/repair path. \| \| DBR-MAJ-003 \| MAJOR \|
Outbox concurrency \| Outbox publisher claim/lease behavior is
unspecified \| Define outbox dispatch concurrency and at-least-once
semantics; rely on event ID/inbox dedup for duplicate delivery. \| \|
DBR-MAJ-004 \| MAJOR \| WAC reproducibility \| Moving-WAC physical
update and audit evidence are under-specified \| Define WAC transaction
formula inputs, stored evidence and reconciliation query, including free
quantity, allocated discounts, recoverable/non-recoverable tax
classification and purchase-return treatment. \| \| DBR-MAJ-005 \| MAJOR
\| Payment/refund source identity \| Tender/refund materialization
uniqueness is incomplete \| Define a non-null logical settlement source
identity/idempotency key for every PostedTender and refund settlement
path. \| \| DBR-MAJ-006 \| MAJOR \| Index/query coverage \| Index
strategy is illustrative rather than workload-complete \| Create
query/index coverage matrix with expected cardinality/selectivity and
EXPLAIN/benchmark acceptance targets. \| \| DBR-MAJ-007 \| MAJOR \|
Migration compatibility \| Cross-schema migration ordering and
application/schema compatibility contract need concrete design \| Define
migration ledger/lock, module dependency order, transactional vs
non-transactional migration rules, compatibility range and recovery
procedure. \| \| DBR-MAJ-008 \| MAJOR \| Lifecycle constraints \| Frozen
lifecycle constraints are not enumerated table-by-table \| Create
lifecycle persistence matrix: allowed stored states, required companion
timestamps/amounts, transition enforcement location and invariants for
Sale, payment attempts/commitments, Return, RefundObligation/Execution,
shifts, BusinessDay and procurement documents. \|
