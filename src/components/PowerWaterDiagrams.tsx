import { useEffect, useRef, useState } from "react";

/**
 * Two line drawings for the power and water section — the solar array
 * charging the battery, and the borehole feeding the tap. They are drawn in
 * the same hairline register as the rest of the page rather than as
 * illustrations, and they run continuously once scrolled into view so the
 * two columns of the section carry equal weight.
 *
 * Everything here is CSS/SVG only: no library, no raster asset, a few
 * hundred bytes each in the bundle.
 *
 * Motion is always on for this site — no prefers-reduced-motion branch.
 */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

const INK = "currentColor";

/** Sun → panels → battery → house. */
export function SolarDiagram({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 320 168"
        className={`w-full h-auto text-ink ${inView ? "is-live" : ""}`}
        role="img"
        aria-label="A solar array charging a battery bank, which powers the house"
      >
        {/* Sun */}
        <g className="ev-sun" style={{ color: "var(--sun-text)" }}>
          <circle cx="42" cy="44" r="12" fill="none" stroke={INK} strokeWidth="1.25" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={42 + Math.cos(rad) * 17}
                y1={44 + Math.sin(rad) * 17}
                x2={42 + Math.cos(rad) * 23}
                y2={44 + Math.sin(rad) * 23}
                stroke={INK}
                strokeWidth="1.25"
                strokeLinecap="round"
                className="ev-ray"
                style={{ animationDelay: `${i * 140}ms` }}
              />
            );
          })}
        </g>

        {/* Panels, on a slope, standing on the ground line */}
        <g stroke={INK} strokeWidth="1.25" fill="none">
          <path d="M84 100 L140 80 L172 90 L116 110 Z" strokeLinejoin="round" />
          <path d="M103 93 L135 103" />
          <path d="M122 86 L154 96" />
          <path d="M116 110 L116 132 M158 96 L158 132" strokeLinecap="round" />
        </g>

        {/* Panels to battery */}
        <path
          className="ev-flow"
          d="M172 96 C 186 96, 190 100, 202 100"
          fill="none"
          stroke="var(--sun-text)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Battery */}
        <g stroke={INK} strokeWidth="1.25" fill="none">
          <rect x="202" y="76" width="40" height="56" rx="3" />
          <path d="M212 76 L212 70 M232 76 L232 70" strokeLinecap="round" />
        </g>
        <rect
          className="ev-charge"
          x="205"
          y="79"
          width="34"
          height="50"
          rx="2"
          fill="var(--sun-text)"
          opacity="0.22"
        />

        {/* Battery to house */}
        <path
          className="ev-flow ev-flow-delayed"
          d="M242 104 L262 104"
          fill="none"
          stroke="var(--sun-text)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* House */}
        <g stroke={INK} strokeWidth="1.25" fill="none">
          <path d="M262 104 L286 86 L310 104" strokeLinejoin="round" />
          <path d="M268 100 L268 132 M304 100 L304 132" />
          <path d="M280 132 L280 116 L292 116 L292 132" />
        </g>

        {/* Ground */}
        <line x1="24" y1="132" x2="308" y2="132" stroke="var(--line)" strokeWidth="1.25" />
      </svg>
    </div>
  );
}

/**
 * Borehole → filtration → tap.
 *
 * The water is one continuous thing. A droplet enters at the water table,
 * climbs the bore, turns the corner, runs the full length of the riser
 * *through* all three filter bodies and reaches the tap — one element on one
 * path, using SVG motion along that path, so it never fades out at the top of
 * the bore and never reappears a metre further along the top line, which is
 * what the two separate animations used to do (Jonathan, 2026-08-24).
 *
 * From the tap's spout a second droplet falls slowly into a glass that is
 * already part full, and splashes on the surface. Everything that moves is on
 * the water blue; nothing that moves is on ink.
 */
export function BoreholeDiagram({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const WATER = "var(--water)";

  // The one path the water takes: up out of the water table, along the riser,
  // through every filter body, to the back of the tap.
  const SUPPLY_PATH = "M72 146 L72 52 L254 52";

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 320 168"
        className={`w-full h-auto text-ink ${inView ? "is-live" : ""}`}
        role="img"
        aria-label="Water rising from a private borehole through three filtration stages to a tap, filling a glass"
      >
        {/* Ground line and hatching */}
        <line x1="24" y1="76" x2="308" y2="76" stroke={INK} strokeWidth="1.25" />
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={28 + i * 21}
            y1="76"
            x2={21 + i * 21}
            y2="84"
            stroke="var(--line)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        ))}

        {/* The bore */}
        <g stroke={INK} strokeWidth="1.25" fill="none">
          <path d="M60 76 L60 152" />
          <path d="M84 76 L84 152" />
        </g>

        {/* Water table */}
        <path
          className="ev-wave"
          d="M34 142 q 11 -6 22 0 t 22 0 t 22 0"
          fill="none"
          stroke={WATER}
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* The riser, in ink, with the supply drawn over it in water blue */}
        <path
          d="M72 76 L72 52 L254 52"
          fill="none"
          stroke={INK}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="ev-flow"
          d={SUPPLY_PATH}
          fill="none"
          stroke={WATER}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* Three droplets on that one path, evenly spaced along the cycle */}
        {[0, 1, 2].map((i) => (
          <circle key={i} r="2.6" fill={WATER} className="ev-carried">
            <animateMotion
              dur="6s"
              begin={inView ? `${i * 2}s` : "indefinite"}
              repeatCount="indefinite"
              path={SUPPLY_PATH}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
        ))}

        {/* Three filtration stages, threaded on the riser */}
        {[0, 1, 2].map((i) => (
          <g key={i} fill="none">
            <rect
              x={170 + i * 30}
              y="38"
              width="24"
              height="28"
              rx="2"
              stroke={INK}
              strokeWidth="1.25"
            />
            <path
              className="ev-stage"
              d={`M${175 + i * 30} 52 h 14`}
              stroke={WATER}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ animationDelay: `${i * 400}ms` }}
            />
          </g>
        ))}

        {/* Tap */}
        <g stroke={INK} strokeWidth="1.25" fill="none" strokeLinejoin="round">
          <path d="M254 52 L282 52 L282 78" strokeLinecap="round" />
          <path d="M274 52 L274 42 L290 42" strokeLinecap="round" />
        </g>

        {/* Glass, already part full */}
        <path
          d="M269.6 126 L294.4 126 L293 144 L271 144 Z"
          fill={WATER}
          opacity="0.28"
        />
        <path
          d="M266 116 L298 116 L293 144 L271 144 Z"
          fill="none"
          stroke={INK}
          strokeWidth="1.25"
          strokeLinejoin="round"
          opacity="0.55"
        />

        {/* The drop: leaves the spout and falls to the surface at y=126 */}
        {[0, 1].map((i) => (
          <ellipse
            key={i}
            className="ev-drop"
            cx="282"
            cy="80"
            rx="2.4"
            ry="3.2"
            fill={WATER}
            style={{ animationDelay: `${i * 1900}ms` }}
          />
        ))}

        {/* The splash, timed to the moment the drop lands */}
        {[0, 1].map((i) => (
          <g key={i} className="ev-splash" style={{ animationDelay: `${i * 1900 + 1750}ms` }}>
            <path d="M275 126 q 3 -6 5 -1" fill="none" stroke={WATER} strokeWidth="1.25" strokeLinecap="round" />
            <path d="M289 126 q -3 -6 -5 -1" fill="none" stroke={WATER} strokeWidth="1.25" strokeLinecap="round" />
            <path d="M273 126 q 9 5 18 0" fill="none" stroke={WATER} strokeWidth="1" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </div>
  );
}
