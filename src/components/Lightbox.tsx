// components/Lightbox.tsx
import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type Photo = {
  src: string;
  alt?: string;
  title?: string;
  description?: string; // matches Gallery
  category?: string;    // matches Gallery
};

export default function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!Array.isArray(photos) || photos.length === 0 || index < 0 || index >= photos.length) {
    return null;
  }

  const photo = photos[index];

  // Detect orientation for adaptive fit
  const [isLandscape, setIsLandscape] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth > window.innerHeight : false
  );
  useEffect(() => {
    const handler = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);

  // Prevent background scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 text-white flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev / Next */}
      <button
        onClick={onPrev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        onClick={onNext}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md"
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      {/* Image + matched-width info bar (centered on both axes) */}
      <div className="flex-1 px-0 sm:px-6 overflow-hidden flex items-center justify-center">
        {/* Wrapper auto-sizes to image width so the bar matches exactly */}
        <div className="mx-auto inline-flex flex-col items-stretch">
          <figure className="flex items-center justify-center">
            <img
              src={photo.src}
              alt={photo.alt || ""}
              className={[
                "block rounded-2xl shadow-2xl",
                "max-w-[100vw] max-h-[90vh]", // a bit taller so mobile feels full
                isLandscape ? "h-[90vh] w-auto object-cover" : "w-full h-auto object-contain",
              ].join(" ")}
            />
          </figure>

          {/* Info bar (same width as image) */}
          <div className="w-full mt-4 pb-[max(12px,env(safe-area-inset-bottom))]">
            <div className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-5 text-ever-ink flex items-center justify-between gap-4">
              <div className="min-w-0">
                {photo.title && (
                  <h3 className="text-2xl font-semibold truncate">{photo.title}</h3>
                )}
                {photo.description && (
                  <p className="text-ever-ink/80 mt-1 break-words">
                    {photo.description}
                  </p>
                )}
              </div>

              {/* Pill on the right with Everview colors */}
              {photo.category && (
                <span className="shrink-0 px-4 py-2 rounded-full bg-ever-blue text-white text-sm">
                  {photo.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
