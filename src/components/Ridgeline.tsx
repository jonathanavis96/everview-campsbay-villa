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
 * the Table Mountain skyline, and out to the right.
 *
 * The glyph is the *same path as the wordmark* in the top left of every view
 * — Devil's Peak, the table, Kloof Nek and Lion's Head — not a table-only
 * simplification, and it is sized at 17% of the divider's width, the
 * proportion in Jonathan's reference image.
 *
 * It is drawn as three paths sharing endpoints rather than one, because the
 * three stretches animate in sequence and at different speeds: the left flat
 * draws in 0.4s, then the skyline over 1s, then the right flat in 0.4s — so
 * the right-hand line cannot appear before the mountain it comes out of.
 * Nothing starts until the divider is actually in the guest's view.
 *
 * `from`/`to` are kept in the signature so callers do not all have to change
 * at once; they are no longer used to pick a stretch of path.
 */
const GLYPH_WIDTH_FRACTION = 0.17;
/**
 * The wordmark path with its right-hand end pulled the last four units down
 * onto the same y as its left-hand end. Without it the skyline finishes at
 * y=368 and the rule that leaves it sits at y=372, which reads as a four-unit
 * step — a visible gap — where the two meet.
 */
const RIDGELINE_PATH_D_LEVEL = RIDGELINE_PATH_D.replace(/L2400,368$/, "L2400,372");
/** The wordmark path, with both ends pulled onto one baseline so the rule
 *  runs into it and out the other side without a step. */
const RIDGE_BASELINE = 372;
const RIDGE_TOP = 40;

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
      // The divider is a few pixels tall, so "half of it" is meaningless as a
      // trigger; what matters is that it is inside the viewport proper, which
      // is what a zero root margin and any intersection at all give us.
      { threshold: 0 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, []);

  const glyphWidth = Math.max(96, width * GLYPH_WIDTH_FRACTION);
  const scale = glyphWidth / RIDGE_VIEWBOX_WIDTH;
  const glyphHeight = (RIDGE_BASELINE - RIDGE_TOP) * scale;
  const height = Math.ceil(glyphHeight) + 6;
  const baseline = height - 3;
  const glyphX = Math.max(0, (width - glyphWidth) / 2);
  const glyphEnd = glyphX + glyphWidth;
  const ready = width > 0;

  // The wordmark path, translated and scaled so its two end points land on
  // the rule's baseline.
  const glyphTransform = `translate(${glyphX}, ${baseline - RIDGE_BASELINE * scale}) scale(${scale})`;

  // pathLength=1 puts every segment on the same 0..1 scale whatever its real
  // length, so the flats keep their timing as the viewport changes width.
  const draw = (durationMs: number, delayMs: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: inView ? 0 : 1,
    transition: `stroke-dashoffset ${durationMs}ms linear ${delayMs}ms`,
  });

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      {ready && (
        <svg
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="block w-full text-stone"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              pathLength={1}
              d={`M0,${baseline} L${glyphX},${baseline}`}
              style={draw(400, 0)}
            />
            <path
              pathLength={1}
              d={RIDGELINE_PATH_D_LEVEL}
              transform={glyphTransform}
              vectorEffect="non-scaling-stroke"
              style={draw(1000, 400)}
            />
            <path
              pathLength={1}
              d={`M${glyphEnd},${baseline} L${width},${baseline}`}
              style={draw(400, 1400)}
            />
          </g>
        </svg>
      )}
    </div>
  );
}
