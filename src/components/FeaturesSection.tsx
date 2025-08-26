import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Waves,
  Sofa,
  ArrowUpDown,
  Wifi,
  Thermometer,
  Shield,
  Tv,
  Car,
  Wind,
  Sun,
} from "lucide-react";

const FeaturesSection = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Waves,
      title: "Heated Pool & Garden",
      summary: "Private heated swimming pool with mountain views",
      details:
        "Enjoy year-round swimming in the heated pool surrounded by landscaped gardens. Perfect for morning laps or evening relaxation with stunning Lion's Head as your backdrop.",
      category: "Outdoor",
    },
    {
      icon: Sofa,
      title: "3 Lounges, 4 Dining Areas",
      summary: "Multiple spaces for relaxation and entertaining",
      details:
        "From intimate conversation nooks to grand entertaining spaces, every area is thoughtfully designed for comfort and connection. Each lounge offers different views and atmospheres.",
      category: "Indoor",
    },
    {
      icon: ArrowUpDown,
      title: "Lift & Stair Access",
      summary: "Easy access between all three levels",
      details:
        "Private elevator ensures comfortable access to all floors, making the villa suitable for guests of all ages and mobility levels. Traditional staircase also available.",
      category: "Accessibility",
    },
    {
      icon: Wifi,
      title: "High-Speed Wi-Fi",
      summary: "Premium internet throughout the villa",
      details:
        "Ultra-fast fiber internet with seamless coverage across all areas. Perfect for remote work, streaming, and staying connected with family and friends.",
      category: "Technology",
    },
    {
      icon: Tv,
      title: "DSTV & Streaming",
      summary: "Premium entertainment systems",
      details:
        "Full DSTV package with international channels, plus access to all major streaming platforms. Smart TVs in every lounge and bedroom for personalized entertainment.",
      category: "Technology",
    },
    {
      icon: Thermometer,
      title: "Climate Control",
      summary: "Air conditioning & underfloor heating",
      details:
        "Enjoy luxurious underfloor heating in every room. The main suite and an additional ocean-view bedroom also feature air conditioning for cooling comfort in summer.",
      category: "Comfort",
    },
    {
      icon: Shield,
      title: "Premium Security",
      summary: "Monitored alarm & private location",
      details:
        "24/7 monitored security system, in-villa safe, and exclusive end-of-cul-de-sac location ensuring complete privacy and peace of mind.",
      category: "Security",
    },
    {
      icon: Car,
      title: "Secure Parking",
      summary: "Ample private parking",
      details:
        "Driveway parking for up to 6 vehicles, with additional guest parking for 4 more cars on the quiet cul-de-sac.",

      category: "Parking",
    },
  ];

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  const categories = [
    "All",
    "Outdoor",
    "Indoor",
    "Technology",
    "Comfort",
    "Security",
    "Parking",
    "Accessibility",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFeatures =
    selectedCategory === "All"
      ? features
      : features.filter((feature) => feature.category === selectedCategory);

  return (
    <section id="features" className="section-spacing">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Features & Comfort
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto mb-8">
            Every detail has been carefully considered to ensure your stay
            exceeds expectations. Discover the premium amenities that make
            Everview extraordinary.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-ever-champ/25 border border-ever-champ text-ever-ink"
                    : "bg-white border border-ever-line text-ever-ink hover:bg-ever-champ/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`card-luxury cursor-pointer transition-all duration-300 ${
                expandedFeature === index ? "ring-2 ring-luxury-gold" : ""
              }`}
              onClick={() => toggleFeature(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-ever-champ/20 p-3 rounded-xl mr-4">
                    <feature.icon className="h-6 w-6 text-ever-champ stroke-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-ever-ink mb-1">
                      {feature.title}
                    </h3>
                    <span className="text-xs bg-ever-line text-ever-body px-2 py-1 rounded-full">
                      {feature.category}
                    </span>
                  </div>
                </div>

                <p className="font-body text-ever-body text-sm mb-3">
                  {feature.summary}
                </p>

                {expandedFeature === index && (
                  <div className="border-t border-ever-line pt-4 animate-fade-up">
                    <p className="font-body text-sm text-ever-ink leading-relaxed">
                      {feature.details}
                    </p>
                  </div>
                )}

                <div className="text-xs text-ever-blue font-medium mt-3">
                  {expandedFeature === index
                    ? "Tap to collapse"
                    : "Tap to expand"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comfort Guarantee */}
        <div className="mt-16 bg-gradient-to-b from-white to-ever-bg/50 border-t border-ever-champ rounded-2xl p-8 md:p-12 text-center">
          <Sun className="h-12 w-12 text-ever-blue mx-auto mb-6" />
          <h3 className="font-heading text-3xl font-bold text-ever-ink mb-4">
            Comfort Guaranteed
          </h3>
          <p className="font-body text-lg text-ever-body max-w-2xl mx-auto">
            From the moment you arrive to the time you reluctantly leave, every
            aspect of your stay has been designed to exceed expectations.
            Experience true luxury living.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
