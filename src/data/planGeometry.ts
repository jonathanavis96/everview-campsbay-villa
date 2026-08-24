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

/**
 * How many doors a room may have.
 *
 * A bathroom has one door. So does a closet, a dressing room and a scullery —
 * a room you go into and come back out of. Circulation is the opposite: a
 * corridor, a stair or a landing exists to be walked through, so it takes as
 * many as it touches. Everything else takes two, which is what a through room
 * in this house actually has.
 */
function doorLimit(room: Room): number {
  const label = `${room.name} ${room.planName ?? ""}`;
  if (/bath|closet|dressing|toilet|wc|pantry|scullery/i.test(label)) return 1;
  if (room.service || /corridor|stair|landing|entrance|hall/i.test(label)) return 4;
  return 2;
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

  // Doors. Every pair of rooms sharing a long enough wall is a *candidate*,
  // not a door: taking them all gave a bathroom four doors, one to each
  // neighbour it happened to touch (Jonathan, 2026-08-24). A room gets as
  // many doors as its use allows — one for a bathroom or a closet, more for
  // circulation — and the widest shared walls win, since that is where a
  // door actually goes. A room with candidates always keeps at least one,
  // so nothing on the plan is drawn as unreachable.
  type Candidate = {
    a: Room;
    b: Room;
    axis: "v" | "h";
    at: number;
    lo: number;
    hi: number;
    depth: number;
    into: 1 | -1;
  };
  const candidates: Candidate[] = [];

  for (let i = 0; i < indoor.length; i += 1) {
    for (let j = i + 1; j < indoor.length; j += 1) {
      const a = indoor[i];
      const b = indoor[j];
      if (!walkable(a) || !walkable(b)) continue;

      const meetsV =
        Math.abs(a.x + a.w - b.x) <= TOL ? a.x + a.w : Math.abs(b.x + b.w - a.x) <= TOL ? b.x + b.w : null;
      const meetsH =
        Math.abs(a.y + a.h - b.y) <= TOL ? a.y + a.h : Math.abs(b.y + b.h - a.y) <= TOL ? b.y + b.h : null;

      // Both axes are tested, not one or the other: two rooms can be within
      // TOL on both at once — the editor lets rooms overlap, it only warns —
      // and an `else if` there would drop a perfectly good door on the second
      // axis whenever the first one's shared stretch came up short.
      if (meetsV !== null) {
        const lo = Math.max(a.y, b.y);
        const hi = Math.min(a.y + a.h, b.y + b.h);
        if (hi - lo >= MIN_DOOR_SPAN) {
          // The leaf opens into the larger room, which is the one with space
          // for it.
          const left = a.x < b.x ? a : b;
          const right = left === a ? b : a;
          candidates.push({
            a, b, axis: "v", at: meetsV, lo, hi,
            depth: Math.min(a.w, b.w),
            into: area(right) >= area(left) ? 1 : -1,
          });
        }
      }
      if (meetsH !== null) {
        const lo = Math.max(a.x, b.x);
        const hi = Math.min(a.x + a.w, b.x + b.w);
        if (hi - lo >= MIN_DOOR_SPAN) {
          const top = a.y < b.y ? a : b;
          const bottom = top === a ? b : a;
          candidates.push({
            a, b, axis: "h", at: meetsH, lo, hi,
            depth: Math.min(a.h, b.h),
            into: area(bottom) >= area(top) ? 1 : -1,
          });
        }
      }
    }
  }

  // Through rooms first, then the widest shared wall. A door belongs on the
  // wall two rooms actually share most of rather than the corner they clip —
  // but a stretch of wall shared with a bathroom is the last place to put
  // one, however wide it is, or the master bedroom ends up entered through
  // the en-suite.
  const rank = (c: Candidate) => (doorLimit(c.a) === 1 ? 1 : 0) + (doorLimit(c.b) === 1 ? 1 : 0);
  candidates.sort((p, q) => rank(p) - rank(q) || q.hi - q.lo - (p.hi - p.lo));

  const doors = new Map<Room, number>();
  const taken = new Set<Candidate>();
  const accept = (c: Candidate) => {
    taken.add(c);
    doors.set(c.a, (doors.get(c.a) ?? 0) + 1);
    doors.set(c.b, (doors.get(c.b) ?? 0) + 1);
  };

  for (const c of candidates) {
    if ((doors.get(c.a) ?? 0) >= doorLimit(c.a) || (doors.get(c.b) ?? 0) >= doorLimit(c.b)) continue;
    accept(c);
  }
  // A room the caps shut out entirely still needs its way in, and may take a
  // neighbour one door over its limit to get it — but never a bathroom or a
  // closet, which have their one door already and are not a way through.
  for (const room of indoor) {
    if (!walkable(room) || (doors.get(room) ?? 0) > 0) continue;
    const best = candidates.find((c) => {
      if (taken.has(c) || (c.a !== room && c.b !== room)) return false;
      const other = c.a === room ? c.b : c.a;
      return doorLimit(other) > 1;
    });
    if (best) accept(best);
  }
  // Last resort: a room whose only neighbour is a bathroom or a closet takes
  // that door anyway. An en-suite reached through the dressing room is how
  // this house is actually arranged, and a room with no door at all reads as
  // a mistake in the drawing.
  for (const room of indoor) {
    if (!walkable(room) || (doors.get(room) ?? 0) > 0) continue;
    const best = candidates.find((c) => !taken.has(c) && (c.a === room || c.b === room));
    if (best) accept(best);
  }

  for (const c of candidates) {
    if (!taken.has(c)) continue;
    const [from, to] = centred([c.lo, c.hi], doorWidth([c.lo, c.hi], c.depth));
    openings.push({ kind: "door", axis: c.axis, at: c.at, from, to, into: c.into });
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
