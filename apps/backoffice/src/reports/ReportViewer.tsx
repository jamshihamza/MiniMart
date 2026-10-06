import {
  CircleAlert,
  CircleX,
  Download,
  Info,
  Lock,
  Printer,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";

import { DataTable } from "../components/DataTable.js";
import { Page } from "../components/Page.js";
import { Button, ButtonLink, Mono, NoteBox } from "../components/Primitives.js";
import {
  AuthorityNotes,
  ContextStrip,
  DefinitionsPanel,
  FilterBar,
  Pager,
} from "../components/ReportParts.js";
import { Skeleton, StateCard } from "../components/States.js";
import { routeHref } from "../router.js";
import type { ReportSpec, ViewerState } from "./types.js";

const HOME = routeHref(["reports"]);

function Results({ spec, withDefinitions }: { readonly spec: ReportSpec; readonly withDefinitions: boolean }) {
  return (
    <>
      {withDefinitions ? <DefinitionsPanel definitions={spec.definitions} /> : null}
      <DataTable
        columns={spec.columns}
        rows={spec.rows}
        totals={spec.totals}
        caption={spec.name}
      />
      <Pager rowCount={spec.rows.length} limit={spec.pageLimit} />
    </>
  );
}

function stateBody(spec: ReportSpec, state: ViewerState): ReactNode {
  switch (state) {
    case "ready":
      return (
        <>
          <ContextStrip spec={spec} />
          <Results spec={spec} withDefinitions />
          <AuthorityNotes notes={spec.notes} />
        </>
      );
    case "offline":
      return (
        <>
          <ContextStrip spec={spec} />
          <NoteBox icon={Info} tone="blue">
            Local store scope: this output covers authoritative data on this Store Node only
            (FR-RPT-053). Cloud-held or other-branch data is not included.
          </NoteBox>
          <Results spec={spec} withDefinitions={false} />
        </>
      );
    case "loading":
      return <Skeleton />;
    case "empty":
      return (
        <StateCard
          icon={Search}
          tone="gray"
          title="No posted data matches these filters"
          text="The run completed successfully and returned zero rows. This is not an error and nothing is hidden. Widen the business-date range, store scope or status filter, or reset the filters."
          actions={
            <>
              <Button label="Reset filters" kind="primary" />
              <Button label="Widen date range" />
            </>
          }
        />
      );
    case "invalid":
      return (
        <StateCard
          icon={CircleAlert}
          tone="red"
          title="Report not run"
          text="Fix the highlighted filter and run again. No results, totals or export are available for an invalid request, and nothing was changed."
          actions={<Button label="Fix filter" kind="primary" />}
        />
      );
    case "denied":
      return (
        <StateCard
          icon={Lock}
          tone="amber"
          title="You do not have permission to view this report"
          text="Viewing reports needs reporting.read, and restricted financial or customer data needs the matching scope. Hiding the control in the UI is not the authority: the server decides. Ask an authorised manager if you need access."
          actions={
            <>
              <ButtonLink label="Back to Reports Home" href={HOME} kind="primary" />
              <Button label="Request access from a manager" />
            </>
          }
        />
      );
    case "conflict":
      return (
        <StateCard
          icon={RefreshCw}
          tone="amber"
          title="The report definition changed"
          text="The Store Node updated this report definition (supported filters or grouping) after this page loaded, so your last filter set may no longer apply. Refresh the definition and reapply your filters. Nothing has been shown for the stale request."
          actions={
            <>
              <Button label="Refresh definition" kind="primary" icon={RefreshCw} />
              <Button label="Keep my filters and review" />
            </>
          }
        />
      );
    case "failed":
      return (
        <StateCard
          icon={CircleX}
          tone="red"
          title="Report could not be completed"
          text="The run failed before it finished, so no totals are displayed: a partial total could be mistaken for a complete one (FR-RPT-062). Retry the run, or contact support with the reference below."
          actions={
            <>
              <Button label="Retry run" kind="primary" icon={RefreshCw} />
              <Button label="Copy support reference" />
            </>
          }
          extra={
            <span className="mm-state__ref">
              Reference <Mono>RPT-RUN-ILLUSTRATIVE-0001</Mono>
              {` · scope: MiniMart Central · ${spec.period}`}
            </span>
          }
        />
      );
    case "incompatible":
      return (
        <StateCard
          icon={ShieldAlert}
          tone="red"
          title="Update this client to run reports"
          text="This client version is not compatible with the Store Node report contract. Report runs and exports are blocked until a compatible client is installed. Your filters are preserved."
          actions={<Button label="Show update instructions" kind="primary" />}
        />
      );
    case "node-unavailable":
      // The shell shows the Store Node unavailable card; the report body is not rendered.
      return null;
  }
}

/** Report viewer. Every report and every state uses these regions in this order. */
export function ReportViewer({
  spec,
  state,
}: {
  readonly spec: ReportSpec;
  readonly state: ViewerState;
}) {
  const complete = state === "ready" || state === "offline";
  const actions = (
    <>
      <Button
        label="Export"
        icon={Download}
        disabled={!complete}
        title="Creates an export job (API-RPT-003). Requires reporting.write."
      />
      <Button label="Print" icon={Printer} disabled={!complete} />
    </>
  );
  return (
    <Page
      header={{
        crumbs: ["Reports", spec.family, spec.name],
        title: spec.name,
        refs: spec.refs,
        sub: spec.sub,
        actions,
      }}
    >
      <FilterBar filters={spec.filters} invalidField={state === "invalid" ? "Business date" : undefined} />
      {stateBody(spec, state)}
    </Page>
  );
}
