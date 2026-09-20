# Read, Query and Reporting Contract

Operational queries are served through the owning module's public query
port. Values participating in posting invariants are revalidated during
posting.

Cross-module reports use the approved query-composition boundary. They
do not read another business module's private tables. Report definitions
advertise supported filters/grouping modes; the API does not guess
current-master versus historical grouping.

A persistent reporting projection is not introduced by this API
baseline; it requires an approved Database Model/migration change.
