// design-direction §6.10 — "Arrival and the house rules".
//
// The section carries what a guest needs *before* they arrive: the times, the
// short version of how the house runs, and the rules. Everything operational
// — the lift's load-shedding behaviour, the AV walkthrough, the two music
// systems, the emergency numbers — lives in the welcome brochure, which is
// one button away and printed in the house. The page used to try to be both
// and read as a wall of paragraphs (Jonathan, 2026-08-24).
//
// The WiFi password and the alarm codes appear in neither: they are on the
// printed card in the house. A page or a brochure gets forwarded and
// screenshotted; a card on the kitchen counter does not.
import Reveal from "@/components/Reveal";

const ARRIVAL_TIMES = [
  { label: "Check-in", value: "2:00 PM – 7:00 PM" },
  { label: "Check-out", value: "By 10:00 AM" },
  { label: "After 7:00 PM", value: "Arrange with the property manager" },
];

const HOW_IT_RUNS = [
  {
    heading: "Housekeeping",
    body: "Daily, with laundry provided and available on request.",
  },
  {
    heading: "The lift",
    body: "Between all levels, up to six people, and it keeps running through load-shedding on days the battery bank has had sun.",
  },
  {
    heading: "WiFi",
    body: "Fibre on every level. The network and password are on the printed card in the house — never in a document that can be forwarded.",
  },
  {
    heading: "Alarm",
    body: "Monitored 24/7 by ADT Security with armed response. The codes are on that same card, and the property manager sets you up on arrival.",
  },
];

const HOUSE_RULES = [
  "No pets.",
  "No smoking anywhere on the property.",
  "No parties or events — small gatherings by prior arrangement with the property manager.",
  "No unauthorised guests outside the booking group without prior arrangement.",
  "No commercial filming or photography.",
  "Damages reported to the property manager immediately.",
];

const BROCHURE_HREF = `${import.meta.env.BASE_URL}brochures/welcome-brochure.html`;

export default function ArrivalSection() {
  return (
    <section id="arrival" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">Arrival</p>

        <div className="border-t border-line pt-8 md:pt-12">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
            <Reveal className="max-w-2xl">
              <h2 className="text-display-l text-ink mb-4">A well-run house</h2>
              <p className="text-lede text-ink">
                Someone looks after this house every day, and it shows in the
                small things: the beds turned down, the lift working through a
                power cut, the alarm already set up for you when you walk in.
              </p>
            </Reveal>

            <Reveal delayMs={100} className="md:w-64 md:border-l md:border-line md:pl-8">
              <dl className="space-y-3">
                {ARRIVAL_TIMES.map((a) => (
                  <div key={a.label}>
                    <dt className="text-label text-stone-text mb-1">{a.label}</dt>
                    <dd className="text-body text-ink/80">{a.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal as="div" className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {HOW_IT_RUNS.map((item) => (
                  <li key={item.heading}>
                    <h3 className="text-label text-stone-text mb-1">{item.heading}</h3>
                    <p className="text-body text-ink/80">{item.body}</p>
                  </li>
                ))}
              </ul>

              <a
                href={BROCHURE_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 border border-ink px-6 py-3 text-label text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Read the welcome brochure
              </a>
              <p className="text-caption text-stone-text mt-3">
                The lift, the AV system, the music, the emergency numbers — all
                of it, and a printed copy waits in the house.
              </p>
            </div>

            <div>
              <h3 className="text-display-m text-ink mb-4">House rules</h3>
              <ul className="text-body text-ink/80 space-y-2">
                {HOUSE_RULES.map((rule) => (
                  <li
                    key={rule}
                    className="border-t border-line pt-2 first:border-t-0 first:pt-0"
                  >
                    {rule}
                  </li>
                ))}
              </ul>
              <p className="text-body text-ink/80 mt-4">
                Late check-out is subject to availability and additional cost,
                arranged in advance.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
