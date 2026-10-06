# MM-009 scratch verification package (fonts, licences, bounded renderer)

Status: scratch evidence only. Outside the repository. No standing. Nothing here adds a font,
dependency, lockfile entry or source file to the repository. No print job was sent. Fixtures are
fictional; test widths and caps are arbitrary and imply no pilot language or paper profile.
Date: 2026-10-06. Toolchain: `cargo +1.85.0` (the repository pin), x86_64 Windows.

## 1. Font package (downloaded into `D:\mm-scratch\fonts`)

| Item | Malayalam | Latin / Malay |
| --- | --- | --- |
| Repository | `notofonts/malayalam` | `notofonts/latin-greek-cyrillic` |
| Release tag | `NotoSansMalayalam-v2.104` | `NotoSans-v2.015` |
| Tag object SHA (GitHub API) | `2cf0bdd165ad149f5770e052c293dc16e23f5aba` | `0aabc14885f9edaf467f05a2499a1a00c09f0b56` |
| Published | 2023-03-27 | 2024-11-20 |
| Archive | `NotoSansMalayalam-v2.104.zip`, 21,451,358 bytes | `NotoSans-v2.015.zip`, 117,491,253 bytes |
| Archive SHA-256 (computed here) | `2ebd31e79f2893025d659def7784e0ec3557e7ff9ac105adcc82d35782913bf2` | `0c34df072a3fa7efbb7cbf34950e1f971a4447cffe365d3a359e2d4089b958f5` |
| Chosen file (inside archive) | `NotoSansMalayalam/unhinted/ttf/NotoSansMalayalam-Regular.ttf` | `NotoSans/unhinted/ttf/NotoSans-Regular.ttf` |
| Size | 77,312 bytes | 431,364 bytes |
| SHA-256 | `cc39bb1f7d63b582a2aec1abf2469a43b805a3523a27e0a0eee8cd32702541d5` | `f3961a9cde016d41a4879aecda1474d3a36d6bf54fa0e4643de029cc2248b0e8` |
| Static (no `fvar`) | yes | yes |
| `OS/2` fsType | 0 (installable embedding) | 0 |
| Name table version | `Version 2.104` | `Version 2.015` |
| Copyright string | `Copyright 2022 The Noto Project Authors (https://github.com/notofonts/malayalam)` | `Copyright 2022 The Noto Project Authors (https://github.com/notofonts/latin-greek-cyrillic)` |
| Embedded licence | SIL OFL 1.1 (name IDs 13 and 14, `https://scripts.sil.org/OFL`) | same |

Other variants exist in the archives (`full`, `googlefonts`, `hinted`, and `UI` families). The
unhinted static Regular files were chosen because they are smallest and the renderer ignores
hinting. That choice is a proposal.

Provenance limit: GitHub publishes no digest for these release assets (the API field was empty),
so the archive hashes above are first-party computations over an HTTPS download, not checked
against an upstream digest.

Archive hazard: the Malayalam archive contains six entries whose names start with `../` (for
example `../OFL.txt`). Any extraction must use controlled output names. The files here were
extracted by reading each entry and writing it to a fixed name.

Licence and notice files extracted (SHA-256):

| File | SHA-256 |
| --- | --- |
| `OFL-Malayalam.txt` (4,385 bytes) | `1df18163a0bf60f02131401ba1609df90051f40c4047684dda1c8a2e9586f7f2` |
| `OFL-NotoSans.txt` (4,396 bytes) | `cee9892f9f0cc8fe882c9e9537ee6a89621d86ee7ceaf70b02e2b2b1c25c061a` |
| `AUTHORS-*.txt` (identical, 247 bytes) | `727ab5b16dd99b3615f6fc2206f75fe78ac8ce54f20818e462b872ec57161d49` |
| `CONTRIBUTORS-Malayalam.txt` | `30fae4014e249126a40bc01aaaa8aad443d200472de9e897affe7c9a4cefc764` |
| `CONTRIBUTORS-NotoSans.txt` | `05c4af69baeccb7a5ec875df9661d09bde7363404bc5a8b10ce28cf86551f01b` |

The two OFL files differ only in the first copyright line (repository URL). AUTHORS and
CONTRIBUTORS contain only template comments, with no named authors.

### Licence terms (SIL OFL 1.1, read from the extracted files)

- Permission to use, study, copy, merge, embed, modify, redistribute and sell modified and
  unmodified copies, subject to five conditions.
- (1) The font, or any component, may not be sold by itself.
- (2) It may be bundled and redistributed or sold with any software, provided each copy contains
  the copyright notice and the licence text, as text files, headers or machine-readable metadata
  that the user can easily view.
- (3) A Modified Version may not use a Reserved Font Name. No Reserved Font Name is declared after
  either copyright statement, so this applies only if one is added.
- (4) Author and copyright-holder names may not be used to promote a Modified Version, except to
  acknowledge them.
- (5) The font itself, modified or not, must stay under this licence. The requirement does not
  apply to documents created using the font.
- The licence ends if a condition is not met.
- Required notices for any redistributed copy: the copyright line and the OFL text for each font.
- Open question (not verified, a legal reading): whether a 1-bit bitmap rendered from the font,
  printed on a receipt, needs any notice. The OFL text read here only says the font-licence
  requirement does not apply to documents created with the font. This should be confirmed by
  whoever owns licensing.

### Coverage measured with `ttf-parser` (fictional fixtures only)

| Probe set (size) | Noto Sans | Noto Sans Malayalam |
| --- | --- | --- |
| ASCII `!`..`~` (94) | 94 | 38 |
| Malayalam letters U+0D05..U+0D39 (53 slots) | 0 | 51 (two slots are unassigned) |
| Malayalam signs and vowel signs (16) | 0 | 16 |
| Chillu letters U+0D7A..U+0D7F (6) | 0 | 6 |
| Malayalam digits U+0D66..U+0D6F (10) | 0 | 10 |
| ZWNJ, ZWJ (2) | 2 | 2 |
| Dotted circle U+25CC, NBSP, U+20B9 | all 3 | all 3 |

The Malayalam font cannot be the only font: it lacks most Latin letters. Latin first, Malayalam
second was used for fallback.

### Cross-font line metrics (units per em 1000, at 24 px)

| Font | Ascender | Descender | Line gap | Scaled ascent / descent |
| --- | --- | --- | --- | --- |
| Noto Sans | 1069 | -293 | 0 | 25.7 / 7.0 |
| Noto Sans Malayalam | 864 | -383 | 0 | 20.7 / 9.2 |

Line box with the maximum over the fonts actually used: 36 px for a mixed line, 31 px for a
Malayalam-only line. Using only the primary font's metrics gave 34 px. No glyph in the fixtures
exceeded the primary-font box, so no clipping was observed; using the maximum over used fonts is
the safe policy and is what the revised proposal specifies.

## 2. Resolved dependency inventory (isolated project `D:\mm-scratch\mm009-solo`)

The proposed pair was resolved in a standalone project with its own lockfile. Resolving it inside
a larger workspace pulled in four extra crates through feature unification (`bytemuck_derive`,
`proc-macro2`, `quote`, `syn`), so the real repository resolution can differ if other crates in a
repository lockfile enable those features. That was not tested in the repository.

Licence files were read from the exact extracted sources in the local Cargo registry, not only
from crates.io metadata. The Cargo.lock checksum column is the registry checksum recorded in the
lockfile. No `NOTICE` file exists in any of them. Copyright holders seen in the licence files:
HarfBuzz developers and Yevhenii Reizner (rustybuzz); Yevhenii Reizner (ttf-parser,
unicode-bidi-mirroring, unicode-ccc); Daniel "Lokathor" Gee (bytemuck); Robert Bastian
(core_maths); The Rust Project Developers (bitflags, log, unicode-properties); The Servo Project
Developers (smallvec); Manish Goregaokar and The Unicode-rs Developers (unicode-script);
Rich Felker et al. and Jorge Aparicio (libm, which says copyright notices are retained in its
source files).

| Crate | Version | Licence (manifest) | Licence files read (SHA-256, first 12) | build.rs | Cargo.lock checksum |
| --- | --- | --- | --- | --- | --- |
| ab_glyph_rasterizer | 0.1.10 | Apache-2.0 | LICENSE a6cba85bc92e | no | `366ffbaa4442f4684d91e2cd7c5ea7c4ed8add41959a31447066e279e432b618` |
| bitflags | 2.13.2 | MIT OR Apache-2.0 | LICENSE-APACHE a60eea817514; LICENSE-MIT 6485b8ed310d | no | `3ded4057c258ba199e2d26386d3af3780957ecaee6c4ef4041c6b4b8b97c0b06` |
| bytemuck | 1.25.2 | Zlib OR Apache-2.0 OR MIT | LICENSE-APACHE e3ba223bb142; LICENSE-MIT 9df9ba60a11a; LICENSE-ZLIB 84b34dd7608f | no | `95832e849adfb21180ccb6826a99da14e5d266ae5c2e668e1602cf234f153797` |
| core_maths | 0.1.1 | MIT | LICENSE 9ebf8c4cc0b7 | no | `77745e017f5edba1a9c1d854f6f3a52dac8a12dd5af5d2f54aecf61e43d80d30` |
| libm | 0.2.16 | MIT | LICENSE.txt 3823dda7cf04 | yes | `b6d2cec3eae94f9f509c767b45932f1ada8350c4bdb85af2fcab4a3c14807981` |
| log | 0.4.34 | MIT OR Apache-2.0 | LICENSE-APACHE a60eea817514; LICENSE-MIT 6485b8ed310d | no | `f9f8bd3e56ce4dfc153cf470fffbfa98c7620958b312ca5c3a4b8d5181fd13c6` |
| rustybuzz | 0.20.1 | MIT | LICENSE 3a7c3f0b887a | no | `fd3c7c96f8a08ee34eff8857b11b49b07d71d1c3f4e88f8a88d4c9e9f90b1702` |
| smallvec | 1.16.2 | MIT OR Apache-2.0 | LICENSE-APACHE a60eea817514; LICENSE-MIT 0b28172679e0 | no | `f9395f0f0eee849a9b707b2f06bb92a6a422090e2123bb2ef8e87a0e61892a8e` |
| ttf-parser | 0.25.1 | MIT OR Apache-2.0 | LICENSE-APACHE a60eea817514; LICENSE-MIT f3c9fe731c70 | no | `d2df906b07856748fa3f6e0ad0cbaa047052d4a7dd609e231c4f72cee8c36f31` |
| unicode-bidi-mirroring | 0.4.0 | MIT/Apache-2.0 | LICENSE-APACHE a60eea817514; LICENSE-MIT 59a1fdac3bd5 | no | `5dfa6e8c60bb66d49db113e0125ee8711b7647b5579dc7f5f19c42357ed039fe` |
| unicode-ccc | 0.4.0 | MIT/Apache-2.0 | LICENSE-APACHE a60eea817514; LICENSE-MIT 59a1fdac3bd5 | no | `ce61d488bcdc9bc8b5d1772c404828b17fc481c0a582b5581e95fb233aef503e` |
| unicode-properties | 0.1.4 | MIT/Apache-2.0 | COPYRIGHT 23860c2a7b5d; LICENSE-APACHE a60eea817514; LICENSE-MIT 7b63ecd5f190 | no | `7df058c713841ad818f1dc5d3fd88063241cc61f49f5fbea4b951e8cf5a8d71d` |
| unicode-script | 0.5.8 | MIT OR Apache-2.0 | LICENSE-APACHE 7cbb56d1b5d8; LICENSE-MIT 7ad3ea8ca3ca | no | `383ad40bb927465ec0ce7720e033cb4ca06912855fc35db31b5755d0de75b1ee` |

13 crates in total, including `rustybuzz` and `ab_glyph_rasterizer`.

Notes:
- `libm` has a build script. No other crate in this set does.
- `ab_glyph_rasterizer` is Apache-2.0 only, with no MIT alternative. Its licence file has no
  copyright holder line (the unfilled Apache boilerplate only).
- Redistributing a binary that contains these crates means reproducing the MIT and Apache-2.0
  notices; a third-party notices bundle would be needed. That bundle is not produced here.
- Not verified: the Unicode data embedded in `unicode-script`, `unicode-properties`,
  `unicode-ccc` and `unicode-bidi-mirroring` is derived from Unicode data files. Their crates
  declare MIT or Apache-2.0; whether the Unicode data terms add a notice was not checked.

## 3. Experiment evidence (renderer v2, `D:\mm-scratch\mm009-solo\src\main.rs`)

- Builds on 1.85.0 with the two proposed crates. Shaping glyph ids from rustybuzz, harfrust and
  swash matched on the Malayalam fixtures (earlier run, Nirmala UI). v2 used the Noto fonts with
  rustybuzz only.
- Chillu letters (ൺ ൻ ർ ൽ ൾ), conjuncts (ക്ഷ സ്ത്രീ ന്ത ത്ത ശ്ശ ക്ക) and Latin/Malay text with
  digits and `RM 12.50` rendered with Noto fonts; the 1-bit images were checked by eye. Latin
  runs came from Noto Sans and Malayalam runs from Noto Sans Malayalam.
- Missing glyph: U+E000 is in neither font and returned a renderer-local `MissingGlyph` error
  with the character and byte offset, in both metric modes.
- Determinism: a second render in the same process gave an equal hash for every fixture and
  width tested.
- Cluster-safe wrapping, found by test: shaping clusters alone are not enough. Breaking only at
  rustybuzz cluster boundaries put a line break after a virama and before a following consonant
  (for example between `ത്` and `ര` inside `സ്ത്രീ`), which splits a conjunct. This showed up at
  every width tested (20 bad breaks at widths 24 and 48, 19 at 96, 7 at 200, 2 at 384) for a long
  unbroken word, and once in the short conjunct fixture at widths 24 and 48. The ordinary Malayalam sentence showed none. Adding a syllable guard
  on top of the clusters (no line may start with a vowel sign, a sign or a joiner, or with a
  letter that follows a virama) reduced bad breaks to 0 at widths 24, 48, 96, 200 and 384 for the
  conjunct, sentence and long-word fixtures.
- Bounds, with arbitrary scratch caps (2048 characters, 256 lines, 8192 px height, 1 MiB bitmap,
  256 px line box, width 1..=2048): over-length input, too many lines, an over-tall line box,
  width 0 and width 4096 each returned an error. Empty text and only-spaces text returned a
  `TooTall(0)` error from a zero line box and need an explicit empty-input rule. A width of 1
  produced output without error (three tall lines) and that is not acceptable behavior.
- Memory: per-line rasterization keeps the 4-byte-per-pixel accumulator to one line box
  (`width x line_height x 4`) plus the packed bitmap (`ceil(width/8) x height`). Examples: width
  384, 24 px: 57,024 bytes for a one-line mixed fixture, 61,008 for nine lines. Peak bytes were
  computed from these formulas, not measured by an allocator.
- Not solved: a single unbreakable cluster wider than the width is placed on its own line and
  clips on the right. The renderer should return a renderer-local error for it instead.

## 4. Unknowns remaining

- Upstream authenticity of the font archives beyond the HTTPS download and the tag object SHA.
- Whether a printed raster needs any OFL notice (a legal reading).
- Unicode data terms inside the four Unicode-table crates.
- Repository-lockfile resolution (feature unification) and the effect on the Tauri lockfile.
- Determinism on other CPUs, other Windows builds or other compiler versions.
- Rendering with `harfrust` or `swash` using the Noto fonts (not run).
- Readability, density, speed, cut and failure behavior on any physical printer.
- Whether the printer accepts a raster at all (DEC-HW-001 stays OPEN).
- Conjunct integrity at splits for scripts and sequences not in the fixtures.
- Hinted or other Noto variants were not compared.
