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
// monitoring and off-grid power lead in body type, and the rules follow
// underneath rather than in the source PDF's shouting caps.
//
// The rules, the check-in times and the late-arrival note were all set in
// 13px mono in stone tint, and Jonathan could not read them (2026-08-24).
// They are body type on ink now: the hierarchy comes from position and from
// the labels beside them, not from shrinking the thing a guest has to read.
import Reveal from "@/components/Reveal";

const ARRIVAL_TIMES = [
  { label: "Check-in", value: "2:00 PM – 7:00 PM" },
  { label: "Check-out", value: "By 10:00 AM" },
];

// The WiFi password and the alarm codes are on the printed card in the house
// and nowhere else — not on this page, not in the brochure. A document that
// can be emailed or screenshotted is a document a network password should
// never be in (Jonathan, 2026-08-24).
const IN_THE_HOUSE = [
  {
    heading: "WiFi",
    body: "Fibre throughout, and it stays up through load-shedding. The network name and password are on the printed card in the house, beside the welcome brochure — they are deliberately not published anywhere that leaves the property.",
  },
  {
    heading: "Alarm and security",
    body: "The property is monitored 24/7 by ADT Security, with armed response. The alarm codes and the arming steps are on that same printed card, and the property manager walks you through them on arrival.",
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
              By day the house runs largely on its own solar power.
            </p>
            <dl className="space-y-2">
              {ARRIVAL_TIMES.map((a) => (
                <div key={a.label} className="flex items-baseline gap-3">
                  <dt className="text-label text-stone-text w-24 shrink-0">{a.label}</dt>
                  <dd className="text-body text-ink/80">{a.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 space-y-4">
              {IN_THE_HOUSE.map((item) => (
                <div key={item.heading}>
                  <h3 className="text-label text-stone-text mb-1">{item.heading}</h3>
                  <p className="text-body text-ink/80">{item.body}</p>
                </div>
              ))}
              <p className="text-body text-ink/80">
                The full welcome brochure — power, water, the lift, local
                numbers — is{" "}
                <a
                  href={`${import.meta.env.BASE_URL}brochures/welcome-brochure.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
                >
                  readable here
                </a>{" "}
                and a printed copy waits in the house.
              </p>
            </div>

            <p className="text-body text-ink/80 mt-4">
              Arriving after 7:00 PM: arrange a time with the property
              manager in advance. Late check-out is subject to availability
              and additional cost, arranged in advance.
            </p>
          </Reveal>

          <Reveal delayMs={100}>
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
