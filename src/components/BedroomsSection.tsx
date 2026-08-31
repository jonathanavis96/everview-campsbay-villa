// The four bedrooms. One spread each, alternating side, never cropped.
//
// Each room names its folder. There is no filename keyword-matching left in
// this component — a photograph appears under a room because it sits in that
// room's folder, and nowhere else.
//
// A room's balcony and its en-suite live in that room's folder too, so they
// crossfade behind the bedroom itself rather than each claiming a spread of
// its own. The shared "bathrooms" carousel that used to close this section is
// gone with them: a guest thinks about the bathroom attached to their room,
// not about the house's bathrooms as a set (2026-08-31).
import { getResolvedInFolder, type ResolvedPhoto } from "@/utils/photoCatalog";
import PhotoCarousel from "@/components/PhotoCarousel";
import Reveal from "@/components/Reveal";

type Bedroom = {
  name: string;
  spec: string;
  copy: string;
  photos: ResolvedPhoto[];
};

const ROOMS: Bedroom[] = [
  {
    name: "Master Suite",
    spec: "Queen · en-suite · private balcony",
    copy: "A dressing room and panoramic ocean views, on its own private balcony.",
    photos: getResolvedInFolder("bedroom-level/master-suite"),
  },
  {
    name: "Ocean King",
    spec: "Queen · en-suite · ocean & mountain views",
    copy: "Built-in storage beneath sea vistas on one side and Camps Bay's mountains on the other.",
    photos: getResolvedInFolder("bedroom-level/ocean-king"),
  },
  {
    name: "Garden King",
    spec: "Queen · en-suite · private balcony",
    copy: "A tranquil garden and mountain outlook, from its own private balcony.",
    photos: getResolvedInFolder("bedroom-level/garden-king"),
  },
  {
    name: "Ground Floor King",
    spec: "Queen · en-suite · living level",
    copy: "Direct garden access and complete privacy, one flight down from the other three.",
    photos: getResolvedInFolder("living-level/ground-king"),
  },
];

function BedroomSpread({ room, index }: { room: Bedroom; index: number }) {
  const reversed = index % 2 === 1;
  if (room.photos.length === 0) return null;

  return (
    <Reveal className="grid md:grid-cols-2 gap-8 md:gap-14 py-12 md:py-16 border-t border-line items-center">
      <PhotoCarousel
        photos={room.photos}
        label={room.name}
        className={reversed ? "md:order-2" : ""}
      />

      <div className={reversed ? "md:order-1" : ""}>
        <p className="text-label text-stone-text mb-2">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="text-display-m text-ink mb-1">{room.name}</h3>
        <p className="text-label text-stone-text mb-4">{room.spec}</p>
        <p className="text-body text-ink/80">{room.copy}</p>
      </div>
    </Reveal>
  );
}

export default function BedroomsSection() {
  if (!ROOMS.some((r) => r.photos.length > 0)) return null;

  return (
    <section id="bedrooms" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The four bedrooms</p>

        {ROOMS.map((room, i) => (
          <BedroomSpread key={room.name} room={room} index={i} />
        ))}


        <Reveal className="py-8 border-t border-line text-center">
          <p className="text-body text-ink/80 mx-auto">
            4 queen beds · 4 en-suites &middot; 2 guest toilets · sleeps 8
          </p>
        </Reveal>
      </div>
    </section>
  );
}
