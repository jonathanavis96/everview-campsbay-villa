import { useEffect, useRef, useState } from "react";

/**
 * One accurate ridgeline path — Lion's Head, the saddle, the Kloof Corner
 * shoulder, and the Twelve Apostles buttresses descending toward Oudekraal —
 * traced from a reference photograph taken from Camps Bay beach looking
 * east-north-east (Wikimedia Commons: "Camps Bay – Cape Town suburbs, beach,
 * Lion's Head, Twelve Apostles.jpg", verified against the overlay test in
 * design-direction §5). viewBox is 2400 units wide; left-to-right traversal
 * of this one path is both the wordmark rule and every section divider, so
 * scrolling the page traverses the skyline north to south.
 */
export const RIDGE_VIEWBOX_WIDTH = 2400;
export const RIDGE_VIEWBOX_HEIGHT = 300;
export const RIDGELINE_PATH_D =
  "M0,288 L125,262 L269,219 L350,170 L469,219 L500,219 L594,188 L688,144 L781,112 L875,94 L925,94 L969,106 L1019,97 L1062,119 L1094,147 L1125,112 L1156,153 L1188,122 L1219,156 L1250,125 L1319,156 L1356,128 L1394,162 L1431,141 L1469,150 L1512,131 L1556,162 L1600,141 L1650,169 L1700,150 L1750,181 L1794,200 L1875,216 L1969,228 L2094,241 L2219,250 L2400,258";

/** Leftmost ~15% of the path — the Lion's Head end, used under the wordmark. */
const WORDMARK_WIDTH = 360;

function useDrawOnce(active: boolean, durationMs: number) {
  const pathRef = useRef<SVGPathElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = pathRef.current;
    if (!el || !active) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    // Force layout before animating so the initial state paints first.
    el.getBoundingClientRect();
    el.style.transition = `stroke-dashoffset ${durationMs}ms ease-out`;
    requestAnimationFrame(() => {
      el.style.strokeDashoffset = "0";
    });
    setReady(true);
  }, [active, durationMs]);

  return { pathRef, ready };
}

/** The wordmark rule: sits under "Everview" as its underline, not behind it. */
export function RidgelineMark({ className = "" }: { className?: string }) {
  const { pathRef } = useDrawOnce(true, 900);

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 100 ${WORDMARK_WIDTH} 220`}
      preserveAspectRatio="none"
      className={className}
    >
      <path
        ref={pathRef}
        d={RIDGELINE_PATH_D}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A section divider: the next segment of the same path, so position on the
 * ridge tells the reader where they are on the page. Draws once on scroll-in.
 * `from`/`to` are path-space x coordinates (0–2400); pick the next
 * unclaimed range left to right as sections are added.
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
  const { pathRef } = useDrawOnce(inView, 600);

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

  const minY = 60;
  const maxY = RIDGE_VIEWBOX_HEIGHT;

  return (
    <div ref={wrapperRef} className={className}>
      <svg
        aria-hidden="true"
        viewBox={`${from} ${minY} ${to - from} ${maxY - minY}`}
        preserveAspectRatio="none"
        className="w-full h-10 text-stone"
      >
        <path
          ref={pathRef}
          d={RIDGELINE_PATH_D}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
