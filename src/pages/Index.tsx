import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import EnquiryComposer from "@/components/EnquiryComposer";
import EnquiryBar from "@/components/EnquiryBar";
import Footer from "@/components/Footer";
import { RidgelineDivider } from "@/components/Ridgeline";

// Content sections (the horizon, the house level by level, bedrooms, power
// and water, the area, the plates) land in MIS-449, between the hero and the
// enquiry composer. Each new section claims the next unused range of the
// ridgeline path (0–2400) for its divider, left to right, continuing on from
// 1160 below.
const Index = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Navigation />
      <HeroSection />
      <RidgelineDivider from={360} to={1160} className="container py-2" />
      <EnquiryComposer />
      <RidgelineDivider from={1160} to={2400} className="container py-2" />
      <Footer />
      <EnquiryBar />
    </div>
  );
};

export default Index;
