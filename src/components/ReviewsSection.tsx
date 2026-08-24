// design-direction §14.2 — guest reviews. See src/lib/reviews.ts for the
// placeholder authorisation and the guard that makes it safe to ship.
import { REVIEWS } from "@/lib/reviews";

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">What guests say</p>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 border-t border-line pt-8 md:pt-12">
          {REVIEWS.map((review) => (
            <div key={review.id}>
              <p className="text-body text-ink/80 italic mb-4">
                "{review.quote}"
              </p>
              <p className="text-caption text-stone-text">
                {review.attribution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
