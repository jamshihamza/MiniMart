# Phase 0 --- Implementation Instructions

Do not implement retail business features yet.

Use the **exact frozen monorepo structure** in:
`docs/specifications/04-architecture/docs/09-MONOREPO-AND-PACKAGE-STRUCTURE.md`

Initial executable milestone:

**PostgreSQL connects → Store Node starts → POS terminal starts → POS
calls the frozen Store Node system health/readiness contracts → UI
displays Store Node Online when authoritative conditions are met →
automated checks pass.**

Phase 0 then covers: - Windows Store Node service
packaging/start/stop; - PostgreSQL migration harness and
upgrade/rollback proof; - printer Tauri/Rust port spike; - barcode
scanner keyboard-wedge spike; - non-Latin receipt rendering spike; -
minimal real Store Node → outbox → cloud → inbox/dedup → ACK sync
proof; - CI/test gates.

Before writing code, present the exact proposed file changes,
dependencies and tests. Any proposed repository/package name that
differs from the frozen Architecture v1.0 structure requires explicit
approval.
