/**
 * MM-008 scanner test fixtures (FR-HW-048): representative barcode types and scan cadence.
 * Values are public sample codes with valid check digits; they are not catalog items.
 */
import type { ScanKeyInput } from "../src/scanner-input.js";

export interface BarcodeFixture {
  readonly symbology: string;
  readonly value: string;
}

export const BARCODE_FIXTURES: readonly BarcodeFixture[] = [
  { symbology: "EAN-13", value: "5901234123457" },
  { symbology: "UPC-A", value: "036000291452" },
  { symbology: "EAN-8", value: "96385074" },
  { symbology: "ITF-14", value: "10012345678902" },
  { symbology: "Code 128", value: "MM-INV-2026-0042" },
  { symbology: "Code 39", value: "MM00124" },
];

export interface ScanTiming {
  /** Time of the first key. */
  readonly startAt: number;
  /** Gap between consecutive keys of the scan, including the terminator. */
  readonly gapMs: number;
  readonly terminator?: string;
  /** Send Shift before uppercase letters, as many scanners do. */
  readonly shiftUppercase?: boolean;
}

export function key(
  keyName: string,
  timeStamp: number,
  modifiers: Partial<Pick<ScanKeyInput, "ctrlKey" | "altKey" | "metaKey" | "shiftKey">> = {},
): ScanKeyInput {
  return {
    key: keyName,
    timeStamp,
    ctrlKey: modifiers.ctrlKey ?? false,
    altKey: modifiers.altKey ?? false,
    metaKey: modifiers.metaKey ?? false,
    shiftKey: modifiers.shiftKey ?? false,
    repeat: false,
    isComposing: false,
  };
}

/** Key events for one scan: the characters, then the terminator. */
export function scanKeys(value: string, timing: ScanTiming): ScanKeyInput[] {
  const events: ScanKeyInput[] = [];
  let at = timing.startAt;
  for (const character of value) {
    if (timing.shiftUppercase === true && /[A-Z]/.test(character)) {
      events.push(key("Shift", at));
      at += 1;
    }
    events.push(key(character, at));
    at += timing.gapMs;
  }
  events.push(key(timing.terminator ?? "Enter", at));
  return events;
}

/** Key events for a human typing: slow, no scanner cadence. */
export function typedKeys(text: string, startAt: number, gapMs = 140): ScanKeyInput[] {
  return [...text].map((character, index) => key(character, startAt + index * gapMs));
}

/** EAN-13 / UPC-A / ITF-14 check digit, to prove the sample codes are well formed. */
export function gs1CheckDigit(digitsWithoutCheck: string): number {
  let sum = 0;
  const reversed = [...digitsWithoutCheck].reverse();
  reversed.forEach((digit, index) => {
    sum += Number(digit) * (index % 2 === 0 ? 3 : 1);
  });
  return (10 - (sum % 10)) % 10;
}
