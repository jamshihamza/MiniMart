# MiniMart Identity and Access Functional Specification --- v0.2

**Document ID:** MM-FRS-IAM-001\
**Requirement prefix:** `FR-IAM`\
**Status:** Detailed Working Draft --- Batch 1\
**Parent:** `../FRS.md`\
**Primary BRD sources:** `BR-SEC-001` through `BR-SEC-006`, `BR-AUD-001`
through `BR-AUD-004`, `BR-SUPT-002`, `BR-SUPT-005`, `BR-SUPT-006`

## 1. Purpose

Define authentication, user lifecycle, roles, permissions, manager
approvals, sessions and restricted support access.

This specification defines functional security behaviour, not
cryptographic implementation.

## 2. Actors

-   `ACT-001` Business Owner
-   `ACT-002` Administrator
-   `ACT-003` Store Manager
-   `ACT-004` Supervisor
-   `ACT-005` Cashier
-   `ACT-006` Purchase Staff
-   `ACT-007` Inventory Staff
-   `ACT-008` Accountant / Bookkeeper
-   `ACT-009` Support Technician

## 3. Functional Requirements

### FR-IAM-001 --- Identifiable user account

**Source:** BR-SEC-001\
**Priority:** MUST\
**Phase:** 1

Each internal MiniMart user shall operate through an identifiable user
account or explicitly defined service identity.

Shared anonymous staff accounts shall not be the normal mechanism for
protected business actions.

**Acceptance:** A functional test demonstrates the stated behavior: Each
internal MiniMart user shall operate through an identifiable user
account or explicitly defined service identity.

### FR-IAM-002 --- Create user

**Source:** BR-SEC-001\

**Priority:** MUST\
**Phase:** 1\
**Actors:** ACT-002

Authorized administrators shall be able to create a user with required
identity information and initial access assignment.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized administrators shall be able to create a user with required
identity information and initial access assignment.

### FR-IAM-003 --- User uniqueness

**Source:** BR-SEC-001\

**Priority:** MUST\
**Phase:** 1

MiniMart shall prevent ambiguous active login identity within the
applicable authentication scope.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall prevent ambiguous active login identity within the
applicable authentication scope.

### FR-IAM-004 --- Activate/deactivate user

**Source:** BR-SEC-001\

**Priority:** MUST\
**Phase:** 1

Authorized administrators shall be able to activate/deactivate users.

Deactivation shall prevent new authentication while retaining historical
attribution.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized administrators shall be able to activate/deactivate users.

### FR-IAM-005 --- No destructive loss of historical actor

**Source:** BR-AUD-002\
**Priority:** MUST\
**Phase:** 1

Removing/deactivating a user shall not remove that user's identity from
historical documents or audit records.

**Acceptance:** A functional test demonstrates the stated behavior:
Removing/deactivating a user shall not remove that user's identity from
historical documents or audit records.

### FR-IAM-006 --- Password authentication

**Source:** BR-SEC-001\
**Priority:** MUST\
**Phase:** 1

MiniMart shall support secure password-based authentication for
roles/workflows requiring it.

Password storage mechanics are defined by security architecture.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support secure password-based authentication for
roles/workflows requiring it.

### FR-IAM-007 --- PIN authentication

**Source:** BR-SEC-002\

**Priority:** MUST\
**Phase:** 1

MiniMart shall support fast PIN-based authentication for approved store
workflows such as cashier access, subject to configured security policy.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support fast PIN-based authentication for approved store
workflows such as cashier access, subject to configured security policy.

### FR-IAM-008 --- PIN uniqueness/security policy

**Source:** BR-SEC-002\

**Priority:** MUST\
**Phase:** 1

MiniMart shall apply a defined policy preventing unsafe/ambiguous PIN
use within the applicable store/authentication scope.

Exact length/complexity/lockout values remain security-policy decisions.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall apply a defined policy preventing unsafe/ambiguous PIN
use within the applicable store/authentication scope.

### FR-IAM-009 --- Logout

**Source:** BR-SEC-002\

**Priority:** MUST\
**Phase:** 1

An authenticated user shall be able to end the active session.

**Acceptance:** A functional test demonstrates the stated behavior: An
authenticated user shall be able to end the active session.

### FR-IAM-010 --- Session lock

**Source:** BR-SEC-002\

**Priority:** MUST\
**Phase:** 1

MiniMart shall support locking an unattended user session without
completing or discarding protected work incorrectly.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support locking an unattended user session without
completing or discarding protected work incorrectly.

### FR-IAM-011 --- Session timeout policy

**Source:** BR-SEC-002\

**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support configurable inactivity/session controls
appropriate to store roles.

The system shall avoid timeouts that create unsafe interruption during
an in-progress posting/payment action.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support configurable inactivity/session controls
appropriate to store roles.

### FR-IAM-012 --- Failed login handling

**Source:** BR-SEC-002\

**Priority:** MUST\
**Phase:** 1

Failed authentication shall not disclose unnecessary credential/account
information and shall be subject to configured abuse/lockout controls.

**Acceptance:** A functional test demonstrates the stated behavior:
Failed authentication shall not disclose unnecessary credential/account
information and shall be subject to configured abuse/lockout controls.

### FR-IAM-013 --- Credential reset

**Source:** BR-SEC-002\

**Priority:** MUST\
**Phase:** 1

An authorized recovery process shall allow eligible user credentials to
be reset without requiring a universal hidden password.

**Acceptance:** A functional test demonstrates the stated behavior: An
authorized recovery process shall allow eligible user credentials to be
reset without requiring a universal hidden password.

### FR-IAM-014 --- No universal master credential

**Source:** BR-SEC-005\
**Priority:** MUST\
**Phase:** 1

MiniMart shall not depend on an undocumented/hardcoded universal
master-admin password or PIN.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall not depend on an undocumented/hardcoded universal
master-admin password or PIN.

### FR-IAM-015 --- Role assignment

**Source:** BR-SEC-002\
**Priority:** MUST\
**Phase:** 1

Authorized administrators shall be able to assign one or more defined
roles/access profiles to a user according to MiniMart policy.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized administrators shall be able to assign one or more defined
roles/access profiles to a user according to MiniMart policy.

### FR-IAM-016 --- Permission-based authorization

**Source:** BR-SEC-002, BR-SEC-003\
**Priority:** MUST\
**Phase:** 1

Protected operations shall be authorized using explicit
permissions/capabilities rather than only screen visibility.

**Acceptance:** A functional test demonstrates the stated behavior:
Protected operations shall be authorized using explicit
permissions/capabilities rather than only screen visibility.

### FR-IAM-017 --- Default roles

**Source:** BR-SEC-003\

**Priority:** SHOULD\
**Phase:** 1

MiniMart should provide configurable baseline roles aligned with
Administrator, Store Manager, Supervisor, Cashier, Purchase Staff,
Inventory Staff, Accountant and Support Technician.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart should provide configurable baseline roles aligned with
Administrator, Store Manager, Supervisor, Cashier, Purchase Staff,
Inventory Staff, Accountant and Support Technician.

### FR-IAM-018 --- Role customization

**Source:** BR-SEC-003\

**Priority:** SHOULD\
**Phase:** 1

Authorized administrators should be able to create or adapt
role/permission assignments without changing application code, subject
to protected system permissions.

**Acceptance:** A functional test demonstrates the stated behavior:
Authorized administrators should be able to create or adapt
role/permission assignments without changing application code, subject
to protected system permissions.

### FR-IAM-019 --- Least privilege

**Source:** BR-SEC-003\

**Priority:** MUST\
**Phase:** 1

Users shall receive only the permissions needed for their assigned
duties by default.

**Acceptance:** A functional test demonstrates the stated behavior:
Users shall receive only the permissions needed for their assigned
duties by default.

### FR-IAM-020 --- Permission change audit

**Source:** BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

User, role and permission changes shall be audited.

**Acceptance:** A functional test demonstrates the stated behavior:
User, role and permission changes shall be audited.

### FR-IAM-021 --- Protected permission administration

**Source:** BR-SEC-003\

**Priority:** MUST\
**Phase:** 1

A user shall not be able to grant permissions beyond the
permission-administration authority available to that user.

Exact delegation rules are an open policy decision.

**Acceptance:** A functional test demonstrates the stated behavior: A
user shall not be able to grant permissions beyond the
permission-administration authority available to that user.

### FR-IAM-022 --- Manager override request

**Source:** BR-SEC-003, BR-SEC-004\
**Priority:** MUST\
**Phase:** 1

When an operation requires manager/supervisor approval, MiniMart shall
allow the initiating user to request approval without abandoning the
underlying transaction.

**Acceptance:** A functional test demonstrates the stated behavior: When
an operation requires manager/supervisor approval, MiniMart shall allow
the initiating user to request approval without abandoning the
underlying transaction.

### FR-IAM-023 --- Manager identity

**Source:** BR-SEC-004\
**Priority:** MUST\
**Phase:** 1

A manager override shall record the approving user's identity separately
from the initiating user's identity.

**Acceptance:** A functional test demonstrates the stated behavior: A
manager override shall record the approving user's identity separately
from the initiating user's identity.

### FR-IAM-024 --- Override authorization

**Source:** BR-SEC-004\

**Priority:** MUST\
**Phase:** 1

Only a user possessing the required approval permission shall be able to
approve a protected override.

**Acceptance:** A functional test demonstrates the stated behavior: Only
a user possessing the required approval permission shall be able to
approve a protected override.

### FR-IAM-025 --- Override reason

**Source:** BR-SEC-004, BR-AUD-002\

**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support requiring an override reason for configured
high-risk actions.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support requiring an override reason for configured
high-risk actions.

### FR-IAM-026 --- Override scope

**Source:** BR-SEC-004\

**Priority:** MUST\
**Phase:** 1

An approval shall apply only to the intended action/transaction and
shall not silently grant the initiating user broader continuing
permissions.

**Acceptance:** A functional test demonstrates the stated behavior: An
approval shall apply only to the intended action/transaction and shall
not silently grant the initiating user broader continuing permissions.

### FR-IAM-027 --- Override expiry

**Source:** BR-SEC-004\

**Priority:** MUST\
**Phase:** 1

An unused override authorization shall expire according to a defined
policy and shall not remain indefinitely reusable.

Exact duration is an open configuration/security decision.

**Acceptance:** A functional test demonstrates the stated behavior: An
unused override authorization shall expire according to a defined policy
and shall not remain indefinitely reusable.

### FR-IAM-028 --- Store scope

**Source:** BR-SEC-003\

**Priority:** MUST\
**Phase:** 1

MiniMart shall support limiting a user's operational access to
appropriate store(s)/branch(es) where multi-store operation applies.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support limiting a user's operational access to
appropriate store(s)/branch(es) where multi-store operation applies.

### FR-IAM-029 --- Counter access

**Source:** BR-SEC-003\

**Priority:** SHOULD\
**Phase:** 1

MiniMart shall support restricting or controlling user access to
counter/POS operation where business policy requires it.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall support restricting or controlling user access to
counter/POS operation where business policy requires it.

### FR-IAM-030 --- Offline authentication

**Source:** BR-OPS-001\
**Priority:** MUST\
**Phase:** 1

Users required for ordinary local store operation shall be able to
authenticate using locally available authorization information when
internet/cloud is unavailable.

**Acceptance:** A functional test demonstrates the stated behavior:
Users required for ordinary local store operation shall be able to
authenticate using locally available authorization information when
internet/cloud is unavailable.

### FR-IAM-031 --- Offline permission enforcement

**Source:** BR-OPS-001, BR-SEC-003\

**Priority:** MUST\
**Phase:** 1

Loss of cloud connectivity shall not cause protected local actions to
bypass authorization.

**Acceptance:** A functional test demonstrates the stated behavior: Loss
of cloud connectivity shall not cause protected local actions to bypass
authorization.

### FR-IAM-032 --- Authentication service failure

**Source:** BR-DATA-005, BR-SEC-002\

**Priority:** MUST\
**Phase:** 1

If MiniMart cannot safely verify a required local user's authorization,
it shall fail closed for protected operations rather than assume access.

**Acceptance:** A functional test demonstrates the stated behavior: If
MiniMart cannot safely verify a required local user's authorization, it
shall fail closed for protected operations rather than assume access.

### FR-IAM-033 --- Support Technician role

**Source:** BR-SUPT-002\
**Priority:** MUST\
**Phase:** 1

MiniMart shall provide a restricted support-access concept that does not
automatically grant normal business-management privileges.

**Acceptance:** A functional test demonstrates the stated behavior:
MiniMart shall provide a restricted support-access concept that does not
automatically grant normal business-management privileges.

### FR-IAM-034 --- Support session authorization

**Source:** BR-SUPT-006\
**Priority:** MUST\
**Phase:** 1

Remote/elevated support access shall require explicit authorization
according to support policy and shall be time/scope controlled.

**Acceptance:** A functional test demonstrates the stated behavior:
Remote/elevated support access shall require explicit authorization
according to support policy and shall be time/scope controlled.

### FR-IAM-035 --- Support action audit

**Source:** BR-SUPT-005, BR-AUD-004\
**Priority:** MUST\
**Phase:** 1

Sensitive support actions shall be auditable with support actor, time,
store and action details.

**Acceptance:** A functional test demonstrates the stated behavior:
Sensitive support actions shall be auditable with support actor, time,
store and action details.

### FR-IAM-036 --- Sensitive information visibility

**Source:** BR-SEC-006\

**Priority:** MUST\
**Phase:** 1

Possession of general support or operational access shall not
automatically grant access to sensitive customer, credential or
financial information unrelated to the support task.

**Acceptance:** A functional test demonstrates the stated behavior:
Possession of general support or operational access shall not
automatically grant access to sensitive customer, credential or
financial information unrelated to the support task.

### FR-IAM-037 --- Current-user visibility

**Source:** BR-SEC-001\

**Priority:** MUST\
**Phase:** 1

The application shall clearly indicate the currently authenticated user
in contexts where actions are attributed to that user.

**Acceptance:** A functional test demonstrates the stated behavior: The
application shall clearly indicate the currently authenticated user in
contexts where actions are attributed to that user.

### FR-IAM-038 --- User switch

**Source:** BR-SEC-001\

**Priority:** SHOULD\
**Phase:** 1

POS workflows should support efficient authorized user switching without
incorrectly transferring the prior user's identity to subsequent
protected actions.

**Acceptance:** A functional test demonstrates the stated behavior: POS
workflows should support efficient authorized user switching without
incorrectly transferring the prior user's identity to subsequent
protected actions.

### FR-IAM-039 --- In-progress transaction attribution

**Source:** BR-AUD-001, BR-SEC-001\

**Priority:** MUST\
**Phase:** 1

Where users switch during an in-progress transaction, MiniMart shall
retain appropriate attribution for creation, approvals and final posting
according to the transaction specification.

**Acceptance:** A functional test demonstrates the stated behavior:
Where users switch during an in-progress transaction, MiniMart shall
retain appropriate attribution for creation, approvals and final posting
according to the transaction specification.

### FR-IAM-040 --- Security-relevant audit

**Source:** BR-AUD-001\
**Priority:** MUST\
**Phase:** 1

Authentication failures, credential resets, user
activation/deactivation, material permission changes and manager
overrides shall be auditable according to security policy.

## 4. Permission Families

The detailed permission catalog will be refined with each module.
Expected families include:

``` text
organization.*
users.*
roles.*
catalog.*
pricing.*
supplier.*
purchase.*
inventory.*
pos.*
payment.*
return.*
customer.*
cash.*
reports.*
audit.*
support.*
```

Permission names are contract concepts here; exact implementation is
deferred.

## 5. Acceptance Scenarios

### AC-IAM-001 --- Cashier login offline

Given Store Node is operational and internet is unavailable, an active
cashier with locally available authorization can authenticate and
perform permitted local POS work.

### AC-IAM-002 --- Deactivated user

After a user is deactivated, new login is denied while historical
documents continue to display the original actor.

### AC-IAM-003 --- Manager override

A cashier lacking price-override authority can request approval; an
authorized manager approves; the transaction records both actors; the
cashier does not receive permanent override permission.

### AC-IAM-004 --- Unauthorized permission administration

A user without role/permission administration authority cannot grant
themselves or another user protected permissions.

### AC-IAM-005 --- Support session

A Support Technician can access only the authorized support capabilities
for the authorized session; sensitive actions are audited.

## 6. Open Decisions

-   PIN minimum length and retry/lockout policy.
-   Password policy.
-   Exact session timeout by role.
-   Whether users can have multiple roles or one composite role in the
    initial UI.
-   Exact delegated permission-administration model.
-   Support-session approval and duration.
-   Whether cashier user switching is PIN-only after initial login.
-   Whether manager override can be performed by PIN, password, device,
    or combinations.

## 7. Traceability Summary

`BR-SEC-001 → FR-IAM-001, 006–014, 030–032`\
`BR-SEC-002 → FR-IAM-015–021, 028–029`\
`BR-SEC-003 → FR-IAM-016, 022–027`\
`BR-SEC-004 → FR-IAM-022–027`\
`BR-SEC-005 → FR-IAM-013–014`\
`BR-SEC-006 → FR-IAM-020, 040`\
`BR-SUPT-002/005/006 → FR-IAM-033–036`

**Acceptance:** A functional test demonstrates the stated behavior:
Authentication failures, credential resets, user
activation/deactivation, material permission changes and manager
overrides shall be auditable according to security policy.
