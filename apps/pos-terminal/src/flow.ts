import { useCallback, useMemo, useState } from "react";

import type { CardState, CartState, DialogId, ScreenState, Tender } from "./screens.js";
import type { ShellPage } from "./shell/Sidebar.js";

/**
 * Visual flow of the POS preview (ADR 0008). Every action here only swaps one fictional screen
 * state for another, as the approved reference's own prototype does. Nothing is calculated, posted,
 * stored or sent: "hold", "pay" and "return" change what is drawn and nothing else.
 */
export type FlowState = Pick<
  ScreenState,
  | "page"
  | "cart"
  | "dialog"
  | "customer"
  | "detail"
  | "returnStep"
  | "shiftMode"
  | "tender"
  | "cardState"
  | "printFail"
  | "historyEmpty"
>;

export interface FlowActions {
  readonly go: (page: ShellPage) => void;
  readonly openDialog: (dialog: DialogId) => void;
  readonly closeDialog: () => void;
  readonly attachCustomer: (attached: boolean) => void;
  readonly clearCart: () => void;
  readonly holdSale: () => void;
  readonly recallSale: () => void;
  readonly payWith: (tender: Tender) => void;
  readonly confirmCash: () => void;
  readonly cardOutcome: (outcome: "ok" | CardState) => void;
  readonly qrPaid: () => void;
  readonly newSale: () => void;
  readonly viewSale: () => void;
  readonly setDetail: (open: boolean) => void;
  readonly pickReturnSale: () => void;
  readonly reviewReturn: () => void;
  readonly confirmReturn: () => void;
  readonly startClose: () => void;
  readonly backShift: () => void;
}

export function flowStateOf(state: ScreenState): FlowState {
  return {
    page: state.page,
    cart: state.cart,
    dialog: state.dialog,
    customer: state.customer,
    detail: state.detail,
    returnStep: state.returnStep,
    shiftMode: state.shiftMode,
    tender: state.tender,
    cardState: state.cardState,
    printFail: state.printFail,
    historyEmpty: state.historyEmpty,
  };
}

const EMPTY: CartState = "empty";

export function useFlow(initial: ScreenState): readonly [FlowState, FlowActions] {
  const [state, setState] = useState<FlowState>(() => flowStateOf(initial));

  const patch = useCallback((change: Partial<FlowState>) => {
    setState((current) => ({ ...current, ...change }));
  }, []);

  const actions = useMemo<FlowActions>(
    () => ({
      go: (page) => patch({ page, dialog: null, detail: false, returnStep: 1, shiftMode: "open" }),
      openDialog: (dialog) => patch({ dialog }),
      closeDialog: () => patch({ dialog: null }),
      attachCustomer: (attached) => patch({ customer: attached, dialog: null }),
      clearCart: () => patch({ cart: EMPTY, customer: false }),
      holdSale: () => patch({ cart: EMPTY, customer: false, dialog: null }),
      recallSale: () => patch({ cart: "populated", dialog: null }),
      payWith: (tender) =>
        patch(
          tender === "cash"
            ? { dialog: "cash", tender }
            : tender === "card"
              ? { dialog: "card", cardState: "wait", tender }
              : { dialog: "qr", tender },
        ),
      confirmCash: () => patch({ dialog: "success", tender: "cash" }),
      cardOutcome: (outcome) =>
        outcome === "ok"
          ? patch({ dialog: "success", tender: "card" })
          : patch({ cardState: outcome }),
      qrPaid: () => patch({ dialog: "success", tender: "qr" }),
      newSale: () =>
        patch({ page: "sale", cart: EMPTY, customer: false, dialog: null, detail: false }),
      viewSale: () => patch({ page: "history", detail: true, dialog: null }),
      setDetail: (open) => patch({ detail: open }),
      pickReturnSale: () => patch({ returnStep: 2 }),
      reviewReturn: () => patch({ dialog: "retConfirm" }),
      confirmReturn: () => patch({ dialog: null, returnStep: 3 }),
      startClose: () => patch({ shiftMode: "closing" }),
      backShift: () => patch({ shiftMode: "open" }),
    }),
    [patch],
  );

  return [state, actions] as const;
}
