import {
  Bell,
  Calendar,
  ChevronDown,
  Cloud,
  CloudOff,
  Monitor,
  Server,
  ServerOff,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Glyph, StubButton } from "../components/StubButton.js";
import { SHELL_PREVIEW } from "../fixtures.js";

export type PillKind = "ok" | "bad" | "warn" | "mute";

export interface PillModel {
  readonly label: string;
  readonly kind: PillKind;
  readonly title: string;
}

function Pill({ pill, icon }: { readonly pill: PillModel; readonly icon: LucideIcon }) {
  return (
    <div title={pill.title} className={`pill pill--${pill.kind}`}>
      <Glyph icon={icon} size={14} />
      {pill.label}
    </div>
  );
}

export function TopBar({ node, sync }: { readonly node: PillModel; readonly sync: PillModel }) {
  return (
    <header className="topbar">
      <div className="topbar__store">
        <Glyph icon={Store} size={17} />
        {SHELL_PREVIEW.store}
      </div>
      <div className="topbar__ctx">
        <Glyph icon={Monitor} size={15} />
        Register <span className="topbar__mono">{SHELL_PREVIEW.register}</span>
      </div>
      <div className="topbar__ctx">
        <Glyph icon={Calendar} size={15} />
        Business date <span className="topbar__date">{SHELL_PREVIEW.businessDate}</span>
        <span className="topbar__time">· {SHELL_PREVIEW.businessTime}</span>
      </div>
      <div className="topbar__right">
        <Pill pill={node} icon={node.kind === "bad" ? ServerOff : Server} />
        <Pill pill={sync} icon={sync.kind === "warn" ? CloudOff : Cloud} />
        <StubButton label="Notifications" className="iconbtn" aria-label="Notifications">
          <Glyph icon={Bell} size={17} />
          <span className="iconbtn__dot" aria-hidden="true" />
        </StubButton>
        <StubButton label="User menu" className="usermenu">
          <span className="usermenu__avatar" aria-hidden="true">
            {SHELL_PREVIEW.cashierInitials}
          </span>
          {SHELL_PREVIEW.cashier}
          <Glyph icon={ChevronDown} size={14} />
        </StubButton>
      </div>
    </header>
  );
}
