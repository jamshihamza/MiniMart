# API Boundary Preparation

This stage does not freeze endpoint URLs; API Contracts are the next
specification layer.

Architecture fixes these API principles:

-   POS/Back Office call Store Node, not PostgreSQL.
-   commands that can be retried carry an idempotency key;
-   mutating requests carry actor/device/business context through
    authenticated session/context resolution;
-   API responses distinguish validation, authorization,
    conflict/concurrency, uncertain external outcome and infrastructure
    failure;
-   completed commands return stable document/result identity;
-   provider-specific payloads are not leaked as core API contracts;
-   long-running/recovery states are queryable;
-   API versioning supports staged Store Node/client upgrades;
-   OpenAPI + Zod are the intended contract/validation toolchain.

The API stage will derive endpoint/command schemas from frozen Domain +
Database + this architecture, not invent new business rules.
