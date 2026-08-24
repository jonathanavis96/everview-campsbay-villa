import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
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
import { hasPlaceholderReviews } from "@/lib/reviews";

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

// The 0–360 range belongs to the wordmark (Ridgeline.tsx), so section
// dividers start at 360.
const Index = () => {
  useNoindexWhilePlaceholderReviews();

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />
      <HeroSection />
      <RidgelineDivider from={360} to={560} className="container py-2" />
      <HorizonSection />
      <RidgelineDivider from={560} to={760} className="container py-2" />
      <HouseLevelsSection />
      <RidgelineDivider from={760} to={960} className="container py-2" />
      <BedroomsSection />
      <RidgelineDivider from={960} to={1060} className="container py-2" />
      <PowerWaterSection />
      <RidgelineDivider from={1060} to={1140} className="container py-2" />
      <CampsBaySection />
      <RidgelineDivider from={1140} to={1160} className="container py-2" />
      <ArrivalSection />
      <RidgelineDivider from={1160} to={1180} className="container py-2" />
      <PlatesSection />
      <RidgelineDivider from={1180} to={1200} className="container py-2" />
      <ReviewsSection />
      <RidgelineDivider from={1200} to={1220} className="container py-2" />
      <RateSection />
      <RidgelineDivider from={1220} to={1240} className="container py-2" />
      <EnquiryComposer />
      <RidgelineDivider from={1240} to={2400} className="container py-2" />
      <Footer />
      <EnquiryBar />
    </div>
  );
};

export default Index;
