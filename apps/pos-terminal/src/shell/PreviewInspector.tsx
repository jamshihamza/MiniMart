import { useId, useState } from "react";

import { previewHref } from "../preview.js";
import type { PreviewState } from "../preview.js";
import { SCREENS } from "../screens.js";
import type { ScreenGroup } from "../screens.js";

const GROUP_ORDER: readonly ScreenGroup[] = [
  "Checkout",
  "Payment",
  "History and returns",
  "Shift",
  "Operational states",
];

/**
 * Preview-only control. It is not part of the product UI and has no counterpart in the approved
 * reference. It links to every one of the 31 reference screens, by the reference's own numbers. The
 * toggle always names the data as fictional. Add `inspect=0` to the address to hide it.
 */
export function PreviewInspector({ current }: { readonly current: PreviewState }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!current.inspect) return null;
  return (
    <div className="inspector">
      {open ? (
        <nav id={panelId} aria-label="Preview states" className="inspector__panel">
          <span className="inspector__label">VISUAL PREVIEW CONTROL · NOT PRODUCT UI</span>
          <span className="inspector__note">
            Fictional data. Nothing is sold, posted, paid or printed. Dashed controls do nothing.
            Add &amp;node=online to an address to simulate the reference&apos;s online pill.
          </span>
          {GROUP_ORDER.map((group) => (
            <div key={group}>
              <div className="inspector__group">{group}</div>
              <ul className="inspector__list">
                {SCREENS.filter((screen) => screen.group === group).map((screen) => (
                  <li key={screen.id}>
                    <a
                      className="inspector__link"
                      href={previewHref({ screenId: screen.id })}
                      aria-current={current.screenId === screen.id ? "true" : undefined}
                    >
                      {screen.id} {screen.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      ) : null}
      <button
        type="button"
        className="inspector__toggle"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        Fictional data · Preview states
      </button>
    </div>
  );
}
