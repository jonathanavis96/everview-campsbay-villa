// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// If you used the folder move:
//   src/components/lightbox/LightboxProvider.tsx
// and you have the @ alias set up:
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";

// If you DON'T have the @ alias configured, use this instead:
// import { LightboxProvider } from "./components/lightbox/LightboxProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LightboxProvider>
      <App />
    </LightboxProvider>
  </React.StrictMode>
);
