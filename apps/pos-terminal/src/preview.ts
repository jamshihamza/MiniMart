import { DEFAULT_SCREEN_STATE, screenById, stateForScreen } from "./screens.js";
import type { ScreenId, ScreenState } from "./screens.js";

/**
 * Preview states of the visual-only POS (ADR 0008). They are read once from the page address, for
 * example `?screen=17` or `?cart=populated&view=grid`. They only choose which fictional fixture the
 * screen shows. They never change a sale, a total or any stored data.
 *
 * `screen` selects one of the 31 reference screens (see screens.ts). Individual parameters override
 * it. `node=real` keeps the Store Node status from the MM-006 connectivity probe; `online` and
 * `offline` simulate the reference's two Store Node states for visual comparison only.
 */
export type PreviewCart = ScreenState["cart"];
export type PreviewView = ScreenState["view"];
export type PreviewNode = ScreenState["node"];
export type PreviewSync = ScreenState["sync"];

export interface PreviewState extends ScreenState {
  /** The reference screen the address selected, or null when none was selected. */
  readonly screenId: ScreenId | null;
  /** False hides the preview inspector, for example when capturing a screenshot. */
  readonly inspect: boolean;
}

export const DEFAULT_PREVIEW: PreviewState = {
  ...DEFAULT_SCREEN_STATE,
  screenId: null,
  inspect: true,
};

function pick<T extends string>(allowed: readonly T[], value: string | null, fallback: T): T {
  return allowed.find((candidate) => candidate === value) ?? fallback;
}

export function readPreview(search: string): PreviewState {
  const params = new URLSearchParams(search);
  const def = screenById(params.get("screen"));
  const base: ScreenState = def === undefined ? DEFAULT_SCREEN_STATE : stateForScreen(def);
  return {
    ...base,
    cart: params.has("cart")
      ? pick(["empty", "populated"], params.get("cart"), base.cart)
      : base.cart,
    view: params.has("view") ? pick(["tiles", "grid"], params.get("view"), base.view) : base.view,
    node: params.has("node")
      ? pick(["real", "online", "offline"], params.get("node"), base.node)
      : base.node,
    sync: params.has("sync") ? pick(["default", "down"], params.get("sync"), base.sync) : base.sync,
    loading: params.has("loading") ? params.get("loading") === "1" : base.loading,
    screenId: def?.id ?? null,
    inspect: params.get("inspect") !== "0",
  };
}

/** Builds a link that reads back to the given state. A `screenId` wins over the other fields. */
export function previewHref(
  state: Partial<Pick<PreviewState, "cart" | "view" | "node" | "sync" | "loading" | "screenId">>,
): string {
  const params = new URLSearchParams();
  if (state.screenId !== undefined && state.screenId !== null) {
    params.set("screen", state.screenId);
  } else {
    if (state.cart !== undefined && state.cart !== DEFAULT_PREVIEW.cart)
      params.set("cart", state.cart);
    if (state.view !== undefined && state.view !== DEFAULT_PREVIEW.view)
      params.set("view", state.view);
    if (state.loading === true) params.set("loading", "1");
  }
  if (state.node !== undefined && state.node !== DEFAULT_PREVIEW.node)
    params.set("node", state.node);
  if (state.sync !== undefined && state.sync !== DEFAULT_PREVIEW.sync)
    params.set("sync", state.sync);
  const query = params.toString();
  return query === "" ? "?" : `?${query}`;
}
