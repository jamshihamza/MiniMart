/**
 * FICTIONAL FIXTURES for the visual-only POS preview (ADR 0008). They are copied from the approved
 * POS reference (docs/design/pos/source/MiniMartPOS.dc.html). They are never persisted, never
 * trusted and never used for a calculation. Every amount below is a fixed display string: this
 * module and the UI add, multiply or round nothing.
 */

export const SHELL_PREVIEW = {
  store: "MiniMart Central",
  register: "POS-01",
  businessDate: "Sat, 26 Sep 2026",
  businessTime: "14:32",
  cashier: "Demo Cashier",
  cashierInitials: "DC",
  shiftNote: "Shift open · since 08:00",
} as const;

export type StockTone = "ok" | "low" | "out";

export interface PreviewProduct {
  readonly id: string;
  readonly name: string;
  readonly detail: string;
  readonly price: string;
  readonly category: string;
  /** Pre-formatted stock label. The preview classifies and computes nothing. */
  readonly stockLabel: string;
  readonly stockTone: StockTone;
  readonly sku: string;
}

export const CATEGORIES = [
  "All",
  "Beverages",
  "Snacks",
  "Grocery",
  "Household",
  "Personal Care",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Sixteen fictional products, in the order the approved reference shows them. */
export const PREVIEW_PRODUCTS: readonly PreviewProduct[] = [
  {
    id: "milk",
    name: "Fresh Milk",
    detail: "1 L · chilled",
    price: "RM 7.20",
    category: "Grocery",
    stockLabel: "In stock 24",
    stockTone: "ok",
    sku: "9555001023100",
  },
  {
    id: "bread",
    name: "White Bread",
    detail: "600 g",
    price: "RM 3.90",
    category: "Grocery",
    stockLabel: "Low · 6",
    stockTone: "low",
    sku: "9555001026801",
  },
  {
    id: "rice",
    name: "Jasmine Rice",
    detail: "5 kg",
    price: "RM 18.50",
    category: "Grocery",
    stockLabel: "In stock 16",
    stockTone: "ok",
    sku: "9555001030502",
  },
  {
    id: "oil",
    name: "Palm Cooking Oil",
    detail: "2 kg",
    price: "RM 13.90",
    category: "Grocery",
    stockLabel: "In stock 11",
    stockTone: "ok",
    sku: "9555001034203",
  },
  {
    id: "water",
    name: "Mineral Water",
    detail: "1.5 L",
    price: "RM 1.80",
    category: "Beverages",
    stockLabel: "In stock 96",
    stockTone: "ok",
    sku: "9555001037904",
  },
  {
    id: "cola",
    name: "Cola",
    detail: "1.5 L",
    price: "RM 4.20",
    category: "Beverages",
    stockLabel: "In stock 30",
    stockTone: "ok",
    sku: "9555001041605",
  },
  {
    id: "crackers",
    name: "Cream Crackers",
    detail: "400 g",
    price: "RM 5.60",
    category: "Snacks",
    stockLabel: "In stock 18",
    stockTone: "ok",
    sku: "9555001045306",
  },
  {
    id: "coffee",
    name: "3-in-1 White Coffee",
    detail: "20 × 36 g",
    price: "RM 12.90",
    category: "Beverages",
    stockLabel: "Low · 3",
    stockTone: "low",
    sku: "9555001049007",
  },
  {
    id: "tea",
    name: "Teh Tarik Mix",
    detail: "15 × 30 g",
    price: "RM 10.50",
    category: "Beverages",
    stockLabel: "In stock 14",
    stockTone: "ok",
    sku: "9555001052708",
  },
  {
    id: "noodles",
    name: "Instant Noodles Curry",
    detail: "5 × 80 g",
    price: "RM 4.80",
    category: "Grocery",
    stockLabel: "In stock 40",
    stockTone: "ok",
    sku: "9555001056409",
  },
  {
    id: "detergent",
    name: "Laundry Detergent",
    detail: "2.5 kg",
    price: "RM 21.90",
    category: "Household",
    stockLabel: "Out of stock",
    stockTone: "out",
    sku: "9555001060100",
  },
  {
    id: "soap",
    name: "Bath Soap",
    detail: "3 × 90 g",
    price: "RM 6.40",
    category: "Personal Care",
    stockLabel: "In stock 22",
    stockTone: "ok",
    sku: "9555001063801",
  },
  {
    id: "bcoffee",
    name: "Black Coffee Powder",
    detail: "200 g",
    price: "RM 8.90",
    category: "Beverages",
    stockLabel: "In stock 9",
    stockTone: "ok",
    sku: "9555001067502",
  },
  {
    id: "creamer",
    name: "Coffee Creamer",
    detail: "450 g",
    price: "RM 9.80",
    category: "Grocery",
    stockLabel: "In stock 12",
    stockTone: "ok",
    sku: "9555001071203",
  },
  {
    id: "icoffee",
    name: "Iced Coffee Can",
    detail: "240 ml",
    price: "RM 2.60",
    category: "Beverages",
    stockLabel: "In stock 48",
    stockTone: "ok",
    sku: "9555001074904",
  },
  {
    id: "dish",
    name: "Dishwashing Liquid",
    detail: "900 ml",
    price: "RM 5.50",
    category: "Household",
    stockLabel: "In stock 20",
    stockTone: "ok",
    sku: "9555001078605",
  },
];

export interface PreviewCartLine {
  readonly id: string;
  readonly name: string;
  readonly unit: string;
  readonly category: string;
  readonly quantity: string;
  readonly lineTotal: string;
}

/** Fictional populated cart (reference screen 02). Line totals are fixed strings. */
export const PREVIEW_CART: readonly PreviewCartLine[] = [
  {
    id: "milk",
    name: "Fresh Milk 1 L",
    unit: "RM 7.20",
    category: "Grocery",
    quantity: "2",
    lineTotal: "RM 14.40",
  },
  {
    id: "noodles",
    name: "Instant Noodles Curry 5 × 80 g",
    unit: "RM 4.80",
    category: "Grocery",
    quantity: "2",
    lineTotal: "RM 9.60",
  },
  {
    id: "coffee",
    name: "3-in-1 White Coffee 20 × 36 g",
    unit: "RM 12.90",
    category: "Beverages",
    quantity: "1",
    lineTotal: "RM 12.90",
  },
  {
    id: "cola",
    name: "Cola 1.5 L",
    unit: "RM 4.20",
    category: "Beverages",
    quantity: "1",
    lineTotal: "RM 4.20",
  },
  {
    id: "bread",
    name: "White Bread 600 g",
    unit: "RM 3.90",
    category: "Grocery",
    quantity: "1",
    lineTotal: "RM 3.90",
  },
  {
    id: "water",
    name: "Mineral Water 1.5 L",
    unit: "RM 1.80",
    category: "Beverages",
    quantity: "2",
    lineTotal: "RM 3.60",
  },
];

/** The line the reference shows as selected in the populated cart. */
export const PREVIEW_SELECTED_LINE = "coffee";

export interface PreviewTotals {
  readonly itemCount: string;
  readonly subtotal: string;
  readonly discount: string;
  readonly tax: string;
  readonly rounding: string;
  readonly total: string;
}

export const EMPTY_TOTALS: PreviewTotals = {
  itemCount: "0 items",
  subtotal: "RM 0.00",
  discount: "RM 0.00",
  tax: "RM 0.00",
  rounding: "RM 0.00",
  total: "RM 0.00",
};

/** Fixed fictional totals for the populated cart. Nothing here is calculated. */
export const POPULATED_TOTALS: PreviewTotals = {
  itemCount: "9 items",
  subtotal: "RM 48.60",
  discount: "−RM 2.00",
  tax: "RM 0.00",
  rounding: "RM 0.00",
  total: "RM 46.60",
};

/** Fictional count shown on the Recall control. */
export const HELD_SALES_COUNT = "3";
