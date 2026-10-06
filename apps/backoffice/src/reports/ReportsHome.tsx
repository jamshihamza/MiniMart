import { ChevronRight, FileText, GitBranch, Info, Lock, Search, ShieldAlert } from "lucide-react";
import { useId, useState } from "react";
import type { FormEvent } from "react";

import { Page } from "../components/Page.js";
import type { PageHeaderProps } from "../components/Page.js";
import {
  Button,
  ButtonLink,
  Card,
  Glyph,
  Marker,
  Mono,
  NoteBox,
  Tag,
} from "../components/Primitives.js";
import { Skeleton, StateCard } from "../components/States.js";
import { routeHref } from "../router.js";
import { useNotice } from "../shell/notice.js";
import { CATALOG, CATALOG_TOTAL } from "./catalog.js";
import type { CatalogEntry, CatalogFamily, HomeState } from "./types.js";

const ALL_FAMILIES = "All families";

const HOME_HEADER: PageHeaderProps = {
  crumbs: ["Reports", "Reports Home"],
  title: "Reports Home",
  refs: ["UI-RPT-001", "MM-079", "API-RPT-001", "FR-RPT-002"],
  sub: "Authorized report catalog. Only reports the signed-in role may run are listed.",
};

const CENTRAL_HEADER: PageHeaderProps = {
  crumbs: ["Reports", "Central reports (later phase)"],
  title: "Central reports",
  refs: ["FR-RPT-054", "FR-RPT-055", "Phase 3"],
  sub: "Not available in Phase 2. Shown so the catalog does not imply central completeness.",
};

interface Applied {
  readonly query: string;
  readonly family: string;
}

function matches(entry: CatalogEntry, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === "") return true;
  return (
    entry.name.toLowerCase().includes(needle) || entry.requirement.toLowerCase().includes(needle)
  );
}

function SearchBar({
  query,
  family,
  onQuery,
  onFamily,
  onSearch,
  onClear,
}: {
  readonly query: string;
  readonly family: string;
  readonly onQuery: (value: string) => void;
  readonly onFamily: (value: string) => void;
  readonly onSearch: () => void;
  readonly onClear: () => void;
}) {
  const base = useId();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };
  return (
    <form role="search" aria-label="Search the report catalog" className="mm-search" onSubmit={submit}>
      <div className="mm-search__q">
        <label htmlFor={`${base}-q`} className="mm-field__label">
          Search reports
        </label>
        <input
          id={`${base}-q`}
          type="search"
          className="mm-search__input"
          value={query}
          placeholder="Report name or requirement"
          onChange={(event) => onQuery(event.target.value)}
        />
      </div>
      <div className="mm-field">
        <label htmlFor={`${base}-family`} className="mm-field__label">
          Family
        </label>
        <select
          id={`${base}-family`}
          className="mm-field__select mm-search__family"
          value={family}
          onChange={(event) => onFamily(event.target.value)}
        >
          <option>{ALL_FAMILIES}</option>
          {CATALOG.map((entry) => (
            <option key={entry.family}>{entry.family}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="mm-btn mm-btn--primary">
        <Glyph icon={Search} size={14} />
        Search
      </button>
      <button type="button" className="mm-btn mm-btn--ghost" onClick={onClear}>
        Clear
      </button>
    </form>
  );
}

function EntryRow({ entry, hit }: { readonly entry: CatalogEntry; readonly hit: boolean }) {
  const { notify } = useNotice();
  const content = (
    <>
      <span className="mm-entry__name">{entry.name}</span>
      {entry.flag === undefined ? null : <Tag label={entry.flag} tone="gray" />}
      <Mono>{entry.requirement}</Mono>
      <span className="mm-entry__chevron">
        <Glyph icon={ChevronRight} size={13} />
      </span>
    </>
  );
  const className = `mm-entry${hit ? " is-hit" : ""}`;
  if (entry.slug !== undefined) {
    return (
      <li>
        <a
          href={routeHref(["reports", entry.slug])}
          className={className}
          aria-label={`Open ${entry.name}`}
        >
          {content}
        </a>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        className={`${className} mm-entry--stub`}
        aria-label={`Open ${entry.name}`}
        aria-disabled="true"
        title="This report has no viewer in this visual-only preview."
        onClick={() => notify(`“${entry.name}” has no viewer in this visual-only preview.`)}
      >
        {content}
      </button>
    </li>
  );
}

function FamilyCard({
  family,
  entries,
  highlight,
}: {
  readonly family: CatalogFamily;
  readonly entries: readonly CatalogEntry[];
  readonly highlight: boolean;
}) {
  if (entries.length === 0) return null;
  return (
    <Card style={{ gap: "8px" }}>
      <div className="mm-fam__head">
        <h2 className="mm-fam__title">{family.family}</h2>
        <Mono>{family.uiRef}</Mono>
      </div>
      <ul className="mm-fam__list">
        {entries.map((entry) => (
          <EntryRow key={entry.requirement} entry={entry} hit={highlight} />
        ))}
      </ul>
    </Card>
  );
}

/**
 * The reference renders one grid cell per family even when a family has no match, so an empty
 * cell keeps its place in the grid. That layout is preserved here.
 */
function CatalogGrid({
  include,
  family,
  highlight,
}: {
  readonly include: (entry: CatalogEntry) => boolean;
  readonly family: string;
  readonly highlight: boolean;
}) {
  return (
    <div className="mm-catalog">
      {CATALOG.filter((item) => family === ALL_FAMILIES || item.family === family).map((item) => (
        <div key={item.family}>
          <FamilyCard
            family={item}
            entries={item.entries.filter(include)}
            highlight={highlight}
          />
        </div>
      ))}
    </div>
  );
}

function countMatches(applied: Applied): number {
  return CATALOG.filter(
    (family) => applied.family === ALL_FAMILIES || family.family === applied.family,
  ).reduce(
    (total, family) =>
      total + family.entries.filter((entry) => matches(entry, applied.query)).length,
    0,
  );
}

function CatalogView({ state, initialQuery }: { readonly state: HomeState; readonly initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [family, setFamily] = useState(ALL_FAMILIES);
  const [applied, setApplied] = useState<Applied>({ query: initialQuery, family: ALL_FAMILIES });
  const localScope = state === "local-scope";
  const filtered = applied.query.trim() !== "" || applied.family !== ALL_FAMILIES;

  const search = (
    <SearchBar
      query={query}
      family={family}
      onQuery={setQuery}
      onFamily={setFamily}
      onSearch={() => setApplied({ query, family })}
      onClear={() => {
        setQuery("");
        setFamily(ALL_FAMILIES);
        setApplied({ query: "", family: ALL_FAMILIES });
      }}
    />
  );

  return (
    <Page header={HOME_HEADER}>
      {search}
      {localScope ? (
        <NoteBox icon={Info} tone="blue">
          Local store scope: reports run over authoritative data on this Store Node. Central or
          multi-branch reports (later phase) are not available.
        </NoteBox>
      ) : filtered ? (
        <div role="status" className="mm-countline">
          {`${String(countMatches(applied))} of ${String(CATALOG_TOTAL)} authorized report entries match ${
            applied.query.trim() === ""
              ? applied.family
              : `“${applied.query.trim()}”${applied.family === ALL_FAMILIES ? "" : ` in ${applied.family}`}`
          }`}
        </div>
      ) : (
        <div className="mm-countline">
          <span>
            {`Showing ${String(CATALOG_TOTAL)} of ${String(CATALOG_TOTAL)} authorized report entries (example role: Manager)`}
          </span>
          <Marker kind="GAP" id="API-RPT-001" />
          <span className="mm-countline__hint">
            Report codes and name keys are not frozen; entries are named from the FRS. Only Daily
            Sales Summary opens in this preview.
          </span>
        </div>
      )}
      <CatalogGrid
        include={(entry) =>
          matches(entry, applied.query) && !(localScope && entry.flag === "Phase 3")
        }
        family={applied.family}
        highlight={applied.query.trim() !== ""}
      />
      {filtered || localScope ? null : (
        <NoteBox icon={Info} tone="blue">
          Opening a report runs a bounded, read-only query (API-RPT-002). Nothing on this page can
          edit a source transaction. Reports are operational and are not statutory accounting
          statements (FR-RPT-064).
        </NoteBox>
      )}
    </Page>
  );
}

/** Reports Home (UI-RPT-001) in every preview state of the approved reference. */
export function ReportsHome({
  state,
  initialQuery = "",
}: {
  readonly state: HomeState;
  readonly initialQuery?: string;
}) {
  switch (state) {
    case "loading":
      return (
        <Page header={HOME_HEADER}>
          <StaticSearchBar />
          <Skeleton />
        </Page>
      );
    case "empty":
      return (
        <Page header={HOME_HEADER}>
          <StaticSearchBar />
          <StateCard
            icon={FileText}
            tone="gray"
            title="No reports are available to this role"
            text="The catalog loaded successfully but no report definitions are authorized for this role, or none are defined yet. This is not an error."
            actions={<Button label="Contact a manager" kind="primary" />}
          />
        </Page>
      );
    case "denied":
      return (
        <Page header={HOME_HEADER}>
          <StateCard
            icon={Lock}
            tone="amber"
            title="Reports are not available for your role"
            text="Viewing the report catalog needs reporting.read. Role labels guide navigation only; the server decides. Restricted financial and customer data stay hidden."
            actions={<Button label="Back to Dashboard" kind="primary" />}
          />
        </Page>
      );
    case "incompatible":
      return (
        <Page header={HOME_HEADER}>
          <StateCard
            icon={ShieldAlert}
            tone="red"
            title="Update this client to open reports"
            text="This client is not compatible with the Store Node report contract, so reports and exports are blocked until a compatible client is installed."
            actions={<Button label="Show update instructions" kind="primary" />}
          />
        </Page>
      );
    case "central":
      return (
        <Page header={CENTRAL_HEADER}>
          <StateCard
            icon={GitBranch}
            tone="gray"
            title="Central and multi-branch reports arrive with cloud synchronization"
            text="They require synchronized centralization (Phase 3). Until then, every report is scoped to one store and states its local scope. When central reports exist, they must show synchronization freshness and never imply completeness."
            actions={
              <ButtonLink label="Back to Reports Home" href={routeHref(["reports"])} kind="primary" />
            }
            extra={
              <div style={{ display: "flex", gap: "8px" }}>
                <Marker kind="LATER" id="Phase 3" />
                <Marker kind="GAP" id="no frozen central-report screen" />
              </div>
            }
          />
        </Page>
      );
    case "node-unavailable":
      // The shell shows the Store Node unavailable card; the page body is not rendered.
      return null;
    case "ready":
    case "search":
    case "local-scope":
      return <CatalogView key={state} state={state} initialQuery={initialQuery} />;
  }
}

/** The search form as the loading and empty states show it. Searching is inert there. */
function StaticSearchBar() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState(ALL_FAMILIES);
  return (
    <SearchBar
      query={query}
      family={family}
      onQuery={setQuery}
      onFamily={setFamily}
      onSearch={() => undefined}
      onClear={() => {
        setQuery("");
        setFamily(ALL_FAMILIES);
      }}
    />
  );
}
