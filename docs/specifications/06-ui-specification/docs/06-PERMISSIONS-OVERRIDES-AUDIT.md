# 06 --- Permissions, Overrides & Audit UX

Navigation is permission-aware but server authorization remains
authoritative.

A guarded action follows:

1.  User attempts action.
2.  UI explains why approval is required.
3.  Manager authenticates/authorizes without revealing credentials to
    cashier.
4.  Override authorization is bound to the intended action/context.
5.  Action proceeds or is denied.
6.  Audit identity is visible in history to authorized users.

Do not use generic "Admin password" dialogs. Do not let a manager leave
an unrestricted authenticated session behind at a cashier terminal.
