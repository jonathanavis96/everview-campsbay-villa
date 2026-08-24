// components/Lightbox.tsx
import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type Photo = {
  src: string;
  alt?: string;
  title?: string;
  description?: string; // matches Gallery
  category?: string;    // matches Gallery
};

const SWIPE_THRESHOLD_PX = 40;

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Focus the dialog on open, trap Tab inside it, restore focus on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [onClose, onPrev, onNext]);

  // Prevent background scroll while open; scroll position is untouched
  // (we only toggle overflow, never move the page), so it is restored
  // automatically when this unmounts.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX > 0) onPrev();
    else onNext();
  };

  if (!Array.isArray(photos) || photos.length === 0 || index < 0 || index >= photos.length) {
    return null;
  }

  const photo = photos[index];

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] bg-black/90 text-white flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || "Photo viewer"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close */}
      <button
        ref={closeButtonRef}
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev / Next */}
      {photos.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={onNext}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      {/* Image + matched-width info bar (centered on both axes) */}
      <div
        className="flex-1 px-0 sm:px-6 overflow-hidden flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Wrapper auto-sizes to image width so the bar matches exactly.
            Always object-contain — never crop — so mixed portrait,
            landscape and floor-plan photos all show in full. */}
        <div className="mx-auto inline-flex flex-col items-stretch max-w-full">
          <figure className="flex items-center justify-center">
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt || photo.title || ""}
              className="block max-w-[100vw] max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
              draggable={false}
            />
          </figure>

          {/* Info bar (same width as image) */}
          {(photo.title || photo.description || photo.category) && (
            <div className="w-full mt-4 pb-[max(12px,env(safe-area-inset-bottom))]">
              <div className="w-full bg-paper rounded-sm p-5 text-ink flex items-center justify-between gap-4">
                <div className="min-w-0">
                  {photo.title && (
                    <h3 className="text-display-m truncate">{photo.title}</h3>
                  )}
                  {photo.description && (
                    <p className="text-body text-ink/80 mt-1 break-words">
                      {photo.description}
                    </p>
                  )}
                </div>

                {photo.category && (
                  <span className="shrink-0 text-label text-stone-text whitespace-nowrap">
                    {photo.category}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
