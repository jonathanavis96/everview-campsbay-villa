// The house, level by level.
//
// Every space names the folder its photographs come from, and the component
// reads that folder. No keyword-matching against filenames — that mechanism
// is what once produced one sofa appearing under six captions. Moving a file
// between folders under src/assets/everview_photos_webp is now the only way
// to change what appears where.
//
// Levels are named, not numbered. A space with no photographs is a line of
// text, not a spread — a folder with no photographs must never borrow a
// frame from another folder.
import { getResolvedInFolder, type ResolvedPhoto } from "@/utils/photoCatalog";
import PhotoCarousel from "@/components/PhotoCarousel";
import Reveal from "@/components/Reveal";

type Space = {
  name: string;
  copy: string;
  folder: string;
  photos: ResolvedPhoto[];
};

type Level = {
  heading: string;
  intro: string;
  /** Photographs sitting loose in the level folder, not yet sorted into a space. */
  folder: string;
  spaces: Space[];
};

function space(folder: string, name: string, copy: string): Space {
  return { name, copy, folder, photos: getResolvedInFolder(folder) };
}

const LEVELS: Level[] = [
  {
    heading: "Living level",
    intro:
      "The floor the house is built around: kitchen, dining, lounge and the terrace, all opening onto the same view.",
    folder: "living-level",
    spaces: [
      space(
        "living-level/kitchen",
        "The kitchen and sunbeds",
        "Modern appliances, marble countertops and a large island built for cooking together — with the loungers and reading nook just off it, for the part of the day nobody wants to be indoors."
      ),
      space(
        "living-level/living-and-dining",
        "The living room and dining",
        "A fireplace, deep seating and the Atlantic filling the far wall, with the formal table for eight under the chandelier at the other end of the same room."
      ),
      space(
        "living-level/bar-and-cellar",
        "The bar, wine cellar and TV room",
        "A proper bar off the living room, stocked and ready, with the wine cellar and the television room alongside it for evenings that run late."
      ),
      space(
        "living-level/terrace",
        "The terrace",
        "The covered front patio, where dinner happens: the whole sweep of Camps Bay beach and the Atlantic in front of you, the Twelve Apostles running away to the far left, and the outdoor lounge and dining table under the same roof."
      ),
    ],
  },
  {
    heading: "Bedroom level",
    intro:
      "Three bedrooms upstairs, with the pool room and the study sharing the landing.",
    folder: "bedroom-level",
    spaces: [
      space(
        "bedroom-level/pool-room-and-study",
        "Pool room and study",
        "A billiards table and a media corner beside the three upstairs bedrooms — not the swimming pool, which is two levels down — and a quiet desk on the landing for the mornings someone has to work."
      ),
    ],
  },
  {
    heading: "Garden level",
    intro: "Down at garden height: the pool, the lawn, and the evening light.",
    folder: "garden-level",
    spaces: [
      space(
        "garden-level/pool-and-garden",
        "The pool and garden",
        "Heated year-round and set into the lawn below the house, with the mountain on one side and the ocean on the other, the gin deck above it and Lion's Head on the skyline as the light goes."
      ),
    ],
  },
  {
    heading: "Entrance",
    intro: "",
    folder: "entrance",
    spaces: [
      space(
        "entrance/entrance",
        "Street level",
        "The house is entered at street level, off a driveway with room for six cars. There is further parking in the cul-de-sac itself, which carries no through traffic."
      ),
    ],
  },
];

function SpaceSpread({ space, index }: { space: Space; index: number }) {
  const reversed = index % 2 === 1;

  if (space.photos.length === 0) {
    // No photographs for this space: a line of text under its level, not a
    // spread. Do not borrow a frame from another folder to fill the gap.
    return (
      <Reveal className="py-8 border-t border-line">
        <h3 className="text-display-m text-ink mb-2">{space.name}</h3>
        <p className="text-body text-ink/80">{space.copy}</p>
      </Reveal>
    );
  }

  return (
    <Reveal className="grid md:grid-cols-2 gap-8 md:gap-14 py-12 md:py-16 border-t border-line items-center">
      <PhotoCarousel
        photos={space.photos}
        label={space.name}
        className={reversed ? "md:order-2" : ""}
      />

      <div className={reversed ? "md:order-1" : ""}>
        <h3 className="text-display-m text-ink mb-3">{space.name}</h3>
        <p className="text-body text-ink/80">{space.copy}</p>
      </div>
    </Reveal>
  );
}

/** Photographs sitting loose in a level folder, waiting to be sorted. */
function LevelExtras({ level }: { level: Level }) {
  const loose = getResolvedInFolder(level.folder);
  if (loose.length === 0) return null;

  return (
    <Reveal className="grid md:grid-cols-2 gap-8 md:gap-14 py-12 md:py-16 border-t border-line items-center">
      <PhotoCarousel photos={loose} label={level.heading} />
      <div>
        <h3 className="text-display-m text-ink mb-3">
          More of the {level.heading.toLowerCase()}
        </h3>
        <p className="text-body text-ink/80">
          Further frames from this level of the house.
        </p>
      </div>
    </Reveal>
  );
}

export default function HouseLevelsSection() {
  return (
    <section id="house" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The house, level by level</p>

        {LEVELS.map((level) => (
          <div key={level.heading} className="mb-4">
            <Reveal>
              <h2 className="text-display-l text-ink mb-2">{level.heading}</h2>
              {level.intro && (
                <p className="text-body text-ink/80 mb-2">{level.intro}</p>
              )}
            </Reveal>
            {level.spaces.map((s, i) => (
              <SpaceSpread key={s.name} space={s} index={i} />
            ))}
            <LevelExtras level={level} />
          </div>
        ))}
      </div>
    </section>
  );
}
