# ADR 0009: One MiniMart desktop application with separate POS and Back Office workspaces

- Status: Recorded from owner direction; it takes effect in the repository only when this change is
  committed. One part (change request CR-0009-A below) needs the controlled change process before
  that part is implemented. A bounded, preview-only slice is implemented on the branch that carries
  this record (see "Preview implementation"); no production behavior is.
- Date: 2026-10-06
- Scope: Architecture placement and implementation scope for the client application. It changes no
  frozen text, no backlog item, no design status and no business, API, data, security or hardware
  decision.
- Direction: the repository owner directed this architecture in writing during the working session:
  one MiniMart application with distinct POS and Back Office workspaces, selected through a workspace
  switch. This record does not ask for that approval again.

## Numbering note

ADR 0006 exists on `wip/mm-009-raster-spike`. A draft ADR 0007 (the bounded visual-only exception for
the five Back Office design packages) exists uncommitted on the Reporting WIP branch
`wip/visual-reporting-ui`. ADR 0008 (the bounded visual-only POS exception) is on
`wip/visual-pos-ui`. No ref, worktree or draft uses 0009.

## Context

The frozen Architecture v1.0 structure lists `apps/pos-terminal` and `apps/backoffice` as separate
directories, and states that POS and Back Office are Tauri + React + TypeScript clients of Store Node
that never write PostgreSQL directly (`04-architecture/docs/05-POS-BACKOFFICE-AND-HARDWARE.md`,
`09-MONOREPO-AND-PACKAGE-STRUCTURE.md`, `decisions` ARCH-003). The frozen UI specification defines
three experience shells (POS, Back Office, Cloud Web) and says the POS shell "is not a miniature Back
Office" and limits POS navigation to Sale, History, Returns, Shift and authorized cash actions
(`06-ui-specification/docs/00-UI-SPECIFICATION.md`, `02-INFORMATION-ARCHITECTURE-AND-NAVIGATION.md`).

Current state, verified from Git:

- `apps/pos-terminal` is the only application with a Tauri host (`src-tauri`, window label `main`,
  capability `main`, identifier `com.minimart.pos`). It holds the approved visual POS implementation
  (checkpoint commit `fcb253fa3e1624bd24fe980bc6c5f841cacda857`, 31 screens) and the MM-008 scanner
  code. Its entry point `src/main.tsx` renders `PosApp` directly; there is no router. The scanner
  capture and the F2 shortcut are registered only while the Sale page is mounted, and their cleanup
  resets the capture.
- `apps/backoffice` is a stub package (`minimart.layer` `ui`, no Tauri host, no entry point on
  `main`). The Reporting visual-UI WIP, which is uncommitted and not part of this work, builds a
  standalone Vite application in it with its own hash router.
- The Back Office design package is `review-ready`. The module packages keep their own statuses:
  Reports, Procurement, Customers + Credit, Cash / Business Day and Accounting-Lite are
  `approved-visual-reference`; Inventory is `draft`; POS is `approved-visual-reference`.
- The dependency checker forbids packages importing `apps/*`. It does not forbid one app importing
  another, but it requires every workspace import to be a declared dependency.

## Decision

### D1. One application, two workspaces, one host

MiniMart ships as one desktop application. It exposes two workspaces, **POS** and **Back Office**, and
a workspace switch. The Tauri host stays in `apps/pos-terminal`. The Back Office workspace code stays
in `apps/backoffice`, which is kept as a workspace package and exports one React workspace entry. The
host imports it; the Back Office package never imports the host. No new application or package is
created. `apps/store-node`, `apps/cloud` and the Cloud Web shell are unchanged and are not part of
this application.

Rejected placements:

- A new shared host package: it is not in the frozen structure, and `packages/ui` is a forbidden
  legacy directory in the boundary checker.
- Hosting in `apps/backoffice`: it has no Tauri host and no scanner or Store Node status code, and
  moving them would change the approved POS and MM-008 files.

### D2. Separate routes and navigation

The workspace is the first segment of the application route: `#/pos/...` and `#/back-office/...`.
Each workspace owns its own navigation, top bar and routes; no navigation entry is shared between
them. The POS workspace keeps its current internal state flow and its `?screen=` preview parameters
unchanged. The Back Office router receives a base path so that its routes live under
`#/back-office`. Only the active workspace is mounted. The inactive workspace is not kept mounted
or hidden.

### D3. Approved POS appearance and scanner coverage are preserved

The POS workspace renders `PosApp` as approved. The host wraps it and does not edit the 30
implementation files whose hashes are bound in `docs/design/pos/provenance.json`
(`implementationApproval`). Changing any of them voids that binding until the owner re-approves. The
existing scanner suites (`scanner-input.test.ts` and `scanner-shell.test.tsx`, 94 tests) stay
unchanged and must pass. The 124-screen reference comparison is re-run after any stylesheet-scope
change (see D9).

### D4. Scanner capture and shortcuts belong to the POS context only

- Scanner capture, scanner-owned key suppression and the F2 and other POS shortcuts exist only while
  the POS Sale context is mounted, as they do today.
- Leaving that context, by changing page or workspace, runs the existing cleanup: listeners are
  removed and the partial capture is reset (`ScanCapture.reset()`), and returning does not resume a
  half-finished scan.
- The Back Office workspace registers no scanner listener, and its own shortcuts (such as the frozen
  Ctrl+K) exist only inside it. A POS handler never runs in Back Office and the reverse.
- Required new tests: switching workspace mid-burst resets the capture; a scan-like burst in Back
  Office does nothing; F2 does nothing in Back Office; a Back Office shortcut does nothing in POS.

### D5. Store Node, Cloud and Rust hardware boundaries are unchanged

Both workspaces are clients of Store Node and never write PostgreSQL. Cloud keeps no store checkout.
Hardware stays behind the Tauri/Rust ports. The Store Node status probe stays in the POS host. The
Back Office package does not import `@tauri-apps/*` or call `invoke`; if Back Office ever needs a
device, it uses a port interface supplied by the host, reviewed separately. The Tauri capability file
and window label are not changed by this decision.

A test enforces that rule as a **source-text boundary only**. It shows that today's Back Office source
does not import Tauri, the POS application or a network client. It does **not** prove runtime IPC
isolation. Both workspaces run in one shared Tauri window and one capability scope, and Tauri cannot
scope permissions per route. The production capability and security design is pending, and nothing in
this record or in the preview is a production security claim.

### D6. Authorization is server-enforced

The workspace switch and the deep links are presentation. Whether a user may enter or use a workspace
is decided by Store Node from the enrolled device, counter identity, user session and permissions
(`07-SECURITY-AND-TRUST-BOUNDARIES.md`, `17-STORE-NODE-TRUST-SESSION.md`, API-IAM-004). The client may
show, hide or disable the switch from session data, but the server must still reject unauthorized
requests, and a deep link must still pass permission and context checks. A client-side availability
setting never grants access. The visual-only phase has no authentication; any switch built then is
labelled preview-only.

### D7. Workspace availability is deployment-specific

A deployment may offer POS only, Back Office only, or both. Both workspaces are not assumed on every
terminal. Availability has two layers, and neither grants access:

1. what the build contains (a profile may omit a workspace), and
2. what the installation or deployment offers.

The mechanism for layer 2, including which configuration class and scope owns the setting, is **not
resolved here** (see "Open seams"). The preview uses a labelled preview-only URL parameter
(`?workspaces=pos`, `?workspaces=back-office`, or both by default). It is not a build, enrollment or
server setting, adds no API contract, and authorizes nothing. When only one workspace is available, there is no switch, and a
deep link to the other workspace shows a not-available state. When both are available, the landing
workspace follows the role home in `14-ROLE-EXPERIENCE.md`.

### D8. Design statuses are untouched

No manifest status changes. POS stays `approved-visual-reference`. The Back Office shell package stays
`review-ready`. Each module package keeps its own status. The workspace switch is in neither the
approved POS reference nor the Back Office design, so its look and place are a design question until
the owner approves it. The owner chose a host-level menu outside the POS navigation. In the preview it
is a visibly labelled preview-only control rendered by the host outside the approved POS DOM; its
final visual design is not approved. The owner rejected a first candidate (a floating control at the
bottom left, which covered the lowest sidebar row) and asked for a compact host-level header at the
top right. That header is the current candidate and has **not** been visually approved.

### D9. Isolation of styles

The POS stylesheet has global rules (`html, body`, `#root`, `*:focus-visible`). Back Office styles must
be scoped to the Back Office workspace root so neither workspace changes the other. Any change to POS
styles to achieve this is a change to an approved file and needs the re-approval described in D3.

### D10. Naming and identity are not changed

`productName` "MiniMart POS", identifier `com.minimart.pos`, window label `main` and capability
`main` stay as they are. The identifier scopes OS-protected storage for device credential material and
update channels, so renaming it, and naming the unified product, is a separate decision.

### D11. Work stays within the bounded Phase-0 exception

Implementation of this decision is frontend-only with fictional data, under the same limits as ADR
0008 (no business logic, calculation, persistence, API, sync, authentication, authorization or
hardware operation). ADR 0008 covers only the POS screens. Back Office hosting needs its own
exception: ADR 0007 once reviewed and committed, or a bounded extension, because
`PHASE-0-INSTRUCTIONS.md` says not to implement retail business features yet.

## Contract conflicts and affected clauses

All are frozen text. None is edited here.

| ID  | Frozen clause                                                                                                                                                              | Effect of this decision                                                                                                                                                                                                                                                                                                                                                                       | Needs                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| C1  | UI spec `02-INFORMATION-ARCHITECTURE-AND-NAVIGATION.md`, POS: "Navigation is intentionally limited to Sale, History, Returns, Shift and authorized cash actions."          | A visible workspace switch in the POS shell adds a control that is not on that list, and the POS shell is described as not a miniature Back Office.                                                                                                                                                                                                                                           | Change request CR-0009-A (below), before the switch is built            |
| C2  | Architecture `09-MONOREPO-AND-PACKAGE-STRUCTURE.md` lists `apps/pos-terminal` and `apps/backoffice`; `05-POS-BACKOFFICE-AND-HARDWARE.md` calls POS and Back Office clients | Both directories and packages are kept. The text does not require separate installers, so this is read as consistent. This is an interpretation, so the owner is told here.                                                                                                                                                                                                                   | None, unless the owner reads these clauses as requiring two executables |
| C3  | Security `07-SECURITY-AND-TRUST-BOUNDARIES.md`: "Every POS/Back Office installation must be enrolled"; counter identity binds `tenantId/storeId/counterId`                 | One application is one installation and one enrollment. Whether a Back Office-only deployment has a counter identity is not stated. The API contract `18-DEVICE-SESSION-ENROLLMENT.md` leaves the carrier, licensing limit and re-enrollment policy as unresolved seams.                                                                                                                      | Owner decision in the deployment contract; not resolved here            |
| C4  | UI spec `09-HARDWARE-UX.md`: scanner input must not trigger global shortcuts; `03-POS-EXPERIENCE.md`: Ctrl+K in Back Office, not while a barcode field owns focus          | One window now hosts both. Satisfied by D4.                                                                                                                                                                                                                                                                                                                                                   | Tests listed in D4                                                      |
| C5  | Tauri capabilities (`apps/pos-terminal/src-tauri/capabilities`): one window and one capability scope                                                                       | Back Office code would run in the same window and IPC scope as POS. Tauri cannot scope permissions per route. Partly addressed at source level by D5 (a test checks that Back Office source has no `invoke` or Tauri import). Runtime isolation is not shown; production capability and security design is pending. A second window with its own capability was considered and is not chosen. | Reviewed in the implementation step; owner may override                 |
| C6  | Deployment `13-DEPLOYMENT-PACKAGING-AND-UPDATES.md`: one client version range per desktop client; `X-MiniMart-Client-Version`                                              | One application means one client version for both workspaces. No conflict; a Back Office change now ships a new POS installer, which is a release-process consequence.                                                                                                                                                                                                                        | Noted                                                                   |
| C7  | Draft ADR 0007 on `wip/visual-reporting-ui` (uncommitted, not frozen)                                                                                                      | It builds `apps/backoffice` as a standalone Vite application with a root hash router and states that the Tauri host is a later decision. D1 and D2 supply that decision. Its router needs a base path, and its entry point must become an exported workspace.                                                                                                                                 | Merge order and rebase of that WIP, owner-directed                      |
| C8  | ADR 0008 and the POS implementation approval                                                                                                                               | POS files stay unchanged (D3). A host edit to `main.tsx` is outside the 30 bound files.                                                                                                                                                                                                                                                                                                       | None                                                                    |

## Change request CR-0009-A (proposed, not applied)

- Target: `docs/specifications/06-ui-specification/docs/02-INFORMATION-ARCHITECTURE-AND-NAVIGATION.md`,
  section "POS". Related, no change proposed: `00-UI-SPECIFICATION.md` (the three shells stay three).
- Current text: "The POS shell is not a miniature Back Office. The cashier lands directly in Sale
  Workspace after authentication/shift checks. Navigation is intentionally limited to Sale, History,
  Returns, Shift and authorized cash actions."
- Proposed addition after the last sentence: "Where the installation offers more than one workspace
  and the session is authorized for it, the shell exposes one workspace switch outside the POS
  navigation list. The switch is not a POS navigation entry. It never appears when only the POS
  workspace is available, and its visibility never replaces server-side authorization."
- Reason: D1 to D7. Alternative that needs no change: place the switch outside the POS shell chrome
  entirely, for example in a host-level session menu. That is a visual decision for the owner and is
  not designed in any approved reference.
- Owner choice (2026-10-06): use the no-amendment alternative. CR-0009-A stays **unapplied** and is
  not needed for the preview. This is a choice of approach; it is not a ruling that the frozen text
  already permits a host-level control, which is recorded under "Frozen wording check".
- Not proposed: any change to Architecture `05`, `09`, `13` or Security `07` (but see CR-0009-B).
- A second change request, to the API contracts, is needed only if the owner chooses to deliver
  workspace availability from the server (option B below), because API-IAM-004 would then need a
  contract for it. It is not drafted here.

## Frozen wording check

Checked against the frozen text in this branch. "Supports" means the words affirmatively allow the
composition. "Consistent" means the words neither require nor forbid it. Silence from the owner is not
approval of an interpretation, and none is recorded as approved.

| Clause (frozen)                                                                                                                   | Result                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `09-MONOREPO-AND-PACKAGE-STRUCTURE.md`: lists `apps/pos-terminal` and `apps/backoffice`; "Each package declares `minimart.layer`" | Consistent. Both directories and packages are kept. The rule is that packages must not import apps (`31-DEPENDENCY-BOUNDARY-ENFORCEMENT.md`); an app importing another app is not forbidden. The boundary check passes with the new dependency. |
| `05-POS-BACKOFFICE-AND-HARDWARE.md`: "POS and Back Office are Tauri + React + TypeScript clients of Store Node."                  | **Consistent only under an interpretation that is not approved.** It names two clients and does not say whether they are two executables or one application. It does not affirmatively support one application.                                 |
| `07-SECURITY-AND-TRUST-BOUNDARIES.md`: "Every POS/Back Office installation must be enrolled"                                      | Slightly supportive: it speaks of a "POS/Back Office installation" as one unit. It does not settle counter identity for a Back Office-only installation (open seam 2).                                                                          |
| `04-architecture/decisions` ARCH-003; `32-TECHNOLOGY-BASELINE.md`: Tauri + React + TypeScript for POS/Back Office                 | Consistent. One stack serves both workspaces.                                                                                                                                                                                                   |
| `13-DEPLOYMENT-PACKAGING-AND-UPDATES.md`: "Tauri desktop installers", client-to-Store-Node version ranges                         | Consistent. One installer and one client version range cover both workspaces.                                                                                                                                                                   |
| UI spec `00`: three shells (POS, Back Office, Cloud Web)                                                                          | Consistent. The two shells stay distinct workspaces; Cloud Web is outside this application.                                                                                                                                                     |
| UI spec `02`, POS: "Navigation is intentionally limited to Sale, History, Returns, Shift and authorized cash actions."            | Consistent only if the switch is not POS navigation. A host-level control outside the nav list is the owner's no-amendment choice. The text does not mention host-level controls, so this is an unapproved interpretation.                      |
| UI spec `09` and `03`: scanner input must not trigger global shortcuts; Ctrl+K is a Back Office shortcut                          | Supported by the D4 scoping and its tests.                                                                                                                                                                                                      |

Net: the architecture is directed by the owner, and the preview is bounded and visual-only. The
frozen text does not affirmatively say that POS and Back Office may be one application, so the
following change request is proposed and **not applied**.

### Change request CR-0009-B (proposed, not applied)

- Targets: `docs/specifications/04-architecture/docs/05-POS-BACKOFFICE-AND-HARDWARE.md` and
  `09-MONOREPO-AND-PACKAGE-STRUCTURE.md`.
- Proposed addition to `05`, after the first paragraph: "POS and Back Office may be delivered in one
  installable desktop application as separate workspaces. They remain clients of Store Node, never
  write PostgreSQL directly, and keep separate navigation, routes and authorization."
- Proposed addition to `09`, after the structure listing: "`apps/pos-terminal` hosts the desktop
  application and may import the `apps/backoffice` workspace package. Packages still must not import
  apps."
- Reason: the frozen words name two clients and do not state whether one application may host both.
- Until the owner accepts, rejects or redirects it, the preview stays bounded and visual-only.

## Open seams (not resolved here)

1. **Where workspace availability is configured.** Options: (A) build profile plus a
   machine-local/enrollment setting (configuration classes 2 and 3 in
   `26-CONFIGURATION-OWNERSHIP-PRECEDENCE.md`), or (B) a Company/Store application configuration
   value delivered through the Store API (class 4), which needs an API contract and a descriptor
   with owner, scope and sensitivity. A and B can be combined. The owner decides.
2. **Counter identity for a Back Office-only installation** (C3).
3. **Final visual design of the switch.** The owner chose a host-level menu outside the POS
   navigation (no-amendment alternative). The look and exact place are a preview placeholder and are
   not approved.
4. **Unified product name, installer name and bundle identifier** (D10). The owner chose to keep
   the current product name and `com.minimart.pos`; a later rename is a separate decision.
5. **Draft protection when switching.** The frozen UI contract warns before abandoning dirty drafts
   and says session lock does not discard protected work. How an unfinished sale survives or blocks a
   workspace switch belongs to the Sales design and is not decided here; the host must provide a
   guard hook so POS can refuse or confirm a switch.

## Preview implementation (built on this branch, preview only)

Authorized by the owner on 2026-10-06 with these choices: host-level menu outside the POS navigation,
unchanged product name and identifier, labelled preview-only availability, and Back Office-only
counter identity and unfinished-sale switching policy left unresolved. It adds no production setting,
no API contract and no authentication. The evidence and the exact file list are in
`docs/phase-0/workspace-host-preview.md`.

- Host (`apps/pos-terminal/src/host/`): hash routes, registry, preview-only availability and a
  compact 32 px host header with the labelled switch at its right. Only the active workspace is
  mounted. While the header is shown the workspace area is the window height minus 32 px, set by host
  CSS without editing the approved POS stylesheet. Without the header (`inspect=0` or a single
  available workspace) the workspace keeps the full window height.
- POS state across a switch: the host keeps the fictional POS state (visual flow and search text) in
  memory. The POS UI is unmounted and its scanner capture is reset by the existing cleanup; status
  messages and the scan count are not carried back. This is preview behavior, not a sale lifecycle,
  and it decides nothing about unfinished sales in production.
- Back Office: one placeholder workspace (`apps/backoffice/src/workspace.tsx`). It is not the Back
  Office shell, it builds no module screen, and it does not approve the shell design.
- Bound POS implementation: two approved files changed, additively, to allow state restoration
  (`App.tsx`, `flow.ts`). The other 28 bound files and the four preserved MM-008 files are
  byte-identical. The recorded hashes in `provenance.json` were not edited. The difference is recorded
  in the Phase-0 note, and the owner has not re-confirmed those two files.
- The draft ADR 0007 and the Reporting WIP are not merged, adopted or touched.

## Implementation scope (planned; the preview slice above is built, the rest is not)

Placement, all within the existing application:

- `apps/pos-terminal`: change `src/main.tsx` to render a host; add `src/host/` with the workspace
  registry and availability, the route parsing, the host component and the preview-only switch;
  add `test/host/`; add the workspace dependency to its `package.json` and the lockfile importer
  block.
- `apps/backoffice`: add one exported workspace entry (a placeholder shell, no module screens), an
  exports field, and a test that it imports no Tauri or `pos-terminal` code. The module screens
  from the Back Office design packages are separate work.
- Documentation: `docs/phase-0/` note for the host and its evidence, `ACTIVE-WORK.md`.
- Not changed: the 30 bound POS implementation files, the four preserved scanner files, any design
  manifest status, `src-tauri`, `apps/store-node`, `apps/cloud`, `docs/specifications`,
  `docs/backlog`.
- Verification when built: the scanner suites unchanged and passing; the implementation digest in
  `provenance.json` still matching; the POS screen comparison re-run if any stylesheet is scoped;
  the boundary check, ESLint, Prettier, `tsc -b` and the app builds passing; no fetch or Tauri
  invoke in `apps/backoffice`.

Sequence for the next step: (1) the owner answers open seams 1, 3 and 4 and accepts or redirects
CR-0009-A and the C5 mitigation; (2) the Back Office exception (ADR 0007 or an extension) is
settled and the merge order with the Reporting WIP is chosen; (3) implement the host, routes,
registry and placeholder workspace with the tests in D4; (4) only then build the real switch and
Back Office screens.

## What this decision does not decide

It does not decide the switch's visual design, the availability configuration mechanism, a Back
Office-only counter identity, the product name or bundle identifier, draft handling, any Back Office
module behavior, or any decision the Decision Register marks OPEN, VERIFY, DEFERRED or PROPOSED. It
does not accept MM-005 to MM-010, change the POS approval, or promote the Back Office shell design.

## Consequences

- One installer and one client version serve both workspaces; a deployment can still offer only one.
- The scanner and POS shortcuts stay confined to the POS context, and the approved POS files and
  tests remain the baseline.
- `apps/pos-terminal` is the application host while `apps/backoffice` stays a separate package, so
  the Back Office work in progress on another branch can continue and be rebased onto the host.
