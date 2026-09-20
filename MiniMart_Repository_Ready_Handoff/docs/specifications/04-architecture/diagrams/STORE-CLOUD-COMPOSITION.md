# Store and Cloud Shared Runtime Composition --- v0.3

``` mermaid
flowchart TB
  R["Shared Node.js + TypeScript
Service Runtime / Composition Framework"]
  EDGE["apps/store-node
thin edge launcher"]
  CLOUDAPP["apps/cloud
thin cloud launcher"]
  EDGE -->|"mode=edge"| R
  CLOUDAPP -->|"mode=cloud"| R

  R --> CAPS{"Capability registration"}
  CAPS --> STORE["Edge capability set"]
  CAPS --> CLOUD["Cloud capability set"]

  STORE --> PC["13 Store Posting Coordinators"]
  STORE --> LDB[("Store PostgreSQL")]
  STORE --> OUT["Outbox / Inbox / Store workers"]

  CLOUD --> ING["Sync ingest / projections / management"]
  CLOUD --> CDB[("Managed PostgreSQL")]
  CLOUD -. "Store Posting coordinators NOT registered" .-> X["Store checkout/posting authority"]
```

The launchers differ; the runtime framework and shared
business/application packages do not fork.
