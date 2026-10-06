import { ChevronRight, Info } from "lucide-react";
import type { ReactNode } from "react";

import { ChipRow, Glyph } from "./Primitives.js";

/**
 * Replaces the reference's "ILLUSTRATIVE DATA" ribbon. This is a documented integration
 * adjustment (ADR 0007): the implementation is visual-only and every figure is fictional.
 */
export function VisualOnlyBanner() {
  return (
    <div role="note" className="mm-ribbon mm-tone-violet">
      <Glyph icon={Info} size={14} />
      <strong>FICTIONAL FIXTURE DATA</strong>
      <span>
        Visual-only preview. Fictional values, not MiniMart data. Nothing is calculated, posted or
        exported; dashed controls do nothing.
      </span>
    </div>
  );
}

export interface PageHeaderProps {
  readonly crumbs: readonly string[];
  readonly title: string;
  readonly refs?: readonly string[];
  readonly sub?: string;
  readonly actions?: ReactNode;
}

export function PageHeader({ crumbs, title, refs, sub, actions }: PageHeaderProps) {
  const last = crumbs.length - 1;
  return (
    <div className="mm-pagehead">
      <nav aria-label="Breadcrumb" className="mm-crumbs">
        {crumbs.map((crumb, index) => (
          <span key={`${String(index)}-${crumb}`} style={{ display: "contents" }}>
            <span
              className={index === last ? "mm-crumbs__current" : undefined}
              aria-current={index === last ? "page" : undefined}
            >
              {crumb}
            </span>
            {index < last ? <Glyph icon={ChevronRight} size={11} /> : null}
          </span>
        ))}
      </nav>
      <div className="mm-pagehead__row">
        <div className="mm-pagehead__main">
          <h1 className="mm-pagehead__title">{title}</h1>
          {refs === undefined ? null : <ChipRow items={refs} />}
          {sub === undefined ? null : <span className="mm-pagehead__sub">{sub}</span>}
        </div>
        {actions === undefined ? null : <div className="mm-pagehead__actions">{actions}</div>}
      </div>
    </div>
  );
}

export function Page({
  header,
  children,
}: {
  readonly header: PageHeaderProps;
  readonly children?: ReactNode;
}) {
  return (
    <div className="mm-page">
      <VisualOnlyBanner />
      <PageHeader {...header} />
      {children}
    </div>
  );
}
