// The floor plans, redrawn.
//
// The source is a set of TurboScan photographs of Thomas Geh Architect's
// working drawings for House Avis, Erf 2522, 14 Cramond Road (job 415, rev B,
// ground floor drawing 100wd and first floor 101wd). Those scans are rotated
// ninety degrees, carry a title block, dimension strings, window schedules
// and demolition notes, and are unreadable on a phone. Nothing is served from
// them — they are traced here into the same hairline register as the
// ridgeline and the power/water diagrams, so a guest reads a plan rather than
// a builder's drawing.
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
// Geometry is schematic and orthogonal: proportions and adjacency are true to
// the drawing, the angles are not. It is a plan to understand the house by,
// not to build from — which is what the section says underneath it.
//
// Motion is always on for this site — no prefers-reduced-motion branch.
import { useState } from "react";
import Reveal from "@/components/Reveal";

type Room = {
  /** The name used elsewhere on this site. */
  name: string;
  /** The architect's label, where it differs from `name`. */
  planName?: string;
  /** Square metres as printed on the drawing. */
  area?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Outdoor spaces are drawn as a dashed outline rather than a room. */
  outdoor?: boolean;
  /** Service spaces (lift, stair, corridor) sit back in the hierarchy. */
  service?: boolean;
};

type Floor = {
  id: string;
  /** The tab label. */
  label: string;
  /** One line under the tabs. */
  intro: string;
  rooms: Room[];
};

// ── Living level ── ground floor working drawing 100wd ────────────────────
// The ocean is off the left-hand edge, past Terrace 1 and the pool below it.
const LIVING: Room[] = [
  { name: "The terrace", planName: "Terrace 1", area: 48, x: 24, y: 34, w: 112, h: 150, outdoor: true },
  { name: "Terrace 2", area: 56, x: 148, y: 362, w: 280, h: 58, outdoor: true },

  { name: "Scullery", area: 11, x: 148, y: 34, w: 92, h: 46 },
  { name: "Indoor dining", planName: "Dining room", area: 26, x: 148, y: 88, w: 128, h: 82 },
  { name: "The kitchen", planName: "Kitchen", area: 16, x: 148, y: 178, w: 128, h: 62 },
  { name: "Formal living room", planName: "Living room", area: 23, x: 148, y: 248, w: 128, h: 106 },

  { name: "Wine cellar & TV room", planName: "TV room", area: 28, x: 284, y: 88, w: 130, h: 92 },
  { name: "The bar", planName: "Bar", area: 11, x: 284, y: 188, w: 74, h: 58 },
  { name: "Stair", x: 366, y: 188, w: 48, h: 58, service: true },
  { name: "Formal lounge", area: 44, x: 284, y: 254, w: 130, h: 100 },

  { name: "The garden", planName: "Garden", x: 422, y: 34, w: 154, h: 46, outdoor: true },
  { name: "Ground Floor King", planName: "Guest room", area: 27, x: 422, y: 88, w: 154, h: 100 },
  { name: "Entrance", area: 23, x: 422, y: 196, w: 154, h: 62 },
  { name: "Lift", x: 500, y: 266, w: 76, h: 52, service: true },
  { name: "Planted roof", area: 58, x: 436, y: 362, w: 140, h: 58, outdoor: true },
];

// ── Bedroom level ── first floor working drawing 101wd ────────────────────
const BEDROOMS: Room[] = [
  { name: "Bath 1", area: 18, x: 24, y: 34, w: 118, h: 84 },
  { name: "Closet", area: 3, x: 150, y: 74, w: 62, h: 44 },
  { name: "Master Suite", planName: "Bedroom 1", area: 29, x: 24, y: 126, w: 118, h: 116 },
  { name: "Patio", area: 22, x: 24, y: 250, w: 118, h: 100, outdoor: true },

  { name: "Bath 2", area: 8, x: 150, y: 126, w: 84, h: 92 },
  { name: "Ocean King", planName: "Bedroom 2", area: 22, x: 150, y: 226, w: 138, h: 124 },
  { name: "Balcony", area: 8, x: 168, y: 358, w: 138, h: 44, outdoor: true },

  { name: "The study", planName: "Study", area: 29, x: 242, y: 34, w: 172, h: 84 },
  { name: "Open to below", planName: "Stair", area: 6, x: 296, y: 126, w: 84, h: 78, service: true },
  { name: "Pool room", planName: "Study 2", area: 20, x: 296, y: 250, w: 118, h: 100 },

  { name: "Bath 3", area: 10, x: 422, y: 34, w: 74, h: 84 },
  { name: "Dressing room", planName: "Dressing 4", area: 8, x: 504, y: 34, w: 72, h: 84 },
  { name: "Bath 4", area: 4, x: 422, y: 126, w: 56, h: 56 },
  { name: "Garden King", planName: "Bedroom 4", area: 12, x: 486, y: 126, w: 90, h: 116 },
  { name: "Corridor", area: 15, x: 422, y: 190, w: 56, h: 52, service: true },
  { name: "Lift", x: 486, y: 250, w: 90, h: 60, service: true },
];

const FLOORS: Floor[] = [
  {
    id: "living",
    label: "Living level",
    intro:
      "Kitchen, dining, lounge and the terrace, all facing the same way. The ground-floor bedroom and the entrance sit behind them, off the street.",
    rooms: LIVING,
  },
  {
    id: "bedrooms",
    label: "Bedroom level",
    intro:
      "Three bedrooms upstairs, each with its own bathroom, and the study and pool room sharing the landing between them.",
    rooms: BEDROOMS,
  },
];

const VIEW_W = 600;
const VIEW_H = 440;
/** Headroom above the plan for the "Atlantic, this way" marker. */
const VIEW_TOP = -14;

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
