# Sync Apply Boundary

``` mermaid
flowchart LR
  PEER["Authenticated Peer"] --> V["Contract + Ownership Validation"]
  V --> IN["InboxReceipt Claim"]
  IN --> H["Declared Module Apply Handler"]
  H --> E["Allowed Effect"]
  H --> A["Audit"]
  H --> O["Outbox if allowed"]
  E --> TX[("One transaction")]
  A --> TX
  O --> TX
  IN --> TX
```
