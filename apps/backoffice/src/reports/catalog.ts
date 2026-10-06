import type { CatalogFamily } from "./types.js";

/**
 * Fictional catalog fixture. Names and requirement identifiers are copied from the approved
 * Reporting reference (screen 01). Only Daily Sales Summary has a viewer in this preview.
 * The report codes and name keys are not frozen (GAP, API-RPT-001).
 */
export const CATALOG: readonly CatalogFamily[] = [
  {
    family: "Sales",
    uiRef: "UI-RPT-002",
    entries: [
      { name: "Daily Sales Summary", requirement: "FR-RPT-016", slug: "daily-sales-summary" },
      { name: "Sales by Item", requirement: "FR-RPT-017" },
      { name: "Sales by Category", requirement: "FR-RPT-018" },
      { name: "Sales by Cashier", requirement: "FR-RPT-019" },
      { name: "Sales by Counter", requirement: "FR-RPT-020" },
      { name: "Discount Report", requirement: "FR-RPT-021" },
      { name: "Price Override Report", requirement: "FR-RPT-022" },
      { name: "Returns Report", requirement: "FR-RPT-023" },
      { name: "No-Receipt Return Report", requirement: "FR-RPT-024", flag: "If enabled" },
      { name: "Tender Summary", requirement: "FR-RPT-025" },
      { name: "Payment Exception Report", requirement: "FR-RPT-026" },
    ],
  },
  {
    family: "Cash & day close",
    uiRef: "Owner screen unresolved",
    entries: [
      { name: "Cash Movement Report", requirement: "FR-RPT-027" },
      { name: "Cash Variance Report", requirement: "FR-RPT-028" },
      { name: "Shift Close Report", requirement: "FR-RPT-029" },
      { name: "Day Close Report", requirement: "FR-RPT-030" },
    ],
  },
  {
    family: "Inventory",
    uiRef: "UI-RPT-003",
    entries: [
      { name: "Current Stock", requirement: "FR-RPT-031" },
      { name: "Low Stock Report", requirement: "FR-RPT-032", flag: "Threshold undefined" },
      { name: "Negative Stock Report", requirement: "FR-RPT-033" },
      { name: "Stock Movement Report", requirement: "FR-RPT-034" },
      { name: "Batch / Expiry Report", requirement: "FR-RPT-035", flag: "If tracking enabled" },
      { name: "Inventory Valuation Report", requirement: "FR-RPT-036" },
      { name: "Stock Count Variance Report", requirement: "FR-RPT-037" },
      { name: "Stock Adjustment Report", requirement: "FR-RPT-038" },
    ],
  },
  {
    family: "Purchasing",
    uiRef: "UI-RPT-004",
    entries: [
      { name: "Purchase Summary", requirement: "FR-RPT-039" },
      { name: "Purchase by Supplier", requirement: "FR-RPT-040" },
      { name: "Purchase Return Report", requirement: "FR-RPT-041" },
      { name: "Purchase Price History", requirement: "FR-RPT-042", flag: "Cost-sensitive" },
    ],
  },
  {
    family: "Credit & collections",
    uiRef: "UI-RPT-005",
    entries: [
      { name: "Customer Outstanding Report", requirement: "FR-RPT-043" },
      { name: "Customer Aging Report", requirement: "FR-RPT-044", flag: "Buckets undefined" },
      { name: "Customer Statement", requirement: "FR-RPT-045" },
      { name: "Credit Override Report", requirement: "FR-RPT-046", flag: "If enabled" },
    ],
  },
  {
    family: "Management",
    uiRef: "Owner screen unresolved",
    entries: [
      { name: "Management Daily Summary", requirement: "FR-RPT-047" },
      { name: "Exception Highlights", requirement: "FR-RPT-048" },
      { name: "Comparative Periods", requirement: "FR-RPT-049", flag: "Optional (COULD)" },
    ],
  },
  {
    family: "Central (later phase)",
    uiRef: "Not in frozen UI",
    entries: [
      { name: "Central multi-branch reports", requirement: "FR-RPT-054", flag: "Phase 3" },
      { name: "Incomplete sync warning", requirement: "FR-RPT-055", flag: "Phase 3" },
    ],
  },
];

export const CATALOG_TOTAL = CATALOG.reduce((count, family) => count + family.entries.length, 0);
