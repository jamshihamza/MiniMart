import { describe, expect, it } from "vitest";

import {
  DEFAULT_SCANNER_CONFIG,
  ScanCapture,
  type ScanCandidate,
  type ScanKeyInput,
  type ScanKeyResult,
  type ScannerInputConfig,
} from "../src/scanner-input.js";
import { BARCODE_FIXTURES, gs1CheckDigit, key, scanKeys, typedKeys } from "./scanner-fixtures.js";

interface Run {
  readonly scans: ScanCandidate[];
  readonly results: ScanKeyResult[];
}

function feed(capture: ScanCapture, events: readonly ScanKeyInput[]): Run {
  const scans: ScanCandidate[] = [];
  const results: ScanKeyResult[] = [];
  for (const event of events) {
    const result = capture.handleKey(event);
    results.push(result);
    if (result.scan !== undefined) scans.push(result.scan);
  }
  return { scans, results };
}

function configured(overrides: Partial<ScannerInputConfig>): ScanCapture {
  return new ScanCapture({ ...DEFAULT_SCANNER_CONFIG, ...overrides });
}

describe("scanner fixtures", () => {
  it("uses well-formed GS1 sample codes", () => {
    for (const value of ["5901234123457", "036000291452", "96385074", "10012345678902"]) {
      expect(gs1CheckDigit(value.slice(0, -1))).toBe(Number(value.slice(-1)));
    }
  });
});

describe("ScanCapture single scans", () => {
  it.each(BARCODE_FIXTURES)("captures a $symbology scan at wedge cadence", ({ value }) => {
    const capture = new ScanCapture();
    const { scans, results } = feed(capture, scanKeys(value, { startAt: 1000, gapMs: 8 }));
    expect(scans).toHaveLength(1);
    expect(scans[0]).toMatchObject({
      value,
      length: value.length,
      terminator: "Enter",
      trust: "UNTRUSTED_KEYBOARD_TEXT",
    });
    // Characters flow on to the focused field; only the terminator is consumed.
    const characterResults = results.slice(0, -1);
    expect(characterResults.every((r) => !r.preventDefault && !r.suppressShortcuts)).toBe(true);
    expect(results.at(-1)).toMatchObject({ preventDefault: true, suppressShortcuts: true });
  });

  it("accepts Tab as a terminator and uppercase sent with Shift", () => {
    const capture = new ScanCapture();
    const { scans } = feed(
      capture,
      scanKeys("MM-INV-2026-0042", {
        startAt: 0,
        gapMs: 6,
        terminator: "Tab",
        shiftUppercase: true,
      }),
    );
    expect(scans.map((s) => [s.value, s.terminator])).toEqual([["MM-INV-2026-0042", "Tab"]]);
  });

  it("treats an AltGr-produced character as printable", () => {
    const capture = new ScanCapture();
    const events = [
      key("A", 0),
      key("B", 5),
      key("@", 10, { ctrlKey: true, altKey: true }),
      key("D", 15),
      key("Enter", 20),
    ];
    expect(feed(capture, events).scans.map((s) => s.value)).toEqual(["AB@D"]);
  });
});

describe("ScanCapture repeated scans (FR-HW-009)", () => {
  it("returns one event per scan for 50 identical rapid scans", () => {
    const capture = new ScanCapture();
    const events: ScanKeyInput[] = [];
    let at = 0;
    for (let i = 0; i < 50; i += 1) {
      events.push(...scanKeys("5901234123457", { startAt: at, gapMs: 5 }));
      at += 14 * 5 + 20; // 13 characters + terminator, then a 20 ms pause
    }
    const { scans } = feed(capture, events);
    expect(scans).toHaveLength(50);
    expect(new Set(scans.map((s) => s.value))).toEqual(new Set(["5901234123457"]));
  });

  it("separates back-to-back scans even with a 1 ms gap after the terminator", () => {
    const capture = new ScanCapture();
    const first = scanKeys("036000291452", { startAt: 0, gapMs: 4 });
    const lastAt = first.at(-1)?.timeStamp ?? 0;
    const second = scanKeys("96385074", { startAt: lastAt + 1, gapMs: 4 });
    expect(feed(capture, [...first, ...second]).scans.map((s) => s.value)).toEqual([
      "036000291452",
      "96385074",
    ]);
  });

  it("counts a mixed burst correctly", () => {
    const capture = new ScanCapture();
    const sequence = ["5901234123457", "96385074", "5901234123457", "MM00124", "5901234123457"];
    const events: ScanKeyInput[] = [];
    let at = 0;
    for (const value of sequence) {
      events.push(...scanKeys(value, { startAt: at, gapMs: 3 }));
      at += (value.length + 1) * 3 + 8;
    }
    const tally = new Map<string, number>();
    for (const scan of feed(capture, events).scans) {
      tally.set(scan.value, (tally.get(scan.value) ?? 0) + 1);
    }
    expect(Object.fromEntries(tally)).toEqual({
      "5901234123457": 3,
      "96385074": 1,
      MM00124: 1,
    });
  });
});

describe("ScanCapture cadence boundary", () => {
  it("accepts a gap equal to the limit and rejects one beyond it as typing", () => {
    const atLimit = feed(new ScanCapture(), scanKeys("12345678", { startAt: 0, gapMs: 50 }));
    expect(atLimit.scans).toHaveLength(1);
    const beyond = feed(new ScanCapture(), scanKeys("12345678", { startAt: 0, gapMs: 51 }));
    expect(beyond.scans).toHaveLength(0);
    expect(beyond.results.every((r) => r.rejection === undefined && !r.suppressShortcuts)).toBe(
      true,
    );
  });

  it("leaves human typing and a later shortcut alone", () => {
    const capture = new ScanCapture();
    const typing = typedKeys("12345678", 0);
    const afterTyping = (typing.at(-1)?.timeStamp ?? 0) + 400;
    const run = feed(capture, [...typing, key("Enter", afterTyping), key("F2", afterTyping + 400)]);
    expect(run.scans).toHaveLength(0);
    expect(run.results.at(-1)).toMatchObject({ suppressShortcuts: false, preventDefault: false });
    expect(capture.isBurstActive(afterTyping + 400)).toBe(false);
  });

  it("does not count one fast character followed by a terminator as a scan attempt", () => {
    const run = feed(new ScanCapture(), [key("5", 0), key("Enter", 10)]);
    expect(run.scans).toHaveLength(0);
    expect(run.results.every((r) => r.rejection === undefined)).toBe(true);
  });

  it("ignores a terminator that arrives after the burst expired", () => {
    const events = [
      ...scanKeys("12345678", { startAt: 0, gapMs: 5 }).slice(0, -1),
      key("Enter", 900),
    ];
    expect(feed(new ScanCapture(), events).scans).toHaveLength(0);
  });

  it("resets on key repeat and on IME composition", () => {
    const capture = new ScanCapture();
    capture.handleKey(key("1", 0));
    capture.handleKey({ ...key("2", 5), repeat: true });
    expect(capture.isBurstActive(6)).toBe(false);
    capture.handleKey(key("1", 10));
    capture.handleKey({ ...key("2", 15), isComposing: true });
    expect(capture.isBurstActive(16)).toBe(false);
  });
});

describe("ScanCapture global shortcuts (acceptance: no global shortcut triggered)", () => {
  it("suppresses a function key inside a burst and rejects the scan", () => {
    const capture = new ScanCapture();
    const events = [
      ...scanKeys("12345678", { startAt: 0, gapMs: 4 }).slice(0, 4),
      key("F2", 20),
      ...scanKeys("5678", { startAt: 24, gapMs: 4 }),
    ];
    const run = feed(capture, events);
    const f2 = run.results[4];
    expect(f2).toMatchObject({ suppressShortcuts: true, preventDefault: true });
    expect(run.scans).toHaveLength(0);
    expect(run.results.at(-1)?.rejection).toEqual({ reason: "CONTAMINATED", length: 8 });
  });

  it("suppresses Ctrl, Alt and Meta chords inside a burst", () => {
    for (const modifier of ["ctrlKey", "altKey", "metaKey"] as const) {
      const capture = new ScanCapture();
      capture.handleKey(key("1", 0));
      capture.handleKey(key("2", 4));
      const result = capture.handleKey(key("k", 8, { [modifier]: true }));
      expect(result).toMatchObject({ suppressShortcuts: true, preventDefault: true });
    }
  });

  it("recovers: the next valid scan works after a contaminated one", () => {
    const capture = new ScanCapture();
    feed(capture, [key("1", 0), key("2", 4), key("F8", 8), key("Enter", 12)]);
    const run = feed(capture, scanKeys("96385074", { startAt: 100, gapMs: 4 }));
    expect(run.scans.map((s) => s.value)).toEqual(["96385074"]);
  });

  it("lets a human press F2 slowly after a scan", () => {
    const capture = new ScanCapture();
    const scan = scanKeys("96385074", { startAt: 0, gapMs: 4 });
    const lastAt = scan.at(-1)?.timeStamp ?? 0;
    const run = feed(capture, [...scan, key("F2", lastAt + 300)]);
    expect(run.results.at(-1)).toMatchObject({ suppressShortcuts: false, preventDefault: false });
  });

  it("does not suppress Escape: it aborts the burst and passes through", () => {
    const capture = new ScanCapture();
    capture.handleKey(key("1", 0));
    capture.handleKey(key("2", 4));
    const result = capture.handleKey(key("Escape", 8));
    expect(result).toMatchObject({ suppressShortcuts: false, preventDefault: false });
    expect(capture.isBurstActive(9)).toBe(false);
  });

  it("treats a configured prefix key as part of the scan and never as a shortcut", () => {
    const capture = configured({ prefixKeys: ["F2"] });
    const prefix = capture.handleKey(key("F2", 0));
    expect(prefix).toMatchObject({ suppressShortcuts: true, preventDefault: true });
    const run = feed(capture, scanKeys("96385074", { startAt: 5, gapMs: 4 }));
    expect(run.scans.map((s) => s.value)).toEqual(["96385074"]);
    // Without that configuration the same key is an ordinary shortcut.
    expect(new ScanCapture().handleKey(key("F2", 0))).toMatchObject({ suppressShortcuts: false });
  });
});

describe("ScanCapture deterministic parsing (FR-HW-008, FR-HW-010)", () => {
  it("strips a configured prefix and suffix", () => {
    const capture = configured({ prefix: "]E0", suffix: "~" });
    const run = feed(capture, scanKeys("]E05901234123457~", { startAt: 0, gapMs: 5 }));
    expect(run.scans.map((s) => s.value)).toEqual(["5901234123457"]);
    expect(run.scans[0]?.length).toBe(13);
  });

  it("rejects a missing prefix or suffix instead of guessing", () => {
    const noPrefix = feed(
      configured({ prefix: "]E0" }),
      scanKeys("5901234123457", { startAt: 0, gapMs: 5 }),
    );
    expect(noPrefix.results.at(-1)?.rejection?.reason).toBe("PREFIX_MISMATCH");
    const noSuffix = feed(
      configured({ suffix: "~" }),
      scanKeys("5901234123457", { startAt: 0, gapMs: 5 }),
    );
    expect(noSuffix.results.at(-1)?.rejection?.reason).toBe("SUFFIX_MISMATCH");
  });

  it("leaves a burst shorter than the minimum as ordinary typing, and rejects a long one", () => {
    const capture = configured({ minLength: 4, maxLength: 10 });
    const short = feed(capture, scanKeys("123", { startAt: 0, gapMs: 4 }));
    expect(short.scans).toHaveLength(0);
    expect(short.results.every((r) => r.rejection === undefined && !r.preventDefault)).toBe(true);
    const long = feed(capture, scanKeys("12345678901", { startAt: 100, gapMs: 4 }));
    expect(long.results.at(-1)?.rejection).toEqual({ reason: "TOO_LONG", length: 11 });
    const ok = feed(capture, scanKeys("1234567890", { startAt: 200, gapMs: 4 }));
    expect(ok.scans.map((s) => s.value)).toEqual(["1234567890"]);
  });

  it("keeps an unknown-looking value as plain candidate text without interpreting it", () => {
    const run = feed(new ScanCapture(), scanKeys("DROP TABLE items;--", { startAt: 0, gapMs: 3 }));
    expect(run.scans.map((s) => [s.value, s.trust])).toEqual([
      ["DROP TABLE items;--", "UNTRUSTED_KEYBOARD_TEXT"],
    ]);
  });

  it("uses reset() to forget a partial scan", () => {
    const capture = new ScanCapture();
    capture.handleKey(key("1", 0));
    capture.handleKey(key("2", 4));
    capture.reset();
    expect(feed(capture, [key("Enter", 8)]).scans).toHaveLength(0);
  });
});

describe("ScanCapture boundaries", () => {
  it("applies the cadence limit to the terminator as well", () => {
    const keys = scanKeys("12345678", { startAt: 0, gapMs: 5 });
    const beforeTerminator = keys.slice(0, -1);
    const lastAt = beforeTerminator.at(-1)?.timeStamp ?? 0;
    const atLimit = feed(new ScanCapture(), [...beforeTerminator, key("Enter", lastAt + 50)]);
    expect(atLimit.scans).toHaveLength(1);
    const beyond = feed(new ScanCapture(), [...beforeTerminator, key("Enter", lastAt + 51)]);
    expect(beyond.scans).toHaveLength(0);
    expect(beyond.results.at(-1)).toMatchObject({
      preventDefault: false,
      suppressShortcuts: false,
    });
  });

  it("uses the minimum length exactly: 3 is typing, 4 is a scan", () => {
    expect(feed(new ScanCapture(), scanKeys("123", { startAt: 0, gapMs: 4 })).scans).toHaveLength(
      0,
    );
    expect(feed(new ScanCapture(), scanKeys("1234", { startAt: 0, gapMs: 4 })).scans).toHaveLength(
      1,
    );
  });

  it("uses the maximum length exactly: 128 is a scan, 129 is rejected", () => {
    const ok = feed(new ScanCapture(), scanKeys("1".repeat(128), { startAt: 0, gapMs: 1 }));
    expect(ok.scans).toHaveLength(1);
    const long = feed(new ScanCapture(), scanKeys("1".repeat(129), { startAt: 0, gapMs: 1 }));
    expect(long.results.at(-1)?.rejection).toEqual({ reason: "TOO_LONG", length: 129 });
  });

  it("does not treat Shift+Tab or Shift+Enter as a terminator", () => {
    for (const keyName of ["Tab", "Enter"]) {
      const capture = new ScanCapture();
      const keys = scanKeys("12345678", { startAt: 0, gapMs: 4 }).slice(0, -1);
      feed(capture, keys);
      const at = (keys.at(-1)?.timeStamp ?? 0) + 4;
      const result = capture.handleKey({ ...key(keyName, at), shiftKey: true });
      expect(result.scan).toBeUndefined();
      expect(result.preventDefault).toBe(false);
    }
  });
});

describe("ScanCapture input modes it must leave alone (timing alone is not proof of a scanner)", () => {
  it("ignores pasted text: Ctrl+V and a quick Enter are not a scan", () => {
    const capture = new ScanCapture();
    const run = feed(capture, [key("v", 0, { ctrlKey: true }), key("Enter", 20)]);
    expect(run.scans).toHaveLength(0);
    expect(run.results.every((r) => !r.preventDefault && !r.suppressShortcuts)).toBe(true);
  });

  it("ignores IME composition, including the Process key", () => {
    const capture = new ScanCapture();
    const run = feed(capture, [
      key("Process", 0),
      { ...key("1", 5), isComposing: true },
      { ...key("2", 10), isComposing: true },
      { ...key("3", 15), isComposing: true },
      { ...key("4", 20), isComposing: true },
      { ...key("Enter", 25), isComposing: true },
    ]);
    expect(run.scans).toHaveLength(0);
    expect(run.results.every((r) => !r.preventDefault && !r.suppressShortcuts)).toBe(true);
  });

  it("sees nothing for dictation or on-screen text that arrives without key events", () => {
    // Dictation inserts text through input events only, so only the later Enter is seen.
    expect(feed(new ScanCapture(), [key("Enter", 100)]).scans).toHaveLength(0);
  });

  it("ignores a held key (auto-repeat)", () => {
    const capture = new ScanCapture();
    const run = feed(capture, [
      key("a", 0),
      ...Array.from({ length: 6 }, (_, i) => ({ ...key("a", 30 * (i + 1)), repeat: true })),
      key("Enter", 200),
    ]);
    expect(run.scans).toHaveLength(0);
  });

  it("lets a fast typist roll two keys and press a shortcut quickly without interference", () => {
    const afterOneKey = feed(new ScanCapture(), [key("o", 0), key("F2", 20)]);
    expect(afterOneKey.results.at(-1)).toMatchObject({
      suppressShortcuts: false,
      preventDefault: false,
    });
    const rollover = feed(new ScanCapture(), [key("o", 0), key("k", 30), key("Enter", 60)]);
    expect(rollover.scans).toHaveLength(0);
    expect(rollover.results.every((r) => !r.preventDefault && r.rejection === undefined)).toBe(
      true,
    );
  });

  it("does not treat Sticky Keys style modifier-only presses as input", () => {
    const capture = new ScanCapture();
    const run = feed(capture, [
      key("Shift", 0),
      key("Shift", 5),
      key("Control", 10),
      key("Enter", 15),
    ]);
    expect(run.scans).toHaveLength(0);
    expect(capture.isBurstActive(16)).toBe(false);
  });

  it("never touches ordinary shortcuts outside a burst", () => {
    const capture = new ScanCapture();
    const shortcuts = [
      key("F2", 0),
      key("F8", 300),
      key("k", 600, { ctrlKey: true }),
      key("f", 900, { ctrlKey: true }),
      key("Tab", 1200),
      key("Escape", 1500),
    ];
    for (const event of shortcuts) {
      expect(capture.handleKey(event)).toEqual({ suppressShortcuts: false, preventDefault: false });
    }
  });
});

describe("ScanCapture keeps scans untrusted (no validity or identity inferred)", () => {
  it("delivers a code with a wrong check digit unchanged", () => {
    const badEan = "5901234123450";
    const run = feed(new ScanCapture(), scanKeys(badEan, { startAt: 0, gapMs: 5 }));
    expect(run.scans.map((s) => s.value)).toEqual([badEan]);
  });

  it("delivers markup, spaces, unicode and look-alike text as plain text", () => {
    for (const value of ["<script>1</script>", "A B C D", "മലയാളം12", "0000", "  42  "]) {
      const run = feed(new ScanCapture(), scanKeys(value, { startAt: 0, gapMs: 4 }));
      expect(run.scans.map((s) => s.value)).toEqual([value]);
    }
  });

  it("carries no barcode symbology, validity, product or device fields", () => {
    const run = feed(new ScanCapture(), scanKeys("5901234123457", { startAt: 0, gapMs: 5 }));
    expect(Object.keys(run.scans[0] ?? {}).sort()).toEqual([
      "endedAt",
      "length",
      "startedAt",
      "terminator",
      "trust",
      "value",
    ]);
  });

  it("treats a burst from any fast source the same way, because timing proves nothing", () => {
    // A macro tool injecting keys at 2 ms cannot be told apart from a scanner by this module.
    const macro = feed(new ScanCapture(), scanKeys("HELLO123", { startAt: 0, gapMs: 2 }));
    expect(macro.scans.map((s) => s.trust)).toEqual(["UNTRUSTED_KEYBOARD_TEXT"]);
  });
});
