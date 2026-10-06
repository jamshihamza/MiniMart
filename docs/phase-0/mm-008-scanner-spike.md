# MM-008 barcode scanner keyboard-wedge spike

## Authority and scope

MM-008 in the frozen Phase-0 backlog requires a keyboard-wedge scanner spike with this acceptance
text: "Repeated scans are captured without triggering global shortcuts."

Frozen sources used: `FR-HW-007` to `FR-HW-011` and `FR-HW-048` (scanner support, terminator
handling, rapid repeated scans, unknown scan behavior, manual fallback, scanner test fixture);
UI `09-HARDWARE-UX` ("Scanner input must not trigger global shortcuts"); UI
`23-KEYBOARD-SHORTCUT-VERIFICATION` (the F-key map stays provisional until Phase-0 conflict
testing); UI `03-POS-EXPERIENCE` keyboard baseline; Architecture `25-HARDWARE-COMMAND-LIFECYCLE`
("Duplicate rapid scans are input events, not database idempotency"); API `07-HARDWARE-PORT-CONTRACT`
("Scanner events remain interaction input").

Out of scope and unchanged: item lookup, cart, price, UoM, unknown-barcode business rules, barcode
validity, device identity, scale, printer, `DEC-HW-001/002/003`, the Rust `hw-scanner` crate, the
shortcut map, and any persistence. `DEC-HW-001/002/003` concern the printer, scale and display, and
do not apply to a keyboard-wedge scanner.

## Placement and the frozen hardware boundary

The capture lives in the POS terminal UI layer (`apps/pos-terminal/src/scanner-input.ts`). No Rust
scanner port was added.

Frozen wording that supports the front-end placement:

- API `07-HARDWARE-PORT-CONTRACT`: "Scanner events remain interaction input." The hardware port
  schema (`hardware-port-v1.schema.json`) lists `SCANNER` as a capability but defines no scanner
  command: its commands are `PRINT_RECEIPT`, `READ_SCALE`, `DISPLAY_TEXT` and `OPEN_DRAWER`.
- Architecture `25-HARDWARE-COMMAND-LIFECYCLE`: "Duplicate rapid scans are input events ... POS
  interaction rules handle them."
- `FR-HW-007`: "including common keyboard/HID-style input where applicable."
- Backlog MM-007 is titled "... through Tauri/Rust port"; MM-008 is titled "Implement barcode
  scanner keyboard-wedge spike" and does not mention a Rust port.

Frozen wording that points the other way:

- UI `22-HARDWARE-BOUNDARY` lists "scanner input" among the responsibilities of the "Tauri/Rust
  local ports".
- UI `09-HARDWARE-UX`: "Hardware is surfaced through Tauri/Rust ports."
- Architecture `05` and `AGENTS.md`: counter-attached devices and hardware integration are behind
  Tauri/Rust ports. Architecture `09` lists a `crates/hw-scanner` crate.

Assessment: this is an unresolved tension in the frozen text, not a clear conflict. A keyboard-wedge
scanner is by definition an OS keyboard device that reaches the WebView as key events, and the
frozen port contract has no scanner command to implement. The spike therefore treats wedge input as
interaction input handled in the UI layer and leaves `crates/hw-scanner` untouched. Whether a Rust
port is also required (for example for non-keyboard HID or serial scanners, or to enumerate and
health-check scanners per UI 22) is an owner question; nothing here decides it, and nothing was
added for symmetry.

## Supported and unsupported input modes

Timing alone cannot prove that a scanner produced the keys. A macro or remote-control tool, an on-screen keyboard, a text-expansion tool or a very fast typist can
produce the same key events. The result is therefore always an untrusted candidate, and the
classifier errs toward leaving input alone.

| Input mode                                                                             | Behavior                                                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wedge scanner: printable keys within 50 ms, ended by Enter or Tab, 4 to 128 characters | Delivered as one `UNTRUSTED_KEYBOARD_TEXT` candidate; terminator consumed                                                                                                                                                                               |
| Scanner with configured prefix key (for example a function key)                        | Prefix key is part of the scan and never a shortcut                                                                                                                                                                                                     |
| Scanner with configured prefix or suffix text                                          | Stripped; a missing prefix or suffix rejects the scan                                                                                                                                                                                                   |
| Scanner sending function keys or Ctrl, Alt, Meta chords mid-scan                       | Suppressed; scan rejected; text left in place                                                                                                                                                                                                           |
| Human typing (gaps over 50 ms)                                                         | Ordinary typing; nothing suppressed or consumed                                                                                                                                                                                                         |
| Fast typist rolling two keys, or a single key then a shortcut                          | Ordinary typing; shortcuts work                                                                                                                                                                                                                         |
| Burst shorter than 4 characters                                                        | Ordinary typing                                                                                                                                                                                                                                         |
| Paste (Ctrl+V or paste event), then Enter                                              | Not a scan                                                                                                                                                                                                                                              |
| IME composition and the `Process` key                                                  | Never part of a scan                                                                                                                                                                                                                                    |
| Held key (auto-repeat)                                                                 | Never part of a scan                                                                                                                                                                                                                                    |
| Dictation, on-screen or assistive text that arrives without key events                 | Not seen by the capture                                                                                                                                                                                                                                 |
| Sticky Keys style modifier-only presses                                                | Neutral                                                                                                                                                                                                                                                 |
| Macro, remote-control or injected fast key bursts                                      | Indistinguishable from a scanner: treated as a scan (untrusted); not supported as a distinct mode                                                                                                                                                       |
| Scan while another text field, textarea or contenteditable element has focus           | Ignored; the capture resets                                                                                                                                                                                                                             |
| Scan while the search field has focus                                                  | Scan recognized; the field returns to the text it held before the scan                                                                                                                                                                                  |
| Scan while a non-text control (a button) has focus                                     | Terminator consumed; a Space after at least one scan key is cancelled on key down and key up so it cannot press the button (verified in a real browser); a Space that is the first key of a scan still presses the button (unsupported mode, see below) |
| Window blur, tab hidden, leaving the Sale page                                         | Partial scan discarded                                                                                                                                                                                                                                  |

## Behavior

`ScanCapture.handleKey` classifies key events:

- A scan is a burst of printable keys, each within `maxInterKeyMs` of the previous key (the limit
  applies to the terminator too), ended by a configured terminator (`Enter` or `Tab`; Shift+Enter
  and Shift+Tab are not terminators). A burst needs at least two fast keys before it can suppress
  anything.
- The delivered value is `UNTRUSTED_KEYBOARD_TEXT`. No symbology, check digit, product or device
  is inferred (`FR-HW-008`); a code with a wrong check digit and arbitrary text are delivered as
  they arrived.
- Inside a burst, function keys and Ctrl, Alt and Meta chords are suppressed
  (`preventDefault` and a flag the shell shortcut handler honors) and the burst is rejected as
  `CONTAMINATED`. Escape is not suppressed: it aborts the burst and keeps its normal meaning.
- A rejected scan resets the capture; the next valid scan works (`FR-HW-010`). A rejection after a
  burst of at least the minimum length (`CONTAMINATED`, `TOO_LONG`, prefix or suffix mismatch)
  consumes its Enter or Tab like a valid scan, so it cannot submit a form, press a focused button or
  move focus. A contaminated burst shorter than the minimum is still reported, but its terminator
  keeps its normal meaning because it may have been ordinary typing. Ordinary typing, short bursts
  and a lone Enter or Tab are never consumed. Identical rapid scans are separate events (`FR-HW-009`); nothing deduplicates them.
- Characters keep flowing to the focused field, because a scan cannot be recognized until its
  terminator. On a valid scan, or a confidently rejected one, inside the search field the shell
  restores the text that was there before the burst began, so earlier typing is not corrupted. The
  text is restored only when the burst began in that field; a burst that began elsewhere, and other
  editable controls, are never touched. A contaminated burst shorter than the minimum leaves the
  characters in the field, because it is not classified as a scan.

In the POS shell (`src/App.tsx`) a capture-phase `keydown` listener runs on the Sale page; the
existing F2 handler honors the suppression flag. A valid scan updates the status line (length only,
never the value, and a running count) and adds nothing to a sale. Manual keyboard search stays
available (`FR-HW-011`).

A Space that follows at least one fast scan key, with focus outside the search field, is cancelled
on key down and again on key up, because a focused button presses on key release. The shell
cannot know that a Space is the first key of a scan, so a leading Space still presses a focused
button. Cancelling every Space on a focused button would stop ordinary keyboard activation, and
deferring or re-issuing the click would change normal Space behaviour for all users, so neither
was done. Instead the supported capture mode is stated explicitly (next section). A person who types one key and then Space within 50 ms on a focused button would also be
blocked; that case is very rare and was accepted.

Default timings (`maxInterKeyMs` 50, minimum length 4, maximum 128) are provisional spike values.
The 50 ms threshold is not validated against any physical scanner.

## Test fixture (`FR-HW-048`)

`test/scanner-fixtures.ts` supplies representative sample codes (EAN-13, UPC-A, EAN-8, ITF-14,
Code 128 text, Code 39 text) and generators for wedge cadence, Shift-before-uppercase, and slow
human typing. The sample numeric codes have valid check digits, asserted in the tests.

## Software validation

- `test/scanner-input.test.ts` (52 tests): every fixture type at 5 to 8 ms cadence; Tab terminator;
  AltGr; 50 identical rapid scans; back-to-back scans with a 1 ms gap; a mixed burst tally; cadence
  at and beyond the limit for characters and the terminator; minimum and maximum length boundaries;
  Shift+Tab and Shift+Enter; human typing; late terminators; key repeat and IME composition;
  paste; dictation; Sticky Keys; ordinary shortcuts outside a burst; function keys and chords
  inside a burst; recovery after a rejected scan; Escape; configured prefix keys, prefix and suffix
  handling; hostile, markup, unicode and wrong-check-digit text kept as plain candidate text;
  the exact set of candidate fields.
- `test/scanner-shell.test.tsx` (42 tests): scans with focus on the page, 12 repeated scans, F2
  inside a scan, recovery after a rejected scan, existing search text preserved on a scan, text left
  alone when the scan happens elsewhere, other text fields never claimed (textarea, input,
  contenteditable), focus moving into another editable control mid-scan, a quick F2 after one key
  and Ctrl chords outside a scan, paste, IME, Tab as terminator, Shift+Tab, a focused button not
  activated by the terminator, leaving and returning to the Sale page, window blur, Escape
  cancellation, rejected scans consuming Enter and Tab and restoring search text (focused button, search field, short bursts, ordinary typing, a burst that began elsewhere, another editable control), and Space handling on a focused button
  (cancelled after scan keys on key down and key up, left alone when pressed alone or long after
  the last key or inside the search field, a leading Space captured with the barcode field or the page focused, and the unsupported
  focused-button case pinned).
- The existing 8 POS shell tests are unchanged and pass. All 102 tests pass.
- Mutation checks, each caught by the new tests and reverted: ignoring the suppression flag,
  disabling chord suppression, removing the text restore, claiming other editables, removing the
  blur and page-leave resets, lowering the burst threshold, ignoring Shift on terminators,
  removing the Space cancellation, not consuming a rejected scan's terminator, consuming a short
  contaminated burst's terminator, not restoring text after a rejected scan, and ignoring where the
  burst began.

## Supported capture mode (narrowed)

This is a proposed solution for owner review and has not been checked against a physical scanner.
The frozen UX text (UI `09`) requires only that scanner input not trigger global shortcuts and that
keyboard-wedge scanning work without modal interruption. It does not say that a scan must work
while any control has focus.

- **Supported capture context:** the barcode field has focus, or focus is on a target that has no
  default action for Space (the page or a non-interactive region). A scan is captured whole there,
  including a leading Space, and nothing can be activated.
- **Protected outside that context:** with a button focused, a Space after at least one fast scan
  key is cancelled on key down and key up, and the terminator is consumed.
- **Not supported:** a scan whose very first key is Space while a button (or another control that
  activates on Space) has focus. The button is pressed. Normal keyboard behaviour is preserved
  everywhere else, so this is a documented limit, not a claim of global scanning support.
- **Workflow remedy (later POS sale work, not done here):** keep focus in the barcode field when
  the Sale page is ready to scan.

## Real browser evidence for Space on a focused button

jsdom does not run default actions, so the tests above prove only that the shell cancels the key
events. Default-action isolation was checked in a real Chrome (Playwright keyboard input through the
browser input pipeline) against the Vite dev server, with the History navigation button focused and
a scan typed at about 0 ms between keys, then Enter:

| Case                                                                                | Result                                                        |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Control, plain page without the capture: Space in the middle, first, last, or alone | The button is pressed in every case (1 click)                 |
| Control: Space `keydown` cancelled, or `keyup` cancelled, on a plain page           | The button is not pressed (0 clicks)                          |
| Control, app: one Space on the focused button                                       | The button is pressed                                         |
| App: scan `AB CD1234` (Space inside)                                                | Not pressed; scan captured                                    |
| App: scan `12345678 ` (Space last)                                                  | Not pressed; scan captured                                    |
| App: scan `12 3456 78` (two spaces)                                                 | Not pressed; both key down and key up cancelled               |
| App: scan ` 12345678` (Space first)                                                 | **The button is pressed** (2 clicks, page left the Sale page) |
| App: slow typing, then Space on the button                                          | Pressed, as a keyboard user expects                           |

Repeated in a real Chrome (Playwright keyboard pipeline, Vite dev server) for each focus context,
scans typed at about 0 ms between keys, then Enter:

| Focus                  | `" 12345678"`                 | `"12 345678"`         | `"12345678 "`         | `"96385074"` |
| ---------------------- | ----------------------------- | --------------------- | --------------------- | ------------ |
| Barcode field          | captured, page stays          | captured              | captured              | captured     |
| Page (nothing focused) | captured, page stays          | captured              | captured              | captured     |
| History button         | **button pressed, page left** | captured, not pressed | captured, not pressed | captured     |

Control in the same run: a lone Space on the focused History button presses it. No page errors.

Result: a Space inside or at the end of a scan no longer presses a focused button. A Space that
starts a scan still does, because nothing marks a burst until its second key. This is an open
limitation of timing-based capture. It affects only barcodes whose first character is a space, and
only while a button has focus. Moving focus to the barcode field before scanning is the workflow-level
remedy and belongs to the later POS sale work.

## Real browser evidence for rejected scans

Real Chrome (Playwright keyboard pipeline, Vite dev server), scans typed at about 0 ms between keys.
Contaminated is `12`, F4, `34`, then the terminator. Overlength is 130 characters, then the
terminator. The search field held `tea` before the scan. Page state is the Sale page unless stated.

| Focus          | Scan         | Terminator | Before the fix                      | After the fix                       |
| -------------- | ------------ | ---------- | ----------------------------------- | ----------------------------------- |
| History button | contaminated | Enter      | button pressed, page left           | not pressed, status "Scan rejected" |
| History button | contaminated | Tab        | focus moved to another control      | focus stays on the button           |
| History button | overlength   | Enter      | button pressed, page left           | not pressed                         |
| History button | overlength   | Tab        | focus moved                         | focus stays                         |
| Search field   | contaminated | Enter      | form submitted, field `tea1234`     | no submit, field `tea`              |
| Search field   | contaminated | Tab        | focus moved, field `tea1234`        | focus stays, field `tea`            |
| Search field   | overlength   | Enter      | form submitted, 133 characters left | no submit, field `tea`              |
| Search field   | overlength   | Tab        | focus moved, characters left        | focus stays, field `tea`            |

Controls, unchanged by the fix: a short burst (`12`) then Enter, slow typing then Enter, and a lone
Enter on the History button still press it; a lone Enter in the search field still submits the form.
No page errors.

Prefix and suffix rejection cannot be reached in the app, because the shell uses the default
configuration. They were run in real Chrome against the module only (`ScanCapture` loaded from the
dev server): `PREFIX_MISMATCH` and `SUFFIX_MISMATCH` returned `preventDefault: true` for both Enter
and Tab. This is module evidence, not shell evidence.

## Native WebView2 attempt

A native run was attempted and gave no keyboard evidence.

- `pnpm tauri dev` compiled and launched the native window (`minimart-pos-terminal.exe`, WebView2
  runtime 154.0.4258.53). The POS shell rendered in it, confirmed with a screenshot.
- Remote debugging through `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` did not open a debugging port,
  so no browser-level driver could attach to the native window.
- Operating-system keyboard injection (`SendInput`, hardware-style scan codes) needs the POS window
  to hold the foreground. The window could not be kept in the foreground while this tooling ran.
  The injection script was then given a guard that refuses to send any key unless the POS window is
  the foreground window, and it aborted before sending anything. Before that guard existed, three
  runs failed: the first sent no events because of a struct-size bug, and the second and third
  showed no effect in the POS window and, in the third, a UI Automation focus query returned a
  control from a different application. Keys from those two runs probably went to another foreground
  application; their effect there is unverified.
- The Tauri window configuration was not changed to enable debugging, to keep the change set
  limited to the seven MM-008 paths.

No claim is made about native keyboard behavior. A native acceptance run needs either a debuggable
WebView2 (a future, separately authorized change) or a person at the keyboard with a scanner.

## Not verified (acceptance gaps)

- No physical scanner was available. The only HID device found on this machine is a generic
  keyboard, so real-scanner cadence, terminator and prefix configuration, and vendor-utility
  behavior are unverified, and the 50 ms threshold is untested against hardware.
- `FR-HW-009` "retail scan cadence under target conditions" and the Windows plus vendor-utility
  conflict testing that UI `23` requires remain open until a pilot scanner is tested.
- Native Tauri WebView2 keyboard behavior is unverified (see the native attempt above). Browser
  default actions were checked in a real Chrome for the focused-button Space case only. F-key
  browser defaults (for example F5, F11) inside a scan were checked only through `preventDefault`
  in a simulated DOM.
- A Space that is the first key of a scan can press a focused button (observed in real Chrome).
- The shortcut map is still provisional; only F2 and Escape exist in the shell. Future F4, F6, F8,
  F9 and F10 handlers must honor the same suppression flag.
- A scan arriving while focus is in a different text field is ignored on purpose; routing it to the
  barcode field belongs to the POS sale workflow.
- The Rust-versus-front-end placement question above is open for the owner. A draft ADR that sets
  out the tension and a proposed boundary was written outside the repository for the owner to
  consider; it is not part of this change and has no standing until the controlled ADR or change
  request process accepts it.
- Phase-0 sequencing is unchanged. MM-009, MM-010 and MM-011 and the Phase-0 gates in Architecture
  `33` and `13` still precede Phase 1. Any exception needs the controlled ADR or change-request
  process; owner wording alone does not reinterpret a frozen gate.

## Status

Software work for MM-008 is complete and ready for software-checkpoint review: all 102 POS tests
pass, typecheck and `pnpm run ci` pass. The spike is **not** accepted as hardware or native
acceptance. Outstanding: physical scanner testing, native WebView2 keyboard testing, validation of
the 50 ms threshold, the unsupported leading-Space-on-a-focused-button mode, and the owner questions on placement and
sequencing.
