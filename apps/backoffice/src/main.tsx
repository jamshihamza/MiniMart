import React from "react";
import { createRoot } from "react-dom/client";

import { BackOfficeApp } from "./App.js";
import "./styles.css";

const root = document.getElementById("root");
if (root === null) throw new Error("Back Office root element is missing");

createRoot(root).render(
  <React.StrictMode>
    <BackOfficeApp />
  </React.StrictMode>,
);
