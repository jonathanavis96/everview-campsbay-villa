// design-direction §14.2 — guest reviews. See src/lib/reviews.ts for the
// placeholder authorisation and the guard that makes it safe to ship.
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { REVIEWS } from "@/lib/reviews";

const AUTO_ADVANCE_MS = 11000;

export default function ReviewsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = REVIEWS.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <section id="reviews" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">What guests say</p>

        <div className="border-t border-line pt-8 md:pt-12">
          <div
            className="max-w-3xl mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {/* Grid-stack: every slide occupies the same cell so the
                container height matches the tallest quote and switching
                slides never shifts the layout. */}
            <div className="grid" aria-live="polite">
              {REVIEWS.map((review, i) => {
                const active = i === index;
                return (
                  <figure
                    key={review.id}
                    className={`col-start-1 row-start-1 py-6 md:py-10 transition-opacity duration-700 ease-out ${
                      active ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    aria-hidden={!active}
                  >
                    <blockquote className="text-lede text-ink">
                      "{review.quote}"
                    </blockquote>
                    <figcaption className="text-caption text-stone-text mt-4">
                      {review.attribution}
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            {count > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous review"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-sm border border-line text-stone-text hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  className="flex items-center gap-2"
                  role="tablist"
                  aria-label="Review selection"
                >
                  {REVIEWS.map((review, i) => {
                    const active = i === index;
                    return (
                      <button
                        key={review.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`Go to review ${i + 1} of ${count}`}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          active
                            ? "w-8 bg-ink"
                            : "w-2 bg-line hover:bg-stone"
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next review"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-sm border border-line text-stone-text hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
