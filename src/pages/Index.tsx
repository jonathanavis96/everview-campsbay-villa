import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HorizonSection from "@/components/HorizonSection";
import HouseLevelsSection from "@/components/HouseLevelsSection";
import EnquiryComposer from "@/components/EnquiryComposer";
import EnquiryBar from "@/components/EnquiryBar";
import Footer from "@/components/Footer";
import { RidgelineDivider } from "@/components/Ridgeline";

// The 0–360 range belongs to the wordmark (Ridgeline.tsx), so section
// dividers start at 360. Remaining content sections (bedrooms, power and
// water, the area, the plates) land in follow-up MIS-449 PRs, each claiming
// the next unused sub-range between HouseLevelsSection and the enquiry
// composer, left to right, continuing on from 760 below.
const Index = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Navigation />
      <HeroSection />
      <RidgelineDivider from={360} to={560} className="container py-2" />
      <HorizonSection />
      <RidgelineDivider from={560} to={760} className="container py-2" />
      <HouseLevelsSection />
      <RidgelineDivider from={760} to={1160} className="container py-2" />
      <EnquiryComposer />
      <RidgelineDivider from={1160} to={2400} className="container py-2" />
      <Footer />
      <EnquiryBar />
    </div>
  );
};

export default Index;
