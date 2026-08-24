// design-direction §6.6 — "Camps Bay". Map, drive times, restaurants, three
// or four sentences on the area. Every fact here — the address, the drive
// times, the six restaurant names — is carried over unchanged from the
// pre-rebuild LocationSection, not invented.
//
// The map is the single biggest Lighthouse hazard in this issue if it loads
// eagerly: it does not render until the guest clicks the poster, so an
// embedded Google Maps iframe never sits on the page's critical path.
import { useState } from "react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d361.5336953869003!2d18.3857876684248!3d-33.952026148004215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f120!3m3!1m2!1s0x1dcc67added5d659%3A0x6777a5740e47b06d!2s14%20Cramond%20Rd%2C%20Camps%20Bay%2C%20Cape%20Town%2C%208040!5e0!3m2!1sen!2sza!4v1756208341188!5m2!1sen!2sza";

const DISTANCES = [
  { name: "Camps Bay Beach", time: "5–8 min walk", distance: "0.5 km" },
  { name: "Table Mountain cable car", time: "10–15 min drive", distance: "6 km" },
  { name: "V&A Waterfront", time: "15–30 min drive", distance: "10 km" },
  { name: "Cape Town International", time: "25–30 min drive", distance: "23 km" },
];

const RESTAURANTS = [
  "Codfather Seafood & Sushi",
  "The Roundhouse Restaurant",
  "Azure Restaurant",
  "Camps Bay Retreat",
  "The Hussar Grill Camps Bay",
  "Paranga Restaurant",
];

function MapPanel() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="relative w-full overflow-hidden rounded-sm" style={{ paddingTop: "56%" }}>
        <iframe
          src={MAP_EMBED_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="Map showing Everview's location at 14 Cramond Road, Camps Bay"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="relative w-full overflow-hidden rounded-sm border border-line bg-line/20 text-left"
      style={{ paddingTop: "56%" }}
      aria-label="Load the map"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-label text-stone-text">14 Cramond Road, Camps Bay</p>
        <p className="text-body text-ink underline underline-offset-4">Load map</p>
      </div>
    </button>
  );
}

export default function CampsBaySection() {
  return (
    <section id="camps-bay" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">Camps Bay</p>

        <div className="border-t border-line pt-8 md:pt-12">
          <p className="text-body text-ink/80 max-w-2xl mb-8">
            Everview sits on Cramond Road, at the quiet, closed end of a
            cul-de-sac above Camps Bay's beach. The village's restaurants and
            the Atlantic Seaboard's landmarks are all close, without the
            noise of being on top of them.
          </p>

          <MapPanel />

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12">
            <div>
              <h3 className="text-display-m text-ink mb-4">Getting around</h3>
              <table className="w-full text-body text-ink/80">
                <tbody>
                  {DISTANCES.map((d) => (
                    <tr key={d.name} className="border-t border-line">
                      <td className="py-2 pr-4">{d.name}</td>
                      <td className="py-2 pr-4 text-stone-text whitespace-nowrap">{d.time}</td>
                      <td className="py-2 text-stone-text whitespace-nowrap text-right">{d.distance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-display-m text-ink mb-4">Restaurants nearby</h3>
              <ul className="text-body text-ink/80 space-y-2">
                {RESTAURANTS.map((r) => (
                  <li key={r} className="border-t border-line pt-2 first:border-t-0 first:pt-0">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
