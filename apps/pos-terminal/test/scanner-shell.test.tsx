import "@testing-library/jest-dom/vitest";
import { cleanup, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PosApp } from "../src/App.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

let clock = 10_000;

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

/** A wedge scan: characters at `gapMs`, then Enter. Returns the Enter event. */
function scan(target: Element | Window, value: string, gapMs = 5): KeyboardEvent {
  for (const character of value) {
    press(target, character, clock);
    clock += gapMs;
  }
  const terminator = press(target, "Enter", clock);
  clock += 400; // pause before the next scan
  return terminator;
}

function status() {
  return screen.getByRole("status");
}

describe("MM-008 scanner input in the POS shell", () => {
  it("captures a scan with focus on the page, as untrusted text, without a lookup", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PosApp />);
    const terminator = scan(document.body, "5901234123457");
    expect(status()).toHaveTextContent("Scan captured (13 characters, untrusted keyboard text)");
    expect(status()).toHaveTextContent("Nothing was added to a sale");
    expect(status()).toHaveTextContent("Scans captured this session: 1.");
    expect(terminator.defaultPrevented).toBe(true);
    expect(screen.getByText("0 items")).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("counts a burst of repeated scans one by one", () => {
    render(<PosApp />);
    for (let i = 0; i < 12; i += 1) scan(document.body, "036000291452", 4);
    expect(status()).toHaveTextContent("Scans captured this session: 12.");
  });

  it("does not let a function key inside a scan trigger the F2 shortcut", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    expect(search).not.toHaveFocus();
    press(document.body, "1", clock);
    press(document.body, "2", clock + 4);
    const f2 = press(document.body, "F2", clock + 8);
    expect(f2.defaultPrevented).toBe(true);
    expect(search).not.toHaveFocus();
    press(document.body, "3", clock + 12);
    press(document.body, "4", clock + 16);
    press(document.body, "Enter", clock + 20);
    clock += 500;
    expect(status()).toHaveTextContent("Scan rejected: input contained a shortcut or control key");
  });

  it("still accepts the next scan after a rejected one", () => {
    render(<PosApp />);
    press(document.body, "1", clock);
    press(document.body, "2", clock + 4);
    press(document.body, "F8", clock + 8);
    press(document.body, "Enter", clock + 12);
    clock += 500;
    expect(status()).toHaveTextContent("Scan rejected");
    scan(document.body, "96385074");
    expect(status()).toHaveTextContent("Scan captured (8 characters");
  });

  it("keeps F2 working for a person pressing it on their own", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    press(document.body, "F2", clock);
    clock += 500;
    expect(search).toHaveFocus();
  });

  it("clears characters that reached the search field and does not also run a search", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    search.focus();
    let typed = "";
    for (const character of "5901234123457") {
      press(search, character, clock);
      typed += character;
      fireEvent.change(search, { target: { value: typed } });
      clock += 5;
    }
    expect(search).toHaveValue("5901234123457");
    const terminator = press(search, "Enter", clock);
    clock += 400;
    expect(terminator.defaultPrevented).toBe(true);
    expect(search).toHaveValue("");
    expect(status()).toHaveTextContent("Scan captured (13 characters");
    expect(status().textContent).toMatch(/^Scan captured/);
  });

  it("leaves slow manual typing to the search field", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    search.focus();
    let typed = "";
    for (const character of "milk123") {
      press(search, character, clock);
      typed += character;
      fireEvent.change(search, { target: { value: typed } });
      clock += 160;
    }
    const enter = press(search, "Enter", clock);
    clock += 400;
    expect(enter.defaultPrevented).toBe(false);
    expect(search).toHaveValue("milk123");
    expect(status()).not.toHaveTextContent("Scan captured");
  });

  it("ignores scans when the sale page is not showing", () => {
    render(<PosApp />);
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    scan(document.body, "5901234123457");
    expect(status()).not.toHaveTextContent("Scan captured");
  });

  it("keeps Escape clearing the search field during and after typing", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    fireEvent.change(search, { target: { value: "abc" } });
    press(search, "Escape", clock);
    clock += 500;
    expect(search).toHaveValue("");
  });
});

describe("MM-008 review: isolation from other input", () => {
  function typeInto(search: HTMLElement, text: string, gapMs: number): void {
    let typed = (search as HTMLInputElement).value;
    for (const character of text) {
      press(search, character, clock);
      typed += character;
      fireEvent.change(search, { target: { value: typed } });
      clock += gapMs;
    }
  }

  it("keeps text the person already typed when a scan lands in the search field", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    search.focus();
    typeInto(search, "milk", 150);
    clock += 400;
    typeInto(search, "5901234123457", 5);
    expect(search).toHaveValue("milk5901234123457");
    press(search, "Enter", clock);
    clock += 400;
    expect(search).toHaveValue("milk");
    expect(status().textContent).toMatch(/^Scan captured/);
  });

  it("leaves the search text alone when the scan happens with focus elsewhere", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    fireEvent.change(search, { target: { value: "bread" } });
    scan(document.body, "5901234123457");
    expect(search).toHaveValue("bread");
    expect(status().textContent).toMatch(/^Scan captured/);
  });

  it.each([
    ["a textarea", () => document.createElement("textarea")],
    ["a text input", () => document.createElement("input")],
    [
      "a contenteditable element",
      () => {
        const element = document.createElement("div");
        element.setAttribute("contenteditable", "true");
        return element;
      },
    ],
  ])("never claims input typed into %s", (_name, make) => {
    render(<PosApp />);
    const field = make();
    document.body.append(field);
    const terminator = scan(field, "5901234123457");
    expect(terminator.defaultPrevented).toBe(false);
    expect(status().textContent).not.toMatch(/Scan captured/);
    field.remove();
  });

  it("drops a half-finished scan when focus moves into another editable control", () => {
    render(<PosApp />);
    const note = document.createElement("textarea");
    document.body.append(note);
    press(document.body, "5", clock);
    press(document.body, "9", clock + 4);
    press(document.body, "0", clock + 8);
    press(note, "1", clock + 12);
    const terminator = press(document.body, "Enter", clock + 16);
    clock += 500;
    expect(terminator.defaultPrevented).toBe(false);
    expect(status().textContent).not.toMatch(/Scan captured/);
    note.remove();
  });

  it("does not suppress a quick F2 after a single key, or Ctrl chords outside a scan", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    press(document.body, "a", clock);
    const f2 = press(document.body, "F2", clock + 20);
    clock += 500;
    expect(f2.defaultPrevented).toBe(true); // the shell's own F2 handler ran
    expect(search).toHaveFocus();
    const ctrlK = press(document.body, "k", clock, { ctrlKey: true });
    clock += 500;
    expect(ctrlK.defaultPrevented).toBe(false);
  });

  it("does not take a pasted value followed by Enter for a scan", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    search.focus();
    press(search, "v", clock, { ctrlKey: true });
    fireEvent.paste(search, { clipboardData: { getData: () => "5901234123457" } });
    fireEvent.change(search, { target: { value: "5901234123457" } });
    const enter = press(search, "Enter", clock + 15);
    clock += 500;
    expect(enter.defaultPrevented).toBe(false);
    expect(search).toHaveValue("5901234123457");
    expect(status().textContent).not.toMatch(/Scan captured/);
  });

  it("ignores IME composition keys in the search field", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    search.focus();
    for (const character of "1234") press(search, character, clock++, { isComposing: true });
    const enter = press(search, "Enter", clock++, { isComposing: true });
    clock += 500;
    expect(enter.defaultPrevented).toBe(false);
    expect(status().textContent).not.toMatch(/Scan captured/);
  });
});

describe("MM-008 review: terminators, focus, pages and cancellation", () => {
  it("accepts Tab as a terminator and keeps focus where it was", () => {
    render(<PosApp />);
    for (const character of "96385074") {
      press(document.body, character, clock);
      clock += 5;
    }
    const tab = press(document.body, "Tab", clock);
    clock += 400;
    expect(tab.defaultPrevented).toBe(true);
    expect(status().textContent).toMatch(/^Scan captured \(8 characters/);
  });

  it("does not treat Shift+Tab as a terminator", () => {
    render(<PosApp />);
    for (const character of "96385074") {
      press(document.body, character, clock);
      clock += 5;
    }
    const shiftTab = press(document.body, "Tab", clock, { shiftKey: true });
    clock += 400;
    expect(shiftTab.defaultPrevented).toBe(false);
    expect(status().textContent).not.toMatch(/Scan captured/);
  });

  it("stops a terminator from activating a focused button", () => {
    render(<PosApp />);
    const search = screen.getByRole("button", { name: "Search" });
    search.focus();
    for (const character of "96385074") {
      press(search, character, clock);
      clock += 5;
    }
    const enter = press(search, "Enter", clock);
    clock += 400;
    expect(enter.defaultPrevented).toBe(true);
  });

  it("does not resume a half-finished scan after leaving and returning to the Sale page", () => {
    render(<PosApp />);
    press(document.body, "9", clock);
    press(document.body, "6", clock + 4);
    press(document.body, "3", clock + 8);
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    fireEvent.click(screen.getByRole("button", { name: "Back to sale" }));
    press(document.body, "8", clock + 12);
    const enter = press(document.body, "Enter", clock + 16);
    clock += 500;
    expect(enter.defaultPrevented).toBe(false);
    expect(status().textContent).not.toMatch(/Scan captured/);
  });

  it("forgets a half-finished scan when the window loses focus", () => {
    render(<PosApp />);
    press(document.body, "9", clock);
    press(document.body, "6", clock + 4);
    press(document.body, "3", clock + 8);
    fireEvent.blur(window);
    press(document.body, "8", clock + 12);
    press(document.body, "5", clock + 14);
    const enter = press(document.body, "Enter", clock + 16);
    clock += 500;
    expect(enter.defaultPrevented).toBe(false);
    expect(status().textContent).not.toMatch(/Scan captured/);
  });

  it("recovers after Escape cancels a scan in progress", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    press(document.body, "9", clock);
    press(document.body, "6", clock + 4);
    const escape = press(document.body, "Escape", clock + 8);
    clock += 500;
    expect(escape.defaultPrevented).toBe(false);
    scan(document.body, "96385074");
    expect(status().textContent).toMatch(/^Scan captured \(8 characters/);
    expect(search).toHaveValue("");
  });

  it("shows a rejection without changing text the person typed", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    fireEvent.change(search, { target: { value: "tea" } });
    press(document.body, "1", clock);
    press(document.body, "2", clock + 4);
    press(document.body, "F4", clock + 8);
    press(document.body, "Enter", clock + 12);
    clock += 500;
    expect(status().textContent).toMatch(/^Scan rejected/);
    expect(search).toHaveValue("tea");
  });
});

describe("MM-008 review: Space inside a scan with a button focused", () => {
  function release(target: Element, keyName: string): KeyboardEvent {
    const event = createEvent.keyUp(target, { key: keyName, bubbles: true, cancelable: true });
    fireEvent(target, event);
    return event;
  }

  // These checks prove only that the shell cancels the key events. Whether the browser then
  // skips the button click was verified separately in a real Chrome and is recorded in
  // docs/phase-0/mm-008-scanner-spike.md; jsdom does not run default actions.
  it("cancels a Space that follows scan keys, on key down and key up", () => {
    render(<PosApp />);
    const button = screen.getByRole("button", { name: "History" });
    button.focus();
    press(button, "A", clock);
    press(button, "B", clock + 4);
    const down = press(button, " ", clock + 8);
    const up = release(button, " ");
    expect(down.defaultPrevented).toBe(true);
    expect(up.defaultPrevented).toBe(true);
    clock += 500;
  });

  it("does not cancel a Space pressed on its own, so keyboard users can still press a button", () => {
    render(<PosApp />);
    const button = screen.getByRole("button", { name: "History" });
    button.focus();
    const down = press(button, " ", clock);
    const up = release(button, " ");
    clock += 500;
    expect(down.defaultPrevented).toBe(false);
    expect(up.defaultPrevented).toBe(false);
  });

  it("does not cancel a Space that arrives long after the last key", () => {
    render(<PosApp />);
    const button = screen.getByRole("button", { name: "History" });
    button.focus();
    press(button, "a", clock);
    const down = press(button, " ", clock + 400);
    clock += 900;
    expect(down.defaultPrevented).toBe(false);
  });

  it("never cancels Space typed into the search field", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    search.focus();
    press(search, "a", clock);
    const down = press(search, " ", clock + 5);
    clock += 500;
    expect(down.defaultPrevented).toBe(false);
  });

  // Supported capture context: focus in the barcode field or on a target with no default
  // action for Space. A scan that starts with a Space is captured whole there and nothing can
  // be activated. Real Chrome confirmed the same cases (see the spike document).
  it("captures a scan that starts with a Space when the barcode field has focus", () => {
    render(<PosApp />);
    const search = screen.getByRole("searchbox", { name: "Scan barcode or search item" });
    search.focus();
    fireEvent.change(search, { target: { value: "tea" } });
    scan(search, " 12345678");
    expect(status()).toHaveTextContent("Scan captured (9 characters, untrusted keyboard text)");
    expect(search).toHaveValue("tea");
    expect(screen.getByRole("heading", { name: "New sale" })).toBeVisible();
  });

  it("captures a scan that starts with a Space when no control has focus", () => {
    render(<PosApp />);
    scan(document.body, " 12345678");
    expect(status()).toHaveTextContent("Scan captured (9 characters, untrusted keyboard text)");
  });

  it("states the unsupported mode: a Space that starts a scan on a focused button is not recognized", () => {
    render(<PosApp />);
    const button = screen.getByRole("button", { name: "History" });
    button.focus();
    const leading = press(button, " ", clock);
    clock += 500;
    expect(leading.defaultPrevented).toBe(false);
  });
});
