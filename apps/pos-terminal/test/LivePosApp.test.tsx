import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiUnreachable, type StoreApi } from "../src/live/api.js";
import { LivePosApp } from "../src/live/LivePosApp.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const counter = { counterId: "c-1", counterCode: "POS01", displayName: "Counter 1" };
const openShift = {
  shiftId: "s-1",
  counterCode: "POS01",
  cashier: "demo.cashier",
  businessDate: "2026-11-14",
  status: "OPEN",
  openingCash: "200.00",
  expectedCash: "200.00",
  countedCash: null,
  variance: null,
  openedAt: "2026-11-14T01:00:00.000Z",
  closedAt: null,
};
const receipt = {
  saleId: "sale-1",
  documentNo: "POS01-000001",
  businessDate: "2026-11-14",
  postedAt: "2026-11-14T01:05:00.000Z",
  store: { displayName: "MiniMart Central", counterCode: "POS01" },
  lines: [
    { lineNo: 1, itemName: "Cola 320ml", quantity: "1", unitPrice: "2.50", lineTotal: "2.50" },
  ],
  subtotal: "2.50",
  taxTotal: "0.00",
  grandTotal: "2.50",
  tenders: [{ methodCode: "CASH", amount: "2.50", reference: null }],
};

function fakeApi(shift: typeof openShift | null): StoreApi {
  return {
    health: vi.fn(async () => ({ status: "UP" })),
    context: vi.fn(async () => ({
      store: { storeCode: "S01", displayName: "MiniMart Central", currencyCode: "MYR" },
      counters: [counter],
      operator: "demo.cashier",
      counter,
      businessDay: shift === null ? null : { businessDayId: "d-1", businessDate: "2026-11-14" },
      calendarDate: "2026-11-14",
      shift,
    })),
    items: vi.fn(async () => ({
      items: [
        {
          itemId: "i-1",
          itemCode: "MM-00101",
          name: "Cola 320ml",
          categoryName: "Beverages",
          uomCode: "EACH",
          barcode: "9556001000011",
          sellingPrice: "2.50",
          onHand: "48",
        },
      ],
    })),
    quote: vi.fn(async (_lines, tenders) => ({
      lines: [
        {
          itemId: "i-1",
          itemName: "Cola 320ml",
          quantity: "1",
          unitPrice: "2.50",
          lineTotal: "2.50",
        },
      ],
      itemCount: "1",
      subtotal: "2.50",
      discountTotal: "0.00",
      taxTotal: "0.00",
      grandTotal: "2.50",
      payment:
        tenders.length === 0
          ? { remaining: "2.50", changeDue: "0.00", settled: false }
          : { remaining: "0.00", changeDue: "7.50", settled: true },
    })),
    postSale: vi.fn(async () => ({
      saleId: "sale-1",
      documentNo: "POS01-000001",
      changeDue: "7.50",
      cashTendered: "10.00",
      receipt,
    })),
    sales: vi.fn(async () => ({ sales: [] })),
    receipt: vi.fn(async () => receipt),
    shift: vi.fn(async () => ({ ...openShift, cashMovements: [], tenders: [] })),
    openShift: vi.fn(async () => ({ ...openShift, cashMovements: [], tenders: [] })),
    cashMovement: vi.fn(async () => ({ ...openShift, cashMovements: [], tenders: [] })),
    closeShift: vi.fn(async () => ({ ...openShift, cashMovements: [], tenders: [] })),
  };
}

describe("live POS", () => {
  it("blocks payment until a shift is open", async () => {
    render(<LivePosApp api={fakeApi(null)} />);
    expect(await screen.findByText(/No shift is open on POS01/)).toBeVisible();
    expect(screen.getByRole("button", { name: /Complete Sale/ })).toBeDisabled();
  });

  it("posts a cash sale with server-computed totals and shows the receipt", async () => {
    const user = userEvent.setup();
    const api = fakeApi(openShift);
    render(<LivePosApp api={api} />);
    await user.click(await screen.findByRole("button", { name: /Cola 320ml/ }));
    await waitFor(() => expect(api.quote).toHaveBeenCalled());
    await user.type(screen.getByLabelText("Amount Received"), "10");
    const complete = screen.getByRole("button", { name: /Complete Sale/ });
    await waitFor(() => expect(complete).toBeEnabled());
    await user.click(complete);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("POS01-000001");
    expect(dialog).toHaveTextContent("Cash receivedRM 10.00");
    expect(dialog).toHaveTextContent("ChangeRM 7.50");
    expect(api.postSale).toHaveBeenCalledTimes(1);
    expect(api.postSale).toHaveBeenCalledWith(
      expect.any(String),
      "c-1",
      [{ itemId: "i-1", quantity: "1" }],
      [{ methodCode: "CASH", amount: "10" }],
    );
  });

  it("retries an unknown outcome with the same idempotency key", async () => {
    const user = userEvent.setup();
    const api = fakeApi(openShift);
    const post = vi.mocked(api.postSale);
    post.mockRejectedValueOnce(new ApiUnreachable());
    render(<LivePosApp api={api} />);
    await user.click(await screen.findByRole("button", { name: /Cola 320ml/ }));
    await user.type(screen.getByLabelText("Amount Received"), "10");
    const complete = screen.getByRole("button", { name: /Complete Sale/ });
    await waitFor(() => expect(complete).toBeEnabled());
    await user.click(complete);
    await user.click(await screen.findByRole("button", { name: "Retry safely" }));
    expect(await screen.findByRole("dialog")).toBeVisible();
    expect(post).toHaveBeenCalledTimes(2);
    expect(post.mock.calls[1]?.[0]).toBe(post.mock.calls[0]?.[0]);
  });
});
