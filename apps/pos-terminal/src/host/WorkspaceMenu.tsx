import { useEffect, useRef, useState } from "react";

import { WORKSPACES, workspaceHref, type WorkspaceId } from "./workspaces.js";

interface WorkspaceMenuProps {
  readonly active: WorkspaceId;
  readonly available: readonly WorkspaceId[];
}

/**
 * Host-level workspace switch (ADR 0009). It sits at the right of the host header, outside both
 * workspaces and outside the POS navigation, and it is labelled preview only. It adds no landmark
 * and no status region.
 */
export function WorkspaceMenu({ active, available }: WorkspaceMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    function handlePointer(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Node && menuRef.current?.contains(target) === true) return;
      if (target instanceof Node && buttonRef.current?.contains(target) === true) return;
      setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handlePointer);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handlePointer);
    };
  }, [open]);

  const activeLabel = WORKSPACES.find((entry) => entry.id === active)?.label ?? "";

  return (
    <div className="ws-switch" data-preview-only="true">
      <button
        ref={buttonRef}
        type="button"
        className="ws-switch__button"
        aria-expanded={open}
        aria-controls="ws-switch-menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span>Workspace: {activeLabel}</span>
        <span className="ws-switch__tag">Preview only</span>
      </button>
      {open ? (
        <div
          id="ws-switch-menu"
          ref={menuRef}
          className="ws-switch__menu"
          role="group"
          aria-label="Workspaces, preview only"
        >
          <p className="ws-switch__note">
            Preview-only availability. Nothing here is signed in, enrolled or authorized by a
            server.
          </p>
          <ul className="ws-switch__list">
            {WORKSPACES.filter((entry) => available.includes(entry.id)).map((entry) => (
              <li key={entry.id}>
                <a
                  className="ws-switch__link"
                  href={workspaceHref(entry.id)}
                  aria-current={entry.id === active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {entry.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
