import { BackOfficeWorkspace } from "@minimart/backoffice/workspace";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import { PosApp, type PosPreviewMemory } from "../App.js";
import { WorkspaceMenu } from "./WorkspaceMenu.js";
import {
  readAvailability,
  resolveRoute,
  workspaceHref,
  type RouteResolution,
  type WorkspaceId,
} from "./workspaces.js";
import "./host.css";

function subscribe(listener: () => void): () => void {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

function readHash(): string {
  return window.location.hash;
}

function NoticePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main id="ws-notice" className="ws-notice" tabIndex={-1}>
      <h1>{title}</h1>
      {children}
    </main>
  );
}

/**
 * Application host (ADR 0009): hash routes choose the active workspace and only that workspace is
 * mounted. The POS preview state is kept here in memory so leaving and returning shows the same
 * fictional state, while the POS UI itself is unmounted and its scanner capture is reset by the
 * unmount cleanup. This is preview behavior, not a sale lifecycle.
 */
export function WorkspaceHost() {
  const hash = useSyncExternalStore(subscribe, readHash, () => "");
  const available = readAvailability(window.location.search);
  const resolved: RouteResolution = resolveRoute(hash, available);
  const showMenu =
    available.length > 1 && new URLSearchParams(window.location.search).get("inspect") !== "0";

  const memoryRef = useRef<PosPreviewMemory | null>(null);
  const rememberPos = useCallback((memory: PosPreviewMemory) => {
    memoryRef.current = memory;
  }, []);

  // An empty hash is replaced, not pushed, so Back does not return to a blank route.
  useEffect(() => {
    if (resolved.kind === "redirect") {
      window.history.replaceState(null, "", workspaceHref(resolved.to));
    }
  }, [resolved]);

  const activeId: WorkspaceId | null =
    resolved.kind === "workspace" ? resolved.id : resolved.kind === "redirect" ? resolved.to : null;

  // After a switch, move focus into the new workspace. Not on first render, so a page load keeps
  // the browser's own focus behavior.
  const previousActive = useRef<WorkspaceId | null>(activeId);
  useEffect(() => {
    if (previousActive.current !== activeId && activeId !== null) {
      const target = activeId === "pos" ? "workspace" : "bo-workspace";
      document.getElementById(target)?.focus();
    }
    previousActive.current = activeId;
  }, [activeId]);

  let body: React.ReactNode;
  if (resolved.kind === "workspace" || resolved.kind === "redirect") {
    const id = resolved.kind === "workspace" ? resolved.id : resolved.to;
    const rest = resolved.kind === "workspace" ? resolved.rest : [];
    body =
      id === "pos" ? (
        <PosApp restore={memoryRef.current} onMemoryChange={rememberPos} />
      ) : (
        <BackOfficeWorkspace path={rest} />
      );
  } else if (resolved.kind === "unavailable") {
    body = (
      <NoticePage title="Workspace not available">
        <p>
          This workspace is not offered in this preview. Availability here is a preview-only URL
          setting and grants or removes no access.
        </p>
        {available[0] === undefined ? null : (
          <p>
            <a href={workspaceHref(available[0])}>Open the available workspace</a>
          </p>
        )}
      </NoticePage>
    );
  } else if (resolved.kind === "unknown-route") {
    body = (
      <NoticePage title="Route not found">
        <p>
          <code>{resolved.path}</code> is not a route. The POS workspace has no sub-routes.
        </p>
        <p>
          <a href={workspaceHref("pos")}>Open POS</a>
        </p>
      </NoticePage>
    );
  } else if (resolved.kind === "unknown-workspace") {
    body = (
      <NoticePage title="Route not found">
        <p>
          <code>{resolved.path}</code> is not a workspace route.
        </p>
        {available[0] === undefined ? null : (
          <p>
            <a href={workspaceHref(available[0])}>Open the available workspace</a>
          </p>
        )}
      </NoticePage>
    );
  } else {
    body = (
      <NoticePage title="No workspace available">
        <p>No workspace is offered in this preview.</p>
      </NoticePage>
    );
  }

  // The header exists only while the preview switch is shown. Without it (inspect=0 or a single
  // available workspace) the frame adds no box of its own and the workspace keeps the full window.
  const headerShown = showMenu && activeId !== null;
  return (
    <div className={headerShown ? "ws-frame ws-frame--header" : "ws-frame"}>
      {headerShown ? (
        <div className="ws-header" data-preview-only="true">
          <span className="ws-header__label">MiniMart preview host · fictional data</span>
          <WorkspaceMenu active={activeId} available={available} />
        </div>
      ) : null}
      <div className="ws-body">{body}</div>
    </div>
  );
}
