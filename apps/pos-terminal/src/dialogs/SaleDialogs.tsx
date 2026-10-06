import {
  ArchiveRestore,
  ChevronDown,
  Lock,
  Pause,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { Glyph } from "../components/StubButton.js";
import { HELD_SALES, PREVIEW_CUSTOMERS } from "../fixtures-flow.js";
import { Dialog } from "./Dialog.js";

/** Fictional summary shown in the hold dialog (reference screen 07). Nothing is counted here. */
const HOLD_SUMMARY = { items: "6 lines · 9 units", amount: "RM 46.60" } as const;

export function CustomerDialog({
  onClose,
  onWalkIn,
  onAttach,
}: {
  readonly onClose: () => void;
  readonly onWalkIn: () => void;
  readonly onAttach: () => void;
}) {
  const first = PREVIEW_CUSTOMERS[0];
  return (
    <Dialog title="Select customer" icon={Users} width="600px" onClose={onClose}>
      <div className="dlg__body">
        <div className="dlg-search">
          <Glyph icon={Search} size={18} />
          <input
            className="dlg-search__input"
            aria-label="Search customers by name, phone or member number"
            readOnly
            value="012"
          />
          <span className="dlg-search__hint">Name, phone or member no.</span>
        </div>
        <button type="button" className="walkin" onClick={onWalkIn}>
          <span className="walkin__avatar">
            <Glyph icon={User} size={17} />
          </span>
          <span className="walkin__text">
            <span className="walkin__name">Walk-in Customer</span>
            <span className="walkin__sub">No customer attached to this sale</span>
          </span>
        </button>
        <span className="dlg-label">2 MATCHES</span>
        {PREVIEW_CUSTOMERS.map((customer, index) => (
          <button
            key={customer.member}
            type="button"
            className={`custrow${index === 0 ? " is-first" : ""}`}
            onClick={onAttach}
          >
            <span className="custrow__avatar">{customer.initials}</span>
            <span className="custrow__text">
              <span className="custrow__name">{customer.name}</span>
              <span className="custrow__sub">{customer.phone}</span>
            </span>
            <span className="custrow__id">{customer.member}</span>
          </button>
        ))}
      </div>
      <div className="dlg__foot dlg__foot--end">
        <button type="button" className="dbtn" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="dbtn dbtn--primary" onClick={onAttach}>
          Attach {first?.name ?? ""}
        </button>
      </div>
    </Dialog>
  );
}

export function HoldDialog({
  customerName,
  onClose,
  onHold,
}: {
  readonly customerName: string;
  readonly onClose: () => void;
  readonly onHold: () => void;
}) {
  return (
    <Dialog title="Hold sale" icon={Pause} width="480px" onClose={onClose}>
      <div className="dlg__body dlg__body--gap12">
        <span className="dlg-text">
          The cart will be cleared and saved on this register. You can recall it from Held Sales.
        </span>
        <div className="kvbox">
          <span className="kvbox__k">Items</span>
          <span className="kvbox__v">{HOLD_SUMMARY.items}</span>
          <span className="kvbox__k">Customer</span>
          <span className="kvbox__v">{customerName}</span>
          <span className="kvbox__k">Amount</span>
          <span className="kvbox__v kvbox__v--bold">{HOLD_SUMMARY.amount}</span>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="hold-label">
            Label <span className="field__opt">(optional)</span>
          </label>
          <input
            id="hold-label"
            className="field__input field__input--focus"
            readOnly
            value="Customer fetching wallet"
          />
        </div>
      </div>
      <div className="dlg__foot dlg__foot--end">
        <button type="button" className="dbtn" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="dbtn dbtn--primary" onClick={onHold}>
          <Glyph icon={Pause} size={15} />
          Hold sale
        </button>
      </div>
    </Dialog>
  );
}

export function HeldDialog({
  onClose,
  onRecall,
}: {
  readonly onClose: () => void;
  readonly onRecall: () => void;
}) {
  return (
    <Dialog title="Held sales" icon={ArchiveRestore} width="780px" onClose={onClose}>
      <div className="heldlist">
        <div className="held held--head" aria-hidden="true">
          <span>TIME</span>
          <span>REF</span>
          <span>LABEL · CUSTOMER</span>
          <span>CASHIER</span>
          <span className="is-right">ITEMS</span>
          <span className="is-right">AMOUNT</span>
          <span />
        </div>
        {HELD_SALES.map((held, index) => (
          <div key={held.ref} className={`held${index === 0 ? " is-first" : ""}`}>
            <span className="held__time">{held.time}</span>
            <span className="held__ref">{held.ref}</span>
            <span className="held__label">
              <span className="held__name">{held.label}</span>
              <span className="held__cust">{held.customer}</span>
            </span>
            <span className="held__cashier">{held.cashier}</span>
            <span className="is-right">{held.items}</span>
            <span className="is-right held__amount">{held.amount}</span>
            <button
              type="button"
              className={`held__btn${index === 0 ? " is-primary" : ""}`}
              aria-label={`Recall ${held.ref}`}
              onClick={onRecall}
            >
              Recall
            </button>
          </div>
        ))}
      </div>
      <div className="dlg__foot dlg__foot--between">
        <span className="dlg-note">Recalling loads the sale into an empty cart.</span>
        <button type="button" className="dbtn" onClick={onClose}>
          Close
        </button>
      </div>
    </Dialog>
  );
}

export function OverrideDialog({
  onClose,
  onApprove,
}: {
  readonly onClose: () => void;
  readonly onApprove: () => void;
}) {
  return (
    <Dialog
      title="Manager approval required"
      icon={ShieldCheck}
      tone="neutral"
      width="520px"
      onClose={onClose}
    >
      <div className="dlg__body dlg__body--gap12">
        <span className="dlg-text">
          This action needs a manager. The approval is recorded in the audit log with the
          manager&apos;s ID.
        </span>
        <div className="kvbox kvbox--line">
          <span className="kvbox__k">Action</span>
          <span className="kvbox__v">Apply sale discount · RM 5.00</span>
          <span className="kvbox__k">Sale</span>
          <span className="kvbox__v kvbox__v--mono">In progress · POS-01</span>
          <span className="kvbox__k">Requested by</span>
          <span className="kvbox__v kvbox__v--plain">Demo Cashier · 14:32</span>
        </div>
        <div className="field">
          <span className="field__label">Reason</span>
          <span className="select">
            <span>Price match</span>
            <Glyph icon={ChevronDown} size={14} />
          </span>
        </div>
        <div className="field-pair">
          <div className="field">
            <label className="field__label" htmlFor="mgr-id">
              Manager ID
            </label>
            <input
              id="mgr-id"
              className="field__input field__input--mono"
              readOnly
              value="MGR-0012"
            />
          </div>
          <div className="field">
            <span className="field__label">PIN</span>
            <div className="pin" role="img" aria-label="PIN field, 4 of 6 digits entered">
              {[0, 1, 2, 3, 4, 5].map((slot) => (
                <span key={slot} className={`pin__dot${slot < 4 ? " is-filled" : ""}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="dlg__foot dlg__foot--between">
        <span className="dlg-note dlg-note--icon">
          <Glyph icon={ShieldCheck} size={14} />
          Audited action
        </span>
        <div className="dlg__actions">
          <button type="button" className="dbtn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="dbtn dbtn--primary" onClick={onApprove}>
            Approve
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export function PermissionDialog({
  onClose,
  onRequest,
}: {
  readonly onClose: () => void;
  readonly onRequest: () => void;
}) {
  return (
    <Dialog title="Permission required" icon={Lock} tone="neutral" width="480px" onClose={onClose}>
      <div className="dlg__body dlg__body--gap10">
        <span className="dlg-lead">You can&apos;t start returns with the Cashier role</span>
        <span className="dlg-text">
          A manager can approve this return once, or sign in to process it. Nothing has changed on
          sale POS01-000139.
        </span>
      </div>
      <div className="dlg__foot dlg__foot--end">
        <button type="button" className="dbtn" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="dbtn dbtn--primary" onClick={onRequest}>
          <Glyph icon={ShieldCheck} size={15} />
          Request manager approval
        </button>
      </div>
    </Dialog>
  );
}
