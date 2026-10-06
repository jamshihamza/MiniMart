# ADR 0006: MM-009 software raster renderer dependencies and test fonts

- Status: Accepted (owner-approved on 2026-10-06 and bounded to the MM-009 software-only spike; it
  takes effect in the repository only when this change is committed)
- Date: 2026-10-06
- Scope: Implementation choice within Architecture v1.0 for the MM-009 software-only renderer in
  `crates/hw-printer`
- Approval: the repository owner approved the stack below on 2026-10-06 after reviewing a draft
  and a scratch verification of the fonts and dependency licences

## Context

Architecture `33`, Spike C, requires rendering a representative multilingual receipt to a raster in
the Rust printing path and printing it on the exact pilot printer. The frozen text names no shaping
library, imaging library, font or raster format. Malayalam needs complex-script shaping; Malay in
Latin script does not. The repository pins Rust 1.85.0 and runs `cargo` with `--locked` against two
lockfiles, because the Tauri crate depends on `crates/hw-printer`.

## Decision

For the MM-009 software-only spike, `crates/hw-printer` may depend on:

- `rustybuzz =0.20.1` (MIT) for text shaping, and
- `ab_glyph_rasterizer =0.1.10` (Apache-2.0) for coverage rasterization,

and may use two unmodified test fonts, each bound to its SHA-256 hash in the tests, with the
copyright notices and SIL Open Font License 1.1 texts retained next to them:

- `NotoSans-Regular.ttf`, Noto Sans 2.015, SHA-256
  `f3961a9cde016d41a4879aecda1474d3a36d6bf54fa0e4643de029cc2248b0e8`;
- `NotoSansMalayalam-Regular.ttf`, Noto Sans Malayalam 2.104, SHA-256
  `cc39bb1f7d63b582a2aec1abf2469a43b805a3523a27e0a0eee8cd32702541d5`.

Exact versions, hashes, release tags and provenance are recorded in
`crates/hw-printer/tests/fixtures/mm009/fonts/FONTS.md`. The crates' licence texts are reproduced in
`crates/hw-printer/THIRD-PARTY-NOTICES.md`.

## What this decision does not decide

It does not select a production font, a pilot language, a printer, a command protocol, a paper
profile, any production default, or the meaning of `renderPayload`. It does not add a Tauri command,
a spooler call, printer command bytes or a print job. It does not close or waive any Phase-0 gate,
and MM-009 acceptance stays incomplete until the physical evidence required by Architecture `33`
exists on the exact pilot printer.

## Conditions

- The renderer is a pure function of text, caller-supplied fonts, an explicit width and explicit
  limits. It takes no default limits and has no device access. The limits cover input length,
  shaped glyphs, outline commands, lines, line box, height and a byte bound on the bitmap, one line
  accumulator and the retained glyph records.
- Renderer errors stay internal to the crate. They are not mapped to the hardware-command error
  categories and are not an approved contract.
- The fonts stay unmodified, with their copyright notices and OFL text, and are used only as test
  fixtures here.
- Any change to the pinned crate versions, the fonts or their hashes needs a new decision.

## Consequences

- Both lockfiles change. Resolved on its own, the pair adds 13 crates to the root `Cargo.lock`:
  `ab_glyph_rasterizer 0.1.10`, `bitflags 2.13.2`, `bytemuck 1.25.2`, `core_maths 0.1.1`,
  `libm 0.2.16`, `log 0.4.34`, `rustybuzz 0.20.1`, `smallvec 1.16.2`, `ttf-parser 0.25.1`,
  `unicode-bidi-mirroring 0.4.0`, `unicode-ccc 0.4.0`, `unicode-properties 0.1.4` and
  `unicode-script 0.5.8`. The Tauri lockfile adds nine of them; it already resolved `bitflags`,
  `bytemuck`, `log` and `smallvec` at the same versions. Only `libm` has a build script.
- All 13 crates declare MIT, Apache-2.0, Zlib or a choice among them. MIT was elected where offered.
- Licence questions that remain unresolved, and that this decision does not settle:
  - Four crates embed tables derived from Unicode data files and say nothing about Unicode terms.
    The Unicode License V3 text is included in the notices file as a precaution only.
  - `libm` says copyright notices are retained in its source files; those files are not reproduced.
  - Whether a printed raster rendered from OFL fonts needs any notice.
  - Whether the notices file is sufficient for a distributed binary, which is not planned yet.
- Wrapping inside an over-wide word relies on a heuristic guard that was written for and checked
  against fictional Malayalam and Latin fixtures. It is not a general Unicode line-breaking
  implementation, and other scripts and emoji sequences are not protected. The guard's limits are
  documented in its source and pinned by tests.
- Output hashes in the tests were recorded on the CI platform with the pinned crates and fonts.
  Equality on other CPUs or compilers is not verified.
