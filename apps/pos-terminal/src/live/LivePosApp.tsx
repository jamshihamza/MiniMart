import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Banknote,
  Check,
  CreditCard,
  Eraser,
  History,
  Minus,
  Package,
  Plus,
  Printer,
  ScanBarcode,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Store,
  Trash2,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { KeyHint, ShellButton, StatusBadge } from "../components/ShellControls.js";
import {
  ApiProblem,
  ApiUnreachable,
  newIdempotencyKey,
  storeApi,
  type CatalogItem,
  type Quote,
  type Receipt,
  type SaleSummary,
  type ShiftDetail,
  type StoreApi,
  type StoreOverview,
  type Tender,
} from "./api.js";
import "./live.css";

type Page = "sale" | "history" | "inventory" | "shift";
type Method = Tender["methodCode"];

const pages: readonly { id: Page; label: string; icon: LucideIcon }[] = [
  { id: "sale", label: "POS", icon: Store },
  { id: "history", label: "History", icon: History },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "shift", label: "Cash & Shift", icon: Wallet },
];

const methods: readonly { code: Method; label: string; icon: LucideIcon }[] = [
  { code: "CASH", label: "Cash", icon: Banknote },
  { code: "CARD", label: "Card", icon: CreditCard },
  { code: "DUITNOW", label: "DuitNow", icon: Smartphone },
];

const AMOUNT_PATTERN = /^\d{1,9}(\.\d{1,2})?$/;

function describe(error: unknown): string {
  if (error instanceof ApiProblem) return error.message;
  if (error instanceof ApiUnreachable) return "Store Node is not answering. Nothing was changed.";
  return "Something went wrong.";
}

function timeOf(iso: string): string {
  return new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );
}

/** Sprite index for the ten seeded demo items; other items get a neutral tile. */
function artIndex(item: CatalogItem): number | null {
  const match = /^MM-001(\d\d)$/.exec(item.itemCode ?? "");
  const index = match === null ? 0 : Number(match[1]);
  return index >= 1 && index <= 10 ? index - 1 : null;
}

function ReceiptDialog({
  receipt,
  changeDue,
  onClose,
}: {
  receipt: Receipt;
  changeDue: string | null;
  onClose: () => void;
}) {
  return (
    <div className="live-overlay" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="live-dialog receipt">
        <h2 id="receipt-title">{receipt.store?.displayName ?? "Receipt"}</h2>
        <p className="receipt-meta">
          {receipt.documentNo} · {timeOf(receipt.postedAt)}
          <br />
          Business date {receipt.businessDate}
        </p>
        <table className="receipt-lines">
          <tbody>
            {receipt.lines.map((line) => (
              <tr key={line.lineNo}>
                <td>
                  {line.itemName}
                  <small>
                    {line.quantity} × RM {line.unitPrice}
                  </small>
                </td>
                <td className="num">RM {line.lineTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="receipt-totals">
          <div>
            <dt>Total</dt>
            <dd>RM {receipt.grandTotal}</dd>
          </div>
          {receipt.tenders.map((tender, index) => (
            <div key={index}>
              <dt>
                {tender.methodCode}
                {tender.reference === null ? "" : ` (${tender.reference})`}
              </dt>
              <dd>RM {tender.amount}</dd>
            </div>
          ))}
          {changeDue !== null && (
            <div>
              <dt>Change</dt>
              <dd>RM {changeDue}</dd>
            </div>
          )}
        </dl>
        <div className="live-dialog__actions">
          <ShellButton onClick={() => window.print()}>
            <Printer size={14} aria-hidden="true" /> Print
          </ShellButton>
          <ShellButton variant="primary" onClick={onClose} autoFocus>
            Done
          </ShellButton>
        </div>
      </div>
    </div>
  );
}

function ShiftPanel({
  api,
  overview,
  onChanged,
  notify,
}: {
  api: StoreApi;
  overview: StoreOverview;
  onChanged: () => Promise<void>;
  notify: (message: string) => void;
}) {
  const [detail, setDetail] = useState<ShiftDetail | null>(null);
  const [openingCash, setOpeningCash] = useState("");
  const [countedCash, setCountedCash] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cashReason, setCashReason] = useState("");
  const [busy, setBusy] = useState(false);
  const keyRef = useRef<{ action: string; key: string } | null>(null);
  const shiftId = overview.shift?.shiftId ?? null;

  useEffect(() => {
    let active = true;
    if (shiftId === null) return;
    void api.shift(shiftId).then(
      (loaded) => active && setDetail(loaded),
      () => undefined,
    );
    return () => {
      active = false;
    };
  }, [api, shiftId, overview.shift?.expectedCash]);

  // The same key is reused when the same action is retried, so a retry cannot post twice.
  async function run(action: string, work: (key: string) => Promise<ShiftDetail>, done: string) {
    if (keyRef.current?.action !== action) keyRef.current = { action, key: newIdempotencyKey() };
    setBusy(true);
    try {
      setDetail(await work(keyRef.current.key));
      keyRef.current = null;
      notify(done);
      await onChanged();
    } catch (error) {
      if (error instanceof ApiUnreachable) {
        notify(
          "Outcome unknown: the Store Node did not answer. Try again; it will not post twice.",
        );
      } else {
        keyRef.current = null;
        notify(describe(error));
      }
    } finally {
      setBusy(false);
    }
  }

  const counter = overview.counter;
  if (counter === null) return <p className="live-note">No counter is configured.</p>;

  if (overview.shift === null) {
    const last = detail?.status === "CLOSED" ? detail : null;
    return (
      <section className="live-page" aria-labelledby="shift-heading">
        <h1 id="shift-heading">Cash &amp; Shift</h1>
        <p className="live-note">No open shift on {counter.counterCode}.</p>
        {last !== null && (
          <p className="live-note">
            Last shift closed · expected RM {last.expectedCash} · counted RM {last.countedCash} ·
            variance RM {last.variance}
          </p>
        )}
        <form
          className="live-form"
          onSubmit={(event) => {
            event.preventDefault();
            void run(
              `open:${openingCash}`,
              (key) => api.openShift(key, counter.counterId, openingCash),
              "Shift opened.",
            ).then(() => setOpeningCash(""));
          }}
        >
          <label htmlFor="opening-cash">Opening cash (RM)</label>
          <input
            id="opening-cash"
            inputMode="decimal"
            value={openingCash}
            onChange={(event) => setOpeningCash(event.target.value)}
            placeholder="0.00"
          />
          <ShellButton
            variant="primary"
            type="submit"
            disabled={busy || !AMOUNT_PATTERN.test(openingCash)}
          >
            Open Shift
          </ShellButton>
        </form>
      </section>
    );
  }

  const shift = detail?.shiftId === overview.shift.shiftId ? detail : null;
  const cashValid = AMOUNT_PATTERN.test(cashAmount) && cashReason.trim() !== "";
  return (
    <section className="live-page" aria-labelledby="shift-heading">
      <h1 id="shift-heading">Cash &amp; Shift</h1>
      <dl className="live-facts">
        <div>
          <dt>Counter</dt>
          <dd>{overview.shift.counterCode}</dd>
        </div>
        <div>
          <dt>Cashier</dt>
          <dd>{overview.shift.cashier}</dd>
        </div>
        <div>
          <dt>Business date</dt>
          <dd>{overview.shift.businessDate}</dd>
        </div>
        <div>
          <dt>Opening cash</dt>
          <dd>RM {overview.shift.openingCash}</dd>
        </div>
        <div>
          <dt>Expected cash</dt>
          <dd>RM {overview.shift.expectedCash}</dd>
        </div>
      </dl>
      <p className="live-note">
        Expected cash is derived from the cash movements below. Card and DuitNow amounts are not in
        the drawer.
      </p>
      <div className="live-columns">
        <div>
          <h2>Cash movements</h2>
          <table className="live-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Reason</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(shift?.cashMovements ?? []).map((movement) => (
                <tr key={movement.cashMovementId}>
                  <td>{timeOf(movement.occurredAt)}</td>
                  <td>{movement.movementType.replaceAll("_", " ")}</td>
                  <td>{movement.reasonCode ?? "—"}</td>
                  <td className="num">RM {movement.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Tenders this shift</h2>
          <table className="live-table">
            <tbody>
              {(shift?.tenders ?? []).map((tender) => (
                <tr key={tender.methodCode}>
                  <td>{tender.methodCode}</td>
                  <td className="num">RM {tender.amount}</td>
                </tr>
              ))}
              {shift?.tenders.length === 0 && (
                <tr>
                  <td colSpan={2}>No sales yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Cash in / out</h2>
          <div className="live-form">
            <label htmlFor="cash-amount">Amount (RM)</label>
            <input
              id="cash-amount"
              inputMode="decimal"
              value={cashAmount}
              onChange={(event) => setCashAmount(event.target.value)}
              placeholder="0.00"
            />
            <label htmlFor="cash-reason">Reason</label>
            <input
              id="cash-reason"
              value={cashReason}
              onChange={(event) => setCashReason(event.target.value)}
            />
            <div className="live-form__row">
              {(["cash-in", "cash-out"] as const).map((direction) => (
                <ShellButton
                  key={direction}
                  disabled={busy || !cashValid}
                  onClick={() =>
                    void run(
                      `${direction}:${cashAmount}:${cashReason}`,
                      (key) =>
                        api.cashMovement(
                          key,
                          overview.shift!.shiftId,
                          direction,
                          cashAmount,
                          cashReason,
                        ),
                      direction === "cash-in" ? "Cash in posted." : "Cash out posted.",
                    ).then(() => {
                      setCashAmount("");
                      setCashReason("");
                    })
                  }
                >
                  {direction === "cash-in" ? "Cash In" : "Cash Out"}
                </ShellButton>
              ))}
            </div>
          </div>
          <h2>Close shift</h2>
          <form
            className="live-form"
            onSubmit={(event) => {
              event.preventDefault();
              void run(
                `close:${countedCash}`,
                (key) => api.closeShift(key, overview.shift!.shiftId, countedCash),
                "Shift closed.",
              ).then(() => setCountedCash(""));
            }}
          >
            <label htmlFor="counted-cash">Counted cash (RM)</label>
            <input
              id="counted-cash"
              inputMode="decimal"
              value={countedCash}
              onChange={(event) => setCountedCash(event.target.value)}
              placeholder="0.00"
            />
            <ShellButton
              variant="primary"
              type="submit"
              disabled={busy || !AMOUNT_PATTERN.test(countedCash)}
            >
              Close Shift
            </ShellButton>
          </form>
        </div>
      </div>
    </section>
  );
}

export function LivePosApp({ api = storeApi }: { api?: StoreApi }) {
  const [page, setPage] = useState<Page>("sale");
  const [overview, setOverview] = useState<StoreOverview | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<ReadonlyMap<string, number>>(new Map());
  const [method, setMethod] = useState<Method>("CASH");
  const [received, setReceived] = useState("");
  const [reference, setReference] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [posting, setPosting] = useState(false);
  const [outcomeUnknown, setOutcomeUnknown] = useState(false);
  const [receipt, setReceipt] = useState<{ receipt: Receipt; changeDue: string | null } | null>(
    null,
  );
  const [sales, setSales] = useState<SaleSummary[]>([]);
  const [message, setMessage] = useState("Connecting to the Store Node…");
  const [now, setNow] = useState(() => new Date());
  const searchRef = useRef<HTMLInputElement>(null);
  const saleKeyRef = useRef<string | null>(null);
  const counterRef = useRef<string | undefined>(undefined);

  const refresh = useCallback(async () => {
    try {
      const [context, catalog] = await Promise.all([api.context(counterRef.current), api.items()]);
      counterRef.current = context.counter?.counterId;
      setOverview(context);
      setItems(catalog.items);
      setOnline(true);
      return true;
    } catch {
      setOnline(false);
      return false;
    }
  }, [api]);

  useEffect(() => {
    void refresh().then((ok) =>
      setMessage(ok ? "Ready. Scan or select an item." : "Store Node is unavailable."),
    );
    const clock = setInterval(() => setNow(new Date()), 60_000);
    const probe = setInterval(() => {
      void api.health().then(
        () => setOnline(true),
        () => setOnline(false),
      );
    }, 5_000);
    return () => {
      clearInterval(clock);
      clearInterval(probe);
    };
  }, [api, refresh]);

  const lines = useMemo(
    () => [...cart].map(([itemId, count]) => ({ itemId, quantity: String(count) })),
    [cart],
  );
  const cashTender = method === "CASH" && AMOUNT_PATTERN.test(received) ? received : null;

  useEffect(() => {
    if (lines.length === 0) {
      setQuote(null);
      return;
    }
    let active = true;
    const tenders: Tender[] =
      cashTender === null ? [] : [{ methodCode: "CASH", amount: cashTender }];
    void api.quote(lines, tenders).then(
      (result) => active && setQuote(result),
      (error: unknown) => active && setMessage(describe(error)),
    );
    return () => {
      active = false;
    };
  }, [api, lines, cashTender]);

  const changeCart = useCallback((itemId: string, delta: number) => {
    saleKeyRef.current = null;
    setOutcomeUnknown(false);
    setCart((current) => {
      const next = new Map(current);
      const count = (next.get(itemId) ?? 0) + delta;
      if (count <= 0) next.delete(itemId);
      else next.set(itemId, count);
      return next;
    });
  }, []);

  const clearSale = useCallback(() => {
    saleKeyRef.current = null;
    setOutcomeUnknown(false);
    setCart(new Map());
    setReceived("");
    setReference("");
    setMethod("CASH");
  }, []);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) ||
        (item.itemCode ?? "").toLowerCase().includes(needle) ||
        item.barcode === query.trim(),
    );
  }, [items, query]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const needle = query.trim();
    if (needle === "") return;
    const exact = items.find((item) => item.barcode === needle || item.itemCode === needle);
    const match = exact ?? (visibleItems.length === 1 ? visibleItems[0] : undefined);
    if (match === undefined) {
      setMessage(
        visibleItems.length === 0
          ? `No item matches “${needle}”. Nothing was added.`
          : `${visibleItems.length} items match. Select one.`,
      );
      return;
    }
    changeCart(match.itemId, 1);
    setQuery("");
    setMessage(`${match.name} added.`);
  }

  const shift = overview?.shift ?? null;
  const settled = quote !== null && (method === "CASH" ? quote.payment.settled : lines.length > 0);
  const canComplete = shift !== null && settled && !posting && online !== false;

  const completeSale = useCallback(async () => {
    if (!canComplete || quote === null || overview?.counter == null) return;
    const tenders: Tender[] =
      method === "CASH"
        ? [{ methodCode: "CASH", amount: received }]
        : [
            {
              methodCode: method,
              amount: quote.grandTotal,
              ...(reference.trim() === "" ? {} : { reference: reference.trim() }),
            },
          ];
    saleKeyRef.current ??= newIdempotencyKey();
    setPosting(true);
    try {
      const posted = await api.postSale(
        saleKeyRef.current,
        overview.counter.counterId,
        lines,
        tenders,
      );
      setReceipt({
        receipt: posted.receipt,
        changeDue: posted.changeDue ?? quote.payment.changeDue,
      });
      setMessage(`Sale ${posted.documentNo} completed.`);
      clearSale();
      await refresh();
    } catch (error) {
      if (error instanceof ApiUnreachable) {
        setOutcomeUnknown(true);
        setMessage(
          "Outcome unknown: the Store Node did not answer. Retry safely; it cannot post twice.",
        );
      } else {
        saleKeyRef.current = null;
        setMessage(describe(error));
        await refresh();
      }
    } finally {
      setPosting(false);
    }
  }, [api, canComplete, clearSale, lines, method, overview, quote, received, reference, refresh]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || page !== "sale")
        return;
      if (event.key === "F2") {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === "F8") {
        event.preventDefault();
        void completeSale();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, completeSale]);

  useEffect(() => {
    if (page !== "history") return;
    void api.sales().then(
      (result) => setSales(result.sales),
      (error: unknown) => setMessage(describe(error)),
    );
  }, [api, page, receipt]);

  const itemsById = useMemo(() => new Map(items.map((item) => [item.itemId, item])), [items]);
  const cartCount = [...cart.values()].reduce((sum, count) => sum + count, 0);
  const operator = overview?.operator ?? "—";
  const initials = operator.slice(0, 2).toUpperCase();

  return (
    <div className="pos-shell live">
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
              onClick={() => setPage(id)}
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
            {initials}
          </span>
          <div>
            <strong>{operator}</strong>
            <span>Demo session</span>
          </div>
        </div>
      </aside>

      <header className="app-header">
        <div className="header-store">
          <label className="sr-only" htmlFor="counter-select">
            Counter
          </label>
          <select
            id="counter-select"
            className="store-selector"
            value={overview?.counter?.counterId ?? ""}
            disabled={cart.size > 0 || overview === null}
            onChange={(event) => {
              counterRef.current = event.target.value;
              void refresh();
            }}
          >
            {(overview?.counters ?? []).map((counter) => (
              <option key={counter.counterId} value={counter.counterId}>
                {overview?.store?.displayName} · {counter.counterCode}
              </option>
            ))}
          </select>
          <StatusBadge
            tone={online === true ? "neutral" : "attention"}
            label={
              online === null
                ? "Store Node · Checking"
                : online
                  ? "Store Node · Online"
                  : "Store Node · Unavailable"
            }
          />
          <StatusBadge
            tone={shift === null ? "attention" : "neutral"}
            label={shift === null ? "No open shift" : `Shift open · ${shift.businessDate}`}
          />
        </div>
        <div className="header-right">
          <span className="header-clock">
            {new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(
              now,
            )}
          </span>
          <span className="header-avatar" aria-label={operator}>
            {initials}
          </span>
        </div>
      </header>

      <main id="workspace" className="workspace" tabIndex={-1}>
        {page === "sale" && (
          <div className="sale-page live-sale">
            <div className="page-heading">
              <div>
                <h1>POS - Sales</h1>
                <p>Scan items or search to add to cart</p>
              </div>
              <div className="page-status">
                <span>
                  Business date ·{" "}
                  {shift?.businessDate ?? overview?.businessDay?.businessDate ?? "—"}
                </span>
              </div>
            </div>
            {shift === null && overview !== null && (
              <div className="live-banner" role="alert">
                No shift is open on {overview.counter?.counterCode}. Open a shift before taking a
                sale.
                <ShellButton onClick={() => setPage("shift")}>Open Shift</ShellButton>
              </div>
            )}
            {outcomeUnknown && (
              <div className="live-banner" role="alert">
                Sale outcome unknown. The same request can be sent again safely.
                <ShellButton onClick={() => void completeSale()} disabled={posting}>
                  Retry safely
                </ShellButton>
              </div>
            )}
            <div className="sale-workspace">
              <section className="sale-left" aria-labelledby="sale-heading">
                <h2 id="sale-heading" className="sale-section-title">
                  New sale
                </h2>
                <div className="sale-toolbar">
                  <form className="scan-form" onSubmit={submitSearch} role="search">
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
                        autoComplete="off"
                      />
                      <button className="search-submit" type="submit" aria-label="Search">
                        <Search size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </form>
                  <div className="quick-actions" aria-label="Sale actions">
                    <ShellButton disabled={cart.size === 0 || posting} onClick={clearSale}>
                      <Eraser size={13} aria-hidden="true" /> Clear Cart
                    </ShellButton>
                  </div>
                </div>

                <div className="product-region">
                  <div className="region-heading">
                    <strong>Products</strong>
                    <span>
                      {visibleItems.length} of {items.length} items
                    </span>
                  </div>
                  <div className="product-grid">
                    {visibleItems.map((item) => {
                      const art = artIndex(item);
                      const soldOut = item.onHand === "0";
                      return (
                        <button
                          type="button"
                          className="product-tile"
                          key={item.itemId}
                          disabled={item.sellingPrice === null || soldOut}
                          title={soldOut ? "Out of stock" : (item.barcode ?? undefined)}
                          onClick={() => changeCart(item.itemId, 1)}
                        >
                          {art === null ? (
                            <span className="product-art product-art--plain" aria-hidden="true">
                              <Package size={26} strokeWidth={1.4} />
                            </span>
                          ) : (
                            <span
                              className={`product-art product-art--${art}`}
                              aria-hidden="true"
                            />
                          )}
                          <strong>{item.name}</strong>
                          <span>
                            {item.sellingPrice === null ? "No price" : `RM ${item.sellingPrice}`}
                            {item.onHand !== null && <small> · {item.onHand} left</small>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="cart-region" aria-labelledby="cart-heading">
                  <div className="cart-toolbar">
                    <h2 id="cart-heading">Cart</h2>
                    <span>
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </span>
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
                    {cart.size === 0 ? (
                      <div className="cart-empty" role="row">
                        <span>
                          <ShoppingBasket size={19} strokeWidth={1.7} aria-hidden="true" />
                          No items added. Scan, search or select a product.
                        </span>
                      </div>
                    ) : (
                      <div className="cart-body" role="rowgroup">
                        {[...cart].map(([itemId, count], index) => {
                          const item = itemsById.get(itemId);
                          const priced = quote?.lines.find((line) => line.itemId === itemId);
                          const name = item?.name ?? "Item";
                          return (
                            <div className="cart-row" role="row" key={itemId}>
                              <span role="cell">{index + 1}</span>
                              <span role="cell">{name}</span>
                              <span role="cell" className="qty-stepper">
                                <button
                                  type="button"
                                  aria-label={`Decrease ${name}`}
                                  onClick={() => changeCart(itemId, -1)}
                                >
                                  <Minus size={12} aria-hidden="true" />
                                </button>
                                <strong>{count}</strong>
                                <button
                                  type="button"
                                  aria-label={`Increase ${name}`}
                                  onClick={() => changeCart(itemId, 1)}
                                >
                                  <Plus size={12} aria-hidden="true" />
                                </button>
                              </span>
                              <span role="cell">
                                {priced === undefined ? "…" : priced.unitPrice}
                              </span>
                              <span role="cell">—</span>
                              <span role="cell" className="cart-row__total">
                                {priced === undefined ? "…" : priced.lineTotal}
                                <button
                                  type="button"
                                  className="cart-remove"
                                  aria-label={`Remove ${name}`}
                                  onClick={() => changeCart(itemId, -count)}
                                >
                                  <Trash2 size={13} aria-hidden="true" />
                                </button>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <aside className="sale-right" aria-label="Sale summary">
                <div className="summary-header">
                  <h2>Summary</h2>
                  <span>{cartCount} total items</span>
                </div>
                <dl className="total-lines">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{quote === null ? "—" : `RM ${quote.subtotal}`}</dd>
                  </div>
                  <div>
                    <dt>Discount</dt>
                    <dd>{quote === null ? "—" : `RM ${quote.discountTotal}`}</dd>
                  </div>
                  <div>
                    <dt>Tax</dt>
                    <dd>{quote === null ? "—" : `RM ${quote.taxTotal}`}</dd>
                  </div>
                </dl>
                <div className="grand-total">
                  <span>Total due</span>
                  <strong>RM {quote?.grandTotal ?? "0.00"}</strong>
                </div>
                <p className="total-footnote">Totals are calculated by the Store Node</p>
                <div className="payment-methods" role="group" aria-label="Payment methods">
                  {methods.map(({ code, label, icon: MethodIcon }) => (
                    <ShellButton
                      key={code}
                      aria-pressed={method === code}
                      className={`shell-button shell-button--secondary${method === code ? " is-selected" : ""}`}
                      disabled={cart.size === 0}
                      onClick={() => {
                        saleKeyRef.current = null;
                        setMethod(code);
                      }}
                    >
                      <MethodIcon size={15} strokeWidth={1.8} aria-hidden="true" /> {label}
                    </ShellButton>
                  ))}
                </div>
                {method === "CASH" ? (
                  <div className="amount-region">
                    <label htmlFor="amount-received">Amount Received</label>
                    <div className="amount-input">
                      <span>RM</span>
                      <input
                        id="amount-received"
                        inputMode="decimal"
                        value={received}
                        placeholder="0.00"
                        disabled={cart.size === 0}
                        onChange={(event) => {
                          saleKeyRef.current = null;
                          setReceived(event.target.value);
                        }}
                      />
                    </div>
                    <div className="amount-quick">
                      {(
                        [
                          ["Exact", quote?.grandTotal ?? ""],
                          ["RM 50", "50.00"],
                          ["RM 100", "100.00"],
                        ] as const
                      ).map(([label, amount]) => (
                        <ShellButton
                          key={label}
                          disabled={quote === null}
                          onClick={() => {
                            saleKeyRef.current = null;
                            setReceived(amount);
                          }}
                        >
                          {label}
                        </ShellButton>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="amount-region">
                    <label htmlFor="payment-reference">Reference (optional)</label>
                    <div className="amount-input">
                      <input
                        id="payment-reference"
                        value={reference}
                        onChange={(event) => setReference(event.target.value)}
                        placeholder="Terminal or DuitNow reference"
                      />
                    </div>
                    <p className="total-footnote">
                      Confirm the payment on the terminal or phone first. This demo records it as
                      manually confirmed; no payment provider is contacted.
                    </p>
                  </div>
                )}
                <div className="change-line">
                  <span>Change</span>
                  <strong>
                    RM {method === "CASH" ? (quote?.payment.changeDue ?? "0.00") : "0.00"}
                  </strong>
                </div>
                <div className="payment-region">
                  <ShellButton
                    variant="primary"
                    disabled={!canComplete}
                    onClick={() => void completeSale()}
                  >
                    <Check size={16} aria-hidden="true" /> Complete Sale <kbd>F8</kbd>
                  </ShellButton>
                  <span>
                    {shift === null
                      ? "Open a shift to take payment."
                      : cart.size === 0
                        ? "Add items to start a sale."
                        : settled
                          ? "Ready to complete."
                          : `Remaining RM ${quote?.payment.remaining ?? "…"}`}
                  </span>
                </div>
              </aside>
            </div>
          </div>
        )}

        {page === "history" && (
          <section className="live-page" aria-labelledby="history-heading">
            <h1 id="history-heading">History</h1>
            <table className="live-table">
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Posted</th>
                  <th>Business date</th>
                  <th>Tender</th>
                  <th className="num">Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.saleId}>
                    <td>{sale.documentNo}</td>
                    <td>{timeOf(sale.postedAt)}</td>
                    <td>{sale.businessDate}</td>
                    <td>{sale.tenders.join(", ")}</td>
                    <td className="num">RM {sale.grandTotal}</td>
                    <td>
                      <ShellButton
                        onClick={() =>
                          void api.receipt(sale.saleId).then(
                            (loaded) => setReceipt({ receipt: loaded, changeDue: null }),
                            (error: unknown) => setMessage(describe(error)),
                          )
                        }
                      >
                        View
                      </ShellButton>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={6}>No completed sales yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {page === "inventory" && (
          <section className="live-page" aria-labelledby="inventory-heading">
            <h1 id="inventory-heading">Inventory</h1>
            <p className="live-note">Read-only stock on hand. Adjust stock in the Back Office.</p>
            <table className="live-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Code</th>
                  <th>Barcode</th>
                  <th className="num">Price</th>
                  <th className="num">On hand</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.name}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.barcode ?? "—"}</td>
                    <td className="num">
                      {item.sellingPrice === null ? "—" : `RM ${item.sellingPrice}`}
                    </td>
                    <td className="num">
                      {item.onHand === null
                        ? "Not stock-managed"
                        : `${item.onHand} ${item.uomCode}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {page === "shift" && overview !== null && (
          <ShiftPanel
            api={api}
            overview={overview}
            onChanged={async () => void (await refresh())}
            notify={setMessage}
          />
        )}
      </main>

      <footer className="shell-footer">
        <div className="shortcut-hints" aria-label="Keyboard shortcuts">
          <KeyHint keyName="F2">Focus item search</KeyHint>
          <KeyHint keyName="F8">Complete sale</KeyHint>
        </div>
        <p className="footer-message" role="status" aria-live="polite">
          {message}
        </p>
      </footer>

      {receipt !== null && (
        <ReceiptDialog
          receipt={receipt.receipt}
          changeDue={receipt.changeDue}
          onClose={() => {
            setReceipt(null);
            searchRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
