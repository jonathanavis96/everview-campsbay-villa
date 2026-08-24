// design-direction §14.3 — the rate band, published prominently rather than
// buried: Everview's peak roughly 47% of Icon Villas' "From R96,100.00 Per
// Night" and 75% of Cape Concierge's "From R60,000 Per night", so the rate
// is an argument for Everview, not a risk to hide. ZAR is always the
// primary figure; a converted estimate is secondary, rounded, and only
// shown when the browser's timezone maps to a known currency. See
// src/lib/rates.ts for the no-network detection and rounding rule.
import { useEffect, useState } from "react";
import {
  RATES,
  detectCurrencyCode,
  formatConverted,
  formatZAR,
} from "@/lib/rates";
import Reveal from "@/components/Reveal";

function RateRow({ label, amount, currencyCode }: { label: string; amount: number; currencyCode: string | null }) {
  const converted = currencyCode ? formatConverted(amount, currencyCode) : null;

  return (
    <div>
      <p className="text-label text-stone-text mb-2">{label}</p>
      <p className="text-display-l text-ink">
        {formatZAR(amount)}
        <span className="text-label ml-2">per night</span>
      </p>
      {converted && (
        <p className="text-data text-stone-text mt-2">
          &asymp; {converted} per night
        </p>
      )}
    </div>
  );
}

export default function RateSection() {
  const [currencyCode, setCurrencyCode] = useState<string | null>(null);

  useEffect(() => {
    setCurrencyCode(detectCurrencyCode());
  }, []);

  const { inSeason, outOfSeason } = RATES.seasonal;

  return (
    <section id="rates" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">Rates</p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 border-t border-line pt-8 md:pt-12">
          <Reveal>
            <RateRow label="In season" amount={inSeason} currencyCode={currencyCode} />
          </Reveal>
          <Reveal delayMs={100}>
            <RateRow label="Out of season" amount={outOfSeason} currencyCode={currencyCode} />
          </Reveal>
        </div>

        <Reveal as="p" delayMs={200} className="text-caption text-stone-text mt-8">
          Rates are indicative — final quote on enquiry. FX last updated{" "}
          {RATES.fxUpdated}.
        </Reveal>
      </div>
    </section>
  );
}
