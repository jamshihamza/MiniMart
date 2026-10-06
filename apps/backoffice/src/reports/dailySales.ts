import type { ReportSpec } from "./types.js";

/**
 * Fictional Daily Sales Summary fixture, copied from the approved Reporting reference (screen 29).
 * Every figure is an illustrative example. The totals row is a literal fixture value: this UI does
 * not calculate it, and no net-sales definition is asserted (FR-RPT-016 and FR-RPT-050 stay OPEN).
 */
export const DAILY_SALES_SUMMARY: ReportSpec = {
  slug: "daily-sales-summary",
  name: "Daily Sales Summary",
  family: "Sales",
  refs: ["FR-RPT-016", "FR-RPT-004", "FR-RPT-050", "UI-RPT-002", "API-RPT-001/002"],
  sub: "Totals by business date for the selected store and counters.",
  period: "Business date 20–26 Sep 2026",
  generated: "26 Sep 2026 · 18:42",
  filters: [
    ["Store", "MiniMart Central"],
    ["Business date", "20–26 Sep 2026"],
    ["Counter", "All counters"],
    ["Cashier", "All cashiers"],
    ["Status", "Posted / completed"],
  ],
  definitions: [
    { term: "Gross sales", kind: "OPEN" },
    { term: "Discounts", kind: "OPEN" },
    { term: "Returns", kind: "OPEN" },
    { term: "Net sales", kind: "OPEN" },
    { term: "Tax", kind: "VERIFY" },
  ],
  columns: [
    { label: "Business date", widthPct: 22 },
    { label: "Transactions", numeric: true, widthPct: 14 },
    { label: "Gross sales", numeric: true, widthPct: 16 },
    { label: "Discounts", numeric: true, widthPct: 16 },
    { label: "Returns", numeric: true, widthPct: 16 },
    { label: "Net sales", numeric: true, bold: true, widthPct: 16 },
  ],
  rows: [
    ["Sun 20 Sep 2026", "412", "RM 18,420.50", "RM 312.40", "RM 205.00", "RM 17,903.10"],
    ["Mon 21 Sep 2026", "398", "RM 17,110.20", "RM 280.10", "RM 150.70", "RM 16,679.40"],
    ["Tue 22 Sep 2026", "405", "RM 17,655.80", "RM 295.00", "RM 98.30", "RM 17,262.50"],
    ["Wed 23 Sep 2026", "380", "RM 16,240.00", "RM 240.60", "RM 120.00", "RM 15,879.40"],
    ["Thu 24 Sep 2026", "441", "RM 19,890.90", "RM 355.20", "RM 310.00", "RM 19,225.70"],
    ["Fri 25 Sep 2026", "520", "RM 24,310.40", "RM 410.50", "RM 232.20", "RM 23,667.70"],
    ["Sat 26 Sep 2026", "466", "RM 21,045.30", "RM 388.00", "RM 175.80", "RM 20,481.50"],
  ],
  totals: [
    "Total (all rows in scope)",
    "3,022",
    "RM 134,673.10",
    "RM 2,281.80",
    "RM 1,292.00",
    "RM 131,099.30",
  ],
  pageLimit: 200,
  notes: [
    {
      kind: "OPEN",
      id: "FR-RPT-016",
      text: "Gross, discount, return and net definitions must be approved before this report is built; no formula is implied by these example rows.",
    },
    {
      kind: "VERIFY",
      id: "FR-RPT-004",
      text: "After-midnight transactions follow their assigned business date; business-date rollover policy is OPEN (DEC-COM-001, DEC-CSH-001).",
    },
  ],
};
