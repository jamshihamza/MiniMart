//! MM-009 software-only bounded receipt raster renderer (feasibility spike).
//!
//! Pure text-to-bitmap: UTF-8 text, caller-supplied fonts, an explicit pixel width and explicit
//! limits go in; a packed 1-bit bitmap or an internal [`RenderError`] comes out. The module emits no
//! printer command bytes, opens no device or spooler, and has no Tauri or `WebView` access.
//!
//! Decisions this module deliberately does not make: the printer, the command protocol, the paper
//! profile, any production default, the pilot languages, and what `renderPayload` carries.
//! [`RenderError`] is renderer-local. It is not mapped to the hardware-command error categories
//! and is not an approved contract. Nothing in the crate calls this module yet, so it is compiled
//! for tests only.
//!
//! Behavior that callers can rely on, and that tests pin:
//! - Text is one or more paragraphs separated by `\n`. Any other control character is rejected.
//! - Empty text, and text made only of Unicode whitespace, is rejected as [`RenderError::EmptyInput`].
//!   A blank paragraph between non-blank ones becomes one blank line.
//! - Only U+0020 is a breakable space. Runs of U+0020 inside a line keep their width; spaces at a
//!   paragraph start, a paragraph end or a wrap point are dropped.
//! - A word that does not fit moves to a new line. A word wider than the line is split only at
//!   shaping-cluster boundaries that also pass the [`guard`] heuristic. If one indivisible unit is
//!   wider than the line the result is [`RenderError::IndivisibleUnitTooWide`]; ink is never
//!   silently clipped, vertically or horizontally.
//! - The line box is one height for the whole bitmap: the maximum over the fonts actually used of
//!   the font ascent, descent and gap, raised where a glyph's ink is taller.
//! - Font fallback never splits a character sequence the wrap guard treats as one unit: a combining
//!   mark, joiner, or consonant after a Malayalam virama must come from the same font as the
//!   character before it, or the render fails with [`RenderError::FontSequenceSplit`].
//! - Text that shapes right-to-left is rejected ([`RenderError::UnsupportedDirection`]); there is no
//!   bidirectional reordering.
//! - Every size is checked before it is allocated, and the bitmap is rendered one line at a time.
//!   Limits cover the input length, the number of shaped glyphs, the number of outline commands
//!   walked, the number of lines, the line box, the height, and a byte bound on the bitmap plus one
//!   line accumulator plus the retained glyph records. rustybuzz's own transient buffers are not
//!   measured in bytes; they grow with the longest word, which `max_chars` and `max_glyphs` bound.
//! - Output is deterministic for the same inputs on the same platform and compiler. Equality across
//!   CPUs or compilers is not verified.
//!
//! The default-free [`RenderLimits`] values used by tests are fixture values, not defaults.

#![cfg_attr(not(test), allow(dead_code))]

mod guard;

use ab_glyph_rasterizer::{Point, Rasterizer, point};
use rustybuzz::{
    Direction, Face, UnicodeBuffer, shape,
    ttf_parser::{GlyphId, OutlineBuilder},
};

/// Renderer-local failure. Not mapped to any hardware-contract error category.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum RenderError {
    NoFonts,
    FontLoad { index: usize },
    EmptyInput,
    ControlCharacter { byte: usize },
    WidthOutOfRange,
    PixelSizeOutOfRange,
    InputTooLong { chars: usize },
    MissingGlyph { ch: char, byte: usize },
    FontSequenceSplit { byte: usize },
    UnsupportedDirection { byte: usize },
    GlyphOutlineUnavailable { byte: usize },
    IndivisibleUnitTooWide { byte: usize },
    InkOutsideWidth { byte: usize },
    TooManyGlyphs,
    WorkBudgetExceeded,
    TooManyLines,
    LineBoxTooTall,
    HeightExceeded,
    MemoryLimitExceeded,
    ArithmeticOverflow,
    FontMetricOutOfRange,
}

/// Caller-supplied bounds. There is intentionally no `Default`.
// Every field is a maximum; the shared `max_` prefix is the clearest name for each.
#[allow(clippy::struct_field_names)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) struct RenderLimits {
    pub(crate) max_chars: usize,
    /// Most glyphs shaped for one request, counting spaces and glyphs dropped at wrap points.
    pub(crate) max_glyphs: usize,
    /// Most outline commands (move, line, curve, close) walked for one request.
    pub(crate) max_outline_commands: usize,
    pub(crate) max_lines: usize,
    pub(crate) max_width: u16,
    pub(crate) max_pixel_size: u16,
    pub(crate) max_line_box: usize,
    pub(crate) max_height: usize,
    /// Bound on the packed bitmap, one line's coverage accumulator and the retained glyph records.
    pub(crate) max_working_bytes: usize,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct RenderRequest<'t> {
    pub(crate) text: &'t str,
    /// Bitmap width in dots.
    pub(crate) width: u16,
    /// Em size in dots.
    pub(crate) pixel_size: u16,
}

/// Packed bitmap: one bit per dot, most significant bit first, rows padded to whole bytes.
/// A set bit is ink.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct MonoBitmap {
    pub(crate) width: u16,
    pub(crate) height: usize,
    pub(crate) stride: usize,
    pub(crate) line_height: usize,
    pub(crate) lines: usize,
    pub(crate) bits: Vec<u8>,
}

/// Fonts in fallback order: the first font that has a glyph for a character is used.
pub(crate) struct FontSet<'d> {
    faces: Vec<Face<'d>>,
}

impl<'d> FontSet<'d> {
    pub(crate) fn new(fonts: &[&'d [u8]]) -> Result<Self, RenderError> {
        if fonts.is_empty() {
            return Err(RenderError::NoFonts);
        }
        let mut faces = Vec::with_capacity(fonts.len());
        for (index, data) in fonts.iter().enumerate() {
            faces.push(Face::from_slice(data, 0).ok_or(RenderError::FontLoad { index })?);
        }
        Ok(Self { faces })
    }

    fn pick(&self, c: char) -> Option<usize> {
        self.faces
            .iter()
            .position(|face| face.glyph_index(c).is_some())
    }

    fn scale(&self, font: usize, pixel_size: u16) -> f32 {
        // Units per em is at most 16384 for a valid font, so the conversion cannot fail in practice.
        let units = i16::try_from(self.faces[font].units_per_em()).unwrap_or(i16::MAX);
        f32::from(pixel_size) / f32::from(units)
    }
}

#[derive(Debug, Clone)]
struct Glyph {
    font: usize,
    gid: u16,
    advance: f32,
    x_offset: f32,
    y_offset: f32,
    /// Byte offset of the glyph's cluster in the whole input text.
    byte: usize,
}

#[derive(Debug, Default)]
struct Line {
    glyphs: Vec<Glyph>,
    advance: f32,
}

impl Line {
    fn push_all(&mut self, glyphs: Vec<Glyph>) {
        self.advance += glyphs.iter().map(|glyph| glyph.advance).sum::<f32>();
        self.glyphs.extend(glyphs);
    }
}

fn sum_advance(glyphs: &[Glyph]) -> f32 {
    glyphs.iter().map(|glyph| glyph.advance).sum()
}

/// Converts a finite, non-negative, bounded float to `usize`, rounding up.
#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
fn ceil_to_usize(value: f32) -> Option<usize> {
    if value.is_finite() && (0.0..=1.0e7).contains(&value) {
        Some(value.ceil() as usize)
    } else {
        None
    }
}

fn font_units(value: i32) -> Result<f32, RenderError> {
    i16::try_from(value)
        .map(f32::from)
        .map_err(|_| RenderError::FontMetricOutOfRange)
}

fn validate(request: &RenderRequest<'_>, limits: &RenderLimits) -> Result<(), RenderError> {
    if request.width == 0 || request.width > limits.max_width {
        return Err(RenderError::WidthOutOfRange);
    }
    if request.pixel_size == 0 || request.pixel_size > limits.max_pixel_size {
        return Err(RenderError::PixelSizeOutOfRange);
    }
    let chars = request
        .text
        .chars()
        .take(limits.max_chars.saturating_add(1))
        .count();
    if chars > limits.max_chars {
        return Err(RenderError::InputTooLong { chars });
    }
    if request.text.chars().all(char::is_whitespace) {
        return Err(RenderError::EmptyInput);
    }
    for (byte, c) in request.text.char_indices() {
        if c.is_control() && c != '\n' {
            return Err(RenderError::ControlCharacter { byte });
        }
        if is_bidi_control(c) {
            return Err(RenderError::UnsupportedDirection { byte });
        }
    }
    Ok(())
}

/// Bidirectional formatting characters ask for reordering that this renderer does not do, so they
/// are rejected instead of being drawn as invisible glyphs that silently change nothing.
const fn is_bidi_control(c: char) -> bool {
    matches!(
        c,
        '\u{061C}' | '\u{200E}' | '\u{200F}' | '\u{202A}'..='\u{202E}' | '\u{2066}'..='\u{2069}'
    )
}

/// Only left-to-right runs are laid out; the renderer has no bidirectional reordering.
fn is_supported_direction(direction: Direction) -> bool {
    direction == Direction::LeftToRight
}

/// Chooses the font for `c`. A character that continues a sequence the wrap guard treats as one unit
/// (a combining mark, a joiner, or a consonant after a Malayalam virama) must use the previous
/// character's font; if that font cannot draw it, the sequence cannot be rendered consistently.
fn choose_font(
    fonts: &FontSet<'_>,
    previous: Option<(char, usize)>,
    c: char,
    byte: usize,
) -> Result<usize, RenderError> {
    let first = fonts
        .pick(c)
        .ok_or(RenderError::MissingGlyph { ch: c, byte })?;
    match previous {
        Some((previous_char, previous_font))
            if guard::is_unsafe_boundary(Some(previous_char), Some(c)) =>
        {
            if fonts.faces[previous_font].glyph_index(c).is_some() {
                Ok(previous_font)
            } else {
                Err(RenderError::FontSequenceSplit { byte })
            }
        }
        _ => Ok(first),
    }
}

/// Shapes `text[range]`, choosing a font per run of characters.
fn shape_token(
    fonts: &FontSet<'_>,
    text: &str,
    start: usize,
    end: usize,
    pixel_size: u16,
) -> Result<Vec<Glyph>, RenderError> {
    let mut runs: Vec<(usize, usize, usize)> = Vec::new();
    let mut previous: Option<(char, usize)> = None;
    for (offset, c) in text[start..end].char_indices() {
        let byte = start + offset;
        let font = choose_font(fonts, previous, c, byte)?;
        match runs.last_mut() {
            Some(run) if run.0 == font => run.2 = byte + c.len_utf8(),
            _ => runs.push((font, byte, byte + c.len_utf8())),
        }
        previous = Some((c, font));
    }
    let mut glyphs = Vec::new();
    for (font, run_start, run_end) in runs {
        let scale = fonts.scale(font, pixel_size);
        let mut buffer = UnicodeBuffer::new();
        buffer.push_str(&text[run_start..run_end]);
        buffer.guess_segment_properties();
        if !is_supported_direction(buffer.direction()) {
            return Err(RenderError::UnsupportedDirection { byte: run_start });
        }
        let shaped = shape(&fonts.faces[font], &[], buffer);
        for (info, position) in shaped.glyph_infos().iter().zip(shaped.glyph_positions()) {
            let byte = run_start + info.cluster as usize;
            let gid =
                u16::try_from(info.glyph_id).map_err(|_| RenderError::FontMetricOutOfRange)?;
            if gid == 0 {
                let ch = text[byte..].chars().next().unwrap_or('\u{FFFD}');
                return Err(RenderError::MissingGlyph { ch, byte });
            }
            glyphs.push(Glyph {
                font,
                gid,
                advance: font_units(position.x_advance)? * scale,
                x_offset: font_units(position.x_offset)? * scale,
                y_offset: font_units(position.y_offset)? * scale,
                byte,
            });
        }
    }
    Ok(glyphs)
}

/// Splits `glyphs` into units that may start a line: a unit is one shaping cluster, joined with the
/// next cluster wherever the heuristic guard forbids a line start.
fn split_units(text: &str, glyphs: Vec<Glyph>) -> Vec<Vec<Glyph>> {
    let mut units: Vec<Vec<Glyph>> = Vec::new();
    for glyph in glyphs {
        let joins_previous = units
            .last()
            .and_then(|unit| unit.last())
            .is_some_and(|last| {
                last.byte == glyph.byte
                    || guard::is_unsafe_boundary(
                        text[..glyph.byte].chars().next_back(),
                        text[glyph.byte..].chars().next(),
                    )
            });
        match units.last_mut() {
            Some(unit) if joins_previous => unit.push(glyph),
            _ => units.push(vec![glyph]),
        }
    }
    units
}

struct Layout<'a> {
    text: &'a str,
    width: f32,
    max_lines: usize,
    max_glyphs: usize,
    shaped_glyphs: usize,
    lines: Vec<Line>,
}

impl Layout<'_> {
    fn new_line(&mut self) -> Result<(), RenderError> {
        if self.lines.len() >= self.max_lines {
            return Err(RenderError::TooManyLines);
        }
        self.lines.push(Line::default());
        Ok(())
    }

    fn current(&mut self) -> &mut Line {
        self.lines
            .last_mut()
            .expect("a paragraph always starts with a line")
    }

    /// Places an over-wide word unit by unit.
    fn place_split_word(&mut self, glyphs: Vec<Glyph>) -> Result<(), RenderError> {
        for unit in split_units(self.text, glyphs) {
            let unit_width = sum_advance(&unit);
            if unit_width > self.width {
                return Err(RenderError::IndivisibleUnitTooWide { byte: unit[0].byte });
            }
            if self.current().advance + unit_width > self.width && !self.current().glyphs.is_empty()
            {
                self.new_line()?;
            }
            self.current().push_all(unit);
        }
        Ok(())
    }

    fn place_word(
        &mut self,
        pending_space: Option<Vec<Glyph>>,
        word: Vec<Glyph>,
    ) -> Result<(), RenderError> {
        let word_width = sum_advance(&word);
        let space_width = pending_space.as_deref().map_or(0.0, sum_advance);
        let line_empty = self.current().glyphs.is_empty();
        if !line_empty && self.current().advance + space_width + word_width <= self.width {
            if let Some(space) = pending_space {
                self.current().push_all(space);
            }
            self.current().push_all(word);
            return Ok(());
        }
        if !line_empty {
            self.new_line()?;
        }
        if word_width <= self.width {
            self.current().push_all(word);
            Ok(())
        } else {
            self.place_split_word(word)
        }
    }

    fn place_paragraph(
        &mut self,
        fonts: &FontSet<'_>,
        base: usize,
        paragraph: &str,
        pixel_size: u16,
    ) -> Result<(), RenderError> {
        self.new_line()?;
        let mut pending_space: Option<Vec<Glyph>> = None;
        let mut offset = 0;
        while offset < paragraph.len() {
            let is_space = paragraph[offset..].starts_with(' ');
            let run_len = paragraph[offset..]
                .find(|c: char| (c == ' ') != is_space)
                .unwrap_or(paragraph.len() - offset);
            let (start, end) = (base + offset, base + offset + run_len);
            let glyphs = shape_token(fonts, self.text, start, end, pixel_size)?;
            self.shaped_glyphs = self
                .shaped_glyphs
                .checked_add(glyphs.len())
                .ok_or(RenderError::ArithmeticOverflow)?;
            if self.shaped_glyphs > self.max_glyphs {
                return Err(RenderError::TooManyGlyphs);
            }
            if is_space {
                if !self.current().glyphs.is_empty() {
                    pending_space = Some(glyphs);
                }
            } else {
                self.place_word(pending_space.take(), glyphs)?;
            }
            offset += run_len;
        }
        Ok(())
    }
}

fn layout_text(
    fonts: &FontSet<'_>,
    request: &RenderRequest<'_>,
    limits: &RenderLimits,
) -> Result<Vec<Line>, RenderError> {
    let mut layout = Layout {
        text: request.text,
        width: f32::from(request.width),
        max_lines: limits.max_lines,
        max_glyphs: limits.max_glyphs,
        shaped_glyphs: 0,
        lines: Vec::new(),
    };
    let mut base = 0;
    for paragraph in request.text.split('\n') {
        layout.place_paragraph(fonts, base, paragraph, request.pixel_size)?;
        base += paragraph.len() + 1;
    }
    Ok(layout.lines)
}

/// Vertical and horizontal ink extents of one placed glyph, in dots relative to the line origin.
struct Ink {
    left: f32,
    right: f32,
    above: f32,
    below: f32,
}

/// Counts outline commands without drawing anything.
#[derive(Default)]
struct CommandCounter {
    commands: usize,
}

impl CommandCounter {
    fn count(&mut self) {
        self.commands = self.commands.saturating_add(1);
    }
}

impl OutlineBuilder for CommandCounter {
    fn move_to(&mut self, _x: f32, _y: f32) {
        self.count();
    }

    fn line_to(&mut self, _x: f32, _y: f32) {
        self.count();
    }

    fn quad_to(&mut self, _x1: f32, _y1: f32, _x: f32, _y: f32) {
        self.count();
    }

    fn curve_to(&mut self, _x1: f32, _y1: f32, _x2: f32, _y2: f32, _x: f32, _y: f32) {
        self.count();
    }

    fn close(&mut self) {
        self.count();
    }
}

/// Ink extents of one placed glyph and the number of outline commands it has. The bounds come from
/// walking the outline, not from the glyph header, which a font can get wrong. A glyph with no
/// outline (a space) has no ink. A glyph whose header claims ink but whose outline cannot be read is
/// an error, so it cannot disappear silently.
fn glyph_ink(
    fonts: &FontSet<'_>,
    glyph: &Glyph,
    pen_x: f32,
    pixel_size: u16,
) -> Result<Option<(Ink, usize)>, RenderError> {
    let face = &fonts.faces[glyph.font];
    let mut counter = CommandCounter::default();
    let bounds = match face.outline_glyph(GlyphId(glyph.gid), &mut counter) {
        Some(bounds) => bounds,
        None if face.glyph_bounding_box(GlyphId(glyph.gid)).is_some() => {
            return Err(RenderError::GlyphOutlineUnavailable { byte: glyph.byte });
        }
        None => return Ok(None),
    };
    let scale = fonts.scale(glyph.font, pixel_size);
    let x = pen_x + glyph.x_offset;
    let ink = Ink {
        left: x + f32::from(bounds.x_min) * scale,
        right: x + f32::from(bounds.x_max) * scale,
        above: f32::from(bounds.y_max) * scale + glyph.y_offset,
        below: -(f32::from(bounds.y_min) * scale + glyph.y_offset),
    };
    Ok(Some((ink, counter.commands)))
}

#[derive(Debug, Clone, Copy, Default)]
struct LineBox {
    ascent: usize,
    descent: usize,
    gap: usize,
}

impl LineBox {
    const fn height(self) -> Option<usize> {
        match self.ascent.checked_add(self.descent) {
            Some(sum) => sum.checked_add(self.gap),
            None => None,
        }
    }
}

/// Line box over the fonts actually used, raised for taller ink. Also returns each line's left pad
/// and enforces the outline-command budget before any drawing starts.
fn measure(
    fonts: &FontSet<'_>,
    lines: &[Line],
    request: &RenderRequest<'_>,
    limits: &RenderLimits,
) -> Result<(LineBox, Vec<f32>), RenderError> {
    let mut used = vec![false; fonts.faces.len()];
    let (mut ascent, mut descent, mut gap) = (0.0_f32, 0.0_f32, 0.0_f32);
    let mut pads = Vec::with_capacity(lines.len());
    let mut commands = 0_usize;
    for line in lines {
        let (mut pen_x, mut min_left, mut max_right) = (0.0_f32, 0.0_f32, 0.0_f32);
        let mut right_byte = 0;
        for glyph in &line.glyphs {
            used[glyph.font] = true;
            if let Some((ink, glyph_commands)) = glyph_ink(fonts, glyph, pen_x, request.pixel_size)?
            {
                commands = commands.saturating_add(glyph_commands);
                if commands > limits.max_outline_commands {
                    return Err(RenderError::WorkBudgetExceeded);
                }
                min_left = min_left.min(ink.left);
                if ink.right > max_right {
                    max_right = ink.right;
                    right_byte = glyph.byte;
                }
                ascent = ascent.max(ink.above);
                descent = descent.max(ink.below);
            }
            pen_x += glyph.advance;
        }
        let pad = (-min_left).max(0.0).ceil();
        if max_right + pad > f32::from(request.width) {
            return Err(RenderError::InkOutsideWidth { byte: right_byte });
        }
        pads.push(pad);
    }
    for (font, in_use) in used.iter().enumerate() {
        if *in_use {
            let face = &fonts.faces[font];
            let scale = fonts.scale(font, request.pixel_size);
            ascent = ascent.max(f32::from(face.ascender()) * scale);
            descent = descent.max(-f32::from(face.descender()) * scale);
            gap = gap.max(f32::from(face.line_gap()) * scale);
        }
    }
    let to_usize = |value: f32| ceil_to_usize(value).ok_or(RenderError::FontMetricOutOfRange);
    let line_box = LineBox {
        ascent: to_usize(ascent)?,
        descent: to_usize(descent)?,
        gap: to_usize(gap)?,
    };
    Ok((line_box, pads))
}

/// Checks every size before anything large is allocated: the bitmap, one line accumulator and the
/// retained glyph records (`glyphs` of them). Returns (stride, height, `line_box_height`).
fn check_sizes(
    width: u16,
    line_box: LineBox,
    lines: usize,
    glyphs: usize,
    limits: &RenderLimits,
) -> Result<(usize, usize, usize), RenderError> {
    let line_height = line_box.height().ok_or(RenderError::ArithmeticOverflow)?;
    if line_height == 0 || line_height > limits.max_line_box {
        return Err(RenderError::LineBoxTooTall);
    }
    let height = line_height
        .checked_mul(lines)
        .ok_or(RenderError::ArithmeticOverflow)?;
    if height > limits.max_height {
        return Err(RenderError::HeightExceeded);
    }
    let stride = usize::from(width).div_ceil(8);
    let bitmap = stride
        .checked_mul(height)
        .ok_or(RenderError::ArithmeticOverflow)?;
    let accumulator = usize::from(width)
        .checked_mul(line_height)
        .and_then(|cells| cells.checked_mul(core::mem::size_of::<f32>()))
        .ok_or(RenderError::ArithmeticOverflow)?;
    let glyph_records = glyphs
        .checked_mul(core::mem::size_of::<Glyph>())
        .ok_or(RenderError::ArithmeticOverflow)?;
    let working = bitmap
        .checked_add(accumulator)
        .and_then(|bytes| bytes.checked_add(glyph_records))
        .ok_or(RenderError::ArithmeticOverflow)?;
    if working > limits.max_working_bytes {
        return Err(RenderError::MemoryLimitExceeded);
    }
    Ok((stride, height, line_height))
}

struct Pen<'a> {
    rasterizer: &'a mut Rasterizer,
    origin_x: f32,
    baseline: f32,
    scale: f32,
    current: Point,
    start: Point,
}

impl Pen<'_> {
    fn map(&self, x: f32, y: f32) -> Point {
        point(
            self.origin_x + x * self.scale,
            self.baseline - y * self.scale,
        )
    }
}

impl OutlineBuilder for Pen<'_> {
    fn move_to(&mut self, x: f32, y: f32) {
        self.current = self.map(x, y);
        self.start = self.current;
    }

    fn line_to(&mut self, x: f32, y: f32) {
        let end = self.map(x, y);
        self.rasterizer.draw_line(self.current, end);
        self.current = end;
    }

    fn quad_to(&mut self, x1: f32, y1: f32, x: f32, y: f32) {
        let (control, end) = (self.map(x1, y1), self.map(x, y));
        self.rasterizer.draw_quad(self.current, control, end);
        self.current = end;
    }

    fn curve_to(&mut self, x1: f32, y1: f32, x2: f32, y2: f32, x: f32, y: f32) {
        let (first, second, end) = (self.map(x1, y1), self.map(x2, y2), self.map(x, y));
        self.rasterizer.draw_cubic(self.current, first, second, end);
        self.current = end;
    }

    fn close(&mut self) {
        self.rasterizer.draw_line(self.current, self.start);
        self.current = self.start;
    }
}

fn rasterize_line(
    fonts: &FontSet<'_>,
    line: &Line,
    pad: f32,
    baseline: usize,
    rasterizer: &mut Rasterizer,
    pixel_size: u16,
) {
    let mut pen_x = pad;
    #[allow(clippy::cast_precision_loss)]
    let baseline = baseline as f32;
    for glyph in &line.glyphs {
        let mut pen = Pen {
            rasterizer,
            origin_x: pen_x + glyph.x_offset,
            baseline: baseline - glyph.y_offset,
            scale: fonts.scale(glyph.font, pixel_size),
            current: point(0.0, 0.0),
            start: point(0.0, 0.0),
        };
        // A glyph without an outline (a space) draws nothing.
        let _ = fonts.faces[glyph.font].outline_glyph(GlyphId(glyph.gid), &mut pen);
        pen_x += glyph.advance;
    }
}

/// Renders `request` to a packed 1-bit bitmap, one line at a time.
///
/// # Errors
/// Returns a renderer-local [`RenderError`] for invalid input, a missing glyph, an indivisible unit
/// or ink that does not fit the width, or any exceeded limit.
pub(crate) fn render(
    fonts: &FontSet<'_>,
    request: &RenderRequest<'_>,
    limits: &RenderLimits,
) -> Result<MonoBitmap, RenderError> {
    validate(request, limits)?;
    let lines = layout_text(fonts, request, limits)?;
    let (line_box, pads) = measure(fonts, &lines, request, limits)?;
    let glyphs: usize = lines.iter().map(|line| line.glyphs.len()).sum();
    let (stride, height, line_height) =
        check_sizes(request.width, line_box, lines.len(), glyphs, limits)?;
    let width = usize::from(request.width);
    let mut bits = vec![0_u8; stride * height];
    for (index, (line, pad)) in lines.iter().zip(&pads).enumerate() {
        let mut rasterizer = Rasterizer::new(width, line_height);
        rasterize_line(
            fonts,
            line,
            *pad,
            line_box.ascent,
            &mut rasterizer,
            request.pixel_size,
        );
        let top = index * line_height;
        rasterizer.for_each_pixel_2d(|x, y, coverage| {
            if coverage >= 0.5 {
                let row = top + y as usize;
                bits[row * stride + x as usize / 8] |= 0x80 >> (x % 8);
            }
        });
    }
    Ok(MonoBitmap {
        width: request.width,
        height,
        stride,
        line_height,
        lines: lines.len(),
        bits,
    })
}

#[cfg(test)]
mod tests;
