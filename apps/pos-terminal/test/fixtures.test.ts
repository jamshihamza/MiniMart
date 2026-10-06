import { describe, expect, it } from "vitest";

import {
  CATEGORIES,
  EMPTY_TOTALS,
  POPULATED_TOTALS,
  PREVIEW_CART,
  PREVIEW_PRODUCTS,
  PREVIEW_SELECTED_LINE,
} from "../src/fixtures.js";

/**
 * Guards against transcription mistakes in the fictional fixtures. The arithmetic here exists only
 * in this test; the product code displays fixed strings and calculates nothing (ADR 0008).
 */
function cents(text: string): number {
  const negative = text.startsWith("−");
  const match = /(\d+)\.(\d{2})$/.exec(text);
  if (match === null) throw new Error(`not an amount: ${text}`);
  const value = Number(match[1]) * 100 + Number(match[2]);
  return negative ? -value : value;
}

describe("fictional fixtures match the approved POS reference", () => {
  it("has the sixteen reference products and category counts", () => {
    expect(PREVIEW_PRODUCTS).toHaveLength(16);
    const counts = Object.fromEntries(
      CATEGORIES.map((name) => [
        name,
        name === "All"
          ? PREVIEW_PRODUCTS.length
          : PREVIEW_PRODUCTS.filter((product) => product.category === name).length,
      ]),
    );
    // Chip counts shown by the reference: All 16, Beverages 6, Snacks 1, Grocery 6, Household 2,
    // Personal Care 1.
    expect(counts).toEqual({
      All: 16,
      Beverages: 6,
      Snacks: 1,
      Grocery: 6,
      Household: 2,
      "Personal Care": 1,
    });
  });

  it("uses the reference stock labels and thresholds", () => {
    const byId = Object.fromEntries(PREVIEW_PRODUCTS.map((product) => [product.id, product]));
    expect(byId["milk"]).toMatchObject({ stockLabel: "In stock 24", stockTone: "ok" });
    expect(byId["bread"]).toMatchObject({ stockLabel: "Low · 6", stockTone: "low" });
    expect(byId["coffee"]).toMatchObject({ stockLabel: "Low · 3", stockTone: "low" });
    expect(byId["detergent"]).toMatchObject({ stockLabel: "Out of stock", stockTone: "out" });
    expect(PREVIEW_PRODUCTS.filter((product) => product.stockTone === "out")).toHaveLength(1);
  });

  it("has line totals equal to unit price times quantity", () => {
    const priceOf = Object.fromEntries(
      PREVIEW_PRODUCTS.map((product) => [product.id, cents(product.price)]),
    );
    for (const line of PREVIEW_CART) {
      expect(cents(line.unit)).toBe(priceOf[line.id]);
      expect(cents(line.lineTotal)).toBe(cents(line.unit) * Number(line.quantity));
    }
  });

  it("has populated totals that equal the line values and the reference screen 02", () => {
    const subtotal = PREVIEW_CART.reduce((sum, line) => sum + cents(line.lineTotal), 0);
    const units = PREVIEW_CART.reduce((sum, line) => sum + Number(line.quantity), 0);
    expect(subtotal).toBe(cents(POPULATED_TOTALS.subtotal));
    expect(cents(POPULATED_TOTALS.subtotal) + cents(POPULATED_TOTALS.discount)).toBe(
      cents(POPULATED_TOTALS.total),
    );
    expect(POPULATED_TOTALS.itemCount).toBe(`${String(units)} items`);
    // Values read from the approved reference render of screen 02.
    expect(POPULATED_TOTALS).toEqual({
      itemCount: "9 items",
      subtotal: "RM 48.60",
      discount: "−RM 2.00",
      tax: "RM 0.00",
      rounding: "RM 0.00",
      total: "RM 46.60",
    });
    expect(PREVIEW_SELECTED_LINE).toBe("coffee");
  });

  it("has all-zero empty totals like the reference screen 01", () => {
    expect(EMPTY_TOTALS).toEqual({
      itemCount: "0 items",
      subtotal: "RM 0.00",
      discount: "RM 0.00",
      tax: "RM 0.00",
      rounding: "RM 0.00",
      total: "RM 0.00",
    });
  });
});
