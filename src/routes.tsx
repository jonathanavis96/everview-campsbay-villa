import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// The plan editor is a workshop tool for `src/data/floorPlan.ts`, and it saves
// through a dev-server endpoint that does not exist in a build. The constant
// `import.meta.env.DEV` folds to `false` in production, so this whole branch —
// and the lazy chunk behind it — is dropped from the bundle rather than being
// shipped behind a route nobody should find.
const PlanEditor = import.meta.env.DEV ? lazy(() => import("./pages/PlanEditor")) : null;

/**
 * The route table, kept apart from the router that carries it.
 *
 * The browser mounts these under a `BrowserRouter` (src/App.tsx); the build's
 * prerender step renders the identical tree under a `StaticRouter`
 * (src/entry-prerender.tsx). Hydration compares DOM, so the two must produce
 * the same markup — sharing this file is what guarantees that rather than
 * hoping two copies stay in step.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {/* GitHub Pages serves the physical `<base>/index.html` URL as well as
          the directory, keeping `/index.html` in the browser's pathname — so
          without this the wildcard below claims it and a guest who lands on
          the file path gets the 404 page. It was already the wrong page
          before the build prerendered anything; now it would also be a
          hydration mismatch against the home markup in that very file, with
          the hero flashing up before React threw it away. */}
      <Route path="/index.html" element={<Index />} />
      {PlanEditor && (
        <Route
          path="/plan-editor"
          element={
            <Suspense fallback={null}>
              <PlanEditor />
            </Suspense>
          }
        />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
