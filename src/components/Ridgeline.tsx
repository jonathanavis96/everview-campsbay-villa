import { useEffect, useRef, useState } from "react";

/**
 * The Table Mountain skyline as seen from Camps Bay: the Devil's Peak
 * shoulder on the left, the flat table, Kloof Nek, then Lion's Head as the
 * sharp peak on the right. Traced pixel by pixel from the outline Jonathan
 * supplied (topmost dark pixel per column, simplified with
 * Ramer-Douglas-Peucker at a 1.5px tolerance), so the line is his drawing
 * rather than an approximation of it.
 *
 * The viewBox is 2400 units wide. The same path is both the arch above the
 * "Everview" wordmark and every section divider, so scrolling the page
 * traverses the skyline from Devil's Peak down to the sea.
 */
export const RIDGE_VIEWBOX_WIDTH = 2400;
export const RIDGE_VIEWBOX_HEIGHT = 400;
export const RIDGELINE_PATH_D =
  "M0,372 L66,349 L156,341 L207,314 L270,306 L317,278 L367,271 L453,224 L504,149 L610,99 L645,40 L731,48 L758,79 L786,56 L864,40 L1380,56 L1399,95 L1489,130 L1521,189 L1548,200 L1618,263 L1696,278 L1755,302 L1802,294 L1864,259 L1911,220 L1966,153 L1978,153 L2009,204 L2033,220 L2232,298 L2326,361 L2400,368";

/** The path's points, parsed once, for measuring a segment. */
const PATH_POINTS: Array<[number, number]> = RIDGELINE_PATH_D.slice(1)
  .split(" L")
  .map((pair) => {
    const [x, y] = pair.split(",").map(Number);
    return [x, y] as [number, number];
  });

function yAt(x: number): number {
  for (let i = 1; i < PATH_POINTS.length; i += 1) {
    const [x0, y0] = PATH_POINTS[i - 1];
    const [x1, y1] = PATH_POINTS[i];
    if (x >= x0 && x <= x1) {
      const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return PATH_POINTS[PATH_POINTS.length - 1][1];
}

/** Vertical extent of the path between two x coordinates, with breathing room. */
function segmentYRange(from: number, to: number): [number, number] {
  const ys = [yAt(from), yAt(to)];
  for (const [x, y] of PATH_POINTS) {
    if (x > from && x < to) ys.push(y);
  }
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const pad = Math.max(14, (max - min) * 0.28);
  return [min - pad, max + pad];
}

/**
 * Sweeps the line on from left to right by uncovering it, rather than by
 * animating stroke-dashoffset.
 *
 * A dash animation is the obvious way to draw an SVG path on, and it is the
 * wrong one here: these viewBoxes are stretched hard on the x axis
 * (`preserveAspectRatio="none"`), and combined with `vector-effect:
 * non-scaling-stroke` the dash lengths are measured in screen space while
 * `getTotalLength()` returns user units — so a divider drew about a quarter
 * of itself and stopped. Uncovering with clip-path is immune to the scale.
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
 * A section divider: the next stretch of the same skyline, so where you are
 * on the mountain tells you where you are on the page. Sweeps on when it
 * scrolls into view. `from`/`to` are path-space x coordinates (0-2400); take
 * the next unclaimed range, left to right, as sections are added.
 */
export function RidgelineDivider({
  from,
  to,
  className = "",
}: {
  from: number;
  to: number;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const sweep = useSweep(inView, 1100);

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

  // Fit the viewBox to the y-range of *this* stretch, so every divider draws
  // a line with real shape in it, whether its piece of the skyline is the
  // flat table or the drop off Lion's Head.
  const [minY, maxY] = segmentYRange(from, to);

  return (
    <div ref={wrapperRef} className={className}>
      <svg
        aria-hidden="true"
        viewBox={`${from} ${minY} ${to - from} ${maxY - minY}`}
        preserveAspectRatio="none"
        className="w-full h-10 text-stone"
        style={sweep}
      >
        <path
          d={RIDGELINE_PATH_D}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
