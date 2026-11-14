import React from "react";
import { createRoot } from "react-dom/client";
import { isTauri } from "@tauri-apps/api/core";

import { PosApp } from "./App.js";
import { storeApi } from "./live/api.js";
import { LivePosApp } from "./live/LivePosApp.js";
import "./styles.css";

const root = document.getElementById("root");
if (root === null) throw new Error("POS root element is missing");

// In the native Tauri shell the POS keeps its certificate-authenticated status transport and the
// preview shell. In a browser, the live POS is used when the demonstration Store API answers on
// the same origin; otherwise the preview shell is shown.
async function liveApiAvailable(): Promise<boolean> {
  if (isTauri()) return false;
  try {
    return (await storeApi.health()).status === "UP";
  } catch {
    return false;
  }
}

void liveApiAvailable().then((live) => {
  createRoot(root).render(
    <React.StrictMode>{live ? <LivePosApp /> : <PosApp />}</React.StrictMode>,
  );
});
