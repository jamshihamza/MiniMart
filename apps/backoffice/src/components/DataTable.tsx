import type { ReactNode } from "react";

export interface TableColumn {
  readonly label: string;
  readonly numeric?: boolean;
  readonly bold?: boolean;
  readonly widthPct?: number;
}

/**
 * Semantic results table. Cells are pre-formatted fictional display strings: this component never
 * parses, sums or formats a number. A totals row is shown only when the fixture supplies one.
 */
export function DataTable({
  columns,
  rows,
  totals,
  caption,
}: {
  readonly columns: readonly TableColumn[];
  readonly rows: readonly (readonly ReactNode[])[];
  readonly totals?: readonly string[] | undefined;
  readonly caption: string;
}) {
  return (
    <div className="mm-tablewrap">
      <table className="mm-table">
        <caption className="mm-sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={column.numeric === true ? "is-num" : undefined}
                style={column.widthPct === undefined ? undefined : { width: `${column.widthPct}%` }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td
                  key={column.label}
                  className={
                    [column.numeric === true ? "is-num" : "", column.bold === true ? "is-bold" : ""]
                      .filter((part) => part !== "")
                      .join(" ") || undefined
                  }
                >
                  {row[columnIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {totals === undefined ? null : (
          <tfoot>
            <tr>
              {columns.map((column, columnIndex) => (
                <td key={column.label} className={column.numeric === true ? "is-num" : undefined}>
                  {totals[columnIndex]}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
