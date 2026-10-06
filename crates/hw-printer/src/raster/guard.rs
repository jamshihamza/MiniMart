//! Heuristic guard for line breaks inside an over-wide word (MM-009 software spike).
//!
//! Shaping clusters alone are not safe break points: rustybuzz can report a cluster boundary
//! between a Malayalam virama and the consonant that follows it, which would split a conjunct
//! across two lines. This guard adds explicit, code-point level rules on top of the clusters.
//!
//! # Limits (read before relying on it)
//!
//! This is a heuristic, not a Unicode line-breaking or grapheme implementation. It was written for
//! and checked against fictional Malayalam and Latin fixtures only. It does **not** claim correct
//! behavior for:
//! - any other Indic script (Devanagari, Tamil, Bengali and so on): their viramas and vowel signs
//!   are not recognised, so a conjunct in those scripts can still be split;
//! - emoji ZWJ sequences, regional-indicator pairs, Hangul jamo, or Thai/Lao/Khmer clusters;
//! - the full Unicode combining-mark set: only the ranges listed in [`is_non_starter`];
//! - any case where the font substitutes glyphs differently from the code-point rules.
//!
//! The renderer breaks inside a word only when a single word is wider than the line. For every
//! other case it breaks at U+0020 only.

/// Malayalam virama (chandrakkala).
const MALAYALAM_VIRAMA: char = '\u{0D4D}';

/// True when a line must not start at the boundary between `prev` and `next`.
pub(super) fn is_unsafe_boundary(prev: Option<char>, next: Option<char>) -> bool {
    match (prev, next) {
        (_, Some(next)) if is_non_starter(next) => true,
        (Some(MALAYALAM_VIRAMA), Some(next)) => is_malayalam_consonant(next),
        _ => false,
    }
}

/// Characters that may not start a line: combining marks and joiners in the ranges below.
fn is_non_starter(c: char) -> bool {
    matches!(
        c,
        // Zero width non-joiner and joiner.
        '\u{200C}' | '\u{200D}'
        // Combining diacritical marks and their extended, supplement and symbol blocks.
        | '\u{0300}'..='\u{036F}'
        | '\u{1AB0}'..='\u{1AFF}'
        | '\u{1DC0}'..='\u{1DFF}'
        | '\u{20D0}'..='\u{20FF}'
        | '\u{FE20}'..='\u{FE2F}'
        // Variation selectors.
        | '\u{FE00}'..='\u{FE0F}'
        // Malayalam: signs (candrabindu, anusvara, visarga), vowel signs, virama, au length mark,
        // vocalic signs.
        | '\u{0D00}'..='\u{0D03}'
        | '\u{0D3B}'..='\u{0D3C}'
        | '\u{0D3E}'..='\u{0D4D}'
        | '\u{0D57}'
        | '\u{0D62}'..='\u{0D63}'
    )
}

/// Malayalam consonants that can continue a conjunct after a virama.
const fn is_malayalam_consonant(c: char) -> bool {
    matches!(c, '\u{0D15}'..='\u{0D3A}')
}
