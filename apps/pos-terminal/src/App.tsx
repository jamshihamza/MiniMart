import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  Bell,
  BookText,
  ChartNoAxesColumn,
  Check,
  ChevronDown,
  CircleEllipsis,
  CreditCard,
  Eraser,
  History,
  LayoutDashboard,
  NotebookPen,
  Package,
  Pause,
  RotateCcw,
  ScanBarcode,
  Search,
  Settings,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Store,
  Trash2,
  Truck,
  Undo2,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { KeyHint, ShellButton, StatusBadge } from "./components/ShellControls.js";
import {
  STORE_NODE_STATUS_LABEL,
  interpretStoreNodeStatus,
  type StoreNodeStatus,
} from "./connectivity.js";
import { SHELL_PREVIEW, previewProducts } from "./fixtures.js";
import { ScanCapture, type ScanRejection } from "./scanner-input.js";
import { probeStoreNode } from "./system-status-transport.js";

type ShellPage =
  | "sale"
  | "dashboard"
  | "history"
  | "returns"
  | "inventory"
  | "purchases"
  | "suppliers"
  | "customers"
  | "shift"
  | "reports"
  | "accounting"
  | "settings";

const pages: readonly { id: ShellPage; label: string; icon: LucideIcon }[] = [
  { id: "sale", label: "POS", icon: Store },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "history", label: "History", icon: History },
  { id: "returns", label: "Returns", icon: Undo2 },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "purchases", label: "Purchases", icon: ShoppingCart },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "customers", label: "Customers", icon: Users },
  { id: "shift", label: "Cash & Shift", icon: Wallet },
  { id: "reports", label: "Reports", icon: ChartNoAxesColumn },
  { id: "accounting", label: "Accounting", icon: BookText },
  { id: "settings", label: "Settings", icon: Settings },
];

const deferredPageCopy: Record<Exclude<ShellPage, "sale">, string> = {
  dashboard: "Dashboard data will appear when its Store Node workflow is available.",
  history: "Sale history will appear when the Store Node connection and sale APIs are available.",
  returns: "Returns will appear when the return workflow is implemented.",
  inventory: "Inventory management is not available in this POS shell preview.",
  purchases: "Purchase orders are not available in this POS shell preview.",
  suppliers: "Supplier management is not available in this POS shell preview.",
  customers: "Customer management is not available in this POS shell preview.",
  shift: "Shift actions will appear when cashier session workflows are implemented.",
  reports: "Reports are not available in this POS shell preview.",
  accounting: "Accounting is not available in this POS shell preview.",
  settings: "Settings are not available in this POS shell preview.",
};

const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

/** True for controls where the person types text, which a scan must never take over. */
function isTextEditingElement(element: HTMLElement): boolean {
  if (element.closest('[contenteditable=""], [contenteditable="true"]') !== null) return true;
  if (element.tagName === "TEXTAREA" || element.tagName === "SELECT") return true;
  if (element.tagName === "INPUT") {
    return !NON_TEXT_INPUT_TYPES.has((element as HTMLInputElement).type);
  }
  return element.getAttribute("role") === "textbox";
}

function describeScanRejection(rejection: ScanRejection): string {
  const reasons: Record<ScanRejection["reason"], string> = {
    TOO_LONG: "was too long",
    CONTAMINATED: "contained a shortcut or control key",
    PREFIX_MISMATCH: "did not start with the configured prefix",
    SUFFIX_MISMATCH: "did not end with the configured suffix",
  };
  return `Scan rejected: input ${reasons[rejection.reason]} (${String(rejection.length)} characters). Scan again or search manually. Nothing was added to a sale.`;
}

export function PosApp() {
  const [page, setPage] = useState<ShellPage>("sale");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Shell preview. No transaction data is loaded.");
  const [storeNodeStatus, setStoreNodeStatus] = useState<StoreNodeStatus>("checking");
  const [now, setNow] = useState(() => new Date());
  const searchRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<ScanCapture | null>(null);
  const suppressedShortcutRef = useRef(new WeakSet<KeyboardEvent>());
  // Search text from before the current burst, or null when the burst began outside the field.
  const textBeforeScanRef = useRef<string | null>(null);
  const spaceGuardRef = useRef(false);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function refresh() {
      try {
        const result = interpretStoreNodeStatus(await probeStoreNode());
        if (active) setStoreNodeStatus(result);
      } catch {
        if (active) setStoreNodeStatus("unavailable");
      }
      if (active) timer = setTimeout(() => void refresh(), 5_000);
    }
    void refresh();
    return () => {
      active = false;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (page !== "sale") return undefined;
    scannerRef.current ??= new ScanCapture();
    const scanner = scannerRef.current;
    const suppressed = suppressedShortcutRef.current;
    function ownsKeyboardScan(event: KeyboardEvent): boolean {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return true;
      if (target === searchRef.current) return true;
      return !isTextEditingElement(target);
    }
    function handleScannerKey(event: KeyboardEvent) {
      if (!ownsKeyboardScan(event)) {
        // Another editable control owns this keyboard input; never claim or reinterpret it.
        scanner.reset();
        return;
      }
      const inSearch = event.target === searchRef.current;
      const spaceAfterBurstKey =
        event.key === " " && !inSearch && scanner.bufferedLength(event.timeStamp) >= 1;
      if (spaceAfterBurstKey) {
        // A scanned space must not press a focused button: the click fires on key release.
        event.preventDefault();
        spaceGuardRef.current = true;
      }
      if (event.key.length === 1 && scanner.bufferedLength(event.timeStamp) === 0) {
        // A possible scan begins here. Remember the field text only when it begins in the field.
        textBeforeScanRef.current =
          inSearch && searchRef.current !== null ? searchRef.current.value : null;
      }
      const result = scanner.handleKey({
        key: event.key,
        timeStamp: event.timeStamp,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        repeat: event.repeat,
        isComposing: event.isComposing,
      });
      if (result.suppressShortcuts) suppressed.add(event);
      if (result.preventDefault) event.preventDefault();
      // Scanner characters reached the field before the scan was classified; put back what the
      // person had typed, for valid and for confidently rejected scans. A burst that began
      // elsewhere, and text in other controls, are never touched.
      const classified =
        result.scan !== undefined || (result.rejection !== undefined && result.preventDefault);
      if (classified && inSearch && textBeforeScanRef.current !== null) {
        setQuery(textBeforeScanRef.current);
      }
      if (result.scan !== undefined) {
        setScanCount((count) => count + 1);
        setMessage(
          `Scan captured (${String(result.scan.length)} characters, untrusted keyboard text). Item lookup is unavailable in this shell preview. Nothing was added to a sale.`,
        );
      } else if (result.rejection !== undefined) {
        setMessage(describeScanRejection(result.rejection));
      }
    }
    function handleScannerKeyUp(event: KeyboardEvent) {
      if (event.key === " " && spaceGuardRef.current) {
        event.preventDefault();
        spaceGuardRef.current = false;
      }
    }
    function abandonScan() {
      scanner.reset();
      spaceGuardRef.current = false;
    }
    window.addEventListener("keydown", handleScannerKey, true);
    window.addEventListener("keyup", handleScannerKeyUp, true);
    window.addEventListener("blur", abandonScan);
    document.addEventListener("visibilitychange", abandonScan);
    return () => {
      window.removeEventListener("keydown", handleScannerKey, true);
      window.removeEventListener("keyup", handleScannerKeyUp, true);
      window.removeEventListener("blur", abandonScan);
      document.removeEventListener("visibilitychange", abandonScan);
      scanner.reset();
    };
  }, [page]);

  useEffect(() => {
    function handleShellShortcut(event: KeyboardEvent) {
      if (suppressedShortcutRef.current.has(event)) return;
      if (event.key !== "F2" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
      if (page !== "sale") return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", handleShellShortcut);
    return () => window.removeEventListener("keydown", handleShellShortcut);
  }, [page]);

  function showUnavailableSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Item lookup is unavailable in this shell preview. Nothing was added to a sale.");
  }

  return (
    <div className="pos-shell">
      <a className="skip-link" href="#workspace">
        Skip to workspace
      </a>

      <aside className="sidebar">
        <div className="brand-block" aria-label="MiniMart POS">
          <span className="brand-mark">
            <ShoppingCart aria-hidden="true" />
          </span>
          <div>
            <strong>MiniMart</strong>
            <span className="brand-subtitle">Retail Made Simple</span>
          </div>
        </div>
        <nav className="primary-nav" aria-label="POS sections">
          {pages.map(({ id, label, icon: NavIcon }) => (
            <button
              key={id}
              type="button"
              className={`nav-link${page === id ? " nav-link--active" : ""}`}
              aria-current={page === id ? "page" : undefined}
              onClick={() => {
                setPage(id);
                setMessage(
                  id === "sale"
                    ? "Shell preview. No transaction data is loaded."
                    : `${label} is a preview placeholder.`,
                );
              }}
            >
              <span className="nav-icon" aria-hidden="true">
                <NavIcon size={16} strokeWidth={1.8} />
              </span>
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-operator">
          <span className="operator-avatar" aria-hidden="true">
            DC
          </span>
          <div>
            <strong>{SHELL_PREVIEW.cashier}</strong>
            <span>Demo session</span>
          </div>
        </div>
      </aside>

      <header className="app-header">
        <div className="header-store">
          <button
            type="button"
            disabled
            className="store-selector"
            title="Store switching is not available in this shell"
          >
            Store: {SHELL_PREVIEW.store} <ChevronDown size={13} aria-hidden="true" />
          </button>
          <StatusBadge
            tone={storeNodeStatus === "online" ? "neutral" : "attention"}
            label={STORE_NODE_STATUS_LABEL[storeNodeStatus]}
          />
        </div>
        <div className="header-right">
          <span className="header-clock">
            {new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(
              now,
            )}
          </span>
          <button
            className="header-notification"
            type="button"
            disabled
            aria-label="Notifications unavailable"
            title="Notifications are not available in this shell"
          >
            <Bell aria-hidden="true" />
          </button>
          <span className="header-avatar" aria-label={SHELL_PREVIEW.cashier}>
            DC
          </span>
        </div>
      </header>

      <main id="workspace" className="workspace" tabIndex={-1}>
        {page === "sale" ? (
          <div className="sale-page">
            <div className="page-heading">
              <div>
                <h1>POS - Sales</h1>
                <p>Scan items or search to add to cart</p>
              </div>
              <div className="page-status">
                <span>Shell preview · No live sale</span>
                <StatusBadge label="Cloud · Not checked" />
                <span>Business date · Not loaded</span>
              </div>
            </div>
            <div className="sale-workspace">
              <section className="sale-left" aria-labelledby="sale-heading">
                <h2 id="sale-heading" className="sale-section-title">
                  New sale
                </h2>
                <div className="sale-toolbar">
                  <form className="scan-form" onSubmit={showUnavailableSearch} role="search">
                    <label htmlFor="item-search">Scan barcode or search item</label>
                    <div className="scan-form__row">
                      <span className="barcode-mark" aria-hidden="true">
                        <ScanBarcode size={22} strokeWidth={1.8} />
                      </span>
                      <input
                        ref={searchRef}
                        id="item-search"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Escape" && query !== "") setQuery("");
                        }}
                        placeholder="Scan barcode or search item (F2)"
                        aria-describedby="search-help"
                        autoComplete="off"
                      />
                      <button className="search-submit" type="submit" aria-label="Search">
                        <Search size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <span id="search-help" className="sr-only">
                      Preview input only. Item lookup is not available. Scanner input is captured as
                      untrusted text and never triggers shortcuts.
                    </span>
                  </form>
                  <div className="quick-actions" aria-label="Sale actions">
                    <ShellButton disabled title="Available in a later milestone">
                      <Search size={13} aria-hidden="true" /> Price Check <kbd>F3</kbd>
                    </ShellButton>
                    <ShellButton disabled title="Available in a later milestone">
                      <Pause size={13} aria-hidden="true" /> Hold
                      <span className="sr-only"> sale</span> <kbd>F6</kbd>
                    </ShellButton>
                    <ShellButton disabled title="Available in a later milestone">
                      <RotateCcw size={13} aria-hidden="true" /> Recall
                    </ShellButton>
                    <ShellButton disabled title="Available in a later milestone">
                      <Eraser size={13} aria-hidden="true" /> Clear Cart
                    </ShellButton>
                  </div>
                </div>

                <div className="product-region">
                  <div className="region-heading">
                    <strong>Quick products</strong>
                    <span>Demo catalog · selection unavailable</span>
                  </div>
                  <div className="product-grid">
                    {previewProducts.map((product, index) => (
                      <button
                        type="button"
                        className="product-tile"
                        key={product.name}
                        disabled
                        title="Item lookup is not available in this shell"
                      >
                        <span className={`product-art product-art--${index}`} aria-hidden="true" />
                        <strong>{product.name}</strong>
                        <span>{product.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cart-region" aria-labelledby="cart-heading">
                  <div className="cart-toolbar">
                    <h2 id="cart-heading">Cart</h2>
                    <span>0 items</span>
                    <span className="cart-toolbar__hint">No active sale</span>
                    <button
                      className="cart-remove"
                      type="button"
                      disabled
                      aria-label="Remove item unavailable"
                      title="No item to remove"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="cart-table" role="table" aria-label="Sale lines">
                    <div className="cart-table__head" role="row">
                      <span role="columnheader">#</span>
                      <span role="columnheader">Item</span>
                      <span role="columnheader">Qty</span>
                      <span role="columnheader">Unit Price</span>
                      <span role="columnheader">Discount</span>
                      <span role="columnheader">Total</span>
                    </div>
                    <div className="cart-empty" role="row">
                      <span>
                        <ShoppingBasket size={19} strokeWidth={1.7} aria-hidden="true" />
                        No items added. Scan or search when item lookup is available.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sale-bottom">
                  <div className="customer-field">
                    <h2>
                      Customer <span aria-hidden="true">(F4)</span>
                    </h2>
                    <ShellButton disabled title="Available in a later milestone">
                      <UserRound size={14} aria-hidden="true" /> Walk-in Customer
                    </ShellButton>
                    <span className="customer-attach">
                      <ShellButton variant="quiet" disabled title="Available in a later milestone">
                        Attach <kbd>F4</kbd>
                      </ShellButton>
                    </span>
                  </div>
                  <div className="notes-field">
                    <label htmlFor="sale-notes">
                      <NotebookPen size={12} aria-hidden="true" /> Notes
                    </label>
                    <textarea
                      id="sale-notes"
                      placeholder="Notes become available with an active sale"
                      disabled
                    />
                  </div>
                </div>
              </section>

              <aside className="sale-right" aria-label="Sale summary">
                <div className="summary-header">
                  <h2>Summary</h2>
                  <span>0 total items</span>
                </div>
                <dl className="total-lines">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>—</dd>
                  </div>
                  <div>
                    <dt>Discount</dt>
                    <dd>—</dd>
                  </div>
                  <div>
                    <dt>Tax</dt>
                    <dd>—</dd>
                  </div>
                </dl>
                <div className="grand-total">
                  <span>Total due</span>
                  <strong>RM {SHELL_PREVIEW.zeroTotal}</strong>
                </div>
                <p className="total-footnote">Preview amount · No prices or taxes are calculated</p>
                <div className="payment-methods" aria-label="Payment methods">
                  {(
                    [
                      ["Cash", Banknote],
                      ["Card", CreditCard],
                      ["DuitNow", Smartphone],
                      ["Other", CircleEllipsis],
                      ["Credit", UserRound],
                    ] as const
                  ).map(([method, MethodIcon]) => (
                    <ShellButton key={method} disabled title="Payment requires an active sale">
                      <MethodIcon size={15} strokeWidth={1.8} aria-hidden="true" /> {method}
                    </ShellButton>
                  ))}
                </div>
                <div className="amount-region">
                  <label htmlFor="amount-received">Amount Received</label>
                  <div className="amount-input">
                    <span>RM</span>
                    <input id="amount-received" value="" placeholder="0.00" disabled readOnly />
                  </div>
                  <div className="amount-quick">
                    {["Exact", "RM 50", "RM 100"].map((amount) => (
                      <ShellButton key={amount} disabled>
                        {amount}
                      </ShellButton>
                    ))}
                  </div>
                </div>
                <div className="change-line">
                  <span>Change</span>
                  <strong>RM {SHELL_PREVIEW.zeroTotal}</strong>
                </div>
                <div className="payment-region">
                  <ShellButton
                    variant="primary"
                    disabled
                    title="Payment requires a live sale workflow"
                  >
                    <Check size={16} aria-hidden="true" /> Complete Sale <kbd>F8</kbd>
                  </ShellButton>
                  <span>Payment requires a live sale.</span>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <section className="deferred-workspace" aria-labelledby="deferred-heading">
            <p className="eyebrow">MINIMART PREVIEW</p>
            <h1 id="deferred-heading">{pages.find((item) => item.id === page)?.label}</h1>
            <p>{deferredPageCopy[page]}</p>
            <ShellButton variant="secondary" onClick={() => setPage("sale")}>
              Back to sale
            </ShellButton>
          </section>
        )}
      </main>

      <footer className="shell-footer">
        <div className="shortcut-hints" aria-label="Keyboard shortcuts">
          <KeyHint keyName="F2">Focus item search</KeyHint>
          <span>Other sale shortcuts become available with their workflows.</span>
        </div>
        <p className="footer-message" role="status" aria-live="polite">
          {message}
          {scanCount > 0 ? ` Scans captured this session: ${String(scanCount)}.` : ""}
        </p>
      </footer>
    </div>
  );
}
