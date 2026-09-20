# Monorepo and Package Structure --- v0.3

``` text
minimart/
├─ apps/
│  ├─ pos-terminal/
│  ├─ backoffice/
│  ├─ store-node/          # thin edge launcher
│  └─ cloud/               # thin cloud launcher
├─ packages/
│  ├─ service-runtime/     # shared Node service bootstrap/composition framework
│  ├─ shared-kernel/
│  ├─ application/coordinators/
│  ├─ modules/
│  │  ├─ organization/
│  │  ├─ iam/
│  │  ├─ catalog/
│  │  ├─ pricing/
│  │  ├─ procurement/
│  │  ├─ inventory/
│  │  ├─ sales/
│  │  ├─ payments/
│  │  ├─ returns/
│  │  ├─ customer-and-credit/
│  │  ├─ cash-business-day/
│  │  ├─ accounting-lite/
│  │  └─ country-policy/
│  ├─ query/               # public-port composition; no business-schema SQL
│  ├─ database/
│  ├─ sync-protocol/
│  ├─ api-contract/
│  ├─ country-packs/
│  ├─ observability/
│  └─ test-support/
├─ crates/
│  ├─ hw-printer/
│  ├─ hw-scanner/
│  ├─ hw-scale/
│  └─ hw-display/
├─ database/migrations/
├─ docs/
├─ infra/
├─ AGENTS.md
└─ README.md
```

`apps/store-node` and `apps/cloud` are deployment launchers over the
same `packages/service-runtime` framework. They select an explicit
runtime mode and capability set; they do not duplicate business/runtime
implementations.

Each package declares `minimart.layer`, `minimart.module` and allowed
capability tags. CI rejects forbidden imports/cycles.

`packages/query` composes public query ports. It has no privilege to
read business-module schemas directly. Any future persistent reporting
projection must own its own approved schema/tables.
