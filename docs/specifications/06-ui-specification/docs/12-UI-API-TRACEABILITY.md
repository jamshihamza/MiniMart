# 12 --- UI → API Traceability Rules

Every interactive screen receives a stable `UI-*` identifier.

Before UI freeze: - each command button must map to an API operation or
an explicitly local Tauri/hardware action; - each API mutation used by
the UI must have loading, success, validation, authorization, conflict
and recovery behavior; - exact-money fields must map to decimal-string
contract fields; - posted-document views must use immutable
historical/snapshot data; - BusinessContext must not be
caller-authored; - OPEN/VERIFY/PROPOSED/DEFERRED decisions must map to
capability/policy-driven UI or remain visibly unresolved.

The v0.1 registry contains initial operation mappings. They are a review
baseline, not yet a frozen one-to-one traceability matrix.
