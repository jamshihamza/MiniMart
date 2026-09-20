# Store API Transport Security Boundary

Architecture requires authenticated encrypted client↔Store Node
transport on the store LAN/loopback.

It intentionally does **not** freeze: - LAN discovery protocol; -
certificate authority/vendor; - exact certificate rotation mechanism; -
hostname/mDNS convention.

Those belong to the API/deployment implementation contract.

Regardless of mechanism, transport identity must resolve to enrolled
device/counter identity and support revocation. Plain unauthenticated
LAN requests cannot invoke business commands.
