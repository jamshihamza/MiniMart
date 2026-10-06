import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WorkspaceHost } from "../../src/host/WorkspaceHost.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function open(search: string, hash: string): void {
  window.history.replaceState(null, "", `/${search}${hash}`);
}

async function goTo(hash: string): Promise<void> {
  window.location.hash = hash;
  await waitFor(() => expect(window.location.hash).toBe(hash));
}

async function chooseWorkspace(name: string): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: /^Workspace:/ }));
  const menu = screen.getByRole("group", { name: "Workspaces, preview only" });
  fireEvent.click(within(menu).getByRole("link", { name }));
}

let clock = 50_000;

function press(
  target: Element | Window,
  keyName: string,
  at: number,
  init: KeyboardEventInit = {},
): KeyboardEvent {
  const event = createEvent.keyDown(target, {
    key: keyName,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  Object.defineProperty(event, "timeStamp", { value: at });
  fireEvent(target, event);
  return event;
}

function posStatus() {
  return screen.getByRole("status");
}

describe("workspace host routes and deep links", () => {
  it("lands on POS and replaces the empty hash instead of pushing a new entry", async () => {
    open("", "");
    render(<WorkspaceHost />);
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toBeVisible();
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    expect(screen.queryByRole("heading", { name: "Back Office workspace" })).toBeNull();
  });

  it("opens a Back Office deep link without mounting POS", () => {
    open("", "#/back-office/reports");
    render(<WorkspaceHost />);
    expect(screen.getByRole("heading", { name: "Back Office workspace" })).toBeVisible();
    expect(screen.getByText(/No Back Office screen exists at/)).toBeVisible();
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(window.location.hash).toBe("#/back-office/reports");
  });

  it("shows a not-found page for unknown workspaces and for POS sub-routes", async () => {
    open("", "#/cloud");
    render(<WorkspaceHost />);
    expect(screen.getByRole("heading", { name: "Route not found" })).toBeVisible();
    await goTo("#/pos/history");
    expect(screen.getByText(/The POS workspace has no sub-routes/)).toBeVisible();
    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("reacts to hash changes made outside the menu, such as browser Back and Forward", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    await goTo("#/back-office");
    expect(screen.getByRole("heading", { name: "Back Office workspace" })).toBeVisible();
    await goTo("#/pos");
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toBeVisible();
  });
});

describe("workspace switch", () => {
  it("lives outside the POS navigation, is labelled preview only and adds no landmark", () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    const nav = screen.getByRole("navigation");
    expect(within(nav).queryByText(/workspace|back office/i)).toBeNull();
    for (const name of ["Sale", "History", "Returns", "Shift"]) {
      expect(within(nav).getByRole("button", { name: new RegExp(name) })).toBeVisible();
    }
    const trigger = screen.getByRole("button", { name: /^Workspace: POS/ });
    expect(nav.contains(trigger)).toBe(false);
    expect(trigger).toHaveTextContent("Preview only");
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("sits in a labelled host header above the workspace, at its right, outside both workspaces", () => {
    open("", "#/pos");
    const { container } = render(<WorkspaceHost />);
    const header = container.querySelector(".ws-header");
    expect(header).not.toBeNull();
    expect(header).toHaveTextContent("preview host");
    const trigger = screen.getByRole("button", { name: /^Workspace: POS/ });
    expect(header?.contains(trigger)).toBe(true);
    // The trigger is the last child of the header, which lays it out at the right edge.
    expect(header?.lastElementChild?.contains(trigger)).toBe(true);
    const frame = container.querySelector(".ws-frame");
    expect(frame).toHaveClass("ws-frame--header");
    // The header comes first in the document, the workspace after it, and neither contains the other.
    expect(frame?.firstElementChild).toBe(header);
    const body = container.querySelector(".ws-body");
    expect(body?.contains(trigger)).toBe(false);
    expect(body?.querySelector(".pos-app")).not.toBeNull();
    expect(header?.compareDocumentPosition(body as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("adds no header and no height rule when the switch is hidden", () => {
    open("?inspect=0", "#/pos");
    const { container } = render(<WorkspaceHost />);
    expect(container.querySelector(".ws-header")).toBeNull();
    expect(container.querySelector(".ws-frame")).not.toHaveClass("ws-frame--header");
    cleanup();
    open("?workspaces=back-office", "#/back-office");
    const second = render(<WorkspaceHost />);
    expect(second.container.querySelector(".ws-header")).toBeNull();
  });

  it("switches POS to Back Office and back, moving focus into the new workspace", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    await chooseWorkspace("Back Office");
    await waitFor(() => expect(window.location.hash).toBe("#/back-office"));
    expect(screen.getByRole("heading", { name: "Back Office workspace" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Back Office navigation" })).toBeVisible();
    expect(screen.queryByRole("searchbox")).toBeNull();
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toBeVisible();
  });

  it("closes with Escape and returns focus to its button", () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    const trigger = screen.getByRole("button", { name: /^Workspace:/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("group", { name: "Workspaces, preview only" })).toBeNull();
  });

  it("is hidden by inspect=0 and when only one workspace is offered", () => {
    open("?inspect=0", "#/pos");
    render(<WorkspaceHost />);
    expect(screen.queryByRole("button", { name: /^Workspace:/ })).toBeNull();
    cleanup();
    open("?workspaces=pos", "#/pos");
    render(<WorkspaceHost />);
    expect(screen.queryByRole("button", { name: /^Workspace:/ })).toBeNull();
  });
});

describe("preview-only availability", () => {
  it("opens only Back Office when POS is not offered, and says so for the POS route", async () => {
    open("?workspaces=back-office", "");
    render(<WorkspaceHost />);
    await waitFor(() => expect(window.location.hash).toBe("#/back-office"));
    expect(screen.getByRole("heading", { name: "Back Office workspace" })).toBeVisible();
    await goTo("#/pos");
    expect(screen.getByRole("heading", { name: "Workspace not available" })).toBeVisible();
    expect(screen.getByText(/grants or removes no access/)).toBeVisible();
    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("says a Back Office route is not available when only POS is offered", () => {
    open("?workspaces=pos", "#/back-office");
    render(<WorkspaceHost />);
    expect(screen.getByRole("heading", { name: "Workspace not available" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Back Office workspace" })).toBeNull();
  });
});

describe("POS preview state across a workspace switch", () => {
  it("restores the History page and its open detail, and the Sale search text", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    fireEvent.change(search, { target: { value: "milk" } });
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    expect(screen.queryByRole("searchbox")).toBeNull();
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    // History page is back, not the Sale page the URL preview would start on.
    expect(screen.queryByRole("searchbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Sale", exact: true }));
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toHaveValue(
      "milk",
    );
  });

  it("keeps a populated cart fixture, and keeps it cleared once the person cleared it", async () => {
    open("?cart=populated", "#/pos");
    render(<WorkspaceHost />);
    expect(screen.queryByText("0 items")).toBeNull();
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    expect(screen.queryByText("0 items")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Clear/ }));
    expect(screen.getByText("0 items")).toBeVisible();
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    expect(screen.getByText("0 items")).toBeVisible();
  });

  it("does not carry status messages or the scan count back", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    for (const character of "5901234123457") {
      press(document.body, character, clock);
      clock += 5;
    }
    press(document.body, "Enter", clock);
    clock += 500;
    expect(posStatus()).toHaveTextContent("Scans captured this session: 1.");
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    expect(posStatus().textContent).not.toMatch(/Scans captured/);
  });
});

describe("scanner and shortcut isolation between workspaces", () => {
  it("drops a half-finished scan when switching away and does not resume it on return", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    press(document.body, "9", clock);
    press(document.body, "6", clock + 4);
    press(document.body, "3", clock + 8);
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    press(document.body, "8", clock + 12);
    const enter = press(document.body, "Enter", clock + 16);
    clock += 500;
    expect(enter.defaultPrevented).toBe(false);
    expect(posStatus().textContent).not.toMatch(/Scan captured/);
  });

  it("still captures a complete scan after returning to POS", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    for (const character of "5901234123457") {
      press(document.body, character, clock);
      clock += 5;
    }
    const enter = press(document.body, "Enter", clock);
    clock += 500;
    expect(enter.defaultPrevented).toBe(true);
    expect(posStatus()).toHaveTextContent("Scan captured (13 characters, untrusted keyboard text)");
  });

  it("registers no scanner capture or POS shortcut in Back Office", () => {
    open("", "#/back-office");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    render(<WorkspaceHost />);
    let last: KeyboardEvent | undefined;
    for (const character of "5901234123457") {
      last = press(document.body, character, clock);
      clock += 5;
      expect(last.defaultPrevented).toBe(false);
    }
    const enter = press(document.body, "Enter", clock);
    clock += 500;
    expect(enter.defaultPrevented).toBe(false);
    const f2 = press(document.body, "F2", clock);
    clock += 500;
    expect(f2.defaultPrevented).toBe(false);
    expect(
      document.activeElement === document.body || document.activeElement?.tagName === "MAIN",
    ).toBe(true);
    expect(screen.getByRole("status").textContent).toBe("");
    expect(screen.queryByText(/Scan captured/)).toBeNull();
    removeSpy.mockRestore();
  });

  it("runs the Back Office Ctrl+K stub only inside Back Office, never in POS", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    const inPos = press(document.body, "k", clock, { ctrlKey: true });
    clock += 500;
    expect(inPos.defaultPrevented).toBe(false);
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    const inBackOffice = press(document.body, "k", clock, { ctrlKey: true });
    clock += 500;
    expect(inBackOffice.defaultPrevented).toBe(true);
    expect(screen.getByRole("status")).toHaveTextContent("Command search is not implemented");
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    const backInPos = press(document.body, "k", clock, { ctrlKey: true });
    clock += 500;
    expect(backInPos.defaultPrevented).toBe(false);
  });

  it("keeps the POS F2 shortcut working in POS after a round trip", async () => {
    open("", "#/pos");
    render(<WorkspaceHost />);
    await chooseWorkspace("Back Office");
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Back Office navigation" })).not.toBeNull(),
    );
    await chooseWorkspace("POS");
    await waitFor(() => expect(window.location.hash).toBe("#/pos"));
    const f2 = press(document.body, "F2", clock);
    clock += 500;
    expect(f2.defaultPrevented).toBe(true);
    expect(screen.getByRole("searchbox", { name: "Scan barcode or search item" })).toHaveFocus();
  });

  it("makes no network call while switching", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    open("", "#/pos");
    render(<WorkspaceHost />);
    await chooseWorkspace("Back Office");
    await waitFor(() => expect(window.location.hash).toBe("#/back-office"));
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
