import type { FlowActions, FlowState } from "../flow.js";
import { PREVIEW_CUSTOMERS } from "../fixtures-flow.js";
import { ReturnConfirmDialog } from "../pages/ReturnsPage.js";
import { CardDialog, CashDialog, PayDialog, QrDialog, SuccessDialog } from "./PaymentDialogs.js";
import {
  CustomerDialog,
  HeldDialog,
  HoldDialog,
  OverrideDialog,
  PermissionDialog,
} from "./SaleDialogs.js";

/** Renders the one open reference dialog, or nothing. Every handler only swaps a fictional state. */
export function DialogHost({
  flow,
  actions,
}: {
  readonly flow: FlowState;
  readonly actions: FlowActions;
}) {
  const customerName = flow.customer ? (PREVIEW_CUSTOMERS[0]?.name ?? "") : "Walk-in Customer";
  const itemCount = flow.cart === "populated" ? "9 items" : "0 items";
  const close = actions.closeDialog;
  switch (flow.dialog) {
    case null:
      return null;
    case "customer":
      return (
        <CustomerDialog
          onClose={close}
          onWalkIn={() => actions.attachCustomer(false)}
          onAttach={() => actions.attachCustomer(true)}
        />
      );
    case "hold":
      return <HoldDialog customerName={customerName} onClose={close} onHold={actions.holdSale} />;
    case "held":
      return <HeldDialog onClose={close} onRecall={actions.recallSale} />;
    case "pay":
      return (
        <PayDialog
          customerName={customerName}
          customerAttached={flow.customer}
          itemCount={itemCount}
          onClose={close}
          onPick={actions.payWith}
        />
      );
    case "cash":
      return (
        <CashDialog
          onClose={close}
          onOtherMethod={() => actions.openDialog("pay")}
          onConfirm={actions.confirmCash}
        />
      );
    case "card":
      return (
        <CardDialog
          cardState={flow.cardState}
          onClose={close}
          onChooseOther={() => actions.openDialog("pay")}
          onTryAgain={() => actions.cardOutcome("wait")}
          onManagerHelp={() => actions.openDialog("override")}
          onOutcome={actions.cardOutcome}
        />
      );
    case "qr":
      return (
        <QrDialog
          onClose={close}
          onCancel={() => actions.openDialog("pay")}
          onCheck={actions.qrPaid}
        />
      );
    case "success":
      return (
        <SuccessDialog
          tender={flow.tender}
          printFail={flow.printFail}
          onClose={close}
          onNewSale={actions.newSale}
          onViewSale={actions.viewSale}
        />
      );
    case "override":
      return <OverrideDialog onClose={close} onApprove={close} />;
    case "permission":
      return <PermissionDialog onClose={close} onRequest={() => actions.openDialog("override")} />;
    case "retConfirm":
      return <ReturnConfirmDialog onClose={close} onConfirm={actions.confirmReturn} />;
  }
}
