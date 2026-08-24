import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type Photo = {
  src: string;
  alt?: string;
  /** Retained for callers that still pass it; the viewer never renders it. */
  title?: string;
  description?: string;
  category?: string;
};

const SWIPE_THRESHOLD_PX = 45;

/**
 * Full-screen photo viewer, rebuilt on the pattern used for the maas-wedding
 * site. Three deliberate differences from the version this replaces:
 *
 *  1. No caption card. The old viewer printed a title derived from the
 *     filename — "Covered Patio Dining Sea" — under every photograph. Those
 *     names are fine as internal filenames and wrong in front of a guest, so
 *     the viewer shows a plate counter and nothing else. The description
 *     still does its job as the image's alt text.
 *  2. The close button and the arrows are anchored to the viewport, not to
 *     the image box, so they do not move as the photograph changes shape.
 *  3. The photograph is never upscaled past its own pixel width, so a
 *     smaller frame stays sharp instead of going soft to fill the screen.
 */
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
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [entered, setEntered] = useState(false);

  // Fade/scale the overlay in on the frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

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

  // Never draw a photograph larger than it actually is.
  const capToNaturalWidth = () => {
    const el = imgRef.current;
    if (!el || !el.naturalWidth) return;
    el.style.maxWidth = `min(100%, ${el.naturalWidth}px)`;
  };

  if (!Array.isArray(photos) || photos.length === 0 || index < 0 || index >= photos.length) {
    return null;
  }

  const photo = photos[index];
  const controlClass =
    "absolute z-10 inline-flex items-center justify-center rounded-full border border-paper/25 bg-paper/10 text-paper backdrop-blur-sm transition-colors duration-200 hover:bg-paper/20 focus-visible:bg-paper/20";

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex flex-col transition-opacity duration-300 ease-out"
      style={{
        backgroundColor: "rgba(11, 17, 20, 0.95)",
        opacity: entered ? 1 : 0,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeButtonRef}
        aria-label="Close"
        onClick={onClose}
        className={`${controlClass} right-4 top-4 h-11 w-11`}
      >
        <X className="h-5 w-5" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="Previous photograph"
            className={`${controlClass} left-3 top-1/2 -translate-y-1/2 h-12 w-12 md:left-6`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={onNext}
            aria-label="Next photograph"
            className={`${controlClass} right-3 top-1/2 -translate-y-1/2 h-12 w-12 md:right-6`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        className="flex-1 flex items-center justify-center px-4 md:px-20"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imgRef}
          key={photo.src}
          src={photo.src}
          onLoad={capToNaturalWidth}
          alt={photo.alt || photo.description || ""}
          className="block h-auto w-auto object-contain select-none transition-[transform,opacity] duration-300 ease-out"
          style={{
            maxHeight: "calc(100dvh - 9rem)",
            transform: entered ? "scale(1)" : "scale(0.97)",
          }}
          draggable={false}
        />
      </div>

      {photos.length > 1 && (
        <p className="pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 text-center text-caption text-paper/70">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </p>
      )}
    </div>
  );
}
