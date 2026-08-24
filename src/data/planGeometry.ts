// Architectural conventions, derived from the schematic room rectangles.
//
// `floorPlan.ts` holds rooms as plain rectangles, because that is what a
// person can edit at /plan-editor without a CAD package. An architect's plan
// is not rectangles: it is poché — walls with thickness — with door swings
// and window gaps drawn into them, and treads on the stairs.
//
// Everything here is computed from the rectangles rather than authored, so
// the drawing follows the data. Move a room in the editor and its doors,
// windows and shared walls move with it; nothing has to be redrawn by hand.
//
// The rules, in the order they are applied:
//
//   · A wall runs along every side of every indoor room, centred on the line,
//     so two rooms that abut share one wall of full thickness.
//   · Where two indoor rooms meet along a long enough stretch, that stretch
//     gets a door: a gap in the wall, a leaf, and a quarter-circle swing into
//     the larger of the two rooms.
//   · A stretch of wall with no indoor room on the far side faces out, and a
//     long enough stretch of it gets a window: a gap with two glazing lines.
//     A terrace counts as outside, which is why the seaward rooms glaze.
//   · Outdoor rooms carry no wall at all — they keep the dashed outline.
import type { Floor, Room } from "@/data/floorPlan";

/** Poché thickness, in plan units. */
export const WALL = 3.6;
/** Rooms within this of each other count as touching. */
const TOL = 3;
const MIN_DOOR_SPAN = 30;
const DOOR_W = 22;
const MIN_WINDOW_SPAN = 34;
const MAX_WINDOW = 58;

type Span = [number, number];

export type Opening = {
  kind: "door" | "window";
  /** The wall's own direction: "v" is a vertical wall, drawn at x = `at`. */
  axis: "v" | "h";
  at: number;
  from: number;
  to: number;
  /** Which way the leaf opens; doors only. */
  into?: 1 | -1;
};

export type FloorGeometry = {
  walls: { axis: "v" | "h"; at: number; from: number; to: number }[];
  openings: Opening[];
};

const isIndoor = (room: Room) => !room.outdoor;
const area = (room: Room) => room.w * room.h;
/** The lift is a shaft, not a room you walk between. */
const walkable = (room: Room) => !/^lift/i.test(room.name);

function subtract(spans: Span[], cut: Span): Span[] {
  const out: Span[] = [];
  for (const [a, b] of spans) {
    if (cut[1] <= a || cut[0] >= b) {
      out.push([a, b]);
      continue;
    }
    if (cut[0] > a) out.push([a, cut[0]]);
    if (cut[1] < b) out.push([cut[1], b]);
  }
  return out.filter(([a, b]) => b - a > TOL);
}

/** A leaf cannot swing further than the shallower of the two rooms it serves. */
function doorWidth(span: Span, depth: number): number {
  return Math.min(DOOR_W, (span[1] - span[0]) * 0.6, depth * 0.45);
}

function centred(span: Span, width: number): Span {
  const mid = (span[0] + span[1]) / 2;
  const half = Math.min(width, span[1] - span[0] - 2 * TOL) / 2;
  return [mid - half, mid + half];
}

/** The stretches of one side of a room with no indoor room on the far side. */
function outwardSpans(room: Room, rooms: Room[], side: "l" | "r" | "t" | "b"): Span[] {
  const vertical = side === "l" || side === "r";
  const at = side === "l" ? room.x : side === "r" ? room.x + room.w : side === "t" ? room.y : room.y + room.h;
  let spans: Span[] = [vertical ? [room.y, room.y + room.h] : [room.x, room.x + room.w]];

  for (const other of rooms) {
    if (other === room || !isIndoor(other)) continue;
    // Does `other` reach across the line this side sits on?
    const lo = vertical ? other.x : other.y;
    const hi = lo + (vertical ? other.w : other.h);
    if (at < lo - TOL || at > hi + TOL) continue;
    const a = vertical ? other.y : other.x;
    spans = subtract(spans, [a, a + (vertical ? other.h : other.w)]);
  }
  return spans;
}

export function floorGeometry(floor: Floor): FloorGeometry {
  const rooms = floor.rooms;
  const indoor = rooms.filter(isIndoor);
  const walls: FloorGeometry["walls"] = [];
  const openings: Opening[] = [];

  for (const room of indoor) {
    walls.push(
      { axis: "v", at: room.x, from: room.y, to: room.y + room.h },
      { axis: "v", at: room.x + room.w, from: room.y, to: room.y + room.h },
      { axis: "h", at: room.y, from: room.x, to: room.x + room.w },
      { axis: "h", at: room.y + room.h, from: room.x, to: room.x + room.w }
    );
  }

  // Doors, one per pair of rooms that share a long enough wall.
  for (let i = 0; i < indoor.length; i += 1) {
    for (let j = i + 1; j < indoor.length; j += 1) {
      const a = indoor[i];
      const b = indoor[j];
      if (!walkable(a) || !walkable(b)) continue;

      const meetsV =
        Math.abs(a.x + a.w - b.x) <= TOL ? a.x + a.w : Math.abs(b.x + b.w - a.x) <= TOL ? b.x + b.w : null;
      const meetsH =
        Math.abs(a.y + a.h - b.y) <= TOL ? a.y + a.h : Math.abs(b.y + b.h - a.y) <= TOL ? b.y + b.h : null;

      if (meetsV !== null) {
        const lo = Math.max(a.y, b.y);
        const hi = Math.min(a.y + a.h, b.y + b.h);
        if (hi - lo < MIN_DOOR_SPAN) continue;
        const [from, to] = centred([lo, hi], doorWidth([lo, hi], Math.min(a.w, b.w)));
        // Into the larger room, which is the one with space for the leaf.
        const left = a.x < b.x ? a : b;
        const right = left === a ? b : a;
        openings.push({ kind: "door", axis: "v", at: meetsV, from, to, into: area(right) >= area(left) ? 1 : -1 });
      } else if (meetsH !== null) {
        const lo = Math.max(a.x, b.x);
        const hi = Math.min(a.x + a.w, b.x + b.w);
        if (hi - lo < MIN_DOOR_SPAN) continue;
        const [from, to] = centred([lo, hi], doorWidth([lo, hi], Math.min(a.h, b.h)));
        const top = a.y < b.y ? a : b;
        const bottom = top === a ? b : a;
        openings.push({ kind: "door", axis: "h", at: meetsH, from, to, into: area(bottom) >= area(top) ? 1 : -1 });
      }
    }
  }

  // Windows, one in the longest outward stretch of each side.
  for (const room of indoor) {
    if (!walkable(room)) continue;
    for (const side of ["l", "r", "t", "b"] as const) {
      const spans = outwardSpans(room, rooms, side);
      const longest = spans.reduce<Span | null>((best, s) => (!best || s[1] - s[0] > best[1] - best[0] ? s : best), null);
      if (!longest || longest[1] - longest[0] < MIN_WINDOW_SPAN) continue;
      const width = Math.min(MAX_WINDOW, (longest[1] - longest[0]) * 0.6);
      const [from, to] = centred(longest, width);
      const at =
        side === "l" ? room.x : side === "r" ? room.x + room.w : side === "t" ? room.y : room.y + room.h;
      openings.push({ kind: "window", axis: side === "l" || side === "r" ? "v" : "h", at, from, to });
    }
  }

  return { walls, openings };
}

/** The quarter-circle swing and leaf for one door. */
export function doorPath(o: Opening): { leaf: string; arc: string } {
  const d = o.to - o.from;
  const dir = o.into ?? 1;
  if (o.axis === "v") {
    const hy = o.from;
    const tipX = o.at + d * dir;
    return {
      leaf: `M${o.at},${hy} L${tipX},${hy}`,
      arc: `M${o.at},${o.to} A${d},${d} 0 0 ${dir === 1 ? 0 : 1} ${tipX},${hy}`,
    };
  }
  const hx = o.from;
  const tipY = o.at + d * dir;
  return {
    leaf: `M${hx},${o.at} L${hx},${tipY}`,
    arc: `M${o.to},${o.at} A${d},${d} 0 0 ${dir === 1 ? 1 : 0} ${hx},${tipY}`,
  };
}

/** Treads across the long axis of a stair, and the lift's shaft cross. */
export function fixture(room: Room): { treads: string[]; shaft: string[] } | null {
  if (/^lift/i.test(room.name)) {
    return {
      treads: [],
      shaft: [
        `M${room.x},${room.y} L${room.x + room.w},${room.y + room.h}`,
        `M${room.x + room.w},${room.y} L${room.x},${room.y + room.h}`,
      ],
    };
  }
  const stair = /stair|open to below/i.test(`${room.name} ${room.planName ?? ""}`);
  if (!stair) return null;

  const along = room.w >= room.h ? "x" : "y";
  const length = along === "x" ? room.w : room.h;
  const count = Math.max(4, Math.min(11, Math.round(length / 13)));
  const step = length / count;
  const treads: string[] = [];
  for (let i = 1; i < count; i += 1) {
    const at = (along === "x" ? room.x : room.y) + i * step;
    treads.push(
      along === "x"
        ? `M${at},${room.y} L${at},${room.y + room.h}`
        : `M${room.x},${at} L${room.x + room.w},${at}`
    );
  }
  return { treads, shaft: [] };
}
