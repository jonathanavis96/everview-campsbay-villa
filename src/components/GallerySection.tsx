import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-villa-exterior.jpg";
import masterBedroom from "@/assets/master-bedroom-ocean.jpg";
import livingRoom from "@/assets/living-room-luxury.jpg";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Gallery images with categories
  const galleryImages = [
    {
      id: 1,
      src: heroImage,
      alt: "Villa Exterior with Ocean Views",
      category: "Exterior",
      title: "Villa Exterior",
      description: "Stunning architecture with panoramic ocean views",
    },
    {
      id: 2,
      src: masterBedroom,
      alt: "Master Bedroom with Ocean Views",
      category: "Bedrooms",
      title: "Master Suite",
      description: "Wake up to breathtaking ocean vistas",
    },
    {
      id: 3,
      src: livingRoom,
      alt: "Luxury Living Room",
      category: "Living Spaces",
      title: "Main Living Area",
      description: "Elegant comfort with natural light",
    },
    {
      id: 4,
      src: heroImage,
      alt: "Pool Area at Sunset",
      category: "Pool & Gardens",
      title: "Heated Pool",
      description: "Evening relaxation with mountain backdrop",
    },
    {
      id: 5,
      src: livingRoom,
      alt: "Gourmet Kitchen",
      category: "Kitchen",
      title: "Modern Kitchen",
      description: "Professional appliances and marble finishes",
    },
    {
      id: 6,
      src: masterBedroom,
      alt: "Dining Area",
      category: "Dining",
      title: "Elegant Dining",
      description: "Perfect for memorable meals together",
    },
    {
      id: 7,
      src: heroImage,
      alt: "Outdoor Terrace",
      category: "Outdoor",
      title: "Ocean Terrace",
      description: "Al fresco dining with stunning sunsets",
    },
    {
      id: 8,
      src: livingRoom,
      alt: "Night View",
      category: "Night Views",
      title: "Evening Ambiance",
      description: "Villa illuminated against the night sky",
    },
  ];

  const categories = [
    "All",
    ...new Set(galleryImages.map((img) => img.category)),
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (selectedImage === null) return;

    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage
    );
    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex =
        currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(filteredImages[newIndex].id);
  };

  const selectedImageData = selectedImage
    ? galleryImages.find((img) => img.id === selectedImage)
    : null;

  return (
    <section
      id="gallery"
      className="section-spacing bg-gradient-to-b from-ever-bg to-ever-bg/90"
    >
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ever-ink mb-6">
            Villa Gallery
          </h2>
          <p className="font-body text-xl text-ever-body max-w-3xl mx-auto mb-8">
            Explore every corner of Everview through our curated collection of
            images, showcasing the villa's stunning architecture, luxurious
            interiors, and breathtaking views.
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className="card-luxury overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(image.id)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
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
                <p className="font-body text-sm text-ever-body">
                  {image.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Virtual Tour Call-to-Action */}
        <div className="bg-gradient-to-b from-white to-ever-bg border-t border-ever-champ rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-heading text-3xl font-bold text-ever-ink mb-4">
            See More of Everview
          </h3>
          <p className="font-body text-lg text-ever-body mb-6 max-w-2xl mx-auto">
            Ready to experience the villa in person? Contact us to arrange a
            viewing or request additional images and floor plans.
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

      {/* Lightbox Modal */}
      {selectedImage && selectedImageData && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl w-full max-h-full flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="flex-grow flex items-center justify-center">
              <img
                src={selectedImageData.src}
                alt={selectedImageData.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>

            {/* Image Info BELOW */}
            <div className="mt-4 bg-white/40 backdrop-blur-md text-ever-ink p-4 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-heading text-xl font-bold mb-1">
                    {selectedImageData.title}
                  </h3>
                  <p className="font-body text-sm text-ever-body">
                    {selectedImageData.description}
                  </p>
                </div>
                <Badge className="bg-ever-blue text-white">
                  {selectedImageData.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
