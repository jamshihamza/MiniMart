# MiniMart design handoff

This directory is the stable handoff boundary for MiniMart visual design packages. It lets a design source be versioned, rendered deterministically, reviewed, and then used as an implementation reference without repeated manual PDF uploads.

## Authority and implementation order

Frozen MiniMart specifications remain the functional authority. A design file becomes visual authority only after its manifest status is `approved-visual-reference`. Visual design never overrides domain, API, data, security, or business rules.

The required implementation order is:

1. frozen authority;
2. approved visual reference;
3. backlog item;
4. implementation.

Do not implement a design-only concept as product behaviour unless frozen authority and the relevant backlog item support it. Where design and frozen authority differ, stop and resolve the conflict through the repository's ADR/change-request process.

Within a design package, the source design file is authoritative over generated screenshots and PDFs. Generated renders and PDFs must never be manually edited.

## Package layout

Each package uses the following layout:

```text
docs/design/<module>/
  source/                 authoritative copied/exported design source
  renders/                generated PNG screenshots
  exports/                optional generated combined PDF
  design-manifest.json    package metadata and render instructions
```

The current package slots are `pos`, `back-office`, `inventory`, `procurement`, `customers`, `cash-shifts`, `accounting`, `reports`, and `administration`. A package does not need a manifest until design work begins. POS, Back Office, and Inventory have initial draft manifests.

Generated PNG/PDF outputs are ignored by Git. Source files and manifests are committed; CI uploads generated outputs as workflow artifacts. This keeps binary churn out of review while preserving reproducible evidence.

## Handoff flow

```text
Claude Design
  -> source-of-truth design file
  -> docs/design/<module>/source/
  -> automated render
  -> renders/
  -> optional PDF export
  -> design-manifest.json
  -> ChatGPT / Claude / Codex review
  -> approved visual reference
  -> implementation
```

PDF is an optional archive output, not the source of truth.

## Manifest and render contract

All manifests conform to [`design-manifest.schema.json`](./design-manifest.schema.json). Only `package` and `slug` are universally required because early design work may not yet have a source file, screen inventory, or review commit.

The statuses `review-ready`, `approved-visual-reference`, and `implementation-in-progress` are render-ready. Those statuses require:

- an existing `sourceFile` below the package directory (normally `source/<name>.html`);
- at least one screen;
- a `renderFile` for every screen.

`draft` and `superseded` packages are not rendered by the all-packages CI command.

The renderer does not know MiniMart screen names. For each screen it uses `screen.render.url` when supplied. The value may be a query (`?screen=01`), fragment (`#screen-01`), relative URL, or absolute local-server URL. When omitted, the renderer appends `?screen=<zero-padded screen number>` to the source URL, which supports source pages driven by a `screen` query/prop.

Optional `screen.render.readySelector` waits for a source-specific ready element. Optional `screen.render.captureSelector` captures one element instead of the viewport. Without these selectors, the renderer waits for page load and captures the viewport. `routeOrState` documents the product route/state and is not treated as an executable render instruction.

Screens render at `primaryViewport`. The local HTTP server binds to loopback on a random port and serves only the selected package directory. Rendering is local and deterministic; it uses no cloud/browser automation service and performs no OCR or image comparison.

Playwright normally uses its pinned Chromium build. For a constrained local environment where that browser cannot be downloaded, `MINIMART_DESIGN_BROWSER_PATH` may point to a compatible installed Chromium/Chrome executable; CI does not use this override.

## Operator workflow

When Claude Design finishes a module:

1. Export or copy the current source HTML into `docs/design/<module>/source/`.
2. Update `design-manifest.json`, including each screen's render instruction and PNG filename.
3. Run `pnpm design:validate`.
4. Run `pnpm design:render --package <module>`. Add `--pdf` when an archive PDF is wanted.
5. Review the generated screenshots locally.
6. Commit the source and manifest, plus tooling changes if any. Do not commit generated screenshots/PDFs.
7. Push the commit.
8. ChatGPT, Claude, or Codex can review that repository commit instead of requiring a manual PDF upload.

The explicit `pnpm run design:render -- --package <module>` form is equivalent if a shell or pnpm wrapper does not forward shorthand arguments.

## Commands

- `pnpm design:validate` validates every design manifest and repository-level invariants.
- `pnpm design:render --package inventory` renders one package and fails if its source is absent or it has no screens.
- `pnpm design:render --package back-office --pdf` also creates `exports/back-office.pdf`.
- `pnpm design:render --all-ready --pdf` renders every render-ready package whose source exists and skips draft/superseded packages.
- `pnpm test:design-render` runs the tooling tests.

Validation detects malformed schema data, duplicate screen numbers, render filename collisions, screen-count mismatches, unsafe paths, and missing source references for render-ready statuses. A direct single-package render always fails loudly for missing source, regardless of status.
