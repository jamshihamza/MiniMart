# NFR Contract and Release Gates

The exact 84-NFR matrix is in `traceability/NFR-TO-API-v0.2.*`.

Three frozen performance flows are explicit: - NFR-PERF-001: barcode
resolve/add-line path (`API-CAT-002 → API-POS-004`) is benchmarked
against the frozen \<100 ms target. - NFR-PERF-002: indexed catalog
search (`API-CAT-001`) is benchmarked against the frozen \<50 ms target
around the stated \~50k-item scale. - NFR-PERF-003: confirmed local
payment → Sale posting → receipt-ready (`API-POS-012 → API-POS-013`) is
benchmarked against the frozen normally \<1.5 s target, excluding
provider/printer time.

Release tests also include offline cloud loss, crash/replay, concurrent
held Sale/Return/credit, provider uncertainty, sync duplicate delivery,
restore testing and Unicode receipt rendering.
