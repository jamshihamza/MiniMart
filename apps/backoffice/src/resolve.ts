import type { Route } from "./router.js";
import { DAILY_SALES_SUMMARY } from "./reports/dailySales.js";
import type { HomeState, ReportSpec, ViewerState } from "./reports/types.js";

export const HOME_STATES: readonly HomeState[] = [
  "ready",
  "search",
  "loading",
  "empty",
  "denied",
  "local-scope",
  "node-unavailable",
  "incompatible",
  "central",
];

export const VIEWER_STATES: readonly ViewerState[] = [
  "ready",
  "offline",
  "loading",
  "empty",
  "invalid",
  "denied",
  "conflict",
  "failed",
  "incompatible",
  "node-unavailable",
];

/** Reports that have a viewer in this preview. Only Daily Sales Summary is built in this slice. */
const VIEWERS: Readonly<Record<string, ReportSpec>> = {
  [DAILY_SALES_SUMMARY.slug]: DAILY_SALES_SUMMARY,
};

export type Target =
  | { readonly kind: "home"; readonly state: HomeState; readonly query: string }
  | { readonly kind: "viewer"; readonly spec: ReportSpec; readonly state: ViewerState }
  | { readonly kind: "not-found"; readonly path: string };

function pick<T extends string>(allowed: readonly T[], value: string | null, fallback: T): T {
  return allowed.find((candidate) => candidate === value) ?? fallback;
}

export function resolveTarget(route: Route): Target {
  const [section, slug, ...rest] = route.segments;
  if (section !== undefined && section !== "reports") {
    return { kind: "not-found", path: route.segments.join("/") };
  }
  if (slug === undefined) {
    const state = pick(HOME_STATES, route.params.get("state"), "ready");
    const query = route.params.get("q") ?? (state === "search" ? "return" : "");
    return { kind: "home", state, query };
  }
  const spec = VIEWERS[slug];
  if (spec === undefined || rest.length > 0) {
    return { kind: "not-found", path: route.segments.join("/") };
  }
  return {
    kind: "viewer",
    spec,
    state: pick(VIEWER_STATES, route.params.get("state"), "ready"),
  };
}
