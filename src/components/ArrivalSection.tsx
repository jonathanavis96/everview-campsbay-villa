// design-direction §6.10 — "Arrival and the house rules". Facts sourced from
// public/brochures/Everview-Welcome-Brochure-v3.pdf (recovered via `git show
// baaedbe:public/brochures/Everview-Welcome-Brochure-v3.pdf | pdftotext - -`
// after MIS-457 removed the file from the working tree) — never republished
// here. The WiFi network/password, the Ajax app, per-mode sensor behaviour,
// emergency contact numbers and the street address are deliberately excluded;
// "monitored 24/7 by ADT Security, with armed response" is the only alarm
// fact carried over, verbatim and with nothing added. See MIS-457/MIS-458.
//
// A well-run house, not a list of restrictions: housekeeping, the lift,
// monitoring and off-grid power lead in body type. The house rules sit
// underneath in the quieter mono/data register, not the source PDF's
// shouting caps.
import Reveal from "@/components/Reveal";

const ARRIVAL_TIMES = [
  { label: "Check-in", value: "2:00 PM – 7:00 PM" },
  { label: "Check-out", value: "By 10:00 AM" },
];

const HOUSE_RULES = [
  "No pets.",
  "No smoking anywhere on the property.",
  "No parties or events — small gatherings by prior arrangement with the property manager.",
  "No unauthorised guests outside the booking group without prior arrangement.",
  "No commercial filming or photography.",
  "Damages reported to the property manager immediately.",
];

export default function ArrivalSection() {
  return (
    <section id="arrival" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">Arrival</p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 border-t border-line pt-8 md:pt-12">
          <Reveal>
            <h2 className="text-display-l text-ink mb-4">A well-run house</h2>
            <p className="text-body text-ink/80 mb-6">
              Housekeeping comes daily, with laundry provided and available on
              request. The lift carries up to six people between the
              basement and the upper level, and keeps running through
              load-shedding on days the battery bank has had sun to charge.
              The property is monitored 24/7 by ADT Security, with armed
              response, and by day the house runs largely on its own solar
              power.
            </p>
            <dl className="text-data text-stone-text space-y-1">
              {ARRIVAL_TIMES.map((a) => (
                <div key={a.label} className="flex gap-2">
                  <dt className="w-24 shrink-0">{a.label}</dt>
                  <dd>{a.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-caption text-stone-text mt-3">
              Arriving after 7:00 PM: arrange a time with the property
              manager in advance. Late check-out is subject to availability
              and additional cost, arranged in advance.
            </p>
          </Reveal>

          <Reveal delayMs={100}>
            <h3 className="text-display-m text-ink mb-4">House rules</h3>
            <ul className="text-data text-stone-text space-y-2">
              {HOUSE_RULES.map((rule) => (
                <li
                  key={rule}
                  className="border-t border-line pt-2 first:border-t-0 first:pt-0"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
