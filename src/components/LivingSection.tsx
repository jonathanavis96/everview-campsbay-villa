import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Sofa, Wine, PlayCircle, ChefHat, Waves } from "lucide-react";

import { loadPhotosFrom } from "@/utils/photoLoader";
import ZoomableImage from "@/components/lightbox/ZoomableImage";
import type { Photo } from "@/components/lightbox/Lightbox";

const LivingSection = () => {
  // Load all living photos; we’ll group them per tile by keyword
  const allLiving: Photo[] = useMemo(
    () => loadPhotosFrom("living", "Living & Entertainment"),
    []
  );

  const pick = (contains: RegExp | string): Photo[] => {
    const res = allLiving.filter((p) =>
      typeof contains === "string"
        ? p.title.toLowerCase().includes(contains.toLowerCase())
        : contains.test(p.title)
    );
    // Fallback: ensure each tile has at least one photo
    return res.length ? res : allLiving.slice(0, 1);
  };

  const livingSpaces = useMemo(
    () => [
      {
        name: "Open Living Lounge",
        description:
          "Spacious seating with panoramic ocean views, perfect for gathering and relaxation.",
        icon: Sofa,
        images: pick(/lounge|living/i),
      },
      {
        name: "Gourmet Kitchen",
        description:
          "Modern appliances, marble countertops, and a large island for culinary adventures.",
        icon: ChefHat,
        images: pick(/kitchen|island/i),
      },
      {
        name: "Indoor Dining",
        description:
          "Elegant dining for 8 with stunning views and sophisticated ambiance.",
        icon: Utensils,
        images: pick(/dining|table/i),
      },
      {
        name: "Outdoor Terrace",
        description:
          "Al fresco dining and entertaining with breathtaking sunset views.",
        icon: Waves,
        images: pick(/terrace|outdoor|patio/i),
      },
      {
        name: "Wine Cellar & Bar",
        description:
          "Curated wine collection and professional bar setup for memorable evenings.",
        icon: Wine,
        images: pick(/bar|cellar|wine/i), // will include multiple if matched
      },
      {
        name: "Entertainment Lounge",
        description:
          "Pool table, media center, and comfortable seating for memorable nights.",
        icon: PlayCircle,
        images: pick(/entertainment|games?|media|pool/i),
      },
    ],
    [allLiving]
  );

  const lifestyleMoments = [
    "Sunset dinners on the terrace",
    "Movie nights in the lounge",
    "Quiet reading corners",
    "Pool table evenings",
    "Morning coffee with ocean views",
    "Gourmet cooking experiences",
  ];

  return (
    <section id="living" className="section-spacing bg-gradient-to-b from-ever-bg to-ever-bg/90">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Living &amp; Entertaining
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto mb-8">
            Every space is designed for comfort, connection, and creating unforgettable memories
            with family and friends.
          </p>

          {/* Lifestyle Moments */}
          <div className="bg-gradient-to-b from-white to-ever-bg border-t border-ever-champ rounded-2xl p-8 mb-16">
            <h3 className="font-heading text-2xl font-bold text-ever-ink mb-6">Moments to Treasure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lifestyleMoments.map((moment, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-ever-champ rounded-full mr-3 flex-shrink-0" />
                  <span className="font-body text-ever-body font-medium">{moment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Living Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {livingSpaces.map((space, index) => (
            <Card key={index} className="card-luxury overflow-hidden group">
              <div className="relative overflow-hidden">
                {/* Zoomable: open this card's own mini-gallery (1+ photos) */}
                <ZoomableImage
                  photos={space.images}
                  index={0}
                  className="h-48 w-full"
                />

                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                {/* Top-left icon badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <space.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-bold text-ever-ink mb-3">{space.name}</h3>
                <p className="font-body text-ever-body leading-relaxed">{space.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dining Experiences Highlight */}
        <div className="mt-16 bg-white border border-ever-line rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-heading text-3xl font-bold text-ever-ink mb-4">Multiple Dining Experiences</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Formal Dining</h4>
              <p className="text-sm text-ever-body">Elegant indoor setting</p>
            </div>
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Waves className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Ocean Terrace</h4>
              <p className="text-sm text-ever-body">Al fresco with views</p>
            </div>
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChefHat className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Kitchen Island</h4>
              <p className="text-sm text-ever-body">Casual breakfast nook</p>
            </div>
            <div className="text-center">
              <div className="border border-ever-champ w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wine className="h-8 w-8 text-ever-champ" />
              </div>
              <h4 className="font-body font-semibold text-ever-ink">Poolside Patio</h4>
              <p className="text-sm text-ever-body">Relaxed Poolside Dining</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivingSection;
