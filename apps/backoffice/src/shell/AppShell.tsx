import {
  Building2,
  Calendar,
  Cloud,
  CloudOff,
  CornerDownRight,
  RefreshCw,
  Server,
  ServerOff,
  Store,
} from "lucide-react";
import type { ReactNode } from "react";

import { VisualOnlyBanner } from "../components/Page.js";
import { Button, ButtonLink, Glyph, STUB_TITLE } from "../components/Primitives.js";
import { routeHref } from "../router.js";
import { NAV } from "./nav.js";
import { useNotice } from "./notice.js";

export interface ShellStatus {
  readonly nodeAvailable: boolean;
  readonly cloudAvailable: boolean;
  readonly roleLabel: string;
}

function Sidebar() {
  return (
    <nav aria-label="Primary navigation" className="mm-sidebar">
      <div className="mm-brand">
        <div className="mm-brand__mark">
          <Glyph icon={Store} size={16} />
        </div>
        <div className="mm-brand__text">
          <span className="mm-brand__name">MINIMART</span>
          <span className="mm-brand__sub">Back Office</span>
        </div>
      </div>
      {NAV.map((group) => (
        <div key={group.label} className="mm-navgroup">
          <span className="mm-navgroup__label">{group.label}</span>
          {group.items.map((item) =>
            item.stub ? (
              <button
                key={item.label}
                type="button"
                className="mm-navitem"
                disabled
                title={STUB_TITLE}
              >
                <Glyph icon={item.icon} size={15} />
                <span className="mm-navitem__label">{item.label}</span>
                <span className="mm-navitem__stub">
                  <Glyph icon={CornerDownRight} size={11} />
                </span>
              </button>
            ) : (
              <a
                key={item.label}
                href={routeHref(["reports"])}
                className="mm-navitem"
                aria-current="page"
              >
                <Glyph icon={item.icon} size={15} />
                <span className="mm-navitem__label">{item.label}</span>
              </a>
            ),
          )}
        </div>
      ))}
      <div className="mm-sidebar__foot">
        <span className="mm-sidebar__note">
          Structural navigation only. Sections other than Reports are not implemented.
        </span>
      </div>
    </nav>
  );
}

function TopBar({ status }: { readonly status: ShellStatus }) {
  const { notify } = useNotice();
  return (
    <header className="mm-topbar">
      <div className="mm-topbar__org">
        <Glyph icon={Building2} size={15} />
        MiniMart Sdn Bhd
      </div>
      <div className="mm-topbar__ctx">
        <Glyph icon={Store} size={14} />
        Store <span className="mm-topbar__strong">MiniMart Central</span>
      </div>
      <div className="mm-topbar__ctx">
        <Glyph icon={Calendar} size={14} />
        Business date <span className="mm-topbar__medium">Sat, 26 Sep 2026</span>
      </div>
      <div className="mm-topbar__right">
        <div
          title="Store Node connection"
          className={`mm-pill ${status.nodeAvailable ? "mm-pill--ok" : "mm-pill--down"}`}
        >
          <Glyph icon={status.nodeAvailable ? Server : ServerOff} size={13} />
          {status.nodeAvailable ? "Store Node online" : "Store Node unavailable"}
        </div>
        <div
          title="Cloud synchronisation"
          className={`mm-pill ${status.cloudAvailable ? "mm-pill--neutral" : "mm-pill--warn"}`}
        >
          <Glyph icon={status.cloudAvailable ? Cloud : CloudOff} size={13} />
          {status.cloudAvailable ? "Sync healthy" : "Cloud sync unavailable"}
        </div>
        <button
          type="button"
          className="mm-user"
          aria-disabled="true"
          title={STUB_TITLE}
          onClick={() => notify("The user menu is not implemented in this visual-only preview.")}
        >
          <span className="mm-user__avatar" aria-hidden="true">
            SM
          </span>
          Siti M. <span className="mm-user__role">· {status.roleLabel}</span>
        </button>
      </div>
    </header>
  );
}

function NodeUnavailable() {
  return (
    <div className="mm-nodedown">
      <div role="alert" className="mm-nodedown__card">
        <div className="mm-nodedown__row">
          <div className="mm-nodedown__icon">
            <Glyph icon={ServerOff} size={22} />
          </div>
          <div className="mm-nodedown__text">
            <h1 className="mm-nodedown__title">Store Node unavailable</h1>
            <span className="mm-nodedown__copy">
              Reports are served by Store Node query ports, so they cannot run until the connection
              returns. Totals shown earlier are not presented as current, and no report or export
              can be started. This is different from a cloud-sync outage, where local reports
              continue.
            </span>
          </div>
        </div>
        <div className="mm-nodedown__actions">
          <Button label="Retry connection" kind="primary" icon={RefreshCw} large />
          <ButtonLink label="Back to Reports Home" href={routeHref(["reports"])} large />
        </div>
        <span className="mm-nodedown__note">
          Design note: illustrative state. Source contract: UI state STORE_NODE_UNREACHABLE (UI spec
          17-SCREEN-STATE-CONTRACT).
        </span>
      </div>
    </div>
  );
}

/** Back Office application shell. Navigation and status pills follow the approved reference. */
export function AppShell({
  status,
  children,
}: {
  readonly status: ShellStatus;
  readonly children: ReactNode;
}) {
  return (
    <div className="mm-app">
      <Sidebar />
      <div className="mm-main">
        <TopBar status={status} />
        <main className="mm-content">
          {status.nodeAvailable ? (
            <>
              {status.cloudAvailable ? null : (
                <div role="status" className="mm-cloudbar">
                  <Glyph icon={CloudOff} size={16} />
                  <div className="mm-cloudbar__text">
                    <strong>Cloud sync unavailable.</strong> Reports over authoritative local store
                    data remain available and state their local/store scope. Central or
                    multi-branch reports (later phase) are not available. Cloud-dependent
                    information may be stale.
                  </div>
                </div>
              )}
              <div className="mm-body">{children}</div>
            </>
          ) : (
            <>
              <div className="mm-body mm-body--banner">
                <VisualOnlyBanner />
              </div>
              <NodeUnavailable />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
