import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Bed, Bath, Users, Car, Wifi, Waves } from 'lucide-react';
import heroImage from '@/assets/hero-villa-exterior.jpg';

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickInfo = [
    { icon: Bed, label: '4 Bedrooms' },
    { icon: Bath, label: '4.5 Bathrooms' },
    { icon: Users, label: 'Sleeps 8' },
    { icon: Waves, label: 'Heated Pool' },
    { icon: Wifi, label: 'Wi-Fi' },
    { icon: Car, label: 'Secure Parking' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Everview Villa Exterior with Ocean Views"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white container-luxury py-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Headlines */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-up">
            Everview
          </h1>
          <p className="font-heading text-xl md:text-2xl lg:text-3xl font-light mb-4 text-white/90 animate-fade-up">
            A Private Luxury Villa in Camps Bay
          </p>
          <p className="font-body text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90 animate-fade-up">
            Panoramic ocean views, modern design, and timeless comfort.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-up">
            <Button
              onClick={() => scrollToSection('#enquire')}
              className="btn-luxury text-lg px-10 py-4 hover:shadow-2xl hover:shadow-black/20"
            >
              Enquire Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => scrollToSection('#overview')}
              className="border border-ever-champ text-white bg-transparent hover:bg-ever-champ hover:text-ever-ink transition-all duration-300 rounded-full text-lg px-10 py-4"
            >
              <Play className="mr-2 h-5 w-5" />
              View Villa
            </Button>
          </div>

          {/* Quick Info Strip */}
          <div className="glass-card p-6 md:p-8 animate-scale-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {quickInfo.map((info, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <info.icon className="h-8 w-8 text-ever-champ mb-3" />
                  <span className="font-body text-sm font-medium text-ever-ink">{info.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;