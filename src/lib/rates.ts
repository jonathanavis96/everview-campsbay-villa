// design-direction §14.3 — the rate band. Numbers supplied by Jonathan
// directly: R45,000/night in season, R25,000/night out of season. Static FX
// only (src/content/rates.json) — no geo-IP service and no network request,
// so the Lighthouse score holds, no consent banner is needed, and nothing
// can fail offline. Country is inferred from the browser's own timezone
// (Intl.DateTimeFormat), not from an IP lookup. See MIS-458.
import ratesData from "@/content/rates.json";

type CurrencyEntry = { rate: number; symbol: string };

export type RatesData = {
  fxUpdated: string;
  base: "ZAR";
  seasonal: { inSeason: number; outOfSeason: number };
  currencies: Record<string, CurrencyEntry>;
  timezoneCurrency: Record<string, string>;
};

export const RATES: RatesData = ratesData as RatesData;

/** Browser timezone only — never geo-IP, never a network request. */
export function detectCurrencyCode(): string | null {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return RATES.timezoneCurrency[timeZone] ?? null;
  } catch {
    return null;
  }
}

export function formatZAR(amount: number): string {
  return `R${amount.toLocaleString("en-ZA")}`;
}

/**
 * Converted figures are secondary and always rounded to the nearest 50
 * units of the target currency — an unrounded conversion reads like a
 * quote, and this is explicitly not one.
 */
export function formatConverted(
  amount: number,
  currencyCode: string,
): string | null {
  const currency = RATES.currencies[currencyCode];
  if (!currency) return null;
  const rounded = Math.round((amount * currency.rate) / 50) * 50;
  return `${currency.symbol}${rounded.toLocaleString("en-US")}`;
}
