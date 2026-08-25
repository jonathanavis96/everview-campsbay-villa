import type { ComponentType } from "react";
import HorizonSection from "@/components/HorizonSection";
import HouseLevelsSection from "@/components/HouseLevelsSection";
import BedroomsSection from "@/components/BedroomsSection";
import FloorPlanSection from "@/components/FloorPlanSection";
import { BeachBand, SunsetBand } from "@/components/Bands";
import PowerWaterSection from "@/components/PowerWaterSection";
import CampsBaySection from "@/components/CampsBaySection";
import ArrivalSection from "@/components/ArrivalSection";
import PlatesSection from "@/components/PlatesSection";
import ReviewsSection from "@/components/ReviewsSection";
import RateSection from "@/components/RateSection";
import EnquiryComposer from "@/components/EnquiryComposer";
import Footer from "@/components/Footer";
import { RidgelineDivider } from "@/components/Ridgeline";
import AtlanticBand from "@/components/Atlantic";

/**
 * Everything the page renders below the hero fold, lazy-loaded as a single
 * chunk from src/pages/Index.tsx. See the comment there for why.
 *
 * THE PAGE ORDER LIVES HERE. To move a section, move one line in the array
 * below — the skyline dividers between sections are spaced automatically, so
 * nothing else needs touching. The reasoning behind this particular order,
 * and a drag-and-drop way to try others, is in docs/section-order.html.
 *
 * Each section names what follows it. Most take the skyline; the plan hands
 * over to the Atlantic, because the water is south of the terrace and the
 * plan no longer says so itself. Three take a plain rule instead: under the
 * sunset photograph, because a drawn mountain under a photograph of a
 * mountain says it twice, and after the filtration and rates sections, where
 * Jonathan found a mountain range between two blocks of practical text too
 * loud for what it was separating.
 *
 * The order runs: what the house is, then the house itself, then where it
 * is, then the reassurances an overseas guest needs, then proof, then price,
 * then the practical detail, then the enquiry. The full plate index is an
 * appendix at the end — as the third section on the page it buried
 * everything after it.
 */
type Divider = "ridge" | "rule" | "atlantic";

const SECTIONS: Array<[string, ComponentType, Divider?]> = [
  ["horizon", HorizonSection],
  ["beach-band", BeachBand, "rule"],
  ["house", HouseLevelsSection],
  ["bedrooms", BedroomsSection],
  ["plans", FloorPlanSection, "atlantic"],
  ["camps-bay", CampsBaySection],
  ["power-water", PowerWaterSection, "rule"],
  ["reviews", ReviewsSection],
  ["sunset-band", SunsetBand, "rule"],
  ["rates", RateSection, "rule"],
  ["arrival", ArrivalSection],
  ["enquire", EnquiryComposer],
  ["plates", PlatesSection],
];

function SectionDivider({ kind }: { kind: Divider }) {
  if (kind === "atlantic") return <AtlanticBand className="container py-4 md:py-6" />;
  if (kind === "rule") return <div className="container py-2"><hr className="border-t border-line" /></div>;
  return <RidgelineDivider className="container py-2" />;
}

export default function BelowFold() {
  return (
    <>
      {SECTIONS.map(([key, Section, divider]) => (
        <div key={key}>
          <Section />
          <SectionDivider kind={divider ?? "ridge"} />
        </div>
      ))}
      <Footer />
    </>
  );
}
