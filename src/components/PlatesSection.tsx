// design-direction §6.7 — "the plates". A catalogue plate index of every
// photograph in the repository, grouped by room, numbered, captioned. This
// is where the folders no other section reads in full (bathrooms, exterior,
// the study, the view, and two bedroom frames no manifest could place) get
// published — the issue's own requirement is that no photograph in the
// repository is left unused.
import { useMemo } from "react";
import { loadAndResolveAll } from "@/utils/photoCatalog";
import { useLightbox } from "@/components/lightbox/LightboxProvider";

const GROUP_LABELS: Record<string, string> = {
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  kitchen: "The kitchen",
  dining: "Dining",
  living: "Living",
  bar: "Wine cellar & bar",
  patio: "Terraces & patios",
  pool: "Pool",
  outdoor: "Garden & outdoors",
  garden: "Roof garden",
  entertainment: "Pool room & games",
  exterior: "Exterior",
  other: "Study",
  view: "The view",
};

function labelFor(folder: string) {
  return (
    GROUP_LABELS[folder] ??
    folder.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
  );
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
      const key = p.subfolder;
      if (!byFolder.has(key)) byFolder.set(key, []);
      byFolder.get(key)!.push(p);
    }
    return Array.from(byFolder.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [all]);

  const lightboxPhotos = useMemo(
    () => all.map((p) => ({ src: p.src, title: p.title, description: p.description, category: p.category })),
    [all]
  );

  return (
    <section id="plates" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The plates</p>

        {groups.map(([folder, photos]) => (
          <div key={folder} className="border-t border-line pt-6 pb-6 md:pt-8 md:pb-8">
            <h3 className="text-display-m text-ink mb-4">{labelFor(folder)}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {photos.map((p) => {
                const globalIndex = indexBySrc.get(p.src) ?? 0;
                return (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => open(lightboxPhotos, globalIndex)}
                    className="block w-full text-left"
                    aria-label={`Open photograph ${globalIndex + 1}: ${p.title ?? labelFor(folder)}`}
                  >
                    <p className="text-label text-stone-text mb-1" aria-hidden="true">
                      {String(globalIndex + 1).padStart(2, "0")}
                    </p>
                    <img
                      src={p.src}
                      alt={p.description || p.title || labelFor(folder)}
                      loading={globalIndex < 3 ? undefined : "lazy"}
                      className="w-full h-auto rounded-sm"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-body text-ink/80 pt-6 border-t border-line">
          This is the complete photo set for now — enquire for more.
        </p>
      </div>
    </section>
  );
}
