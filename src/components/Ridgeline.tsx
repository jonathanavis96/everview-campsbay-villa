import { useEffect, useRef, useState } from "react";

/**
 * The Table Mountain skyline as seen from Camps Bay: the Devil's Peak
 * shoulder on the left, the flat table, Kloof Nek, then Lion's Head as the
 * sharp peak on the right. Traced pixel by pixel from the outline Jonathan
 * supplied (topmost dark pixel per column, simplified with
 * Ramer-Douglas-Peucker at a 1.5px tolerance), so the line is his drawing
 * rather than an approximation of it.
 */
export const RIDGE_VIEWBOX_WIDTH = 2400;
export const RIDGE_VIEWBOX_HEIGHT = 400;
export const RIDGELINE_PATH_D =
  "M0,372 L66,349 L156,341 L207,314 L270,306 L317,278 L367,271 L453,224 L504,149 L610,99 L645,40 L731,48 L758,79 L786,56 L864,40 L1380,56 L1399,95 L1489,130 L1521,189 L1548,200 L1618,263 L1696,278 L1755,302 L1802,294 L1864,259 L1911,220 L1966,153 L1978,153 L2009,204 L2033,220 L2232,298 L2326,361 L2400,368";

/**
 * Sweeps an element on from left to right by uncovering it.
 *
 * Motion is always on for this site: there is deliberately no
 * prefers-reduced-motion branch.
 */
function useSweep(active: boolean, durationMs: number, delayMs = 0) {
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = requestAnimationFrame(() => setSwept(true));
    return () => cancelAnimationFrame(id);
  }, [active]);

  return {
    clipPath: swept ? "inset(-20% 0 -20% 0)" : "inset(-20% 100% -20% 0)",
    transition: `clip-path ${durationMs}ms cubic-bezier(0.33, 0, 0.15, 1) ${delayMs}ms`,
  } as const;
}

/**
 * The wordmark: the whole mountain arching over "Everview", swept on at page
 * load. It sits above the word rather than behind it, so the type never has
 * to compete with the line.
 */
export function RidgelineMark({
  className = "",
  strokeWidth = 9,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  const sweep = useSweep(true, 1500, 200);

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 20 ${RIDGE_VIEWBOX_WIDTH} 370`}
      preserveAspectRatio="none"
      className={className}
      style={sweep}
    >
      <path
        d={RIDGELINE_PATH_D}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * A section divider: a hairline rule with a small Table Mountain glyph set
 * on it.
 *
 * This replaces an earlier idea where each divider drew a different stretch
 * of the skyline path across the full width of the page. It was a nice
 * conceit and it looked like a squiggle: stretched to 1350px, a 200-unit
 * slice of a mountain is just a wobbly line with no readable shape. The
 * mountain reads at small size, in one piece, or not at all — so the rule
 * carries the width and the glyph carries the motif.
 *
 * `from`/`to` are kept in the signature so callers do not all have to change
 * at once; they are no longer used to pick a stretch of path.
 */
export function RidgelineDivider({ className = "" }: { from?: number; to?: number; className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <div className="flex items-center gap-5">
        <span
          className="h-px flex-1 bg-line origin-right transition-transform duration-700 ease-out"
          style={{ transform: inView ? "scaleX(1)" : "scaleX(0)" }}
        />
        <svg
          viewBox="0 20 2400 370"
          preserveAspectRatio="xMidYMid meet"
          className="h-4 w-11 shrink-0 text-stone transition-all duration-700 ease-out"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(6px)",
            transitionDelay: "160ms",
          }}
        >
          <path
            d={RIDGELINE_PATH_D}
            fill="none"
            stroke="currentColor"
            strokeWidth={18}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="h-px flex-1 bg-line origin-left transition-transform duration-700 ease-out"
          style={{ transform: inView ? "scaleX(1)" : "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
