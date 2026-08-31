// design-direction §6.10 — "Arrival".
//
// The section carries the three times, and then hands over. Housekeeping, the
// lift, the WiFi, the alarm and the six house rules were all on this page and
// all already in the welcome brochure; carrying them twice made the section
// the longest block of body text on the site for information a guest reads
// once, at most. They are in the brochure now and nowhere else, and the
// button that opens it is sized to be found (2026-08-31).
//
// The WiFi password and the alarm codes appear in neither: they are on the
// printed card in the house. A page or a brochure gets forwarded and
// screenshotted; a card on the kitchen counter does not.
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const ARRIVAL_TIMES = [
  { label: "Check-in", value: "2:00 PM – 7:00 PM" },
  { label: "Check-out", value: "By 10:00 AM" },
  { label: "After 7:00 PM", value: "Arrange with the property manager" },
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

          {/* The brochure carries housekeeping, the lift, the WiFi, the
              alarm, the house rules and everything operational. It is printed
              in the house as well, so this button is the whole handover. */}
          <Reveal delayMs={160} as="div" className="mt-10 border-t border-line pt-8">
            <a
              href={BROCHURE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-between gap-6 border border-ink px-8 py-6 text-ink transition-colors hover:bg-ink hover:text-paper sm:w-auto"
            >
              <span>
                <span className="text-display-m block">Read the welcome brochure</span>
                <span className="text-body mt-1 block opacity-80">
                  Housekeeping, the lift, WiFi, the alarm and the house rules.
                </span>
              </span>
              <ArrowRight className="h-6 w-6 shrink-0" aria-hidden="true" />
            </a>
            <p className="text-body text-ink/70 mt-4 max-w-2xl">
              Late check-out is subject to availability and additional cost,
              arranged in advance.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
