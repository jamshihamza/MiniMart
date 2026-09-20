# Support and Diagnostics Isolation

## SupportGateway

Remote/local support actions go through a MiniMart `SupportGateway`
capability, not arbitrary shell/SQL access.

Allowed operations are explicitly allow-listed, for example: - collect
health/version information; - collect approved diagnostic bundle; - test
connectivity; - request controlled service restart; - inspect
sync/outbox summary; - run approved read-only reconciliation
diagnostics.

## Prohibited by default

-   universal support password;
-   unrestricted SQL console;
-   secret-store export;
-   raw password/PIN/PAN access;
-   arbitrary command execution;
-   rewriting immutable facts.

## Authorization

A valid SupportSession defines scope, authorizer, reason, start/expiry
and audit correlation. Elevated maintenance operations require explicit
local authorization and separate maintenance capability.

## Offline

Diagnostics can run locally without remote provider. Upload/remote
connection occurs only when connectivity and approved support policy
permit. DEC-SUPT-001 does not select a remote-support vendor.
