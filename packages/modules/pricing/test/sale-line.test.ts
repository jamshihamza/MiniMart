import { parseDec } from "@minimart/shared-kernel";
import { describe, expect, it } from "vitest";

import { extendSaleLine } from "../src/index.js";

describe("sale line amount", () => {
  it("multiplies exactly and rounds half away from zero to money precision", () => {
    expect(extendSaleLine(parseDec("3"), parseDec("2.50"))).toBe(parseDec("7.50"));
    expect(extendSaleLine(parseDec("0.335"), parseDec("12.90"))).toBe(parseDec("4.32"));
    expect(extendSaleLine(parseDec("0.5"), parseDec("0.01"))).toBe(parseDec("0.01"));
    expect(extendSaleLine(parseDec("0.1"), parseDec("0.2"))).toBe(parseDec("0.02"));
  });
});
