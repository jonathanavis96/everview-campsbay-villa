import { lazy, Suspense } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import VillaOverview from '@/components/VillaOverview';

// Below-the-fold sections are code-split out of the initial bundle so the
// critical path (nav + hero + overview) has less JS to parse/execute before
// first paint — on a client-rendered page, nothing paints until React
// hydrates, so initial bundle size directly gates LCP under CPU throttling.
const BedroomsSection = lazy(() => import('@/components/BedroomsSection'));
const LivingSection = lazy(() => import('@/components/LivingSection'));
const FeaturesSection = lazy(() => import('@/components/FeaturesSection'));
const SustainabilitySection = lazy(() => import('@/components/SustainabilitySection'));
const GallerySection = lazy(() => import('@/components/GallerySection'));
const LocationSection = lazy(() => import('@/components/LocationSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Villa Overview */}
      <VillaOverview />

      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
};

export default Index;
