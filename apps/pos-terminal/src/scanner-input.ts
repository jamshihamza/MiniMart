/**
 * MM-008 keyboard-wedge scanner input capture.
 *
 * A keyboard-wedge scanner types a barcode as ordinary key events followed by a terminator.
 * The frozen hardware port contract has no scanner command: scanner events remain interaction
 * input (API 07, Architecture 25). This module therefore classifies raw key events only. It
 * performs no item lookup and attaches no business meaning, barcode validity or device identity
 * to a scan.
 *
 * Timing cannot prove that a scanner produced the keys. A macro, remote-control or on-screen
 * keyboard tool, or a very fast typist, can produce the same events. The result is therefore an
 * untrusted candidate, and the classifier errs toward leaving input alone:
 * - A scan is a burst of at least `minLength` printable keys, each within `maxInterKeyMs` of the
 *   previous one, ended by a configured terminator. Anything else stays ordinary typing.
 * - While a burst of two or more keys is in progress, function keys and Ctrl/Alt/Meta chords are
 *   suppressed and the burst is rejected, so scanner data cannot fire a shortcut or be partly
 *   delivered. A single fast key never suppresses anything.
 * - Key repeat, IME composition and modifier-only keys never start or complete a scan.
 * - A rejected burst resets the capture; the next valid scan works. When the rejected burst was at
 *   least `minLength` keys long, its terminator is consumed like a valid scan's, so it cannot
 *   submit a form, press a button or move focus.
 * - Repeated identical scans are separate input events. Idempotency is not this module's job.
 *
 * The default timings are provisional spike values. They have not been validated against a
 * physical scanner (see docs/phase-0/mm-008-scanner-spike.md).
 */

export interface ScanKeyInput {
  readonly key: string;
  /** Event time in milliseconds (`KeyboardEvent.timeStamp`). */
  readonly timeStamp: number;
  readonly ctrlKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
  readonly repeat: boolean;
  readonly isComposing: boolean;
}

export interface ScannerInputConfig {
  /** Largest allowed gap between two keys of one scan. */
  readonly maxInterKeyMs: number;
  /** Fewest characters (before prefix and suffix are removed) that make a scan. */
  readonly minLength: number;
  /** Most characters (after prefix and suffix are removed) that make a scan. */
  readonly maxLength: number;
  /** Key names that end a scan, for example `Enter` and `Tab`. */
  readonly terminators: readonly string[];
  /** Key names the scanner sends before the data (for example a function key). */
  readonly prefixKeys: readonly string[];
  /** Printable prefix text the scanner sends; a scan without it is rejected. */
  readonly prefix: string;
  /** Printable suffix text the scanner sends; a scan without it is rejected. */
  readonly suffix: string;
}

export const DEFAULT_SCANNER_CONFIG: ScannerInputConfig = {
  maxInterKeyMs: 50,
  minLength: 4,
  maxLength: 128,
  terminators: ["Enter", "Tab"],
  prefixKeys: [],
  prefix: "",
  suffix: "",
};

export interface ScanCandidate {
  /** Keyboard text as received. It is not a validated or trusted product identity. */
  readonly value: string;
  readonly length: number;
  readonly startedAt: number;
  readonly endedAt: number;
  readonly terminator: string;
  readonly trust: "UNTRUSTED_KEYBOARD_TEXT";
}

export type ScanRejectionReason =
  "TOO_LONG" | "CONTAMINATED" | "PREFIX_MISMATCH" | "SUFFIX_MISMATCH";

export interface ScanRejection {
  readonly reason: ScanRejectionReason;
  readonly length: number;
}

export interface ScanKeyResult {
  /** True while the key must not reach global shortcut handlers. */
  readonly suppressShortcuts: boolean;
  /** True when the caller must call `preventDefault()` on the event. */
  readonly preventDefault: boolean;
  readonly scan?: ScanCandidate;
  readonly rejection?: ScanRejection;
}

const PASS: ScanKeyResult = { suppressShortcuts: false, preventDefault: false };
const NEUTRAL_KEYS: ReadonlySet<string> = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "AltGraph",
  "CapsLock",
]);
/** A burst needs at least this many fast printable keys before it can suppress a shortcut. */
const BURST_KEYS = 2;

function isPrintable(input: ScanKeyInput): boolean {
  if (input.key.length !== 1) return false;
  // On Windows AltGr is reported as Ctrl+Alt while still producing a character.
  const altGr = input.ctrlKey && input.altKey && !input.metaKey;
  return altGr || (!input.ctrlKey && !input.altKey && !input.metaKey);
}

function hasChordModifier(input: ScanKeyInput): boolean {
  return input.ctrlKey || input.altKey || input.metaKey;
}

function isFunctionKey(key: string): boolean {
  return /^F(?:[1-9]|1\d|2[0-4])$/.test(key);
}

/**
 * A rejected scan consumes its terminator only when it was confidently a scan (a burst of at least
 * `minLength` keys). A shorter contaminated burst is still reported, but its terminator keeps its
 * normal meaning because it may have been ordinary typing.
 */
function rejected(reason: ScanRejectionReason, length: number, consume: boolean): ScanKeyResult {
  return { suppressShortcuts: consume, preventDefault: consume, rejection: { reason, length } };
}

export class ScanCapture {
  private readonly config: ScannerInputConfig;
  private buffer: string[] = [];
  private startedAt = 0;
  private lastAt: number | undefined;
  private prefixPending = false;
  private contaminated = false;

  constructor(config: ScannerInputConfig = DEFAULT_SCANNER_CONFIG) {
    this.config = config;
  }

  reset(): void {
    this.buffer = [];
    this.lastAt = undefined;
    this.prefixPending = false;
    this.contaminated = false;
  }

  /** Number of printable keys buffered for a burst that is still live at `timeStamp`. */
  bufferedLength(timeStamp: number): number {
    if (this.lastAt === undefined || timeStamp - this.lastAt > this.config.maxInterKeyMs) return 0;
    return this.buffer.length;
  }

  /** True while a burst that may be a scan is in progress at `timeStamp`. */
  isBurstActive(timeStamp: number): boolean {
    if (this.lastAt === undefined) return false;
    if (timeStamp - this.lastAt > this.config.maxInterKeyMs) return false;
    return this.buffer.length >= BURST_KEYS || this.prefixPending;
  }

  handleKey(input: ScanKeyInput): ScanKeyResult {
    if (input.isComposing || input.repeat) {
      this.reset();
      return PASS;
    }
    if (this.lastAt !== undefined && input.timeStamp - this.lastAt > this.config.maxInterKeyMs) {
      this.reset();
    }
    const active = this.isBurstActive(input.timeStamp);

    if (NEUTRAL_KEYS.has(input.key)) {
      if (this.buffer.length > 0 || this.prefixPending) this.lastAt = input.timeStamp;
      return PASS;
    }
    if (isPrintable(input)) return this.acceptCharacter(input);
    if (this.isTerminator(input)) return this.finish(input);
    return this.handleControlKey(input, active);
  }

  private isTerminator(input: ScanKeyInput): boolean {
    return (
      !hasChordModifier(input) && !input.shiftKey && this.config.terminators.includes(input.key)
    );
  }

  private acceptCharacter(input: ScanKeyInput): ScanKeyResult {
    if (this.buffer.length === 0) this.startedAt = input.timeStamp;
    this.buffer.push(input.key);
    this.lastAt = input.timeStamp;
    // Characters keep flowing to the focused field: it is not yet known that this is a scan.
    return PASS;
  }

  private handleControlKey(input: ScanKeyInput, active: boolean): ScanKeyResult {
    if (!hasChordModifier(input) && this.config.prefixKeys.includes(input.key)) {
      this.reset();
      this.prefixPending = true;
      this.startedAt = input.timeStamp;
      this.lastAt = input.timeStamp;
      return { suppressShortcuts: true, preventDefault: true };
    }
    if (input.key === "Escape") {
      // Escape is local transient-surface behavior; a scanner never sends it. Abort and pass.
      this.reset();
      return PASS;
    }
    if (!active) {
      this.reset();
      return PASS;
    }
    this.contaminated = true;
    this.lastAt = input.timeStamp;
    if (hasChordModifier(input) || isFunctionKey(input.key)) {
      return { suppressShortcuts: true, preventDefault: true };
    }
    // Another non-printable key (Backspace, arrows, Shift+Tab) inside a burst.
    return PASS;
  }

  private finish(input: ScanKeyInput): ScanKeyResult {
    const raw = this.buffer.join("");
    const burst = this.isBurstActive(input.timeStamp);
    const contaminated = this.contaminated;
    const startedAt = this.startedAt;
    this.reset();
    if (!burst) return PASS;
    const confident = raw.length >= this.config.minLength;
    if (contaminated) return rejected("CONTAMINATED", raw.length, confident);
    // Input shorter than a scan is ordinary typing, not a failed scan.
    if (!confident) return PASS;

    const { prefix, suffix, maxLength } = this.config;
    let value = raw;
    if (prefix !== "") {
      if (!value.startsWith(prefix)) return rejected("PREFIX_MISMATCH", raw.length, true);
      value = value.slice(prefix.length);
    }
    if (suffix !== "") {
      if (!value.endsWith(suffix)) return rejected("SUFFIX_MISMATCH", raw.length, true);
      value = value.slice(0, value.length - suffix.length);
    }
    if (value.length > maxLength) return rejected("TOO_LONG", value.length, true);
    if (value === "") return PASS;
    const scan: ScanCandidate = {
      value,
      length: value.length,
      startedAt,
      endedAt: input.timeStamp,
      terminator: input.key,
      trust: "UNTRUSTED_KEYBOARD_TEXT",
    };
    return { suppressShortcuts: true, preventDefault: true, scan };
  }
}
