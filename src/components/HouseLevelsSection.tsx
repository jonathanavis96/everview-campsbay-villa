// design-direction §6.3 / §14.6 — "the house, level by level". This is the
// structural fix for the six-identical-photographs bug: each space names the
// folder(s) its photographs come from, and the component reads that folder.
// No keyword-matching against filenames — that mechanism is what produced
// one sofa appearing under six captions.
//
// Levels are named, not numbered (§14.6 withdraws §6.3's Level 3/2/1). The
// Basement (garage) has no photographs at all, so it is a line of text, not
// a spread — a folder with no photographs must not borrow a frame from
// another folder.
import { getResolvedByFolder, resolveManyForSection, type ResolvedPhoto } from "@/utils/photoCatalog";
import { loadAllBasesFrom } from "@/utils/photoLoader";
import { useLightbox } from "@/components/lightbox/LightboxProvider";

type Space = {
  name: string;
  copy: string;
  photos: ResolvedPhoto[];
};

type Level = {
  heading: string;
  spaces: Space[];
};

function spaceFromFolder(folder: string, name: string, copy: string): Space {
  return { name, copy, photos: getResolvedByFolder(folder) };
}

function spaceFromFolders(folders: string[], name: string, copy: string): Space {
  const bases = loadAllBasesFrom(folders);
  return { name, copy, photos: resolveManyForSection(bases, folders[0]) };
}

const LEVELS: Level[] = [
  {
    heading: "Bedroom level",
    spaces: [
      spaceFromFolder(
        "entertainment",
        "Pool room",
        "A billiards table and a media corner, tucked in beside the three upstairs bedrooms — not the swimming pool, which is two levels down."
      ),
    ],
  },
  {
    heading: "Living level",
    spaces: [
      spaceFromFolder(
        "kitchen",
        "The kitchen",
        "Modern appliances, marble countertops, and a large island built for cooking together."
      ),
      spaceFromFolder(
        "dining",
        "Indoor dining",
        "Elegant dining for eight, with stunning views and sophisticated ambiance."
      ),
      spaceFromFolder(
        "living",
        "Open living lounge",
        "Spacious seating with panoramic ocean views, built for gathering and relaxation."
      ),
      spaceFromFolder(
        "bar",
        "Wine cellar & bar",
        "A curated wine collection and a proper bar setup for evenings that run late."
      ),
      spaceFromFolder(
        "patio",
        "The terrace",
        "Al fresco dining and entertaining, with breathtaking sunset views over the Atlantic."
      ),
      spaceFromFolders(
        ["pool", "outdoor"],
        "Pool & sun deck",
        "A heated pool and sun deck looking out over the garden and the ocean beyond."
      ),
    ],
  },
  {
    heading: "Garden level",
    spaces: [
      spaceFromFolder(
        "garden",
        "Roof garden & koi pond",
        "A roof garden over the garage, with a koi pond and Lion's Head on the skyline at dusk."
      ),
    ],
  },
  {
    heading: "Basement",
    spaces: [
      spaceFromFolder("garage", "Garage", "Secure off-street parking beneath the house."),
    ],
  },
];

function SpaceSpread({ space, index }: { space: Space; index: number }) {
  const { open } = useLightbox();
  const [lead, ...rest] = space.photos;
  const reversed = index % 2 === 1;

  if (!lead) {
    // No photographs for this space: a line of text under its level, not a
    // spread. Do not borrow a frame from another folder to fill the gap.
    return (
      <div className="py-8 border-t border-line">
        <h3 className="text-display-m text-ink mb-2">{space.name}</h3>
        <p className="text-body text-ink/80">{space.copy}</p>
      </div>
    );
  }

  const openAt = (i: number) =>
    open(
      space.photos.map((p) => ({
        src: p.src,
        title: p.title,
        description: p.description,
        category: p.category,
      })),
      i
    );

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 py-12 md:py-16 border-t border-line items-center">
      <button
        type="button"
        onClick={() => openAt(0)}
        className={`block w-full text-left ${reversed ? "md:order-2" : ""}`}
        aria-label={`Open ${space.name} photographs`}
      >
        <img
          src={lead.src}
          alt={lead.description || `${space.name} at Everview`}
          loading="lazy"
          className="w-full h-auto rounded-sm"
        />
      </button>

      <div className={reversed ? "md:order-1" : ""}>
        <h3 className="text-display-m text-ink mb-3">{space.name}</h3>
        <p className="text-body text-ink/80 mb-6">{space.copy}</p>

        {rest.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {rest.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => openAt(i + 1)}
                className="w-16 h-16 overflow-hidden rounded-sm border border-line"
                aria-label={`Open photograph ${i + 2} of ${space.name}`}
              >
                <img
                  src={p.src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HouseLevelsSection() {
  return (
    <section id="house" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The house, level by level</p>

        {LEVELS.map((level) => (
          <div key={level.heading} className="mb-4">
            <h2 className="text-display-l text-ink mb-2">{level.heading}</h2>
            {level.spaces.map((space, i) => (
              <SpaceSpread key={space.name} space={space} index={i} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
