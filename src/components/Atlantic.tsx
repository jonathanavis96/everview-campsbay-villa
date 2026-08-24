// The ocean, as a divider.
//
// The plan used to orient itself with an arrow and the words "Atlantic, this
// way" pointing off the left-hand edge. Jonathan's reading of the house puts
// the water below the terrace and the planted roof, not beside them, so the
// arrow is gone and the sea is drawn where it belongs: under the section, in
// the place the skyline divider held.
//
// The waves are the same ink-on-paper line as the plan and the ridgeline —
// no fill, no gradient, no blue. They drift sideways slowly and forever,
// which is the one thing a drawn sea can do that a photograph of one cannot.
// Motion is always on for this site; there is deliberately no
// prefers-reduced-motion branch, as in `Ridgeline`.

/** One tile of the wave, wide enough that two of them cover any screen. */
const TILE = 600;
const HEIGHT = 56;

/**
 * A sine drawn as a path, sampled every 10 units — fine enough at this
 * amplitude that no curve fitting is needed.
 *
 * `periods` is rounded to a whole number on purpose: the strip is two tiles
 * wide and slides exactly one tile, so the sine has to come back to the same
 * value one tile along or the loop jumps every time it restarts.
 */
function wave(y: number, amplitude: number, periods: number, phase: number) {
  const period = TILE / Math.max(1, Math.round(periods));
  const points: string[] = [];
  for (let x = 0; x <= TILE * 2; x += 10) {
    const value = y + Math.sin((x / period) * Math.PI * 2 + phase) * amplitude;
    points.push(`${x === 0 ? "M" : "L"}${x},${value.toFixed(2)}`);
  }
  return points.join(" ");
}

/**
 * The swells, back to front: the far one is shallow, slow and faint; the near
 * one is deeper, quicker and darker. Three is enough to read as water and few
 * enough to stay a drawing.
 */
const SWELLS = [
  { d: wave(16, 6, 3, 0), opacity: 0.28, seconds: 34, width: 1 },
  { d: wave(29, 9, 2, 1.1), opacity: 0.45, seconds: 26, width: 1.1 },
  { d: wave(40, 10, 1, 2.4), opacity: 0.72, seconds: 19, width: 1.3 },
];

export default function AtlanticBand({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <p className="text-label text-stone-text mb-3 text-center">Atlantic Ocean</p>
      {/* The strip is twice as wide as the tile and slides one tile left, so
          the loop closes on itself and never snaps back visibly.

          On a phone it breaks out of the container's 1.5rem gutter and runs
          edge to edge — Jonathan's call, and the right one: an ocean that
          stops short of the screen reads as a diagram of an ocean. On desktop
          it keeps the page's margin like everything else. */}
      <div className="-mx-6 overflow-hidden md:mx-0">
        <svg
          viewBox={`0 0 ${TILE} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="ev-atlantic block h-[58px] w-full text-ink md:h-[74px]"
          role="presentation"
          focusable="false"
        >
          {SWELLS.map((swell) => (
            <path
              key={swell.d}
              d={swell.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={swell.width}
              opacity={swell.opacity}
              vectorEffect="non-scaling-stroke"
              className="ev-swell"
              style={{ animationDuration: `${swell.seconds}s` }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
