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
// What is dropped: wall thicknesses, dimension strings, window and door
// schedules, levels, and every construction note.
//
// Rooms carry the names used on the rest of this site, not the architect's
// 2013 labels, so that a guest reading "Ocean King" upstairs finds the same
// room here. Where the two differ the drawing's own label follows in
// `planName` and is shown in the detail line.
//
// Motion is always on for this site — no prefers-reduced-motion branch.
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { FLOORS, VIEW_H, VIEW_TOP, VIEW_W, type Floor, type Room } from "@/data/floorPlan";

/** Rooms narrower or shorter than this get their label outside the shape. */
const LABEL_MIN_W = 62;
const LABEL_MIN_H = 44;

function RoomShape({
  room,
  active,
  onEnter,
}: {
  room: Room;
  active: boolean;
  onEnter: (room: Room | null) => void;
}) {
  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2;
  const roomy = room.w >= LABEL_MIN_W && room.h >= LABEL_MIN_H;

  return (
    <g
      className="ev-room"
      data-active={active ? "true" : undefined}
      onMouseEnter={() => onEnter(room)}
      onMouseLeave={() => onEnter(null)}
      onFocus={() => onEnter(room)}
      onBlur={() => onEnter(null)}
      tabIndex={0}
      role="button"
      aria-label={
        room.area ? `${room.name}, ${room.area} square metres` : room.name
      }
    >
      <rect
        x={room.x}
        y={room.y}
        width={room.w}
        height={room.h}
        rx="1.5"
        fill="var(--paper)"
        stroke="currentColor"
        strokeWidth={room.outdoor ? 1 : 1.4}
        strokeDasharray={room.outdoor ? "4 3" : undefined}
        opacity={room.service ? 0.45 : 1}
      />
      <rect
        className="ev-room-wash"
        x={room.x}
        y={room.y}
        width={room.w}
        height={room.h}
        rx="1.5"
        fill="var(--sun)"
      />
      {roomy && (
        <>
          <text
            x={cx}
            y={room.area ? cy - 3 : cy + 3}
            textAnchor="middle"
            className="ev-room-name"
          >
            {room.name}
          </text>
          {room.area && (
            <text x={cx} y={cy + 11} textAnchor="middle" className="ev-room-area">
              {room.area} m²
            </text>
          )}
        </>
      )}
      {!roomy && (
        <text x={cx} y={cy + 3} textAnchor="middle" className="ev-room-area">
          {room.name}
        </text>
      )}
    </g>
  );
}

function FloorPlan({ floor }: { floor: Floor }) {
  const [hovered, setHovered] = useState<Room | null>(null);

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

        {floor.rooms.map((room) => (
          <RoomShape
            key={room.name}
            room={room}
            active={hovered?.name === room.name}
            onEnter={setHovered}
          />
        ))}
      </svg>
      </div>

      {/* One live line under the plan, so a tap on a phone says something. */}
      <p className="text-body text-ink/70 mt-3 min-h-[1.6em]" aria-live="polite">
        {hovered ? (
          <>
            <span className="text-ink">{hovered.name}</span>
            {hovered.area ? ` · ${hovered.area} m²` : ""}
            {hovered.planName ? ` · “${hovered.planName}” on the architect's drawing` : ""}
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
