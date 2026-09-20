# Import / Export / Job / Artifact Lifecycle

Import source registration records local artifact handle, filename,
media type, SHA-256 and size. Template discovery declares supported
CSV/XLSX layouts. Import job validates, previews/errors, commits through
normal domain commands and supports safe cancellation only at declared
boundaries.

Export returns an ExportJob and later an ExportArtifact descriptor with
checksum, size, media type, filename and short-lived local download
handle. Artifact retention remains a policy seam.

Long-running backup, restore-test, diagnostic and import/export work
returns OperationJob. `GET /operations/{id}` is the common
recovery/status route; cancellation is only honored when
`cancelSupported=true`.
