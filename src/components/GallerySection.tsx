// src/sections/GallerySection.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZoomIn } from "lucide-react";
import Lightbox, { type Photo } from "@/components/lightbox/Lightbox";

import heroImage from "@/assets/hero-villa-exterior.jpg";
import villaExterior from "@/assets/everview_photos_webp/exterior/evening_front_of_house_1.jpg";
import gardens from "@/assets/everview_photos_webp/outdoor/garden-1.webp";
import livingArea from "@/assets/everview_photos_webp/living/living-room-22.webp";
import kitchen from "@/assets/everview_photos_webp/kitchen/kitchen-11.webp";
import formalDining from "@/assets/everview_photos_webp/dining/dining-room-19-formal.webp";

const GallerySection = () => {
  // Six real, distinct photos — no repeats, no placeholders standing in
  // for rooms that were never shot. Villa Exterior and Heated Pool were
  // already the two genuine images here; the rest previously recycled
  // those same two files under six invented captions (MIS-443).
  const galleryImages = useMemo(
    () => [
      {
        id: 1,
        src: villaExterior,
        alt: "Everview Villa exterior at dusk",
        category: "Exterior",
        title: "Villa Exterior",
        description: "The villa's architecture, viewed from the driveway at dusk",
      },
      {
        id: 2,
        src: heroImage,
        alt: "Heated pool at sunset with mountain backdrop",
        category: "Pool & Gardens",
        title: "Heated Pool",
        description: "Evening relaxation with mountain backdrop",
      },
      {
        id: 3,
        src: gardens,
        alt: "Landscaped garden and lawn",
        category: "Pool & Gardens",
        title: "Gardens & Grounds",
        description: "Landscaped lawn and grounds surrounding the villa",
      },
      {
        id: 4,
        src: livingArea,
        alt: "Covered outdoor living and lounge area",
        category: "Living Spaces",
        title: "Living & Entertaining",
        description: "Indoor-outdoor lounge with ocean views",
      },
      {
        id: 5,
        src: kitchen,
        alt: "Villa kitchen",
        category: "Kitchen",
        title: "Kitchen",
        description: "Fully equipped kitchen for self-catering",
      },
      {
        id: 6,
        src: formalDining,
        alt: "Formal dining room",
        category: "Dining",
        title: "Formal Dining",
        description: "Seating for the full party at a formal dining table",
      },
    ],
    []
  );

  const filteredImages = galleryImages;

  // Lightbox state tracks the INDEX within filteredImages
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Close lightbox if the filter changes and index becomes invalid
  useEffect(() => {
    if (selectedIndex === null) return;
    if (filteredImages.length === 0 || selectedIndex > filteredImages.length - 1) {
      setSelectedIndex(null);
    }
  }, [filteredImages, selectedIndex]);

  const openLightboxAt = (i: number) => setSelectedIndex(i);
  const closeLightbox = () => setSelectedIndex(null);

  const onPrev = () => {
    if (selectedIndex === null || filteredImages.length === 0) return;
    setSelectedIndex((i) => (i! - 1 + filteredImages.length) % filteredImages.length);
  };
  const onNext = () => {
    if (selectedIndex === null || filteredImages.length === 0) return;
    setSelectedIndex((i) => (i! + 1) % filteredImages.length);
  };

  // Adapt filtered images to Lightbox's Photo[]
  const photos: Photo[] = useMemo(
    () =>
      filteredImages.map((img) => ({
        src: img.src,
        alt: img.alt,
        title: img.title,
        description: img.description,
        category: img.category,
      })),
    [filteredImages]
  );

  return (
    <section id="gallery" className="section-spacing bg-gradient-to-b from-ever-bg to-ever-bg/90">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Villa Gallery
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto mb-2">
            A curated look at Everview — the villa&apos;s architecture, grounds, and living spaces.
          </p>
          <p className="font-body text-sm text-ever-body/70 max-w-3xl mx-auto mb-8">
            This is the complete photo set for now — see the brochure below, or enquire for more.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredImages.map((image, i) => (
            <Card
              key={image.id}
              className="card-luxury overflow-hidden group cursor-pointer"
              onClick={() => openLightboxAt(i)}
            >
              <div className="relative overflow-hidden">
                {/* Native aspect ratio, no forced crop — each photo shows
                    in full, matching the Bedrooms & Layout treatment. */}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-ever-ink border border-ever-line hover:bg-white">
                    {image.category}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-heading text-lg font-bold text-ever-ink mb-1">
                  {image.title}
                </h3>
                <p className="font-body text-sm text-ever-body">{image.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Virtual Tour CTA */}
        <div className="bg-gradient-to-b from-white to-ever-bg border-t border-ever-champ rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-heading text-3xl font-bold text-ever-ink mb-4">See More of Everview</h3>
          <p className="font-body text-lg text-ever-body mb-6 max-w-2xl mx-auto">
            Ready to experience the villa in person? Contact us to arrange a viewing or request
            additional images and floor plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.querySelector("#enquire");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-luxury"
            >
              Request Virtual Tour
            </button>
            <a
              href={`${import.meta.env.BASE_URL}brochures/Everview-Welcome-Brochure-v3.pdf`}
              download="Everview-Welcome-Brochure-v3.pdf"
              className="btn-luxury-outline"
            >
              Download Brochure
            </a>
          </div>
        </div>
      </div>

      {/* New Lightbox (replaces old inline modal) */}
      {selectedIndex !== null && photos.length > 0 && (
        <Lightbox
          photos={photos}
          index={selectedIndex}
          onClose={closeLightbox}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </section>
  );
};

export default GallerySection;