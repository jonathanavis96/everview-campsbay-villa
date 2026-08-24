// design-direction §6.4 — "the four bedrooms". One spread each, alternating
// side, object-contain and never cropped — this is the section Jonathan
// reported as broken (photos correct, presentation not) and it must not
// crop again. Bed count and en-suite facts carried over unchanged from the
// pre-rebuild BedroomsSection; nothing here is invented.
import { useMemo } from "react";
import { selectBedroomsSet, type ResolvedPhoto } from "@/utils/photoCatalog";
import { useLightbox } from "@/components/lightbox/LightboxProvider";

type Bedroom = {
  name: string;
  spec: string;
  copy: string;
  photos: ResolvedPhoto[];
};

function BedroomSpread({ room, index }: { room: Bedroom; index: number }) {
  const { open } = useLightbox();
  const [lead, ...rest] = room.photos;
  const reversed = index % 2 === 1;

  if (!lead) return null;

  const openAt = (i: number) =>
    open(
      room.photos.map((p) => ({
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
        aria-label={`Open ${room.name} photographs`}
      >
        <img
          src={lead.src}
          alt={lead.description || `${room.name} at Everview, shown at its true size, uncropped`}
          loading="lazy"
          className="w-full h-auto rounded-sm object-contain"
        />
      </button>

      <div className={reversed ? "md:order-1" : ""}>
        <p className="text-label text-stone-text mb-2">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="text-display-m text-ink mb-1">{room.name}</h3>
        <p className="text-label text-stone-text mb-4">{room.spec}</p>
        <p className="text-body text-ink/80 mb-6">{room.copy}</p>

        {rest.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {rest.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => openAt(i + 1)}
                className="w-16 h-16 overflow-hidden rounded-sm border border-line"
                aria-label={`Open photograph ${i + 2} of ${room.name}`}
              >
                <img src={p.src} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BedroomsSection() {
  const picks = useMemo(() => selectBedroomsSet(), []);

  const rooms: Bedroom[] = useMemo(
    () => [
      {
        name: "Master Suite",
        spec: "Queen · en-suite · private balcony",
        copy: "A dressing room and panoramic ocean views, on its own private balcony.",
        photos: picks.master,
      },
      {
        name: "Ocean King",
        spec: "Queen · en-suite · ocean & mountain views",
        copy: "Built-in storage beneath sea vistas on one side and Camps Bay's mountains on the other.",
        photos: picks.oceanking,
      },
      {
        name: "Garden King",
        spec: "Queen · en-suite · private balcony",
        copy: "A tranquil garden and mountain outlook, from its own private balcony.",
        photos: picks.gardenking,
      },
      {
        name: "Ground Floor King",
        spec: "Queen · en-suite · living level",
        copy: "Direct garden access and complete privacy, one flight down from the other three.",
        photos: picks.ground,
      },
    ],
    [picks]
  );

  if (!rooms.some((r) => r.photos.length > 0)) return null;

  return (
    <section id="bedrooms" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The four bedrooms</p>

        {rooms.map((room, i) => (
          <BedroomSpread key={room.name} room={room} index={i} />
        ))}

        <div className="py-8 border-t border-line text-center">
          <p className="text-body text-ink/80">4 queen beds · 4.5 bathrooms · sleeps 8</p>
        </div>
      </div>
    </section>
  );
}
