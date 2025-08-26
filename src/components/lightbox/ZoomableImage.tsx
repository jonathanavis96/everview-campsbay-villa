import React from "react";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import type { Photo } from "@/components/lightbox/Lightbox";

type Props = {
  photos: Photo[];       // gallery this image belongs to
  index: number;         // index of THIS image within `photos`
  className?: string;    // sizing for the wrapper (e.g., "h-48" or "aspect-[4/3]")
  imgClassName?: string; // extra styling for <img>
  altOverride?: string;  // optional alt override
};

export default function ZoomableImage({
  photos,
  index,
  className = "",
  imgClassName = "",
  altOverride,
}: Props) {
  const { open } = useLightbox();
  const img = photos[index];
  if (!img) return null;

  return (
    <button
      type="button"
      onClick={() => open(photos, index)}
      // wrapper owns the size; make it a block-level, positioned box
      className={`group relative block w-full overflow-hidden rounded-2xl focus:outline-none ${className}`}
      aria-label={`Open ${img.title || img.alt || "image"} in fullscreen`}
    >
      {/* image fills the wrapper exactly */}
      <img
        src={img.src}
        alt={altOverride || img.alt || img.title || ""}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in ${imgClassName}`}
        loading="lazy"
      />
      {/* optional hover tint */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
    </button>
  );
}
