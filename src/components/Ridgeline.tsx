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
 *
 * The wipe is two translations, not a `clip-path` transition. PageSpeed
 * Insights flagged this element on 2026-09-02 as the page's one
 * non-composited animation — "Unsupported CSS Property: clip-path" — and it
 * runs during the load, which is exactly when a repaint per frame is least
 * affordable. A moving `overflow: hidden` window with the content
 * counter-translated inside it produces the identical wipe out of two
 * transforms, both of which the compositor can run off the main thread.
 */
function useSweep(active: boolean, durationMs: number, delayMs = 0) {
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = requestAnimationFrame(() => setSwept(true));
    return () => cancelAnimationFrame(id);
  }, [active]);

  const transition = `transform ${durationMs}ms cubic-bezier(0.33, 0, 0.15, 1) ${delayMs}ms`;

  return {
    /** The clipping window, which slides in from the left. */
    window: {
      transform: swept ? "translateX(0)" : "translateX(-100%)",
      transition,
    },
    /** The content, held still against the window's travel. */
    content: {
      transform: swept ? "translateX(0)" : "translateX(100%)",
      transition,
    },
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

  // Three layers: the sizing box the caller styles, the window that travels
  // across it, and the drawing held still inside that window.
  //
  // The window is 8px taller than the mark on each side — the old clip-path's
  // -20% vertical inset, in the same spirit — because it must clip
  // horizontally and must not clip the stroke, which sits up to half its
  // width proud of the viewBox. It is absolutely positioned so that extra
  // height costs nothing in layout, and the drawing inside is inset by the
  // same 8px, which puts it back exactly where the caller's box is.
  return (
    <span aria-hidden="true" className={`relative block ${className}`}>
      <span
        className="absolute inset-x-0 -inset-y-2 overflow-hidden will-change-transform"
        style={sweep.window}
      >
        <span
          className="absolute inset-x-0 inset-y-2 will-change-transform"
          style={sweep.content}
        >
          <svg
            viewBox={`0 20 ${RIDGE_VIEWBOX_WIDTH} 370`}
            preserveAspectRatio="none"
            className="block h-full w-full overflow-visible"
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
        </span>
      </span>
    </span>
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
 * three stretches animate in sequence and at different speeds — see
 * DIVIDER_SPEED below for the timing and how to change it. The right-hand
 * line cannot appear before the mountain it comes out of, and nothing starts
 * until the divider is actually in the guest's view.
 *
 * `from`/`to` are kept in the signature so callers do not all have to change
 * at once; they are no longer used to pick a stretch of path.
 */
const GLYPH_WIDTH_FRACTION = 0.17;

/* ── The divider's timing ───────────────────────────────────────────────────
 *
 * Two dials, and nothing else needs touching. Every duration and every delay
 * is derived from them, so the three stretches stay one continuous streak
 * whatever they are set to.
 *
 *   DIVIDER_SPEED   the whole thing. 1 is the reference drawing — 0.4s in,
 *                   1s over the skyline, 0.4s out, 1.8s in all. 2 is twice as
 *                   fast, 3 three times, 0.5 half.
 *   SKYLINE_SPEED   the middle, on top of DIVIDER_SPEED. 1 leaves the skyline
 *                   at its reference second; 3 draws it three times faster
 *                   again while the flats keep whatever DIVIDER_SPEED gave
 *                   them.
 *
 * So "twice as fast overall, and the middle three times faster than that" is
 * DIVIDER_SPEED = 2, SKYLINE_SPEED = 3.
 */
export const DIVIDER_SPEED = 2;
export const SKYLINE_SPEED = 1;

/** The reference drawing, at DIVIDER_SPEED = SKYLINE_SPEED = 1. */
const FLAT_REFERENCE_MS = 400;
const SKYLINE_REFERENCE_MS = 1000;

const FLAT_MS = FLAT_REFERENCE_MS / DIVIDER_SPEED;
const SKYLINE_MS = SKYLINE_REFERENCE_MS / (DIVIDER_SPEED * SKYLINE_SPEED);
/** Each stretch begins on the frame the one before it ends. */
const SKYLINE_DELAY_MS = FLAT_MS;
const RIGHT_FLAT_DELAY_MS = FLAT_MS + SKYLINE_MS;
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
              style={draw(FLAT_MS, 0)}
            />
            {/* No `vector-effect: non-scaling-stroke` here, and this is not a
                style choice. With it, Chrome resolves the dash pattern in
                screen space while `pathLength` normalises the path in user
                space, and the two disagree so completely that the whole
                skyline renders as drawn on the first frame of its transition
                and then sits still for the remaining ~990ms — the line
                "draws to the right side of the mountain, stops, then the
                other line draws" (Jonathan, 2026-08-24). Measured: pen at
                791px from t=500ms through t=1395ms while the dash offset ran
                0.9 to 0.005. The hairline is kept by dividing the stroke
                width by the glyph's scale instead, which leaves the dash
                pattern in the user space `pathLength` normalises. */}
            <path
              pathLength={1}
              d={RIDGELINE_PATH_D_LEVEL}
              transform={glyphTransform}
              strokeWidth={1 / scale}
              style={draw(SKYLINE_MS, SKYLINE_DELAY_MS)}
            />
            <path
              pathLength={1}
              d={`M${glyphEnd},${baseline} L${width},${baseline}`}
              style={draw(FLAT_MS, RIGHT_FLAT_DELAY_MS)}
            />
          </g>
        </svg>
      )}
    </div>
  );
}
