import type { ShellPage } from "./shell/Sidebar.js";

/**
 * Registry of every screen of the approved POS reference (docs/design/pos/source/MiniMartPOS.dc.html,
 * 31 screens). Each entry says which preview state reproduces it, so a screen cannot be silently
 * left out: test/screens.test.ts checks the registry against the reference screen list.
 *
 * The states are visual only (ADR 0008). They choose which fictional fixture is shown and never
 * calculate, post or store anything.
 */
export type DialogId =
  | "customer"
  | "hold"
  | "held"
  | "pay"
  | "cash"
  | "card"
  | "qr"
  | "success"
  | "override"
  | "permission"
  | "retConfirm";

export type Tender = "cash" | "card" | "qr";
export type CardState = "wait" | "fail" | "unc";
export type CartState = "empty" | "populated";
export type ViewMode = "tiles" | "grid";
export type NodeMode = "real" | "online" | "offline";
export type SyncMode = "default" | "down";
/** Search presentation that reference screens 03 and 04 show. The preview performs no lookup. */
export type SearchView = "results" | "notfound" | null;

export interface ScreenState {
  readonly page: ShellPage;
  readonly cart: CartState;
  readonly view: ViewMode;
  readonly query: string;
  readonly searchView: SearchView;
  readonly dialog: DialogId | null;
  readonly customer: boolean;
  readonly detail: boolean;
  readonly returnStep: 1 | 2 | 3;
  readonly shiftMode: "open" | "closing";
  readonly tender: Tender;
  readonly cardState: CardState;
  readonly printFail: boolean;
  readonly historyEmpty: boolean;
  readonly node: NodeMode;
  readonly sync: SyncMode;
  readonly loading: boolean;
}

export const DEFAULT_SCREEN_STATE: ScreenState = {
  page: "sale",
  cart: "empty",
  view: "tiles",
  query: "",
  searchView: null,
  dialog: null,
  customer: false,
  detail: false,
  returnStep: 1,
  shiftMode: "open",
  tender: "cash",
  cardState: "wait",
  printFail: false,
  historyEmpty: false,
  node: "real",
  sync: "default",
  loading: false,
};

export type ScreenId =
  | "01"
  | "02"
  | "02b"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30";

export type ScreenGroup =
  "Checkout" | "Payment" | "History and returns" | "Shift" | "Operational states";

export interface ScreenDef {
  readonly id: ScreenId;
  /** Name as the reference lists it. */
  readonly name: string;
  readonly group: ScreenGroup;
  readonly state: Partial<ScreenState>;
}

/** A populated fictional cart is the reference's default for every screen that is not an empty one. */
const POP = { cart: "populated" } as const;

export const SCREENS: readonly ScreenDef[] = [
  { id: "01", name: "Sale — empty cart", group: "Checkout", state: {} },
  { id: "02", name: "Sale — populated cart", group: "Checkout", state: POP },
  {
    id: "02b",
    name: "Sale — Grid view (concept)",
    group: "Checkout",
    state: { ...POP, view: "grid" },
  },
  {
    id: "03",
    name: "Product search results",
    group: "Checkout",
    state: { ...POP, query: "coffee", searchView: "results" },
  },
  {
    id: "04",
    name: "Product not found",
    group: "Checkout",
    state: { ...POP, query: "9556012345678", searchView: "notfound" },
  },
  {
    id: "05",
    name: "Customer selection",
    group: "Checkout",
    state: { ...POP, dialog: "customer" },
  },
  { id: "06", name: "Identified customer", group: "Checkout", state: { ...POP, customer: true } },
  { id: "07", name: "Hold sale", group: "Checkout", state: { ...POP, dialog: "hold" } },
  { id: "08", name: "Held sales", group: "Checkout", state: { dialog: "held" } },
  {
    id: "09",
    name: "Payment selection",
    group: "Payment",
    state: { ...POP, customer: true, dialog: "pay" },
  },
  { id: "10", name: "Cash payment", group: "Payment", state: { ...POP, dialog: "cash" } },
  {
    id: "11",
    name: "Card — waiting",
    group: "Payment",
    state: { ...POP, dialog: "card", cardState: "wait", tender: "card" },
  },
  {
    id: "12",
    name: "Card — failed",
    group: "Payment",
    state: { ...POP, dialog: "card", cardState: "fail", tender: "card" },
  },
  {
    id: "13",
    name: "Card — uncertain",
    group: "Payment",
    state: { ...POP, dialog: "card", cardState: "unc", tender: "card" },
  },
  {
    id: "14",
    name: "DuitNow QR",
    group: "Payment",
    state: { ...POP, dialog: "qr", tender: "qr" },
  },
  { id: "15", name: "Sale completed", group: "Payment", state: { ...POP, dialog: "success" } },
  {
    id: "16",
    name: "Sale history",
    group: "History and returns",
    state: { ...POP, page: "history" },
  },
  {
    id: "17",
    name: "Sale detail",
    group: "History and returns",
    state: { ...POP, page: "history", detail: true },
  },
  {
    id: "18",
    name: "Return — locate sale",
    group: "History and returns",
    state: { ...POP, page: "returns", returnStep: 1 },
  },
  {
    id: "19",
    name: "Return — select items",
    group: "History and returns",
    state: { ...POP, page: "returns", returnStep: 2 },
  },
  {
    id: "20",
    name: "Return confirmation",
    group: "History and returns",
    state: { ...POP, page: "returns", returnStep: 2, dialog: "retConfirm" },
  },
  {
    id: "21",
    name: "Refund unconfirmed",
    group: "History and returns",
    state: { ...POP, page: "returns", returnStep: 3 },
  },
  { id: "22", name: "Shift open", group: "Shift", state: { ...POP, page: "shift" } },
  {
    id: "23",
    name: "Shift close",
    group: "Shift",
    state: { ...POP, page: "shift", shiftMode: "closing" },
  },
  {
    id: "24",
    name: "Manager override",
    group: "History and returns",
    state: { ...POP, dialog: "override" },
  },
  {
    id: "25",
    name: "Printer unavailable",
    group: "Payment",
    state: { ...POP, dialog: "success", printFail: true },
  },
  {
    id: "26",
    name: "Store Node unavailable",
    group: "Operational states",
    state: { ...POP, node: "offline" },
  },
  {
    id: "27",
    name: "Cloud sync unavailable",
    group: "Operational states",
    state: { ...POP, sync: "down" },
  },
  {
    id: "28",
    name: "Permission denied",
    group: "History and returns",
    state: { ...POP, page: "history", detail: true, dialog: "permission" },
  },
  { id: "29", name: "Loading", group: "Operational states", state: { loading: true } },
  {
    id: "30",
    name: "Empty history",
    group: "Operational states",
    state: { ...POP, page: "history", historyEmpty: true },
  },
];

export function screenById(id: string | null): ScreenDef | undefined {
  return SCREENS.find((screen) => screen.id === id);
}

export function stateForScreen(def: ScreenDef): ScreenState {
  return { ...DEFAULT_SCREEN_STATE, ...def.state };
}
