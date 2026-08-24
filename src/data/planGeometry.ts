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
//
// The door rule is a default, not a verdict. A `WallOpening` in the floor's
// `openings` list overrides it for one pair of rooms — closing a door the
// derivation invented, opening a wall it kept, or turning either into a
// slider — and the plan editor writes those by clicking the wall.
import {
  isExterior,
  VIEW_H,
  VIEW_W,
  type Floor,
  type Room,
  type Side,
  type WallOpening,
} from "@/data/floorPlan";

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
  kind: "door" | "slider" | "open" | "window";
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

/**
 * One stretch of wall shared by two indoor rooms, with what goes in it.
 *
 * Every such stretch is listed, closed ones included, because the plan editor
 * needs something to click on to open them. `explicit` marks the ones an
 * author decided rather than the derivation.
 */
export type Segment = {
  a: string;
  /** The room on the far side, or "" where that side is the outside. */
  b: string;
  /** Exterior walls only: which side of `a`, and which run along it. */
  side?: Side;
  stretch?: number;
  axis: "v" | "h";
  at: number;
  /** The full shared stretch, before the opening is centred in it. */
  lo: number;
  hi: number;
  kind: "wall" | "window" | "door" | "slider" | "open";
  explicit: boolean;
  /** The opening itself, within [lo, hi]. */
  from: number;
  to: number;
  into: 1 | -1;
};

const pairKey = (a: string, b: string, axis: string) => [a, b].sort().join("\u0000") + "\u0000" + axis;

/**
 * Every shared wall on a floor, resolved to what is drawn in it.
 *
 * Pairs of rooms sharing a long enough wall are *candidates*, not doors:
 * taking them all gave a bathroom four doors, one to each neighbour it
 * happened to touch (Jonathan, 2026-08-24). A room gets as many doors as its
 * use allows — one for a bathroom or a closet, more for circulation — and the
 * widest shared walls win, since that is where a door actually goes. A room
 * with candidates always keeps at least one, so nothing reads as unreachable.
 *
 * An explicit `WallOpening` skips all of that for its pair: it is drawn as
 * written, and it counts against the neighbours' door budget so the
 * derivation fills in around it rather than fighting it.
 */
export function sharedWalls(floor: Floor): Segment[] {
  const indoor = floor.rooms.filter(isIndoor);
  const specs = new Map<string, Extract<WallOpening, { between: unknown }>>();
  for (const o of floor.openings ?? []) {
    if (isExterior(o)) continue;
    specs.set(pairKey(o.between[0], o.between[1], o.axis ?? "*"), o);
  }
  const specFor = (a: string, b: string, axis: "v" | "h") =>
    specs.get(pairKey(a, b, axis)) ?? specs.get(pairKey(a, b, "*"));

  type Candidate = {
    a: Room;
    b: Room;
    axis: "v" | "h";
    at: number;
    lo: number;
    hi: number;
    depth: number;
    /** The room on the far side of the wall in the positive direction. */
    positive: Room;
    into: 1 | -1;
    spec?: Extract<WallOpening, { between: unknown }>;
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
        const spec = specFor(a.name, b.name, "v");
        // A wall short of the minimum is still listed when someone asked for
        // an opening in it. They can see the plan; the threshold is a guess.
        // A wall of no length is not: two rooms meeting at a corner share a
        // point, and an authored entry there would put a door on nothing.
        if (hi - lo >= MIN_DOOR_SPAN || (spec && hi - lo > TOL)) {
          // The leaf opens into the larger room, which is the one with space.
          const left = a.x < b.x ? a : b;
          const right = left === a ? b : a;
          candidates.push({
            a, b, axis: "v", at: meetsV, lo, hi,
            depth: Math.min(a.w, b.w),
            positive: right,
            into: area(right) >= area(left) ? 1 : -1,
            spec,
          });
        }
      }
      if (meetsH !== null) {
        const lo = Math.max(a.x, b.x);
        const hi = Math.min(a.x + a.w, b.x + b.w);
        const spec = specFor(a.name, b.name, "h");
        if (hi - lo >= MIN_DOOR_SPAN || (spec && hi - lo > TOL)) {
          const top = a.y < b.y ? a : b;
          const bottom = top === a ? b : a;
          candidates.push({
            a, b, axis: "h", at: meetsH, lo, hi,
            depth: Math.min(a.h, b.h),
            positive: bottom,
            into: area(bottom) >= area(top) ? 1 : -1,
            spec,
          });
        }
      }
    }
  }

  const doors = new Map<Room, number>();
  const taken = new Set<Candidate>();
  const accept = (c: Candidate) => {
    taken.add(c);
    doors.set(c.a, (doors.get(c.a) ?? 0) + 1);
    doors.set(c.b, (doors.get(c.b) ?? 0) + 1);
  };

  // Authored openings are settled first and count towards both rooms, so the
  // derivation below sees a bathroom that already has its one door.
  const derived: Candidate[] = [];
  for (const c of candidates) {
    if (!c.spec) derived.push(c);
    else if (c.spec.kind !== "wall") accept(c);
  }

  // Through rooms first, then the widest shared wall. A door belongs on the
  // wall two rooms actually share most of rather than the corner they clip —
  // but a stretch of wall shared with a bathroom is the last place to put
  // one, however wide it is, or the master bedroom ends up entered through
  // the en-suite.
  const rank = (c: Candidate) => (doorLimit(c.a) === 1 ? 1 : 0) + (doorLimit(c.b) === 1 ? 1 : 0);
  derived.sort((p, q) => rank(p) - rank(q) || q.hi - q.lo - (p.hi - p.lo));

  for (const c of derived) {
    if ((doors.get(c.a) ?? 0) >= doorLimit(c.a) || (doors.get(c.b) ?? 0) >= doorLimit(c.b)) continue;
    accept(c);
  }
  // A room the caps shut out entirely still needs its way in, and may take a
  // neighbour one door over its limit to get it — but never a bathroom or a
  // closet, which have their one door already and are not a way through.
  for (const room of indoor) {
    if (!walkable(room) || (doors.get(room) ?? 0) > 0) continue;
    const best = derived.find((c) => {
      if (taken.has(c) || (c.a !== room && c.b !== room)) return false;
      const other = c.a === room ? c.b : c.a;
      return doorLimit(other) > 1;
    });
    if (best) accept(best);
  }
  // Last resort: a room whose only neighbour is a bathroom or a closet takes
  // that door anyway. An en-suite reached through the dressing room is how
  // this house is actually arranged, and a room with no door at all reads as
  // a mistake in the drawing. A wall someone closed by hand stays closed.
  for (const room of indoor) {
    if (!walkable(room) || (doors.get(room) ?? 0) > 0) continue;
    const best = derived.find((c) => !taken.has(c) && (c.a === room || c.b === room));
    if (best) accept(best);
  }

  return candidates.map((c) => {
    const kind: Segment["kind"] = c.spec ? c.spec.kind : taken.has(c) ? "door" : "wall";
    const stretch = c.hi - c.lo;
    const want = c.spec?.span ?? doorWidth([c.lo, c.hi], c.depth);
    const width = Math.max(TOL, Math.min(want, Math.max(stretch - 2 * TOL, TOL)));
    const centre = c.lo + stretch * (c.spec?.at ?? 0.5);
    const from = Math.min(Math.max(centre - width / 2, c.lo), c.hi - width);
    const into: 1 | -1 = c.spec?.into
      ? c.spec.into === c.positive.name
        ? 1
        : -1
      : c.into;
    return {
      a: c.a.name,
      b: c.b.name,
      axis: c.axis,
      at: c.at,
      lo: c.lo,
      hi: c.hi,
      kind,
      explicit: Boolean(c.spec),
      from,
      to: from + width,
      into,
    };
  });
}

/** The key an exterior opening is filed under. */
const outerKey = (room: string, side: Side, stretch: number) =>
  [room, side, stretch].join("\u0000");

const SIDES: Side[] = ["l", "r", "t", "b"];

/**
 * Every stretch of wall on a floor that faces no indoor room — the street,
 * the garden, a terrace — resolved to what is drawn in it.
 *
 * The derivation puts one window in the longest stretch of each side, which
 * is where a room's window goes when nobody has said otherwise. An authored
 * `ExteriorOpening` replaces that for one stretch, and can put a door or a
 * slider there instead: this house opens onto its terraces, and a stacking
 * door is not a window.
 */
export function outerWalls(floor: Floor): Segment[] {
  const rooms = floor.rooms;
  const specs = new Map<string, Extract<WallOpening, { room: string }>>();
  for (const o of floor.openings ?? []) {
    if (isExterior(o)) specs.set(outerKey(o.room, o.side, o.stretch ?? 0), o);
  }

  const out: Segment[] = [];
  for (const room of rooms.filter(isIndoor)) {
    if (!walkable(room)) continue;
    for (const side of SIDES) {
      // Sorted, because `stretch` counts along the wall and the subtraction
      // that produced these does not promise an order.
      const spans = outwardSpans(room, rooms, side).sort((p, q) => p[0] - q[0]);
      let longest = -1;
      spans.forEach((span, i) => {
        if (longest === -1 || span[1] - span[0] > spans[longest][1] - spans[longest][0]) longest = i;
      });

      spans.forEach((span, i) => {
        const spec = specs.get(outerKey(room.name, side, i));
        const length = span[1] - span[0];
        const derived = i === longest && length >= MIN_WINDOW_SPAN ? "window" : "wall";
        const kind: Segment["kind"] = spec ? spec.kind : derived;

        const want = spec?.span ?? Math.min(MAX_WINDOW, length * 0.6);
        const width = Math.max(TOL, Math.min(want, Math.max(length - 2 * TOL, TOL)));
        const centre = span[0] + length * (spec?.at ?? 0.5);
        const from = Math.min(Math.max(centre - width / 2, span[0]), span[1] - width);

        // A leaf swings into the room unless someone asked for it to swing
        // out, which is what a door onto a narrow terrace actually does.
        const inward: 1 | -1 = side === "l" || side === "t" ? 1 : -1;
        const at =
          side === "l" ? room.x : side === "r" ? room.x + room.w : side === "t" ? room.y : room.y + room.h;

        out.push({
          a: room.name,
          b: "",
          side,
          stretch: i,
          axis: side === "l" || side === "r" ? "v" : "h",
          at,
          lo: span[0],
          hi: span[1],
          kind,
          explicit: Boolean(spec),
          from,
          to: from + width,
          into: spec?.into === "outside" ? ((inward * -1) as 1 | -1) : inward,
        });
      });
    }
  }
  return out;
}

/** Every wall on a floor that something could go in, inside and out. */
export function wallSegments(floor: Floor): Segment[] {
  return [...sharedWalls(floor), ...outerWalls(floor)];
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

  for (const seg of sharedWalls(floor)) {
    if (seg.kind === "wall") continue;
    openings.push({
      kind: seg.kind,
      axis: seg.axis,
      at: seg.at,
      from: seg.from,
      to: seg.to,
      into: seg.into,
    });
  }

  for (const seg of outerWalls(floor)) {
    if (seg.kind === "wall") continue;
    openings.push({
      kind: seg.kind,
      axis: seg.axis,
      at: seg.at,
      from: seg.from,
      to: seg.to,
      into: seg.into,
    });
  }

  return { walls, openings };
}

/**
 * The tightest box that holds everything drawn on a floor.
 *
 * The plan's coordinate space is 600x440 for both floors, but neither floor
 * fills it: the living level stops well short on the left of the terrace and
 * on the right of the guest bath, and the bedroom level has a wide margin
 * beside the patio. Drawn in the full box, that emptiness is dead width —
 * and on a phone it is the difference between a plan that fits the screen
 * and one that has to be scrolled. So each floor is drawn in its own box.
 *
 * Walls sit centred on a room's edge and a door can swing outwards, so the
 * bounds take in half a wall and every swing rather than the rectangles
 * alone.
 */
export function planBounds(floor: Floor, pad = 6) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const grow = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  for (const room of floor.rooms) {
    grow(room.x - WALL / 2, room.y - WALL / 2);
    grow(room.x + room.w + WALL / 2, room.y + room.h + WALL / 2);
  }

  // A leaf and its arc reach one door-width off the wall they hang on.
  for (const o of floorGeometry(floor).openings) {
    if (o.kind !== "door") continue;
    const reach = (o.to - o.from) * (o.into ?? 1);
    if (o.axis === "v") grow(o.at + reach, o.from);
    else grow(o.from, o.at + reach);
  }

  if (!Number.isFinite(minX)) return { x: 0, y: 0, width: VIEW_W, height: VIEW_H };
  return {
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
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
