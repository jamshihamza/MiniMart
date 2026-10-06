import { describe, expect, it } from "vitest";

import {
  readAvailability,
  resolveRoute,
  workspaceHref,
  WORKSPACES,
} from "../../src/host/workspaces.js";

const BOTH = ["pos", "back-office"] as const;

describe("workspace availability (preview only)", () => {
  it("offers both workspaces unless the preview parameter narrows it", () => {
    expect(readAvailability("")).toEqual(BOTH);
    expect(readAvailability("?workspaces=both")).toEqual(BOTH);
    expect(readAvailability("?workspaces=nonsense")).toEqual(BOTH);
    expect(readAvailability("?workspaces=pos")).toEqual(["pos"]);
    expect(readAvailability("?workspaces=back-office")).toEqual(["back-office"]);
  });

  it("registers exactly the two workspaces with separate route segments", () => {
    expect(WORKSPACES.map((entry) => entry.segment)).toEqual(["pos", "back-office"]);
    expect(workspaceHref("pos")).toBe("#/pos");
    expect(workspaceHref("back-office", ["reports"])).toBe("#/back-office/reports");
  });
});

describe("workspace hash routes", () => {
  it("lands an empty hash on the first available workspace", () => {
    expect(resolveRoute("", BOTH)).toEqual({ kind: "redirect", to: "pos" });
    expect(resolveRoute("#/", BOTH)).toEqual({ kind: "redirect", to: "pos" });
    expect(resolveRoute("", ["back-office"])).toEqual({ kind: "redirect", to: "back-office" });
  });

  it("opens each workspace under its own first segment", () => {
    expect(resolveRoute("#/pos", BOTH)).toEqual({ kind: "workspace", id: "pos", rest: [] });
    expect(resolveRoute("#/back-office", BOTH)).toEqual({
      kind: "workspace",
      id: "back-office",
      rest: [],
    });
  });

  it("passes Back Office deep-link segments through and ignores a hash query", () => {
    expect(resolveRoute("#/back-office/reports/sales?x=1", BOTH)).toEqual({
      kind: "workspace",
      id: "back-office",
      rest: ["reports", "sales"],
    });
  });

  it("treats POS sub-routes as unknown, because its pages are internal state", () => {
    expect(resolveRoute("#/pos/history", BOTH)).toEqual({
      kind: "unknown-route",
      id: "pos",
      path: "/pos/history",
    });
  });

  it("reports an unavailable workspace instead of opening it", () => {
    expect(resolveRoute("#/back-office", ["pos"])).toEqual({
      kind: "unavailable",
      id: "back-office",
    });
    expect(resolveRoute("#/pos", ["back-office"])).toEqual({ kind: "unavailable", id: "pos" });
  });

  it("reports an unknown workspace and an empty availability list", () => {
    expect(resolveRoute("#/cloud", BOTH)).toEqual({ kind: "unknown-workspace", path: "/cloud" });
    expect(resolveRoute("#/pos", [])).toEqual({ kind: "none-available" });
  });
});
