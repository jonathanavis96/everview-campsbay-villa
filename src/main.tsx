import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LightboxProvider>
      <App />
    </LightboxProvider>
  </React.StrictMode>
);
