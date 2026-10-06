import {
  ArrowLeft,
  Banknote,
  Check,
  Circle,
  CircleCheck,
  CircleHelp,
  CircleX,
  Coins,
  CreditCard,
  FileText,
  LoaderCircle,
  Plus,
  Printer,
  QrCode,
  Receipt,
  RefreshCw,
  Split,
  TriangleAlert,
  User,
  UserRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Glyph, StubButton } from "../components/StubButton.js";
import type { CardState, Tender } from "../screens.js";
import { Dialog } from "./Dialog.js";

/** All amounts on this page are fixed fictional strings from the approved reference. */
const TOTAL = "RM 46.60";

/*
 * Payment method tiles. The reference shows "Drawer ready", "Terminal T-01 ready" and "Provider
 * connected". No drawer, terminal or provider is connected or tested in this preview, so the
 * sub-labels say so instead.
 */
const PAY_TILES: readonly {
  tender: Tender | "other";
  label: string;
  sub: string;
  icon: LucideIcon;
  enabled: boolean;
}[] = [
  { tender: "cash", label: "Cash", sub: "Cash drawer · not tested", icon: Banknote, enabled: true },
  {
    tender: "card",
    label: "Card",
    sub: "Card terminal · not tested",
    icon: CreditCard,
    enabled: true,
  },
  {
    tender: "qr",
    label: "DuitNow QR",
    sub: "Provider · not connected",
    icon: QrCode,
    enabled: true,
  },
  { tender: "other", label: "Other", sub: "Not configured", icon: Wallet, enabled: false },
];

export function PayDialog({
  customerName,
  customerAttached,
  itemCount,
  onClose,
  onPick,
}: {
  readonly customerName: string;
  readonly customerAttached: boolean;
  readonly itemCount: string;
  readonly onClose: () => void;
  readonly onPick: (tender: Tender) => void;
}) {
  return (
    <Dialog title="Take payment" icon={Wallet} width="640px" onClose={onClose}>
      <div className="dlg__body dlg__body--gap14 dlg__body--pad18">
        <div className="duebox">
          <span className="duebox__label">Amount due</span>
          <span className="duebox__amount">{TOTAL}</span>
        </div>
        <div className="paytiles">
          {PAY_TILES.map((tile, index) =>
            tile.enabled && tile.tender !== "other" ? (
              <button
                key={tile.label}
                type="button"
                className={`paytile${index === 0 ? " is-first" : ""}`}
                onClick={() => onPick(tile.tender as Tender)}
              >
                <span className="paytile__icon">
                  <Glyph icon={tile.icon} size={21} />
                </span>
                <span className="paytile__text">
                  <span className="paytile__label">{tile.label}</span>
                  <span className="paytile__sub">
                    <span className="paytile__dot" aria-hidden="true" />
                    {tile.sub}
                  </span>
                </span>
              </button>
            ) : (
              <button key={tile.label} type="button" className="paytile is-off" disabled>
                <span className="paytile__icon">
                  <Glyph icon={tile.icon} size={21} />
                </span>
                <span className="paytile__text">
                  <span className="paytile__label">{tile.label}</span>
                  <span className="paytile__sub">
                    <span className="paytile__dot" aria-hidden="true" />
                    {tile.sub}
                  </span>
                </span>
              </button>
            ),
          )}
        </div>
        <div className="splitbox">
          <Glyph icon={Split} size={18} />
          <span className="splitbox__text">
            <span className="splitbox__title">Split across tenders</span>
            <span className="splitbox__sub">Pay part by one method and the rest by another</span>
          </span>
          <span className="concept">CONCEPT</span>
        </div>
      </div>
      <div className="dlg__foot dlg__foot--between">
        <span className="dlg-note dlg-note--icon">
          <Glyph icon={customerAttached ? UserRound : User} size={14} />
          {customerName} · {itemCount}
        </span>
        <button type="button" className="dbtn" onClick={onClose}>
          Back to sale
        </button>
      </div>
    </Dialog>
  );
}

const QUICK_AMOUNTS = ["Exact", "RM 50", "RM 100", "RM 20", "RM 10", "Clear"] as const;

export function CashDialog({
  onClose,
  onOtherMethod,
  onConfirm,
}: {
  readonly onClose: () => void;
  readonly onOtherMethod: () => void;
  readonly onConfirm: () => void;
}) {
  return (
    <Dialog title="Cash payment" icon={Banknote} width="680px" onClose={onClose}>
      <div className="cashgrid">
        <div className="cashgrid__main">
          <div className="cashsum">
            <div className="cashsum__row">
              <span>Sale total</span>
              <span>{TOTAL}</span>
            </div>
            <div className="cashsum__row">
              <span>Cash rounding</span>
              <span>RM 0.00</span>
            </div>
            <div className="cashsum__due">
              <span className="cashsum__duelabel">Amount due</span>
              <span className="cashsum__dueamount">{TOTAL}</span>
            </div>
          </div>
          <div className="field">
            <span className="field__label">Cash received</span>
            <div className="recv" role="img" aria-label="Cash received RM 50.00">
              <span className="recv__cur">RM</span>
              <span className="recv__val">50.00</span>
            </div>
          </div>
          <div className="changebox">
            <span className="changebox__label">Change due</span>
            <span className="changebox__val">RM 3.40</span>
          </div>
        </div>
        <div className="cashgrid__quick">
          <span className="field__label">Quick amounts</span>
          <div className="quick">
            {QUICK_AMOUNTS.map((label) => (
              <StubButton
                key={label}
                label={label}
                className={`quick__btn${label === "RM 50" ? " is-on" : ""}`}
              >
                {label}
              </StubButton>
            ))}
          </div>
        </div>
      </div>
      <div className="dlg__foot dlg__foot--between">
        <button type="button" className="dbtn dbtn--h44" onClick={onOtherMethod}>
          <Glyph icon={ArrowLeft} size={15} />
          Other method
        </button>
        <button type="button" className="dbtn dbtn--h44 dbtn--success" onClick={onConfirm}>
          <Glyph icon={CircleCheck} size={17} />
          Confirm cash payment
        </button>
      </div>
    </Dialog>
  );
}

interface CardStep {
  readonly icon: LucideIcon;
  readonly tone: "ok" | "info" | "idle" | "bad" | "warn";
  readonly label: string;
  readonly time: string;
  readonly bold: boolean;
}

/** Fictional narrative of a card attempt. No terminal is contacted. */
const CARD_STATES: Record<
  CardState,
  {
    icon: LucideIcon;
    tone: "info" | "bad" | "warn";
    tag: string;
    title: string;
    body: string;
    warn: boolean;
    steps: readonly CardStep[];
  }
> = {
  wait: {
    icon: CreditCard,
    tone: "info",
    tag: "WAITING",
    title: "Waiting for card terminal",
    body: "Ask the customer to tap, insert or swipe their card on terminal T-01.",
    warn: false,
    steps: [
      {
        icon: CircleCheck,
        tone: "ok",
        label: "Sent to terminal T-01",
        time: "14:33:02",
        bold: false,
      },
      { icon: LoaderCircle, tone: "info", label: "Waiting for customer", time: "", bold: true },
      { icon: Circle, tone: "idle", label: "Terminal result", time: "", bold: false },
    ],
  },
  fail: {
    icon: CircleX,
    tone: "bad",
    tag: "NOT APPROVED",
    title: "Card payment not approved",
    body: "The terminal returned “Declined”. The sale is still open and nothing has been recorded as paid.",
    warn: false,
    steps: [
      {
        icon: CircleCheck,
        tone: "ok",
        label: "Sent to terminal T-01",
        time: "14:33:02",
        bold: false,
      },
      { icon: CircleCheck, tone: "ok", label: "Card presented", time: "14:33:19", bold: false },
      { icon: CircleX, tone: "bad", label: "Declined by terminal", time: "14:33:24", bold: true },
    ],
  },
  unc: {
    icon: CircleHelp,
    tone: "warn",
    tag: "UNCONFIRMED",
    title: "Payment result unknown",
    body: "Terminal T-01 stopped responding before returning a result. The customer may or may not have been charged.",
    warn: true,
    steps: [
      {
        icon: CircleCheck,
        tone: "ok",
        label: "Sent to terminal T-01",
        time: "14:33:02",
        bold: false,
      },
      { icon: CircleCheck, tone: "ok", label: "Card presented", time: "14:33:19", bold: false },
      {
        icon: CircleHelp,
        tone: "warn",
        label: "No result received · attempt CP-000142-1",
        time: "—",
        bold: true,
      },
    ],
  },
};

export function CardDialog({
  cardState,
  onClose,
  onChooseOther,
  onTryAgain,
  onManagerHelp,
  onOutcome,
}: {
  readonly cardState: CardState;
  readonly onClose: () => void;
  readonly onChooseOther: () => void;
  readonly onTryAgain: () => void;
  readonly onManagerHelp: () => void;
  readonly onOutcome: (outcome: "ok" | CardState) => void;
}) {
  const view = CARD_STATES[cardState];
  return (
    <Dialog title="Card payment" icon={CreditCard} width="520px" onClose={onClose}>
      <div className="cardbody">
        <div className={`cardbody__icon tone--${view.tone}`}>
          <Glyph icon={view.icon} size={30} />
        </div>
        <span className={`cardbody__tag tone--${view.tone}`}>{view.tag}</span>
        <span className="cardbody__title">{view.title}</span>
        <span className="cardbody__text">{view.body}</span>
        <span className="cardbody__amount">{TOTAL}</span>
        {view.warn ? (
          <div role="note" className="cardbody__warn">
            <Glyph icon={TriangleAlert} size={16} />
            Don&apos;t charge the customer again until the result is confirmed.
          </div>
        ) : null}
        <div className="steps">
          {view.steps.map((step) => (
            <div key={step.label} className="steps__row">
              <span className={`steps__icon steps__icon--${step.tone}`}>
                <Glyph icon={step.icon} size={15} />
              </span>
              <span className={`steps__label${step.bold ? " is-bold" : ""}`}>{step.label}</span>
              <span className="steps__time">{step.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="dlg__foot dlg__foot--end">
        {cardState === "wait" ? (
          <button type="button" className="dbtn dbtn--h42 dbtn--danger" onClick={onChooseOther}>
            Cancel payment
          </button>
        ) : cardState === "fail" ? (
          <>
            <button type="button" className="dbtn dbtn--h42" onClick={onChooseOther}>
              Choose another method
            </button>
            <button type="button" className="dbtn dbtn--h42 dbtn--primary" onClick={onTryAgain}>
              Try card again
            </button>
          </>
        ) : (
          <>
            <button type="button" className="dbtn dbtn--h42" onClick={onManagerHelp}>
              Get manager help
            </button>
            <StubButton label="Check terminal result" className="dbtn dbtn--h42 dbtn--primary">
              Check terminal result
            </StubButton>
          </>
        )}
      </div>
      <div className="simline">
        <span>PREVIEW ONLY · simulate terminal:</span>
        <button type="button" className="simline__btn" onClick={() => onOutcome("ok")}>
          approved
        </button>
        <button type="button" className="simline__btn" onClick={() => onOutcome("fail")}>
          declined
        </button>
        <button type="button" className="simline__btn" onClick={() => onOutcome("unc")}>
          no response
        </button>
      </div>
    </Dialog>
  );
}

const QR_STATES: readonly {
  label: string;
  icon: LucideIcon;
  tone: "idle" | "info" | "ok" | "bad" | "warn";
}[] = [
  { label: "QR shown", icon: QrCode, tone: "idle" },
  { label: "Waiting", icon: LoaderCircle, tone: "info" },
  { label: "Paid", icon: CircleCheck, tone: "ok" },
  { label: "Failed / expired", icon: CircleX, tone: "bad" },
  { label: "Unconfirmed", icon: CircleHelp, tone: "warn" },
];

export function QrDialog({
  onClose,
  onCancel,
  onCheck,
}: {
  readonly onClose: () => void;
  readonly onCancel: () => void;
  readonly onCheck: () => void;
}) {
  return (
    <Dialog title="DuitNow QR payment" icon={QrCode} width="680px" onClose={onClose}>
      <div className="qrgrid">
        <div className="qrbox">
          dynamic DuitNow QR
          <br />
          from payment provider
        </div>
        <div className="qrinfo">
          <div className="qrinfo__due">
            <span className="qrinfo__duelabel">Amount due</span>
            <span className="qrinfo__dueamount">{TOTAL}</span>
          </div>
          <div className="qrinfo__wait">
            <Glyph icon={LoaderCircle} size={17} />
            Waiting for customer to scan and pay
          </div>
          <div className="qrinfo__facts">
            <span className="qrinfo__k">Payment ref</span>
            <span className="qrinfo__mono">DN-8841233</span>
            <span className="qrinfo__k">QR created</span>
            <span>14:33:05</span>
            <span className="qrinfo__k">Expires</span>
            <span>14:38:05</span>
          </div>
          <span className="qrinfo__text">
            Only mark as paid when the provider confirms. A screenshot on the customer&apos;s phone
            is not a confirmation.
          </span>
        </div>
      </div>
      <div className="qrstates">
        <span className="qrstates__title">QR states</span>
        {QR_STATES.map((state) => (
          <span key={state.label} className={`statepill statepill--${state.tone}`}>
            <Glyph icon={state.icon} size={13} />
            {state.label}
          </span>
        ))}
      </div>
      <div className="dlg__foot dlg__foot--between">
        <button type="button" className="dbtn dbtn--h42 dbtn--danger-text" onClick={onCancel}>
          Cancel QR payment
        </button>
        <button type="button" className="dbtn dbtn--h42" onClick={onCheck}>
          <Glyph icon={RefreshCw} size={15} />
          Check status
        </button>
      </div>
    </Dialog>
  );
}

const SUCCESS_ROWS: Record<
  Tender,
  readonly { icon: LucideIcon; label: string; value: string; bold: boolean }[]
> = {
  cash: [
    { icon: Banknote, label: "Cash received", value: "RM 50.00", bold: false },
    { icon: Coins, label: "Change given", value: "RM 3.40", bold: true },
  ],
  card: [{ icon: CreditCard, label: "Card •••• 4821 · approved", value: TOTAL, bold: false }],
  qr: [{ icon: QrCode, label: "DuitNow QR · DN-8841233", value: TOTAL, bold: false }],
};

export function SuccessDialog({
  tender,
  printFail,
  onClose,
  onNewSale,
  onViewSale,
}: {
  readonly tender: Tender;
  readonly printFail: boolean;
  readonly onClose: () => void;
  readonly onNewSale: () => void;
  readonly onViewSale: () => void;
}) {
  return (
    <>
      <Dialog
        title="Payment accepted"
        icon={Receipt}
        tone="success"
        width="480px"
        onClose={onClose}
      >
        <div className="done">
          <div className="done__check">
            <Glyph icon={Check} size={32} />
          </div>
          <span className="done__title">Sale completed</span>
          <span className="done__ref">Receipt POS01-000142 · 14:33:40</span>
        </div>
        <div className="donebox">
          <div className="donebox__total">
            <span className="donebox__label">TOTAL</span>
            <span className="donebox__amount">{TOTAL}</span>
          </div>
          {SUCCESS_ROWS[tender].map((row) => (
            <div key={row.label} className="donebox__row">
              <span className="donebox__rowlabel">
                <Glyph icon={row.icon} size={15} />
                {row.label}
              </span>
              <span className={row.bold ? "is-bold" : ""}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className={`printnote${printFail ? " is-warn" : ""}`}>
          <Glyph icon={printFail ? TriangleAlert : Printer} size={16} />
          <span className="printnote__text">
            <strong>Receipt not printed.</strong>{" "}
            {printFail ? "Printer unavailable." : "Printing is not implemented."}
          </span>
          {printFail ? (
            <StubButton label="Retry print" className="printnote__btn">
              Retry print
            </StubButton>
          ) : null}
        </div>
        <div className="done__actions">
          <button type="button" className="newsale" data-autofocus onClick={onNewSale}>
            <Glyph icon={Plus} size={18} />
            New Sale
          </button>
          <div className="done__pair">
            <StubButton label="Print Receipt" className="dbtn dbtn--h42 dbtn--center">
              <Glyph icon={Printer} size={15} />
              Print Receipt
            </StubButton>
            <button type="button" className="dbtn dbtn--h42 dbtn--center" onClick={onViewSale}>
              <Glyph icon={FileText} size={15} />
              View Sale
            </button>
          </div>
        </div>
      </Dialog>
      {printFail ? (
        <div role="note" className="printtoast">
          <Glyph icon={Printer} size={17} />
          <div className="printtoast__text">
            <span className="printtoast__title">Receipt printer unavailable</span>
            <span className="printtoast__body">
              Check power and paper. The sale is saved; you can reprint from Sale History.
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
