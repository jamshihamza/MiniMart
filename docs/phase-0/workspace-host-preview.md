# Workspace host preview (WIP, preview only, not accepted)

Status: bounded preview on `wip/workspace-switch-adr`, based on the pushed POS checkpoint
`fcb253fa3e1624bd24fe980bc6c5f841cacda857`. It is recorded as a WIP preservation checkpoint and
pushed to that branch only (preservation, not approval). Nothing here is merged or accepted. It is
governed by [ADR 0009](../adr/0009-single-application-with-pos-and-back-office-workspaces.md) and the
bounded visual-only limits of [ADR 0008](../adr/0008-bounded-phase-0-visual-only-pos-ui-exception.md).

## What it is

One application entry (`apps/pos-terminal`) that hosts two workspaces chosen by hash route:

- `#/pos` renders the approved POS workspace.
- `#/back-office` and `#/back-office/<path>` render a minimal Back Office placeholder.
- An empty hash lands on the first available workspace (POS by default) and replaces the hash.
- `#/pos/<x>` and unknown workspaces show a "Route not found" page.

Only the active workspace is mounted. A compact host-level header (32 px) sits above the active
workspace. It shows "MiniMart preview host · fictional data" at the left and the switch at the right,
labelled "Preview only". The header is outside the POS navigation and outside both workspaces, adds no
landmark or status region, and is hidden by `inspect=0` and when only one workspace is offered.

Owner review: the first candidate, a floating control at the bottom left, was rejected and is not
recorded as approved. The top-right header described here is the replacement and is **not yet
visually approved**.

### Height accounting

POS draws itself 100vh high. While the header is shown, the frame is one window high and the
workspace gets the rest, so the POS area is the window height minus 32 px: 736 px at 1366x768, 688 px
at 1280x720, 768 px at 1368x800 and 1048 px at 1920x1080. Host CSS sets the POS root to 100% of that
area (`.ws-frame--header .ws-body .pos-app`), so `styles.css` is unchanged. With the header hidden,
the wrapper elements add no box and POS keeps the full window height, as approved.

## What it is not

- Not production. There is no sign-in, enrollment, server authorization, API call or persistence.
  Workspace availability is a preview-only URL parameter (`?workspaces=pos`,
  `?workspaces=back-office`, default both). It grants and removes no access.
- Not the Back Office shell and not a Back Office screen. The placeholder shows one heading, a
  navigation with "Home", the route, and a Ctrl+K stub. The Back Office shell design stays
  `review-ready`; module designs keep their own statuses. This does not approve any of them.
- Not a sale lifecycle. The preview restores fictional POS state when you return; production
  unfinished-sale switching policy is unresolved.
- Not a security claim. A source-text test checks that Back Office source imports no Tauri, POS or
  network code. It does not prove runtime IPC isolation in the shared Tauri window. Production
  capability and security design is pending.
- Not a change to the product name, identifier `com.minimart.pos`, window label or Tauri
  capability. Back Office-only counter identity is unresolved.

## Preview

From the worktree root, install once, then start the dev server (the original POS preview may hold
port 1420, so use another port):

```bash
pnpm install --frozen-lockfile
pnpm --filter @minimart/pos-terminal exec vite --host 127.0.0.1 --port 1421
```

- POS: `http://127.0.0.1:1421/#/pos` (also `http://127.0.0.1:1421/`)
- Back Office placeholder: `http://127.0.0.1:1421/#/back-office`
- Deep link example: `http://127.0.0.1:1421/#/back-office/reports`
- Populated cart, then switch: `http://127.0.0.1:1421/?cart=populated#/pos`
- Back Office only offered: `http://127.0.0.1:1421/?workspaces=back-office`
- POS only offered: `http://127.0.0.1:1421/?workspaces=pos`
- Any POS screen: `http://127.0.0.1:1421/?screen=09#/pos` (screen ids 01 to 30 and 02b)

The switch is the "Workspace: ..." button at the top right of the host header; hide the header
with `&inspect=0`. The reference-state links in the POS preview inspector rebuild
the URL from the POS parameters only, so following one drops `workspaces` and the hash.

## Placement

- `apps/pos-terminal/src/host/`: `workspaces.ts` (registry, availability, route resolution),
  `WorkspaceHost.tsx` (frame, header, active workspace), `WorkspaceMenu.tsx` (the switch),
  `host.css`. `src/main.tsx` renders the host.
- `apps/backoffice/src/workspace.tsx` and `workspace.css`: the placeholder. `package.json` exports it
  as `@minimart/backoffice/workspace` and declares `react` and `@types/react` (the versions already
  locked for `apps/pos-terminal`); `tsconfig.json` gains JSX and DOM. `apps/pos-terminal` declares
  `@minimart/backoffice` as a workspace dependency and a TypeScript project reference.
- `pnpm-lock.yaml`: the `apps/backoffice` and `apps/pos-terminal` importer blocks only. No package
  or version is new.

## Changes to the bound POS implementation

The POS implementation approval (`docs/design/pos/provenance.json`, `implementationApproval`) binds 30
implementation files by SHA-256. Restoring POS state needs two small additive edits to approved
files. They are required because `PosApp` keeps its flow and search text inside the component, so a
host cannot restore them from outside.

| File                            | Approved SHA-256                                                   | Now                                                                | Change                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `apps/pos-terminal/src/flow.ts` | `21c77fff0bbb14ad2a42040b0e38ebc61c11d29a6f73a9b128a473e2184e9599` | `f80c0c143bd1477d6ab3cda010b4f33a14067fab189a57aabf170651f815c45c` | `useFlow(initial, restored?)` starts from `restored` when given.                                                                    |
| `apps/pos-terminal/src/App.tsx` | `3592601a1c05111696eef3ef2b3cb6e9ec3bbc062ab51639ce60e005e420284b` | `98df0eb59461517ff5490dffbc3884d59e091636d702d884bf46e187f6847f29` | `PosApp` takes optional `restore` and `onMemoryChange` props, exports `PosPreviewMemory`, and reports flow and query in one effect. |

- `git diff` shows 4 removed lines in these two files and nothing removed inside the scanner code.
  The scanner helpers, probe effect, capture-phase effect and F2 effect are untouched, and
  `PosApp` with no props behaves as before.
- The other 28 bound implementation files and the four preserved MM-008 files are byte-identical to
  the recorded hashes (checked by recomputing every hash).
- `provenance.json` was **not** edited. The recorded hashes stay as evidence of what the owner
  approved. The owner has **not** re-confirmed these two files. Until they do, the binding for them
  is void and this note is the record of the difference.
- Appearance evidence: the 31 screens at four viewports (124 captures) were taken through the host
  at `inspect=0` and compared with captures of the unchanged POS server. 122 are byte-identical and
  the other two differ by 2 to 3 pixels in a 1920x1080 frame. The same few-pixel drift appears when the unchanged
  POS server is captured again: four captures that differed from the earlier baseline were
  reproduced by the unchanged server, with 2 to 5 differing pixels each. So it is capture noise and
  not a visual change. This is evidence of appearance only, not owner approval.

## Validation (software only)

- POS suite: 12 files, 214 of 214 tests pass: the earlier 177 are unchanged and pass (102 inherited
  including the 94 scanner tests, plus the 75 POS visual tests), and 37 are new in `test/host/`:
  `route.test.ts` (8), `boundary.test.ts` (8), `host.test.tsx` (21). Two of the host tests check
  the header structure; jsdom does no layout, so the placement and height claims rest on the browser
  audits below.
- The host tests cover: landing and hash replacement, deep links, not-found and unavailable routes,
  Back and Forward style hash changes, the switch being outside the POS navigation and adding no
  landmark, switching both ways with focus moved into the new workspace, Escape and `inspect=0`,
  preview-only availability, restoring the History page with its open detail and the Sale search
  text, keeping a populated cart and keeping a cleared cart, not carrying status or scan count back, a
  half-finished scan interrupted by a switch not resuming, a full scan still captured after returning,
  no scanner capture, F2 or default prevention in Back Office, the Back Office Ctrl+K stub working only
  there and never in POS, F2 still working in POS after a round trip, and no `fetch` call.
- Negative control: keeping POS mounted but hidden while Back Office is active made the Back Office
  isolation test fail (1 failed, 211 passed). The change was reverted.
- `pnpm run ci` (Prettier, ESLint, frozen-manifest, protected-test and boundary checks, `tsc -b`),
  `pnpm design:validate` (8 manifests), the dependency-boundary check for 27 packages and the Vite
  production build pass.
- Header layout audit (Chrome, 31 screens at 1366x768, 1280x720, 1368x800 and 1920x1080, header
  shown, 124 combinations): the header is 32 px; its bottom edge equals the POS top; POS height is the
  window height minus 32 px; no page scroll in either direction; the switch is inside the header and
  in its right half; the header label is not clipped; nothing in the POS area sits above it except the
  parked skip link; the open menu stays inside the window and does not change the layout; the Back
  Office placeholder fills the area under the header. Compared with `inspect=0`, no control outside a
  scroll area is newly clipped at any of the four viewports (a control inside a scrolling list only
  changes how much of the list shows). A negative control at 1280x520 does flag the Complete Sale
  button, so the check can detect clipping.
- With the header hidden (`inspect=0`), the 124 captures again match the unchanged POS server except
  1 to 2 pixels in six frames, the same capture noise as before.
- Browser audit with the header shown: 93 combinations and 2,760 Tab stops (the header switch and the
  preview inspector are both present), same findings as before and no new ones.
- Browser audit through the host at `inspect=0`: 93 combinations and 2,754 Tab stops, the same counts
  and the same findings as before (the STATUS header on screens 17 and 28, and the CUSTOMER header at
  1280x720). The menu itself was exercised in Chrome at 1366x768 and 1280x720: it opened, switched to
  Back Office with focus moved to the main region, switched back with the 9-item cart intact, and
  logged no console or page error.

## Not verified

- The native Tauri window was not launched; no device, WebView2 or physical scanner was used.
- No screen reader or assistive-technology test of the menu or the placeholder.
- Remote CI has not run; nothing is pushed.
- Only the Chrome and jsdom environments above were used.

## Known limitations

- While the header is shown, POS has 32 px less height than the approved full-window layout.
  Nothing outside a scroll area is newly clipped at the four tested viewports. At 1280x520, an
  unsupported size that was checked only as a negative control, the Complete Sale button leaves the POS
  area. `inspect=0` restores the full height.
- The open menu is a pop-over that covers the top right of the POS top bar until it is closed.
- Following a reference-state link in the POS preview inspector drops `workspaces` and the hash.
- POS state is kept in memory only; a page reload starts again from the URL.
- The POS and Back Office stylesheets share one document. Back Office rules are scoped to
  `.bo-workspace`, but the POS global rules (`html`, `body`, `#root`, `*:focus-visible`) still apply
  while the placeholder is shown. Production style isolation is not decided.

## Changed files

- modified `apps/backoffice/package.json`
- new `apps/backoffice/src/workspace.css`
- new `apps/backoffice/src/workspace.tsx`
- modified `apps/backoffice/tsconfig.json`
- modified `apps/pos-terminal/package.json`
- modified `apps/pos-terminal/src/App.tsx`
- modified `apps/pos-terminal/src/flow.ts`
- new `apps/pos-terminal/src/host/WorkspaceHost.tsx`
- new `apps/pos-terminal/src/host/WorkspaceMenu.tsx`
- new `apps/pos-terminal/src/host/host.css`
- new `apps/pos-terminal/src/host/workspaces.ts`
- modified `apps/pos-terminal/src/main.tsx`
- new `apps/pos-terminal/test/host/boundary.test.ts`
- new `apps/pos-terminal/test/host/host.test.tsx`
- new `apps/pos-terminal/test/host/route.test.ts`
- modified `apps/pos-terminal/tsconfig.json`
- new `docs/adr/0009-single-application-with-pos-and-back-office-workspaces.md`
- new `docs/phase-0/workspace-host-preview.md`
- modified `docs/project-status/ACTIVE-WORK.md`
- modified `pnpm-lock.yaml`
