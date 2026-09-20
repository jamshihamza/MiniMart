# Device Enrollment and User Session Contract

Business trust chain remains: enrolled device → Counter identity → user
session → permission/override → BusinessContext → command.

The API freeze candidate defines a typed `Device Enrollment Port v1` as
a deployment/bootstrap contract rather than pretending the frozen
business database already contains credential columns. ENROLL,
ROTATE_CREDENTIAL and REVOKE are typed actions. The carrier, licensing
limit and exact re-enrollment policy remain unresolved legacy seams.

User sessions expose ACTIVE/LOCKED/ENDED state. Session lock does not
discard protected work. Unlock requires re-authentication. Credential
reset is an authorized recovery command and never uses a universal
hidden password. Revoked device/user/session/support authorization fails
closed.
