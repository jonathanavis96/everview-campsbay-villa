import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";

const container = document.getElementById("root")!;

const tree = (
  <React.StrictMode>
    <LightboxProvider>
      <App />
    </LightboxProvider>
  </React.StrictMode>
);

// The build prerenders the above-fold markup into `dist/index.html` (see
// src/entry-prerender.tsx), so in production there is already a painted page
// here and React's job is to adopt it, not to replace it. `vite dev` serves
// the empty shell, so both paths have to work.
if (container.firstChild) hydrateRoot(container, tree);
else createRoot(container).render(tree);
