import { useEffect, useRef, useState } from "react";

import { KeyHint, ShellButton, StatusBadge } from "./components/ShellControls.js";
import {
  STORE_NODE_STATUS_LABEL,
  interpretStoreNodeStatus,
  type StoreNodeStatus,
} from "./connectivity.js";
import { SHELL_PREVIEW } from "./fixtures.js";
import { probeStoreNode } from "./system-status-transport.js";

type ShellPage = "sale" | "history" | "returns" | "shift";

const pages: readonly { id: ShellPage; label: string }[] = [
  { id: "sale", label: "Sale" },
  { id: "history", label: "History" },
  { id: "returns", label: "Returns" },
  { id: "shift", label: "Shift" },
];

const deferredPageCopy: Record<Exclude<ShellPage, "sale">, string> = {
  history: "Sale history will appear when the Store Node connection and sale APIs are available.",
  returns: "Returns will appear when the return workflow is implemented.",
  shift: "Shift actions will appear when cashier session workflows are implemented.",
};

export function PosApp() {
  const [page, setPage] = useState<ShellPage>("sale");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Shell preview. No transaction data is loaded.");
  const [storeNodeStatus, setStoreNodeStatus] = useState<StoreNodeStatus>("checking");
  const searchRef = useRef<HTMLInputElement>(null);

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

      <header className="app-header">
        <div className="brand-block" aria-label="MiniMart POS">
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <div>
            <strong>MiniMart</strong>
            <span className="brand-subtitle">POINT OF SALE</span>
          </div>
        </div>

        <div className="counter-context" aria-label="Demo store and counter">
          <span className="context-eyebrow">SHELL PREVIEW</span>
          <span className="context-main">{SHELL_PREVIEW.store}</span>
          <span className="context-divider" aria-hidden="true" />
          <span>{SHELL_PREVIEW.counter}</span>
        </div>

        <div className="operator-context">
          <div className="operator-copy">
            <span className="context-eyebrow">CASHIER · DEMO</span>
            <span>{SHELL_PREVIEW.cashier}</span>
          </div>
          <span className="operator-avatar" aria-hidden="true">
            DC
          </span>
        </div>
      </header>

      <div className="status-strip" aria-label="Operational status">
        <div className="status-strip__group">
          <StatusBadge
            tone={storeNodeStatus === "online" ? "neutral" : "attention"}
            label={STORE_NODE_STATUS_LABEL[storeNodeStatus]}
          />
          <StatusBadge label="Cloud · Not checked" />
        </div>
        <span className="business-date">Business date · Not loaded</span>
      </div>

      <nav className="primary-nav" aria-label="POS sections">
        <div className="primary-nav__links">
          {pages.map(({ id, label }) => (
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
              {label}
            </button>
          ))}
        </div>
        <span className="nav-mode">TRAINING VIEW · NO LIVE DATA</span>
      </nav>

      <main id="workspace" className="workspace" tabIndex={-1}>
        {page === "sale" ? (
          <div className="sale-workspace">
            <section className="sale-left" aria-labelledby="sale-heading">
              <div className="workspace-heading">
                <div>
                  <p className="eyebrow">TRANSACTION WORKSPACE</p>
                  <h1 id="sale-heading">New sale</h1>
                </div>
                <span className="workspace-state">No active sale</span>
              </div>

              <form className="scan-form" onSubmit={showUnavailableSearch} role="search">
                <label htmlFor="item-search">Scan barcode or search item</label>
                <div className="scan-form__row">
                  <span className="scan-glyph" aria-hidden="true">
                    ⌕
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
                    placeholder="Barcode, item name, or SKU"
                    aria-describedby="search-help"
                    autoComplete="off"
                  />
                  <kbd className="input-key">F2</kbd>
                  <ShellButton variant="secondary" type="submit">
                    Search
                  </ShellButton>
                </div>
                <p id="search-help">Preview input only · no item lookup or scanner handling</p>
              </form>

              <div className="cart-region" aria-labelledby="cart-heading">
                <div className="cart-toolbar">
                  <div>
                    <h2 id="cart-heading">Cart</h2>
                    <span>0 items</span>
                  </div>
                  <span className="cart-toolbar__hint">Lines appear here during a sale</span>
                </div>
                <div className="cart-table" role="table" aria-label="Sale lines">
                  <div className="cart-table__head" role="row">
                    <span role="columnheader">Item</span>
                    <span role="columnheader">Qty</span>
                    <span role="columnheader">Price</span>
                    <span role="columnheader">Disc.</span>
                    <span role="columnheader">Total</span>
                  </div>
                  <div className="cart-empty" role="row">
                    <div className="cart-empty__icon" aria-hidden="true">
                      ▤
                    </div>
                    <strong>Ready for the first item</strong>
                    <p>Cart lines will appear here when sale workflows are connected.</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions" aria-label="Sale actions">
                <ShellButton disabled title="Available in a later milestone">
                  Hold sale <kbd>F6</kbd>
                </ShellButton>
                <ShellButton disabled title="Available in a later milestone">
                  Recall sale
                </ShellButton>
                <ShellButton disabled title="Available in a later milestone">
                  Remove item
                </ShellButton>
              </div>
            </section>

            <aside className="sale-right" aria-label="Sale summary">
              <section className="customer-panel" aria-labelledby="customer-heading">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">SALE CONTEXT</p>
                    <h2 id="customer-heading">Customer</h2>
                  </div>
                  <ShellButton variant="quiet" disabled title="Available in a later milestone">
                    Attach <kbd>F4</kbd>
                  </ShellButton>
                </div>
                <div className="customer-placeholder">
                  <span className="customer-placeholder__avatar" aria-hidden="true">
                    —
                  </span>
                  <div>
                    <strong>Walk-in</strong>
                    <span>No customer selected · preview</span>
                  </div>
                </div>
                <p className="credit-placeholder">Credit status · Not available in shell preview</p>
              </section>

              <section className="totals-panel" aria-labelledby="totals-heading">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">TRANSACTION</p>
                    <h2 id="totals-heading">Summary</h2>
                  </div>
                  <span className="total-currency">{SHELL_PREVIEW.currency}</span>
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
                  <span>
                    Total due <small>Preview amount</small>
                  </span>
                  <strong className="tabular-nums">{SHELL_PREVIEW.zeroTotal}</strong>
                </div>
                <p className="total-footnote">No prices or taxes are calculated in this shell.</p>
              </section>

              <div className="payment-region">
                <ShellButton
                  variant="primary"
                  disabled
                  title="Payment requires a live sale workflow"
                >
                  <span>Continue to payment</span>
                  <kbd>F8</kbd>
                </ShellButton>
                <span>Payment becomes available with an active sale.</span>
              </div>
            </aside>
          </div>
        ) : (
          <section className="deferred-workspace" aria-labelledby="deferred-heading">
            <p className="eyebrow">SHELL NAVIGATION</p>
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
          <span className="shortcut-divider" aria-hidden="true" />
          <span>Other sale shortcuts become available with their workflows.</span>
        </div>
        <p className="footer-message" role="status" aria-live="polite">
          {message}
        </p>
      </footer>
    </div>
  );
}
