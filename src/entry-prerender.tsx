import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppRoutes from "./routes";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";

/**
 * The build's prerender entry. Nothing imports this at runtime: `npm run
 * build` builds it for Node as a second, SSR-target pass and
 * scripts/prerender.mjs calls `render()` once, dropping the result into
 * `dist/index.html` in place of the empty `<div id="root">`.
 *
 * Why: measured on PageSpeed Insights mobile, 2026-09-02, the deployed site's
 * LCP was 3.4s of which 2,310ms was *element render delay* against a TTFB of
 * 0ms, and the LCP element was the nav wordmark — a text span. Nothing painted
 * until the JS bundle had been fetched, parsed and run. No further image or
 * animation work can touch that; putting the above-fold markup in the HTML
 * can.
 *
 * The component tree here must match src/main.tsx exactly, because React
 * hydrates over what this writes. It does so by construction: both render
 * `AppRoutes` (src/routes.tsx) inside `LightboxProvider`, and the only
 * difference is the router — `StaticRouter` cannot read `window`, which is the
 * whole reason it exists.
 *
 * Everything above the fold is already SSR-safe and renders identically on
 * both sides: `Navigation` starts unscrolled, `RidgelineMark` starts unswept,
 * `HeroSection` is static, and `Index` holds `BelowFold` back until after the
 * load event, so the server's "nothing below the hero yet" is also the
 * browser's first frame. No stylesheet is imported here — the client build
 * already emits and links it.
 */
export function render(url: string) {
  return renderToString(
    <React.StrictMode>
      <LightboxProvider>
        <StaticRouter basename={import.meta.env.BASE_URL} location={url}>
          <AppRoutes />
        </StaticRouter>
      </LightboxProvider>
    </React.StrictMode>,
  );
}
