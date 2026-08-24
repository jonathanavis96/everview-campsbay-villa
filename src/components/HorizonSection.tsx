// The villa's opening statement, set as paper and type. No icons: a
// typographic spec row reads as more precise than a card of glyphs, and
// costs nothing to load.
//
// Two corrections from Jonathan, 2026-08-24: the mountain behind the house is
// Table Mountain, not Lion's Head; the Twelve Apostles are seen from the
// front patio, away to the far left, along with the whole sweep of Camps Bay
// beach. The power and water sentence has moved to its own section — it is
// not the third thing a guest from overseas needs to hear.
import Reveal from "@/components/Reveal";

export default function HorizonSection() {
  return (
    <section id="horizon" className="pt-6 md:pt-10 pb-14 md:pb-20">
      <div className="container">
        <Reveal className="max-w-2xl">
          <p className="text-lede text-ink">
            A four-bedroom house on a slope above the Atlantic, at the closed
            end of a cul-de-sac in Camps Bay. Three levels with a lift between
            them, and Table Mountain standing behind the house. From the front
            patio the whole curve of Camps Bay beach and the open ocean sit in
            front of you, with the Twelve Apostles running away to the far
            left.
          </p>
        </Reveal>

        <hr className="border-line my-8" />

        <Reveal delayMs={120}>
          <p className="text-data text-stone-text">
            4 bedrooms &middot; 4.5 bathrooms &middot; sleeps 8 &middot; heated
            pool &middot; lift to all levels &middot; parking for 6
          </p>
        </Reveal>
      </div>
    </section>
  );
}
