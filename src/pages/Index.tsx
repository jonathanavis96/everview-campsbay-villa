import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import VillaOverview from '@/components/VillaOverview';
import BedroomsSection from '@/components/BedroomsSection';
import LivingSection from '@/components/LivingSection';
import FeaturesSection from '@/components/FeaturesSection';
import SustainabilitySection from '@/components/SustainabilitySection';
import GallerySection from '@/components/GallerySection';
import LocationSection from '@/components/LocationSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Villa Overview */}
      <VillaOverview />

      {/* Bedrooms & Layout */}
      <BedroomsSection />

      {/* Living & Entertaining */}
      <LivingSection />

      {/* Features & Comfort */}
      <FeaturesSection />

      {/* Sustainability */}
      <SustainabilitySection />

      {/* Gallery */}
      <GallerySection />

      {/* Location */}
      <LocationSection />

      {/* Contact & Enquiry */}
      <ContactSection />
    </div>
  );
};

export default Index;
