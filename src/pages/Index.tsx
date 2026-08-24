import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HorizonSection from "@/components/HorizonSection";
import HouseLevelsSection from "@/components/HouseLevelsSection";
import BedroomsSection from "@/components/BedroomsSection";
import PowerWaterSection from "@/components/PowerWaterSection";
import CampsBaySection from "@/components/CampsBaySection";
import EnquiryComposer from "@/components/EnquiryComposer";
import EnquiryBar from "@/components/EnquiryBar";
import Footer from "@/components/Footer";
import { RidgelineDivider } from "@/components/Ridgeline";

// The 0–360 range belongs to the wordmark (Ridgeline.tsx), so section
// dividers start at 360. Remaining content sections (the plates) land in a
// follow-up MIS-449 PR, claiming the next unused sub-range between
// CampsBaySection and the enquiry composer, continuing on from 1140 below.
const Index = () => {
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
      <EnquiryComposer />
      <RidgelineDivider from={1160} to={2400} className="container py-2" />
      <Footer />
      <EnquiryBar />
    </div>
  );
};

export default Index;
