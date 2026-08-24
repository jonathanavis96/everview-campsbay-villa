import { useEffect, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { RidgelineDivider } from "@/components/Ridgeline";
import { hasPlaceholderReviews } from "@/lib/reviews";

// Everything below the hero fold is lazy-loaded as one chunk. The initial
// bundle was 675 KB (278 KB gzip) of JS the browser had to fetch, parse and
// execute on Slow 4G before React could even mount the hero <img> — that
// bundle-size-gated mount, not image discovery, was the deployed PSI
// mobile LCP/FCP deficit (MIS-459). Splitting the below-fold sections out
// lets the hero paint as soon as the small initial chunk is ready; nothing
// above the fold moves when the lazy chunk resolves, so this carries no CLS
// risk.
const BelowFold = lazy(() => import("@/components/BelowFold"));

// design-direction §14.2's guard: search engines must never index invented
// testimonial text. Added/removed on mount rather than baked into
// index.html because the placeholder state is data-driven (src/content/
// reviews.json), and this is a static client-rendered build with no server
// step to branch the HTML on.
function useNoindexWhilePlaceholderReviews() {
  useEffect(() => {
    if (!hasPlaceholderReviews) return;

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}

const Index = () => {
  useNoindexWhilePlaceholderReviews();

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />
      <HeroSection />
      <RidgelineDivider className="container py-2" />
      <Suspense fallback={null}>
        <BelowFold />
      </Suspense>
    </div>
  );
};

export default Index;
