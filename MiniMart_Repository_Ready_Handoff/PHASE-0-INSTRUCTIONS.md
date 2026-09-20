# Phase 0 --- First Codex Instructions

Do not implement retail business features yet.

Initial target:

**Repository boots → PostgreSQL connects → Store Node starts →
Tauri/React POS starts → POS calls real Store Node `/health` → UI shows
Store Node Online → tests/CI pass.**

Then complete the approved technical spikes: - Windows Store Node
service packaging/start/stop; - PostgreSQL migration harness and
upgrade/rollback proof; - printer port/test print; - barcode scanner
keyboard-wedge capture; - non-Latin receipt rendering spike; - minimal
real Store Node → Outbox → Cloud → Inbox/Dedup → ACK sync proof; -
test/CI gates.

Before changing files, Codex must present the Phase 0 plan and exact
files it proposes to create/change.
