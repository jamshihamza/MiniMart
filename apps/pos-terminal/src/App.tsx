import { useEffect, useRef, useState } from "react";

import { KeyHint, ShellButton, StatusBadge } from "./components/ShellControls.js";
import {
  STORE_NODE_STATUS_LABEL,
  interpretStoreNodeStatus,
  type StoreNodeStatus,
} from "./connectivity.js";
import { SHELL_PREVIEW, previewProducts } from "./fixtures.js";
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

const pages: readonly { id: ShellPage; label: string; icon: string }[] = [
  { id: "sale", label: "POS", icon: "▣" },
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "history", label: "History", icon: "◷" },
  { id: "returns", label: "Returns", icon: "↩" },
  { id: "inventory", label: "Inventory", icon: "▤" },
  { id: "purchases", label: "Purchases", icon: "▱" },
  { id: "suppliers", label: "Suppliers", icon: "♙" },
  { id: "customers", label: "Customers", icon: "♧" },
  { id: "shift", label: "Cash & Shift", icon: "◉" },
  { id: "reports", label: "Reports", icon: "▥" },
  { id: "accounting", label: "Accounting", icon: "▧" },
  { id: "settings", label: "Settings", icon: "⚙" },
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

function Icon({ name }: { name: "cart" | "bell" | "search" | "check" }) {
  const paths = {
    cart: "M2 3h2l2.2 11h11.3l2-8H5M8 19h.01M17 19h.01",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
    search: "m20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0",
    check: "m4 12 5 5L20 6",
  } as const;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={paths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PosApp() {
  const [page, setPage] = useState<ShellPage>("sale");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Shell preview. No transaction data is loaded.");
  const [storeNodeStatus, setStoreNodeStatus] = useState<StoreNodeStatus>("checking");
  const [now, setNow] = useState(() => new Date());
  const searchRef = useRef<HTMLInputElement>(null);

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
    function handleShellShortcut(event: KeyboardEvent) {
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
            <Icon name="cart" />
          </span>
          <div>
            <strong>MiniMart</strong>
            <span className="brand-subtitle">Retail Made Simple</span>
          </div>
        </div>
        <nav className="primary-nav" aria-label="POS sections">
          {pages.map(({ id, label, icon }) => (
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
                {icon}
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
            Store: {SHELL_PREVIEW.store} <span aria-hidden="true">⌄</span>
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
            <Icon name="bell" />
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
                        ▥
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
                        <Icon name="search" />
                      </button>
                    </div>
                    <span id="search-help" className="sr-only">
                      Preview input only. Item lookup and scanner handling are not available.
                    </span>
                  </form>
                  <div className="quick-actions" aria-label="Sale actions">
                    <ShellButton disabled title="Available in a later milestone">
                      Price Check <kbd>F3</kbd>
                    </ShellButton>
                    <ShellButton disabled title="Available in a later milestone">
                      Hold sale <kbd>F6</kbd>
                    </ShellButton>
                    <ShellButton disabled title="Available in a later milestone">
                      Recall sale
                    </ShellButton>
                    <ShellButton disabled title="Available in a later milestone">
                      Clear Cart
                    </ShellButton>
                  </div>
                </div>

                <div className="product-region">
                  <div className="region-heading">
                    <strong>Quick products</strong>
                    <span>Demo catalog · selection unavailable</span>
                  </div>
                  <div className="product-grid">
                    {previewProducts.map((product) => (
                      <button
                        type="button"
                        className="product-tile"
                        key={product.name}
                        disabled
                        title="Item lookup is not available in this shell"
                      >
                        <span
                          className={`product-art product-art--${product.color}`}
                          aria-hidden="true"
                        >
                          <span>{product.mark}</span>
                        </span>
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
                      <span>No items added. Scan or search when item lookup is available.</span>
                    </div>
                  </div>
                </div>

                <div className="sale-bottom">
                  <div className="customer-field">
                    <h2>
                      Customer <span aria-hidden="true">(F4)</span>
                    </h2>
                    <ShellButton disabled title="Available in a later milestone">
                      Walk-in Customer
                    </ShellButton>
                    <span className="customer-attach">
                      <ShellButton variant="quiet" disabled title="Available in a later milestone">
                        Attach <kbd>F4</kbd>
                      </ShellButton>
                    </span>
                  </div>
                  <div className="notes-field">
                    <label htmlFor="sale-notes">Notes</label>
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
                  {["Cash", "Card", "DuitNow", "Other", "Credit"].map((method) => (
                    <ShellButton key={method} disabled title="Payment requires an active sale">
                      {method}
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
                    <Icon name="check" /> Complete Sale <kbd>F8</kbd>
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
        </p>
      </footer>
    </div>
  );
}
