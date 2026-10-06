# DRAFT ADR: Scanner input boundary between DOM keyboard-wedge capture and Tauri/Rust ports

- Status: DRAFT. Not proposed to the repository. Not accepted. Lives only in scratch.
- Proposals only: the shared `ScanCandidate`-shaped interface (decision 3) and any native scanner
  command or event stream (decision 4, consequences) are proposals. They are not approved
  contracts and do not amend `hardware-port-v1`.
- Date: 2026-10-05
- Scope: Interpretation of the frozen hardware boundary for scanner input. Phase 0, MM-008.
- Process: This text is not an ADR until the owner submits it through the controlled review that
  `AGENTS.md` requires for anything touching frozen semantics (`AGENTS.md`, "Approval gates":
  "Stop and get explicit owner direction before any decision touching: architecture ..."). It must
  not be treated as having reinterpreted any frozen document. `docs/adr/README.md`: "An ADR does
  not override a frozen specification. Any decision that would change frozen semantics requires
  the controlled architecture review described by AGENTS.md."

## Context

MM-008 ("Implement barcode scanner keyboard-wedge spike", acceptance "Repeated scans are captured
without triggering global shortcuts") was implemented as DOM keyboard-event handling in
`apps/pos-terminal` (`src/scanner-input.ts`, integrated in `src/App.tsx`). No Rust scanner code
was added. The frozen text points both ways.

### Frozen wording that places scanner handling behind Tauri/Rust ports

1. `AGENTS.md`, Architecture guardrails: "Hardware integration: Tauri/Rust ports."
2. Architecture `05-POS-BACKOFFICE-AND-HARDWARE.md`: "Counter-attached devices are behind
   Tauri/Rust MiniMart ports. The business application sees stable capability contracts rather
   than vendor SDKs."
3. UI `09-HARDWARE-UX.md`: "Hardware is surfaced through Tauri/Rust ports."
4. UI `22-HARDWARE-BOUNDARY.md`: "**Tauri/Rust local ports** - enumerate/configure supported local
   devices; - send print job; - scanner input; - cash-drawer actuation where authorized; - local
   device health/test."
5. Architecture `09-MONOREPO-AND-PACKAGE-STRUCTURE.md`, tree: `crates/hw-scanner/`.
6. Architecture `33-ARCHITECTURE-VALIDATION-SPIKES.md`, Spike B: "validate the Rust/Tauri hardware
   abstraction on real target hardware. Test: - barcode scanner input path; ...". Pass evidence:
   "hardware command outcomes map to the frozen hardware lifecycle and do not require POS business
   code to import device-specific SDK logic."

### Frozen wording that treats keyboard-wedge input as interaction input

7. API `07-HARDWARE-PORT-CONTRACT.md`: "Scanner events remain interaction input."
8. Architecture `25-HARDWARE-COMMAND-LIFECYCLE.md`, Scanner: "Reconnect is automatic where driver
   permits. Duplicate rapid scans are input events, not database idempotency; POS interaction
   rules handle them."
9. `FR-HW-007`: "POS shall support approved barcode scanners, including common keyboard/HID-style
   input where applicable."
10. UI `09-HARDWARE-UX.md`: "Keyboard-wedge scanning must work without modal interruption. Scanner
    input must not trigger global shortcuts."
11. UI `23-KEYBOARD-SHORTCUT-VERIFICATION.md`: the shortcut map "must be documented and tested
    against scanner/printer/vendor utilities."
12. Backlog: MM-007 is titled "Implement printer hardware spike through Tauri/Rust port"; MM-008 is
    titled "Implement barcode scanner keyboard-wedge spike" and does not mention a Rust port.

### Facts that bear on the question

- `hardware-port-v1.schema.json` lists `SCANNER` among capabilities but its commands are only
  `PRINT_RECEIPT`, `READ_SCALE`, `DISPLAY_TEXT` and `OPEN_DRAWER`. This is **not** treated as proof
  that native scanner handling is unnecessary. Item 4 and Spike B (item 6) list scanner input and
  device health as port responsibilities, and the schema may be silent because scanner behavior
  was left to a later contract, not because it was ruled out.
- A keyboard-wedge scanner reaches the WebView as ordinary key events. It is indistinguishable
  from other keyboard sources by timing alone, and it carries no device identity.
- Native concerns the frozen text assigns to ports and that DOM capture cannot provide: device
  enumeration and configuration, connected or disconnected state, reconnect, device identity,
  health and test, non-keyboard scanners (HID POS, serial or USB-CDC) and vendor utilities.

## Acceptance status: Architecture 33 Spike B is NOT satisfied

Architecture `33-ARCHITECTURE-VALIDATION-SPIKES.md`, Spike B ("printer/scanner/hardware boundary"),
requires validating the Rust/Tauri hardware abstraction on real target hardware, including the
"barcode scanner input path", with pass evidence that hardware command outcomes map to the frozen
hardware lifecycle without POS business code importing device-specific logic. The MM-008 DOM
keyboard-wedge spike is software-only. It does **not** satisfy Spike B's native or physical
hardware acceptance: it runs no Rust or Tauri scanner path, was not run in the native WebView2
window with a keyboard, and was not run with a physical scanner. It is a software checkpoint on
interaction handling only. MM-008 acceptance stays OPEN.

## Proposed decision (for owner review only)

1. **DOM keyboard-wedge capture is interaction handling.** It stays in the POS UI layer. Its job is
   to classify key events, keep scans from triggering shortcuts, and yield an untrusted candidate
   string. It infers no barcode validity, symbology, device identity or product.
2. **Native scanner and device integrations remain behind Tauri/Rust ports.** Enumeration,
   configuration, health, test, reconnect, device identity, and any non-keyboard scanner path
   belong to `crates/hw-scanner` and a port command set, in line with items 1 to 6.
3. **The two paths share one downstream interface.** Both produce the same `ScanCandidate`-shaped
   interaction event (untrusted text plus timing), so POS interaction rules (item 8) are unchanged
   by which path produced it.
4. **Absence of a scanner command does not decide the question.** Whether a scanner command set
   or event stream is added to `hardware-port-v1` is a separate contract decision for the owner.
5. **No code moves now.** MM-008 stays a front-end spike with physical and native acceptance
   pending. No Rust scanner crate work is started for symmetry.

## Alternatives considered

- **A. Wedge capture in Rust only.** Matches items 1 to 4 literally. Costs per-keystroke IPC and
  cannot see DOM focus, so it cannot isolate other editable controls or shortcuts. Rejected as the
  primary path.
- **B. Front end only, no native scanner port ever.** Matches items 7 to 10. Leaves device health,
  reconnect, enumeration and non-keyboard scanners (items 4 and 6) unowned. Rejected as a final
  state.
- **C. Proposed split (above).** Keeps frozen items on both sides true.

## Consequences

- If accepted, a later change request would define the scanner port surface (events, health,
  enumeration) in the hardware port contract. That is a frozen-contract change, not part of this
  ADR.
- UI `22` wording ("scanner input" under Tauri/Rust local ports) would then be read as covering the
  native path, with wedge capture as the documented UI-layer exception.

## Open questions for the owner

- Is a scanner command or event stream wanted in `hardware-port-v1`, and in which phase?
- Is wedge capture to be accepted as the Phase-0 scanner path, with native scanner support later?
- Which scanner interfaces are in pilot scope (keyboard wedge, HID POS, serial)?

## Not decided here

Phase-0 sequencing. The order of MM-008 to MM-011 and Phase 1A is unchanged. Any exception to
"must be completed before feature-heavy Phase 1 implementation" (Architecture `33`) needs the same
controlled ADR or change-request process; owner wording alone does not reinterpret the frozen gate.
