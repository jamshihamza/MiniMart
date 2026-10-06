import {
  ArchiveRestore,
  Banknote,
  CircleCheck,
  CreditCard,
  Minus,
  Pause,
  Percent,
  Plus,
  QrCode,
  ScanBarcode,
  StickyNote,
  Trash2,
  User,
  UserRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { Glyph, StubButton } from "../components/StubButton.js";
import { HELD_SALES_COUNT, PREVIEW_CART, PREVIEW_SELECTED_LINE } from "../fixtures.js";
import type { PreviewTotals } from "../fixtures.js";
import { PREVIEW_CUSTOMERS } from "../fixtures-flow.js";
import type { Tender } from "../screens.js";

const METHODS: readonly {
  label: string;
  icon: LucideIcon;
  tender: Tender | null;
}[] = [
  { label: "Cash", icon: Banknote, tender: "cash" },
  { label: "Card", icon: CreditCard, tender: "card" },
  { label: "DuitNow", icon: QrCode, tender: "qr" },
  { label: "Other", icon: Wallet, tender: null },
];

export interface CartActions {
  readonly onSelectCustomer: () => void;
  readonly onClear: () => void;
  readonly onDiscount: () => void;
  readonly onHold: () => void;
  readonly onRecall: () => void;
  readonly onComplete: () => void;
  readonly onPay: (tender: Tender) => void;
}

/**
 * Current Sale panel. Lines, quantities and totals are fixed fictional strings. Buttons that open a
 * reference dialog or swap a fictional state work locally; the others are identified stubs.
 */
export function CartPanel({
  populated,
  totals,
  paymentEnabled,
  customerAttached,
  actions,
}: {
  readonly populated: boolean;
  readonly totals: PreviewTotals;
  /** False while the simulated Store Node offline state is shown. */
  readonly paymentEnabled: boolean;
  readonly customerAttached: boolean;
  readonly actions: CartActions;
}) {
  const [selected, setSelected] = useState<string | null>(populated ? PREVIEW_SELECTED_LINE : null);
  const empty = !populated;
  const canPay = !empty && paymentEnabled;
  const attached = PREVIEW_CUSTOMERS[0];

  return (
    <aside className="cart" aria-label="Current sale">
      <div className="cart__head">
        <h2 className="cart__title">Current Sale</h2>
        <span className="cart__count">{totals.itemCount}</span>
        <button
          type="button"
          className={`cart__clear${empty ? "" : " is-active"}`}
          disabled={empty}
          onClick={actions.onClear}
        >
          <Glyph icon={Trash2} size={15} />
          Clear
        </button>
      </div>

      <div className="customer">
        <div className={`customer__avatar${customerAttached ? " is-attached" : ""}`}>
          <Glyph icon={customerAttached ? UserRound : User} size={17} />
        </div>
        <div className="customer__text">
          <span className="customer__name">
            {customerAttached ? (attached?.name ?? "") : "Walk-in Customer"}
          </span>
          <span className="customer__sub">
            {customerAttached
              ? `Member ${attached?.member ?? ""} · ${attached?.phone ?? ""}`
              : "No customer attached"}
          </span>
        </div>
        <button
          type="button"
          className="customer__btn"
          aria-label={customerAttached ? "Change customer" : "Select customer"}
          onClick={actions.onSelectCustomer}
        >
          {customerAttached ? "Change" : "Select"}
        </button>
      </div>

      <div className="cart__lines">
        {empty ? (
          <div className="cart__empty">
            <div className="cart__emptyicon">
              <Glyph icon={ScanBarcode} size={24} />
            </div>
            <span className="cart__emptytitle">Cart is empty</span>
            <span className="cart__emptytext">
              Scan a barcode or select a product to start a sale.
            </span>
            <button type="button" className="cart__recall" onClick={actions.onRecall}>
              <Glyph icon={ArchiveRestore} size={15} />
              Recall held sale · {HELD_SALES_COUNT}
            </button>
          </div>
        ) : (
          <ul className="lines" aria-label="Sale lines">
            {PREVIEW_CART.map((line) => (
              <li key={line.id} className={`line${selected === line.id ? " is-selected" : ""}`}>
                <button
                  type="button"
                  className="line__select"
                  aria-pressed={selected === line.id}
                  onClick={() => setSelected(line.id)}
                >
                  <span className="line__name">{line.name}</span>
                  <span className="line__detail">
                    {line.unit} each · {line.category}
                  </span>
                </button>
                <div className="stepper">
                  <StubButton
                    label="Decrease quantity"
                    className="stepper__btn"
                    aria-label="Decrease quantity"
                  >
                    <Glyph icon={Minus} size={15} />
                  </StubButton>
                  <span className="stepper__qty">{line.quantity}</span>
                  <StubButton
                    label="Increase quantity"
                    className="stepper__btn"
                    aria-label="Increase quantity"
                  >
                    <Glyph icon={Plus} size={15} />
                  </StubButton>
                </div>
                <span className="line__total">{line.lineTotal}</span>
                <StubButton label="Remove item" className="line__remove" aria-label="Remove item">
                  <Glyph icon={Trash2} size={15} />
                </StubButton>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="actions">
        <StubButton label="Note" className="actions__btn">
          <Glyph icon={StickyNote} size={14} />
          Note
        </StubButton>
        <button
          type="button"
          className="actions__btn"
          disabled={empty}
          onClick={actions.onDiscount}
        >
          <Glyph icon={Percent} size={14} />
          Discount
        </button>
        <button type="button" className="actions__btn" disabled={empty} onClick={actions.onHold}>
          <Glyph icon={Pause} size={14} />
          Hold<span className="sr-only"> sale</span>
        </button>
        <button type="button" className="actions__btn" onClick={actions.onRecall}>
          <Glyph icon={ArchiveRestore} size={14} />
          Recall · {HELD_SALES_COUNT}
        </button>
      </div>

      <dl className="totals">
        <div className="totals__row">
          <dt>Subtotal</dt>
          <dd className="totals__val">{totals.subtotal}</dd>
        </div>
        <div className="totals__row">
          <dt>Discount</dt>
          <dd className="totals__val totals__val--discount">{totals.discount}</dd>
        </div>
        <div className="totals__row">
          <dt>Tax</dt>
          <dd className="totals__val">{totals.tax}</dd>
        </div>
        <div className="totals__row">
          <dt>
            Rounding <span className="totals__note">(cash only)</span>
          </dt>
          <dd className="totals__val">{totals.rounding}</dd>
        </div>
        <div className="totals__grand">
          <dt>TOTAL</dt>
          <dd className="totals__grandval">{totals.total}</dd>
        </div>
      </dl>
      <p className="sr-only">
        Fictional preview amounts. No price, discount, tax, rounding or change is calculated.
      </p>

      <div className="pay">
        <div className="pay__methods" aria-label="Payment methods">
          {METHODS.map((method) => {
            const tender = method.tender;
            return canPay && tender !== null ? (
              <button
                key={method.label}
                type="button"
                className="pay__method"
                onClick={() => actions.onPay(tender)}
              >
                <Glyph icon={method.icon} size={18} />
                <span>{method.label}</span>
              </button>
            ) : (
              <button
                key={method.label}
                type="button"
                className="pay__method"
                disabled
                title={tender === null ? "Not configured for this store" : method.label}
              >
                <Glyph icon={method.icon} size={18} />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={`pay__complete${canPay ? "" : " is-off"}`}
          disabled={!canPay}
          onClick={actions.onComplete}
        >
          <span className="pay__completelabel">
            <Glyph icon={CircleCheck} size={20} />
            Complete Sale
          </span>
          <span>{totals.total}</span>
        </button>
      </div>
    </aside>
  );
}
