import {
  Banknote,
  ChevronRight,
  CircleCheck,
  CreditCard,
  LoaderCircle,
  Lock,
  LogIn,
  LogOut,
  Minus,
  Plus,
  QrCode,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Glyph, StubButton } from "../components/StubButton.js";
import { SHIFT_CLOSE, SHIFT_COUNT, SHIFT_COUNT_FOCUS } from "../fixtures-flow.js";

/*
 * Fictional shift figures from the approved reference (screens 22 and 23). They are fixed display
 * strings. The product code does not total, count or reconcile anything.
 */
const CURRENT_SHIFT: readonly (readonly [string, string, boolean?])[] = [
  ["Cashier", "Demo Cashier"],
  ["Register", "POS-01"],
  ["Business date", "Sat, 26 Sep 2026"],
  ["Opened", "08:00 · 6 h 32 m"],
  ["Shift ref", SHIFT_CLOSE.ref, true],
];

const DRAWER_ROWS: readonly (readonly [string, string])[] = [
  ["Opening cash", "RM 200.00"],
  ["Cash sales", "RM 612.40"],
  ["Cash in", "RM 0.00"],
  ["Cash out", "−RM 50.00"],
];

const SALES_ROWS: readonly { icon: LucideIcon; label: string; amount: string }[] = [
  { icon: Banknote, label: "Cash · 24", amount: "RM 612.40" },
  { icon: CreditCard, label: "Card · 9", amount: "RM 388.20" },
  { icon: QrCode, label: "DuitNow QR · 8", amount: "RM 283.70" },
];

function ShiftSteps({ closing }: { readonly closing: boolean }) {
  const steps: readonly {
    label: string;
    icon: LucideIcon;
    current: boolean;
    tone: "ok" | "warn" | "mute";
  }[] = [
    { label: "Open", icon: CircleCheck, current: !closing, tone: "ok" },
    { label: "Closing", icon: LoaderCircle, current: closing, tone: "warn" },
    { label: "Closed", icon: Lock, current: false, tone: "mute" },
  ];
  return (
    <ol className="shiftsteps" aria-label="Shift status">
      {steps.map((step, index) => (
        <li key={step.label} className="shiftstep" aria-current={step.current ? "step" : undefined}>
          <span className={`shiftpill${step.current ? ` is-${step.tone}` : ""}`}>
            <Glyph icon={step.icon} size={13} />
            {step.label}
          </span>
          {index < steps.length - 1 ? (
            <span className="shiftarrow" aria-hidden="true">
              <Glyph icon={ChevronRight} size={14} />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** Shift screen (reference screens 22 and 23). Cash, counts and differences are fixed strings. */
export function ShiftPage({
  closing,
  onStartClose,
  onBack,
}: {
  readonly closing: boolean;
  readonly onStartClose: () => void;
  readonly onBack: () => void;
}) {
  return (
    <section className="shift" aria-labelledby="shift-title">
      <div className="shift__head">
        <h1 id="shift-title" className="shift__h1">
          Shift
        </h1>
        <ShiftSteps closing={closing} />
        {closing ? null : (
          <div className="shift__actions">
            <StubButton label="Cash in" className="dbtn dbtn--h40">
              <Glyph icon={Plus} size={15} />
              Cash in
            </StubButton>
            <StubButton label="Cash out" className="dbtn dbtn--h40">
              <Glyph icon={Minus} size={15} />
              Cash out
            </StubButton>
            <button type="button" className="dbtn dbtn--h40 dbtn--primary" onClick={onStartClose}>
              <Glyph icon={LogOut} size={15} />
              Close shift
            </button>
          </div>
        )}
      </div>

      {closing ? (
        <div className="shiftclose">
          <div className="count">
            <div className="count__head">
              <span className="count__title">Count cash in drawer</span>
              <span className="count__sub">Enter the number of notes and coins</span>
            </div>
            {SHIFT_COUNT.map((row) => (
              <div key={row.label} className="count__row">
                <span className="count__label">{row.label}</span>
                <div className="count__qtywrap">
                  <span className="count__times">×</span>
                  <div
                    className={`count__qty${row.label === SHIFT_COUNT_FOCUS ? " is-focus" : ""}`}
                    role="img"
                    aria-label={`${row.label} quantity ${row.quantity}`}
                  >
                    {row.quantity}
                  </div>
                </div>
                <span className="count__amount">{row.amount}</span>
              </div>
            ))}
          </div>
          <div className="closecard">
            <span className="closecard__title">Close shift {SHIFT_CLOSE.ref}</span>
            <div className="closecard__rows">
              <div className="closecard__row">
                <span className="closecard__k">Expected cash</span>
                <span className="closecard__v">{SHIFT_CLOSE.expected}</span>
              </div>
              <div className="closecard__row">
                <span className="closecard__k">Counted cash</span>
                <span className="closecard__v">{SHIFT_CLOSE.counted}</span>
              </div>
              <div className="closecard__diff">
                <span className="closecard__difflabel">
                  <Glyph icon={TriangleAlert} size={15} />
                  Difference
                </span>
                <span className="closecard__diffval">{SHIFT_CLOSE.difference}</span>
              </div>
            </div>
            <div className="field">
              <span className="field__label">Note</span>
              <div className="closecard__note">Add a note for the manager (optional)</div>
            </div>
            <div className="closecard__actions">
              <button type="button" className="closecard__back" onClick={onBack}>
                Back
              </button>
              <StubButton label="Close shift" className="closecard__confirm">
                Close shift
              </StubButton>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="shiftcards">
            <div className="shiftcard">
              <span className="shiftcard__title">CURRENT SHIFT</span>
              <div className="shiftcard__facts">
                {CURRENT_SHIFT.map(([key, value, mono]) => (
                  <div key={key} className="shiftcard__fact">
                    <span className="shiftcard__k">{key}</span>
                    <span className={mono === true ? "shiftcard__mono" : "shiftcard__v"}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shiftcard">
              <span className="shiftcard__title">CASH IN DRAWER</span>
              <div className="shiftcard__rows">
                {DRAWER_ROWS.map(([key, value]) => (
                  <div key={key} className="shiftcard__row">
                    <span className="shiftcard__rowk">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
                <div className="shiftcard__total">
                  <span className="shiftcard__totalk">Expected cash</span>
                  <span className="shiftcard__totalv">RM 762.40</span>
                </div>
              </div>
            </div>
            <div className="shiftcard">
              <span className="shiftcard__title">SALES THIS SHIFT</span>
              <div className="shiftcard__rows">
                {SALES_ROWS.map((row) => (
                  <div key={row.label} className="shiftcard__row">
                    <span className="shiftcard__rowicon">
                      <Glyph icon={row.icon} size={14} />
                      {row.label}
                    </span>
                    <span>{row.amount}</span>
                  </div>
                ))}
                <div className="shiftcard__total">
                  <span className="shiftcard__totalk">41 sales</span>
                  <span className="shiftcard__totalv">RM 1,284.30</span>
                </div>
              </div>
            </div>
          </div>
          <div className="moves">
            <div className="moves__title">Cash movements</div>
            <div className="move move--head" aria-hidden="true">
              <span>TIME</span>
              <span>TYPE</span>
              <span className="is-right">AMOUNT</span>
              <span>REASON</span>
              <span>BY</span>
            </div>
            <div className="move">
              <span className="move__time">11:15</span>
              <span className="move__type">
                <Glyph icon={Minus} size={14} />
                Cash out
              </span>
              <span className="is-right move__amount">−RM 50.00</span>
              <span>Supplier payment · ice delivery</span>
              <span className="move__by">Demo Cashier · approved by Manager</span>
            </div>
            <div className="move move--last">
              <span className="move__time">08:00</span>
              <span className="move__type">
                <Glyph icon={LogIn} size={14} />
                Opening cash
              </span>
              <span className="is-right move__amount">RM 200.00</span>
              <span>Shift opened</span>
              <span className="move__by">Demo Cashier</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
