//! MM-009 raster renderer tests. Fixtures are fictional Malayalam and Latin/Malay text. Widths, pixel
//! sizes and limits here are test-fixture values, not production defaults and not a paper profile.

use std::fmt::Write as _;

use super::guard::is_unsafe_boundary;
use super::{
    FontSet, Glyph, LineBox, MonoBitmap, RenderError, RenderLimits, RenderRequest, check_sizes,
    choose_font, glyph_ink, is_supported_direction, layout_text, render, shape_token,
};

const SANS: &[u8] = include_bytes!("../../tests/fixtures/mm009/fonts/NotoSans-Regular.ttf");
const MALAYALAM: &[u8] =
    include_bytes!("../../tests/fixtures/mm009/fonts/NotoSansMalayalam-Regular.ttf");
const OFL_SANS: &str = include_str!("../../tests/fixtures/mm009/fonts/OFL-NotoSans.txt");
const OFL_MALAYALAM: &str =
    include_str!("../../tests/fixtures/mm009/fonts/OFL-NotoSansMalayalam.txt");

const SANS_SHA256: &str = "f3961a9cde016d41a4879aecda1474d3a36d6bf54fa0e4643de029cc2248b0e8";
const MALAYALAM_SHA256: &str = "cc39bb1f7d63b582a2aec1abf2469a43b805a3523a27e0a0eee8cd32702541d5";

/// Test-fixture limits. Not defaults and not production values.
const LIMITS: RenderLimits = RenderLimits {
    max_chars: 2048,
    max_glyphs: 4096,
    max_outline_commands: 1_000_000,
    max_lines: 256,
    max_width: 2048,
    max_pixel_size: 128,
    max_line_box: 256,
    max_height: 8192,
    max_working_bytes: 1 << 20,
};

/// Test-fixture size in dots. Arbitrary; implies no paper profile.
const PX: u16 = 24;

const CONJUNCTS: &str = "ക്ഷ സ്ത്രീ ന്ത ത്ത ശ്ശ ക്ക";
const CHILLU: &str = "ൺ ൻ ർ ൽ ൾ അവൻ ഇൻ";
const MIXED: &str = "ചായ x2   RM 12.50 നന്ദി";
const MALAY: &str = "Jumlah: RM 12.50. Terima kasih, sila datang lagi ke kedai kami. Barang yang dibeli tidak boleh ditukar.";
const MALAYALAM_SENTENCE: &str = "ഇത് ഒരു സാങ്കൽപ്പിക രസീതാണ്. നന്ദി, വീണ്ടും വരിക. ഇനിയും സന്ദർശിക്കുക.";

fn fonts() -> FontSet<'static> {
    FontSet::new(&[SANS, MALAYALAM]).expect("fixture fonts load")
}

fn request(text: &str, width: u16) -> RenderRequest<'_> {
    RenderRequest {
        text,
        width,
        pixel_size: PX,
    }
}

fn render_ok(text: &str, width: u16) -> MonoBitmap {
    render(&fonts(), &request(text, width), &LIMITS).expect("renders")
}

fn ink_count(bitmap: &MonoBitmap) -> u32 {
    bitmap.bits.iter().map(|byte| byte.count_ones()).sum()
}

fn long_conjunct_word() -> String {
    "ക്ഷ".repeat(40) + &"സ്ത്രീ".repeat(20) + "ന്ത"
}

// ---- minimal SHA-256 (std only) so the font binding needs no extra dependency ----

const K: [u32; 64] = [
    0x428a_2f98,
    0x7137_4491,
    0xb5c0_fbcf,
    0xe9b5_dba5,
    0x3956_c25b,
    0x59f1_11f1,
    0x923f_82a4,
    0xab1c_5ed5,
    0xd807_aa98,
    0x1283_5b01,
    0x2431_85be,
    0x550c_7dc3,
    0x72be_5d74,
    0x80de_b1fe,
    0x9bdc_06a7,
    0xc19b_f174,
    0xe49b_69c1,
    0xefbe_4786,
    0x0fc1_9dc6,
    0x240c_a1cc,
    0x2de9_2c6f,
    0x4a74_84aa,
    0x5cb0_a9dc,
    0x76f9_88da,
    0x983e_5152,
    0xa831_c66d,
    0xb003_27c8,
    0xbf59_7fc7,
    0xc6e0_0bf3,
    0xd5a7_9147,
    0x06ca_6351,
    0x1429_2967,
    0x27b7_0a85,
    0x2e1b_2138,
    0x4d2c_6dfc,
    0x5338_0d13,
    0x650a_7354,
    0x766a_0abb,
    0x81c2_c92e,
    0x9272_2c85,
    0xa2bf_e8a1,
    0xa81a_664b,
    0xc24b_8b70,
    0xc76c_51a3,
    0xd192_e819,
    0xd699_0624,
    0xf40e_3585,
    0x106a_a070,
    0x19a4_c116,
    0x1e37_6c08,
    0x2748_774c,
    0x34b0_bcb5,
    0x391c_0cb3,
    0x4ed8_aa4a,
    0x5b9c_ca4f,
    0x682e_6ff3,
    0x748f_82ee,
    0x78a5_636f,
    0x84c8_7814,
    0x8cc7_0208,
    0x90be_fffa,
    0xa450_6ceb,
    0xbef9_a3f7,
    0xc671_78f2,
];

fn sha256_block(state: &mut [u32; 8], block: &[u8]) {
    let mut w = [0_u32; 64];
    for (slot, word) in w.iter_mut().zip(block.chunks_exact(4)) {
        *slot = u32::from_be_bytes([word[0], word[1], word[2], word[3]]);
    }
    for i in 16..64 {
        let s0 = w[i - 15].rotate_right(7) ^ w[i - 15].rotate_right(18) ^ (w[i - 15] >> 3);
        let s1 = w[i - 2].rotate_right(17) ^ w[i - 2].rotate_right(19) ^ (w[i - 2] >> 10);
        w[i] = w[i - 16]
            .wrapping_add(s0)
            .wrapping_add(w[i - 7])
            .wrapping_add(s1);
    }
    let mut v = *state;
    for i in 0..64 {
        let s1 = v[4].rotate_right(6) ^ v[4].rotate_right(11) ^ v[4].rotate_right(25);
        let ch = (v[4] & v[5]) ^ (!v[4] & v[6]);
        let t1 = v[7]
            .wrapping_add(s1)
            .wrapping_add(ch)
            .wrapping_add(K[i])
            .wrapping_add(w[i]);
        let s0 = v[0].rotate_right(2) ^ v[0].rotate_right(13) ^ v[0].rotate_right(22);
        let maj = (v[0] & v[1]) ^ (v[0] & v[2]) ^ (v[1] & v[2]);
        let t2 = s0.wrapping_add(maj);
        v = [
            t1.wrapping_add(t2),
            v[0],
            v[1],
            v[2],
            v[3].wrapping_add(t1),
            v[4],
            v[5],
            v[6],
        ];
    }
    for (slot, value) in state.iter_mut().zip(v) {
        *slot = slot.wrapping_add(value);
    }
}

fn sha256_hex(data: &[u8]) -> String {
    let mut state: [u32; 8] = [
        0x6a09_e667,
        0xbb67_ae85,
        0x3c6e_f372,
        0xa54f_f53a,
        0x510e_527f,
        0x9b05_688c,
        0x1f83_d9ab,
        0x5be0_cd19,
    ];
    let mut message = data.to_vec();
    let bit_length = u64::try_from(data.len()).expect("length fits") * 8;
    message.push(0x80);
    while message.len() % 64 != 56 {
        message.push(0);
    }
    message.extend_from_slice(&bit_length.to_be_bytes());
    for block in message.chunks_exact(64) {
        sha256_block(&mut state, block);
    }
    state.iter().fold(String::new(), |mut out, word| {
        write!(out, "{word:08x}").expect("write to string");
        out
    })
}

#[test]
fn sha256_matches_known_vectors() {
    assert_eq!(
        sha256_hex(b""),
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
    assert_eq!(
        sha256_hex(b"abc"),
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
}

// ---- fonts and notices ----

#[test]
fn fixture_fonts_match_the_recorded_hashes() {
    assert_eq!(sha256_hex(SANS), SANS_SHA256);
    assert_eq!(sha256_hex(MALAYALAM), MALAYALAM_SHA256);
}

#[test]
fn font_licence_texts_and_copyright_notices_are_retained() {
    for text in [OFL_SANS, OFL_MALAYALAM] {
        assert!(text.contains("Copyright 2022 The Noto Project Authors"));
        assert!(text.contains("SIL OPEN FONT LICENSE Version 1.1"));
    }
}

// ---- shaping ----

fn shaped(text: &str) -> Vec<Glyph> {
    shape_token(&fonts(), text, 0, text.len(), PX).expect("shapes")
}

#[test]
fn a_conjunct_shapes_to_one_glyph() {
    assert_eq!(shaped("ക്ഷ").len(), 1);
    assert!(shaped("സ്ത്രീ").len() < "സ്ത്രീ".chars().count());
}

#[test]
fn an_explicit_chillu_sequence_shapes_like_the_atomic_chillu() {
    let explicit = shaped("ന\u{0D4D}\u{200D}");
    let atomic = shaped("ൻ");
    assert_eq!(explicit.len(), 1);
    assert_eq!(explicit[0].gid, atomic[0].gid);
}

#[test]
fn a_prebase_vowel_sign_stays_in_its_consonant_cluster() {
    let glyphs = shaped("കെ");
    assert_eq!(glyphs.len(), 2);
    assert!(glyphs.iter().all(|glyph| glyph.byte == 0));
}

#[test]
fn shaping_clusters_alone_allow_a_break_inside_a_conjunct_and_the_guard_forbids_it() {
    // Observed with rustybuzz 0.20.1 and this font: the second cluster of സ്ത്രീ starts at byte 6,
    // directly after a virama and before a consonant.
    let word = "സ്ത്രീ";
    let glyphs = shaped(word);
    assert!(glyphs.iter().any(|glyph| glyph.byte == 6));
    assert!(is_unsafe_boundary(
        word[..6].chars().next_back(),
        word[6..].chars().next()
    ));
}

#[test]
fn latin_uses_the_first_font_and_malayalam_falls_back_to_the_second() {
    let latin = shaped("x2");
    assert!(latin.iter().all(|glyph| glyph.font == 0));
    let malayalam = shaped("ചായ");
    assert!(malayalam.iter().all(|glyph| glyph.font == 1));
}

#[test]
fn a_joiner_keeps_the_font_of_the_preceding_run() {
    let glyphs = shaped("ന\u{0D4D}\u{200D}");
    assert!(glyphs.iter().all(|glyph| glyph.font == 1));
}

#[test]
fn a_character_in_no_font_is_a_missing_glyph_with_its_byte_offset() {
    let text = "ചായ \u{E000} ok";
    let error = render(&fonts(), &request(text, 384), &LIMITS).unwrap_err();
    assert_eq!(
        error,
        RenderError::MissingGlyph {
            ch: '\u{E000}',
            byte: 10
        }
    );
    let second = "ok\n\u{E000}";
    let error = render(&fonts(), &request(second, 384), &LIMITS).unwrap_err();
    assert_eq!(
        error,
        RenderError::MissingGlyph {
            ch: '\u{E000}',
            byte: 3
        }
    );
}

// ---- line metrics ----

fn font_box(data: &[u8]) -> usize {
    let face = rustybuzz::Face::from_slice(data, 0).expect("face");
    let scale = f64::from(PX) / f64::from(face.units_per_em());
    let ascent = (f64::from(face.ascender()) * scale).ceil();
    let descent = (-f64::from(face.descender()) * scale).ceil();
    // Whole dots, small and non-negative.
    #[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
    let total = (ascent + descent) as usize;
    total
}

/// Ascent and descent in whole dots for the given fonts, taking the maximum of each separately.
fn combined_box(fonts: &[&[u8]]) -> usize {
    let (mut ascent, mut descent) = (0.0_f64, 0.0_f64);
    for data in fonts {
        let face = rustybuzz::Face::from_slice(data, 0).expect("face");
        let scale = f64::from(PX) / f64::from(face.units_per_em());
        ascent = ascent.max((f64::from(face.ascender()) * scale).ceil());
        descent = descent.max((-f64::from(face.descender()) * scale).ceil());
    }
    // Whole dots, small and non-negative.
    #[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
    let total = (ascent + descent) as usize;
    total
}

#[test]
fn line_box_uses_the_fonts_actually_used_and_never_less_than_their_metrics() {
    let latin = render_ok("Terima kasih", 384);
    let malayalam = render_ok("ചായ", 384);
    let mixed = render_ok("ചായ x2", 384);
    assert!(latin.line_height >= font_box(SANS));
    assert!(malayalam.line_height >= font_box(MALAYALAM));
    // A mixed line needs the larger ascent of one font and the larger descent of the other.
    assert!(mixed.line_height >= combined_box(&[SANS, MALAYALAM]));
    assert!(mixed.line_height > latin.line_height);
    // Text in one font does not inherit the other font's metrics (observed with these fixture
    // fonts: the Malayalam font's own box is the smaller one).
    assert!(malayalam.line_height < latin.line_height);
}

#[test]
fn line_box_grows_for_taller_ink_than_the_font_metrics_say() {
    // Stacked conjuncts and chillu letters reach beyond the Malayalam font's own ascent and descent.
    for text in ["ക്ഷ സ്ത്രീ", "ൺ ൻ"] {
        let bitmap = render_ok(text, 384);
        assert!(bitmap.line_height > font_box(MALAYALAM), "{text:?}");
    }
}

// ---- whitespace, empty input and paragraphs ----

#[test]
fn empty_and_whitespace_only_input_is_rejected() {
    for text in ["", " ", "     ", "\n", " \n ", "\u{00A0}", "\u{2003} "] {
        assert_eq!(
            render(&fonts(), &request(text, 100), &LIMITS).unwrap_err(),
            RenderError::EmptyInput,
            "{text:?}"
        );
    }
}

#[test]
fn control_characters_other_than_newline_are_rejected() {
    for (text, byte) in [("a\tb", 1), ("ab\r\n", 2), ("\u{7}", 0), ("x\u{85}", 1)] {
        assert_eq!(
            render(&fonts(), &request(text, 100), &LIMITS).unwrap_err(),
            RenderError::ControlCharacter { byte },
            "{text:?}"
        );
    }
}

fn line_count(text: &str, width: u16) -> usize {
    layout_text(&fonts(), &request(text, width), &LIMITS)
        .expect("lays out")
        .len()
}

#[test]
fn paragraphs_make_lines_and_a_blank_paragraph_makes_a_blank_line() {
    assert_eq!(line_count("a\nb", 384), 2);
    assert_eq!(line_count("a\n\nb", 384), 3);
    assert_eq!(line_count("a\n", 384), 2);
    let lines = layout_text(&fonts(), &request("a\n\nb", 384), &LIMITS).unwrap();
    assert!(lines[1].glyphs.is_empty());
}

#[test]
fn edge_spaces_are_dropped_and_inner_spaces_keep_their_width() {
    let plain = layout_text(&fonts(), &request("a b", 384), &LIMITS).unwrap();
    let padded = layout_text(&fonts(), &request("   a b   ", 384), &LIMITS).unwrap();
    assert!((plain[0].advance - padded[0].advance).abs() < f32::EPSILON);
    let wide = layout_text(&fonts(), &request("a   b", 384), &LIMITS).unwrap();
    assert!(wide[0].advance > plain[0].advance);
}

#[test]
fn a_wrap_point_drops_its_spaces_and_no_line_is_wider_than_the_width() {
    let lines = layout_text(&fonts(), &request(MALAY, 200), &LIMITS).unwrap();
    assert!(lines.len() > 1);
    for line in &lines {
        assert!(line.advance <= 200.0);
        assert!(line.glyphs.first().is_some_and(|glyph| glyph.gid != 0));
    }
    let first_gids: Vec<u16> = shaped("Jumlah:").iter().map(|glyph| glyph.gid).collect();
    let line_gids: Vec<u16> = lines[0]
        .glyphs
        .iter()
        .take(first_gids.len())
        .map(|glyph| glyph.gid)
        .collect();
    assert_eq!(line_gids, first_gids);
}

// ---- wrapping of over-wide words ----

#[test]
fn a_long_conjunct_word_never_breaks_inside_a_syllable_at_any_tested_width() {
    let word = long_conjunct_word();
    let whole: Vec<u16> = shaped(&word).iter().map(|glyph| glyph.gid).collect();
    let mut laid_out = 0;
    for width in [24_u16, 48, 96, 200, 384] {
        let lines = match layout_text(&fonts(), &request(&word, width), &LIMITS) {
            Ok(lines) => lines,
            Err(RenderError::IndivisibleUnitTooWide { .. }) => continue,
            Err(other) => panic!("width {width}: {other:?}"),
        };
        laid_out += 1;
        let flattened: Vec<u16> = lines
            .iter()
            .flat_map(|line| line.glyphs.iter().map(|glyph| glyph.gid))
            .collect();
        assert_eq!(
            flattened, whole,
            "no glyph lost or reordered at width {width}"
        );
        for line in lines.iter().skip(1) {
            let byte = line.glyphs[0].byte;
            assert!(
                !is_unsafe_boundary(
                    word[..byte].chars().next_back(),
                    word[byte..].chars().next()
                ),
                "unsafe line start at byte {byte}, width {width}"
            );
        }
    }
    assert!(
        laid_out >= 3,
        "most tested widths must lay out, not just error"
    );
}

#[test]
fn an_indivisible_unit_wider_than_the_width_is_an_error_not_a_clip() {
    let conjunct = "സ്ത്രീ";
    let natural: f32 = shaped(conjunct).iter().map(|glyph| glyph.advance).sum();
    // The whole syllable is one unit, so a narrower width must fail rather than split it.
    assert!(natural > 40.0);
    assert_eq!(
        render(&fonts(), &request(conjunct, 40), &LIMITS).unwrap_err(),
        RenderError::IndivisibleUnitTooWide { byte: 0 }
    );
    for text in ["W", "ക്ഷ", "abc"] {
        assert!(matches!(
            render(&fonts(), &request(text, 3), &LIMITS),
            Err(RenderError::IndivisibleUnitTooWide { .. })
        ));
    }
}

#[test]
fn ink_that_overhangs_the_width_is_an_error_and_a_left_overhang_is_padded() {
    // The glyph for f ends beyond its advance, so a width equal to the advance would clip ink.
    assert!(matches!(
        render(&fonts(), &request("f", 9), &LIMITS),
        Err(RenderError::InkOutsideWidth { .. })
    ));
    assert!(render(&fonts(), &request("f", 12), &LIMITS).is_ok());
    // j starts left of its origin; the line is padded instead of clipping, so a narrow line has the
    // same ink as a wide one.
    let narrow = render_ok("j", 8);
    let wide = render_ok("j", 40);
    assert!(ink_count(&narrow) > 0);
    assert_eq!(ink_count(&narrow), ink_count(&wide));
}

// ---- guard limits (pinned so a change is noticed) ----

#[test]
fn guard_protects_the_cases_it_was_written_for() {
    assert!(is_unsafe_boundary(Some('ക'), Some('\u{0D4D}')));
    assert!(is_unsafe_boundary(Some('\u{0D4D}'), Some('ത')));
    assert!(is_unsafe_boundary(Some('ക'), Some('\u{0D3E}')));
    assert!(is_unsafe_boundary(Some('x'), Some('\u{200D}')));
    assert!(is_unsafe_boundary(Some('e'), Some('\u{0301}')));
    assert!(!is_unsafe_boundary(Some('a'), Some('b')));
    assert!(!is_unsafe_boundary(Some('\u{0D4D}'), Some('a')));
    assert!(!is_unsafe_boundary(Some('\u{200D}'), Some('ക')));
    assert!(!is_unsafe_boundary(None, Some('ക')));
}

#[test]
fn guard_documented_limits_other_scripts_and_emoji_sequences_are_not_protected() {
    // Devanagari virama before a consonant would split a conjunct. The guard does not know it.
    assert!(!is_unsafe_boundary(Some('\u{094D}'), Some('\u{0924}')));
    // Tamil pulli, Bengali hasanta: same limit.
    assert!(!is_unsafe_boundary(Some('\u{0BCD}'), Some('\u{0B95}')));
    assert!(!is_unsafe_boundary(Some('\u{09CD}'), Some('\u{0995}')));
    // Emoji after a joiner, and a regional indicator pair.
    assert!(!is_unsafe_boundary(Some('\u{200D}'), Some('\u{1F469}')));
    assert!(!is_unsafe_boundary(Some('\u{1F1EE}'), Some('\u{1F1F3}')));
    // Hangul jamo.
    assert!(!is_unsafe_boundary(Some('\u{1100}'), Some('\u{1161}')));
}

// ---- font fallback must not split a sequence ----

#[test]
fn a_mark_the_base_font_cannot_draw_is_an_error_not_a_split_run() {
    // U+0301 exists only in the first font and the Malayalam base only in the second; U+0D3E exists
    // only in the second and Latin x only in the first. Shaping them in separate runs would draw the
    // mark detached from its base without any error.
    for (text, byte) in [("ക\u{0301}", 3), ("x\u{0D3E}", 1)] {
        assert_eq!(
            render(&fonts(), &request(text, 384), &LIMITS).unwrap_err(),
            RenderError::FontSequenceSplit { byte },
            "{text:?}"
        );
    }
}

#[test]
fn a_consonant_after_a_virama_must_use_the_font_of_the_virama() {
    let fonts = fonts();
    // The consonant is in the second font only; a virama drawn by the first font cannot continue.
    assert_eq!(
        choose_font(&fonts, Some(('\u{0D4D}', 0)), 'ത', 3),
        Err(RenderError::FontSequenceSplit { byte: 3 })
    );
    assert_eq!(choose_font(&fonts, Some(('\u{0D4D}', 1)), 'ത', 3), Ok(1));
    // Without a sequence the coverage rule applies.
    assert_eq!(choose_font(&fonts, Some(('a', 0)), 'ത', 1), Ok(1));
    assert_eq!(choose_font(&fonts, None, 'a', 0), Ok(0));
    assert_eq!(
        choose_font(&fonts, None, '\u{E000}', 0),
        Err(RenderError::MissingGlyph {
            ch: '\u{E000}',
            byte: 0
        })
    );
}

#[test]
fn every_word_of_the_conjunct_fixtures_is_shaped_in_one_font() {
    for word in CONJUNCTS.split(' ').chain(CHILLU.split(' ')) {
        let glyphs = shaped(word);
        assert!(
            glyphs.windows(2).all(|pair| pair[0].font == pair[1].font),
            "{word:?}"
        );
    }
}

#[test]
fn a_lone_vowel_sign_renders_with_a_dotted_circle_and_is_not_rejected() {
    // This is the shaper's behavior for an invalid sequence, pinned so a change is noticed. The
    // renderer does not validate Malayalam orthography.
    let glyphs = shaped("\u{0D3E}");
    assert_eq!(glyphs.len(), 2);
    assert!(render(&fonts(), &request("\u{0D3E}", 100), &LIMITS).is_ok());
}

#[test]
fn bidirectional_controls_are_rejected_because_there_is_no_reordering() {
    for (text, byte) in [("\u{200F}ab", 0), ("ab\u{202E}cd", 2), ("a\u{2067}b", 1)] {
        assert_eq!(
            render(&fonts(), &request(text, 384), &LIMITS).unwrap_err(),
            RenderError::UnsupportedDirection { byte },
            "{text:?}"
        );
    }
}

#[test]
fn only_left_to_right_runs_are_supported() {
    // No fixture font covers a right-to-left script, so the shaped-direction check is exercised
    // through its predicate rather than through a real Arabic or Hebrew render.
    assert!(is_supported_direction(rustybuzz::Direction::LeftToRight));
    assert!(!is_supported_direction(rustybuzz::Direction::RightToLeft));
    assert!(!is_supported_direction(rustybuzz::Direction::TopToBottom));
}

// ---- bounds ----

#[test]
fn width_and_pixel_size_are_range_checked() {
    let fonts = fonts();
    for width in [0_u16, LIMITS.max_width + 1] {
        assert_eq!(
            render(&fonts, &request("a", width), &LIMITS).unwrap_err(),
            RenderError::WidthOutOfRange
        );
    }
    for pixel_size in [0_u16, LIMITS.max_pixel_size + 1] {
        let bad = RenderRequest {
            text: "a",
            width: 100,
            pixel_size,
        };
        assert_eq!(
            render(&fonts, &bad, &LIMITS).unwrap_err(),
            RenderError::PixelSizeOutOfRange
        );
    }
}

#[test]
fn input_length_is_checked_exactly_at_the_limit() {
    let limits = RenderLimits {
        max_chars: 10,
        ..LIMITS
    };
    let fonts = fonts();
    assert!(render(&fonts, &request("aaaaaaaaaa", 384), &limits).is_ok());
    assert_eq!(
        render(&fonts, &request("aaaaaaaaaaa", 384), &limits).unwrap_err(),
        RenderError::InputTooLong { chars: 11 }
    );
}

#[test]
fn line_count_line_box_height_and_memory_limits_each_return_an_error() {
    let fonts = fonts();
    let text = "Terima kasih sila datang lagi ".repeat(4);
    let many_lines = RenderLimits {
        max_lines: 2,
        ..LIMITS
    };
    assert_eq!(
        render(&fonts, &request(&text, 100), &many_lines).unwrap_err(),
        RenderError::TooManyLines
    );
    let tiny_box = RenderLimits {
        max_line_box: 10,
        ..LIMITS
    };
    assert_eq!(
        render(&fonts, &request("a", 100), &tiny_box).unwrap_err(),
        RenderError::LineBoxTooTall
    );
    let short = RenderLimits {
        max_height: 40,
        ..LIMITS
    };
    assert_eq!(
        render(&fonts, &request(&text, 100), &short).unwrap_err(),
        RenderError::HeightExceeded
    );
    let small = RenderLimits {
        max_working_bytes: 100,
        ..LIMITS
    };
    assert_eq!(
        render(&fonts, &request("a", 100), &small).unwrap_err(),
        RenderError::MemoryLimitExceeded
    );
}

#[test]
fn the_working_memory_limit_is_exact() {
    let bitmap = render_ok("Terima kasih", 200);
    let retained_glyphs: usize = layout_text(&fonts(), &request("Terima kasih", 200), &LIMITS)
        .unwrap()
        .iter()
        .map(|line| line.glyphs.len())
        .sum();
    let working = bitmap.stride * bitmap.height
        + 200 * bitmap.line_height * 4
        + retained_glyphs * std::mem::size_of::<Glyph>();
    let fonts = fonts();
    let exact = RenderLimits {
        max_working_bytes: working,
        ..LIMITS
    };
    assert!(render(&fonts, &request("Terima kasih", 200), &exact).is_ok());
    let one_less = RenderLimits {
        max_working_bytes: working - 1,
        ..LIMITS
    };
    assert_eq!(
        render(&fonts, &request("Terima kasih", 200), &one_less).unwrap_err(),
        RenderError::MemoryLimitExceeded
    );
}

#[test]
fn the_shaped_glyph_limit_is_exact_and_counts_spaces() {
    let fonts = fonts();
    let limits = RenderLimits {
        max_glyphs: 5,
        ..LIMITS
    };
    assert!(render(&fonts, &request("abcde", 384), &limits).is_ok());
    assert_eq!(
        render(&fonts, &request("abcdef", 384), &limits).unwrap_err(),
        RenderError::TooManyGlyphs
    );
    // Four letters and two spaces shape six glyphs even though wrapping drops edge spaces.
    assert_eq!(
        render(&fonts, &request("ab cd ", 384), &limits).unwrap_err(),
        RenderError::TooManyGlyphs
    );
}

fn outline_commands(text: &str) -> usize {
    let fonts = fonts();
    layout_text(&fonts, &request(text, 384), &LIMITS)
        .unwrap()
        .iter()
        .flat_map(|line| line.glyphs.iter())
        .filter_map(|glyph| glyph_ink(&fonts, glyph, 0.0, PX).unwrap())
        .map(|(_, commands)| commands)
        .sum()
}

#[test]
fn the_outline_command_budget_is_exact_and_checked_before_drawing() {
    let fonts = fonts();
    let text = "ക്ഷ സ്ത്രീ Abc";
    let total = outline_commands(text);
    assert!(total > 20, "the fixture must have real outlines");
    let exact = RenderLimits {
        max_outline_commands: total,
        ..LIMITS
    };
    assert!(render(&fonts, &request(text, 384), &exact).is_ok());
    let one_less = RenderLimits {
        max_outline_commands: total - 1,
        ..LIMITS
    };
    assert_eq!(
        render(&fonts, &request(text, 384), &one_less).unwrap_err(),
        RenderError::WorkBudgetExceeded
    );
}

#[test]
fn size_arithmetic_is_checked_and_never_wraps() {
    let huge = RenderLimits {
        max_line_box: usize::MAX,
        max_height: usize::MAX,
        max_working_bytes: usize::MAX,
        ..LIMITS
    };
    let overflowing_box = LineBox {
        ascent: usize::MAX,
        descent: 1,
        gap: 0,
    };
    assert_eq!(
        check_sizes(100, overflowing_box, 1, 0, &huge),
        Err(RenderError::ArithmeticOverflow)
    );
    let box_of_two = LineBox {
        ascent: 1,
        descent: 1,
        gap: 0,
    };
    assert_eq!(
        check_sizes(100, box_of_two, usize::MAX, 0, &huge),
        Err(RenderError::ArithmeticOverflow)
    );
    // 2 * (2^63 + 1) wraps to 2 in plain arithmetic, which would look like a tiny, valid height.
    let wrapping_lines = usize::MAX / 2 + 2;
    assert_eq!(
        check_sizes(100, box_of_two, wrapping_lines, 0, &huge),
        Err(RenderError::ArithmeticOverflow)
    );
    // Retained glyph records are part of the checked sum.
    assert_eq!(
        check_sizes(100, box_of_two, 1, usize::MAX, &huge),
        Err(RenderError::ArithmeticOverflow)
    );
    let tall = LineBox {
        ascent: usize::MAX / 2,
        descent: 0,
        gap: 0,
    };
    assert_eq!(
        check_sizes(100, tall, 3, 0, &huge),
        Err(RenderError::ArithmeticOverflow)
    );
}

#[test]
fn a_font_set_needs_at_least_one_valid_font() {
    assert_eq!(FontSet::new(&[]).err(), Some(RenderError::NoFonts));
    assert_eq!(
        FontSet::new(&[SANS, b"not a font"]).err(),
        Some(RenderError::FontLoad { index: 1 })
    );
}

// ---- output shape and determinism ----

#[test]
fn bitmap_geometry_is_consistent_and_padding_bits_stay_clear() {
    let width = 205_u16;
    let bitmap = render_ok(MIXED, width);
    assert_eq!(bitmap.stride, 26);
    assert_eq!(bitmap.bits.len(), bitmap.stride * bitmap.height);
    assert_eq!(bitmap.height, bitmap.line_height * bitmap.lines);
    assert!(bitmap.bits.iter().any(|byte| *byte != 0));
    let pad_mask = 0xFF_u8 >> (width % 8);
    for row in bitmap.bits.chunks_exact(bitmap.stride) {
        assert_eq!(
            row[bitmap.stride - 1] & pad_mask,
            0,
            "ink in the padding of a row"
        );
    }
}

#[test]
fn rendering_is_repeatable_across_calls_and_font_set_instances() {
    for text in [CONJUNCTS, CHILLU, MIXED, MALAY, MALAYALAM_SENTENCE] {
        let first = render_ok(text, 384);
        let second = render_ok(text, 384);
        assert_eq!(first, second);
    }
}

/// Integer-only fingerprint of a layout: line count, then per line the glyph count, and per glyph the
/// glyph id, font index and cluster byte. No pixel and no float value goes into it.
fn layout_fingerprint(text: &str, width: u16) -> String {
    let lines = layout_text(&fonts(), &request(text, width), &LIMITS).expect("lays out");
    let mut bytes = Vec::new();
    bytes.extend_from_slice(&u32::try_from(lines.len()).unwrap().to_le_bytes());
    for line in &lines {
        bytes.extend_from_slice(&u32::try_from(line.glyphs.len()).unwrap().to_le_bytes());
        for glyph in &line.glyphs {
            bytes.extend_from_slice(&glyph.gid.to_le_bytes());
            bytes.push(u8::try_from(glyph.font).unwrap());
            bytes.extend_from_slice(&u32::try_from(glyph.byte).unwrap().to_le_bytes());
        }
    }
    sha256_hex(&bytes)
}

/// Portable correctness. These checks use only integers and structural properties, so they are
/// meant to hold on any platform that builds the crate: the shaped glyph sequence, the fallback
/// font choice and the line breaks. Line breaks come from comparing `f32` advance sums with the
/// width, which is stable here because no fixture sits within rounding of a break.
#[test]
fn portable_layout_fingerprints() {
    let cases: [(&str, &str, u16, &str); 5] = [
        (
            "conjuncts",
            CONJUNCTS,
            384,
            "ab02d0baf92cdaac6c75861b39217396d174bd8bdfcdc17fc1fc638a3c057e5d",
        ),
        (
            "chillu",
            CHILLU,
            384,
            "11df05e8e9d240dc5fa27068a9dcae58bf60dc92f4ddeb62a7c85de9ed93697b",
        ),
        (
            "mixed",
            MIXED,
            384,
            "b01af51e02ef7655a73dedbceca9111589d94b02d58011a065fec0aaa7d28722",
        ),
        (
            "malay",
            MALAY,
            384,
            "df6b78a9630a2bf17ab0b3a20e0cee7972cc5383842dbd829eb7334d7c8e6a9b",
        ),
        (
            "malayalam-sentence",
            MALAYALAM_SENTENCE,
            200,
            "2e5ad308715ef6cafc3c1d243326b060cc0fe55f9418919d14635ffb1a2aaa64",
        ),
    ];
    for (name, text, width, expected) in cases {
        assert_eq!(layout_fingerprint(text, width), expected, "{name}");
    }
}

/// Portable structural properties of the rendered bitmaps, with no pixel hash.
#[test]
fn portable_bitmap_structure() {
    for (text, width) in [
        (CONJUNCTS, 384_u16),
        (CHILLU, 384),
        (MIXED, 384),
        (MALAY, 384),
        (MALAYALAM_SENTENCE, 200),
    ] {
        let bitmap = render_ok(text, width);
        assert_eq!(bitmap.width, width);
        assert_eq!(bitmap.height, bitmap.line_height * bitmap.lines);
        for band in bitmap.bits.chunks_exact(bitmap.stride * bitmap.line_height) {
            assert!(band.iter().any(|byte| *byte != 0), "a line band has no ink");
        }
    }
}

/// Exact-platform determinism. These hashes pin every output pixel, which depends on `f32`
/// rasterization. They were recorded on `x86_64` Windows with the pinned crates and fonts, the
/// platform the repository's Rust CI job uses, and are only compiled there. They show that this
/// platform renders the same bytes every time; they do not show that the output is correct or that
/// another platform would match. A change here is a real rendering change and needs review; do not
/// update a hash to make a run pass. The portable tests above carry correctness on every platform.
#[cfg(all(target_os = "windows", target_arch = "x86_64"))]
#[test]
fn exact_platform_golden_bitmap_hashes() {
    let cases: [(&str, &str, u16, &str); 5] = [
        (
            "conjuncts",
            CONJUNCTS,
            384,
            "c07711e73e0fa616ebb09150094fdffe06eafdd10a557efeea597ff11d42c12c",
        ),
        (
            "chillu",
            CHILLU,
            384,
            "8bbb0b4cc7eb6a8f82073a15a9f386b25ccd0f61626a7010984805c05a5cc145",
        ),
        (
            "mixed",
            MIXED,
            384,
            "67f10df29fc799e380695f4908271ee489c5b1095cda6c4c4ce079ae3706a494",
        ),
        (
            "malay",
            MALAY,
            384,
            "ce51d15a1b3ee15b5e299f535a34e1e88dad923bf4c57284ff658559de767e86",
        ),
        (
            "malayalam-sentence",
            MALAYALAM_SENTENCE,
            384,
            "56909b74497da47b0d2b01cef8ff95c1e30423c883847a75eaea99bdfadd6e5d",
        ),
    ];
    for (name, text, width, expected) in cases {
        let bitmap = render_ok(text, width);
        assert_eq!(sha256_hex(&bitmap.bits), expected, "{name}");
    }
}

// ---- software previews (written only when MM009_PREVIEW_DIR is set) ----

#[test]
fn write_previews_when_requested() {
    let Some(dir) = std::env::var_os("MM009_PREVIEW_DIR") else {
        return;
    };
    let dir = std::path::PathBuf::from(dir);
    std::fs::create_dir_all(&dir).expect("preview dir");
    let cases: [(&str, String, u16); 8] = [
        ("conjuncts", CONJUNCTS.into(), 384),
        ("chillu", CHILLU.into(), 384),
        ("mixed", MIXED.into(), 384),
        ("malay-wrap", MALAY.into(), 384),
        ("malayalam-wrap", MALAYALAM_SENTENCE.into(), 384),
        ("malayalam-wrap-narrow", MALAYALAM_SENTENCE.into(), 200),
        ("long-word-wrap", long_conjunct_word(), 200),
        (
            "paragraphs",
            "ചായ x2\n\nTerima kasih\nഇത് ഒരു സാങ്കൽപ്പിക രസീതാണ്".into(),
            300,
        ),
    ];
    for (name, text, width) in cases {
        let bitmap = render_ok(&text, width);
        let mut pbm = format!("P4\n{} {}\n", bitmap.width, bitmap.height).into_bytes();
        pbm.extend_from_slice(&bitmap.bits);
        std::fs::write(dir.join(format!("{name}.pbm")), pbm).expect("write preview");
    }
}
