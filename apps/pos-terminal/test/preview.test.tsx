import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PosApp } from "../src/App.js";
import { DEFAULT_PREVIEW, previewHref, readPreview } from "../src/preview.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

function openPreview(query: string): void {
  window.history.replaceState({}, "", `/${query}`);
}

describe("preview state parsing", () => {
  it("defaults to the empty cart, the tile view and the real Store Node status", () => {
    expect(readPreview("")).toEqual(DEFAULT_PREVIEW);
    expect(readPreview("?cart=nonsense&view=wide&node=maybe")).toEqual(DEFAULT_PREVIEW);
  });

  it("reads every supported parameter", () => {
    expect(
      readPreview("?cart=populated&view=grid&node=offline&sync=down&loading=1&inspect=0"),
    ).toMatchObject({
      cart: "populated",
      view: "grid",
      node: "offline",
      sync: "down",
      loading: true,
      inspect: false,
      screenId: null,
    });
  });

  it("selects a reference screen and lets single parameters override it", () => {
    expect(readPreview("?screen=17")).toMatchObject({
      screenId: "17",
      page: "history",
      detail: true,
      cart: "populated",
    });
    expect(readPreview("?screen=01&cart=populated")).toMatchObject({
      screenId: "01",
      cart: "populated",
    });
    expect(readPreview("?screen=nope").screenId).toBeNull();
  });

  it("builds links that read back to the same state", () => {
    const state = { cart: "populated", view: "grid", sync: "down" } as const;
    expect(readPreview(previewHref(state))).toMatchObject(state);
    expect(previewHref({})).toBe("?");
  });
});

describe("preview states are fixtures only", () => {
  it("shows the fixed fictional totals of the populated cart without calculating them", () => {
    openPreview("?cart=populated");
    render(<PosApp />);
    const cart = screen.getByRole("complementary", { name: "Current sale" });
    expect(within(cart).getByText("9 items")).toBeVisible();
    expect(within(cart).getAllByRole("listitem")).toHaveLength(6);
    for (const amount of ["RM 48.60", "−RM 2.00", "RM 46.60"]) {
      expect(within(cart).getAllByText(amount).length).toBeGreaterThan(0);
    }
    expect(
      within(cart).getByRole("button", {
        name: "3-in-1 White Coffee 20 × 36 g RM 12.90 each · Beverages",
      }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("lets a person select another line visually without changing any amount", async () => {
    const user = userEvent.setup();
    openPreview("?cart=populated");
    render(<PosApp />);
    const cart = screen.getByRole("complementary", { name: "Current sale" });
    await user.click(within(cart).getByRole("button", { name: /Cola 1.5 L/ }));
    expect(within(cart).getByRole("button", { name: /Cola 1.5 L/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(cart).getAllByText("RM 46.60").length).toBeGreaterThan(0);
  });

  it("does not let a quantity or checkout control change the fictional cart", async () => {
    const user = userEvent.setup();
    openPreview("?cart=populated");
    render(<PosApp />);
    const cart = screen.getByRole("complementary", { name: "Current sale" });
    await user.click(
      within(cart).getAllByRole("button", { name: "Increase quantity" })[0] as HTMLElement,
    );
    await user.click(within(cart).getByRole("button", { name: /Complete Sale/ }));
    expect(screen.getByRole("status")).toHaveTextContent("is not implemented");
    expect(within(cart).getByText("9 items")).toBeVisible();
    expect(within(cart).getAllByText("RM 46.60").length).toBeGreaterThan(0);
  });

  it("simulates the Store Node offline state only on request and locks the other sections", () => {
    openPreview("?cart=populated&node=offline");
    render(<PosApp />);
    expect(screen.getByRole("alertdialog", { name: "Store Node unavailable" })).toBeVisible();
    expect(screen.getByText("Store Node offline")).toHaveAttribute(
      "title",
      "Simulated for visual preview",
    );
    expect(screen.getByRole("button", { name: "History" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Complete Sale/ })).toBeDisabled();
  });

  it("shows the cloud sync banner as a note, keeping a single status region", () => {
    openPreview("?sync=down");
    render(<PosApp />);
    const banner = screen
      .getAllByRole("note")
      .find((note) => note.textContent?.includes("Cloud sync unavailable.") === true);
    expect(banner).toBeDefined();
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("shows the loading state with the search field disabled", () => {
    openPreview("?loading=1");
    render(<PosApp />);
    expect(screen.getByText("Loading products from the Store Node…")).toBeVisible();
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toBeDisabled();
  });

  it("labels the data as fictional and can hide the preview control", async () => {
    const user = userEvent.setup();
    render(<PosApp />);
    const toggle = screen.getByRole("button", { name: /Fictional data/ });
    await user.click(toggle);
    const panel = screen.getByRole("navigation", { name: "Preview states" });
    expect(panel).toHaveTextContent("NOT PRODUCT UI");
    expect(within(panel).getByRole("link", { name: /^02 Sale — populated cart/ })).toHaveAttribute(
      "href",
      "?screen=02",
    );
    cleanup();
    openPreview("?inspect=0");
    render(<PosApp />);
    expect(screen.queryByRole("button", { name: /Fictional data/ })).not.toBeInTheDocument();
  });
});
