# MM-009 non-Latin raster receipt spike (software only)

## Authority and scope

MM-009 in the frozen Phase-0 backlog requires a receipt test that proves the selected rendering path
for the required scripts. Architecture `33`, Spike C, requires rendering a representative
multilingual receipt to a raster in the Rust printing path and printing it on the exact pilot
printer model, with evidence of readable output, acceptable speed, correct width and cut behavior,
and a documented fallback or error state. Where in pilot scope, the exact target printer is tested
with rasterized Malayalam and Malay content (Architecture `33` and `35`).

This document covers only the software part: a pure, bounded text-to-bitmap renderer. It sends no
print job and emits no printer command bytes. The printer model, command protocol, paper profile,
production defaults, pilot languages and `renderPayload` semantics are not chosen here
(`DEC-HW-001` stays OPEN). The dependency and font choice is recorded in
`docs/adr/0006-mm-009-raster-renderer-dependencies-and-fonts.md`. MM-007 physical acceptance and
MM-008 acceptance are separate and still open; this work does not close or waive any Phase-0 gate.

**Status: software feasibility only. MM-009 acceptance is INCOMPLETE.** Nothing here proves
readability, width, speed, cut or failure behavior on a printer.

## What was built

- `crates/hw-printer/src/raster.rs`: `render(fonts, request, limits)` turns text into a packed 1-bit
  bitmap. `FontSet` holds fonts in fallback order. There is no default for `RenderLimits`; every
  bound is supplied by the caller.
- `crates/hw-printer/src/raster/guard.rs`: the heuristic that decides where a line may start inside
  an over-wide word.
- `crates/hw-printer/src/raster/tests.rs`: 42 focused tests.
- Test fonts, notices and the third-party notices file (see below).

The module is `pub(crate)`-internal and nothing else in the crate calls it yet, so it compiles for
tests only. It adds no Tauri command, no spooler call and no new capability.

## Behavior

- Input is UTF-8 text in one or more paragraphs separated by `\n`. Any other control character is an
  error (`ControlCharacter`).
- Empty text and text made only of Unicode whitespace is an error (`EmptyInput`). A blank paragraph
  between non-blank ones, or after a final `\n`, becomes one blank line.
- Only U+0020 is a breakable space. Runs of U+0020 inside a line keep their width; spaces at a
  paragraph start, a paragraph end or a wrap point are dropped.
- A font is chosen per character: the first font in the set that has a glyph. A character that
  continues a sequence the wrap guard treats as one unit (a combining mark, a joiner, or a consonant
  after a Malayalam virama) must use the previous character's font. If that font cannot draw it the
  result is `FontSequenceSplit`, so a sequence is never shaped as separate runs in different fonts
  and drawn detached. A character in no font, or a glyph id 0 after shaping, is `MissingGlyph` with
  the character and its byte offset. An invalid sequence, such as a lone vowel sign, is shaped as the
  shaper does (with a dotted circle) and is not rejected; the renderer does not validate
  orthography.
- Text is left-to-right only. Bidirectional formatting characters and runs the shaper reports as
  right-to-left are `UnsupportedDirection`; there is no reordering. No fixture font covers a
  right-to-left script, so the shaped-direction check is tested through its predicate only.
- A word that does not fit moves to a new line. A word wider than the line is split only at a
  shaping-cluster boundary that also passes the guard. If one indivisible unit is wider than the
  line the result is `IndivisibleUnitTooWide`. Ink that would pass the right edge is
  `InkOutsideWidth`; a left overhang is padded rather than clipped. Nothing is clipped silently.
- The line box is one height for the whole bitmap: the maximum over the fonts actually used of the
  font ascent, descent and gap, raised where a glyph's ink is taller. A Latin-only text uses only the
  Latin font's metrics.
- Every size is computed with checked arithmetic and compared with the caller's limits before the
  bitmap is allocated, and lines are rasterized one at a time. The caller supplies limits for input
  characters, shaped glyphs (spaces and wrap-dropped glyphs included), outline commands walked, lines,
  line box, height and working bytes. Working bytes are the packed bitmap, one line's coverage
  accumulator (`width x line height x 4`) and the retained glyph records (`size_of` one glyph each).
  These are computed figures, not allocator measurements. The shaper's own transient buffers are not
  measured in bytes; they grow with the longest word, which the character and glyph limits bound.
  The outline-command budget is checked while measuring, before any drawing, and each glyph's ink
  bounds come from walking its outline rather than from the glyph header; a glyph whose header says
  it has ink but whose outline cannot be read is `GlyphOutlineUnavailable`. Total drawing work is
  `width x height` pixel visits, which the working-bytes limit bounds.
- Output is deterministic for the same inputs on one platform and compiler. Equality across CPUs or
  compilers is not verified. The tests keep two things apart: portable correctness (integer
  layout fingerprints and bitmap structure, run everywhere) and exact-platform determinism (pixel
  hashes, compiled only for `x86_64` Windows, the Rust CI platform). A pixel hash shows repeatability
  on that platform, not correctness elsewhere.
- Errors are renderer-local. They are not mapped to the hardware-command error categories.

## Heuristic guard: what it is and is not

Shaping clusters alone are not safe break points. With rustybuzz 0.20.1 and the Noto Sans Malayalam
font, the second cluster of `സ്ത്രീ` starts directly after a virama and before a consonant, so a
cluster-only wrap splits the conjunct across lines. In an earlier scratch run this happened at every
tested width for a long unbroken word. The guard adds code-point rules on top of the clusters: no
line may start with a combining mark, a joiner, a Malayalam sign or vowel sign, or with a Malayalam
consonant that follows a Malayalam virama.

It is a heuristic, written for and checked against a few fictional Malayalam and Latin fixtures. It
does **not** claim general Unicode correctness. Tests pin the cases it does not protect: Devanagari,
Tamil and Bengali viramas, emoji ZWJ sequences, regional indicators and Hangul jamo. A future change
that adds protection will show up as a failing test.

## Dependency and licence record

Direct dependencies of `crates/hw-printer`: `rustybuzz =0.20.1` and `ab_glyph_rasterizer =0.1.10`.

- Root `Cargo.lock`: 13 crates added (the two plus `bitflags 2.13.2`, `bytemuck 1.25.2`,
  `core_maths 0.1.1`, `libm 0.2.16`, `log 0.4.34`, `smallvec 1.16.2`, `ttf-parser 0.25.1`,
  `unicode-bidi-mirroring 0.4.0`, `unicode-ccc 0.4.0`, `unicode-properties 0.1.4`,
  `unicode-script 0.5.8`). No extra crates appeared through feature unification.
- `apps/pos-terminal/src-tauri/Cargo.lock`: nine of them added; `bitflags`, `bytemuck`, `log` and
  `smallvec` were already resolved at the same versions. In that workspace `log` is built with a
  feature that pulls `serde_core`, which is existing behavior, not new.
- Licences read from the exact crate sources: MIT, Apache-2.0, Zlib or a choice among them; MIT
  elected where offered. Only `libm` has a build script. The texts are reproduced in
  `crates/hw-printer/THIRD-PARTY-NOTICES.md`, text-identical to the sources apart from line endings and trailing blank lines (see
  the whitespace notes below).
- Fonts: unmodified Noto Sans 2.015 and Noto Sans Malayalam 2.104, SIL OFL 1.1, bound to their
  SHA-256 hashes in the tests, with copyright and licence texts in
  `crates/hw-printer/tests/fixtures/mm009/fonts/` (`FONTS.md` records provenance).

Unresolved licence questions:

- Four crates embed tables derived from Unicode data (UCD 16.0.0 and 17.0.0) and say nothing about
  Unicode terms; `rustybuzz` embeds tables derived from HarfBuzz. The Unicode License V3 text is
  included in the notices file as a precaution; whether it is required was not resolved.
- `libm` states that copyright notices are retained in its source files. Those files are not
  reproduced.
- Whether a printed raster of OFL fonts needs any notice.
- Whether the notices file suffices for a distributed binary. No distribution is planned.

## Software validation

Run in an isolated worktree from `origin/main` (`1eb8e82`); nothing else in the repository was
changed.

- `pnpm run check:rust` passed (exit 0) after the pre-checkpoint review fixes: root and Tauri
  `cargo fmt --check`, `cargo check`, `cargo test` and `cargo clippy --all-targets -- -D warnings`,
  all with `--locked`. The crate keeps Clippy `all` and `pedantic` denied. The `hw-printer` crate
  ran 46 tests (42 new raster tests and the 4 existing ones); the Tauri crate ran 4. Earlier in the
  same work `pnpm run ci` passed (exit 0) before the review fixes; after them only the affected
  Rust gate and Prettier on the changed documents were rerun.
- The new tests cover: shaping (a conjunct is one glyph, an explicit chillu sequence equals the
  atomic chillu, a prebase vowel sign stays in its cluster, cluster-only breaks inside a conjunct
  and the guard forbidding them); font fallback, joiner and sequence font inheritance, and the
  `FontSequenceSplit` error; missing glyphs with byte offsets; bidirectional controls; fallback-aware
  and ink-raised line metrics; empty, whitespace-only and control-character input; paragraphs, edge
  spaces and wrap points; syllable-safe wrapping of a long word at five widths; indivisible-unit and
  ink-overhang errors; the guard's protected cases and its pinned limits; width, pixel-size, length,
  glyph, outline-command, line, height and memory limits including exact boundaries; checked
  arithmetic including a wraparound case; font-set errors; bitmap geometry; repeatability; portable
  layout fingerprints and bitmap structure; exact-platform pixel hashes; and the font hash and
  notice checks.
- Mutation checks, each caught by the tests and then reverted: guard off, ink check off,
  indivisible-unit check off, metrics from the first font only, left padding off, reversed
  fallback order, unchecked height multiplication, off-by-one memory and character limits, a
  weakened empty-input rule, the font-sequence rule off, bidirectional controls allowed, the glyph
  budget off, the outline budget off, and glyph records dropped from the memory sum. Some first
  attempts did not apply because the source had been reformatted and were redone; one mutation
  (unchecked height multiplication) initially survived and led to the wraparound test case.
- Known limits of these checks: the pixel hashes were recorded on the development machine (x86_64
  Windows) and are expected to match the Rust CI job (`windows-latest`); that match has not been
  observed on CI. No fixture font covers a right-to-left script. `GlyphOutlineUnavailable` needs a
  malformed font and has no test.

## Pre-checkpoint review notes

Defects found and fixed in the software renderer: per-character fallback could shape a mark or a
post-virama consonant in a different font from its base without any error; right-to-left text and
bidirectional controls were drawn without reordering; glyph ink bounds came from the glyph header
rather than the outline; the limits did not cover shaped glyphs, outline work or the glyph records.

Whitespace, verbatim third-party files (original bytes preserved; the two fonts and five text files
are byte-identical to the release entries): `git diff --check` reports trailing whitespace on line
21 of both OFL texts and a blank line at the end of `AUTHORS.txt`. These are original vendor bytes
and were not edited. Authored files: `git diff --check` is clean when those three vendor files are
excluded. The third-party notices file embeds vendor licence texts in fenced blocks; they are
text-identical to the crate sources but not byte-identical (line endings normalized to LF, since one
source uses CRLF; trailing blank lines removed). No repository-wide check was changed or weakened.

## Software previews

Eight previews were produced into scratch storage outside the repository by running the tests with
`MM009_PREVIEW_DIR` set: conjuncts, chillu letters, a mixed Malayalam/Latin line, Malay and
Malayalam wrapped paragraphs at two widths, a long unbroken conjunct word, and a multi-paragraph
text with a blank line. They were checked by eye only. A bitmap preview is not physical evidence.

## Not verified (acceptance gaps)

- Everything physical on the exact pilot printer: readability and stroke density at the real dot
  pitch, width and layout against the real paper profile, print speed, feed and cut behavior, and
  failure behavior. The 0.5 coverage threshold gives thin strokes; whether that reads on thermal
  paper is unknown.
- Whether the pilot printer accepts a raster at all, and through which transport (`DEC-HW-001`).
- Pilot languages. Malay in Latin script may need no raster; the fixtures establish no language
  decision.
- Determinism on other CPUs, operating systems or compilers.
- Correct wrapping for scripts and sequences outside the fixtures.
- Performance beyond a few milliseconds per fixture on one development machine.
- Licence questions listed above.

## Status

Software feasibility work for MM-009 is done and ready for review. MM-009 acceptance is
**INCOMPLETE** until the physical evidence required by Architecture `33` exists on the exact pilot
printer. No Phase-0 gate is waived.
