// The traced floor plan, as data.
//
// This file is the single source of truth for the plan: `FloorPlanSection`
// draws it, and the plan editor at /plan-editor (dev only) rewrites it. The
// editor's Save writes this whole file from `scripts/serialize-floor-plan.mjs`,
// so the shape below is machine-generated — keep prose in the section
// component or in that serialiser, never here, because anything hand-added
// after the marker is overwritten on the next save.
//
// Geometry is schematic and orthogonal: proportions and adjacency are true to
// Thomas Geh Architect's working drawings for House Avis, Erf 2522 (job 415
// rev B, ground floor 100wd, first floor 101wd); the angles are not. Areas are
// the square metres printed on the drawing. Nothing is served from the scans.

export type Room = {
  /** The name used elsewhere on this site. Unique within a floor. */
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

/** Which side of a room a wall is on. */
export type Side = "l" | "r" | "t" | "b";

/**
 * A hand-authored opening in the wall two rooms share.
 *
 * Doors are derived from the rectangles by default (see `planGeometry.ts`),
 * which is right most of the time and wrong where the house is unusual — a
 * bathroom that happens to touch four rooms, a bar that opens to the lounge
 * with no door in it at all. An entry here overrides the derivation for that
 * pair of rooms: it is the last word, and the plan editor writes them.
 */
export type InteriorOpening = {
  /** The two room names, in either order. */
  between: [string, string];
  /** `wall` closes the opening; `open` is a gap with no leaf in it. */
  kind: "wall" | "door" | "slider" | "open";
  /** Which shared wall, where two rooms touch on both axes. Both, if absent. */
  axis?: "v" | "h";
  /** Centre along the shared stretch, 0–1. Defaults to the middle. */
  at?: number;
  /** Clear width in plan units. Defaults to the derived door width. */
  span?: number;
  /** The room the leaf swings into; doors only. Defaults to the larger room. */
  into?: string;
};

/**
 * The same, for a wall with no indoor room on the other side — the outside,
 * or a terrace, which for drawing purposes is the same thing. One side of a
 * room can have several such stretches where other rooms interrupt it, so
 * `stretch` counts them from the top or the left.
 */
export type ExteriorOpening = {
  room: string;
  side: Side;
  /** Which run of outward-facing wall on that side, counting from 0. */
  stretch?: number;
  kind: "wall" | "window" | "door" | "slider" | "open";
  at?: number;
  span?: number;
  /** `"outside"` swings the leaf out; anything else swings it in. */
  into?: string;
};

export type WallOpening = InteriorOpening | ExteriorOpening;

/** Exterior entries carry a room and a side; interior ones a pair of rooms. */
export const isExterior = (o: WallOpening): o is ExteriorOpening => !("between" in o);

export type Floor = {
  id: string;
  /** The tab label. */
  label: string;
  /** One line under the tabs. */
  intro: string;
  rooms: Room[];
  /** Overrides for the derived doors. Absent means "derive everything". */
  openings?: WallOpening[];
};

/** The plan's own coordinate space. The editor works in these units too. */
export const VIEW_W = 600;
export const VIEW_H = 440;
/** Headroom above the plan for the "Atlantic, this way" marker. */
export const VIEW_TOP = -14;

// ─── generated below this line — the plan editor rewrites it ───────────────

export const FLOORS: Floor[] = [
  {
    id: "living",
    label: "Living level",
    intro:
      "Kitchen, dining and the living room run down the ocean side, with the terrace beyond them. The lounge, the entrance and the ground-floor bedroom sit behind, off the street.",
    rooms: [
      { name: "The terrace", planName: "Terrace 1", area: 48, x: 38, y: 30, w: 101, h: 180, outdoor: true },
      { name: "Scullery", area: 11, x: 142, y: 30, w: 69, h: 53 },
      { name: "Indoor dining", planName: "Dining room", area: 26, x: 142, y: 83, w: 94, h: 115 },
      { name: "The kitchen", planName: "Kitchen", area: 16, x: 142, y: 198, w: 94, h: 76 },
      { name: "Sun Beds", planName: "Living room", area: 23, x: 142, y: 274, w: 98, h: 79 },
      { name: "The garden", planName: "Garden", x: 236, y: 22, w: 285, h: 90, outdoor: true },
      { name: "Wine cellar & TV room", planName: "TV room", area: 28, x: 236, y: 112, w: 130, h: 79 },
      { name: "The bar", planName: "Bar", area: 11, x: 236, y: 191, w: 53, h: 65 },
      { name: "Stair", planName: "Staircase", area: 2, x: 290, y: 191, w: 83, h: 27, service: true },
      { name: "Formal lounge", area: 44, x: 243, y: 256, w: 192, h: 97 },
      { name: "Ground Floor King", planName: "Guest room", area: 27, x: 377, y: 112, w: 126, h: 93 },
      { name: "Entrance", area: 23, x: 435, y: 205, w: 90, h: 69 },
      { name: "Lift", x: 456, y: 290, w: 54, h: 52, service: true },
      { name: "Terrace 2", area: 56, x: 243, y: 353, w: 199, h: 69, outdoor: true },
      { name: "Planted roof", area: 58, x: 449, y: 353, w: 134, h: 73, outdoor: true },
      { name: "The Garden", planName: "Garden", area: 48, x: 38, y: 210, w: 101, h: 180, outdoor: true },
      { name: "Toilet", planName: "Bar", area: 11, x: 290, y: 218, w: 36, h: 38 },
      { name: "Passage", area: 23, x: 326, y: 218, w: 109, h: 38 },
    ],
    openings: [
      { between: ["Indoor dining", "The kitchen"], kind: "open", axis: "h", at: 0.49, span: 82 },
      { between: ["Scullery", "Indoor dining"], kind: "slider", axis: "h", at: 0.81 },
      { between: ["The kitchen", "Sun Beds"], kind: "open", axis: "h", span: 84 },
      { between: ["Entrance", "Passage"], kind: "open", axis: "v", span: 33 },
      { between: ["Toilet", "Passage"], kind: "door", axis: "v", span: 24, into: "Toilet" },
      { between: ["Sun Beds", "Formal lounge"], kind: "door", axis: "v", into: "Sun Beds" },
      { between: ["Ground Floor King", "Entrance"], kind: "door", axis: "h", at: 0.69, span: 40, into: "Ground Floor King" },
      { between: ["Formal lounge", "Passage"], kind: "open", axis: "h", span: 1031 },
      { between: ["The bar", "Formal lounge"], kind: "open", axis: "h", at: 0.42, span: 41 },
      { between: ["Wine cellar & TV room", "The bar"], kind: "slider", axis: "h", at: 0.46, span: 33 },
    ],
  },
  {
    id: "bedrooms",
    label: "Bedroom level",
    intro:
      "The master suite and its bathroom take the ocean corner, with the Ocean King and its balcony below. The study, the pool room and the garden bedroom sit behind, around the landing.",
    rooms: [
      { name: "Bath 1", area: 18, x: 85, y: 47, w: 83, h: 98 },
      { name: "Closet", area: 3, x: 168, y: 75, w: 33, h: 70 },
      { name: "Master Suite", planName: "Bedroom 1", area: 29, x: 83, y: 145, w: 116, h: 171 },
      { name: "Patio", area: 22, x: 70, y: 316, w: 129, h: 124, outdoor: true },
      { name: "The study", planName: "Study", area: 29, x: 201, y: 106, w: 159, h: 100 },
      { name: "Bath 2", area: 8, x: 201, y: 206, w: 76, h: 87 },
      { name: "Ocean King", planName: "Bedroom 2", area: 22, x: 201, y: 293, w: 159, h: 118 },
      { name: "Balcony", area: 8, x: 201, y: 412, w: 146, h: 28, outdoor: true },
      { name: "Staircase", planName: "Staircase", area: 6, x: 277, y: 206, w: 93, h: 61, service: true },
      { name: "Bath 3", area: 10, x: 388, y: 106, w: 48, h: 80 },
      { name: "Dressing room", planName: "Dressing 4", area: 8, x: 436, y: 106, w: 102, h: 54 },
      { name: "Bath 4", area: 4, x: 396, y: 216, w: 40, h: 51 },
      { name: "Pool room", planName: "Study 2", area: 20, x: 360, y: 293, w: 76, h: 131 },
      { name: "Garden King", planName: "Bedroom 4", area: 12, x: 436, y: 160, w: 102, h: 107 },
      { name: "Corridor", area: 15, x: 277, y: 267, w: 248, h: 26, service: true },
      { name: "Lift", x: 458, y: 316, w: 52, h: 56, service: true },
      { name: "Balcony ", area: 8, x: 538, y: 178, w: 40, h: 48, outdoor: true },
      { name: "Corridor ", area: 15, x: 370, y: 186, w: 26, h: 81, service: true },
    ],
    openings: [
      { between: ["Bath 1", "Master Suite"], kind: "open", axis: "h", at: 0, span: 55 },
      { between: ["Master Suite", "The study"], kind: "slider", axis: "v", span: 26, into: "Master Suite" },
      { between: ["Dressing room", "Garden King"], kind: "open", axis: "h", span: 961 },
      { between: ["Bath 3", "Dressing room"], kind: "door", axis: "v", span: 26, into: "Bath 3" },
      { between: ["Garden King", "Corridor"], kind: "door", axis: "h", at: 0.81, span: 31, into: "Garden King" },
      { between: ["Bath 4", "Corridor"], kind: "door", axis: "h", span: 23, into: "Bath 4" },
      { between: ["The study", "Staircase"], kind: "open", axis: "h", at: 0.87, span: 42 },
      { between: ["Bath 2", "Ocean King"], kind: "door", axis: "h", span: 29 },
      { between: ["Ocean King", "Corridor"], kind: "door", axis: "h", at: 0.19, span: 26 },
      { between: ["Staircase", "Corridor"], kind: "open", axis: "h", at: 0.06, span: 29 },
    ],
  },
];
