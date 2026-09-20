# OpenAPI / Zod Source Direction v0.2

The v0.1 dual-source wording is superseded.

For HTTP surfaces, checked-in OpenAPI 3.1 is normative. Implementation
tooling generates Zod validators/types and client/server contract types
from the OpenAPI schemas. CI regenerates and fails on drift.

For non-HTTP Hardware, Provider Adapter and Device Enrollment ports,
checked-in JSON Schema Draft 2020-12 is normative; language-specific
bindings are generated.

This preserves the frozen Architecture requirement to use OpenAPI + Zod
while eliminating two independently editable sources of truth.
