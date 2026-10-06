# ADR 0007: Bounded Phase-0 exception for visual-only implementation of approved design references

- Status: Accepted (owner-approved on 2026-10-06 and bounded as below; it takes effect in the
  repository only when this change is committed)
- Date: 2026-10-06
- Scope: Implementation placement and conduct for visual-only frontend screens. It does not change
  frozen semantics, the frozen backlog or any design status.
- Approval: the repository owner approved this exception in writing on 2026-10-06, after the agent
  reported the exact gate clauses below and the smallest controlled approval needed.

## Context

`PHASE-0-INSTRUCTIONS.md` says: "Do not implement retail business features yet." It then lists the
Phase-0 scope, which names no Reporting, Procurement, Customers and Credit, Cash and Business Day,
or Accounting-Lite screen. The frozen backlog sequence places those modules in Phases 1C, 1E and 2.
`docs/design/README.md` sets the order "frozen authority; approved visual reference; backlog item;
implementation". The Reporting approval record in `docs/design/RENDER-FIDELITY-REPORT.md` says its
approval "does not approve implementation and does not resolve any business, API, data or security
decision".

Whether fictional-data, visual-only screens count as "retail business features" is not stated, and
`AGENTS.md` forbids resolving an ambiguity like that silently. This record is the explicit owner
decision. Phase-0 acceptance is not complete: MM-007 has its software checkpoint on `main` (commit
`dfc7cb4`) with physical validation pending, MM-008, MM-009 and MM-010 are software-only work on WIP
branches with acceptance incomplete, and MM-011 has not started.

## Decision

The owner permits a bounded exception: implement the five packages whose manifest status is
`approved-visual-reference` as visual-only frontend screens, in this order, one at a time:

1. Reporting (`docs/design/reports`)
2. Procurement (`docs/design/procurement`)
3. Customers + Credit (`docs/design/customers`)
4. Cash / Business Day (`docs/design/cash-shifts`)
5. Accounting-Lite (`docs/design/accounting`)

Each package starts with a representative slice that is reviewed against the approved reference
before the module is extended.

### What the exception permits

- Frontend components, local navigation and clearly labelled fictional fixtures.
- Accessible interactions needed to inspect the screens, such as switching a preview state.
- Visual matching against the registered approved source HTML, using the documented integration
  adjustments in each package's provenance and fidelity evidence.

### What it does not permit

Business calculations, posting, persistence, API calls, sync, authentication, authorization, real
exports or print jobs, and any production operation. Money and quantities are shown as
pre-formatted fictional display strings and are never computed. Controls without implemented
behavior must be visibly identified as not implemented. No decision that the Decision Register or a
design screen marks OPEN, VERIFY, PROPOSED, DEFERRED or GAP is resolved.

### Placement

The existing frozen host `apps/backoffice` is used. It is in the Architecture v1.0 structure, has
`minimart.layer` `ui`, and the frozen UI specification places the Reporting screens under "Back
Office, Reports". The frozen stack baseline is Tauri + React + Vite, so React and Vite are not new
frameworks. No new application, package or framework is created. `packages/ui` is a forbidden legacy
directory in the boundary checker and is not used.

- Reporting, Procurement, Customers + Credit and Accounting-Lite screens belong to Back Office and
  are hosted in `apps/backoffice` under one folder per module.
- Before Cash / Business Day starts, its screens are checked against the frozen UI inventory. If a
  screen belongs to the POS client, that is reported to the owner and is not placed in
  `apps/pos-terminal`.
- This exception adds no Tauri shell to `apps/backoffice`. The preview runs on the Vite development
  server. The Tauri host remains a later decision.
- The MM-008 scanner branch and `apps/pos-terminal` are not touched. POS and Back Office remain
  `review-ready` and Inventory remains paused and unapproved.

## Proposed changes, dependencies and tests (Reporting, first slice)

This section is the presentation that `PHASE-0-INSTRUCTIONS.md` asks for before code.

Files, all under `apps/backoffice` unless noted:

- `package.json`, `tsconfig.json`, `index.html`, `vite.config.ts`, `test/setup.ts`
- `src/main.tsx`, `src/App.tsx`, `src/router.ts`, `src/styles/tokens.css`, `src/styles/base.css`
- `src/shell/` (application shell, navigation, status pills)
- `src/components/` (design primitives such as card, tag, marker, button, state card, data table)
- `src/reports/` (Reports Home, report viewer, fictional fixtures, preview-state controls)
- `test/*.test.tsx` (component and navigation tests)
- `pnpm-lock.yaml` (the `apps/backoffice` importer block only), root `package.json` (one test script)
  and one `.github/workflows/ci.yml` step
- `docs/phase-0/visual-ui-reporting.md` (fidelity evidence, differences and validation) and
  `docs/project-status/ACTIVE-WORK.md`

Dependencies: no new package and no new version. `apps/backoffice` adopts the specifiers that
`apps/pos-terminal` already declares and the lockfile already resolves: `react`, `react-dom`,
`lucide-react` (workspace catalog), and as development dependencies `vite`, `@vitejs/plugin-react`,
`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`,
`@testing-library/user-event`, `@types/react` and `@types/react-dom`. Tailwind, AG Grid, TanStack
and Zustand are not used in this slice. Routing is a small hash router with no library.

Tests: component tests for navigation and state switching, accessible names and table semantics,
every unimplemented control being disabled and labelled, and fixtures being labelled fictional.
`tsc -b`, ESLint, Prettier and `pnpm run ci` must pass, and the app must build with Vite.

## Conditions

- Every screen shows that its data is fictional and that the implementation is visual-only.
- No `fetch`, `XMLHttpRequest`, WebSocket or Tauri `invoke` call exists in `apps/backoffice`.
- Fonts and icons: the reference loads IBM Plex from Google Fonts and Lucide from a CDN. The
  preview loads IBM Plex through the same Google Fonts link, with the reference's fallback stack,
  and uses the locked `lucide-react`. Bundling fonts for offline use needs a separate asset and
  licence decision and is not made here.
- Frozen `docs/specifications` and `docs/backlog` show an empty diff. No design manifest status is
  changed.
- Implementing a screen here does not accept any backlog item, including MM-079 to MM-083 and
  MM-097.

## What this decision does not decide

It does not close or waive any Phase-0 gate or acceptance gap, approve POS, Back Office or
Inventory, choose a grid library, a Tauri host for Back Office, a font bundling approach, or any
business definition. The Reporting decisions that stay open include DEC-RPT-001 (OPEN),
DEC-RPT-002 (PROPOSED), the page-limit mismatch, the unmasked-customer-data permission and the
owner screen for cash, day-close and management reports.

## Consequences

- Preview screens exist for inspection, but none is product behavior or acceptance evidence.
- A later production implementation of a module starts from its backlog item and may replace or
  rework these screens.
- `apps/backoffice` gains a React and Vite toolchain and a lockfile importer block.
- Every module in the list above needs its own representative slice and review before extension.
