# UnitOfWork Boundary

``` mermaid
flowchart LR
  C["Posting Coordinator"] --> U["UnitOfWork"]
  U --> S["Opaque UnitOfWorkSession"]
  S --> A["Sales public application port"]
  S --> B["Inventory public application port"]
  S --> P["Payments public application port"]
  A --> AR["Sales repository session"]
  B --> BR["Inventory repository session"]
  P --> PR["Payments repository session"]
  AR --> DB[("same PostgreSQL transaction")]
  BR --> DB
  PR --> DB
  S --> AUD["Audit"]
  S --> OB["Outbox"]
```

Only UnitOfWork owns commit/rollback.
