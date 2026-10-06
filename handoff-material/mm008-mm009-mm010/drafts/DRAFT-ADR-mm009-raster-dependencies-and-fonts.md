# DRAFT ADR: Dependencies and fonts for the MM-009 software renderer

- Status: DRAFT (revision 2). Not accepted. Lives only in scratch, outside the repository. No
  standing. The dependency pair is provisional until the owner reviews this draft.
- Date: 2026-10-06
- Scope: Implementation choice within Architecture v1.0 for the MM-009 software-only renderer. It
  does not decide the printer, command protocol, paper profile, production defaults, pilot
  languages or `renderPayload` semantics (DEC-HW-001 stays OPEN). It does not close or waive any
  Phase-0 gate; MM-007 and MM-008 acceptance stay open.
- Process: `docs/adr/README.md` says an ADR records reviewed implementation choices and does not
  override a frozen specification. `AGENTS.md` requires explicit owner direction before a decision
  touching architecture. ADR-0001 is the precedent for recording a dependency choice. This draft
  asks for review; it does not assume approval.
- Evidence: `D:\mm-scratch\MM009-verification-package.md` (font and licence package, resolved
  dependency inventory, experiment results, unknowns).

## Context

Architecture `33` Spike C requires rendering a multilingual receipt to a raster in the Rust
printing path. The frozen text names no shaping or imaging library, no font and no raster format.
Malayalam needs complex-script shaping. Malay in Latin script does not. The repository pins Rust
1.85.0, builds on Windows, and runs `cargo ... --locked` against two lockfiles (`Cargo.lock` and
`apps/pos-terminal/src-tauri/Cargo.lock`, because the Tauri crate depends on `crates/hw-printer`).
The crate denies Clippy `all` and `pedantic` warnings.

## Decision proposed (for owner review only)

1. **Shaping:** `rustybuzz =0.20.1` (MIT), pinned exactly.
2. **Rasterization:** `ab_glyph_rasterizer =0.1.10` (Apache-2.0), pinned exactly.
3. **Resolved set when the pair is resolved on its own:** 13 crates in total: those two plus
   `bitflags 2.13.2`, `bytemuck 1.25.2`, `core_maths 0.1.1`, `libm 0.2.16`, `log 0.4.34`,
   `smallvec 1.16.2`, `ttf-parser 0.25.1`, `unicode-bidi-mirroring 0.4.0`, `unicode-ccc 0.4.0`,
   `unicode-properties 0.1.4` and `unicode-script 0.5.8`. All declare MIT, Apache-2.0, Zlib or a
   choice among them; licence files were read from the exact sources. Only `libm` has a build
   script. The real repository resolution must be re-checked when the dependency is added,
   because feature unification in a larger lockfile can add crates.
4. **Fonts for tests (static, unhinted Regular, SIL OFL 1.1):**
   - `NotoSansMalayalam-Regular.ttf` from `notofonts/malayalam` tag `NotoSansMalayalam-v2.104`,
     77,312 bytes, SHA-256 `cc39bb1f7d63b582a2aec1abf2469a43b805a3523a27e0a0eee8cd32702541d5`.
   - `NotoSans-Regular.ttf` from `notofonts/latin-greek-cyrillic` tag `NotoSans-v2.015`, 431,364
     bytes, SHA-256 `f3961a9cde016d41a4879aecda1474d3a36d6bf54fa0e4643de029cc2248b0e8`.
   - Each is committed (later, if approved) with its OFL text, its copyright line and a hash
     manifest, never fetched at test time and never replaced by a system font.
   - Fallback order: Noto Sans first for Latin, Malay and digits; Noto Sans Malayalam for
     Malayalam. Noto Sans Malayalam covers only 38 of the 94 ASCII characters, so it cannot be
     used alone.
5. **Font licence conditions to honour:** keep the copyright notice and OFL text with every
   distributed copy; do not sell the font by itself; do not modify it under a Reserved Font Name
   (none is declared); keep the font under the OFL; do not use author names to promote a modified
   version. Whether a printed raster needs any notice is an open legal reading.
6. **Renderer-local errors:** one error type kept inside the raster module, not exported and not
   mapped to the hardware-command error categories. It must not be treated as an approved
   `RasterError`. Any mapping to `UNSUPPORTED` or `INVALID_DATA` at an adapter boundary is a
   separate later decision with the owner and the hardware contract.
7. **No adapter coupling:** the renderer takes text, font bytes and an explicit pixel width and
   returns a 1-bit bitmap. It emits no printer command bytes and has no spooler, Tauri or
   WebView access.

## Revised bounded-renderer requirements (from the experiment)

- **Line metrics:** the maximum ascent, descent and line gap over the fonts actually used.
  Noto Sans is 25.7 / 7.0 px at 24 px; Noto Sans Malayalam is 20.7 / 9.2 px.
- **Missing glyphs:** choose a font by character coverage, and also treat glyph id 0 after shaping
  as an error that reports the character and byte offset. Joiners (U+200C, U+200D) stay with the
  previous run's font.
- **Wrapping:** break at spaces first. For an over-wide word, break only at a position that is
  both a shaping-cluster boundary and syllable-safe. Cluster boundaries alone are not safe: they
  allowed a break after a virama before the next consonant, which splits a conjunct, at every
  width tested. A guard that forbids a line start on a vowel sign, a sign or a joiner, or on a
  letter following a virama, removed all such breaks in the fixtures.
- **Unbreakable cluster wider than the width:** return a renderer-local error instead of clipping.
- **Empty or whitespace-only input:** an explicit rule (error or empty result), not a side effect
  of a zero-height line box.
- **Bounds (arbitrary scratch values, to be set by the owner for any real use):** maximum input
  characters, maximum lines, maximum total height, maximum bitmap bytes, maximum line-box height,
  and a width range. Exceeding any of them returns an error before large allocation.
- **Memory:** rasterize one line at a time. Peak working memory is the packed bitmap
  (`ceil(width/8) x height`) plus one line accumulator (`width x line_height x 4` bytes). These are
  computed figures, not allocator measurements.
- **Determinism:** pin crate and font versions; compare bitmap hashes only on the CI platform. Hash
  equality was seen across runs, processes and debug versus release builds on one machine, but not
  across CPUs.

## Proposed repository diff scope (not started)

- `crates/hw-printer/Cargo.toml`: the two direct dependencies, exact versions.
- `Cargo.lock` and `apps/pos-terminal/src-tauri/Cargo.lock`: the new locked crates.
- `crates/hw-printer/src/raster.rs` (new) and a one-line module declaration in `lib.rs`.
- `crates/hw-printer/tests/`: fictional fixtures, golden hashes, the two fonts, their OFL texts and
  a hash manifest, plus a third-party notices file for the crates.
- `docs/phase-0/mm-009-raster-receipt-spike.md` and the handoff update.
- No Tauri command, no spooler call, no protocol bytes, no `renderPayload` change, no change to
  frozen documents.

## Remaining unknowns (not blocking this review)

- Upstream authenticity of the font archives beyond the HTTPS download and the tag object SHA
  (GitHub published no digest for the assets).
- Whether a printed raster needs any OFL notice (a legal reading).
- Unicode data terms inside the four Unicode-table crates.
- Repository-lockfile resolution and the effect on the Tauri lockfile.
- Determinism on other CPUs or compiler versions.
- `harfrust` or `swash` with the Noto fonts (not run); the long-term maintenance direction of
  `rustybuzz` was not verified.
- Everything physical: readability, density, speed, cut, failure behavior, and whether the pilot
  printer accepts a raster at all.

## Decisions needed from the owner

1. Approve (or change) the two dependencies. The pair stays provisional until then.
2. Approve the two Noto fonts and the unhinted static Regular variant, or choose others.
3. Confirm who owns the licensing reading for the printed-raster notice question and the
   third-party notices file.
4. Confirm that the renderer-local error type stays internal.

## Not decided here

Printer, command protocol, paper width, production defaults, pilot languages, `renderPayload`
semantics, any hardware-error mapping, and Phase-0 sequencing.
