import {
  Banknote,
  Check,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock,
  CreditCard,
  HandCoins,
  Lock,
  Minus,
  Package,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  ScanBarcode,
  Undo2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Dialog } from "../dialogs/Dialog.js";
import { Glyph, StubButton } from "../components/StubButton.js";
import { HISTORY_ROWS, RETURN_LINES, RETURN_SALE, RETURN_SUMMARY } from "../fixtures-flow.js";

const STEPS = ["Find sale", "Select items", "Refund"] as const;

const TENDER_ICON: Record<string, LucideIcon> = {
  Cash: Banknote,
  Card: CreditCard,
  "DuitNow QR": QrCode,
};

/** Fictional refund-state legend of reference screen 21. */
const REFUND_STATES: readonly { label: string; icon: LucideIcon; tone: string }[] = [
  { label: "Pending", icon: Clock, tone: "info" },
  { label: "Refunded", icon: CircleCheck, tone: "ok" },
  { label: "Failed", icon: CircleX, tone: "bad" },
  { label: "Unconfirmed", icon: CircleHelp, tone: "warn" },
];

function Stepper({ step }: { readonly step: 1 | 2 | 3 }) {
  return (
    <ol className="retsteps" aria-label="Return steps">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const done = number < step;
        const current = number === step;
        return (
          <li key={label} className="retstep" aria-current={current ? "step" : undefined}>
            <span className={`retstep__dot${done ? " is-done" : current ? " is-current" : ""}`}>
              {done ? <Glyph icon={Check} size={13} /> : String(number)}
            </span>
            <span className={`retstep__label${current ? " is-current" : ""}`}>{label}</span>
            {index < STEPS.length - 1 ? (
              <span className="retstep__line" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function FindSale({ onPick }: { readonly onPick: () => void }) {
  return (
    <>
      <div className="retcard retcard--find">
        <span className="retcard__title">Find the original sale</span>
        <div className="findrow">
          <div className="findrow__box">
            <Glyph icon={ScanBarcode} size={20} />
            <input
              className="findrow__input"
              aria-label="Scan receipt barcode or enter receipt number"
              placeholder="Scan receipt barcode or enter receipt number"
            />
          </div>
          <StubButton label="Find sale" className="findrow__btn">
            Find sale
          </StubButton>
        </div>
        <span className="retcard__note">
          Only posted sales from this store can be returned. The original sale is never edited; the
          return is recorded as a separate transaction.
        </span>
      </div>
      <div className="retrecent">
        <div className="retrecent__head">Recent sales on POS-01 · today</div>
        {HISTORY_ROWS.slice(0, 5).map((row) => (
          <div key={row.receipt} className="retrecent__row">
            <span className="retrecent__receipt">{row.receipt}</span>
            <span className="retrecent__time">{row.time}</span>
            <span>{row.customer}</span>
            <span className="is-right retrecent__total">{row.total}</span>
            <span className="retrecent__tender">
              <Glyph icon={TENDER_ICON[row.tender] ?? Banknote} size={14} />
              {row.tender}
            </span>
            <button
              type="button"
              className="retrecent__btn"
              aria-label={`Select ${row.receipt}`}
              onClick={onPick}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function SelectItems({ onReview }: { readonly onReview: () => void }) {
  return (
    <div className="retselect">
      <div className="retlines">
        <div className="retlines__head">
          <div className="retlines__sale">
            <span className="retlines__k">Original sale</span>
            <span className="retlines__no">{RETURN_SALE.receipt}</span>
          </div>
          <span className="retlines__meta">{RETURN_SALE.meta}</span>
          <span className="posted">
            <Glyph icon={Lock} size={12} />
            Posted
          </span>
        </div>
        <div className="retline retline--head" aria-hidden="true">
          <span />
          <span>ITEM</span>
          <span className="is-right">SOLD</span>
          <span className="is-right">RETURNABLE</span>
          <span className="is-center">RETURN QTY</span>
          <span className="is-right">REFUND</span>
        </div>
        {RETURN_LINES.map((line) => {
          const on = line.quantity !== "0";
          return (
            <div key={line.name} className={`retline${on ? " is-on" : ""}`}>
              <span className={`check${on ? " is-on" : ""}`} aria-hidden="true">
                <span className="check__mark">{on ? <Glyph icon={Check} size={13} /> : null}</span>
              </span>
              <span className="retline__item">
                <span className="retline__name">{line.name}</span>
                <span className="retline__unit">{line.unit} each</span>
              </span>
              <span className="is-right retline__num">{line.sold}</span>
              <span className="is-right retline__num">{line.sold}</span>
              <div className="stepper stepper--ret">
                <StubButton
                  label="Decrease"
                  className="stepper__btn"
                  aria-label={`Decrease ${line.name}`}
                >
                  <Glyph icon={Minus} size={15} />
                </StubButton>
                <span className="stepper__qty stepper__qty--ret">{line.quantity}</span>
                <StubButton
                  label="Increase"
                  className="stepper__btn"
                  aria-label={`Increase ${line.name}`}
                >
                  <Glyph icon={Plus} size={15} />
                </StubButton>
              </div>
              <span className="is-right retline__refund">{line.amount}</span>
            </div>
          );
        })}
        <div className="retreason">
          <span className="retreason__label">Return reason</span>
          <StubButton label="Return reason" className="retreason__select">
            <span>Damaged packaging</span>
            <Glyph icon={ChevronDown} size={14} />
          </StubButton>
        </div>
      </div>
      <div className="retsummary">
        <span className="retsummary__title">Return summary</span>
        <div className="retsummary__rows">
          <div className="retsummary__row">
            <span className="retsummary__k">Items returning</span>
            <span className="retsummary__v">{RETURN_SUMMARY.units}</span>
          </div>
          <div className="retsummary__row">
            <span className="retsummary__k">Back to stock</span>
            <span className="retsummary__v">Yes · reason recorded</span>
          </div>
          <div className="retsummary__due">
            <span className="retsummary__duelabel">REFUND DUE</span>
            <span className="retsummary__dueamount">{RETURN_SUMMARY.refund}</span>
          </div>
        </div>
        <div className="retsummary__tender">
          <span className="retsummary__k">Refund to original tender</span>
          <span className="retsummary__tendername">
            <Glyph icon={CreditCard} size={16} />
            Card •••• 4821
          </span>
        </div>
        <span className="retsummary__note">
          The return is recorded when you confirm. The card refund is sent to the terminal and
          confirmed separately.
        </span>
        <button type="button" className="retsummary__btn" onClick={onReview}>
          Review return
        </button>
      </div>
    </div>
  );
}

function Recorded({ onDone }: { readonly onDone: () => void }) {
  return (
    <>
      <div className="retdone">
        <div className="retdone__card">
          <div className="retdone__head">
            <div className="retdone__icon retdone__icon--ok">
              <Glyph icon={CircleCheck} size={21} />
            </div>
            <div className="retdone__text">
              <span className="retdone__eyebrow retdone__eyebrow--ok">RETURN · RECORDED</span>
              <span className="retdone__title">3 units returned to stock</span>
            </div>
          </div>
          <div className="retdone__facts">
            <span className="retdone__k">Return ref</span>
            <span className="retdone__mono">RT-POS01-000019</span>
            <span className="retdone__k">Original sale</span>
            <span className="retdone__mono">POS01-000131</span>
            <span className="retdone__k">Items</span>
            <span>Cream Crackers × 2, Cola × 1</span>
            <span className="retdone__k">Reason</span>
            <span>Damaged packaging</span>
          </div>
        </div>
        <div className="retdone__card retdone__card--warn">
          <div className="retdone__head">
            <div className="retdone__icon retdone__icon--warn">
              <Glyph icon={CircleHelp} size={21} />
            </div>
            <div className="retdone__text">
              <span className="retdone__eyebrow retdone__eyebrow--warn">REFUND · UNCONFIRMED</span>
              <span className="retdone__title">RM 15.40 to Card •••• 4821</span>
            </div>
          </div>
          <span className="retdone__body">
            The terminal didn&apos;t confirm whether the refund went through. Check the terminal
            before refunding again.
          </span>
          <div className="retdone__timeline">
            <div className="retdone__event">
              <span className="retdone__ok">
                <Glyph icon={CircleCheck} size={15} />
              </span>
              <span className="retdone__eventlabel">Refund requested</span>
              <span className="retdone__time">14:41:10</span>
            </div>
            <div className="retdone__event">
              <span className="retdone__ok">
                <Glyph icon={CircleCheck} size={15} />
              </span>
              <span className="retdone__eventlabel">Sent to terminal T-01</span>
              <span className="retdone__time">14:41:12</span>
            </div>
            <div className="retdone__event">
              <span className="retdone__warn">
                <Glyph icon={CircleHelp} size={15} />
              </span>
              <span className="retdone__eventlabel is-bold">Result not received</span>
              <span className="retdone__time">—</span>
            </div>
          </div>
          <div className="retdone__actions">
            <StubButton label="Check refund status" className="dbtn dbtn--primary">
              <Glyph icon={RefreshCw} size={15} />
              Check refund status
            </StubButton>
            <StubButton label="Get manager help" className="dbtn">
              Get manager help
            </StubButton>
          </div>
        </div>
      </div>
      <div className="retstates">
        <span className="retstates__title">Refund states</span>
        {REFUND_STATES.map((state) => (
          <span key={state.label} className={`statepill statepill--${state.tone}`}>
            <Glyph icon={state.icon} size={13} />
            {state.label}
          </span>
        ))}
        <div className="retstates__actions">
          <StubButton label="Print return slip" className="dbtn dbtn--h36">
            <Glyph icon={Printer} size={15} />
            Print return slip
          </StubButton>
          <button type="button" className="dbtn dbtn--h36" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}

/** Returns flow (reference screens 18 to 21). Steps and amounts are fixed fictional states. */
export function ReturnsPage({
  step,
  onPickSale,
  onReview,
  onDone,
}: {
  readonly step: 1 | 2 | 3;
  readonly onPickSale: () => void;
  readonly onReview: () => void;
  readonly onDone: () => void;
}) {
  return (
    <section className="returns" aria-labelledby="returns-title">
      <div className="returns__head">
        <h1 id="returns-title" className="returns__h1">
          Returns
        </h1>
        <Stepper step={step} />
      </div>
      {step === 1 ? <FindSale onPick={onPickSale} /> : null}
      {step === 2 ? <SelectItems onReview={onReview} /> : null}
      {step === 3 ? <Recorded onDone={onDone} /> : null}
    </section>
  );
}

export function ReturnConfirmDialog({
  onClose,
  onConfirm,
}: {
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}) {
  return (
    <Dialog title="Confirm return and refund" icon={Undo2} width="620px" onClose={onClose}>
      <div className="dlg__body dlg__body--gap12">
        <span className="dlg-text">
          This creates a return against POS01-000131. The original sale stays unchanged.
        </span>
        <div className="retconfirm">
          <div className="retconfirm__card">
            <span className="retconfirm__eyebrow">
              <Glyph icon={Package} size={14} />1 · RETURN
            </span>
            <span className="retconfirm__title">3 units back to stock</span>
            <span className="retconfirm__text">
              Cream Crackers 400 g × 2
              <br />
              Cola 1.5 L × 1
              <br />
              Reason: Damaged packaging
            </span>
            <span className="retconfirm__ok">Recorded immediately</span>
          </div>
          <div className="retconfirm__card">
            <span className="retconfirm__eyebrow">
              <Glyph icon={HandCoins} size={14} />2 · REFUND
            </span>
            <span className="retconfirm__amount">RM 15.40</span>
            <span className="retconfirm__text">To Card •••• 4821 via terminal T-01</span>
            <span className="retconfirm__info">Confirmed by the terminal separately</span>
          </div>
        </div>
      </div>
      <div className="dlg__foot dlg__foot--end">
        <button type="button" className="dbtn dbtn--h42" onClick={onClose}>
          Back
        </button>
        <button type="button" className="dbtn dbtn--h42 dbtn--primary" onClick={onConfirm}>
          Confirm return · Refund RM 15.40
        </button>
      </div>
    </Dialog>
  );
}
