import type { MarkerKind } from "../components/Primitives.js";
import type { TableColumn } from "../components/DataTable.js";

/** Preview states of Reports Home. They mirror reference screens 01 to 10. */
export type HomeState =
  | "ready"
  | "search"
  | "loading"
  | "empty"
  | "denied"
  | "local-scope"
  | "node-unavailable"
  | "incompatible"
  | "central";

/** Preview states of a report viewer. They mirror reference screens 19 to 27 and 29. */
export type ViewerState =
  | "ready"
  | "offline"
  | "loading"
  | "empty"
  | "invalid"
  | "denied"
  | "conflict"
  | "failed"
  | "incompatible"
  | "node-unavailable";

export interface CatalogEntry {
  readonly name: string;
  /** Requirement identifier shown next to the name. */
  readonly requirement: string;
  /** Optional qualifier shown as a tag, such as "If enabled". */
  readonly flag?: string;
  /** Present only for a report that has a viewer in this preview. */
  readonly slug?: string;
}

export interface CatalogFamily {
  readonly family: string;
  readonly uiRef: string;
  readonly entries: readonly CatalogEntry[];
}

export interface AuthorityNote {
  readonly kind: MarkerKind;
  readonly id: string;
  readonly text: string;
}

export interface DefinitionStatus {
  readonly term: string;
  readonly kind: MarkerKind;
}

export interface ReportSpec {
  readonly slug: string;
  readonly name: string;
  readonly family: string;
  readonly refs: readonly string[];
  readonly sub: string;
  readonly period: string;
  readonly generated: string;
  readonly filters: readonly (readonly [label: string, value: string])[];
  readonly definitions: readonly DefinitionStatus[];
  readonly columns: readonly TableColumn[];
  /** Fictional pre-formatted display strings. Nothing is computed from them. */
  readonly rows: readonly (readonly string[])[];
  /** Fictional pre-formatted totals row. It is not computed by the UI. */
  readonly totals: readonly string[];
  readonly pageLimit: number;
  readonly notes: readonly AuthorityNote[];
}
