# MiniMart Project Context

MiniMart is an offline-first retail POS and retail-management platform.

A store has a local Store Node and PostgreSQL authority. One-counter
deployments may colocate Store Node + PostgreSQL + POS on one PC.
Multi-counter stores use a designated server/back-office PC and
LAN-connected terminals. Cloud does not run billing and must not gate
local store operation.

Primary shells: - POS terminal - Back Office - Cloud management (no
checkout)

Malaysia is the first country context and India follows. Current
legal/statutory values must be verified from authoritative sources
during implementation. The core remains country-neutral and uses
versioned country packs/rule sets.
