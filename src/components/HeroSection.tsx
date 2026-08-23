import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Bed,
  Bath,
  Users,
  Car,
  Wifi,
  Waves,
} from "lucide-react";
import hero640Avif from "@/assets/hero/hero-640.avif";
import hero960Avif from "@/assets/hero/hero-960.avif";
import hero1280Avif from "@/assets/hero/hero-1280.avif";
import hero1920Avif from "@/assets/hero/hero-1920.avif";
import hero2048Avif from "@/assets/hero/hero-2048.avif";
import hero640Webp from "@/assets/hero/hero-640.webp";
import hero960Webp from "@/assets/hero/hero-960.webp";
import hero1280Webp from "@/assets/hero/hero-1280.webp";
import hero1920Webp from "@/assets/hero/hero-1920.webp";
import hero2048Webp from "@/assets/hero/hero-2048.webp";
import hero640Jpg from "@/assets/hero/hero-640.jpg";
import hero960Jpg from "@/assets/hero/hero-960.jpg";
import hero1280Jpg from "@/assets/hero/hero-1280.jpg";
import hero1920Jpg from "@/assets/hero/hero-1920.jpg";
import hero2048Jpg from "@/assets/hero/hero-2048.jpg";

const heroAvifSrcSet = `${hero640Avif} 640w, ${hero960Avif} 960w, ${hero1280Avif} 1280w, ${hero1920Avif} 1920w, ${hero2048Avif} 2048w`;
const heroWebpSrcSet = `${hero640Webp} 640w, ${hero960Webp} 960w, ${hero1280Webp} 1280w, ${hero1920Webp} 1920w, ${hero2048Webp} 2048w`;
const heroJpgSrcSet = `${hero640Jpg} 640w, ${hero960Jpg} 960w, ${hero1280Jpg} 1280w, ${hero1920Jpg} 1920w, ${hero2048Jpg} 2048w`;

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickInfo = [
    { icon: Bed, label: "4 Bedrooms" },
    { icon: Bath, label: "4.5 Bathrooms" },
    { icon: Users, label: "Sleeps 8" },
    { icon: Waves, label: "Heated Pool" },
    { icon: Wifi, label: "Wi-Fi" },
    { icon: Car, label: "Secure Parking" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <picture>
          <source type="image/avif" srcSet={heroAvifSrcSet} sizes="100vw" />
          <source type="image/webp" srcSet={heroWebpSrcSet} sizes="100vw" />
          <img
            src={hero1920Jpg}
            srcSet={heroJpgSrcSet}
            sizes="100vw"
            width={2048}
            height={1366}
            decoding="async"
            {...{ fetchpriority: "high" }}
            alt="Everview Villa exterior with panoramic ocean views, Camps Bay"
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white container-luxury py-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Headlines (outline + halo for readability) */}
          <h1
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-up"
            style={{
              WebkitTextStrokeWidth: "0.8px",
              WebkitTextStrokeColor: "rgba(0,0,0,0.45)",
              textShadow:
                "0 2px 8px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)",
            }}
          >
            Everview
          </h1>

          <p
            className="font-heading text-xl md:text-2xl lg:text-3xl font-light mb-4 text-white/90 animate-fade-up"
            style={{
              textShadow:
                "0 1px 3px rgba(0,0,0,0.65), 0 0 12px rgba(0,0,0,0.35)",
            }}
          >
            A Private Luxury Villa in Camps Bay
          </p>

          <p
            className="font-body text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90 animate-fade-up"
            style={{
              WebkitTextStrokeWidth: "0.6px",
              WebkitTextStrokeColor: "rgba(0,0,0,0.35)",
              textShadow:
                "0 1px 3px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.30)",
            }}
          >
            Panoramic ocean views, modern design, and timeless comfort.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-up">
            <Button
              onClick={() => scrollToSection("#enquire")}
              className="btn-luxury text-lg px-10 py-4 hover:shadow-2xl hover:shadow-black/20"
            >
              Enquire Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => scrollToSection("#overview")}
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
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <info.icon className="h-8 w-8 text-ever-champ mb-3" />
                  <span className="font-body text-sm font-medium text-ever-ink">
                    {info.label}
                  </span>
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
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
