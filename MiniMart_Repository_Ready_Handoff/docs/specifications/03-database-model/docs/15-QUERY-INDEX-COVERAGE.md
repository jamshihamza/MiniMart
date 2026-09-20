# Query and Index Coverage v1.2

New master lookups use tenant-leading normalized indexes: - Company
identifiers:
`(tenant_id, normalized_identifier_value, identifier_type_code)` -
Supplier identifiers:
`(tenant_id, normalized_identifier_value, identifier_type_code)` -
Customer identifiers:
`(tenant_id, normalized_identifier_value, identifier_type_code)` - Store
service instances: `(tenant_id, store_id, status)`

Existing v1.0 operational index coverage remains unchanged.
