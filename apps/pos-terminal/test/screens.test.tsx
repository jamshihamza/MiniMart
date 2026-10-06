import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PosApp } from "../src/App.js";
import { SCREENS } from "../src/screens.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

interface ManifestScreen {
  readonly number: string;
  readonly name: string;
  readonly group: string;
}

/** The approved reference's own screen list. The registry must cover it exactly. */
function manifestScreens(): readonly ManifestScreen[] {
  // Vitest runs from apps/pos-terminal.
  const path = resolve(process.cwd(), "../../docs/design/pos/design-manifest.json");
  const manifest = JSON.parse(readFileSync(path, "utf8")) as { screens: ManifestScreen[] };
  return manifest.screens;
}

describe("reference-screen coverage", () => {
  it("covers every screen of the approved reference exactly once, with its name and group", () => {
    const expected = manifestScreens().map(({ number, name, group }) => ({
      id: number,
      name,
      group,
    }));
    const actual = SCREENS.map(({ id, name, group }) => ({ id, name, group }));
    expect(expected).toHaveLength(31);
    expect(actual).toEqual(expected);
    expect(new Set(actual.map((entry) => entry.id)).size).toBe(31);
  });
});

function open(id: string): void {
  window.history.replaceState({}, "", `/?screen=${id}&inspect=0`);
  render(<PosApp />);
}

/** What each reference screen must show. A missing screen or a wrong preset fails here. */
const SIGNATURES: Record<string, () => void> = {
  "01": () => {
    expect(screen.getByText("Cart is empty")).toBeVisible();
    expect(screen.getByText("0 items")).toBeVisible();
  },
  "02": () => {
    expect(screen.getByText("9 items")).toBeVisible();
    expect(screen.getByRole("list", { name: "Sale lines" })).toBeVisible();
  },
  "02b": () => expect(screen.getByRole("group", { name: "Products, list view" })).toBeVisible(),
  "03": () => expect(screen.getByText("4 results")).toBeVisible(),
  "04": () => expect(screen.getByRole("alert")).toHaveTextContent("No product matches"),
  "05": () => expect(screen.getByRole("dialog", { name: "Select customer" })).toBeVisible(),
  "06": () => expect(screen.getByText(/Member MM-000482/)).toBeVisible(),
  "07": () => expect(screen.getByRole("dialog", { name: "Hold sale" })).toBeVisible(),
  "08": () => {
    expect(screen.getByRole("dialog", { name: "Held sales" })).toBeVisible();
    expect(screen.getByText("H-0007")).toBeVisible();
  },
  "09": () => expect(screen.getByRole("dialog", { name: "Take payment" })).toBeVisible(),
  "10": () => expect(screen.getByRole("dialog", { name: "Cash payment" })).toBeVisible(),
  "11": () => expect(screen.getByText("Waiting for card terminal")).toBeVisible(),
  "12": () => expect(screen.getByText("Card payment not approved")).toBeVisible(),
  "13": () => expect(screen.getByText("Payment result unknown")).toBeVisible(),
  "14": () => expect(screen.getByRole("dialog", { name: "DuitNow QR payment" })).toBeVisible(),
  "15": () => {
    expect(screen.getByRole("dialog", { name: "Payment accepted" })).toBeVisible();
    expect(screen.getByText("Sale completed")).toBeVisible();
  },
  "16": () => expect(screen.getByRole("heading", { name: "Sale History" })).toBeVisible(),
  "17": () => expect(screen.getByRole("complementary", { name: "Sale detail" })).toBeVisible(),
  "18": () => expect(screen.getByText("Find the original sale")).toBeVisible(),
  "19": () => expect(screen.getByText("Return summary")).toBeVisible(),
  "20": () =>
    expect(screen.getByRole("dialog", { name: "Confirm return and refund" })).toBeVisible(),
  "21": () => expect(screen.getByText("REFUND · UNCONFIRMED")).toBeVisible(),
  "22": () => expect(screen.getByText("CURRENT SHIFT")).toBeVisible(),
  "23": () => expect(screen.getByText("Count cash in drawer")).toBeVisible(),
  "24": () =>
    expect(screen.getByRole("dialog", { name: "Manager approval required" })).toBeVisible(),
  "25": () => {
    expect(screen.getByRole("dialog", { name: "Payment accepted" })).toBeVisible();
    expect(screen.getByText("Receipt printer unavailable")).toBeVisible();
  },
  "26": () =>
    expect(screen.getByRole("alertdialog", { name: "Store Node unavailable" })).toBeVisible(),
  "27": () =>
    expect(
      screen
        .getAllByRole("note")
        .some((note) => note.textContent?.includes("Cloud sync unavailable.") === true),
    ).toBe(true),
  "28": () => {
    expect(screen.getByRole("dialog", { name: "Permission required" })).toBeVisible();
    expect(
      screen.getByRole("complementary", { name: "Sale detail", hidden: true }),
    ).toBeInTheDocument();
  },
  "29": () => expect(screen.getByText("Loading products from the Store Node…")).toBeVisible(),
  "30": () => expect(screen.getByText("No sales for this business date")).toBeVisible(),
};

describe("every reference screen renders its approved content", () => {
  it("has a signature for every registered screen", () => {
    expect(Object.keys(SIGNATURES).sort()).toEqual(SCREENS.map((entry) => entry.id).sort());
  });

  it.each(SCREENS.map((entry) => [entry.id, entry.name] as const))("screen %s: %s", (id) => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    open(id);
    SIGNATURES[id]?.();
    expect(fetchSpy).not.toHaveBeenCalled();
    // The single status region is kept on every screen, and the screen stays labelled fictional.
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getAllByRole("note").length).toBeGreaterThan(0);
  });
});
