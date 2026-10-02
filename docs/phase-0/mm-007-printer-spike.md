# MM-007 receipt-printer hardware spike

## Authority and scope

MM-007 in the frozen Phase-0 backlog requires a receipt-printer test through
the Tauri/Rust port without coupling a driver to a business module.
Architecture §05 keeps counter hardware behind native ports; §25 requires
stable outcomes and treats uncertain printing as possible duplicate paper.
Architecture §33 requires real target hardware for physical spike evidence.
`DEC-HW-001` remains OPEN: this spike does not choose a supported production
printer model, command set, or interface baseline. MM-009 owns non-Latin raster
receipts. Sale posting, reprint, cash-drawer, and printer settings UI are out of
scope.

## Candidate Windows path

`crates/hw-printer` owns the fixed ASCII diagnostic payload, queue-name
validation, one-attempt gate, hardware categories, and Windows spooler adapter.
The adapter opens an explicitly named Windows printer queue and submits one
`RAW` job with `OpenPrinterW`, `StartDocPrinterW`, `StartPagePrinter`,
`WritePrinter`, `EndPagePrinter`, and `EndDocPrinter`. RAII guards close the
handle and abort an incomplete job. Native FFI is confined to
`windows_spooler.rs`; only this crate opts out of the workspace's blanket
unsafe-code prohibition. It retains Clippy gates and documents each unsafe
call.

`apps/pos-terminal/src-tauri` exposes one native command:
`print_mm007_diagnostic`. It accepts no printer name or arbitrary bytes from
the WebView. The command module is behind `#[cfg(debug_assertions)]` in
`lib.rs`, so a release build neither compiles nor registers it; a release
build cannot invoke it at all, not even to receive an `UNSUPPORTED` reply.
Within a debug build it still requires explicit opt-in at runtime via
`MINIMART_MM007_ENABLE_TEST_PRINT=1` and
`MINIMART_MM007_PRINTER=<exact Windows queue name>` in the host environment;
this gating decision is implemented as a small pure function
(`diagnostic_gate`) covered directly by unit tests. It runs blocking spooler
calls off the UI thread. There is no cashier UI trigger, new Tauri capability,
permission, printer configuration, or automatic retry. The gate allows at
most one submission attempt per process, including an uncertain failure. No
CI test invokes the physical spooler path. The capability file's description
(`apps/pos-terminal/src-tauri/capabilities/default.json`) names both
registered commands and notes the diagnostic one is debug-only.

The payload is under 256 bytes, ASCII only, with CRLF line endings and
number/letter rows. It contains no sale, customer, money, or device data.
There is no feed, cut, ESC/POS command, image, or Unicode rendering.

Windows spooler return values prove only application submission to the
spooler and an accepted byte count. `SUCCESS` in the native reply means
**spooler accepted the job**; `physicalOutputVerified` is always false.
Queue processing and physical paper output require separate observation.
RAW ASCII is a candidate transport and may not be understood by a given
receipt printer. An incomplete or failed call can still have produced paper,
so no automatic retry occurs. Error categories are `INVALID_DATA`,
`NOT_CONNECTED`, `DRIVER_ERROR`, `UNSUPPORTED`, and `BUSY`; OS details
are not returned to the WebView. Failures after a job starts return
`UNKNOWN` outcome and category, since paper output cannot be ruled out.

## Discovery and physical evidence

Development discovery uses read-only `Get-CimInstance Win32_Printer`; queue
presence does not imply receipt capability. On this machine the installed
queues are Microsoft Print to PDF, AnyDesk Printer, and EPSONAB5CCB (L3250
Series), an Epson office printer on a WSD port with Microsoft IPP Class Driver.
No receipt printer was detected. No physical diagnostic job was submitted.
Printer make/model, paper width, receipt output, line breaks, feed, cut, and
error/reconnect behavior on target hardware remain unverified. A PDF or office
printer is not counted as receipt-printer acceptance.

For a later controlled physical run, identify an approved receipt printer and
its exact Windows queue, confirm that it accepts RAW ASCII, set the two host
environment variables, start the native Tauri development app, and invoke the
single diagnostic command once. Record queue, driver, connection, observed
paper, text/line breaks, and any errors. Do not infer paper output from a
Windows job ID. Do not repeat an uncertain print without first checking the
queue and paper.

## Software validation

The four `hw-printer` unit tests cover bounded ASCII payload, explicit
validated queue names, stable errors, and no retry after uncertainty. On the
Tauri side, one test verifies that a successful spooler reply never claims
physical output, and three focused tests exercise `diagnostic_gate` directly
(without touching the async command, the real environment, or the spooler):
the flag unset/blank/`"0"`/anything-but-exactly-`"1"` case, the flag-enabled
but queue-missing case, and the flag-enabled-with-queue pass-through case.
Windows CI and the local `check:rust` gate run all of these without printer
access, in addition to locked checks, formatting, and Clippy. This implements
runnable Rust ownership tests; the MM-012 JavaScript package ownership
checker is unaffected.

Software-only validation on 2026-10-02 passed without invoking the physical
spooler path: the printer crate passed 4/4 tests; the native Tauri crate passed
4/4 tests; and `pnpm run check:rust` passed the root and Tauri locked checks,
rustfmt checks, tests, and Clippy with warnings denied. `pnpm run ci` also
passed formatting, ESLint, frozen-manifest verification (419 files across
seven manifests), protected-test ownership, dependency boundaries, and the
TypeScript build. No diagnostic print was invoked.

### Software cleanup (post-review)

Following the MM-007 read-only acceptance review, a narrow software cleanup
pass made four changes, all without altering the approved
POS/Tauri→`crates/hw-printer`→Windows-spooler boundary, the ASCII-only
diagnostic payload, the one-attempt gate, or the `HardwareCommandResult`/error
taxonomy from Architecture §25:

- the `printer_spike` module and the `print_mm007_diagnostic` command
  registration moved from a runtime `cfg!(debug_assertions)` check to a
  compile-time `#[cfg(debug_assertions)]` gate in `lib.rs`, so a release
  build no longer compiles or registers the command at all;
- the runtime enable-flag/queue gating logic was extracted into a pure
  `diagnostic_gate` function and given three focused unit tests;
- `capabilities/default.json`'s description was corrected — it previously
  said the window exposed only the Store Node status command, which was
  already stale before this pass;
- this document was updated to describe the above.

A subsequent software-validation fix normalized `printer_spike.rs` to
`rustfmt` output and changed the success-path gate test to avoid requiring the
error reply type to implement `Debug`. This changed test mechanics only, not
the native command or printing behavior.

No printer status, reconnect/disconnect handling, production print-job
identity, timeout handling, capability negotiation, ESC/POS, or non-Latin
raster rendering was added. No physical print was attempted; no receipt
printer is available in this environment.

Status: **software validation passed; physical receipt printer validation
still PENDING**. MM-007 is not being marked closed. A real target receipt
printer must still be observed, and the scope question raised in the
acceptance review (whether printer status and reconnect/disconnect evidence
belong to MM-007 or a separate item) still needs a controlled decision before
MM-007 can be considered fully closed.
