/**
 * FICTIONAL FIXTURES for the visual-only POS flow screens (ADR 0008): history, held sales, customers,
 * returns, shift and payment. Generated from the approved POS reference
 * (docs/design/pos/source/MiniMartPOS.dc.html) and checked by test/fixtures-flow.test.ts. Every value
 * is a fixed display string. Nothing here is persisted, trusted or calculated by the product code.
 */

export type HistoryStatus = "Completed" | "Partially returned" | "Refund pending";

export interface HistoryRow {
  readonly receipt: string;
  readonly time: string;
  readonly customer: string;
  readonly items: string;
  readonly total: string;
  readonly tender: "Cash" | "Card" | "DuitNow QR";
  readonly status: HistoryStatus;
}

/** Twelve fictional posted sales, newest first (reference screen 16). */
export const HISTORY_ROWS: readonly HistoryRow[] = [
  {
    receipt: "POS01-000141",
    time: "14:21",
    customer: "Walk-in Customer",
    items: "3",
    total: "RM 12.60",
    tender: "Cash",
    status: "Completed",
  },
  {
    receipt: "POS01-000140",
    time: "14:09",
    customer: "Aisyah R.",
    items: "12",
    total: "RM 87.40",
    tender: "Card",
    status: "Completed",
  },
  {
    receipt: "POS01-000139",
    time: "13:58",
    customer: "Walk-in Customer",
    items: "6",
    total: "RM 32.40",
    tender: "DuitNow QR",
    status: "Completed",
  },
  {
    receipt: "POS01-000138",
    time: "13:41",
    customer: "Walk-in Customer",
    items: "1",
    total: "RM 1.80",
    tender: "Cash",
    status: "Completed",
  },
  {
    receipt: "POS01-000137",
    time: "13:30",
    customer: "Daniel T.",
    items: "8",
    total: "RM 54.10",
    tender: "Card",
    status: "Completed",
  },
  {
    receipt: "POS01-000136",
    time: "13:02",
    customer: "Walk-in Customer",
    items: "4",
    total: "RM 19.70",
    tender: "Cash",
    status: "Partially returned",
  },
  {
    receipt: "POS01-000135",
    time: "12:47",
    customer: "Walk-in Customer",
    items: "2",
    total: "RM 8.40",
    tender: "DuitNow QR",
    status: "Completed",
  },
  {
    receipt: "POS01-000134",
    time: "12:31",
    customer: "Priya K.",
    items: "15",
    total: "RM 112.85",
    tender: "Card",
    status: "Refund pending",
  },
  {
    receipt: "POS01-000133",
    time: "12:10",
    customer: "Walk-in Customer",
    items: "5",
    total: "RM 22.30",
    tender: "Cash",
    status: "Completed",
  },
  {
    receipt: "POS01-000132",
    time: "11:36",
    customer: "Walk-in Customer",
    items: "3",
    total: "RM 15.60",
    tender: "Cash",
    status: "Completed",
  },
  {
    receipt: "POS01-000131",
    time: "11:08",
    customer: "Walk-in Customer",
    items: "5",
    total: "RM 35.70",
    tender: "Card",
    status: "Completed",
  },
  {
    receipt: "POS01-000130",
    time: "10:52",
    customer: "Hafiz M.",
    items: "7",
    total: "RM 41.20",
    tender: "Cash",
    status: "Completed",
  },
];

export const HISTORY_SELECTED_RECEIPT = "POS01-000139";
export const HISTORY_SUMMARY = "12 of 41 sales · POS-01 · Sat, 26 Sep 2026";
export const HISTORY_EMPTY_SUMMARY = "POS-01 · Sat, 26 Sep 2026";

export interface DetailLine {
  readonly name: string;
  readonly quantity: string;
  readonly unit: string;
  readonly total: string;
}

/** Fictional sale detail for POS01-000139 (reference screen 17). */
export const SALE_DETAIL_LINES: readonly DetailLine[] = [
  { name: "Jasmine Rice 5 kg", quantity: "1", unit: "RM 18.50", total: "RM 18.50" },
  { name: "Mineral Water 1.5 L", quantity: "3", unit: "RM 1.80", total: "RM 5.40" },
  { name: "Cream Crackers 400 g", quantity: "1", unit: "RM 5.60", total: "RM 5.60" },
  { name: "White Bread 600 g", quantity: "1", unit: "RM 3.90", total: "RM 3.90" },
];

export const SALE_DETAIL_TOTALS = {
  subtotal: "RM 33.40",
  discount: "−RM 1.00",
  tax: "RM 0.00",
  rounding: "RM 0.00",
  total: "RM 32.40",
} as const;

export interface HeldSale {
  readonly time: string;
  readonly ref: string;
  readonly label: string;
  readonly customer: string;
  readonly cashier: string;
  readonly items: string;
  readonly amount: string;
}

/** Three fictional held sales (reference screen 08). */
export const HELD_SALES: readonly HeldSale[] = [
  {
    time: "13:52",
    ref: "H-0007",
    label: "Customer fetching wallet",
    customer: "Walk-in Customer",
    cashier: "Demo Cashier",
    items: "5",
    amount: "RM 23.80",
  },
  {
    time: "13:10",
    ref: "H-0006",
    label: "Price check · rice",
    customer: "Aisyah R.",
    cashier: "Demo Cashier",
    items: "12",
    amount: "RM 87.40",
  },
  {
    time: "11:47",
    ref: "H-0005",
    label: "No label",
    customer: "Walk-in Customer",
    cashier: "Demo Cashier",
    items: "2",
    amount: "RM 6.20",
  },
];

export interface PreviewCustomer {
  readonly name: string;
  readonly phone: string;
  readonly member: string;
  readonly initials: string;
}

export const PREVIEW_CUSTOMERS: readonly PreviewCustomer[] = [
  { name: "Aisyah R.", phone: "012-••• 4418", member: "MM-000482", initials: "AR" },
  { name: "Hafiz M.", phone: "012-••• 0356", member: "MM-000601", initials: "HM" },
];

export interface ReturnLine {
  readonly name: string;
  readonly unit: string;
  readonly sold: string;
  readonly quantity: string;
  readonly amount: string;
}

/** Return lines at reference screen 19. Quantities and refund amounts are fixed strings. */
export const RETURN_LINES: readonly ReturnLine[] = [
  { name: "Palm Cooking Oil 2 kg", unit: "RM 13.90", sold: "1", quantity: "0", amount: "—" },
  { name: "Cream Crackers 400 g", unit: "RM 5.60", sold: "2", quantity: "2", amount: "RM 11.20" },
  { name: "Cola 1.5 L", unit: "RM 4.20", sold: "1", quantity: "1", amount: "RM 4.20" },
  { name: "Bath Soap 3 × 90 g", unit: "RM 6.40", sold: "1", quantity: "0", amount: "—" },
];

export const RETURN_SALE = {
  receipt: "POS01-000131",
  meta: "26 Sep 2026 · 11:08 · Walk-in · Card •••• 4821",
} as const;

export const RETURN_SUMMARY = { units: "3 units", refund: "RM 15.40" } as const;

export interface CountRow {
  readonly label: string;
  readonly quantity: string;
  readonly amount: string;
}

/** Fictional cash count at reference screen 23. */
export const SHIFT_COUNT: readonly CountRow[] = [
  { label: "RM 100", quantity: "4", amount: "RM 400.00" },
  { label: "RM 50", quantity: "4", amount: "RM 200.00" },
  { label: "RM 20", quantity: "5", amount: "RM 100.00" },
  { label: "RM 10", quantity: "4", amount: "RM 40.00" },
  { label: "RM 5", quantity: "3", amount: "RM 15.00" },
  { label: "RM 1", quantity: "5", amount: "RM 5.00" },
  { label: "Coins", quantity: "0.40", amount: "RM 0.40" },
];

/** The denomination row the reference shows with the focus ring. */
export const SHIFT_COUNT_FOCUS = "RM 1";

export const SHIFT_CLOSE = {
  ref: "SH-POS01-0268",
  expected: "RM 762.40",
  counted: "RM 760.40",
  difference: "−RM 2.00",
} as const;
