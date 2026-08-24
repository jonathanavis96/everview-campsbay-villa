// design-direction §6.2 — the villa's opening statement, set as paper and
// type. No icons: a typographic spec row reads as more precise than a card
// of glyphs, and costs nothing to load.
export default function HorizonSection() {
  return (
    <section id="horizon" className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-lede text-ink">
            A four-bedroom house on a slope above the Atlantic, at the closed
            end of a cul-de-sac in Camps Bay. Three levels, a lift between
            them, Lion's Head and the Twelve Apostles behind. Solar and
            battery power, a borehole, and a heated pool that stays warm
            whatever the grid is doing.
          </p>
        </div>

        <hr className="border-line my-8" />

        <p className="text-data text-stone-text">
          4 bedrooms &middot; 4.5 bathrooms &middot; sleeps 8 &middot; heated
          pool &middot; lift to all levels &middot; parking for 6
        </p>
      </div>
    </section>
  );
}
