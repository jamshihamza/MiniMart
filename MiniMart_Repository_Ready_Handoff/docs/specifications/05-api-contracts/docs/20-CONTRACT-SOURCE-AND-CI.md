# Canonical Contract Source and CI v0.3

OpenAPI 3.1 is the normative HTTP source. JSON Schema Draft 2020-12 is
normative for Hardware, Provider Adapter and Device Enrollment ports.
Generated Zod/types are never hand-edited.

Generator implementation is intentionally replaceable, but generated
validators are conformant only when they pass
`conformance/openapi-zod-conformance-v1.json`, schema/ref closure,
positive/negative fixtures, operation-ID stability, ProblemCode
synchronization and compatibility diffing. CI regenerates and
check-diffs generated outputs.

A generator/toolchain change is allowed only through a reviewed
technical change that leaves the conformance suite green; therefore
generator choice does not become a second contract source.
