import React from "react";
import { createRoot } from "react-dom/client";

import { WorkspaceHost } from "./host/WorkspaceHost.js";
import "./styles.css";

const root = document.getElementById("root");
if (root === null) throw new Error("POS root element is missing");

createRoot(root).render(
  <React.StrictMode>
    <WorkspaceHost />
  </React.StrictMode>,
);
