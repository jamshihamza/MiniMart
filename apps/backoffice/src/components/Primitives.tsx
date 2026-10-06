import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { useNotice } from "../shell/notice.js";

export type Tone = "amber" | "blue" | "red" | "green" | "gray" | "violet";

export const STUB_TITLE = "Not implemented in this visual-only preview.";

/** Decorative icon. Meaning is always carried by adjacent text. */
export function Glyph({ icon: Icon, size }: { readonly icon: LucideIcon; readonly size: number }) {
  return <Icon className="mm-icon" size={size} aria-hidden="true" />;
}

export function Card({
  children,
  style,
}: {
  readonly children: ReactNode;
  readonly style?: CSSProperties;
}) {
  return (
    <div className="mm-card" style={style}>
      {children}
    </div>
  );
}

export function Tag({ label, tone = "gray" }: { readonly label: string; readonly tone?: Tone }) {
  return <span className={`mm-tag mm-tone-${tone}`}>{label}</span>;
}

export type MarkerKind = "OPEN" | "VERIFY" | "PROPOSED" | "DEFERRED" | "RESOLVED" | "GAP" | "LATER";

const MARKER_TONE: Record<MarkerKind, Tone> = {
  OPEN: "red",
  VERIFY: "amber",
  PROPOSED: "blue",
  DEFERRED: "gray",
  RESOLVED: "green",
  GAP: "violet",
  LATER: "gray",
};

/** Decision-status marker from the design package. It preserves an unresolved decision. */
export function Marker({ kind, id }: { readonly kind: MarkerKind; readonly id?: string }) {
  return <Tag label={kind + (id === undefined ? "" : ` · ${id}`)} tone={MARKER_TONE[kind]} />;
}

export function Mono({ children }: { readonly children: ReactNode }) {
  return <span className="mm-mono">{children}</span>;
}

export function ChipRow({ items }: { readonly items: readonly string[] }) {
  return (
    <div className="mm-chips">
      {items.map((item) => (
        <span key={item} className="mm-chip">
          {item}
        </span>
      ))}
    </div>
  );
}

export function NoteBox({
  icon,
  tone = "amber",
  children,
}: {
  readonly icon: LucideIcon;
  readonly tone?: Tone;
  readonly children: ReactNode;
}) {
  return (
    <div className={`mm-note mm-tone-${tone}`}>
      <Glyph icon={icon} size={14} />
      <span>{children}</span>
    </div>
  );
}

export function Annotation({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="mm-annot">
      <div className="mm-annot__head">
        <span className="mm-annot__label">DESIGN ANNOTATION · NOT PRODUCT UI</span>
        <span className="mm-annot__title">{title}</span>
      </div>
      {children}
    </div>
  );
}

export type ButtonKind = "primary" | "secondary" | "ghost" | "danger";

interface ButtonBase {
  readonly label: string;
  readonly kind?: ButtonKind;
  readonly icon?: LucideIcon;
  readonly large?: boolean;
}

function buttonClass(kind: ButtonKind, large: boolean, stub: boolean): string {
  return ["mm-btn", `mm-btn--${kind}`, large ? "mm-btn--lg" : "", stub ? "mm-btn--stub" : ""]
    .filter((part) => part !== "")
    .join(" ");
}

/**
 * A control that has no behavior in this preview. It stays focusable, announces itself as not
 * implemented, and is drawn with a dashed outline. Pass `disabled` for a control the reference
 * itself shows as disabled.
 */
export function Button({
  label,
  kind = "secondary",
  icon,
  large = false,
  disabled = false,
  title,
  onClick,
}: ButtonBase & {
  readonly disabled?: boolean;
  readonly title?: string;
  readonly onClick?: () => void;
}) {
  const { notify } = useNotice();
  const isStub = !disabled && onClick === undefined;
  const hint = [title, isStub ? STUB_TITLE : undefined].filter((part) => part !== undefined);
  return (
    <button
      type="button"
      className={buttonClass(kind, large, isStub)}
      disabled={disabled}
      aria-disabled={isStub ? "true" : undefined}
      title={hint.length > 0 ? hint.join(" ") : undefined}
      onClick={
        isStub ? () => notify(`“${label}” is not implemented in this visual-only preview.`) : onClick
      }
    >
      {icon === undefined ? null : <Glyph icon={icon} size={large ? 15 : 14} />}
      {label}
    </button>
  );
}

/** A real local navigation link drawn as a button. */
export function ButtonLink({
  label,
  href,
  kind = "secondary",
  icon,
  large = false,
}: ButtonBase & { readonly href: string }) {
  return (
    <a href={href} className={buttonClass(kind, large, false)} style={{ textDecoration: "none" }}>
      {icon === undefined ? null : <Glyph icon={icon} size={large ? 15 : 14} />}
      {label}
    </a>
  );
}
