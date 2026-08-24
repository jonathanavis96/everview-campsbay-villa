// A full-bleed photograph used as a break between sections.
//
// Everywhere else on this page a photograph is a print: paper matte, hairline
// edge, warm shadow (`.photo-frame`). A band is the deliberate exception —
// it runs edge to edge with no frame, so it reads as the page pausing to look
// out of the window rather than as another plate in the index.
//
// Bands are for the view and the light only. A room photograph belongs in its
// folder under src/assets/everview_photos_webp, where the level and bedroom
// sections address it by folder; putting one here would take it out of that
// system and duplicate it on the page.
import Reveal from "@/components/Reveal";

export default function PhotoBand({
  src,
  leadSrc,
  midSrc,
  alt,
  caption,
  width,
  height,
  className = "",
  position = "center",
}: {
  src: string;
  /** The 640px derivative. A band is full-bleed, so a phone would otherwise
   *  pull the whole plate down to paint a 390px-wide strip. */
  leadSrc?: string;
  /** The 960px derivative — the srcset candidate between leadSrc and the
   *  full plate, for a 2x-DPR phone rendering the band wider than 640
   *  device-px can satisfy. */
  midSrc?: string;
  alt: string;
  /** Optional line under the band, in the same register as a plate caption. */
  caption?: string;
  width: number;
  height: number;
  className?: string;
  /** object-position, for bands cropped hard on a tall original. */
  position?: string;
}) {
  return (
    <Reveal className={`w-full ${className}`}>
      <figure className="m-0">
        <img
          src={src}
          srcSet={
            leadSrc
              ? midSrc
                ? `${leadSrc} 640w, ${midSrc} 960w, ${src} ${width}w`
                : `${leadSrc} 640w, ${src} ${width}w`
              : undefined
          }
          sizes={leadSrc ? "100vw" : undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
          style={{ objectPosition: position }}
          className="block w-full object-cover h-[42vw] max-h-[520px] min-h-[220px]"
        />
        {caption && (
          <figcaption className="container">
            <p className="text-body text-ink/70 pt-3">{caption}</p>
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
