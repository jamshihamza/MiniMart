import { describe, expect, it } from "vitest";

import {
  HELD_SALES,
  HISTORY_ROWS,
  PREVIEW_CUSTOMERS,
  RETURN_LINES,
  RETURN_SUMMARY,
  SALE_DETAIL_LINES,
  SALE_DETAIL_TOTALS,
  SHIFT_CLOSE,
  SHIFT_COUNT,
} from "../src/fixtures-flow.js";

/**
 * Guards against transcription mistakes in the fictional flow fixtures. The arithmetic exists only
 * in this test; the product code displays fixed strings and calculates nothing (ADR 0008).
 */
function cents(text: string): number {
  const negative = text.startsWith("−");
  const match = /(\d[\d,]*)\.(\d{2})$/.exec(text);
  if (match === null) throw new Error(`not an amount: ${text}`);
  const value = Number((match[1] ?? "0").replaceAll(",", "")) * 100 + Number(match[2]);
  return negative ? -value : value;
}

describe("fictional flow fixtures match the approved POS reference", () => {
  it("has the reference history, held sales and customers", () => {
    expect(HISTORY_ROWS).toHaveLength(12);
    expect(HISTORY_ROWS[0]).toMatchObject({ receipt: "POS01-000141", total: "RM 12.60" });
    expect(HISTORY_ROWS.map((row) => row.status)).toContain("Refund pending");
    expect(HELD_SALES.map((held) => held.ref)).toEqual(["H-0007", "H-0006", "H-0005"]);
    expect(PREVIEW_CUSTOMERS.map((customer) => customer.name)).toEqual(["Aisyah R.", "Hafiz M."]);
  });

  it("has sale-detail lines that add up to the shown totals", () => {
    const lines = SALE_DETAIL_LINES.reduce((sum, line) => sum + cents(line.total), 0);
    for (const line of SALE_DETAIL_LINES) {
      expect(cents(line.total)).toBe(cents(line.unit) * Number(line.quantity));
    }
    expect(lines).toBe(cents(SALE_DETAIL_TOTALS.subtotal));
    expect(cents(SALE_DETAIL_TOTALS.subtotal) + cents(SALE_DETAIL_TOTALS.discount)).toBe(
      cents(SALE_DETAIL_TOTALS.total),
    );
  });

  it("has a cash count that equals the counted cash, and a difference that equals the gap", () => {
    const counted = SHIFT_COUNT.reduce((sum, row) => sum + cents(row.amount), 0);
    expect(counted).toBe(cents(SHIFT_CLOSE.counted));
    expect(cents(SHIFT_CLOSE.counted) - cents(SHIFT_CLOSE.expected)).toBe(
      cents(SHIFT_CLOSE.difference),
    );
  });

  it("has return refund lines that equal the refund due and the unit count", () => {
    const refund = RETURN_LINES.reduce(
      (sum, line) => sum + (line.quantity === "0" ? 0 : cents(line.amount)),
      0,
    );
    const units = RETURN_LINES.reduce((sum, line) => sum + Number(line.quantity), 0);
    expect(refund).toBe(cents(RETURN_SUMMARY.refund));
    expect(RETURN_SUMMARY.units).toBe(`${String(units)} units`);
    for (const line of RETURN_LINES) {
      if (line.quantity !== "0") {
        expect(cents(line.amount)).toBe(cents(line.unit) * Number(line.quantity));
      }
    }
  });
});
