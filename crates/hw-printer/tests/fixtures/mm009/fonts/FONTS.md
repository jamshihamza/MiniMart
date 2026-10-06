# MM-009 test fonts

These two fonts are test fixtures for the MM-009 software-only raster renderer (ADR 0006). They are
used unmodified. They are not production fonts, and no pilot language is implied.

| File                            | Family                                          | Version | Size    | SHA-256                                                            |
| ------------------------------- | ----------------------------------------------- | ------- | ------- | ------------------------------------------------------------------ |
| `NotoSans-Regular.ttf`          | Noto Sans, Regular (unhinted, static)           | 2.015   | 431,364 | `f3961a9cde016d41a4879aecda1474d3a36d6bf54fa0e4643de029cc2248b0e8` |
| `NotoSansMalayalam-Regular.ttf` | Noto Sans Malayalam, Regular (unhinted, static) | 2.104   | 77,312  | `cc39bb1f7d63b582a2aec1abf2469a43b805a3523a27e0a0eee8cd32702541d5` |

The renderer tests compute both hashes and fail if a font file changes.

## Provenance

|                         | Noto Sans                                                                                                            | Noto Sans Malayalam                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Repository              | `notofonts/latin-greek-cyrillic`                                                                                     | `notofonts/malayalam`                                                                                                        |
| Release tag             | `NotoSans-v2.015` (tag object `0aabc14885f9edaf467f05a2499a1a00c09f0b56`)                                            | `NotoSansMalayalam-v2.104` (tag object `2cf0bdd165ad149f5770e052c293dc16e23f5aba`)                                           |
| Release archive         | `NotoSans-v2.015.zip`, 117,491,253 bytes, SHA-256 `0c34df072a3fa7efbb7cbf34950e1f971a4447cffe365d3a359e2d4089b958f5` | `NotoSansMalayalam-v2.104.zip`, 21,451,358 bytes, SHA-256 `2ebd31e79f2893025d659def7784e0ec3557e7ff9ac105adcc82d35782913bf2` |
| Path inside the archive | `NotoSans/unhinted/ttf/NotoSans-Regular.ttf`                                                                         | `NotoSansMalayalam/unhinted/ttf/NotoSansMalayalam-Regular.ttf`                                                               |

The archive hashes were computed from an HTTPS download of the official GitHub release assets.
GitHub published no digest for them, so they are not checked against an upstream value. The
Malayalam archive contains entries whose names start with `../`; the files here were extracted by
reading each entry and writing it to a fixed name.

## Licence

Both fonts are licensed under the SIL Open Font License, Version 1.1 (`OFL-NotoSans.txt`,
`OFL-NotoSansMalayalam.txt`; also embedded in each font's name table). The copyright statements are
`Copyright 2022 The Noto Project Authors (https://github.com/notofonts/latin-greek-cyrillic)` and
`Copyright 2022 The Noto Project Authors (https://github.com/notofonts/malayalam)`. No Reserved
Font Name is declared after either statement. `AUTHORS.txt` and the two `CONTRIBUTORS-*.txt` files
come from the same releases.

Conditions kept: the copyright notice and licence text stay with every copy of the fonts; the fonts
are not sold by themselves; they are not modified; they stay under the OFL; author names are not
used to promote anything. Whether a printed raster rendered from these fonts needs any notice is an
open reading for whoever owns licensing; the OFL text only says its font-licence requirement does
not apply to documents created with the font.

The two fonts and the five `.txt` files are byte-identical to the release archive entries
(compared directly; the text files already use LF). Whitespace in the vendor text files, such as
trailing spaces in the OFL text and a final blank line in `AUTHORS.txt`, is original and was not
edited.
