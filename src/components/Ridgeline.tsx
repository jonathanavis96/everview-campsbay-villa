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
 * A section divider: one unbroken hairline that runs in from the left, over
 * the Table Mountain table, and out to the right.
 *
 * It is drawn as three paths sharing endpoints rather than one, because the
 * three stretches animate at different speeds: the flats draw inwards from
 * the page edges in 320ms, then the mountain draws left to right over 600ms.
 * Visually it is a single line — the seams sit exactly on the baseline.
 *
 * `from`/`to` are kept in the signature so callers do not all have to change
 * at once; they are no longer used to pick a stretch of path.
 */
export const RIDGE_GLYPH_WIDTH = 132;
export const RIDGE_GLYPH_HEIGHT = 26;
/** The table itself, lifted out of RIDGELINE_PATH_D and normalised so both
 *  ends sit exactly on the baseline — the rule runs into the mountain and
 *  out the other side as one unbroken line. */
export const RIDGE_GLYPH_PATH_D =
  "M0.0,26.0 L4.8,25.2 L13.0,20.1 L17.9,11.9 L28.0,6.4 L31.4,0.0 L39.6,0.9 L42.2,4.3 L44.9,1.7 L52.4,0.0 L101.8,1.7 L103.6,6.0 L112.2,9.8 L115.2,16.3 L117.8,17.5 L124.5,24.4 L132.0,26.0";

export function RidgelineDivider({ className = "" }: { from?: number; to?: number; className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(el);
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
    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, []);

  const height = RIDGE_GLYPH_HEIGHT + 8;
  const baseline = height - 4;
  const glyphX = Math.max(0, (width - RIDGE_GLYPH_WIDTH) / 2);
  const glyphEnd = glyphX + RIDGE_GLYPH_WIDTH;
  const ready = width > 0;

  // pathLength=1 makes every segment animate on the same 0..1 scale whatever
  // its real length, so the two flats keep the same speed as the viewport
  // changes width. The flats draw inwards from the outer edges (fast), then
  // the mountain draws left to right over 0.6s.
  const flat = (drawn: boolean, reverse: boolean) => ({
    strokeDasharray: 1,
    strokeDashoffset: drawn ? 0 : reverse ? -1 : 1,
    transition: "stroke-dashoffset 320ms cubic-bezier(0.4, 0, 0.2, 1)",
  });

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      {ready && (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
          <g fill="none" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round">
            <path
              stroke="#DAD8D2"
              pathLength={1}
              d={`M0,${baseline} L${glyphX},${baseline}`}
              style={flat(inView, false)}
            />
            <path
              stroke="#8C857A"
              pathLength={1}
              d={RIDGE_GLYPH_PATH_D}
              transform={`translate(${glyphX}, 4)`}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: inView ? 0 : 1,
                transition: "stroke-dashoffset 600ms cubic-bezier(0.33, 0, 0.15, 1) 300ms",
              }}
            />
            <path
              stroke="#DAD8D2"
              pathLength={1}
              d={`M${glyphEnd},${baseline} L${width},${baseline}`}
              style={flat(inView, true)}
            />
          </g>
        </svg>
      )}
    </div>
  );
}
