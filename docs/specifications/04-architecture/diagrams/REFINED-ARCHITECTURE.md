# Refined Architecture Diagrams --- v0.3

## Store runtime

``` mermaid
flowchart LR
  UI["Tauri UI"] --> API["Store Node Transport"]
  API --> APP["Application Commands/Queries"]
  APP --> COORD["Posting Coordinators"]
  COORD --> MOD["Module Public Ports"]
  MOD --> REPO["Module Repositories"]
  REPO --> PG[("PostgreSQL")]
  COORD --> AUD["Audit"]
  COORD --> OB["Outbox"]
  OB --> SYNC["Sync Dispatcher"]
  SYNC --> CLOUD["Cloud"]
```

## Code dependency direction

``` mermaid
flowchart TB
  UI["UI"] --> CONTRACT["API Contract"]
  TRANSPORT["Transport"] --> APP["Application"]
  APP --> DOMAIN["Domain / MiniMart-owned Ports"]
  INFRA["Infrastructure Adapter"] --> DOMAIN
  REPO["Repository Adapter"] --> DOMAIN
  PADAPTER["Provider Adapter"] --> PPORT["MiniMart Provider Port"]
```

Code dependencies point inward toward MiniMart-owned contracts.

## Runtime provider invocation

``` mermaid
flowchart LR
  CORE["MiniMart Core"] --> PORT["Provider Port"]
  ADAPTER["Provider Adapter"] --> PORT
  ADAPTER -. "HTTPS / SDK runtime call" .-> PROVIDER["External Provider"]
```

The dashed arrow is a runtime I/O call, not a source-code dependency
from the provider into MiniMart.
