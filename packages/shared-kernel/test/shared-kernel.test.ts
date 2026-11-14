import { describe, expect, it } from "vitest";

import {
  divDec,
  formatDec,
  InvalidDecimalError,
  isUuid,
  localDate,
  mulDec,
  parseDec,
  roundDec,
  uuidv7,
} from "../src/index.js";

describe("decimal", () => {
  it("parses and formats without binary float error", () => {
    expect(formatDec(parseDec("0.1") + parseDec("0.2"))).toBe("0.30");
    expect(formatDec(parseDec("-12.345"), 2)).toBe("-12.35");
    expect(formatDec(parseDec("12.344999"), 2)).toBe("12.34");
    expect(formatDec(parseDec("7"), 0)).toBe("7");
    expect(formatDec(parseDec("-0.001"), 2)).toBe("0.00");
  });

  it("rejects malformed input", () => {
    for (const value of ["", "1e3", "1.123456789", "abc", "1,5", "--1"]) {
      expect(() => parseDec(value)).toThrow(InvalidDecimalError);
    }
  });

  it("multiplies, divides and rounds half away from zero", () => {
    expect(formatDec(mulDec(parseDec("3"), parseDec("2.50")))).toBe("7.50");
    expect(formatDec(mulDec(parseDec("0.335"), parseDec("3")), 2)).toBe("1.01");
    expect(formatDec(divDec(parseDec("10"), parseDec("3")), 8)).toBe("3.33333333");
    expect(formatDec(roundDec(parseDec("2.675"), 2), 2)).toBe("2.68");
    expect(formatDec(roundDec(parseDec("-2.675"), 2), 2)).toBe("-2.68");
    expect(() => divDec(parseDec("1"), 0n)).toThrow(RangeError);
  });
});

describe("identifiers and dates", () => {
  it("generates time-ordered UUIDv7 values", () => {
    const first = uuidv7(new Date("2026-01-01T00:00:00Z"));
    const second = uuidv7(new Date("2026-01-01T00:00:01Z"));
    expect(isUuid(first)).toBe(true);
    expect(first[14]).toBe("7");
    expect(first < second).toBe(true);
    const sameInstant = Array.from({ length: 5000 }, () =>
      uuidv7(new Date("2026-01-01T00:00:02Z")),
    );
    expect([...sameInstant].sort()).toEqual(sameInstant);
    expect(new Set(sameInstant).size).toBe(5000);
  });

  it("derives the local calendar date in the store time zone", () => {
    expect(localDate(new Date("2026-09-26T16:30:00Z"), "Asia/Kuala_Lumpur")).toBe("2026-09-27");
    expect(localDate(new Date("2026-09-26T15:30:00Z"), "Asia/Kuala_Lumpur")).toBe("2026-09-26");
  });
});
