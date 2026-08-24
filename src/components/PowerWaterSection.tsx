// design-direction §6.5 — "power and water", the section the site was
// missing entirely. The current nav pill ("Solar powered • No load-shedding")
// is a claim; this is the proof, in the same register as the research finding
// that only one of thirteen comparable sites spells its backup system out.
//
// Two unbackable claims are retired here, not carried forward: "0 Carbon
// Footprint" (untrue of any building) and "Certified eco-friendly" with no
// certifying body named (unverifiable as written). Every number below is
// the pre-rebuild site's own figure, not invented.
//
// --sun is the one accent colour on the page, and this is its only use.
const STATS = [
  { value: "40", unit: "panels", label: "Solar array" },
  { value: "26", unit: "kWh", label: "Battery storage" },
];

export default function PowerWaterSection() {
  return (
    <section id="power-water" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">Power and water</p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 border-t border-line pt-8 md:pt-12">
          <div>
            <h2 className="text-display-l text-ink mb-4">Solar and battery power</h2>
            <p className="text-body text-ink/80 mb-8">
              A 40-panel solar array feeds a 26kWh battery bank, so the lights,
              the entertainment system, the plugs and the lift keep running
              through load-shedding. Air-conditioning and the oven draw on
              grid power when it is available.
            </p>
            <div className="flex gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-display-m" style={{ color: "var(--sun-text)" }}>
                    {s.value}
                    <span className="text-label ml-1">{s.unit}</span>
                  </p>
                  <p className="text-label text-stone-text mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-display-l text-ink mb-4">A private borehole</h2>
            <p className="text-body text-ink/80">
              Water is drawn from a private borehole and purified through
              multi-stage filtration before it reaches a tap — an independent
              supply, not dependent on municipal pressure or restrictions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
