# Security, Tenancy and Privacy

## 1. Tenant isolation

Repository methods require tenant context.

Database roles for the application do not receive unrestricted
cross-tenant administrative access.

Composite tenant-scoped uniqueness prevents accidental cross-tenant
collisions where relevant.

## 2. Credentials

Password/PIN hashes are stored only in IAM-owned credential fields using
the approved modern password-hashing approach.

No plaintext password/PIN.

No payment PAN storage.

Provider tokens/secrets belong in OS secret storage or approved secret
infrastructure, not normal business tables.

## 3. Sensitive customer/supplier data

Store only fields required by frozen requirements/current verified
country needs.

Retention/anonymization periods remain verification decisions.

## 4. Support access

SupportSession rows record: - authorized user/approver; - scope; -
start/expiry; - consent/reference; - reason; - audit correlation.

There is no universal hidden support credential.

## 5. Audit

Sensitive actions create append-only `audit.audit_events`.

Audit event payloads avoid unnecessary secret/PII duplication.

## 6. Row-level security

RLS is not required for v0.1 Store Node correctness because application
repositories already enforce tenant scope and the deployment is
dedicated.

RLS remains an optional defense-in-depth/cloud-hosting refinement and
must be evaluated before shared multi-tenant cloud operation.
