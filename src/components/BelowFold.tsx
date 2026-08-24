import type { ComponentType } from "react";
import HorizonSection from "@/components/HorizonSection";
import HouseLevelsSection from "@/components/HouseLevelsSection";
import BedroomsSection from "@/components/BedroomsSection";
import PowerWaterSection from "@/components/PowerWaterSection";
import CampsBaySection from "@/components/CampsBaySection";
import ArrivalSection from "@/components/ArrivalSection";
import PlatesSection from "@/components/PlatesSection";
import ReviewsSection from "@/components/ReviewsSection";
import RateSection from "@/components/RateSection";
import EnquiryComposer from "@/components/EnquiryComposer";
import EnquiryBar from "@/components/EnquiryBar";
import Footer from "@/components/Footer";
import { RidgelineDivider } from "@/components/Ridgeline";

/**
 * Everything the page renders below the hero fold, lazy-loaded as a single
 * chunk from src/pages/Index.tsx. See the comment there for why.
 *
 * THE PAGE ORDER LIVES HERE. To move a section, move one line in the array
 * below — the skyline dividers between sections are spaced automatically, so
 * nothing else needs touching. The reasoning behind this particular order,
 * and a drag-and-drop way to try others, is in docs/section-order.html.
 *
 * The order runs: what the house is, then the house itself, then where it
 * is, then the reassurances an overseas guest needs, then proof, then price,
 * then the practical detail, then the enquiry. The full plate index is an
 * appendix at the end — as the third section on the page it buried
 * everything after it.
 */
const SECTIONS: Array<[string, ComponentType]> = [
  ["horizon", HorizonSection],
  ["house", HouseLevelsSection],
  ["bedrooms", BedroomsSection],
  ["camps-bay", CampsBaySection],
  ["power-water", PowerWaterSection],
  ["reviews", ReviewsSection],
  ["rates", RateSection],
  ["arrival", ArrivalSection],
  ["enquire", EnquiryComposer],
  ["plates", PlatesSection],
];

// The 0-360 stretch of the skyline belongs to the wordmark, and 360-560 to
// the divider under the hero (src/pages/Index.tsx). Everything from 560 to
// the end of the path is shared out evenly between the sections below, so
// scrolling the page walks the mountain from Devil's Peak down to the sea.
const RIDGE_START = 560;
const RIDGE_END = 2400;
const RIDGE_STEP = (RIDGE_END - RIDGE_START) / SECTIONS.length;

export default function BelowFold() {
  return (
    <>
      {SECTIONS.map(([key, Section], i) => (
        <div key={key}>
          <Section />
          <RidgelineDivider
            from={RIDGE_START + i * RIDGE_STEP}
            to={RIDGE_START + (i + 1) * RIDGE_STEP}
            className="container py-2"
          />
        </div>
      ))}
      <Footer />
      <EnquiryBar />
    </>
  );
}
