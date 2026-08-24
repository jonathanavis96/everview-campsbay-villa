import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// The plan editor is a workshop tool for `src/data/floorPlan.ts`, and it saves
// through a dev-server endpoint that does not exist in a build. The constant
// `import.meta.env.DEV` folds to `false` in production, so this whole branch —
// and the lazy chunk behind it — is dropped from the bundle rather than being
// shipped behind a route nobody should find.
const PlanEditor = import.meta.env.DEV ? lazy(() => import("./pages/PlanEditor")) : null;

const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route path="/" element={<Index />} />
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
  </BrowserRouter>
);

export default App;
