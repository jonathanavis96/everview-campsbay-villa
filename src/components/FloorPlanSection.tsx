// The floor plans, redrawn.
//
// The geometry lives in `src/data/floorPlan.ts` — shared with the plan editor
// at /plan-editor, which is how it gets adjusted. This file is only the
// drawing of it.
//
// The source is a set of TurboScan photographs of Thomas Geh Architect's
// working drawings for House Avis, Erf 2522, 14 Cramond Road (job 415, rev B,
// ground floor drawing 100wd and first floor 101wd). Those scans are rotated
// ninety degrees, carry a title block, dimension strings, window schedules
// and demolition notes, and are unreadable on a phone. Nothing is served from
// them — they are traced into the same hairline register as the ridgeline and
// the power/water diagrams, so a guest reads a plan rather than a builder's
// drawing.
//
// What is kept from the drawings: which rooms exist, what adjoins what, which
// side the ocean is on, and the areas in square metres printed on each room.
// What is dropped: dimension strings, window and door schedules, levels, and
// every construction note.
//
// It is drawn the way an architect draws: walls have thickness (poché), doors
// are a gap with a swing, windows are a gap with glazing, stairs have treads.
// None of that is in the data — a person editing this plan should not have to
// draw a wall junction — so `planGeometry.ts` derives all of it from the room
// rectangles, and it follows the data when the data moves.
//
// Rooms carry the names used on the rest of this site, not the architect's
// 2013 labels, so that a guest reading "Ocean King" upstairs finds the same
// room here. Where the two differ the drawing's own label follows in
// `planName` and is shown in the detail line.
//
// Motion is always on for this site — no prefers-reduced-motion branch.
import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import { FLOORS, VIEW_H, VIEW_TOP, VIEW_W, type Floor, type Room } from "@/data/floorPlan";
import { WALL, doorPath, fixture, floorGeometry } from "@/data/planGeometry";

/** Rooms narrower or shorter than this get their label outside the shape. */
const LABEL_MIN_W = 62;
const LABEL_MIN_H = 44;

function roomLabel(room: Room) {
  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2;
  const roomy = room.w >= LABEL_MIN_W && room.h >= LABEL_MIN_H;

  return (
    <g key={room.name} className="ev-room-label">
      {roomy ? (
        <>
          <text x={cx} y={room.area ? cy - 3 : cy + 3} textAnchor="middle" className="ev-room-name">
            {room.name}
          </text>
          {room.area && (
            <text x={cx} y={cy + 11} textAnchor="middle" className="ev-room-area">
              {room.area} m²
            </text>
          )}
        </>
      ) : (
        <text x={cx} y={cy + 3} textAnchor="middle" className="ev-room-area">
          {room.name}
        </text>
      )}
    </g>
  );
}

function FloorPlan({ floor }: { floor: Floor }) {
  const [hovered, setHovered] = useState<Room | null>(null);
  const { walls, openings } = useMemo(() => floorGeometry(floor), [floor]);
  // A gap is punched slightly wider than the wall so no sliver of poché is
  // left standing across a door or a window.
  const punch = WALL + 0.8;

  return (
    <div>
      {/* On a phone the plan is wider than the screen: it scrolls sideways
          rather than shrinking its labels to nothing. */}
      <div className="ev-plan-scroll -mx-6 px-6 overflow-x-auto md:mx-0 md:px-0 md:overflow-visible">
      <svg
        viewBox={`0 ${VIEW_TOP} ${VIEW_W} ${VIEW_H - VIEW_TOP}`}
        className="ev-plan w-full h-auto text-ink min-w-[620px]"
        role="img"
        aria-label={`Simplified plan of the ${floor.label.toLowerCase()} at Everview`}
      >
        {/* The ocean side, marked so the plan orients itself without a key. */}
        <g className="ev-plan-edge" opacity="0.6">
          <line x1="10" y1="46" x2="10" y2="420" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="46" x2="16" y2="52" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="46" x2="4" y2="52" stroke="currentColor" strokeWidth="1" />
          <text x="0" y="24" className="ev-room-area" textAnchor="start">
            Atlantic, this way
          </text>
        </g>

        {/* 1 — the floor itself, and the wash under whichever room is live. */}
        <g>
          {floor.rooms.map((room) => (
            <rect
              key={room.name}
              x={room.x}
              y={room.y}
              width={room.w}
              height={room.h}
              fill="var(--paper)"
              opacity={room.outdoor ? 0.6 : 1}
            />
          ))}
          {hovered && (
            <rect
              className="ev-room-wash-live"
              x={hovered.x}
              y={hovered.y}
              width={hovered.w}
              height={hovered.h}
              fill="var(--sun)"
            />
          )}
        </g>

        {/* 2 — outdoor spaces keep the dashed outline: no wall, no roof. */}
        <g fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.65">
          {floor.rooms
            .filter((room) => room.outdoor)
            .map((room) => (
              <rect key={room.name} x={room.x} y={room.y} width={room.w} height={room.h} />
            ))}
        </g>

        {/* 3 — poché. Every wall is centred on its line, so two rooms that
            abut share one wall rather than drawing two. */}
        <g stroke="currentColor" strokeWidth={WALL} strokeLinecap="square">
          {walls.map((w, i) => (
            <line
              key={i}
              x1={w.axis === "v" ? w.at : w.from}
              y1={w.axis === "v" ? w.from : w.at}
              x2={w.axis === "v" ? w.at : w.to}
              y2={w.axis === "v" ? w.to : w.at}
            />
          ))}
        </g>

        {/* 4 — the openings, cut back out of the wall. */}
        <g>
          {openings.map((o, i) => (
            <rect
              key={i}
              x={o.axis === "v" ? o.at - punch / 2 : o.from}
              y={o.axis === "v" ? o.from : o.at - punch / 2}
              width={o.axis === "v" ? punch : o.to - o.from}
              height={o.axis === "v" ? o.to - o.from : punch}
              fill="var(--paper)"
            />
          ))}
        </g>

        {/* 5 — what goes in the openings: glazing lines, leaves and swings. */}
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {openings.map((o, i) => {
            if (o.kind === "window") {
              const offset = WALL / 3;
              return (
                <g key={i}>
                  {[-offset, offset].map((d) => (
                    <line
                      key={d}
                      x1={o.axis === "v" ? o.at + d : o.from}
                      y1={o.axis === "v" ? o.from : o.at + d}
                      x2={o.axis === "v" ? o.at + d : o.to}
                      y2={o.axis === "v" ? o.to : o.at + d}
                    />
                  ))}
                </g>
              );
            }
            // An opening with nothing in it — a cased opening between two
            // rooms — is drawn as the gap alone, which is the convention.
            if (o.kind === "open") return null;
            if (o.kind === "slider") {
              // Two leaves, each half the clear width, offset to either side
              // of the wall's centre line: one panel slides behind the other.
              const mid = (o.from + o.to) / 2;
              const offset = WALL / 3;
              return (
                <g key={i} strokeWidth="1.6">
                  {[
                    [o.from, mid, -offset],
                    [mid, o.to, offset],
                  ].map(([a, b, d]) => (
                    <line
                      key={a}
                      x1={o.axis === "v" ? o.at + d : a}
                      y1={o.axis === "v" ? a : o.at + d}
                      x2={o.axis === "v" ? o.at + d : b}
                      y2={o.axis === "v" ? b : o.at + d}
                    />
                  ))}
                </g>
              );
            }
            const { leaf, arc } = doorPath(o);
            return (
              <g key={i}>
                <path d={leaf} strokeWidth="1.6" />
                <path d={arc} opacity="0.45" />
              </g>
            );
          })}
        </g>

        {/* 6 — stair treads and the lift shaft. */}
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55">
          {floor.rooms.map((room) => {
            const f = fixture(room);
            if (!f) return null;
            return (
              <g key={room.name}>
                {[...f.treads, ...f.shaft].map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
            );
          })}
        </g>

        {/* 7 — labels, then the transparent targets that drive the hover. */}
        <g>{floor.rooms.map(roomLabel)}</g>

        <g>
          {floor.rooms.map((room) => (
            <rect
              key={room.name}
              className="ev-room-hit"
              x={room.x}
              y={room.y}
              width={room.w}
              height={room.h}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={room.area ? `${room.name}, ${room.area} square metres` : room.name}
              onMouseEnter={() => setHovered(room)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(room)}
              onBlur={() => setHovered(null)}
            />
          ))}
        </g>
      </svg>
      </div>

      {/* One live line under the plan, so a tap on a phone says something. */}
      <p className="text-body text-ink/70 mt-3 min-h-[1.6em]" aria-live="polite">
        {hovered ? (
          <>
            <span className="text-ink">{hovered.name}</span>
            {hovered.area ? ` · ${hovered.area} m²` : ""}
            {hovered.planName ? ` · \u201c${hovered.planName}\u201d on the architect's drawing` : ""}
          </>
        ) : (
          "Hover or tap a room."
        )}
      </p>
    </div>
  );
}

export default function FloorPlanSection() {
  const [floorId, setFloorId] = useState(FLOORS[0].id);
  const floor = FLOORS.find((f) => f.id === floorId) ?? FLOORS[0];

  return (
    <section id="plans" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The plan</p>

        <div className="border-t border-line pt-8 md:pt-12">
          <Reveal>
            <h2 className="text-display-l text-ink mb-4">How the house is laid out</h2>

            <div className="flex gap-2 mb-4" role="tablist" aria-label="Floor">
              {FLOORS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={f.id === floorId}
                  onClick={() => setFloorId(f.id)}
                  className={`text-label px-4 py-2 border transition-colors ${
                    f.id === floorId
                      ? "border-ink text-ink"
                      : "border-line text-stone-text hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <p className="text-body text-ink/80 mb-6 max-w-2xl">{floor.intro}</p>
          </Reveal>

          <Reveal>
            <FloorPlan key={floor.id} floor={floor} />
          </Reveal>

          <p className="text-body text-ink/60 mt-6 max-w-2xl">
            Redrawn from the architect's working drawings. Proportions and
            adjoining rooms are true to them; the areas are the ones printed on
            the drawing. It is here to understand the house by, not to build
            from.
          </p>
        </div>
      </div>
    </section>
  );
}
