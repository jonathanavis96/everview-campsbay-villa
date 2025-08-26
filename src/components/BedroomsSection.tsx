// src/components/BedroomsSection.tsx
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Mountain, Waves, Shirt, Eye } from "lucide-react";

import ZoomableImage from "@/components/lightbox/ZoomableImage";

import { selectBedroomsSet, toLightbox } from "@/utils/photoCatalog";

const BedroomsSection = () => {
  // Deterministic arrays per room: master, oceanking, gardenking, ground
  const picks = useMemo(() => selectBedroomsSet(), []);

  // Convert resolved photos -> lightbox arrays (no casts; structural typing)
  const masterPhotos    = useMemo(() => toLightbox(picks.master), [picks.master]);
  const oceanKingPhotos = useMemo(() => toLightbox(picks.oceanking), [picks.oceanking]);
  const gardenKingPhotos= useMemo(() => toLightbox(picks.gardenking), [picks.gardenking]);
  const groundPhotos    = useMemo(() => toLightbox(picks.ground), [picks.ground]);

  // Build four cards (layout unchanged)
  const bedrooms = useMemo(
    () => [
      {
        name: "Master Suite",
        features: ["Private Balcony", "Ocean Views", "Dressing Room", "En-suite Bathroom"],
        icon: Eye,
        highlight: "Panoramic ocean views",
        images: masterPhotos,
      },
      {
        name: "Ocean King (Upstairs)",
        features: ["Mountain Views", "Ocean Views", "En-suite Bathroom", "Built-in Storage"],
        icon: Waves,
        highlight: "Stunning sea vistas",
        images: oceanKingPhotos,
      },
      {
        name: "Garden King (Upstairs)",
        features: ["Private Balcony", "Mountain Views", "En-suite Bathroom", "Garden Outlook"],
        icon: Mountain,
        highlight: "Tranquil mountain setting",
        images: gardenKingPhotos,
      },
      {
        name: "Ground Floor King",
        features: ["Mountain Views", "Garden Access", "En-suite Bathroom", "Complete Privacy"],
        icon: Mountain,
        highlight: "Private garden level",
        images: groundPhotos,
      },
    ],
    [masterPhotos, oceanKingPhotos, gardenKingPhotos, groundPhotos]
  );

  const anyImages =
    (masterPhotos?.length ?? 0) +
    (oceanKingPhotos?.length ?? 0) +
    (gardenKingPhotos?.length ?? 0) +
    (groundPhotos?.length ?? 0);

  if (!anyImages) return null;

  return (
    <section id="bedrooms" className="section-spacing">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Bedrooms &amp; Layout
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto">
            Four beautifully appointed bedrooms, each with their own character and stunning views.
            Every room offers en-suite facilities and thoughtful design details.
          </p>
        </div>

        {/* Bedrooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {bedrooms.map((bedroom, index) => {
            if (!bedroom.images || bedroom.images.length === 0) return null;

            return (
              <Card key={index} className="card-luxury overflow-hidden group">
                <div className="relative overflow-hidden">
                  {/* Zoomable thumbnail opens this card's mini gallery */}
                  <ZoomableImage photos={bedroom.images} index={0} className="h-64 w-full" />
                  {/* Top-left badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="border border-ever-champ bg-ever-champ/20 text-ever-ink">
                      <bedroom.icon className="w-4 h-4 mr-2" />
                      {bedroom.highlight}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-heading text-2xl font-bold text-ever-ink mb-4">
                    {bedroom.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {bedroom.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-ever-body">
                        <div className="w-2 h-2 bg-ever-champ rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sleeping Arrangements Summary */}
        <div className="bg-white border border-ever-line rounded-2xl p-8 text-center">
          <h3 className="font-heading text-2xl font-bold text-ever-ink mb-4">
            Sleeping Arrangements
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center">
              <Bed className="h-6 w-6 text-ever-blue mr-3" />
              <span className="font-body text-lg text-ever-body">
                <strong className="font-semibold">4</strong> Queen Beds
              </span>
            </div>
            <div className="flex items-center">
              <Shirt className="h-6 w-6 text-ever-blue mr-3" />
              <span className="font-body text-lg text-ever-body">
                <strong className="font-semibold">4.5</strong> Bathrooms
              </span>
            </div>
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-ever-blue mr-3" />
              <span className="font-body text-lg text-ever-body">
                Comfortably sleeps <strong className="font-semibold">8 guests</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BedroomsSection;
