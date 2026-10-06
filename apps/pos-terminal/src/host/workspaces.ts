/**
 * Workspace registry and hash routes for the workspace-host preview (ADR 0009).
 *
 * Availability here is PREVIEW ONLY. It comes from the `workspaces` URL parameter and is never a
 * build setting, an enrollment setting or a server value. It does not authorize anything: a future
 * production host gets authorization from Store Node, and a client-side value never grants access.
 */
export type WorkspaceId = "pos" | "back-office";

export interface WorkspaceEntry {
  readonly id: WorkspaceId;
  readonly label: string;
  /** First route segment, so the route of a workspace is `#/<segment>`. */
  readonly segment: string;
}

export const WORKSPACES: readonly WorkspaceEntry[] = [
  { id: "pos", label: "POS", segment: "pos" },
  { id: "back-office", label: "Back Office", segment: "back-office" },
];

export function workspaceById(id: WorkspaceId): WorkspaceEntry {
  const found = WORKSPACES.find((entry) => entry.id === id);
  if (found === undefined) throw new Error(`Unknown workspace ${id}`);
  return found;
}

export function workspaceHref(id: WorkspaceId, rest: readonly string[] = []): string {
  return `#/${[workspaceById(id).segment, ...rest].join("/")}`;
}

/**
 * Reads the preview-only availability: `?workspaces=pos`, `?workspaces=back-office` or
 * `?workspaces=both`. A missing or unrecognized value offers both.
 */
export function readAvailability(search: string): readonly WorkspaceId[] {
  const value = new URLSearchParams(search).get("workspaces");
  if (value === "pos") return ["pos"];
  if (value === "back-office") return ["back-office"];
  return ["pos", "back-office"];
}

export type RouteResolution =
  | { readonly kind: "workspace"; readonly id: WorkspaceId; readonly rest: readonly string[] }
  | { readonly kind: "redirect"; readonly to: WorkspaceId }
  | { readonly kind: "unavailable"; readonly id: WorkspaceId }
  | { readonly kind: "unknown-route"; readonly id: WorkspaceId; readonly path: string }
  | { readonly kind: "unknown-workspace"; readonly path: string }
  | { readonly kind: "none-available" };

/**
 * Resolves a location hash. An empty hash lands on the first available workspace; in production
 * the landing choice would follow the role home (UI specification 14) and is not decided here.
 * The POS workspace has no sub-routes: its pages are internal state, so `#/pos/x` is unknown.
 * The Back Office placeholder accepts any sub-path and says that no screen exists there.
 */
export function resolveRoute(hash: string, available: readonly WorkspaceId[]): RouteResolution {
  const first = available[0];
  if (first === undefined) return { kind: "none-available" };
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const pathOnly = raw.split("?")[0] ?? "";
  const segments = pathOnly.split("/").filter((segment) => segment !== "");
  const head = segments[0];
  if (head === undefined) return { kind: "redirect", to: first };
  const entry = WORKSPACES.find((candidate) => candidate.segment === head);
  if (entry === undefined) return { kind: "unknown-workspace", path: `/${segments.join("/")}` };
  if (!available.includes(entry.id)) return { kind: "unavailable", id: entry.id };
  const rest = segments.slice(1);
  if (entry.id === "pos" && rest.length > 0) {
    return { kind: "unknown-route", id: "pos", path: `/${segments.join("/")}` };
  }
  return { kind: "workspace", id: entry.id, rest };
}
