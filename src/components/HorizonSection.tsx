// The villa's opening statement, set as paper and type. No icons: a
// typographic spec row reads as more precise than a card of glyphs, and
// costs nothing to load.
//
// Two corrections from Jonathan, 2026-08-24: the mountain behind the house is
// Table Mountain, not Lion's Head; the Twelve Apostles are seen from the
// front patio, away to the far left, along with the whole sweep of Camps Bay
// beach. The power and water sentence has moved to its own section — it is
// not the third thing a guest from overseas needs to hear.
//
// The paragraph used to sit alone against a wide empty right-hand half. The
// spec, which was a single wrapping line under a rule, now stands in that
// space as a column of facts: the section balances, and the numbers are
// scannable instead of being read as prose.
//
// The facts are set on ink, not on the stone tint they started in: nine short
// mono lines in a 3.2:1 grey is exactly the contrast failure Lighthouse
// flags, and Jonathan could not comfortably read them either.
//
// 2026-08-24, from Jonathan's own mockup: the single narrow rail was still
// too cramped and too small to read. The facts now stand in two columns in a
// wider rail at 16px — "about half to two-thirds" the size of the lede beside
// them — with the heading raised to match. Five and four, so the taller
// column is the left one and the block reads down before it reads across.
import Reveal from "@/components/Reveal";

/** The counts, then what the house has. One column each. */
const SPEC: [string[], string[]] = [
  ["4 bedrooms", "4 en-suites", "2 guest toilets", "Sleeps 8"],
  ["Heated pool", "Lift to all levels", "Parking for 6", "Solar powered", "Safe and secure"],
];

export default function HorizonSection() {
  return (
    <section id="horizon" className="pt-12 md:pt-20 pb-14 md:pb-20">
      <div className="container">
        <div className="grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
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

          <Reveal delayMs={120} className="md:w-[28rem] md:border-l md:border-line md:pl-10">
            <p className="text-label text-stone-text mb-5 text-[0.9375rem] tracking-[0.16em]">
              The house
            </p>
            <div className="grid grid-cols-2 gap-x-8">
              {SPEC.map((column) => (
                <ul key={column[0]} className="text-data-l space-y-1 text-ink">
                  {column.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
