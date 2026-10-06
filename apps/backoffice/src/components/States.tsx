import { Loader } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Glyph } from "./Primitives.js";
import type { Tone } from "./Primitives.js";

const SKELETON_BARS = [0, 1, 2, 3, 4, 5] as const;

/** Loading state. Totals are never shown until a run completes. */
export function Skeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="mm-skeleton">
      <span className="mm-skeleton__label">
        <Glyph icon={Loader} size={14} />
        Running report on the Store Node… totals are shown only when the run completes.
      </span>
      {SKELETON_BARS.map((index) => (
        <div
          key={index}
          className="mm-skeleton__bar"
          style={{ width: `${String(96 - index * 7)}%` }}
        />
      ))}
    </div>
  );
}

export function StateCard({
  icon,
  tone,
  title,
  text,
  actions,
  extra,
}: {
  readonly icon: LucideIcon;
  readonly tone: Tone;
  readonly title: string;
  readonly text: string;
  readonly actions?: ReactNode;
  readonly extra?: ReactNode;
}) {
  return (
    <div role={tone === "red" || tone === "amber" ? "alert" : "status"} className="mm-state">
      <div className={`mm-state__icon mm-tone-${tone}`}>
        <Glyph icon={icon} size={21} />
      </div>
      <div className="mm-state__body">
        <span className="mm-state__title">{title}</span>
        <span className="mm-state__text">{text}</span>
        {extra ?? null}
        {actions === undefined ? null : <div className="mm-state__actions">{actions}</div>}
      </div>
    </div>
  );
}
