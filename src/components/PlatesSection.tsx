// The plates: a catalogue index of every photograph in the repository,
// grouped by the folder it sits in, numbered, and openable full screen. The
// requirement is that no photograph in the repository is left unpublished.
//
// Nothing here shows a filename-derived title. "Covered Patio Dining Sea" is
// a perfectly good filename and an embarrassing caption, so plates are
// identified by their group and their number, and the filename never reaches
// the page.
import { useMemo } from "react";
import { loadAndResolveAll } from "@/utils/photoCatalog";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import Reveal from "@/components/Reveal";

const GROUP_LABELS: Record<string, string> = {
  "bedroom-level": "Bedroom level",
  "bedroom-level/master-suite": "Master suite",
  "bedroom-level/ocean-king": "Ocean King",
  "bedroom-level/garden-king": "Garden King",
  "bedroom-level/bathrooms": "Bathrooms",
  "bedroom-level/pool-room": "Pool room",
  "bedroom-level/study": "The study",
  "living-level": "Living level",
  "living-level/kitchen": "The kitchen",
  "living-level/indoor-dining": "Indoor dining",
  "living-level/formal-living-room": "The formal living room",
  "living-level/outside-dining": "Outside dining",
  "living-level/bar": "The bar",
  "living-level/outside-lounge": "The outside lounge",
  "living-level/sunbeds": "The sunbeds",
  "living-level/wine-cellar": "Wine cellar & TV room",
  "living-level/terrace": "The terrace",
  "living-level/ground-king": "Ground floor king",
  "garden-level": "Garden level",
  "garden-level/pool": "The pool",
  "garden-level/garden": "The garden",
  exterior: "The house from outside",
  views: "The view",
};

function labelFor(folderPath: string) {
  const known = GROUP_LABELS[folderPath];
  if (known) return known;
  const leaf = folderPath.split("/").pop() ?? folderPath;
  return leaf.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function PlatesSection() {
  const { open } = useLightbox();

  const all = useMemo(() => loadAndResolveAll("gallery"), []);

  const indexBySrc = useMemo(() => {
    const m = new Map<string, number>();
    all.forEach((p, i) => m.set(p.src, i));
    return m;
  }, [all]);

  const groups = useMemo(() => {
    const byFolder = new Map<string, typeof all>();
    for (const p of all) {
      const key = p.folderPath ?? p.subfolder;
      if (!byFolder.has(key)) byFolder.set(key, []);
      byFolder.get(key)!.push(p);
    }
    return Array.from(byFolder.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [all]);

  const lightboxPhotos = useMemo(
    () =>
      all.map((p, i) => ({
        src: p.src,
        alt:
          p.description ||
          `${labelFor(p.folderPath ?? p.subfolder)} at Everview, plate ${i + 1}`,
      })),
    [all]
  );

  return (
    <section id="plates" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The plates</p>

        {groups.map(([folderPath, photos]) => (
          <Reveal
            key={folderPath}
            className="border-t border-line pt-6 pb-6 md:pt-8 md:pb-8"
          >
            <h3 className="text-display-m text-ink mb-4">{labelFor(folderPath)}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {photos.map((p) => {
                const globalIndex = indexBySrc.get(p.src) ?? 0;
                const plate = String(globalIndex + 1).padStart(2, "0");
                return (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => open(lightboxPhotos, globalIndex)}
                    className="photo-frame block w-full text-left cursor-zoom-in"
                    aria-label={`Open plate ${plate}, ${labelFor(folderPath)}`}
                  >
                    <img
                      src={p.leadSrc || p.src}
                      srcSet={
                        p.leadSrc && p.width
                          ? `${p.leadSrc} 640w, ${p.src} ${p.width}w`
                          : undefined
                      }
                      sizes="(min-width: 768px) 33vw, 50vw"
                      alt={
                        p.description ||
                        `${labelFor(folderPath)} at Everview, plate ${plate}`
                      }
                      loading="lazy"
                      width={p.width}
                      height={p.height}
                      className="rounded-[2px]"
                    />
                    <span
                      className="mt-2 block text-caption text-stone-text"
                      aria-hidden="true"
                    >
                      {plate}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        ))}

        <p className="text-body text-ink/80 pt-6 border-t border-line">
          This is the complete photo set for now — enquire for more.
        </p>
      </div>
    </section>
  );
}
