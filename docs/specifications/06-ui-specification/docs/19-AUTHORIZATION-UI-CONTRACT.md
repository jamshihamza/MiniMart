# 19 --- Authorization UI Contract

Role names are UX archetypes only. They do not grant authority.

Each API operation's `permission_code` is the action-level authorization
vocabulary. The UI uses session authorization/capability data to show,
disable or hide actions appropriately; the server must still reject
unauthorized requests.

Manager override is a separate, audited authorization object bound to
action/context. The cashier never receives or stores manager
credentials.
