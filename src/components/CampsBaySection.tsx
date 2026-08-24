// design-direction §6.6 — "Camps Bay". Map, drive times, restaurants, three
// or four sentences on the area. Every fact here — the address, the drive
// times, the six restaurant names — is carried over unchanged from the
// pre-rebuild LocationSection, not invented.
//
// The map is the single biggest Lighthouse hazard in this issue if it loads
// eagerly: it does not render until the guest clicks the poster, so an
// embedded Google Maps iframe never sits on the page's critical path.
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import mapPoster from "@/assets/map/camps-bay-map-poster.webp";
import panorama from "@/assets/everview_photos_webp/views/2-view-camps-bay-panorama.webp";

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

// Google's map hosts, warmed up as the panel comes into view.
//
// This is deliberately preconnect and DNS-prefetch only, never a prefetch of
// the embed itself: the embed pulls megabytes of script and tiles, and
// fetching that speculatively is exactly what tanks a Lighthouse score. What
// this buys is the DNS lookup, the TCP handshake and the TLS negotiation to
// three hosts — a few hundred milliseconds of the wait, at a cost of zero
// bytes of payload.
const MAP_ORIGINS = [
  "https://www.google.com",
  "https://maps.gstatic.com",
  "https://fonts.gstatic.com",
];

function warmMapOrigins() {
  for (const href of MAP_ORIGINS) {
    if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "";
    document.head.appendChild(link);
  }
}

function MapPanel() {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLElement | null>(null);

  // Warm the connections once the guest has scrolled the map into reach, so
  // the click has less to wait for.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          warmMapOrigins();
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (loaded) {
    // The poster stays underneath and fades out only once the iframe reports
    // it has loaded, so the panel never goes blank mid-load.
    return (
      <div ref={(el) => { panelRef.current = el; }} className="photo-frame relative w-full overflow-hidden" style={{ paddingTop: "56%" }}>
        <img
          src={mapPoster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />
        <iframe
          src={MAP_EMBED_SRC}
          loading="eager"
          onLoad={() => setReady(true)}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="Map showing Everview's location at 14 Cramond Road, Camps Bay"
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    );
  }

  // A still of the same map stands in until the guest asks for the live one.
  // An embedded Google Maps iframe is the single biggest thing that could sit
  // on this page's critical path, so it is never loaded unasked — but a blank
  // grey box was a poor stand-in for a map, so the poster is the map.
  return (
    <button
      ref={(el) => { panelRef.current = el; }}
      type="button"
      onClick={() => setLoaded(true)}
      className="photo-frame group relative block w-full overflow-hidden text-left"
      aria-label="Load the interactive map"
    >
      <span className="relative block w-full overflow-hidden rounded-[2px]" style={{ paddingTop: "56%" }}>
        <img
          src={mapPoster}
          alt="Map of Camps Bay showing Everview at 14 Cramond Road, above the beach"
          loading="lazy"
          width={1360}
          height={766}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-ink/75 to-transparent px-6 pb-5 pt-12">
          <MapPin className="h-4 w-4 text-paper" aria-hidden="true" />
          <span className="text-label text-paper">
            14 Cramond Road &middot; load the interactive map
          </span>
        </span>
      </span>
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

          <Reveal className="mb-10">
            <figure className="m-0">
              <span className="photo-frame block">
                <img
                  src={panorama}
                  alt="Panorama from Everview looking down the closed end of Cramond Road, with Camps Bay, the beach and the Atlantic beyond and the Twelve Apostles away to the left"
                  loading="lazy"
                  decoding="async"
                  width={2400}
                  height={1039}
                />
              </span>
              <figcaption className="text-body text-ink/70 pt-3">
                Looking down the closed end of Cramond Road from the house: the
                bay, the beach, and the Twelve Apostles away to the left.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <MapPanel />
          </Reveal>

          <Reveal as="div" className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12">
            <div>
              <h3 className="text-display-m text-ink mb-4">Getting around</h3>
              <table className="w-full text-body text-ink/80">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Place</th>
                    <th scope="col">Travel time</th>
                    <th scope="col">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {DISTANCES.map((d) => (
                    <tr key={d.name} className="border-t border-line">
                      <th scope="row" className="py-2 pr-4 text-left font-normal">{d.name}</th>
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
