import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.js";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/shell.css";

const root = document.getElementById("root");
if (root === null) throw new Error("Back Office root element is missing");

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
