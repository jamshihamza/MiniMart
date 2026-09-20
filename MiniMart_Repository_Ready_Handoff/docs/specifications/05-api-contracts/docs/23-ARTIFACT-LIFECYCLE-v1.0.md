# Artifact Lifecycle Contract v1.0
Uploads are private until complete size and SHA-256 validation succeeds. `SystemCapabilities.artifactPolicy.maxImportArtifactBytes` publishes the limit. Partial uploads are automatically cleaned on abort/timeout/disconnect. `API-IMP-013 DELETE /api/v1/artifacts/{artifactId}` idempotently removes a committed but unconsumed import artifact.
