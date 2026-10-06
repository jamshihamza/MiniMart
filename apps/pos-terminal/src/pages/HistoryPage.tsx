import {
  Banknote,
  Calendar,
  CircleCheck,
  CircleDot,
  Clock,
  ChevronDown,
  CreditCard,
  Inbox,
  Lock,
  Printer,
  QrCode,
  Search,
  Undo2,
  User,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Glyph, StubButton } from "../components/StubButton.js";
import {
  HISTORY_EMPTY_SUMMARY,
  HISTORY_ROWS,
  HISTORY_SELECTED_RECEIPT,
  HISTORY_SUMMARY,
  SALE_DETAIL_LINES,
  SALE_DETAIL_TOTALS,
} from "../fixtures-flow.js";
import type { HistoryRow, HistoryStatus } from "../fixtures-flow.js";

const TENDER_ICON: Record<HistoryRow["tender"], LucideIcon> = {
  Cash: Banknote,
  Card: CreditCard,
  "DuitNow QR": QrCode,
};

const STATUS_VIEW: Record<HistoryStatus, { icon: LucideIcon; tone: "ok" | "mute" | "info" }> = {
  Completed: { icon: CircleCheck, tone: "ok" },
  "Partially returned": { icon: Undo2, tone: "mute" },
  "Refund pending": { icon: Clock, tone: "info" },
};

const FILTERS: readonly { icon: LucideIcon; key: string; value: string }[] = [
  { icon: Calendar, key: "Date", value: "Today" },
  { icon: CircleDot, key: "Status", value: "All" },
  { icon: Wallet, key: "Tender", value: "All" },
  { icon: User, key: "Cashier", value: "All" },
];

/**
 * Sale history (reference screens 16, 17 and 30). The list is a fixed fictional fixture. Opening a
 * row shows a fictional detail pane and changes nothing else.
 */
export function HistoryPage({
  empty,
  detailOpen,
  onOpen,
  onCloseDetail,
  onStartReturn,
}: {
  readonly empty: boolean;
  readonly detailOpen: boolean;
  readonly onOpen: () => void;
  readonly onCloseDetail: () => void;
  readonly onStartReturn: () => void;
}) {
  const columns = detailOpen
    ? "124px 92px minmax(0,1fr) 44px 88px 0px 124px"
    : "140px 110px minmax(0,1fr) 60px 110px 130px 160px";
  return (
    <>
      <section className="history" aria-labelledby="history-title">
        <div className="history__title">
          <h1 id="history-title" className="history__h1">
            Sale History
          </h1>
          <span className="history__sum">{empty ? HISTORY_EMPTY_SUMMARY : HISTORY_SUMMARY}</span>
        </div>
        <div className="history__filters">
          <div className="hsearch">
            <Glyph icon={Search} size={16} />
            <input
              className="hsearch__input"
              aria-label="Search sales by receipt number, customer or product"
              placeholder="Receipt no., customer or product"
            />
          </div>
          {FILTERS.map((filter) => (
            <StubButton key={filter.key} label={`${filter.key} filter`} className="hfilter">
              <Glyph icon={filter.icon} size={15} />
              <span className="hfilter__k">{filter.key}</span>
              <span className="hfilter__v">{filter.value}</span>
              <Glyph icon={ChevronDown} size={14} />
            </StubButton>
          ))}
        </div>
        <div className="htable">
          <div
            className="hrow hrow--head"
            style={{ gridTemplateColumns: columns }}
            aria-hidden="true"
          >
            <span>RECEIPT</span>
            <span>DATE / TIME</span>
            <span>CUSTOMER</span>
            <span className="is-right">ITEMS</span>
            <span className="is-right">TOTAL</span>
            {detailOpen ? null : <span>TENDER</span>}
            <span>STATUS</span>
          </div>
          {empty ? (
            <div className="hempty">
              <div className="hempty__icon">
                <Glyph icon={Inbox} size={24} />
              </div>
              <span className="hempty__title">No sales for this business date</span>
              <span className="hempty__text">
                Completed sales on POS-01 appear here. Try another date or clear the filters.
              </span>
              <div className="hempty__actions">
                <StubButton label="Change date" className="dbtn dbtn--h34">
                  Change date
                </StubButton>
                <StubButton label="Clear filters" className="dbtn dbtn--h34 dbtn--ghost">
                  Clear filters
                </StubButton>
              </div>
            </div>
          ) : (
            HISTORY_ROWS.map((row) => {
              const status = STATUS_VIEW[row.status];
              const selected = detailOpen && row.receipt === HISTORY_SELECTED_RECEIPT;
              return (
                <button
                  key={row.receipt}
                  type="button"
                  className={`hrow${selected ? " is-selected" : ""}`}
                  style={{ gridTemplateColumns: columns }}
                  aria-label={`Open sale ${row.receipt}`}
                  onClick={onOpen}
                >
                  <span className="hrow__receipt">{row.receipt}</span>
                  <span className="hrow__time">26 Sep · {row.time}</span>
                  <span className="hrow__cust">{row.customer}</span>
                  <span className="is-right hrow__items">{row.items}</span>
                  <span className="is-right hrow__total">{row.total}</span>
                  {detailOpen ? null : (
                    <span className="hrow__tender">
                      <Glyph icon={TENDER_ICON[row.tender]} size={14} />
                      {row.tender}
                    </span>
                  )}
                  <span className={`hstatus hstatus--${status.tone}`}>
                    <Glyph icon={status.icon} size={13} />
                    {row.status}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </section>
      {detailOpen ? <SaleDetail onClose={onCloseDetail} onStartReturn={onStartReturn} /> : null}
    </>
  );
}

function SaleDetail({
  onClose,
  onStartReturn,
}: {
  readonly onClose: () => void;
  readonly onStartReturn: () => void;
}) {
  const facts: readonly (readonly [string, string])[] = [
    ["Business date", "Sat, 26 Sep 2026"],
    ["Time", "13:58:12"],
    ["Store / register", "MiniMart Central · POS-01"],
    ["Cashier", "Demo Cashier"],
    ["Customer", "Walk-in Customer"],
    ["Items", "4 lines · 6 units"],
  ];
  return (
    <aside className="detail" aria-label="Sale detail">
      <div className="detail__head">
        <div className="detail__ref">
          <span className="detail__eyebrow">RECEIPT</span>
          <span className="detail__no">{HISTORY_SELECTED_RECEIPT}</span>
        </div>
        <span className="hstatus hstatus--ok hstatus--lg">
          <Glyph icon={CircleCheck} size={13} />
          Completed
        </span>
        <button type="button" className="detail__close" aria-label="Close" onClick={onClose}>
          <Glyph icon={X} size={18} />
        </button>
      </div>
      <div className="detail__body">
        <div className="detail__lock">
          <Glyph icon={Lock} size={14} />
          Posted sale · read-only. Reverse items with a return.
        </div>
        <div className="detail__facts">
          {facts.map(([key, value]) => (
            <div key={key} className="detail__fact">
              <span className="detail__k">{key}</span>
              <span className="detail__v">{value}</span>
            </div>
          ))}
        </div>
        <div className="detail__lines">
          {SALE_DETAIL_LINES.map((line) => (
            <div key={line.name} className="detail__line">
              <div className="detail__linetext">
                <span className="detail__linename">{line.name}</span>
                <span className="detail__lineqty">
                  {line.quantity} × {line.unit}
                </span>
              </div>
              <span className="detail__linetotal">{line.total}</span>
            </div>
          ))}
          <div className="detail__sums">
            <div className="detail__sum">
              <span>Subtotal</span>
              <span className="detail__sumval">{SALE_DETAIL_TOTALS.subtotal}</span>
            </div>
            <div className="detail__sum">
              <span>Discount</span>
              <span className="detail__sumval detail__sumval--discount">
                {SALE_DETAIL_TOTALS.discount}
              </span>
            </div>
            <div className="detail__sum">
              <span>Tax</span>
              <span className="detail__sumval">{SALE_DETAIL_TOTALS.tax}</span>
            </div>
            <div className="detail__sum">
              <span>Rounding</span>
              <span className="detail__sumval">{SALE_DETAIL_TOTALS.rounding}</span>
            </div>
            <div className="detail__grand">
              <span className="detail__grandlabel">TOTAL</span>
              <span className="detail__grandval">{SALE_DETAIL_TOTALS.total}</span>
            </div>
          </div>
        </div>
        <div className="detail__tender">
          <span className="detail__eyebrow detail__eyebrow--small">TENDER</span>
          <div className="tenderrow">
            <Glyph icon={QrCode} size={18} />
            <div className="tenderrow__text">
              <span className="tenderrow__name">DuitNow QR</span>
              <span className="tenderrow__ref">Ref DN-8841207 · Confirmed 13:58:40</span>
            </div>
            <span className="tenderrow__amount">RM 32.40</span>
          </div>
        </div>
      </div>
      <div className="detail__foot">
        <StubButton label="Print Receipt" className="dbtn dbtn--h42 dbtn--grow">
          <Glyph icon={Printer} size={16} />
          Print Receipt
        </StubButton>
        <button
          type="button"
          className="dbtn dbtn--h42 dbtn--grow dbtn--primary"
          onClick={onStartReturn}
        >
          <Glyph icon={Undo2} size={16} />
          Start Return
        </button>
      </div>
    </aside>
  );
}
