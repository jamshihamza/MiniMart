import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

import { Glyph } from "../components/StubButton.js";

export type DialogTone = "default" | "success" | "neutral";

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal frame of the approved reference: header with icon, title and close control, then a body and
 * footer supplied by each dialog. It traps Tab, closes on Escape, moves focus in when it opens and
 * returns focus to the control that opened it. Visual-only: closing a dialog records nothing.
 */
export function Dialog({
  title,
  icon,
  tone = "default",
  width,
  onClose,
  children,
}: {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly tone?: DialogTone;
  readonly width: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = ref.current;
    // Focus moves into the dialog. A dialog with a primary action marks it; otherwise the dialog
    // itself takes focus, so assistive technology announces its title and the first Tab reaches the
    // first control without drawing a focus ring on the close button.
    const preferred = node?.querySelector<HTMLElement>("[data-autofocus]");
    (preferred ?? node)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || node === null) return;
      const stops = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const head = stops[0];
      const tail = stops[stops.length - 1];
      if (head === undefined || tail === undefined) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === head || active === node)) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && active === tail) {
        event.preventDefault();
        head.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, []);

  return (
    <div className="dlg-overlay">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="dlg"
        style={{ width }}
      >
        <div className="dlg__head">
          <div className={`dlg__icon dlg__icon--${tone}`}>
            <Glyph icon={icon} size={18} />
          </div>
          <h2 id={titleId} className="dlg__title">
            {title}
          </h2>
          <button type="button" className="dlg__close" aria-label="Close" onClick={onClose}>
            <Glyph icon={X} size={18} />
          </button>
        </div>
        {children}
      </div>
      <p className="dlg-caption">Fictional visual preview · nothing is recorded</p>
    </div>
  );
}
