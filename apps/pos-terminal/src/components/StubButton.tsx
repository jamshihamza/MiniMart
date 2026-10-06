import { createContext, useContext } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

/**
 * Notice channel for controls that have no behavior in this visual-only preview. The shell provides
 * `notify`; it writes to the single status region, so a stub never silently does nothing.
 */
const StubNoticeContext = createContext<(message: string) => void>(() => undefined);

export const StubNoticeProvider = StubNoticeContext.Provider;

export const STUB_TITLE = "Not implemented in this visual-only preview.";

/** Decorative icon. Meaning is always carried by adjacent text or an accessible name. */
export function Glyph({ icon: Icon, size }: { readonly icon: LucideIcon; readonly size: number }) {
  return <Icon className="glyph" size={size} aria-hidden="true" />;
}

/**
 * A control with no implemented behavior. It keeps the reference look, stays focusable, carries a
 * dashed outline and announces that it is not implemented when activated.
 */
export function StubButton({
  label,
  children,
  className,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> & {
  /** Plain name used in the not-implemented notice. */
  readonly label: string;
  readonly children: ReactNode;
}) {
  const notify = useContext(StubNoticeContext);
  return (
    <button
      type="button"
      className={`stub${className === undefined ? "" : ` ${className}`}`}
      aria-disabled="true"
      title={STUB_TITLE}
      onClick={() => notify(`“${label}” is not implemented in this visual-only preview.`)}
      {...rest}
    >
      {children}
    </button>
  );
}
