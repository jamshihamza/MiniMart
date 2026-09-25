import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PosApp } from "../src/App.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("POS shell", () => {
  it("renders the three-zone sale workspace and unavailable Store Node status", async () => {
    render(<PosApp />);
    expect(screen.getByRole("heading", { name: "New sale" })).toBeVisible();
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toBeVisible();
    expect(screen.getByRole("table", { name: "Sale lines" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Customer" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Summary" })).toBeVisible();
    expect(await screen.findByText("Store Node · Unavailable")).toBeVisible();
    expect(screen.getByText("Cloud · Not checked")).toBeVisible();
    expect(screen.getByRole("button", { name: /Continue to payment/ })).toBeDisabled();
  });

  it("focuses search with F2 and leaves business shortcuts unavailable", async () => {
    const user = userEvent.setup();
    render(<PosApp />);
    await user.keyboard("{F2}");
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toHaveFocus();
    expect(screen.getByRole("button", { name: /Hold sale/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Attach/ })).toBeDisabled();
  });

  it("does not turn presentation search into a lookup or cart mutation", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PosApp />);
    await user.type(
      screen.getByRole("searchbox", { name: "Scan barcode or search item" }),
      "12345",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("status")).toHaveTextContent("Item lookup is unavailable");
    expect(screen.getByText("0 items")).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("supports keyboard accessible shell navigation without loading live data", async () => {
    const user = userEvent.setup();
    render(<PosApp />);
    await user.click(screen.getByRole("button", { name: "History" }));
    expect(screen.getByRole("heading", { name: "History" })).toBeVisible();
    expect(screen.getByText(/when the Store Node connection/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to sale" }));
    expect(screen.getByRole("heading", { name: "New sale" })).toBeVisible();
  });
});
