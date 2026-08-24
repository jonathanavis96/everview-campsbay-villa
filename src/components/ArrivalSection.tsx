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
          <Reveal className="max-w-3xl">
            <h2 className="text-display-l text-ink mb-4">A well-run house</h2>
            <p className="text-lede text-ink">
              Someone looks after this house every day, and it shows in the
              small things: the beds turned down, the lift working through a
              power cut, the alarm already set up for you when you walk in.
            </p>
          </Reveal>

          {/* The three times used to sit in a narrow rail at the far right,
              which left a third of the row empty between them and the lede and
              wrapped "Arrange with the property manager" onto two lines. They
              run the full width now, three across on one rule, so each value
              has the room to sit on a single line. */}
          <Reveal delayMs={100} as="div" className="mt-8 border-t border-line pt-6 md:mt-10">
            <dl className="grid gap-6 sm:grid-cols-3 md:gap-12">
              {ARRIVAL_TIMES.map((a) => (
                <div key={a.label}>
                  <dt className="text-label text-stone-text mb-1">{a.label}</dt>
                  <dd className="text-body text-ink/80">{a.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal as="div" className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              {/* Headed and hairline-separated, like the house rules opposite:
                  the four facts used to float under nothing while the column
                  beside them carried a heading, which is most of why the row
                  looked unfinished. */}
              <h3 className="text-display-m text-ink mb-4">How the house runs</h3>
              <ul className="grid gap-x-8 sm:grid-cols-2">
                {HOW_IT_RUNS.map((item) => (
                  <li key={item.heading} className="border-t border-line pb-4 pt-3">
                    <h3 className="text-label text-stone-text mb-1">{item.heading}</h3>
                    <p className="text-body text-ink/80">{item.body}</p>
                  </li>
                ))}
              </ul>

              <a
                href={BROCHURE_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-3 border border-ink px-6 py-3 text-label text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Read the welcome brochure
              </a>
            </div>

            <div>
              <h3 className="text-display-m text-ink mb-4">House rules</h3>
              <ul className="text-body text-ink/80 space-y-2 pb-1">
                {HOUSE_RULES.map((rule) => (
                  <li key={rule} className="border-t border-line pt-2">
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
