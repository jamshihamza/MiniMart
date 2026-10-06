import { useId, useState } from "react";

import { routeHref } from "../router.js";
import type { Route } from "../router.js";

interface PreviewLink {
  readonly label: string;
  readonly segments: readonly string[];
  readonly params: Readonly<Record<string, string>>;
}

const home = (label: string, state: string, extra: Record<string, string> = {}): PreviewLink => ({
  label,
  segments: ["reports"],
  params: { state, ...extra },
});

const viewer = (label: string, state: string): PreviewLink => ({
  label,
  segments: ["reports", "daily-sales-summary"],
  params: { state },
});

/** Preview states with the reference screen number each one mirrors. */
const GROUPS: readonly { readonly title: string; readonly links: readonly PreviewLink[] }[] = [
  {
    title: "Reports Home",
    links: [
      home("01 Authorized catalog", "ready"),
      home("02 Search applied", "search", { q: "return" }),
      home("04 Loading", "loading"),
      home("05 Empty", "empty"),
      home("06 Permission denied", "denied"),
      home("07 Local scope", "local-scope"),
      home("08 Store Node unavailable", "node-unavailable"),
      home("09 Incompatible client", "incompatible"),
      home("10 Later-phase central", "central"),
    ],
  },
  {
    title: "Daily Sales Summary",
    links: [
      viewer("29 Ready", "ready"),
      viewer("19 Loading", "loading"),
      viewer("20 Empty result", "empty"),
      viewer("21 Validation error", "invalid"),
      viewer("22 Permission denied", "denied"),
      viewer("23 Definition conflict", "conflict"),
      viewer("24 Run failed", "failed"),
      viewer("25 Local scope", "offline"),
      viewer("26 Store Node unavailable", "node-unavailable"),
      viewer("27 Incompatible client", "incompatible"),
    ],
  },
];

function isCurrent(link: PreviewLink, route: Route): boolean {
  const here = route.segments.length === 0 ? ["reports"] : route.segments;
  return (
    here.join("/") === link.segments.join("/") &&
    (route.params.get("state") ?? "ready") === link.params["state"]
  );
}

/**
 * Preview-only control. It is not part of the product UI and has no counterpart in the approved
 * reference. It only links to the fictional preview states. Add `?inspect=0` to hide it.
 */
export function StateInspector({ route }: { readonly route: Route }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (route.params.get("inspect") === "0") return null;
  return (
    <div className="mm-inspector">
      {open ? (
        <nav id={panelId} aria-label="Preview states" className="mm-inspector__panel">
          <span className="mm-inspector__label">VISUAL PREVIEW CONTROL · NOT PRODUCT UI</span>
          {GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mm-inspector__group">{group.title}</div>
              <ul className="mm-inspector__list">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="mm-inspector__link"
                      href={routeHref(link.segments, link.params)}
                      aria-current={isCurrent(link, route) ? "true" : undefined}
                    >
                      {link.label}
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
        className="mm-inspector__toggle"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        Preview states
      </button>
    </div>
  );
}
