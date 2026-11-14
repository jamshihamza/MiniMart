import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { BackOfficeApi } from "../src/api.js";
import { BackOfficeApp } from "../src/App.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const bread = {
  itemId: "i-5",
  itemCode: "MM-00105",
  name: "Gardenia Bread",
  categoryName: "Bakery",
  uomCode: "EACH",
  barcode: "9556001000059",
  stockManaged: true,
  sellingPrice: "2.80",
  onHand: "12",
  movingWac: "2.1000",
  stockValue: "25.20",
};

function fakeApi(): BackOfficeApi {
  return {
    context: vi.fn(async () => ({
      store: {
        displayName: "MiniMart Central",
        companyDisplayName: "MiniMart",
        currencyCode: "MYR",
      },
      operator: "store.manager",
      calendarDate: "2026-11-14",
    })),
    dashboard: vi.fn(async () => ({
      businessDate: "2026-11-14",
      businessDayOpen: true,
      saleCount: 2,
      salesTotal: "24.60",
      itemCount: 1,
      zeroStockCount: 0,
      stockValue: "25.20",
      openShifts: [],
      recentSales: [],
      businessDays: [],
    })),
    items: vi.fn(async () => ({ items: [bread] })),
    createItem: vi.fn(async () => bread),
    movements: vi.fn(async () => ({ movements: [] })),
    adjust: vi.fn(async () => ({ onHandAfter: "10" })),
    sales: vi.fn(async () => ({ sales: [] })),
    receipt: vi.fn(),
    shifts: vi.fn(async () => ({ shifts: [] })),
    shift: vi.fn(),
    closeBusinessDay: vi.fn(),
  };
}

describe("Back Office", () => {
  it("shows the dashboard figures supplied by the Store Node", async () => {
    render(<BackOfficeApp api={fakeApi()} />);
    expect(await screen.findByText("RM 24.60")).toBeVisible();
    expect(screen.getByText("Business Day open")).toBeVisible();
  });

  it("posts a stock adjustment through the API", async () => {
    const user = userEvent.setup();
    const api = fakeApi();
    render(<BackOfficeApp api={api} />);
    await user.click(await screen.findByRole("button", { name: "Inventory" }));
    const row = (await screen.findByText("Gardenia Bread")).closest("tr") as HTMLElement;
    await user.click(within(row).getByRole("button", { name: "Adjust" }));
    const form = screen.getByRole("form", { name: "Stock adjustment" });
    await user.type(within(form).getByLabelText(/Quantity/), "-2");
    await user.type(within(form).getByLabelText(/Reason/), "Expired");
    await user.click(within(form).getByRole("button", { name: "Post Adjustment" }));
    expect(await screen.findByText(/On hand is now 10/)).toBeVisible();
    expect(api.adjust).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ itemId: "i-5", quantityDelta: "-2", reason: "Expired" }),
    );
  });
});
