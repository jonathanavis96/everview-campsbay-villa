import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { ResolvedPhoto } from "@/utils/photoCatalog";
import { useLightbox } from "@/components/lightbox/LightboxProvider";

/**
 * Every photograph belonging to one space, in one framed carousel.
 *
 * This replaces the old "one big lead photo + a row of 64px thumbnails
 * wedged under the body copy" layout, which Jonathan reported as both too
 * small and oddly placed. Each space now gets a single print-sized frame;
 * the other frames of that space crossfade behind the same mat.
 *
 * Every photograph in the repository is 3:2, so the fixed aspect box crops
 * nothing — the frame height never jumps between slides either.
 *
 * Clicking the photograph opens the full-screen viewer at the same index.
 */
export default function PhotoCarousel({
  photos,
  label,
  className = "",
}: {
  photos: ResolvedPhoto[];
  /** Human name of the space, used for alt text and aria labels. */
  label: string;
  className?: string;
}) {
  const { open } = useLightbox();
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const count = photos.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count]
  );

  // Reset if the caller swaps the photo set out from under us.
  useEffect(() => setIndex(0), [photos]);

  const openViewer = () =>
    open(
      photos.map((p, i) => ({
        src: p.src,
        alt: p.description || `${label} at Everview, photograph ${i + 1}`,
      })),
      index
    );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 45) return;
    go(dx > 0 ? -1 : 1);
  };

  if (count === 0) return null;

  return (
    <div className={`group ${className}`} ref={containerRef}>
      <div
        className="photo-frame relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={openViewer}
          className="relative block w-full aspect-[3/2] overflow-hidden rounded-[2px] bg-line/40 cursor-zoom-in"
          aria-label={`View ${label} photographs full screen`}
        >
          {photos.map((p, i) => (
            <img
              key={p.src}
              src={i === 0 ? p.leadSrc || p.src : p.src}
              srcSet={
                p.leadSrc && p.width
                  ? p.midSrc
                    ? `${p.leadSrc} 640w, ${p.midSrc} 960w, ${p.src} ${p.width}w`
                    : `${p.leadSrc} 640w, ${p.src} ${p.width}w`
                  : undefined
              }
              sizes="(min-width: 768px) 50vw, calc(100vw - 48px)"
              alt={
                i === index
                  ? p.description || `${label} at Everview`
                  : ""
              }
              aria-hidden={i !== index}
              loading={i === 0 ? "lazy" : "lazy"}
              width={p.width}
              height={p.height}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}

          <span
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-sm bg-ink/70 px-2.5 py-1.5 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="text-caption text-paper">Full screen</span>
          </span>
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={`Previous ${label} photograph`}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-paper/85 p-2 text-ink shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-paper"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={`Next ${label} photograph`}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-paper/85 p-2 text-ink shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-paper"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={`${label} photographs`}>
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photograph ${i + 1} of ${count}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-ink" : "w-1.5 bg-line hover:bg-stone"
                }`}
              />
            ))}
          </div>
          <span className="text-caption text-stone-text ml-auto">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
