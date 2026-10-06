import {
  Archive,
  Clock,
  History,
  Lock,
  Printer,
  ScanBarcode,
  ShoppingCart,
  Undo2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Glyph } from "../components/StubButton.js";
import { SHELL_PREVIEW } from "../fixtures.js";

export type ShellPage = "sale" | "history" | "returns" | "shift";

export const SHELL_PAGES: readonly { id: ShellPage; label: string; icon: LucideIcon }[] = [
  { id: "sale", label: "Sale", icon: ShoppingCart },
  { id: "history", label: "History", icon: History },
  { id: "returns", label: "Returns", icon: Undo2 },
  { id: "shift", label: "Shift", icon: Clock },
];

/**
 * No device is read, tested or validated in this preview, so none is shown as connected or ready.
 * The approved reference shows illustrative "Ready" statuses; showing them here would claim device
 * state this software cannot know (MM-007 and MM-008 hardware acceptance are still pending).
 */
const DEVICES: readonly { icon: LucideIcon; label: string; status: string; tone: string }[] = [
  { icon: ScanBarcode, label: "Scanner", status: "Not tested", tone: "idle" },
  { icon: Printer, label: "Printer", status: "Not tested", tone: "idle" },
  { icon: Archive, label: "Drawer", status: "Not tested", tone: "idle" },
];

export function Sidebar({
  page,
  locked,
  inert,
  shiftClosing,
  onNavigate,
}: {
  readonly page: ShellPage;
  /** True only in the simulated Store Node offline preview: other sections show a lock. */
  readonly locked: boolean;
  /** True while a modal dialog is open: the sidebar must not take focus or clicks. */
  readonly inert: boolean;
  /** True on the close-shift screen: the operator note reads "Shift closing" (reference screen 23). */
  readonly shiftClosing: boolean;
  readonly onNavigate: (page: ShellPage, label: string) => void;
}) {
  return (
    <aside className="sidebar" inert={inert}>
      <div className="brand" aria-label="MiniMart POS">
        <div className="brand__mark">
          <Glyph icon={ShoppingCart} size={19} />
        </div>
        <div className="brand__text">
          <span className="brand__name">MINIMART</span>
          <span className="brand__sub">Retail POS</span>
        </div>
      </div>
      <nav className="sidenav" aria-label="POS sections">
        {SHELL_PAGES.map(({ id, label, icon }) => {
          const disabled = locked && id !== "sale";
          return (
            <button
              key={id}
              type="button"
              className={`sidenav__item${page === id ? " is-current" : ""}`}
              aria-current={page === id ? "page" : undefined}
              disabled={disabled}
              onClick={() => onNavigate(id, label)}
            >
              <Glyph icon={icon} size={19} />
              <span className="sidenav__label">{label}</span>
              {disabled ? (
                <span className="sidenav__lock">
                  <Glyph icon={Lock} size={14} />
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
      <div className="sidebar__foot">
        <div className="previewtag" role="note">
          <strong>FICTIONAL VISUAL PREVIEW</strong>
          <span>No sale, payment or device is real.</span>
        </div>
        <div
          className="devices"
          title="Devices are not connected or tested in this visual-only preview."
        >
          <span className="devices__title">DEVICES</span>
          {DEVICES.map((device) => (
            <div key={device.label} className="devices__row">
              <Glyph icon={device.icon} size={14} />
              <span className="devices__label">{device.label}</span>
              <span className={`devices__status devices__status--${device.tone}`}>
                <span className="devices__dot" aria-hidden="true" />
                {device.status}
              </span>
            </div>
          ))}
        </div>
        <div className="operator">
          <div className="operator__avatar" aria-hidden="true">
            {SHELL_PREVIEW.cashierInitials}
          </div>
          <div className="operator__text">
            <span className="operator__name">{SHELL_PREVIEW.cashier}</span>
            <span className="operator__shift">
              <span
                className={`operator__dot${shiftClosing ? " is-closing" : ""}`}
                aria-hidden="true"
              />
              {shiftClosing ? "Shift closing" : SHELL_PREVIEW.shiftNote}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
