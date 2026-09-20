# POS, Back Office and Hardware Boundary --- v0.3

POS and Back Office are Tauri + React + TypeScript clients of Store
Node. They never write PostgreSQL directly.

Counter-attached devices are behind Tauri/Rust MiniMart ports. The
business application sees stable capability contracts rather than vendor
SDKs.

Printing is post-commit. A printer failure never unposts a Sale/Return.
Reprint uses stable document/receipt identity and records operational
print-attempt evidence where required; physical duplicate printing
remains visible rather than changing commercial truth.

Hardware command lifecycle and error taxonomy are defined in
`25-HARDWARE-COMMAND-LIFECYCLE.md`.
