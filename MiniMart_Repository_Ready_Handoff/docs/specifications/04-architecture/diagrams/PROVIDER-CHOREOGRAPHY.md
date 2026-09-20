# Provider Choreography

``` mermaid
sequenceDiagram
  participant POS
  participant SN as Store Node
  participant DB as PostgreSQL
  participant P as Provider
  POS->>SN: Pay(idempotencyKey)
  SN->>DB: Tx A: persist PaymentAttempt/request identity
  DB-->>SN: commit
  SN->>P: provider call (outside DB tx)
  alt confirmed
    P-->>SN: success
    SN->>DB: Tx B: confirm attempt + PaymentCommitment
    DB-->>SN: commit
    SN->>DB: Sale Posting Envelope
    DB-->>SN: Sale + Stock + PostedTender + Audit + Outbox commit
  else failed
    P-->>SN: explicit failure
    SN->>DB: record FAILED
  else timeout/lost response
    SN->>DB: record UNCERTAIN
    SN->>P: reconcile same request identity
    P-->>SN: confirmed/failed/unknown
  end
```
