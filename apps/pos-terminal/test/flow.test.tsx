import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PosApp } from "../src/App.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

function open(id: string): ReturnType<typeof render> {
  window.history.replaceState({}, "", `/?screen=${id}&inspect=0`);
  return render(<PosApp />);
}

const dialog = (name: string) => screen.getByRole("dialog", { name });

describe("visual flow: checkout", () => {
  it("attaches a fictional customer through the customer dialog", async () => {
    const user = userEvent.setup();
    open("02");
    await user.click(screen.getByRole("button", { name: "Select customer" }));
    await user.click(
      within(dialog("Select customer")).getByRole("button", { name: /^AR Aisyah R\./ }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change customer" })).toBeVisible();
    expect(screen.getByText(/Member MM-000482/)).toBeVisible();
  });

  it("holds the sale, showing an empty cart, and recalls a held sale back", async () => {
    const user = userEvent.setup();
    open("02");
    await user.click(screen.getByRole("button", { name: /Hold sale/ }));
    await user.click(within(dialog("Hold sale")).getByRole("button", { name: "Hold sale" }));
    expect(screen.getByText("0 items")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Recall held sale/ }));
    await user.click(within(dialog("Held sales")).getByRole("button", { name: "Recall H-0007" }));
    expect(screen.getByText("9 items")).toBeVisible();
  });

  it("walks cash payment to a completed sale and back to a new empty sale", async () => {
    const user = userEvent.setup();
    open("02");
    await user.click(screen.getByRole("button", { name: /Complete Sale/ }));
    await user.click(within(dialog("Take payment")).getByRole("button", { name: /^Cash/ }));
    const cash = dialog("Cash payment");
    expect(within(cash).getByText("Change due")).toBeVisible();
    await user.click(within(cash).getByRole("button", { name: /Confirm cash payment/ }));
    const done = dialog("Payment accepted");
    expect(within(done).getByText("RM 3.40")).toBeVisible();
    await user.click(within(done).getByRole("button", { name: "New Sale" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("0 items")).toBeVisible();
  });

  it("moves through the three card results and an approved card sale", async () => {
    const user = userEvent.setup();
    open("11");
    const card = () => dialog("Card payment");
    await user.click(within(card()).getByRole("button", { name: "declined" }));
    expect(within(card()).getByText("Card payment not approved")).toBeVisible();
    await user.click(within(card()).getByRole("button", { name: "Try card again" }));
    expect(within(card()).getByText("Waiting for card terminal")).toBeVisible();
    await user.click(within(card()).getByRole("button", { name: "no response" }));
    expect(within(card()).getByRole("note")).toHaveTextContent("Don't charge the customer again");
    await user.click(within(card()).getByRole("button", { name: "approved" }));
    expect(within(dialog("Payment accepted")).getByText("Card •••• 4821 · approved")).toBeVisible();
  });

  it("completes a DuitNow QR payment from the QR dialog", async () => {
    const user = userEvent.setup();
    open("14");
    await user.click(
      within(dialog("DuitNow QR payment")).getByRole("button", { name: /Check status/ }),
    );
    expect(within(dialog("Payment accepted")).getByText("DuitNow QR · DN-8841233")).toBeVisible();
  });

  it("does not claim the printer printed a receipt, and never calls a device ready", () => {
    open("15");
    expect(screen.getByText(/Printing is not implemented\./)).toBeVisible();
    expect(screen.queryByText(/Printer POS-01-P1|Receipt printed/)).not.toBeInTheDocument();
    cleanup();
    open("09");
    const text = dialog("Take payment").textContent ?? "";
    expect(text).not.toMatch(/Drawer ready|Terminal T-01 ready|Provider connected/);
    expect(text).toMatch(/not tested|not connected/);
  });
});

describe("visual flow: dialog accessibility", () => {
  it("closes on Escape and returns focus to the control that opened it", async () => {
    const user = userEvent.setup();
    open("02");
    const opener = screen.getByRole("button", { name: /Hold sale/ });
    await user.click(opener);
    expect(dialog("Hold sale")).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("moves focus into the dialog and traps Tab inside it", async () => {
    const user = userEvent.setup();
    open("02");
    await user.click(screen.getByRole("button", { name: /Hold sale/ }));
    const hold = dialog("Hold sale");
    // The dialog itself takes focus, then Tab reaches the first control.
    expect(hold).toHaveFocus();
    await user.tab();
    expect(within(hold).getByRole("button", { name: "Close" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(within(hold).getByRole("button", { name: "Hold sale" })).toHaveFocus();
    await user.tab();
    expect(within(hold).getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("puts focus on the primary action when a dialog marks one", () => {
    open("15");
    expect(
      within(dialog("Payment accepted")).getByRole("button", { name: "New Sale" }),
    ).toHaveFocus();
  });

  it("makes the page behind an open dialog inert", () => {
    const { container } = open("05");
    expect(container.querySelector(".sidebar")).toHaveAttribute("inert");
    expect(container.querySelector(".pos-main")).toHaveAttribute("inert");
    expect(dialog("Select customer")).toHaveAttribute("aria-modal", "true");
  });
});

describe("visual flow: history, returns and shift", () => {
  it("opens a sale detail and walks Start Return to the manager approval dialog", async () => {
    const user = userEvent.setup();
    open("16");
    await user.click(screen.getByRole("button", { name: "Open sale POS01-000139" }));
    const detail = screen.getByRole("complementary", { name: "Sale detail" });
    expect(within(detail).getByText("RM 32.40", { selector: ".detail__grandval" })).toBeVisible();
    await user.click(within(detail).getByRole("button", { name: "Start Return" }));
    await user.click(
      within(dialog("Permission required")).getByRole("button", {
        name: /Request manager approval/,
      }),
    );
    expect(dialog("Manager approval required")).toBeVisible();
    await user.click(
      within(dialog("Manager approval required")).getByRole("button", { name: "Cancel" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(within(detail).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("complementary", { name: "Sale detail" })).not.toBeInTheDocument();
  });

  it("walks the return from locating the sale to an unconfirmed refund and Done", async () => {
    const user = userEvent.setup();
    open("18");
    await user.click(screen.getByRole("button", { name: "Select POS01-000141" }));
    expect(screen.getByText("Return summary")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Review return" }));
    await user.click(
      within(dialog("Confirm return and refund")).getByRole("button", {
        name: "Confirm return · Refund RM 15.40",
      }),
    );
    expect(screen.getByText("REFUND · UNCONFIRMED")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getByRole("heading", { name: "New sale" })).toBeInTheDocument();
  });

  it("moves between the open shift and the close-shift count", async () => {
    const user = userEvent.setup();
    open("22");
    await user.click(screen.getByRole("button", { name: "Close shift" }));
    expect(screen.getByText("Count cash in drawer")).toBeVisible();
    expect(screen.getByText("−RM 2.00")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("CURRENT SHIFT")).toBeVisible();
  });

  it("identifies the actions that stay unimplemented in these screens", async () => {
    const user = userEvent.setup();
    open("22");
    await user.click(screen.getByRole("button", { name: "Cash in" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "“Cash in” is not implemented in this visual-only preview.",
    );
  });
});
