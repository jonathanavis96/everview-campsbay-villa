import { useEffect, useState, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { hasPlaceholderReviews } from "@/lib/reviews";
import {
  isBelowFoldRevealed,
  onBelowFoldReveal,
  revealBelowFold,
  scrollToSection,
} from "@/lib/belowFold";

// Everything below the hero fold is lazy-loaded as one chunk. The initial
// bundle was 675 KB (278 KB gzip) of JS the browser had to fetch, parse and
// execute on Slow 4G before React could even mount the hero <img> — that
// bundle-size-gated mount, not image discovery, was the deployed PSI
// mobile LCP/FCP deficit (MIS-459). Splitting the below-fold sections out
// lets the hero paint as soon as the small initial chunk is ready; nothing
// above the fold moves when the lazy chunk resolves, so this carries no CLS
// risk.
const BelowFold = lazy(() => import("@/components/BelowFold"));

/**
 * Holds the below-fold chunk back until the hero has actually painted.
 *
 * Splitting the chunk out was only half the job: it still began downloading
 * the moment React mounted, and with it came the sections' photographs — the
 * panorama alone is 310 KB. Measured on the deployed site, 2026-08-24: the
 * 181 KB chunk landed at 725 ms and about 600 KB of images followed it before
 * the hero was on screen, giving an LCP element render delay of 2.17 s and a
 * mobile performance score of 79 against a ≥90 gate.
 *
 * So the chunk waits for the load event and then an idle callback — and no
 * longer, because anything scroll-gated risks a crawler never seeing the page
 * at all. A scroll, a pointer or a key press jumps the queue, so a visitor who
 * moves before it fires never waits for it.
 */
function useAfterHero() {
  const [ready, setReady] = useState(isBelowFoldRevealed);

  useEffect(() => {
    // The reveal itself lives in src/lib/belowFold.ts, because a click on
    // "Enquire" has to be able to pull the sections forward and then wait for
    // its anchor — see `scrollToSection`. This effect only decides when the
    // page reveals them of its own accord.
    const unsubscribe = onBelowFoldReveal(() => setReady(true));

    const idle = () => {
      const ric = window.requestIdleCallback;
      if (ric) ric(() => revealBelowFold(), { timeout: 1200 });
      else window.setTimeout(revealBelowFold, 200);
    };

    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    const events = ["scroll", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    for (const type of events) {
      window.addEventListener(type, revealBelowFold, { once: true, passive: true });
    }

    // A guest who arrives on /#enquire (or any other below-fold anchor) gets
    // no native scroll, because the target is not in the document yet. Ask
    // for it explicitly; `scrollToSection` reveals the sections and waits.
    const hash = window.location.hash.slice(1);
    if (hash) scrollToSection(hash, "auto");

    return () => {
      unsubscribe();
      window.removeEventListener("load", idle);
      for (const type of events) window.removeEventListener(type, revealBelowFold);
    };
  }, []);

  return ready;
}

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
  const belowFoldReady = useAfterHero();

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />
      {/* No divider under the hero: the photograph runs straight into the
          opening paragraph, and the ridgeline is already in the wordmark
          above it. */}
      <HeroSection />
      <Suspense fallback={null}>{belowFoldReady && <BelowFold />}</Suspense>
    </div>
  );
};

export default Index;
