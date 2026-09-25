# MM-005 Tauri + React POS Shell

## Scope

MM-005 provides a runnable desktop shell for the frozen POS sale workspace. It is a presentation
foundation and does not create or persist transactions.

## UI structure

The shell follows the frozen three-zone POS arrangement. The top region shows store, counter,
cashier, business-date placeholder, and operational-status placeholders. The main left region
contains item entry and an empty cart. The main right region contains customer context, totals,
and a disabled payment action. The bottom region shows the active keyboard hint and a status
message. Navigation is limited to Sale, History, Returns, and Shift; only Sale has a workspace.

## Design system

Tailwind CSS is integrated through the Vite plugin. A small set of CSS variables defines neutral
surfaces, ink, borders, semantic attention, focus, spacing, and transaction emphasis. Shared
`ShellButton`, `StatusBadge`, and `KeyHint` components keep shell controls consistent. The layout
uses compact retail density, modest radii, 40px minimum controls, and a 50px payment control.

## Tauri and React boundary

`src-tauri` hosts one desktop window and exposes no native commands. The Rust host is independent
of the root hardware-port workspace. React renders only presentation and does not invoke native
APIs or access printers, scanners, serial devices, scales, displays, or PostgreSQL.

## Fixtures and status

`src/fixtures.ts` contains explicitly labeled demo store, counter, cashier, and zero-total text.
No fixture is stored or treated as trusted business context. Item search accepts text as a shell
control, but submitting it only explains that lookup is unavailable; it performs no request and
does not change the cart. Totals are static preview text, never computed money values.

Store Node is labeled **Not connected (preview)** and cloud is **Not checked**. Neither state is
measured. MM-006 will introduce real Store Node health/readiness connectivity.

## Accessibility and keyboard

The shell uses semantic navigation, headings, labeled search, status text, a live announcement,
logical DOM order, a skip link, visible focus, and text labels in every status. `F2` focuses the
item search only on the Sale page. `Escape` clears a nonempty search field. These are provisional
shell-level shortcuts from the frozen UI proposal. F4/F6/F8 are displayed on disabled controls
for placement review and do not execute customer, hold, or payment actions. Windows and hardware
shortcut conflict testing remains a later acceptance task.

## Responsive target

The primary target is 1366×768; the layout is designed to remain usable at 1280×720 with totals
and payment visible. At widths below the frozen POS target, regions stack as a fallback. The
shell does not implement a mobile checkout experience.

## Development and validation

From the repository root:

```text
pnpm --filter @minimart/pos-terminal dev
pnpm --filter @minimart/pos-terminal build
pnpm run test:pos-shell
pnpm --filter @minimart/pos-terminal tauri dev
```

The POS tests cover visible regions, disabled business controls, non-live status, F2 focus,
presentation-only search, absence of network requests, and navigation. The root `ci` command
also checks formatting, lint, dependency boundaries, and TypeScript.

The local Windows review host has WebView2 and MSVC, but no Rust/Cargo installation. The Vite
frontend can be run and reviewed here; native Tauri compilation and window launch remain to be
validated in a Rust-equipped environment using the pinned 1.85 toolchain.

## Deferred

- MM-006 Store Node health/readiness connectivity and authoritative status
- Item lookup, barcode behavior, cart rules, posting, payment, returns, and shift workflows
- Authentication and manager overrides
- Sync, cloud status, and survival mode
- Tauri hardware ports and device integration
- Windows installer and update packaging
