import { useEffect } from "react";

import { Page } from "./components/Page.js";
import { ButtonLink } from "./components/Primitives.js";
import { StateCard } from "./components/States.js";
import { StateInspector } from "./preview/StateInspector.js";
import { ReportsHome } from "./reports/ReportsHome.js";
import { ReportViewer } from "./reports/ReportViewer.js";
import { resolveTarget } from "./resolve.js";
import type { Target } from "./resolve.js";
import { routeHref, useRoute } from "./router.js";
import { AppShell } from "./shell/AppShell.js";
import type { ShellStatus } from "./shell/AppShell.js";
import { NoticeProvider } from "./shell/notice.js";
import { Search } from "lucide-react";

function statusOf(target: Target): ShellStatus {
  const state = target.kind === "not-found" ? "ready" : target.state;
  return {
    nodeAvailable: state !== "node-unavailable",
    cloudAvailable: state !== "local-scope" && state !== "offline",
    roleLabel: state === "denied" ? "Cashier" : "Manager",
  };
}

function titleOf(target: Target): string {
  switch (target.kind) {
    case "home":
      return "Reports Home";
    case "viewer":
      return target.spec.name;
    case "not-found":
      return "Not available";
  }
}

function Body({ target }: { readonly target: Target }) {
  switch (target.kind) {
    case "home":
      return <ReportsHome state={target.state} initialQuery={target.query} />;
    case "viewer":
      return <ReportViewer spec={target.spec} state={target.state} />;
    case "not-found":
      return (
        <Page
          header={{
            crumbs: ["Reports", "Not available"],
            title: "Not available in this preview",
          }}
        >
          <StateCard
            icon={Search}
            tone="gray"
            title="This address has no screen in the visual-only preview"
            text={`Nothing is implemented at “${target.path}”. Only Reports Home and the Daily Sales Summary viewer exist in this slice.`}
            actions={<ButtonLink label="Back to Reports Home" href={routeHref(["reports"])} kind="primary" />}
          />
        </Page>
      );
  }
}

export function App() {
  const route = useRoute();
  const target = resolveTarget(route);

  useEffect(() => {
    document.title = `${titleOf(target)} · MiniMart Back Office (visual preview, fictional data)`;
  }, [target]);

  return (
    <NoticeProvider>
      <AppShell status={statusOf(target)}>
        <Body target={target} />
      </AppShell>
      <StateInspector route={route} />
    </NoticeProvider>
  );
}
