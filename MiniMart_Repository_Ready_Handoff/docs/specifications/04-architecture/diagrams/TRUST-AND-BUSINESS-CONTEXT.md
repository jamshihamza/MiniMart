# Trust and BusinessContext Resolution

``` mermaid
flowchart LR
  D["Enrolled Device Credential"] --> C["CounterIdentityRegistry"]
  C --> S["Store/Counter Context"]
  U["User Login"] --> SS["Store Node Session"]
  S --> BC["BusinessContext Resolver"]
  SS --> BC
  IAM["IAM Permissions/Override"] --> BC
  BD["Cash & Business Day\nBusinessDate"] --> BC
  CP["Country Policy\nRuleSetVersion"] --> BC
  BC --> CMD["Command / Posting Envelope"]
```
