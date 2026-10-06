import { useEffect, useState } from "react";

import "./workspace.css";

/**
 * Minimal Back Office workspace placeholder for the workspace-host preview (ADR 0009).
 *
 * It is not the Back Office shell and it builds no module screen. The Back Office shell design is
 * review-ready and not approved, and every module design keeps its own status. This file must not
 * import Tauri, the POS application or any network client; a test checks that source boundary. A
 * source check is not proof of runtime isolation in a shared Tauri window.
 */
export interface BackOfficeWorkspaceProps {
  /** Route segments after the workspace segment, for example ["reports"]. */
  readonly path: readonly string[];
}

export function BackOfficeWorkspace({ path }: BackOfficeWorkspaceProps) {
  const [message, setMessage] = useState("");

  // The frozen UI specification gives Back Office a Ctrl+K command search. It exists only while
  // this workspace is mounted, so it can never fire inside the POS workspace. It is a stub.
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }
      event.preventDefault();
      setMessage("Command search is not implemented in this placeholder.");
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const route = path.length === 0 ? "/back-office" : `/back-office/${path.join("/")}`;

  return (
    <div className="bo-workspace" data-workspace="back-office">
      <nav className="bo-workspace__nav" aria-label="Back Office navigation">
        <p className="bo-workspace__brand">Back Office</p>
        <a
          className="bo-workspace__link"
          href="#/back-office"
          aria-current={path.length === 0 ? "page" : undefined}
        >
          Home
        </a>
      </nav>
      <main id="bo-workspace" className="bo-workspace__main" tabIndex={-1}>
        <p className="bo-workspace__tag">Placeholder · preview only · fictional</p>
        <h1>Back Office workspace</h1>
        {path.length === 0 ? (
          <p>
            No Back Office screen is built here. The Back Office shell design is review-ready and
            not approved. Module designs keep their own statuses.
          </p>
        ) : (
          <p>
            No Back Office screen exists at <code>{route}</code> yet.
          </p>
        )}
        <p className="bo-workspace__route">
          Route: <code>{route}</code>
        </p>
        <p className="bo-workspace__note" role="status" aria-live="polite">
          {message}
        </p>
      </main>
    </div>
  );
}
