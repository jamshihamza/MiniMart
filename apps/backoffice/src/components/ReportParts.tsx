import { ChevronLeft, CircleAlert, ListFilter } from "lucide-react";
import { useId } from "react";

import type { AuthorityNote, DefinitionStatus, ReportSpec } from "../reports/types.js";
import { Annotation, Button, Card, Glyph, Marker } from "./Primitives.js";

const READ_ONLY_HINT =
  "Running or changing a report never edits business records. Reports are read-only views of posted data (FR-RPT-001).";

/**
 * Filter bar of the report viewer. The fields are real labelled controls, but each shows only its
 * single fictional value. Applying or resetting filters is not implemented in this preview.
 */
export function FilterBar({
  filters,
  invalidField,
}: {
  readonly filters: ReportSpec["filters"];
  readonly invalidField?: string | undefined;
}) {
  const base = useId();
  const errorId = `${base}-error`;
  return (
    <form
      aria-label="Report filters"
      className="mm-filterbar"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="mm-filterbar__row">
        {filters.map(([label, value]) => {
          const id = `${base}-${label.replaceAll(/\W+/g, "-")}`;
          const invalid = invalidField === label;
          return (
            <div key={label} className="mm-field">
              <label htmlFor={id} className="mm-field__label">
                {label}
              </label>
              <select
                id={id}
                className="mm-field__select"
                defaultValue={value}
                aria-invalid={invalid ? "true" : undefined}
                aria-describedby={invalid ? errorId : undefined}
              >
                <option value={value}>{value}</option>
              </select>
            </div>
          );
        })}
        <div className="mm-filterbar__buttons">
          <Button label="Reset filters" kind="ghost" />
          <Button label="Apply filters" kind="primary" icon={ListFilter} />
        </div>
      </div>
      {invalidField === undefined ? null : (
        <div id={errorId} role="alert" className="mm-filterbar__error">
          <Glyph icon={CircleAlert} size={14} />
          Business date range is invalid: the end date is before the start date.
        </div>
      )}
      <span className="mm-filterbar__hint">{READ_ONLY_HINT}</span>
    </form>
  );
}

export function ContextStrip({ spec }: { readonly spec: ReportSpec }) {
  const items: readonly (readonly [string, string])[] = [
    ["Store scope", "MiniMart Central · 1 store"],
    ["Period", spec.period],
    ["Generated", `${spec.generated} (fictional)`],
    ["Data basis", "Authoritative local Store Node data"],
    ["Currency", "MYR · store country context: MY"],
  ];
  return (
    <Card style={{ padding: "10px 14px", gap: "0" }}>
      <div className="mm-ctx">
        {items.map(([label, value]) => (
          <div key={label} className="mm-ctx__item">
            <span className="mm-ctx__label">{label}</span>
            <span className="mm-ctx__value">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Compact status list of the totals definitions. No formula is asserted anywhere here. */
export function DefinitionsPanel({
  definitions,
}: {
  readonly definitions: readonly DefinitionStatus[];
}) {
  return (
    <Card style={{ padding: "10px 14px", gap: "4px" }}>
      <div className="mm-defs">
        <strong style={{ fontSize: "12.5px" }}>Totals definitions (FR-RPT-050):</strong>
        {definitions.map((definition) => (
          <span key={definition.term} className="mm-defs__term">
            {definition.term}
            <Marker kind={definition.kind} />
          </span>
        ))}
      </div>
      <span className="mm-hint">
        Definition text per term is on the Totals definitions screen. No formula is asserted here.
      </span>
    </Card>
  );
}

export function Pager({ rowCount, limit }: { readonly rowCount: number; readonly limit: number }) {
  return (
    <div className="mm-pager">
      <span>
        {`Showing ${String(rowCount)} of ${String(rowCount)} rows in scope · bounded page (limit ${String(limit)}) · nextCursor: none`}
      </span>
      <span className="mm-pager__buttons">
        <Button label="Previous page" icon={ChevronLeft} disabled />
        <Button label="Next page" disabled />
      </span>
    </div>
  );
}

/** Authority dependencies. They keep unresolved decisions visible next to the data they affect. */
export function AuthorityNotes({ notes }: { readonly notes: readonly AuthorityNote[] }) {
  if (notes.length === 0) return null;
  return (
    <Annotation title="Authority dependencies for this screen">
      <div className="mm-notes">
        {notes.map((note) => (
          <div key={`${note.kind}-${note.id}`} className="mm-notes__row">
            <Marker kind={note.kind} id={note.id} />
            <span>{note.text}</span>
          </div>
        ))}
      </div>
    </Annotation>
  );
}
