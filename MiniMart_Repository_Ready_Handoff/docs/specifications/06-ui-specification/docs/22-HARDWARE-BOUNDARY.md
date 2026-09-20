# 22 --- Hardware Boundary

**HTTP Store API** - immutable receipt render model; - required hardware
capability descriptors; - business/posting state.

**Tauri/Rust local ports** - enumerate/configure supported local
devices; - send print job; - scanner input; - cash-drawer actuation
where authorized; - local device health/test.

A print failure after a posted sale never calls a reversal. Reprint
fetches the immutable receipt model and invokes the local print port.
