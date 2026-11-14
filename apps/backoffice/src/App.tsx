import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Boxes,
  Clock,
  LayoutDashboard,
  Package,
  Receipt as ReceiptIcon,
  Store,
  type LucideIcon,
} from "lucide-react";

import {
  ApiProblem,
  backOfficeApi,
  type BackOfficeApi,
  type CatalogItem,
  type Dashboard,
  type Movement,
  type Receipt,
  type SaleSummary,
  type Shift,
  type ShiftDetail,
  type StoreOverview,
} from "./api.js";

type Page = "dashboard" | "products" | "inventory" | "sales" | "cash";

const pages: readonly { id: Page; label: string; group: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", group: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", group: "Masters", icon: Package },
  { id: "inventory", label: "Inventory", group: "Operations", icon: Boxes },
  { id: "sales", label: "Sales", group: "Operations", icon: ReceiptIcon },
  { id: "cash", label: "Cash & Shifts", group: "Operations", icon: Clock },
];

const AMOUNT = /^\d{1,9}(\.\d{1,2})?$/;
const SIGNED_QUANTITY = /^-?\d{1,9}$/;

function when(iso: string | null): string {
  if (iso === null) return "—";
  return new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );
}

function reason(error: unknown): string {
  return error instanceof ApiProblem ? error.message : "Something went wrong.";
}

function Pill({ tone, children }: { tone: "good" | "warn" | "muted"; children: ReactNode }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

function Table({
  caption,
  head,
  children,
}: {
  caption: string;
  head: readonly (string | { label: string; numeric: true })[];
  children: ReactNode;
}) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((column) =>
              typeof column === "string" ? (
                <th key={column} scope="col">
                  {column}
                </th>
              ) : (
                <th key={column.label} scope="col" className="num">
                  {column.label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

const num = (label: string) => ({ label, numeric: true as const });

function useLoad<Data>(load: () => Promise<Data>, notify: (message: string) => void) {
  const [data, setData] = useState<Data | null>(null);
  const reload = useCallback(async () => {
    try {
      setData(await load());
    } catch (error) {
      notify(reason(error));
    }
  }, [load, notify]);
  useEffect(() => {
    void reload();
  }, [reload]);
  return [data, reload] as const;
}

interface PageProps {
  readonly api: BackOfficeApi;
  readonly notify: (message: string) => void;
}

function DashboardPage({ api, notify }: PageProps) {
  const closeKeyRef = useRef<string | null>(null);
  const load = useCallback(() => api.dashboard(), [api]);
  const [data, reload] = useLoad<Dashboard>(load, notify);
  if (data === null) return <p className="note">Loading…</p>;
  const openDay = data.businessDays.find((day) => day.status === "OPEN");
  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <span className="note">Operational summary · not a financial statement</span>
      </div>
      <div className="cards">
        <div className="card">
          <span>Business date</span>
          <strong>{data.businessDate}</strong>
          <Pill tone={data.businessDayOpen ? "good" : "muted"}>
            {data.businessDayOpen ? "Business Day open" : "No open Business Day"}
          </Pill>
        </div>
        <div className="card">
          <span>Sales today</span>
          <strong>RM {data.salesTotal}</strong>
          <small>{data.saleCount} completed</small>
        </div>
        <div className="card">
          <span>Stock value (moving WAC)</span>
          <strong>RM {data.stockValue}</strong>
          <small>
            {data.itemCount} items · {data.zeroStockCount} at zero
          </small>
        </div>
        <div className="card">
          <span>Open shifts</span>
          <strong>{data.openShifts.length}</strong>
          <small>
            {data.openShifts.map((shift) => `${shift.counterCode} · ${shift.cashier}`).join(", ") ||
              "None"}
          </small>
        </div>
      </div>
      <h2>Recent sales</h2>
      <Table caption="Recent sales" head={["Receipt", "Counter", "Posted", "Tender", num("Total")]}>
        {data.recentSales.map((sale) => (
          <tr key={sale.saleId}>
            <td className="mono">{sale.documentNo}</td>
            <td>{sale.counterCode}</td>
            <td>{when(sale.postedAt)}</td>
            <td>{sale.tenders.join(", ")}</td>
            <td className="num">RM {sale.grandTotal}</td>
          </tr>
        ))}
        {data.recentSales.length === 0 && (
          <tr>
            <td colSpan={5}>No sales yet. Take a sale on the POS.</td>
          </tr>
        )}
      </Table>
      <h2>Business days</h2>
      <Table caption="Business days" head={["Business date", "Status", "Opened", "Closed", ""]}>
        {data.businessDays.map((day) => (
          <tr key={day.businessDayId}>
            <td>{day.businessDate}</td>
            <td>
              <Pill tone={day.status === "OPEN" ? "good" : "muted"}>{day.status}</Pill>
            </td>
            <td>{when(day.openedAt)}</td>
            <td>{when(day.closedAt)}</td>
            <td className="num">
              {day.businessDayId === openDay?.businessDayId && (
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    closeKeyRef.current ??= globalThis.crypto.randomUUID();
                    void api.closeBusinessDay(closeKeyRef.current, day.businessDayId).then(
                      () => {
                        closeKeyRef.current = null;
                        notify(`Business Day ${day.businessDate} closed.`);
                        return reload();
                      },
                      (error: unknown) => {
                        if (!(error instanceof ApiProblem) || error.code !== "UNREACHABLE") {
                          closeKeyRef.current = null;
                        }
                        notify(reason(error));
                      },
                    );
                  }}
                >
                  Close Business Day
                </button>
              )}
            </td>
          </tr>
        ))}
        {data.businessDays.length === 0 && (
          <tr>
            <td colSpan={5}>A Business Day opens with the first shift.</td>
          </tr>
        )}
      </Table>
    </>
  );
}

function ProductsPage({ api, notify }: PageProps) {
  const createKeyRef = useRef<string | null>(null);
  const load = useCallback(() => api.items(), [api]);
  const [data, reload] = useLoad(load, notify);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    itemCode: "",
    name: "",
    categoryName: "",
    barcode: "",
    sellingPrice: "",
    openingQuantity: "",
    openingUnitCost: "",
  });
  const field = (key: keyof typeof form, label: string, props: { required?: boolean } = {}) => (
    <label>
      {label}
      <input
        value={form[key]}
        required={props.required}
        onChange={(event) => setForm({ ...form, [key]: event.target.value })}
      />
    </label>
  );
  const valid =
    form.itemCode.trim() !== "" &&
    form.name.trim() !== "" &&
    AMOUNT.test(form.sellingPrice) &&
    (form.openingQuantity === "" || /^\d{1,9}$/.test(form.openingQuantity)) &&
    (form.openingUnitCost === "" || AMOUNT.test(form.openingUnitCost));

  function submit(event: FormEvent) {
    event.preventDefault();
    const optional = Object.fromEntries(
      (["categoryName", "barcode", "openingQuantity", "openingUnitCost"] as const)
        .filter((key) => form[key].trim() !== "")
        .map((key) => [key, form[key].trim()]),
    );
    createKeyRef.current ??= globalThis.crypto.randomUUID();
    void api
      .createItem(createKeyRef.current, {
        itemCode: form.itemCode.trim(),
        name: form.name.trim(),
        sellingPrice: form.sellingPrice,
        ...optional,
      })
      .then(
        (item) => {
          createKeyRef.current = null;
          notify(`${item.name} created.`);
          setCreating(false);
          setForm({
            itemCode: "",
            name: "",
            categoryName: "",
            barcode: "",
            sellingPrice: "",
            openingQuantity: "",
            openingUnitCost: "",
          });
          return reload();
        },
        (error: unknown) => {
          // Keep the key only when the outcome is unknown, so a retry cannot create a second item.
          if (!(error instanceof ApiProblem) || error.code !== "UNREACHABLE") {
            createKeyRef.current = null;
          }
          notify(reason(error));
        },
      );
  }

  return (
    <>
      <div className="page-head">
        <h1>Products</h1>
        <button
          type="button"
          className="button button--primary"
          onClick={() => setCreating(!creating)}
        >
          {creating ? "Cancel" : "New Product"}
        </button>
      </div>
      {creating && (
        <form className="panel form-grid" onSubmit={submit} aria-label="New product">
          {field("itemCode", "Item code", { required: true })}
          {field("name", "Name", { required: true })}
          {field("categoryName", "Category")}
          {field("barcode", "Barcode")}
          {field("sellingPrice", "Selling price (RM)", { required: true })}
          {field("openingQuantity", "Opening quantity")}
          {field("openingUnitCost", "Opening unit cost (RM)")}
          <div className="form-actions">
            <button type="submit" className="button button--primary" disabled={!valid}>
              Create Product
            </button>
          </div>
        </form>
      )}
      <Table
        caption="Products"
        head={["Product", "Item code", "Category", "Barcode", "Unit", num("Price"), num("On hand")]}
      >
        {(data?.items ?? []).map((item) => (
          <tr key={item.itemId}>
            <td className="strong">{item.name}</td>
            <td className="mono">{item.itemCode}</td>
            <td>{item.categoryName ?? "—"}</td>
            <td className="mono">{item.barcode ?? "—"}</td>
            <td>{item.uomCode}</td>
            <td className="num">{item.sellingPrice === null ? "—" : `RM ${item.sellingPrice}`}</td>
            <td className="num">{item.onHand ?? "Not stock-managed"}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}

function InventoryPage({ api, notify }: PageProps) {
  const loadItems = useCallback(() => api.items(), [api]);
  const loadMovements = useCallback(() => api.movements(), [api]);
  const [items, reloadItems] = useLoad(loadItems, notify);
  const [movements, reloadMovements] = useLoad(loadMovements, notify);
  const [target, setTarget] = useState<CatalogItem | null>(null);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [cost, setCost] = useState("");
  const keyRef = useRef<string | null>(null);
  const valid =
    SIGNED_QUANTITY.test(quantity) &&
    Number(quantity) !== 0 &&
    note.trim() !== "" &&
    (cost === "" || AMOUNT.test(cost));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (target === null) return;
    keyRef.current ??= globalThis.crypto.randomUUID();
    void api
      .adjust(keyRef.current, {
        itemId: target.itemId,
        quantityDelta: quantity,
        reason: note.trim(),
        ...(cost === "" || Number(quantity) < 0 ? {} : { unitCost: cost }),
      })
      .then(
        (posted) => {
          keyRef.current = null;
          notify(`${target.name} adjusted. On hand is now ${posted.onHandAfter}.`);
          setTarget(null);
          setQuantity("");
          setNote("");
          setCost("");
          return Promise.all([reloadItems(), reloadMovements()]);
        },
        (error: unknown) => {
          if (!(error instanceof ApiProblem) || error.code !== "UNREACHABLE") keyRef.current = null;
          notify(reason(error));
        },
      );
  }

  const tracked = (items?.items ?? []).filter((item) => item.stockManaged);
  return (
    <>
      <div className="page-head">
        <h1>Inventory</h1>
        <span className="note">Stock changes only through the immutable stock ledger</span>
      </div>
      {target !== null && (
        <form className="panel form-grid" onSubmit={submit} aria-label="Stock adjustment">
          <p className="form-title">
            Adjust <strong>{target.name}</strong> · on hand {target.onHand} {target.uomCode}
          </p>
          <label>
            Quantity change (use − to decrease)
            <input value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label>
            Reason
            <input value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <label>
            Unit cost for an increase (RM, optional)
            <input value={cost} onChange={(event) => setCost(event.target.value)} />
          </label>
          <div className="form-actions">
            <button type="button" className="button" onClick={() => setTarget(null)}>
              Cancel
            </button>
            <button type="submit" className="button button--primary" disabled={!valid}>
              Post Adjustment
            </button>
          </div>
        </form>
      )}
      <Table
        caption="Stock positions"
        head={[
          "Product",
          "Item code",
          num("On hand"),
          num("Moving WAC"),
          num("Stock value"),
          "Status",
          "",
        ]}
      >
        {tracked.map((item) => (
          <tr key={item.itemId}>
            <td className="strong">{item.name}</td>
            <td className="mono">{item.itemCode}</td>
            <td className="num">
              {item.onHand} {item.uomCode}
            </td>
            <td className="num">RM {item.movingWac}</td>
            <td className="num">RM {item.stockValue}</td>
            <td>
              <Pill tone={item.onHand === "0" ? "warn" : "good"}>
                {item.onHand === "0" ? "Zero stock" : "In stock"}
              </Pill>
            </td>
            <td className="num">
              <button type="button" className="button" onClick={() => setTarget(item)}>
                Adjust
              </button>
            </td>
          </tr>
        ))}
      </Table>
      <h2>Movement history</h2>
      <Table
        caption="Stock movements"
        head={["When", "Business date", "Product", "Type", num("Quantity"), num("Unit cost")]}
      >
        {(movements?.movements ?? []).map((movement: Movement) => (
          <tr key={movement.stockMovementId}>
            <td>{when(movement.occurredAt)}</td>
            <td>{movement.businessDate}</td>
            <td>{movement.itemName}</td>
            <td>{movement.movementType.replaceAll("_", " ")}</td>
            <td className="num">{movement.quantityDelta}</td>
            <td className="num">RM {movement.unitCost}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}

function SalesPage({ api, notify }: PageProps) {
  const load = useCallback(() => api.sales(), [api]);
  const [data] = useLoad(load, notify);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  return (
    <>
      <div className="page-head">
        <h1>Sales</h1>
        <span className="note">Completed sales are immutable</span>
      </div>
      <div className="split">
        <Table
          caption="Sales"
          head={["Receipt", "Counter", "Business date", "Posted", "Tender", num("Total"), ""]}
        >
          {(data?.sales ?? []).map((sale: SaleSummary) => (
            <tr key={sale.saleId}>
              <td className="mono">{sale.documentNo}</td>
              <td>{sale.counterCode}</td>
              <td>{sale.businessDate}</td>
              <td>{when(sale.postedAt)}</td>
              <td>{sale.tenders.join(", ")}</td>
              <td className="num">RM {sale.grandTotal}</td>
              <td className="num">
                <button
                  type="button"
                  className="button"
                  onClick={() =>
                    void api
                      .receipt(sale.saleId)
                      .then(setReceipt, (error: unknown) => notify(reason(error)))
                  }
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          {data?.sales.length === 0 && (
            <tr>
              <td colSpan={7}>No sales yet.</td>
            </tr>
          )}
        </Table>
        {receipt !== null && (
          <aside className="panel" aria-label="Sale detail">
            <p className="form-title">
              <strong className="mono">{receipt.documentNo}</strong> · {when(receipt.postedAt)}
            </p>
            <Table caption="Sale lines" head={["Item", num("Qty"), num("Price"), num("Total")]}>
              {receipt.lines.map((line) => (
                <tr key={line.lineNo}>
                  <td>{line.itemName}</td>
                  <td className="num">{line.quantity}</td>
                  <td className="num">{line.unitPrice}</td>
                  <td className="num">{line.lineTotal}</td>
                </tr>
              ))}
            </Table>
            <p className="total">Total RM {receipt.grandTotal}</p>
            {receipt.tenders.map((tender, index) => (
              <p className="note" key={index}>
                {tender.methodCode} RM {tender.amount}
                {tender.reference === null ? "" : ` · ${tender.reference}`}
              </p>
            ))}
          </aside>
        )}
      </div>
    </>
  );
}

function CashPage({ api, notify }: PageProps) {
  const load = useCallback(() => api.shifts(), [api]);
  const [data] = useLoad(load, notify);
  const [detail, setDetail] = useState<ShiftDetail | null>(null);
  return (
    <>
      <div className="page-head">
        <h1>Cash &amp; Shifts</h1>
        <span className="note">Expected cash is derived from cash movements, never edited</span>
      </div>
      <div className="split">
        <Table
          caption="Shifts"
          head={[
            "Counter",
            "Cashier",
            "Business date",
            "Status",
            num("Opening"),
            num("Expected"),
            num("Counted"),
            num("Variance"),
            "",
          ]}
        >
          {(data?.shifts ?? []).map((shift: Shift) => (
            <tr key={shift.shiftId}>
              <td>{shift.counterCode}</td>
              <td>{shift.cashier}</td>
              <td>{shift.businessDate}</td>
              <td>
                <Pill tone={shift.status === "OPEN" ? "good" : "muted"}>{shift.status}</Pill>
              </td>
              <td className="num">{shift.openingCash}</td>
              <td className="num">{shift.expectedCash}</td>
              <td className="num">{shift.countedCash ?? "—"}</td>
              <td className="num">{shift.variance ?? "—"}</td>
              <td className="num">
                <button
                  type="button"
                  className="button"
                  onClick={() =>
                    void api
                      .shift(shift.shiftId)
                      .then(setDetail, (error: unknown) => notify(reason(error)))
                  }
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          {data?.shifts.length === 0 && (
            <tr>
              <td colSpan={9}>No shifts yet. Open a shift on the POS.</td>
            </tr>
          )}
        </Table>
        {detail !== null && (
          <aside className="panel" aria-label="Shift detail">
            <p className="form-title">
              <strong>{detail.counterCode}</strong> · {detail.cashier} · opened{" "}
              {when(detail.openedAt)}
            </p>
            <Table caption="Cash movements" head={["When", "Type", "Reason", num("Amount")]}>
              {detail.cashMovements.map((movement) => (
                <tr key={movement.cashMovementId}>
                  <td>{when(movement.occurredAt)}</td>
                  <td>{movement.movementType.replaceAll("_", " ")}</td>
                  <td>{movement.reasonCode ?? "—"}</td>
                  <td className="num">{movement.amount}</td>
                </tr>
              ))}
            </Table>
            <p className="note">
              Tenders:{" "}
              {detail.tenders
                .map((tender) => `${tender.methodCode} RM ${tender.amount}`)
                .join(" · ") || "none"}
            </p>
          </aside>
        )}
      </div>
    </>
  );
}

export function BackOfficeApp({ api = backOfficeApi }: { api?: BackOfficeApi }) {
  const [page, setPage] = useState<Page>("dashboard");
  const [overview, setOverview] = useState<StoreOverview | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const notify = useCallback((text: string) => setMessage(text), []);

  useEffect(() => {
    void api.context().then(
      (context) => {
        setOverview(context);
        setOnline(true);
      },
      () => setOnline(false),
    );
  }, [api]);

  const groups = [...new Set(pages.map((entry) => entry.group))];
  const props = { api, notify };
  return (
    <div className="bo-shell">
      <aside className="bo-sidebar">
        <div className="bo-brand">
          <span className="bo-brand__mark">
            <Store size={16} aria-hidden="true" />
          </span>
          <div>
            <strong>MINIMART</strong>
            <span>Back Office</span>
          </div>
        </div>
        <nav aria-label="Back Office sections">
          {groups.map((group) => (
            <div key={group} className="bo-nav-group">
              <span>{group}</span>
              {pages
                .filter((entry) => entry.group === group)
                .map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={page === id ? "is-active" : ""}
                    aria-current={page === id ? "page" : undefined}
                    onClick={() => {
                      setPage(id);
                      setMessage("");
                    }}
                  >
                    <Icon size={15} aria-hidden="true" /> {label}
                  </button>
                ))}
            </div>
          ))}
        </nav>
        <p className="bo-sidebar__foot">
          Demonstration build · other modules are not implemented yet
        </p>
      </aside>
      <div className="bo-main">
        <header className="bo-top">
          <span>
            <strong>{overview?.store?.companyDisplayName ?? "MiniMart"}</strong> · Store{" "}
            <strong>{overview?.store?.displayName ?? "—"}</strong> · {overview?.calendarDate ?? ""}
          </span>
          <span className="bo-top__right">
            <Pill tone={online === true ? "good" : "warn"}>
              {online === null
                ? "Store Node · Checking"
                : online
                  ? "Store Node online"
                  : "Store Node unavailable"}
            </Pill>
            <span>store.manager</span>
          </span>
        </header>
        {message !== "" && (
          <p className="bo-message" role="status" aria-live="polite">
            {message}
          </p>
        )}
        <main className="bo-content">
          {online === false ? (
            <div className="panel" role="alert">
              <h1>Store Node unavailable</h1>
              <p className="note">
                Back Office operations need the Store Node. Start the demo server and reload.
              </p>
            </div>
          ) : (
            <>
              {page === "dashboard" && <DashboardPage {...props} />}
              {page === "products" && <ProductsPage {...props} />}
              {page === "inventory" && <InventoryPage {...props} />}
              {page === "sales" && <SalesPage {...props} />}
              {page === "cash" && <CashPage {...props} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
