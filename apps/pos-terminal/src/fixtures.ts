// Presentation-only values. No fixture is persisted or treated as trusted context.
export const SHELL_PREVIEW = {
  store: "Demo Store",
  counter: "Counter 01",
  cashier: "Demo cashier",
  currency: "MYR demo",
  zeroTotal: "0.00",
} as const;

// Visual-only sample catalog. Tiles cannot add items or alter a sale.
export const previewProducts = [
  { name: "Cola 320ml", price: "RM 2.50" },
  { name: "100 Plus 325ml", price: "RM 2.50" },
  { name: "Milo 200ml", price: "RM 2.20" },
  { name: "Maggie Mee", price: "RM 4.50" },
  { name: "Gardenia Bread", price: "RM 2.80" },
  { name: "Nestle Water 600ml", price: "RM 1.20" },
  { name: "Dutch Lady Milk 1L", price: "RM 6.50" },
  { name: "Lay's Classic 52g", price: "RM 4.20" },
  { name: "KitKat 4F", price: "RM 3.50" },
  { name: "Dettol 250ml", price: "RM 12.90" },
] as const;
