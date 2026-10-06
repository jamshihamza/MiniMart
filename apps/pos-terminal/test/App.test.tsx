import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PosApp } from "../src/App.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

const SEARCH = { name: "Scan barcode or search item" };

describe("POS visual shell: Sale screen", () => {
  it("renders the approved shell regions with an empty fictional cart", async () => {
    render(<PosApp />);
    expect(screen.getByRole("navigation", { name: "POS sections" })).toBeVisible();
    for (const label of ["Sale", "History", "Returns", "Shift"]) {
      expect(screen.getByRole("button", { name: label })).toBeVisible();
    }
    expect(screen.getByRole("heading", { name: "New sale" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", SEARCH)).toBeVisible();
    const cart = screen.getByRole("complementary", { name: "Current sale" });
    expect(within(cart).getByRole("heading", { name: "Current Sale" })).toBeVisible();
    expect(within(cart).getByText("0 items")).toBeVisible();
    expect(within(cart).getByText("Cart is empty")).toBeVisible();
    expect(within(cart).getByText("TOTAL")).toBeVisible();
    // The real MM-006 probe has no native transport in a test, so the status is unavailable.
    expect(await screen.findByText("Store Node · Unavailable")).toBeVisible();
    expect(screen.getByText("Cloud · Not checked")).toBeVisible();
  });

  it("disables checkout controls while the fictional cart is empty", () => {
    render(<PosApp />);
    expect(screen.getByRole("button", { name: /Complete Sale/ })).toBeDisabled();
    for (const method of ["Cash", "Card", "DuitNow", "Other"]) {
      expect(screen.getByRole("button", { name: method, exact: true })).toBeDisabled();
    }
    expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Hold sale/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Discount" })).toBeDisabled();
  });

  it("focuses search with F2", async () => {
    const user = userEvent.setup();
    render(<PosApp />);
    await user.keyboard("{F2}");
    expect(screen.getByRole("searchbox", SEARCH)).toHaveFocus();
  });

  it("filters the fictional product tiles by category as a visual interaction", async () => {
    const user = userEvent.setup();
    render(<PosApp />);
    expect(screen.getByRole("button", { name: /Fresh Milk/ })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /^Beverages/ }));
    expect(screen.getByRole("button", { name: /^Beverages/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByRole("button", { name: /Fresh Milk/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cola/ })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /^All/ }));
    expect(screen.getByRole("button", { name: /Fresh Milk/ })).toBeVisible();
  });

  it("switches between the tile view and the list view", async () => {
    const user = userEvent.setup();
    render(<PosApp />);
    expect(screen.queryByRole("group", { name: "Products, list view" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Grid view" }));
    expect(screen.getByRole("group", { name: "Products, list view" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Grid view" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("disables an out-of-stock fictional tile and keeps other tiles identified as stubs", () => {
    render(<PosApp />);
    expect(screen.getByRole("button", { name: /Laundry Detergent/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Fresh Milk/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

describe("POS visual shell: identified unimplemented actions", () => {
  it("announces that an unimplemented control is not implemented and does nothing else", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PosApp />);
    await user.click(screen.getByRole("button", { name: "Note" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "“Note” is not implemented in this visual-only preview.",
    );
    await user.click(screen.getByRole("button", { name: /Fresh Milk/ }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "“Add Fresh Milk” is not implemented in this visual-only preview.",
    );
    expect(screen.getByText("0 items")).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("marks every unimplemented control as aria-disabled with an explanatory title", () => {
    const { container } = render(<PosApp />);
    const stubs = container.querySelectorAll(".stub");
    expect(stubs.length).toBeGreaterThanOrEqual(15);
    for (const stub of stubs) {
      expect(stub).toHaveAttribute("aria-disabled", "true");
      expect(stub.getAttribute("title")).toContain("Not implemented");
    }
  });

  it("does not turn presentation search into a lookup or cart mutation", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PosApp />);
    await user.type(screen.getByRole("searchbox", SEARCH), "12345{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Item lookup is unavailable");
    expect(screen.getByText("0 items")).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("keeps Escape clearing the search field", async () => {
    const user = userEvent.setup();
    render(<PosApp />);
    const search = screen.getByRole("searchbox", SEARCH);
    await user.type(search, "demo");
    await user.keyboard("{Escape}");
    expect(search).toHaveValue("");
  });
});

describe("POS visual shell: local navigation", () => {
  it("opens the History, Returns and Shift screens and returns to Sale, loading no live data", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PosApp />);
    await user.click(screen.getByRole("button", { name: "History" }));
    expect(screen.getByRole("heading", { name: "Sale History" })).toBeVisible();
    expect(screen.getByRole("button", { name: "History" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Returns" }));
    expect(screen.getByRole("heading", { name: "Returns" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Shift" }));
    expect(screen.getByRole("heading", { name: "Shift" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Sale", exact: true }));
    expect(screen.getByRole("heading", { name: "New sale" })).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("POS visual shell: honest status labels", () => {
  it("labels the whole screen as a fictional visual preview", () => {
    render(<PosApp />);
    expect(screen.getByRole("note")).toHaveTextContent("FICTIONAL VISUAL PREVIEW");
  });

  it("never shows an untested device as connected or ready", () => {
    const { container } = render(<PosApp />);
    const devices = container.querySelector(".devices");
    expect(devices).not.toBeNull();
    for (const name of ["Scanner", "Printer", "Drawer"]) {
      expect(within(devices as HTMLElement).getByText(name)).toBeVisible();
    }
    expect(within(devices as HTMLElement).getAllByText("Not tested")).toHaveLength(3);
    expect(devices).not.toHaveTextContent(/Ready|Connected|Online|Closed/);
  });
});
