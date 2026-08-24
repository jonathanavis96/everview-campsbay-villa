// design-direction §14.2 — guest reviews. Invented text, authorised by
// Jonathan in his own words: "We can just invent a few real guest reviews.
// And then I'll swap those in with real ones before the site is published."
// That authorisation is only safe paired with the guard: every entry here
// carries `placeholder: true` until Jonathan replaces it, `npm run
// check:content` fails while any remain (never `npm run build` — the Pages
// preview must keep rendering), and App.tsx adds a `noindex` robots meta tag
// for as long as any placeholder review exists. See MIS-458.
import reviewsData from "@/content/reviews.json";

export type Review = {
  id: string;
  quote: string;
  attribution: string;
  placeholder: boolean;
};

export const REVIEWS: Review[] = reviewsData as Review[];

export const hasPlaceholderReviews: boolean = REVIEWS.some(
  (r) => r.placeholder,
);
