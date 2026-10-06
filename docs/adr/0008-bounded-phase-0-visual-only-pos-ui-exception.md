# ADR 0008: Bounded Phase-0 exception for visual-only implementation of the approved POS reference

- Status: Accepted (owner-approved on 2026-10-06 and bounded as below; it takes effect in the
  repository only when this change is committed)
- Date: 2026-10-06
- Scope: Implementation placement and conduct for a visual-only POS frontend in
  `apps/pos-terminal`. It does not change frozen semantics, the frozen backlog or any business,
  API, data, security or hardware decision.
- Approval: the repository owner approved this exception in writing on 2026-10-06 and asked that it
  be recorded through the ADR process without repeating the authorization. The owner also approved
  `MiniMartPOS.dc.html` as the POS visual reference on the same date (see
  `docs/design/pos/provenance.json`).

## Numbering note

ADR 0006 exists only on the unmerged branch `wip/mm-009-raster-spike`. A sibling decision for the
five Back Office design packages is drafted as ADR 0007 on a separate, uncommitted WIP branch
(`wip/visual-reporting-ui`). Neither is on this branch. This record uses 0008 so that none of the
three can collide when they are reviewed for merge.

## Context

`PHASE-0-INSTRUCTIONS.md` says: "Do not implement retail business features yet." Its Phase-0 scope
includes the POS shell and the keyboard-wedge scanner spike but not a Sale screen, product browser,
cart or payment presentation. `docs/design/README.md` sets the order "frozen authority; approved
visual reference; backlog item; implementation". The owner has now approved the registered POS
mockup as a visual reference and has authorized a bounded exception to build it as a visual-only
frontend.

`apps/pos-terminal` already holds the MM-005 shell, the MM-006 Store Node connectivity probe and
the MM-008 scanner spike (software-only, acceptance incomplete). This WIP branch starts at the
MM-008 checkpoint commit so that the scanner behavior and its regression tests are carried in
explicitly. The MM-008 branch itself is not modified and nothing is merged into it.

## Decision

Implement the approved POS reference as a visual-only frontend in the existing
`apps/pos-terminal` application, on the isolated WIP branch `wip/visual-pos-ui`, starting with the
shared shell and the main Sale screen. After reviewing that slice the owner instructed, on the same
day, that the remaining screens of the reference be built the same way in the same worktree. All 31
screens of the reference are therefore in scope, under every limit in this record.

### What the exception permits

- Frontend components, local navigation and clearly labelled fictional fixtures.
- Visual interactions that need no business logic: switching sidebar pages, category filters,
  the tile and grid product views, selecting a cart line, opening and closing the reference's
  dialogs, stepping through the reference's fictional states (customer, hold, payment, returns,
  shift) and preview-state switching. These only choose which fictional fixture is drawn.
- Visual matching against the registered approved source.

### What it does not permit

Real sales, posting, payment or card processing, business calculations (totals, discount, tax,
rounding and change are shown as fixed fictional strings and are never computed), persistence, API
integration, sync, authentication, authorization and hardware operations (scanner, printer, drawer).
Controls without implemented behavior are visibly identified: they keep the reference look, carry a
dashed outline and announce that they are not implemented. No OPEN, VERIFY, DEFERRED or PROPOSED
decision is resolved.

### MM-008 scanner behavior

The scanner module `src/scanner-input.ts`, its keyboard handling in `PosApp`, and the regression
tests `scanner-input.test.ts` and `scanner-shell.test.tsx` are preserved. The shell tests keep every
behavioral assertion. Only selectors that named controls the approved design no longer has may
change, and each change is listed in `docs/phase-0/visual-pos-screens.md`. Scanner acceptance
stays INCOMPLETE; this decision does not claim hardware or physical validation.

## Proposed changes, dependencies and tests

This section is the presentation that `PHASE-0-INSTRUCTIONS.md` asks for before code.

Files, all under `apps/pos-terminal` unless noted:

- `src/App.tsx` (new markup around the unchanged scanner handlers), `src/fixtures.ts`,
  `src/styles.css` (rewritten for the approved design), `index.html` (font link, title)
- `src/shell/` and `src/sale/` (presentational components), `src/preview.ts` (preview-state parsing),
  and the removal of `src/components/ShellControls.tsx` if it becomes unused
- `test/App.test.tsx` (rewritten for the new Sale screen), `test/preview.test.ts`, and the minimal
  selector changes in `test/scanner-shell.test.tsx`
- `docs/design/pos/design-manifest.json`, `docs/design/pos/provenance.json`,
  `tools/design-render/report.mjs` and `docs/design/RENDER-FIDELITY-REPORT.md` (the approval record)
- `docs/phase-0/visual-pos-screens.md`, `docs/project-status/ACTIVE-WORK.md`

Later slice (all remaining reference screens), same application: `src/screens.ts` (registry of the 31
reference screens), `src/flow.ts` (visual flow state), `src/fixtures-flow.ts`, `src/dialogs/`,
`src/pages/` and `src/sale/` additions, with `test/screens.test.tsx`, `test/flow.test.tsx` and
`test/fixtures-flow.test.ts`. No dependency is added.

Dependencies: none new. `lucide-react` is already a dependency of `apps/pos-terminal`.

Tests: the Sale screen renders its regions; the scanner regression suites pass; every unimplemented
control is identified; no `fetch` call is made; preview states render; `tsc -b`, ESLint, Prettier,
`pnpm run ci` and the Vite build pass.

## Conditions

- Every fixture is labelled fictional and the preview carries a visible fictional-data label.
- Fonts: the reference loads IBM Plex from Google Fonts. The preview uses the same link with the
  reference fallback stack. Bundling fonts for offline use needs a separate asset and licence
  decision and is not made here.
- The real MM-006 Store Node status is kept. The mockup's blocking overlay and locked navigation
  for an unavailable Store Node are shown only in an explicitly simulated preview state.
- Frozen `docs/specifications` and `docs/backlog` show an empty diff.
- Nothing here accepts MM-005, MM-006, MM-007, MM-008, MM-009 or MM-010, or any Phase-1 backlog
  item.

## Implementation approval

On 2026-10-06 the owner reviewed and approved the visual implementation of all 31 screens. The
approval is recorded in `docs/design/pos/provenance.json` (`implementationApproval`), separately from
the design source approval and bound to the implementation file hashes. It changes none of the limits
above and does not accept any MM item. Production and business functionality, MM-008 acceptance,
native validation and remote CI remain incomplete. POS and Back Office workspace switching (one
application with two workspaces and a toggle) is an owner direction that is not implemented and not
part of this change; no ADR or change record exists for it and this record does not authorize it.

## What this decision does not decide

It does not close or waive any Phase-0 gate or acceptance gap, approve Back Office or Inventory,
select a grid library, a font bundling approach, a rounding or hold policy, or a payment flow.
MM-007 physical validation remains pending and DEC-HW-001 remains open.

## Consequences

- The POS preview exists for visual inspection only; it is not acceptance evidence.
- A later production implementation starts from its backlog item and may rework these screens.
- All 31 reference screens are drawn, including payment, history, returns and shift. Their dialogs
  and states are fictional presentations: no payment, card, QR, refund, receipt or shift close happens.
- Device and provider statuses are shown as "not tested" or "not connected", not as the reference's
  illustrative "ready" values, because nothing is connected.
